import React from 'react'
import Logo from './Logo'
import { Avatar } from './Avatar'

const Nav = () => {
  return (
    <div className='bg-white shadow-xl py-2 px-3 fixed w-full top-0 flex items-center justify-between z-50'>
        <Logo height='h-[30px]' width='w-[30px]' size={20} radius='rounded-lg'/>
        <Avatar/>
      
    </div>
  )
}

export default Nav
