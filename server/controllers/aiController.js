import OpenAI from "openai";
import { clerkClient } from "@clerk/express";
import sql from "../configs/db.js";
import dotenv from "dotenv";
import axios from "axios";

import { writeFile } from "fs/promises";

import fs from "fs";

/*const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});*/


dotenv.config();

/* =======================
   GEMINI SETUP (TEXT)
======================= */
const AI = new OpenAI({
  apiKey: process.env.GEMINI_API_KEY,
  baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
});

/* =======================
   GENERATE ARTICLE
======================= */
export const generateArticle = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { prompt, length } = req.body;
    const plan = req.plan;
    const free_usage = req.free_usage;

    if (plan !== "premium" && free_usage >= 10) {
      return res.json({
        success: false,
        message: "Free usage limit reached. Please upgrade to premium.",
      });
    }

    const response = await AI.chat.completions.create({
      model: "gemini-2.5-flash",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: length,
    });

    const content = response.choices[0].message.content;

    await sql`
      INSERT INTO creations (user_id, prompt, content, type)
      VALUES (${userId}, ${prompt}, ${content}, 'article')
    `;

    if (plan !== "premium") {
      await clerkClient.users.updateUserMetadata(userId, {
        privateMetadata: { free_usage: free_usage + 1 },
      });
    }

    res.json({ success: true, content });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

/* =======================
   GENERATE BLOG TITLES
======================= */
export const generateBlogTitles = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { prompt } = req.body;
    const plan = req.plan;
    const free_usage = req.free_usage;

    if (plan !== "premium" && free_usage >= 10) {
      return res.json({
        success: false,
        message: "Free usage limit reached. Please upgrade to premium.",
      });
    }

    const response = await AI.chat.completions.create({
      model: "gemini-2.5-flash",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 10000000,
    });

    const content = response.choices[0].message.content;

    await sql`
      INSERT INTO creations (user_id, prompt, content, type)
      VALUES (${userId}, ${prompt}, ${content}, 'blog-title')
    `;

    if (plan !== "premium") {
      await clerkClient.users.updateUserMetadata(userId, {
        privateMetadata: { free_usage: free_usage + 1 },
      });
    }

    res.json({ success: true, content });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

/* =======================
   GENERATE IMAGE (HUGGING FACE ONLY)
======================= */



export const generateImage = async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ success: false, message: "Prompt required" });
    }

    const form = new FormData();
    form.append("prompt", prompt);

    const response = await fetch("https://clipdrop-api.co/text-to-image/v1", {
      method: "POST",
      headers: {
        "x-api-key": process.env.CLIPDROP_API_KEY,
      },
      body: form,
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`ClipDrop ${response.status}: ${err}`);
    }

    const buffer = Buffer.from(await response.arrayBuffer());
    const base64 = `data:image/png;base64,${buffer.toString("base64")}`;

    return res.json({ success: true, content: base64 });

  } catch (err) {
    console.error("ClipDrop Error:", err.message);
    return res.status(500).json({
      success: false,
      message: "Image generation failed",
      error: err.message,
    });
  }
};






/*
    // Replicate background removal
    const output = await replicate.run(
      "cjwbw/rembg:latest",
      {
        input: {
          image: base64Image,
        },
      }
    );

    // Save to DB
    await sql`
      INSERT INTO creations (user_id, prompt, content, type)
      VALUES (${userId}, 'Background Removed', ${output}, 'bg-remove')
    `;

    // Delete temp upload
    fs.unlinkSync(req.file.path);

    res.json({
      success: true,
      content: output, // transparent PNG URL
    });

  } catch (error) {
    console.error(error);
    res.json({
      success: false,
      message: "Background removal failed",
    });
  }
};*/

export const removeBackground = async (req, res) => {
  try {
    if (!req.file) {
      return res.json({ success: false, message: 'No image received' });
    }

    // Convert uploaded image to base64
    const base64Image = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;

    // Call Replicate API
    const response = await axios.post(
      'https://api.replicate.com/v1/predictions',
      {
        version: '7f7f3c2b9b2de325a0a5a0e546c0a845ca0a71dbbe2ad0d010f923fb7c11efb3', // background removal model
        input: { image: base64Image }
      },
      {
        headers: {
          Authorization: `Token ${process.env.REPLICATE_API_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const predictionUrl = response.data.output[0];

    res.json({ success: true, content: predictionUrl });
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.json({ success: false, message: 'Server error' });
  }
};
