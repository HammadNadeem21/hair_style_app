"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useImageContext, HairstyleResult } from "@/context/ImageContext";
import Image from "next/image";
import { Heading_2 } from "@/components/Text_Style/Heading_2";
import { ArrowLeft } from "lucide-react";
import { getHairstyleById } from "@/utils/db";

const DetailContent = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { resultImages, resultImage } = useImageContext();
    const [hairstyle, setHairstyle] = useState<HairstyleResult | null>(null);

    useEffect(() => {
        const index = searchParams.get("index");
        const savedId = searchParams.get("savedId");

        if (savedId) {
            // Load from DB
            getHairstyleById(savedId).then((item) => {
                if (item) {
                    setHairstyle({
                        hairstyle_name: item.title || "Saved Style",
                        description: item.description || "",
                        how_to_apply: item.how_to_apply || "",
                        image: item.image
                    } as HairstyleResult);
                }
            });
        }
        else if (index !== null) {
            const i = parseInt(index);
            if (resultImages && resultImages[i]) {
                setHairstyle(resultImages[i]);
            } else if (i === 0 && resultImage) {
                // Fallback for single image result if structure differs
                setHairstyle({
                    hairstyle_name: "Generated Hairstyle",
                    description: "Here is your generated look.",
                    how_to_apply: "",
                    image: resultImage
                } as HairstyleResult);
            }
        }
    }, [searchParams, resultImages, resultImage]);

    if (!hairstyle) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-gray-500">Loading details...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white pt-24">
            {/* Header Image */}
            <div className="relative w-full h-[50vh] min-h-[400px]">


                <Image
                    src={hairstyle.image || "/selfie3.jpeg"}
                    alt={hairstyle.hairstyle_name}
                    fill
                    className="object-contain p-4"
                />
            </div>

            {/* Content */}
            <div className="max-w-2xl mx-auto px-6 py-8 -mt-10 relative bg-white rounded-t-3xl shadow-lg min-h-[50vh]">
                <div className="flex flex-col gap-6">

                    <div className="text-center border-b border-gray-100 pb-6">
                        <Heading_2 className="text-3xl font-bold text-primaryColor mb-2">
                            {hairstyle.hairstyle_name}
                        </Heading_2>
                    </div>

                    <div className="space-y-4">
                        <div className="bg-blue-50/50 p-6 rounded-2xl border border-blue-100">
                            <h3 className="text-sm font-bold text-primaryColor uppercase tracking-wider mb-3 flex items-center gap-2">
                                Description
                            </h3>
                            <p className="text-gray-700 leading-relaxed">
                                {hairstyle.description}
                            </p>
                        </div>

                        {hairstyle.how_to_apply && (
                            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3">
                                    How to Style
                                </h3>
                                <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                                    {hairstyle.how_to_apply}
                                </p>
                            </div>
                        )}
                    </div>

                </div>



                <div className="w-full flex items-center justify-center mt-5">
                    <button
                        onClick={() => router.back()}
                        className="py-1 px-3 rounded-full flex items-center justify-center shadow-md bg-primaryColor text-white transition-all"
                    >
                        <ArrowLeft size={20} /> Back
                    </button>
                </div>

            </div>


        </div>
    );
};

const DetailPage = () => {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-gray-500">Loading...</div>}>
            <DetailContent />
        </Suspense>
    );
};

export default DetailPage;
