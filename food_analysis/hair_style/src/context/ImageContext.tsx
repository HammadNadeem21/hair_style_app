"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

export interface HairstyleResult {
    hairstyle_name: string;
    description: string;
    how_to_apply: string;
    image: string | null;
}

export interface GlowResult {
    isHumanFace?: boolean;
    overallScore: number;
    potentialScore: number;
    facialBreakdown: {
        symmetry: number;
        skinQuality: number;
        jawline: number;
        eyes: number;
        hairAppearance: number;
    };
    strengths: string[];
    improvementAreas: string[];
    maxxingTips: {
        grooming: string[];
        skincare: string[];
        hairstyle: string[];
        lifestyle: string[];
    };
    disclaimer: string;
}

export interface FoodResult {
    isFood: boolean;
    identifiedDish?: string;
    mainIngredients?: string[];
    calories?: number;
    macros?: {
        protein: string;
        fat: string;
        carbs: string;
    };
    healthScore?: number;
    nutritionalBreakdown?: string;
    improvementTips?: string[];
    warnings?: string[];
}

interface ImageContextType {
    scanImage: string | null;
    setScanImage: (image: string | null) => void;
    resultImage: string | null;
    setResultImage: (image: string | null) => void;
    resultImages: HairstyleResult[];
    setResultImages: (images: HairstyleResult[]) => void;
    glowResult: GlowResult | null;
    setGlowResult: (result: GlowResult | null) => void;
    foodResult: FoodResult | null;
    setFoodResult: (result: FoodResult | null) => void;
}

const ImageContext = createContext<ImageContextType | undefined>(undefined);

export const ImageProvider = ({ children }: { children: ReactNode }) => {
    const [scanImage, setScanImage] = useState<string | null>(null);
    const [resultImage, setResultImage] = useState<string | null>(null);
    const [resultImages, setResultImages] = useState<HairstyleResult[]>([]);
    const [glowResult, setGlowResult] = useState<GlowResult | null>(null);
    const [foodResult, setFoodResult] = useState<FoodResult | null>(null);

    return (
        <ImageContext.Provider value={{
            scanImage,
            setScanImage,
            resultImage,
            setResultImage,
            resultImages,
            setResultImages,
            glowResult,
            setGlowResult,
            foodResult,
            setFoodResult
        }}>
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
