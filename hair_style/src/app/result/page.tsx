
"use client";
import React from 'react'
import ResultCard from '@/components/ResultCard'
import { Heading_2 } from '@/components/Text_Style/Heading_2'
import { Sparkles, X } from 'lucide-react'
import { useImageContext, HairstyleResult } from '@/context/ImageContext'
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import Image from 'next/image';
import { SmallText } from '@/components/Text_Style/Small_text';

const Page = () => {
  const { resultImage, resultImages } = useImageContext();
  const [selectedHairstyle, setSelectedHairstyle] = useState<HairstyleResult | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const router = useRouter();

  const handleCardClick = (hairstyle: HairstyleResult) => {
    setSelectedHairstyle(hairstyle);
    setIsOpen(true);
  };

  return (
    <div className='w-full min-h-screen flex flex-col items-center justify-start bg-gradient-to-b from-primaryColor/10 via-white to-white relative overflow-hidden py-5 px-4'>

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
                onClick={() => handleCardClick(item)}
              />
            ))
          ) : (
            resultImage && <ResultCard image={resultImage} />
          )}
        </div>

        <button
          onClick={() => router.push('/')}
          className="mt-4 px-8 py-3 bg-primaryColor text-white rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 active:scale-95"
        >
          Try Another Style
        </button>

      </div>

      {/* Detail Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-md w-[90%] rounded-3xl bg-white/90 backdrop-blur-xl border-white/50 p-0 overflow-hidden">

          {selectedHairstyle && (
            <div className="flex flex-col h-[80vh] max-h-[600px]">

              {/* Image Header */}
              <div className="relative w-full h-[40%] min-h-[250px]">
                <Image
                  src={selectedHairstyle.image || "/selfie3.jpeg"}
                  alt={selectedHairstyle.hairstyle_name}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <h2 className="text-2xl font-bold leading-tight">{selectedHairstyle.hairstyle_name}</h2>
                </div>
              </div>

              {/* Content Scrollable Area */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">

                {/* Description */}
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold text-primaryColor uppercase tracking-wider">Description</h3>
                  <p className="text-gray-600 leading-relaxed text-sm">
                    {selectedHairstyle.description}
                  </p>
                </div>

                {/* How to Apply */}
                {selectedHairstyle.how_to_apply && (
                  <div className="space-y-2">
                    <h3 className="text-sm font-semibold text-primaryColor uppercase tracking-wider">How to Style</h3>
                    <p className="text-gray-600 leading-relaxed text-sm whitespace-pre-line">
                      {selectedHairstyle.how_to_apply}
                    </p>
                  </div>
                )}

              </div>

              {/* Footer Action */}
              <div className="p-4 bg-gray-50 border-t border-gray-100">
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-full py-3 bg-primaryColor text-white rounded-xl font-medium shadow-md active:scale-95 transition-transform"
                >
                  Close
                </button>
              </div>

            </div>
          )}
        </DialogContent>
      </Dialog>

    </div>
  )
}

export default Page
