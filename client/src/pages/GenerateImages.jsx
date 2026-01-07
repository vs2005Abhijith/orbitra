import { Image, Sparkles } from 'lucide-react'
import React, { useState } from 'react'

const GenerateImages = ({ makeAuthenticatedRequest }) => {
  const imageStyle = [
    'Realistic',
    'Ghibli',
    'Anime',
    'Cartoon',
    'Fantasy',
    '3D',
    'Portrait',
    'Pixel Art'
  ]

  const [selectedStyle, setSelectedStyle] = useState('Realistic')
  const [input, setInput] = useState('')
  const [publish, setPublish] = useState(false)

  const [loading, setLoading] = useState(false)
  const [imageUrl, setImageUrl] = useState(null)
  const [error, setError] = useState(null)
  const [imageKey, setImageKey] = useState(0)


  const onSubmitHandler = async (e) => {
    e.preventDefault()

    if (!input.trim()) {
      setError('Please enter a description')
      return
    }

    setLoading(true)
    setError(null)
    setImageUrl(null)

    try {
      const fullPrompt = `${input}, ${selectedStyle} style`

      const res = await makeAuthenticatedRequest(
        'http://localhost:3000/api/ai/generate-image',
        {
          method: 'POST',
          body: JSON.stringify({
            prompt: fullPrompt,
            publish
          })
        }
      )

      const data = await res.json()

      if (!data.success) {
        throw new Error(data.message || 'Image generation failed')
      }

      setImageUrl(data.content)
setImageKey(Date.now()) // ✅ unique key to force re-render

    } catch (err) {
      setError(err.message || 'Server error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='h-full overflow-y-scroll p-6 flex flex-wrap gap-4 text-slate-700'>

      {/* LEFT */}
      <form
        onSubmit={onSubmitHandler}
        className='w-full max-w-lg p-4 bg-white rounded-lg border border-gray-200'
      >
        <div className='flex items-center gap-3'>
          <Sparkles className='w-6 text-[#00AD25]' />
          <h1 className='text-xl font-semibold'>AI Image Generator</h1>
        </div>

        <p className='mt-6 text-sm font-medium'>Describe your image</p>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={4}
          required
          placeholder='A futuristic city at night...'
          className='w-full p-2 px-3 mt-2 text-sm rounded-md border border-gray-300'
        />

        <p className='mt-4 text-sm font-medium'>Style</p>
        <div className='mt-3 flex gap-2 flex-wrap'>
          {imageStyle.map((item) => (
            <span
              key={item}
              onClick={() => setSelectedStyle(item)}
              className={`text-xs px-4 py-1 border rounded-full cursor-pointer ${
                selectedStyle === item
                  ? 'bg-green-50 text-green-700 border-green-300'
                  : 'text-gray-500 border-gray-300'
              }`}
            >
              {item}
            </span>
          ))}
        </div>

        <div className='my-6 flex items-center gap-2'>
          <input
            type='checkbox'
            checked={publish}
            onChange={(e) => setPublish(e.target.checked)}
          />
          <p className='text-sm'>Make this image public</p>
        </div>

        <button
          disabled={loading}
          className='w-full flex justify-center items-center gap-2 bg-gradient-to-r from-[#00AD25] to-[#04FF50] text-white px-4 py-2 rounded-lg disabled:opacity-60'
        >
          <Image className='w-5' />
          {loading ? 'Generating...' : 'Generate Image'}
        </button>

        {error && <p className='mt-3 text-sm text-red-500'>{error}</p>}
      </form>

      {/* RIGHT */}
      <div className='w-full max-w-lg p-4 bg-white rounded-lg border border-gray-200 min-h-96 flex justify-center items-center'>
        {loading && <p className='text-gray-400'>Generating image...</p>}
{imageUrl && (
  <img
    key={imageKey}      // ✅ forces React to re-render
    src={imageUrl}      // ✅ base64 must be untouched
    alt="Generated"
    className="max-h-80 rounded-lg border"
  />
)}




        {!loading && !imageUrl && !error && (
          <p className='text-gray-400'>Generated image will appear here</p>
        )}
      </div>

    </div>
  )
}

export default GenerateImages
