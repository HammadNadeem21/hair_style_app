"use client";

import React from "react";
import { useImageContext } from "@/context/ImageContext";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowLeft, Activity, Flame, Droplet, Wheat, AlertTriangle, HeartPulse, Quote, LucideIcon, Info } from "lucide-react";
import { Heading_2 } from "@/components/Text_Style/Heading_2";
import { Progress } from "@/components/ui/progress";

const MacroCard = ({ label, value, icon: Icon, color, bgColor }: { label: string; value: string; icon: LucideIcon; color: string; bgColor: string }) => (
    <div className={`flex flex-col items-center p-4 rounded-2xl backdrop-blur-md border border-white/50 shadow-sm transition-all hover:shadow-md ${bgColor}`}>
        <div className={`p-2 rounded-full mb-2 ${color.replace('text-', 'bg-')}/10`}>
            <Icon size={24} className={color} />
        </div>
        <span className="text-sm font-semibold text-gray-600 mb-1">{label}</span>
        <span className="text-xl font-bold text-gray-900">{value}</span>
    </div>
);

const HealthScoreBar = ({ score }: { score: number }) => {
    let colorClass = "bg-red-500";
    if (score >= 70) colorClass = "bg-green-500";
    else if (score >= 40) colorClass = "bg-yellow-500";

    return (
        <div className="w-full bg-white/60 p-6 rounded-3xl border border-white/50 shadow-sm">
            <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                    <HeartPulse className="text-red-500" size={24} />
                    <h3 className="font-bold text-gray-800 text-lg">Health Score</h3>
                </div>
                <span className={`text-2xl font-bold ${score >= 70 ? 'text-green-600' : score >= 40 ? 'text-yellow-600' : 'text-red-600'}`}>
                    {score}/100
                </span>
            </div>
            <Progress value={score} className={`h-4 bg-gray-200 [&>div]:${colorClass}`} />
            <p className="text-sm text-gray-500 mt-2 text-right">Based on nutritional value</p>
        </div>
    );
};

export default function FoodResultPage() {
    const { foodResult, scanImage } = useImageContext();
    const router = useRouter();

    if (!foodResult) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="text-center">
                    <p className="text-xl text-gray-500">No food analysis results found.</p>
                    <button
                        onClick={() => router.push("/")}
                        className="mt-4 px-6 py-2 bg-black text-white rounded-full hover:opacity-80 transition-colors"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    if (foodResult.isFood === false) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
                <div className="max-w-md w-full bg-white border border-red-100 rounded-3xl p-8 text-center shadow-lg">
                    <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <AlertTriangle className="w-8 h-8 text-red-500" />
                    </div>
                    <h2 className="text-2xl font-bold mb-3 text-red-600">No Food Detected</h2>
                    <p className="text-gray-500 mb-8 leading-relaxed">
                        We couldn&apos;t definitely identify food in your picture.
                        Please try again with a clearer photo.
                    </p>
                    <button
                        onClick={() => router.push("/")}
                        className="w-full py-4 bg-black text-white rounded-xl font-medium hover:opacity-90 transition-all"
                    >
                        Try Another Photo
                    </button>
                </div>
            </div>
        );
    }

    const {
        identifiedDish = "Analysis Result",
        mainIngredients = ["Unknown Food"],
        calories = 0,
        macros = { protein: "0g", fat: "0g", carbs: "0g" },
        healthScore = 0,
        nutritionalBreakdown = "No details available.",
        improvementTips = [],
        warnings = []
    } = foodResult;

    return (
        <div className="min-h-screen bg-[#F8FAFC] pb-12">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-[#F8FAFC]/80 backdrop-blur-lg border-b border-gray-100 p-4">
                <div className="max-w-4xl mx-auto flex items-center justify-between">
                    <button
                        onClick={() => router.back()}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <ArrowLeft size={24} className="text-gray-700" />
                    </button>
                    <Heading_2 value="Food Analysis" className="text-xl font-bold text-gray-800" />
                    <div className="w-10" />
                </div>
            </header>

            <main className="max-w-4xl mx-auto p-4 md:p-6 space-y-6">

                {/* Hero Section */}
                <section className="flex flex-col md:flex-row gap-6 items-center md:items-start animate-fadeIn">
                    <div className="relative w-full max-w-[280px] aspect-square rounded-3xl overflow-hidden shadow-xl border-4 border-white mx-auto md:mx-0">
                        {scanImage && (
                            <Image src={scanImage} alt="Analyzed Food" fill className="object-cover" />
                        )}
                    </div>

                    <div className="flex-1 w-full space-y-4">
                        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                            <h1 className="text-3xl font-bold text-gray-800 mb-2 capitalize">{identifiedDish}</h1>                            <div className="flex items-center gap-2 text-gray-500">
                                <Flame className="text-orange-500" size={20} />
                                <span className="text-lg font-medium">{calories} Calories</span>
                            </div>
                        </div>

                        <HealthScoreBar score={healthScore} />
                    </div>
                </section>

                {/* Macros */}
                <section className="grid grid-cols-3 gap-3 md:gap-6 animate-fadeInDelay">
                    <MacroCard
                        label="Protein"
                        value={macros.protein}
                        icon={Activity}
                        color="text-blue-500"
                        bgColor="bg-blue-50/50"
                    />
                    <MacroCard
                        label="Fat"
                        value={macros.fat}
                        icon={Droplet}
                        color="text-yellow-500"
                        bgColor="bg-yellow-50/50"
                    />
                    <MacroCard
                        label="Carbs"
                        value={macros.carbs}
                        icon={Wheat}
                        color="text-green-500"
                        bgColor="bg-green-50/50"
                    />
                </section>

                {/* Ingredients Section */}
                <section className="bg-white/60 p-6 rounded-3xl border border-white/50 shadow-sm animate-fadeInDelay">
                    <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <Flame className="text-orange-500" size={20} />
                        Main Ingredients
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {mainIngredients.map((item, i) => (
                            <span
                                key={i}
                                className="px-4 py-2 bg-orange-50 text-orange-700 rounded-full text-sm font-medium border border-orange-100 capitalize"
                            >
                                {item}
                            </span>
                        ))}
                    </div>
                </section>

                {/* Breakdown & Warnings */}
                <section className="grid md:grid-cols-2 gap-6 animate-fadeInDelay2">
                    <div className="bg-white/60 p-6 rounded-3xl border border-white/50 shadow-sm">
                        <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <Info className="text-violet-500" size={20} />
                            Nutritional Breakdown
                        </h3>
                        <p className="text-gray-600 leading-relaxed">
                            {nutritionalBreakdown}
                        </p>
                    </div>

                    {warnings.length > 0 && (
                        <div className="bg-red-50/50 p-6 rounded-3xl border border-red-100 shadow-sm">
                            <h3 className="font-bold text-red-800 mb-4 flex items-center gap-2">
                                <AlertTriangle className="text-red-500" size={20} />
                                Important Notes
                            </h3>
                            <ul className="space-y-3">
                                {warnings.map((warn, i) => (
                                    <li key={i} className="text-sm text-red-700 flex items-start gap-2">
                                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
                                        {warn}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {improvementTips.length > 0 && (
                        <div className="bg-green-50/50 p-6 rounded-3xl border border-green-100 shadow-sm md:col-span-2">
                            <h3 className="font-bold text-green-800 mb-4 flex items-center gap-2">
                                <Quote className="text-green-500" size={20} />
                                Chef&apos;s Tips for Improvement
                            </h3>
                            <ul className="space-y-3">
                                {improvementTips.map((tip, i) => (
                                    <li key={i} className="text-sm text-green-700 flex items-start gap-2">
                                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-green-400 shrink-0" />
                                        {tip}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </section>

            </main>
        </div>
    );
}
