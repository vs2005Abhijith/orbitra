import React, { useEffect, useState } from 'react'
import { dummyCreationData } from '../assets/assets'
import { Gem, Sparkles } from 'lucide-react'
import { Protect } from '@clerk/clerk-react'
import Creationitem from '../components/Creationitem'

const Dashboard = () => {
  const [creations, setCreations] = useState([])
  const getDashboardData = async () => {
    setCreations(dummyCreationData)
  }
  useEffect(() => {getDashboardData()},[])
  return (
    <div className='h-full p-6 overflow-y-scroll'>
      <div className='flex justify-start gap-4 flex-wrap'>
        {/*Total Creations Card */}
        <div className='flex justify-between items-center bg-white p-4 rounded-xl w-72 border border-gray-200 px-6'>
          <div className='text-slate-600'>
            <p className='text-sm'>Total Creations</p>
            <h2 className='text-xl font-semibold'>{creations.length}</h2>
          </div>
          <div className='w-10 h-10 rounded-lg bg-gradient-to-br from-[#3588F2] to-[#0BB0D7] text-white flex items-center justify-center'>
            <Sparkles className='w-5 text-white'/>
          </div>

        </div>
        {/*Active Plan  Card */}
        <div className='flex justify-between items-center bg-white p-4 rounded-xl w-72 border border-gray-200 px-6'>
          <div className='text-slate-600'>
            <p className='text-sm'>Active Plan</p>
            <h2 className='text-xl font-semibold'>
              <Protect plan='premium' fallback='Free'>PREMIUM</Protect>
            </h2>
          </div>
          <div className='w-10 h-10 rounded-lg bg-gradient-to-br from-[#FF61C5] to-[#9E53EE] text-white flex items-center justify-center'>
            <Gem className='w-5 text-white'/>
          </div>

        </div>
        
        </div>
        <div className='space-y-3'>
          <p className='mt-6 mb-4'>Recent Creations</p>
          {
            creations.map((item)=> <Creationitem key={item.id} item={item}/>)
          }

        </div>
     </div>
  )
}

export default Dashboard