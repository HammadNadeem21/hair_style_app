import Image from 'next/image'
import React from 'react'
import { SmallText } from './Text_Style/Small_text'
import { Download, Bookmark } from 'lucide-react'
import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { saveHairstyle, removeHairstyle, getSavedHairstyles } from '@/utils/db'

interface ResultCardProps {
  image?: string;
  title?: string;
  description?: string;
  howToApply?: string;
  onImageClick?: () => void;
  onDetailClick?: () => void;
}

const ResultCard = ({ image, title, description, howToApply, onImageClick, onDetailClick }: ResultCardProps) => {
  const [isSaved, setIsSaved] = useState(false);
  const [savedId, setSavedId] = useState<string | null>(null);

  useEffect(() => {
    // Check if item is already saved
    if (typeof window !== 'undefined') {
      getSavedHairstyles().then((items) => {
        const found = items.find((item: any) => item.image === image);
        if (found) {
          setIsSaved(true);
          setSavedId(found.id);
        } else {
          setIsSaved(false);
          setSavedId(null);
        }
      }).catch(err => console.error("DB check failed", err));
    }
  }, [image]);

  const handleSave = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!image) return;

    try {
      if (isSaved && savedId) {
        // Remove
        await removeHairstyle(savedId);
        setIsSaved(false);
        setSavedId(null);
        toast.info("Removed from collection");
      } else {
        // Add
        const newId = crypto.randomUUID();
        const newItem = {
          id: newId,
          image,
          title,
          description,
          how_to_apply: howToApply,
          date: new Date().toISOString()
        };
        await saveHairstyle(newItem);
        setIsSaved(true);
        setSavedId(newId);
        toast.success("Saved to collection");
      }
    } catch (error) {
      console.error("Failed to save:", error);
      toast.error("Failed to save item");
    }
  };




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
        {image && (
          <div className="absolute top-2 right-2 flex flex-col gap-2 z-10">
            <a
              href={image}
              download={`hairstyle-${title?.replace(/\s+/g, '-').toLowerCase() || 'generated'}.png`}
              onClick={(e) => e.stopPropagation()}
              className="p-2 bg-white/20 hover:bg-white/40 border border-white/60 text-white rounded-full backdrop-blur-md transition-all duration-300 hover:scale-110"
              title="Download Result"
            >
              <Download size={18} />
            </a>

            <button
              onClick={handleSave}
              className={`p-2 border border-white/60 rounded-full backdrop-blur-md transition-all duration-300 hover:scale-110 ${isSaved
                ? 'bg-primaryColor text-white border-primaryColor'
                : 'bg-white/20 hover:bg-white/40 text-white'
                }`}
              title={isSaved ? "Remove from Saved" : "Save Result"}
            >
              <Bookmark size={18} fill={isSaved ? "currentColor" : "none"} />
            </button>
          </div>
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
