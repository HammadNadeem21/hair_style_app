"use client";
import React from "react";
import Lottie from "lottie-react";
import animation from "../../../animation/scan line.json";
import Image from "next/image";
import { useImageContext } from "@/context/ImageContext";
import { SmallText } from "@/components/Text_Style/Small_text";

const Page = () => {
  const { scanImage } = useImageContext();

  const [loadingText, setLoadingText] = React.useState("Scanning your hairstyle...");

  React.useEffect(() => {
    const texts = [
      "Scanning your hairstyle...",
      "Analyzing face shape...",
      "Detecting features...",
      "Generating new look...",
      "Almost there..."
    ];
    let index = 0;

    const interval = setInterval(() => {
      index = (index + 1) % texts.length;
      setLoadingText(texts[index]);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-primaryColor/10 via-white to-white relative overflow-hidden">

      {/* Background decoration */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-primaryColor/20 rounded-full blur-[100px]" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-blue-400/20 rounded-full blur-[100px]" />

      <div className="z-10 flex flex-col items-center gap-8 animate-fadeIn">

        {/* Glassmorphism Card */}
        <div className="relative p-4 bg-white/40 backdrop-blur-xl border border-white/50 rounded-3xl shadow-2xl">
          <div className="relative w-[280px] h-[380px] rounded-2xl overflow-hidden shadow-inner bg-gray-100">

            {/* User Image */}
            <Image
              src={scanImage || "/selfie3.jpeg"}
              alt="Scanning photo"
              fill
              className="object-cover"
              priority
            />

            {/* Scanning Overlay */}
            <div className="absolute inset-0 bg-primaryColor/10 z-10 mix-blend-overlay" />

            {/* Lottie Animation */}
            <div className="absolute inset-0 z-20 opacity-90 pointer-events-none">
              <Lottie
                animationData={animation}
                loop
                className="w-full h-full"
                style={{
                  transform: "scale(4.5)",
                  filter: "invert(57%) sepia(88%) saturate(2218%) hue-rotate(182deg) brightness(102%) contrast(98%)"
                }}
              />

            </div>
          </div>

        </div>
      </div>
      <SmallText value={loadingText} textColor="text-primaryColor" className="font-bold text-xl mt-5 animate-pulse transition-all duration-500" />

    </div>

  );
};

export default Page;
