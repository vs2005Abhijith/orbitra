import { Edit, Sparkles } from 'lucide-react'
import React, { useState } from 'react'

const WriteArticle = ({ makeAuthenticatedRequest }) => {
  const articleLength = [
    { length: 800, text: 'Short (500-800 words)' },
    { length: 1200, text: 'Medium (800-1200 words)' },
    { length: 1600, text: 'Long (1200+ words)' },
  ]

  const [selectedLength, setSelectedLength] = useState(articleLength[0])
  const [input, setInput] = useState('')
  const [article, setArticle] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const onSubmitHandler = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setArticle('')

    try {
      /*const res = await makeAuthenticatedRequest(
        'http://localhost:3000/api/ai/generate-article',
        {
          method: 'POST',
          body: JSON.stringify({
            prompt: input,
            length: selectedLength.length,
          }),
        }
      )*/
     const res = await makeAuthenticatedRequest(
  'https://orbitra-nine.vercel.app/api/ai/generate-article',
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      prompt: input,
      length: selectedLength.length,
    }),
  }
)


      const data = await res.json()

      if (!data.success) {
        throw new Error(data.message)
      }

      setArticle(data.content)
    } catch (err) {
      setError(err.message || 'Server error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='h-full overflow-y-scroll p-6 flex items-start flex-wrap gap-4 text-slate-700'>

      {/* LEFT */}
      <form
        onSubmit={onSubmitHandler}
        className='w-full max-w-lg p-4 bg-white rounded-lg border border-gray-200'
      >
        <div className='flex items-center gap-3'>
          <Sparkles className='w-6 text-[#4A7AFF]' />
          <h1 className='text-xl font-semibold'>Article Configuration</h1>
        </div>

        <p className='mt-6 text-sm font-medium'>Article Topic</p>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          required
          placeholder='The future of AI in India...'
          className='w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border border-gray-300'
        />

        <p className='mt-4 text-sm font-medium'>Article Length</p>
        <div className='mt-3 flex gap-3 flex-wrap'>
          {articleLength.map((item) => (
            <span
              key={item.text}
              onClick={() => setSelectedLength(item)}
              className={`text-xs px-4 py-1 border rounded-full cursor-pointer ${
                selectedLength.text === item.text
                  ? 'bg-blue-50 text-blue-700 border-blue-300'
                  : 'text-gray-500 border-gray-300'
              }`}
            >
              {item.text}
            </span>
          ))}
        </div>

        <button
          disabled={loading}
          className='w-full flex justify-center items-center gap-2 bg-gradient-to-r from-[#226BFF] to-[#65ADFF] text-white px-4 py-2 mt-6 text-sm rounded-lg disabled:opacity-60'
        >
          <Edit className='w-5' />
          {loading ? 'Generating...' : 'Generate Article'}
        </button>

        {error && <p className='mt-3 text-sm text-red-500'>{error}</p>}
      </form>

      {/* RIGHT */}
      <div className='w-full max-w-lg p-4 bg-white rounded-lg border border-gray-200 min-h-96 max-h-[600px] overflow-y-auto'>
        <div className='flex items-center gap-3'>
          <Edit className='w-5 h-5 text-[#4A7AFF]' />
          <h1 className='text-xl font-semibold'>Generated Article</h1>
        </div>

        {!article && !loading && (
          <p className='mt-10 text-sm text-gray-400 text-center'>
            Enter a topic and generate an article
          </p>
        )}

        {article && (
          <div className='mt-4 text-sm whitespace-pre-wrap leading-relaxed'>
            {article}
          </div>
        )}
      </div>

    </div>
  )
}

export default WriteArticle
