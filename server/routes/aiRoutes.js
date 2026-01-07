import express from 'express';
import { generateArticle, generateBlogTitles, generateImage } from '../controllers/aiController.js';
import {auth} from '../middleware/auth.js';
import upload from '../middleware/upload.js';
import { removeBackground } from '../controllers/aiController.js';

const airouter = express.Router();
airouter.post('/generate-article', auth, generateArticle);
airouter.post('/generate-blog-title', auth, generateBlogTitles)
airouter.post('/generate-image', auth, generateImage)
airouter.post('/remove-background', auth, upload.single('image'), removeBackground);
export default airouter;