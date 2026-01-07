import React, { use } from 'react'
import { useNavigate } from 'react-router-dom'
import { assets } from '../assets/assets'

const Hero = () => {
    const navigate = useNavigate()
  return (
    <div className='px-4 sm:px-20 xl:px-32 relative inline-flex flex-col w-full justify-center bg-[url(/gradientBackground.png)] bg-cover bg-no-repeat min-h-screen  pt-24 sm:pt-28'>
      
      <div className='text-center mb-6'>
        <h1 className='text-3xl sm:text-5xl md:text-6xl 2xl:text-7xl font-semibold mx-auto leading-tight break-words'><span className='text-primary'>Orbitra –</span><br/> AI That Powers Your Orbit</h1>
        <p>Transform the way you work with Orbitra’s suite of premium AI tools.</p>
        <p>Write articles, generate images, and supercharge your workflow with intelligent automation.</p>
      </div>
      <div className='flex flex-wrap gap-4 justify-center text-sm max-sm:text-xs'>
        <button onClick={()=> navigate('/ai')} className='bg-primary text-white px-10 py-3 rounded-lg hover:scale-102 active:scale-95 transition cursor-pointer'>Start creation
        </button>
        <button className='bg-white px-10 py-3 rounded-lg border border-gray-300 hover:scale-102 active:scale-95 transition cursor-pointer'>Watch demo</button>
      </div>
      <div className='flex items-center gap-8 mt-8 mx-auto text-gray-600'>
        <img src={assets.user_group} alt='' className='h-8'/> Trusted by over 1000+ users worldwide
      </div>
    </div>
  )
}

export default Hero
