"use client";

import React from "react";
import { useImageContext } from "@/context/ImageContext";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowLeft, Sparkles, Target, Zap, Waves, Scissors, Heart, Quote, LucideIcon, AlertCircle } from "lucide-react";
import { Heading_2 } from "@/components/Text_Style/Heading_2";

import { Progress } from "@/components/ui/progress";

const ScoreBadge = ({ label, score, icon: Icon, color }: { label: string; score: number; icon: LucideIcon; color: string }) => (
    <div className={`flex flex-col items-center p-4 rounded-2xl bg-white/40 backdrop-blur-md border border-white/50 shadow-sm transition-all hover:shadow-md ${color}`}>
        <div className="flex items-center gap-2 mb-2">
            <Icon size={20} className="text-gray-700" />
            <span className="text-sm font-semibold text-gray-700">{label}</span>
        </div>
        <div className="text-3xl font-bold text-gray-900">{score}</div>
    </div>
);

const FeatureBar = ({ label, score }: { label: string; score: number }) => (
    <div className="w-full mb-4">
        <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-medium text-gray-700 capitalize">{label.replace(/([A-Z])/g, ' $1')}</span>
            <span className="text-sm font-bold text-primaryColor">{score}%</span>
        </div>
        <Progress value={score} className="h-2 bg-gray-200" />
    </div>
);

const TipCard = ({ title, tips, icon: Icon }: { title: string; tips: string[]; icon: LucideIcon }) => (
    <div className="bg-white/40 backdrop-blur-md border border-white/50 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all">
        <div className="flex items-center gap-2 mb-4">
            <div className="p-2 rounded-lg bg-primaryColor/10 text-primaryColor">
                <Icon size={20} />
            </div>
            <h3 className="font-bold text-gray-800 capitalize">{title}</h3>
        </div>
        <ul className="space-y-2">
            {tips.map((tip, i) => (
                <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primaryColor shrink-0" />
                    {tip}
                </li>
            ))}
        </ul>
    </div>
);

export default function GlowResultPage() {
    const { glowResult, scanImage } = useImageContext();
    const router = useRouter();

    if (!glowResult) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center">
                <div className="text-center">
                    <p className="text-xl text-gray-400">No results found.</p>
                    <button
                        onClick={() => router.push("/")}
                        className="mt-4 px-6 py-2 bg-white text-black rounded-full hover:bg-gray-200 transition-colors"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    // Explicitly check if isHumanFace is false (it might be undefined in older results, but new ones will have it)
    if (glowResult.isHumanFace === false) {
        return (
            <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6">
                <div className="max-w-md w-full bg-zinc-900/50 border border-red-500/20 rounded-2xl p-8 text-center backdrop-blur-xl">
                    <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <AlertCircle className="w-8 h-8 text-red-500" />
                    </div>
                    <h2 className="text-2xl font-bold mb-3 text-red-400">No Face Detected</h2>
                    <p className="text-gray-400 mb-8 leading-relaxed">
                        We couldn't detect a clear human face in your photo.
                        Please upload a clear selfie with good lighting for the best analysis.
                    </p>
                    <button
                        onClick={() => router.push("/")}
                        className="w-full py-4 bg-white text-black rounded-xl font-medium hover:bg-gray-200 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                    >
                        Try Another Photo
                    </button>
                </div>
            </div>
        );
    }

    // Default values in case fields are missing (though if isHumanFace is true, they should be there)
    const {
        overallScore = 0,
        potentialScore = 0,
        facialBreakdown = { symmetry: 0, skinQuality: 0, jawline: 0, eyes: 0, hairAppearance: 0 },
        strengths = [],
        improvementAreas = [],
        maxxingTips = { grooming: [], skincare: [], hairstyle: [], lifestyle: [] },
        disclaimer = "AI-generated analysis."
    } = glowResult;
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
                    <Heading_2 value="Glow-Up Analysis" className="text-xl font-bold text-gray-800" />
                    <div className="w-10" /> {/* Spacer */}
                </div>
            </header>

            <main className="max-w-4xl mx-auto p-4 md:p-6 space-y-8">
                {/* Hero Section */}
                <section className="flex flex-col md:flex-row gap-8 items-center md:items-start animate-fadeIn">
                    <div className="relative w-full max-w-[280px] aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
                        {scanImage && (
                            <Image src={scanImage} alt="Analysis Target" fill className="object-cover" />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    </div>

                    <div className="flex-1 w-full space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <ScoreBadge label="Current Glow" score={overallScore} icon={Sparkles} color="hover:border-primaryColor/50" />
                            <ScoreBadge label="Potential" score={potentialScore} icon={Target} color="hover:border-blue-400/50" />
                        </div>

                        <div className="bg-white/60 backdrop-blur-md border border-white/80 rounded-3xl p-6 shadow-sm">
                            <h3 className="font-bold text-gray-800 mb-6 flex items-center gap-2">
                                <Zap className="text-yellow-500" size={20} />
                                Facial Breakdown
                            </h3>
                            {Object.entries(facialBreakdown).map(([key, score]) => (
                                <FeatureBar key={key} label={key} score={score as number} />
                            ))}
                        </div>
                    </div>
                </section>

                {/* Insights Section */}
                <section className="grid md:grid-cols-2 gap-6 animate-fadeInDelay">
                    <div className="bg-green-50/50 border border-green-100 rounded-3xl p-6">
                        <h3 className="font-bold text-green-800 mb-4 flex items-center gap-2">
                            <Heart className="text-green-600" size={20} />
                            Key Strengths
                        </h3>
                        <ul className="space-y-3">
                            {strengths.map((str, i) => (
                                <li key={i} className="text-sm text-green-700 flex items-start gap-2">
                                    <span className="mt-1 text-green-500 text-lg leading-none">✓</span>
                                    {str}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="bg-amber-50/50 border border-amber-100 rounded-3xl p-6">
                        <h3 className="font-bold text-amber-800 mb-4 flex items-center gap-2">
                            <Target className="text-amber-600" size={20} />
                            Improvement Areas
                        </h3>
                        <ul className="space-y-3">
                            {improvementAreas.map((area, i) => (
                                <li key={i} className="text-sm text-amber-700 flex items-start gap-2">
                                    <span className="mt-1 text-amber-500 text-lg leading-none">→</span>
                                    {area}
                                </li>
                            ))}
                        </ul>
                    </div>
                </section>

                {/* Coaching Tips */}
                <section className="space-y-6 animate-fadeInDelay2">
                    <div className="flex items-center gap-3 mb-2">
                        <Sparkles className="text-primaryColor" size={24} />
                        <Heading_2 value="Personalized Tips" className="font-bold text-2xl text-gray-800" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <TipCard title="hair style" tips={maxxingTips.hairstyle} icon={Scissors} />
                        <TipCard title="grooming" tips={maxxingTips.grooming} icon={Zap} />
                        <TipCard title="skincare" tips={maxxingTips.skincare} icon={Waves} />
                        <TipCard title="lifestyle" tips={maxxingTips.lifestyle} icon={Heart} />
                    </div>
                </section>

                {/* Disclaimer */}
                <footer className="mt-12 p-6 bg-gray-100/50 rounded-2xl border border-gray-200">
                    <div className="flex items-start gap-3">
                        <Quote className="text-gray-400 rotate-180 shrink-0" size={20} />
                        <p className="text-xs text-gray-500 leading-relaxed italic">
                            {disclaimer}
                        </p>
                    </div>
                </footer>
            </main>
        </div>
    );
}
