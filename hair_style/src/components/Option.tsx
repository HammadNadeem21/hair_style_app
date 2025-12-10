/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { MdOutlineFileUpload } from "react-icons/md";
import { Heading_2 } from "./Text_Style/Heading_2";
import { SmallText } from "./Text_Style/Small_text";
import { IoCameraOutline } from "react-icons/io5";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import { MultiSelect } from "./MultiSelector";
import ColorPicker from "./ColorPicker";
import { MyButton } from "./Button";
import { useRouter } from "next/navigation";
import { useImageContext } from "@/context/ImageContext";


const Option = () => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [hairLength, setHairLength] = useState<"long" | "short" | null>(null);
  const [hairStyle, setHairStyle] = useState<Array<"asian" | "western">>([]);
  const [color, setColor] = useState("#aabbcc");
  const [open, setOpen] = useState(false);
  const [image, setImage] = useState<string[] | null>(null);
  const [image1, setImage1] = useState<string | null>(null);

  const pickerRef = useRef<HTMLDivElement>(null);
  const [result, setResult] = useState<string | null>(null);


  const router = useRouter()
  const { setScanImage, setResultImages } = useImageContext();


  // Close when clicking outside
  // useEffect(() => {
  //   const handleClick = (e: MouseEvent) => {
  //     if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
  //       setOpen(false);
  //     }
  //   };

  //   if (open) {
  //     document.addEventListener("mousedown", handleClick);
  //   } else {
  //     document.removeEventListener("mousedown", handleClick);
  //   }

  //   return () => {
  //     document.removeEventListener("mousedown", handleClick);
  //   };
  // }, [open]);
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

  // debug/use generated images when available
  useEffect(() => {
    if (image && image.length) {
      console.log("Generated images:", image);
    }
  }, [image]);


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


  //   const handleUpload = async () => {



  //   if (!file) {
  //     alert("No file selected");
  //     return;
  //   }
  //   const formData = new FormData();
  //   formData.append("image", file);


  //   // formData.append("hair_length", hairLength);
  //   // formData.append("hair_style", hairStyle);

  //    console.log("form data", hairLength, hairStyle);

  //   try {
  //     const res = await fetch("/api/hairs", {
  //       method: "POST",
  //       body: formData,
  //     });

  //     if (!res.ok) {
  //       const text = await res.text();
  //       console.error("Server returned:", text);
  //       throw new Error("Network response was not OK");
  //     }

  //     const data = await res.json();

  //     // let cleanString = data.hairstyle_info

  //     // cleanString = cleanString.replace(/^```json/, "").replace(/```$/, "");

  //     // cleanString = cleanString.trim();

  //     // cleanString = cleanString.replace(/,\n"/g, ',"');

  //     // 2: Parse JSON
  //     // const parsed = JSON.parse(cleanString);
  //     console.log("response", data);
  //     // setImage(parsed.hairstyles[0].image_base64);
  //   } catch (err) {
  //     console.log(err);
  //     alert("Upload failed. Check Flask server is running and CORS is enabled.");
  //   }
  // };



  // const handleUpload = async (fileToUpload: File) => {
  //   const reader = new FileReader();
  //   reader.onload = async () => {
  //     try {
  //       const base64Image = (reader.result as string).split(",")[1];

  //       const res = await fetch("/api/hair_style", {
  //         method: "POST",
  //         headers: { "Content-Type": "application/json" },
  //         body: JSON.stringify({ base64Image }),
  //       });

  //       if (!res.ok) {
  //         const text = await res.text();
  //         console.error("Server returned:", text);
  //         throw new Error("Network response was not OK");
  //       }

  //       const data = await res.json();
  //       console.log("AI response:", data);
  //       setImage1(data.hairstyles[0].image_base64)

  //       // Normalize returned images into data URIs and save in state
  //       const imagesArr: string[] = [];

  //       if (Array.isArray(data.images) && data.images.length) {
  //         for (const img of data.images) {
  //           imagesArr.push(typeof img === "string" && img.startsWith("data:") ? img : `data:image/png;base64,${img}`);
  //         }
  //       } else if (Array.isArray(data.hairstyles) && data.hairstyles.length) {
  //         for (const h of data.hairstyles) {
  //           if (h?.image_base64) imagesArr.push(`data:image/png;base64,${h.image_base64}`);
  //         }
  //       } else if (data.image) {
  //         imagesArr.push(typeof data.image === "string" && data.image.startsWith("data:") ? data.image : `data:image/png;base64,${data.image}`);
  //       }

  //       setImage(imagesArr.length ? imagesArr : null);
  //     } catch (err) {
  //       console.error("Upload failed:", err);
  //       alert("Upload failed. Check server and CORS.");
  //     }
  //   };

  //   reader.readAsDataURL(fileToUpload);
  // };



  const handleUpload = async () => {
    if (!file) return alert("Please upload a selfie first!");

    if (!hairLength && hairStyle.length === 0) {
      return alert("Please select some style options first!");
    }

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
      // router.push("/Scan"); // Moved inside reader.onload
      const res = await fetch("/api/generate", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      console.log("response", data.results);

      if (data.results && Array.isArray(data.results)) {
        // Save results in Context
        setResultImages(data.results);

        // 3. Navigate to result page
        router.push("/result");
      } else {
        alert("Failed to generate images.");
      }
    } catch (e) {
      console.error(e);
      alert("Error generating images.");
    } finally {
      // setLoading(false);
    }
  };



  return (
    <div className="w-full">
      <div className="   flex flex-col items-center justify-center ">
        <div className="grid grid-cols-2 py-1 mt-5">
          <div
            className="flex flex-col items-center justify-start gap-2 "
            {...getRootProps()}
          >
            <input {...getInputProps()} className="hidden" />

            <div className="flex items-center justify-center py-3 px-3 rounded-lg bg-primaryColor/20 text-primaryColor">
              <MdOutlineFileUpload size={40} />
            </div>
            <Heading_2 value="Upload Photo" className="font-normal" />
            <SmallText
              value="Use existing photos from your gallery."
              textColor="text-grayColor"
              className="text-center text-xs"
            />
          </div>

          <div className="flex flex-col items-center justify-start gap-2 ">
            <input type="file" accept="image/*"
              capture="user"
              className="hidden" onChange={handleCamera} />
            <div className="flex items-center justify-center py-3 px-3 rounded-lg bg-primaryColor/20 text-primaryColor">
              <IoCameraOutline size={40} />
            </div>
            <Heading_2 value="Take Selfie" className="font-normal" />
            <SmallText
              value="Capture a new photo instantly."
              textColor="text-grayColor"
              className="text-center text-xs"
            />
          </div>
        </div>

        {/* <SmallText value='Privacy Policy Terms of Service' textColor='text-primaryColor' className='absolute bottom-0'/> */}
      </div>

      {preview && (
        <div className="flex flex-col items-start justify-start gap-2 mt-7">
          <div className="h-[200px] w-[200px] bg-blue-300 relative">
            <Image
              src={preview}
              alt="preview"
              height={500}
              width={500}
              className="h-full w-full"
            />
            <button
              onClick={() => {
                setPreview(null);
                setFile(null);
                setResult(null)
              }}
              className="absolute top-2 right-2  text-white bg-black/50 px-1 h-5 w-5 rounded-full  transition flex items-center justify-center"
            >
              ✕
            </button>
          </div>

          <div className="flex flex-col items-center justify-center gap-3 mt-1 mb-1">

            <div className='flex items-center justify-start gap-2 w-full '>
              <label className='block font-medium text-grayColor'>Hair Length: </label>

              <div className='flex items-center justify-start gap-1'>
                <button
                  className={`py-1 px-3 rounded-lg text-sm ${hairLength === "long" ? 'bg-primaryColor text-white' : 'bg-white text-grayColor border border-grayColor'
                    }`}
                  onClick={() => setHairLength("long")}
                >
                  Long
                </button>

                <button
                  className={`py-1 px-3 rounded-lg text-sm ${hairLength === "short" ? 'bg-primaryColor text-white' : 'bg-white text-grayColor border border-grayColor'
                    }`}
                  onClick={() => setHairLength("short")}
                >
                  Short
                </button>
              </div>
            </div>

            <MultiSelect
              label="Hair Styles:"
              options={["asian", "western"]}
              selected={hairStyle}
              onChange={setHairStyle}
            />

            <div className="relative flex items-center justify-start w-full">

              {/* BUTTON */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setOpen(prev => !prev)}
                  className="px-4 py-2 rounded-lg bg-primaryColor text-white font-medium"
                >
                  Pick Color
                </button>
                <div
                  className="w-8 h-8 rounded-full border border-gray-300 shadow-sm"
                  style={{ backgroundColor: color }}
                  title="Selected Color"
                />
              </div>

              {/* DROPDOWN PICKER */}
              {open && (
                <div
                  ref={pickerRef}
                  className="absolute left-[120px] top-[-160px] bottom-0 mt-2  transition-all duration-300 animate-fadeIn z-50"
                >
                  <ColorPicker color={color} onChange={setColor} />

                  {/* <div className="mt-3 w-full h-8 rounded-md border" style={{ background: color }}></div> */}
                </div>
              )}
            </div>
          </div>

          <MyButton
            value="Change Hair Style"
            variant="default"
            onClick={() => file && handleUpload()}
            disabled={!file}
          />

          {image && result && (
            <Image src={result} alt="image" height={200} width={200} />
          )}
        </div>


      )}


    </div>
  );
};

export default Option;
