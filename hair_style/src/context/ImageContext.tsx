"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

export interface HairstyleResult {
    hairstyle_name: string;
    description: string;
    how_to_apply: string;
    image: string | null;
}

interface ImageContextType {
    scanImage: string | null;
    setScanImage: (image: string | null) => void;
    resultImage: string | null;
    setResultImage: (image: string | null) => void;
    resultImages: HairstyleResult[];
    setResultImages: (images: HairstyleResult[]) => void;
}

const ImageContext = createContext<ImageContextType | undefined>(undefined);

export const ImageProvider = ({ children }: { children: ReactNode }) => {
    const [scanImage, setScanImage] = useState<string | null>(null);
    const [resultImage, setResultImage] = useState<string | null>(null);
    const [resultImages, setResultImages] = useState<HairstyleResult[]>([]);

    return (
        <ImageContext.Provider value={{ scanImage, setScanImage, resultImage, setResultImage, resultImages, setResultImages }}>
            {children}
        </ImageContext.Provider>
    );
};

export const useImageContext = () => {
    const context = useContext(ImageContext);
    if (!context) {
        throw new Error("useImageContext must be used within an ImageProvider");
    }
    return context;
};
