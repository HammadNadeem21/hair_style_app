import React from 'react'
import { SmallText } from './Text_Style/Small_text'
import { Sparkles } from 'lucide-react'

const Footer = () => {
  return (
    <div className='h-[40px] w-full bg-primaryColor  flex items-center justify-center gap-1 fixed bottom-0'>
        <Sparkles className='text-white' size={25}/>
      <SmallText value='Powered by AI' className='text-white'/>
    </div>
  )
}

export default Footer
