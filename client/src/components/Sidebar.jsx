import { Protect, useClerk, useUser } from '@clerk/clerk-react'
import {  Eraser, FileText, Hash, House, Icon, Image, LogOut, Scissors, SquarePen, Users } from 'lucide-react'
import React from 'react'
import { NavLink } from 'react-router-dom'

const navItems = [
    { to:'/ai',label:'Dashboard',Icon: House },
    { to:'/ai/write-article',label:'Write Article',Icon: SquarePen },
    { to:'/ai/blog-titles',label:'Blog Titles',Icon: Hash },
    { to:'/ai/generate-images',label:'Generate Images',Icon: Image },
    { to:'/ai/remove-background',label:'Remove Background',Icon: Eraser },
    { to:'/ai/remove-object',label:'Remove Object',Icon: Scissors },
    { to:'/ai/review-resume',label:'Review Resume',Icon: FileText },
    { to:'/ai/community',label:'Community',Icon: Users },
]
const Sidebar = ({ sidebar , setSidebar }) => {
    const {user} = useUser()
    const {signout, openUserProfile} = useClerk()
  return (
    <div className={`w-60 bg-white h-screen top-14 flex flex-col border-r border-gray-200 justify-between items-center max:sm-absolute bottom-0 ${sidebar ? 'translate-x-0': 'max-sm:-translate-x-full'} transition-all duration-300 ease-in-out `} >
      <div className='my-7 w-full'>
        <img src={user.imageUrl} alt="User avatar" className='w-13 rounded-full mx-auto' />
        <h1 className='mt-1 text-center'>{user.fullName}</h1>
        <div className='mt-10 flex flex-col gap-1'>
            {navItems.map(({to,label,Icon})=> (
                <NavLink to={to} key={to} className={({isActive})=> isActive ? 'flex items-center gap-3 px-6 py-3 bg-gray-100 border-l-4 border-primary text-primary font-medium' : 'flex items-center gap-3 px-6 py-3 text-gray-600 hover:bg-gray-50 hover:border-l-4 hover:border-primary hover:text-primary'} onClick={()=> setSidebar(false)}>
                    <Icon className='w-5 h-5'/>
                    <span>{label}</span>

                </NavLink>
            ))}
        </div>

      </div>
      <div className='w-full border-t border-gray-200 p-4 px-7 flex items-center justify-between'>
         <div onClick={openUserProfile} className='flex gap-2 items-center cursor-pointer'>
            <img src={user.imageUrl} alt="User avatar" className='w-8 rounded-full' />
            <div>
                <h1 className='text-sm font-medium'>{user.fullName}</h1>
                <p className='text-xs text-gray-500'>
                    <Protect plan='premium' fallback='Free'>PREMIUM</Protect>Plan
                </p>
            </div>

         </div>
         <LogOut onClick={signout} className='w-4.5 text-gray-400 hover:text-gray-700 transition cursor-pointer '/>
      </div>
    </div>
  )
}

export default Sidebar