
"use client";
import React, { useEffect } from 'react'
import ResultCard from '@/components/ResultCard'
import { Heading_2 } from '@/components/Text_Style/Heading_2'
import { Sparkles } from 'lucide-react'
import { useImageContext, } from '@/context/ImageContext'
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import Image from 'next/image';

const Page = () => {
  const { resultImage, resultImages } = useImageContext();
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  const router = useRouter();

  // Fix 1: Remove /Scan from browser history on mount
  // This ensures back button goes to home (/) instead of /Scan
  useEffect(() => {
    // Replace current history entry to skip /Scan in the navigation stack
    window.history.replaceState(
      { ...window.history.state, as: '/result', url: '/result' },
      '',
      '/result'
    );
  }, []);

  // Fix 2: Handle lightbox navigation with browser back button
  // When lightbox is open, back button should close it without navigating
  useEffect(() => {
    if (lightboxImage) {
      // Push a new history state when lightbox opens
      const historyState = { lightboxOpen: true };
      window.history.pushState(historyState, '');

      const handlePopState = (event: PopStateEvent) => {
        // When back button is pressed, close the lightbox
        setLightboxImage(null);
        // Prevent going back to previous page by pushing forward again
        window.history.pushState({ lightboxOpen: false }, '');
      };

      // Listen for back button presses
      window.addEventListener('popstate', handlePopState);

      // Cleanup: remove listener when lightbox closes or component unmounts
      return () => {
        window.removeEventListener('popstate', handlePopState);
      };
    }
  }, [lightboxImage]);

  const handleImageClick = (image: string) => {
    setLightboxImage(image);
  };

  const handleDetailClick = (index: number) => {
    router.push(`/result/detail?index=${index}`);
  };

  return (
    <div className='w-full min-h-screen flex flex-col items-center justify-start bg-gradient-to-b from-primaryColor/10 via-white to-white relative overflow-hidden pt-24 pb-10 px-4'>

      {/* Background decoration */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-primaryColor/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-blue-400/20 rounded-full blur-[100px] pointer-events-none" />

      <div className="z-10 w-full max-w-md flex flex-col items-center gap-6 animate-fadeIn">

        <Heading_2 className='text-center bg-white/60 backdrop-blur-md text-primaryColor py-3 px-6 rounded-2xl shadow-sm flex items-center justify-center gap-2 border border-white/50 w-full'>
          <Sparkles className="text-yellow-500" />
          Your New Look
        </Heading_2>

        <div className="grid grid-cols-2 gap-4 w-full">
          {resultImages && resultImages.length > 0 ? (
            resultImages.map((item, index) => (
              <ResultCard
                key={index}
                image={item.image || undefined}
                title={item.hairstyle_name}
                description={item.description}
                howToApply={item.how_to_apply}
                onImageClick={() => handleImageClick(item.image || "/selfie3.jpeg")}
                onDetailClick={() => handleDetailClick(index)}
              />
            ))
          ) : (
            resultImage && (
              <ResultCard
                image={resultImage}
                onImageClick={() => handleImageClick(resultImage)}
                onDetailClick={() => handleDetailClick(0)}
              />
            )
          )}
        </div>

        <button
          onClick={() => router.push('/')}
          className="mt-4 px-8 py-3 bg-primaryColor text-white rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 active:scale-95"
        >
          Try Another Style
        </button>

      </div>

      {/* Lightbox */}
      {lightboxImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm animate-fadeIn"
          onClick={() => setLightboxImage(null)}
        >
          <div className="relative w-[90%] h-[80%] p-4">
            <Image
              src={lightboxImage}
              alt="Full screen preview"
              fill
              className="object-contain"
            />
            <button
              onClick={() => setLightboxImage(null)}
              className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        </div>
      )}

    </div>
  )
}

export default Page
