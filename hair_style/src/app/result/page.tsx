
"use client";
import React from 'react'
import ResultCard from '@/components/ResultCard'
import { Heading_2 } from '@/components/Text_Style/Heading_2'
import { Sparkles } from 'lucide-react'
import { useImageContext } from '@/context/ImageContext'

const Page = () => {
  const { resultImage, resultImages } = useImageContext();

  return (
    <div className=' w-full min-h-screen py-5 px-2'>



      <Heading_2 className='text-center mb-5 bg-primaryColor/20 text-primaryColor py-1 rounded-lg flex items-center justify-center gap-2 mt-7'><Sparkles /> Your AI-Powered Hairstyle Results </Heading_2>

      <div className="grid grid-cols-2 gap-5">
        {resultImages && resultImages.length > 0 ? (
          resultImages.map((item, index) => (
            <ResultCard
              key={index}
              image={item.image || undefined}
              title={item.hairstyle_name}
              description={item.description}
            />
          ))
        ) : (
          resultImage && <ResultCard image={resultImage} />
        )}
      </div>

    </div>
  )
}

export default Page
