import Image from 'next/image'
import React from 'react'
import { SmallText } from './Text_Style/Small_text'
import { Download } from 'lucide-react'

interface ResultCardProps {
  image?: string;
  title?: string;
  description?: string;
  onImageClick?: () => void;
  onDetailClick?: () => void;
}

const ResultCard = ({ image, title, description, onImageClick, onDetailClick }: ResultCardProps) => {



  return (
    <div
      className='group relative flex flex-col items-center justify-start gap-3 rounded-2xl p-3 bg-white/40 backdrop-blur-md border border-white/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden'
    >

      <div
        className="relative h-[200px] w-full rounded-xl overflow-hidden shadow-sm cursor-zoom-in"
        onClick={onImageClick}
      >
        <Image
          src={image || "/selfie3.jpeg"}
          alt={title || 'Hairstyle'}
          fill
          className='object-cover transition-transform duration-500 group-hover:scale-105'
        />
        {/* Overlay gradient for text readability if needed, or just style */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Download Button */}
        {/* Download Button */}
        {image && (
          <a
            href={image}
            download={`hairstyle-${title?.replace(/\s+/g, '-').toLowerCase() || 'generated'}.png`}
            onClick={(e) => e.stopPropagation()}
            className="absolute top-2 right-2 p-2 bg-white/20 hover:bg-white/40 border border-white/60 text-white rounded-full backdrop-blur-md transition-all duration-300 z-10 hover:scale-110"
            title="Download Result"
          >
            <Download size={18} />
          </a>
        )}
      </div>

      <div className="w-full flex flex-col items-center gap-1 px-1 pb-2">
        <SmallText value={title || 'Hairstyle'} textColor='text-primaryColor' className='font-bold text-lg text-center leading-tight' />
        {description && (
          <p className="text-xs text-center text-gray-600 line-clamp-2 font-medium leading-relaxed">
            {description}
          </p>
        )}
      </div>

      <button
        onClick={onDetailClick}
        className="w-full py-2 bg-white text-primaryColor border border-primaryColor/20 rounded-xl font-medium text-sm shadow-sm hover:bg-primaryColor hover:text-white transition-all duration-300"
      >
        View Details
      </button>

    </div>
  )
}

export default ResultCard
