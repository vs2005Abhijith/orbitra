import { Hash, Sparkles } from 'lucide-react'
import React, { useState, useEffect, useRef } from 'react'

const BlogTitles = ({ makeAuthenticatedRequest }) => {
  const blogCategories = [
    'General',
    'Technology',
    'Business',
    'Health',
    'Lifestyle',
    'Education',
    'Travel',
    'Food'
  ]

  const [selectedCategory, setSelectedCategory] = useState('General')
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [titles, setTitles] = useState('')
  const [error, setError] = useState(null)
  
  // Use refs to track if it's initial render and debounce timer
  const initialRender = useRef(true)
  const debounceTimer = useRef(null)

  // Function to generate titles
  const generateTitles = async () => {
    if (!input.trim()) {
      setTitles('')
      setError(null)
      return
    }

    setLoading(true)
    setError(null)

    try {
      const fullPrompt = `Generate blog titles for keyword "${input}" in ${selectedCategory} category`

      const res = await makeAuthenticatedRequest(
        'https://orbitra-nine.vercel.app/api/ai/generate-blog-title',
        {
          method: 'POST',
          body: JSON.stringify({ prompt: fullPrompt })
        }
      )

      const data = await res.json()

      if (!data.success) {
        throw new Error(data.message)
      }

      setTitles(data.content)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Handle form submission
  const onSubmitHandler = async (e) => {
    e.preventDefault()
    if (!input.trim()) return
    generateTitles()
  }

  // Effect to handle auto-generation when input or category changes
  useEffect(() => {
    // Skip on initial render
    if (initialRender.current) {
      initialRender.current = false
      return
    }

    // Clear existing debounce timer
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current)
    }

    // Don't auto-generate if input is empty
    if (!input.trim()) {
      setTitles('')
      setError(null)
      return
    }

    // Set debounce timer to avoid too many API calls
    debounceTimer.current = setTimeout(() => {
      generateTitles()
    }, 500) // 500ms debounce delay

    // Cleanup function
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current)
      }
    }
  }, [input, selectedCategory])

  return (
    <div className='h-full overflow-y-scroll p-6 flex items-start flex-wrap gap-4 text-slate-700'>

      {/* LEFT */}
      <form
        onSubmit={onSubmitHandler}
        className='w-full max-w-lg p-4 bg-white rounded-lg border border-gray-200'
      >
        <div className='flex items-center gap-3'>
          <Sparkles className='w-6 text-[#8E37EB]' />
          <h1 className='text-xl font-semibold'>AI Title Generator</h1>
        </div>

        <p className='mt-6 text-sm font-medium'>Keyword</p>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          type='text'
          required
          placeholder='The future of AI'
          className='w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border border-gray-300'
        />

        <p className='mt-4 text-sm font-medium'>Category</p>
        <div className='mt-3 flex gap-3 flex-wrap'>
          {blogCategories.map((item) => (
            <span
              key={item}
              onClick={() => setSelectedCategory(item)}
              className={`text-xs px-4 py-1 border rounded-full cursor-pointer
                ${
                  selectedCategory === item
                    ? 'bg-purple-50 text-purple-700 border-purple-300'
                    : 'text-gray-500 border-gray-300'
                }`}
            >
              {item}
            </span>
          ))}
        </div>

        <button
          disabled={loading || !input.trim()}
          className='w-full flex justify-center items-center gap-2 bg-gradient-to-r from-[#C341F6] to-[#8E37EB] text-white px-4 py-2 mt-6 text-sm rounded-lg disabled:opacity-60'
        >
          <Hash className='w-5' />
          {loading ? 'Generating...' : 'Generate Title'}
        </button>
        
        <p className='mt-2 text-xs text-gray-500 text-center'>
          Titles will auto-generate as you type or change category
        </p>
      </form>

      {/* RIGHT */}
      <div className='w-full max-w-lg p-4 bg-white rounded-lg flex flex-col border border-gray-200 min-h-96'>
        <div className='flex items-center gap-3'>
          <Hash className='w-5 h-5 text-[#8E37EB]' />
          <h1 className='text-xl font-semibold'>Generated Title</h1>
        </div>

        <div className='flex-1 flex justify-center items-center'>
          {loading && <p className='text-sm text-gray-400'>Generating titles...</p>}

          {error && <p className='text-sm text-red-500'>{error}</p>}

          {titles && !loading && !error && (
            <pre className='text-sm whitespace-pre-wrap'>{titles}</pre>
          )}

          {!loading && !titles && !error && input.trim() && (
            <div className='text-sm text-gray-400 flex flex-col items-center gap-5'>
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600"></div>
              <p>Generating titles...</p>
            </div>
          )}

          {!loading && !titles && !error && !input.trim() && (
            <div className='text-sm text-gray-400 flex flex-col items-center gap-5'>
              <Hash className='w-5 h-9' />
              <p>Enter a keyword to generate titles</p>
            </div>
          )}
        </div>
      </div>

    </div>
  )
}

export default BlogTitles