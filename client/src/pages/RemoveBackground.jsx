import { Eraser, Sparkles } from 'lucide-react'
import React, { useState } from 'react'
import axios from 'axios'

const RemoveBackground = () => {
  const [file, setFile] = useState(null)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const onSubmitHandler = async (e) => {
    e.preventDefault()
    if (!file) return

    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const formData = new FormData()
      formData.append('image', file)

      const res = await axios.post(
        'http://localhost:3000/api/ai/remove-background',
        formData
      )

      if (!res.data.success) throw new Error(res.data.message)

      setResult(res.data.content)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='h-full overflow-y-scroll p-6 flex gap-4 text-slate-700'>
      {/* LEFT */}
      <form
        onSubmit={onSubmitHandler}
        className='w-full max-w-lg p-4 bg-white rounded-lg border'
      >
        <div className='flex items-center gap-3'>
          <Sparkles className='w-6 text-[#FF4938]' />
          <h1 className='text-xl font-semibold'>Background Remover</h1>
        </div>

        <p className='mt-6 text-sm font-medium'>Upload Image</p>
        <input
          type='file'
          accept='image/*'
          onChange={(e) => setFile(e.target.files[0])}
          required
          className='w-full mt-2'
        />

        <button
          disabled={loading}
          className='w-full flex justify-center gap-2 bg-gradient-to-r from-[#F6AB41] to-[#FF4938] text-white px-4 py-2 mt-6 rounded-lg'
        >
          <Eraser className='w-5' />
          {loading ? 'Processing...' : 'Remove Background'}
        </button>
      </form>

      {/* RIGHT */}
      <div className='w-full max-w-lg p-4 bg-white rounded-lg border flex justify-center items-center'>
        {loading && <p>Removing background...</p>}
        {error && <p className='text-red-500'>{error}</p>}
        {result && (
          <img src={result} alt='Result' className='max-h-80 rounded' />
        )}
        {!loading && !result && !error && (
          <p className='text-gray-400'>Processed image appears here</p>
        )}
      </div>
    </div>
  )
}

export default RemoveBackground
