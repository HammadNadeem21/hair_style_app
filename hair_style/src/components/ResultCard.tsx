import Image from 'next/image'
import React from 'react'
import { SmallText } from './Text_Style/Small_text'

interface ResultCardProps {
  image?: string;
  title?: string;
  description?: string;
}

const ResultCard = ({ image, title, description }: ResultCardProps) => {
  return (
    <div className=' flex flex-col items-center justify-center gap-2 rounded-lg py-3 px-1 bg-primaryColor/10 cursor-pointer '>


      <div className="h-[170px] w-[120px] ">
        <Image src={image || "/selfie3.jpeg"} alt='picture' height={300} width={300} className='w-full h-full rounded-xl' />
      </div>

      <SmallText value={title || 'Hairstyle'} textColor='text-grayColor' className='font-bold' />
      {description && <p className="text-xs text-center text-gray-500 line-clamp-2">{description}</p>}

    </div>
  )
}

export default ResultCard
