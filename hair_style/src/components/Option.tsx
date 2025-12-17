/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { MdOutlineFileUpload } from "react-icons/md";
import { X } from "lucide-react";
import { Heading_2 } from "./Text_Style/Heading_2";
import { SmallText } from "./Text_Style/Small_text";
import { IoCameraOutline } from "react-icons/io5";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import ColorPicker from "./ColorPicker";
import { MyButton } from "./Button";
import { useRouter } from "next/navigation";
import { useImageContext } from "@/context/ImageContext";
import { useCreditContext } from "@/context/CreditContext";
import { calculateCredits } from "@/../helper_function/calculate_credits";
import { useSession } from "next-auth/react";
import Hair_fields from "./Fields/Hair_fields";
import Beared_fields from "./Fields/Beared_fields";


const Option = () => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [hairLength, setHairLength] = useState<"long" | "short" | null>(null);
  const [hairStyle, setHairStyle] = useState<Array<"asian" | "western">>([]);
  const [color, setColor] = useState("#aabbcc");
  const [open, setOpen] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [beardLength, setBeardLength] = useState<"no moustache" | "light moustache" | "thick & dominant" | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<{ hair: boolean; beared: boolean }>({
    hair: false,
    beared: false
  });
  const [beardCoverage, setBeardCoverage] = useState<Array<"full" | "Patchy cheeks" | "Weak moustache">>([]);

  // Toggle function for selecting options
  const toggleOption = (option: "hair" | "beared") => {
    setSelectedOptions(prev => ({
      ...prev,
      [option]: !prev[option]
    }));
  };

  // Check if at least one option is selected
  const hasSelectedOption = selectedOptions.hair || selectedOptions.beared;


  const router = useRouter()
  const { setScanImage, setResultImages } = useImageContext();
  const { setCredits } = useCreditContext();
  const { data: session } = useSession();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);





  // for image uploader

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const selected = acceptedFiles[0];
    if (!selected) return;

    if (!selected.type.startsWith("image/")) {
      alert("Only image files are allowed");
      return;
    }

    setFile(selected);
    setPreview(URL.createObjectURL(selected)); // lightweight preview
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    multiple: false,
  });


  const handleCamera = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    setFile(selected);
    setPreview(URL.createObjectURL(selected)); // lightweight preview
  };



  const handleUpload = async () => {
    if (!file) return alert("Please upload a selfie first!");

    if (!hairLength && hairStyle.length === 0) {
      return alert("Please select some style options first!");
    }

    setLoading(true);

    // Save image to Context for Scan page
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setScanImage(e.target.result as string);
        router.push("/Scan");
      }
    };
    reader.readAsDataURL(file);

    // Create FormData to send the file safely
    const formData = new FormData();
    formData.append("image", file);
    formData.append("hair_length", hairLength || "");
    formData.append("hair_style", hairStyle.join(", "));
    formData.append("hair_color", color);

    try {
      // Check if user is logged in
      if (!session?.user?.email) {
        alert("Please log in to generate hairstyles");
        setLoading(false);
        return;
      }

      // router.push("/Scan"); // Moved inside reader.onload
      const res = await fetch("/api/generate", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      console.log("response", data.results);
      console.log("totalTokens", data.totalTokens);

      if (data.results && Array.isArray(data.results)) {
        // Calculate credits used
        let creditsUsed = 0;
        if (data.totalTokens) {
          creditsUsed = calculateCredits(data.totalTokens);
          console.log("Credits to deduct:", creditsUsed);
        }

        // Deduct credits from database
        if (creditsUsed > 0) {
          const deductRes = await fetch("/api/credits/deduct", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: session.user.email,
              creditsToDeduct: creditsUsed
            })
          });

          const deductData = await deductRes.json();

          if (!deductRes.ok) {
            alert(deductData.error || "Failed to deduct credits");
            setLoading(false);
            // Redirect back to home if credit deduction fails
            router.push("/");
            return;
          }

          // Update credit context with remaining credits
          setCredits(deductData.remainingCredits);
          console.log("Remaining credits:", deductData.remainingCredits);
        }

        // Save results in Context
        setResultImages(data.results);

        // 3. Navigate to result page
        router.push("/result");
      } else {
        console.error("API Error:", data);
        alert(data.error || "Failed to generate images. Please try again.");
        // Redirect back to home if generation fails
        router.push("/");
      }
    } catch (e: any) {
      console.error("Fetch Error:", e);
      alert(`Error generating images: ${e.message}`);
      // Redirect back to home if there's an exception
      router.push("/");
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="w-full">
      {!preview ? (
        <div className="flex flex-col items-center justify-center w-full animate-fadeIn">
          <div className="grid grid-cols-2 gap-4 w-full mt-2">
            <div
              className="flex flex-col items-center justify-center gap-3 bg-white/40 backdrop-blur-md border border-white/50 shadow-sm hover:shadow-lg rounded-2xl p-6 transition-all duration-300 cursor-pointer hover:-translate-y-1 group"
              {...getRootProps()}
            >
              <input {...getInputProps()} className="hidden" />

              <div className="flex items-center justify-center p-4 rounded-xl bg-primaryColor/10 text-primaryColor   transition-colors duration-300">
                <MdOutlineFileUpload size={32} />
              </div>
              <div className="text-center">
                <Heading_2 value="Upload Photo" className="font-semibold text-lg text-grayColor" />
                <SmallText
                  value="From Gallery"
                  textColor="text-gray-500"
                  className="text-center text-xs mt-1"
                />
              </div>
            </div>

            <div
              className="flex flex-col items-center justify-center gap-3 bg-white/40 backdrop-blur-md border border-white/50 shadow-sm hover:shadow-lg rounded-2xl p-6 transition-all duration-300 cursor-pointer hover:-translate-y-1 group"
              onClick={() => cameraInputRef.current?.click()}
            >
              <input
                ref={cameraInputRef}
                type="file"
                accept="image/*"
                capture="user"
                className="hidden"
                onChange={handleCamera}
              />
              <div className="flex items-center justify-center p-4 rounded-xl bg-primaryColor/10 text-primaryColor  transition-colors duration-300">
                <IoCameraOutline size={32} />
              </div>
              <div className="text-center">
                <Heading_2 value="Take Selfie" className="font-semibold text-lg text-grayColor" />
                <SmallText
                  value="Camera"
                  textColor="text-gray-500"
                  className="text-center text-xs mt-1"
                />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-start gap-6 w-full animate-fadeIn">

          {/* Image Preview */}
          <div className="relative w-full max-w-[280px] aspect-[3/4] rounded-2xl overflow-hidden shadow-lg border border-white/50">
            <Image
              src={preview}
              alt="preview"
              fill
              className="object-cover"
            />
            <button
              onClick={() => {
                setPreview(null);
                setFile(null);
              }}
              className="absolute top-3 right-3 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full backdrop-blur-sm transition-all duration-200 z-10"
            >
              <X size={16} />
            </button>

            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
          </div>

          {/* Controls */}
          <div className="flex flex-col items-center justify-center gap-4 w-full">

            <div className="flex items-center justify-center gap-4 w-full">
              <button
                onClick={() => toggleOption("hair")}
                className={`text-sm font-medium py-2 px-6 rounded-lg transition-all duration-300 border-2 ${selectedOptions.hair
                  ? 'bg-primaryColor text-white border-primaryColor shadow-md'
                  : 'bg-white text-gray-500 border-gray-300'
                  }`}
              >
                Hair
              </button>
              <button
                onClick={() => toggleOption("beared")}
                className={`text-sm font-medium py-2 px-6 rounded-lg transition-all duration-300 border-2 ${selectedOptions.beared
                  ? 'bg-primaryColor text-white border-primaryColor shadow-md'
                  : 'bg-white text-gray-500 border-gray-300'
                  }`}
              >
                Beard
              </button>
            </div>

            {selectedOptions.hair && (
              <Hair_fields
                hairLength={hairLength}
                setHairLength={setHairLength}
                hairStyle={hairStyle}
                setHairStyle={setHairStyle}
              />
            )}

            {selectedOptions.beared && (
              <Beared_fields
                beardCoverage={beardCoverage}
                setBeardCoverage={setBeardCoverage}
                beardLength={beardLength}
                setBeardLength={setBeardLength}
              />
            )}

            {hasSelectedOption && (
              <div className="relative flex items-center justify-center w-full z-20">
                <div className="flex items-center gap-3 bg-gray-50 px-4 py-2 rounded-xl border border-gray-100">
                  <button
                    onClick={() => setOpen(prev => !prev)}
                    className="text-sm font-medium py-3 px-3 rounded-lg transition-colors bg-primaryColor text-white"
                  >
                    Hair Color
                  </button>
                  <div className="h-4 w-[1px] bg-gray-300" />
                  <button
                    onClick={() => setOpen(prev => !prev)}
                    className="flex items-center gap-2"
                  >
                    <div
                      className="w-6 h-6 rounded-full border border-gray-200 shadow-sm ring-2 ring-white"
                      style={{ backgroundColor: color }}
                    />
                  </button>
                </div>

                {open && (
                  <div
                    ref={pickerRef}
                    className="absolute bottom-full mb-3 transition-all duration-300 animate-fadeIn bg-white p-3 rounded-2xl shadow-xl border border-gray-100"
                  >
                    <ColorPicker color={color} onChange={setColor} />
                  </div>
                )}
              </div>
            )}

          </div>

          {hasSelectedOption && (
            <MyButton
              value={loading ? "Generating..." : "Generate Hairstyle"}
              variant="default"
              onClick={() => file && handleUpload()}
              disabled={!file || loading}
              loading={loading}
              className="w-full max-w-[280px] py-4 text-lg shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
            />
          )}

        </div>
      )}
    </div>
  );
};




export default Option;
