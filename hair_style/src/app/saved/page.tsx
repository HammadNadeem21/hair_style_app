/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import ResultCard from "@/components/ResultCard";
import { Heading_2 } from "@/components/Text_Style/Heading_2";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from 'next/image';
import { getSavedHairstyles } from "@/utils/db";

export default function SavedPage() {
    const router = useRouter();
    const [savedItems, setSavedItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Drawer/Modal State
    const [lightboxImage, setLightboxImage] = useState<string | null>(null);

    // Load saved items on mount
    useEffect(() => {
        if (typeof window !== "undefined") {
            getSavedHairstyles()
                .then((items) => {
                    // Sort by date (newest first)
                    const sorted = items.reverse();
                    setSavedItems(sorted);
                })
                .catch(e => console.error("Error loading db", e))
                .finally(() => setLoading(false));
        }
    }, []);

    const handleImageClick = (image: string) => {
        setLightboxImage(image);
    };

    const handleDetailClick = (item: any) => {
        // Navigate to detail page with savedId
        if (item.id) {
            router.push(`/result/detail?savedId=${item.id}`);
        } else {
            // Fallback if old item without ID (should rely on migration or just alert)
            // For new items, ID is guaranteed.
            alert(`Style: ${item.title}\n\n${item.description}`);
        }
    };


    return (
        <div className="flex flex-col items-center min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-6 md:p-12 pt-24">
            <div className="max-w-7xl w-full flex flex-col gap-8 animate-fadeIn">

                {/* Header */}
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => router.back()}
                        className="p-2 rounded-full bg-white border border-gray-200 hover:bg-gray-50 hover:scale-105 transition-all shadow-sm"
                    >
                        <ArrowLeft size={24} className="text-gray-600" />
                    </button>
                    <Heading_2 value="Saved Collection" className="text-3xl font-bold text-gray-800" />
                </div>

                {/* Grid */}
                {loading ? (
                    <div className="w-full flex justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primaryColor"></div>
                    </div>
                ) : savedItems.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
                        {savedItems.map((item: any, index: number) => (
                            <ResultCard
                                key={index}
                                image={item.image}
                                title={item.title}
                                description={item.description}
                                howToApply={item.how_to_apply}
                                onImageClick={() => handleImageClick(item.image)}
                                onDetailClick={() => handleDetailClick(item)}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 opacity-60">
                        <p className="text-xl font-medium text-gray-400">No saved hairstyles yet.</p>
                        <Link href="/" className="mt-4 text-primaryColor hover:underline">Generate new styles</Link>
                    </div>
                )}
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
    );
}
import Link from "next/link";
