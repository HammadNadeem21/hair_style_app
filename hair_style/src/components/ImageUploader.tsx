// "use client";

// import React, { useCallback, useState } from "react";
// import { useDropzone } from "react-dropzone";
// import { LuUpload } from "react-icons/lu";
// import { FaTimes } from "react-icons/fa";
// import Image from "next/image";


// const ImageUploader: React.FC = () => {
//   const [image, setImage] = useState<string | null>(null);
//   const [file, setFile] = useState<File | null>(null);
//   // const [responseMessage, setResponseMessage] = useState<string>("");

//   const onDrop = useCallback((acceptedFiles: File[]) => {
//     const selected = acceptedFiles[0];
//     if (!selected) return;

//     if (!selected.type.startsWith("image/")) {
//       alert("Only image files are allowed");
//       return;
//     }

//     const reader = new FileReader();
//     reader.onload = () => {
//       setImage(reader.result as string);
//       setFile(selected);
//     };
//     reader.readAsDataURL(selected);
//   }, []);

//   const { getRootProps, getInputProps, isDragActive } = useDropzone({
//     onDrop,
//     accept: { "image/*": [] },
//     multiple: false,
//   });

//   const removeImage = () => {
//     setImage(null);
//     setFile(null);
//   };

//   console.log(file);


//     const handleUpload = async () => {
//     if (!file) return alert("Please select an image");

//     const formData = new FormData();
//     formData.append("image", file);

//     try {
//       const res = await fetch("http://127.0.0.1:5000/api/analyze", {
//         method: "POST",
//         body: formData,
//       });

//       if (!res.ok) {
//         const text = await res.text(); // debug HTML error
//         console.error("Server returned:", text);
//         throw new Error("Network response was not OK");
//       }

//       const data = await res.json(); // <-- now this will succeed
//       console.log("response",data);
//       // setResponseMessage(data.message);
//     } catch (err) {
//       console.log(err);
//       alert("Upload failed. Check Flask server is running and CORS is enabled.");
//     }
//   };
  

//   return (
//     <div className="flex flex-col items-center gap-4 w-full max-w-md">
//       {/* Dropzone */}
//       <div
//         {...getRootProps()}
//         className="w-full h-60 border-2 border-dashed rounded-lg p-6 flex  items-center justify-center cursor-pointer border-gray-400 hover:bg-gray-400/30 transition-all"
//       >
//         <div className="py-3 px-3 mb-2 flex items-center justify-center bg-mySkyBlue/30 rounded-lg">
//           <LuUpload size={25} className="text-blue-400" />
//         </div>

//         <input {...getInputProps()} />

//         {isDragActive ? (
//           <p className="text-gray-400 font-semibold">Drop the image here...</p>
//         ) : (
//           <p className="text-gray-400 font-semibold text-center">
//             Drag & drop an image here, or click to select
//           </p>
//         )}
//       </div>

//       {/* Preview */}
//       {image && (
//         <div className="relative w-64 h-64 mt-3 rounded-lg overflow-hidden shadow-lg">
//           <Image
//             src={image}
//             alt="Uploaded"
//             height={400}
//             width={400}
//           />
//           <button
//             onClick={removeImage}
//             className="absolute top-2 right-2 bg-white rounded-full p-1 shadow hover:bg-red-100 transition"
//           >
//             <FaTimes className="text-red-500" />
//           </button>
//         </div>
//       )}

//             <button
//       onClick={handleUpload}
//       className="py-2 px-5 bg-blue-300 hover:shadow-xl cursor-pointer rounded-lg">Change Hair Style</button>



//     </div>
//   );


 

// };


// export default ImageUploader;












"use client";

import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { LuUpload } from "react-icons/lu";
import { FaTimes, FaCamera } from "react-icons/fa";
import Image from "next/image";
import ColorPicker from "./ColorPicker";

const ImageUploader: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

    const [hairLength, setHairLength] = useState<"long" | "short" | null>(null);
      const [hairStyle, setHairStyle] = useState<"asian" | "western" | null>(null);

      const [showColorPicker, setShowColorPicker] = useState(false);
      const [image, setImage] = useState<string[] | null>(null);
  

  // Dropzone handler
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

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    multiple: false,
  });

  // Camera handler
  const handleCamera = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    setFile(selected);
    setPreview(URL.createObjectURL(selected)); // lightweight preview
  };

  const removeImage = () => {
    setFile(null);
    setPreview(null);
    setImage(null);
  };

  // Compress image before upload
  const compressImage = (file: File, maxSize = 800): Promise<File> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => {
        const img = new window.Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > maxSize) {
              height *= maxSize / width;
              width = maxSize;
            }
          } else {
            if (height > maxSize) {
              width *= maxSize / height;
              height = maxSize;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx?.drawImage(img, 0, 0, width, height);

          canvas.toBlob(
            (blob) => {
              if (blob) {
                const compressedFile = new File([blob], file.name, { type: "image/jpeg" });
                resolve(compressedFile);
              }
            },
            "image/jpeg",
            0.7 // compress to 70%
          );
        };
        img.src = reader.result as string;
      };
      reader.readAsDataURL(file);
    });
  };

  const handleUpload = async () => {
    if(!file && !hairLength && !hairStyle){
        return alert("Please select an image, hair length and style");
    }
    if(!hairLength && !hairStyle){
        return alert("Please select hair length and style");
    }
    if(!hairLength){
        return alert("Please select hair length");
    }
    if(!hairStyle){
        return alert("Please select hair style");
    }
    if (!file) return alert("Please select an image");


    const compressedFile = await compressImage(file);
    const formData = new FormData();
    formData.append("image", compressedFile);


    // formData.append("hair_length", hairLength);
    // formData.append("hair_style", hairStyle);

     console.log("form data", hairLength, hairStyle);

    try {
      const res = await fetch("http://127.0.0.1:5000/api/hairs", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("Server returned:", text);
        throw new Error("Network response was not OK");
      }

      const data = await res.json();

      let cleanString = data.hairstyle_info
        
      cleanString = cleanString.replace(/^```json/, "").replace(/```$/, "");

      cleanString = cleanString.trim();

      cleanString = cleanString.replace(/,\n"/g, ',"');

      // 2: Parse JSON
      const parsed = JSON.parse(cleanString);
      console.log("response", parsed.hairstyles[0]);
      setImage(parsed.hairstyles[0].image_base64);
    } catch (err) {
      console.log(err);
      alert("Upload failed. Check Flask server is running and CORS is enabled.");
    }
  };




  return (
    <div className="flex flex-col items-start gap-4 w-full max-w-md">

      <div className='py-2 px-2 flex flex-col justify-start items-start gap-4'>
      <div className='flex items-center justify-center gap-3 mt-1 mb-1'>
        <label className='block font-medium'>Hair Length: </label>

        <div className='flex items-center justify-start gap-1'>
          <button
            className={`py-1 px-3 rounded-lg ${
              hairLength === "long" ? 'bg-blue-500 text-white' : 'bg-[#bfdbfe] text-black'
            }`}
            onClick={() => setHairLength("long")}
          >
            Long
          </button>

          <button
            className={`py-1 px-3 rounded-lg ${
              hairLength === "short" ? 'bg-blue-500 text-white' : 'bg-[#bfdbfe] text-black'
            }`}
            onClick={() => setHairLength("short")}
          >
            Short
          </button>
        </div>
      </div>

<div className='flex items-center justify-center gap-3 mt-1 mb-1'>
        <label className='block font-medium'>Hair Styles: </label>

        <div className='flex items-center justify-start gap-1'>
          <button
            className={`py-1 px-3 rounded-lg ${
              hairStyle === "asian" ? 'bg-blue-500 text-white' : 'bg-[#bfdbfe] text-black'
            }`}
            onClick={() => setHairStyle("asian")}
          >
            Asian
          </button>

          <button
            className={`py-1 px-3 rounded-lg ${
              hairStyle === "western" ? 'bg-blue-500 text-white' : 'bg-[#bfdbfe] text-black'
            }`}
            onClick={() => setHairStyle("western")}
          >
            Western
          </button>
        </div>
      </div>

<div className="flex items-center justify-center gap-3 mt-1 mb-1">
  <button
  onClick={() => setShowColorPicker((prev) => !prev)}
  className='block font-medium py-1 px-3 bg-gray-400 rounded-lg'>Pick Hair Color </button>

  {showColorPicker && <ColorPicker />}
</div>
     
    </div>

      {/* Dropzone */}
      <div
        {...getRootProps()}
        className="w-full h-60 border-2 border-dashed rounded-lg p-6 flex items-center justify-center cursor-pointer border-gray-400 hover:bg-gray-400/30 transition-all"
      >
        <div className="py-3 px-3 mb-2 flex items-center justify-center bg-mySkyBlue/30 rounded-lg">
          <LuUpload size={25} className="text-blue-400" />
        </div>

        <input {...getInputProps()} />

        {isDragActive ? (
          <p className="text-gray-400 font-semibold">Drop the image here...</p>
        ) : (
          <p className="text-gray-400 font-semibold text-center">
            Drag & drop an image here, or click to select
          </p>
        )}
      </div>

      {/* OR Camera Button */}
      <label className="py-2 px-5 hover:shadow-xl cursor-pointer flex items-center justify-center gap-2 bg-green-200 rounded-lg">
        Take a selfie
        <FaCamera className="text-gray-600 text-[30px]" />
        <input
          type="file"
          accept="image/*"
          capture="user"
          className="hidden"
          onChange={handleCamera}
        />
      </label>

      {/* Preview */}
      {preview && (
        <div className="relative w-64 h-64 mt-3 rounded-lg  shadow-lg">
          <Image
          className="h-[350px] w-[250px] object-cover"
            src={preview}
            alt="Preview"
            height={300}
            width={300}
            objectFit="coverx"
          />
          <button
            onClick={removeImage}
            className="absolute top-2 right-2 bg-white rounded-full p-1 shadow hover:bg-red-100 transition"
          >
            <FaTimes className="text-red-500" />
          </button>
        </div>
      )}

      {/* Upload Button */}
      <button
        onClick={handleUpload}
        className="py-2 px-5 mt-[100px] bg-blue-300 hover:shadow-xl cursor-pointer rounded-lg"
      >
        Change Hair Style
      </button>

      {/* {image && (
        <div className="flex flex-col gap-[50px]">{
        // image.map((imgSrc, index) => (
          <div  className="relative w-64 h-64 mt-[100px] rounded-lg  shadow-lg">
            <Image
              src={image[0]}
              alt={`Generated Image`}
              height={500}
              width={400}
              objectFit="coverx"
            />
          </div>
        // ))
        }</div>
      )} */}
    </div>
  );
};

export default ImageUploader;














































// "use client";

// import Image from "next/image";
// import React, { useState } from "react";

// const ImageUploader = () => {
//   const [imageFile, setImageFile] = useState<File | null>(null);
//   const [preview, setPreview] = useState<string | null>(null);
  
//   const [responseMessage, setResponseMessage] = useState<string>("");

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];

//     if (!file) return;

//     // Only images allowed
//     if (!file.type.startsWith("image/")) {
//       alert("Only image files are allowed");
//       return;
//     }

//     setImageFile(file);

//     // Preview image
//     const url = URL.createObjectURL(file);
//     setPreview(url);
//   };

//   const removeImage = () => {
//     setImageFile(null);
//     setPreview(null);
//   };


//   console.log("image", responseMessage);

// //   const handleUpload = async() => {
// // if (!imageFile){
// //     alert("No image selected");
// //     return;
// // };

// // const formData = new FormData();
// // formData.append("image", imageFile);

// // try{
// //     const response = await fetch(`${process.env.API_URL}/api/analyze`, {
// //         method: "POST",
// //         body: formData,
// //     })

// //    if (!response) {
// //       throw new Error("Network response was not OK");
// //     }

// //     const data = await response.json();
// //     console.log("response data", data);
// // }catch (error){
// //     console.error("Error uploading image:", error);
// // }
// //   }
  


  // const handleUpload = async () => {
  //   if (!imageFile) return alert("Please select an image");

  //   const formData = new FormData();
  //   formData.append("image", imageFile);

  //   try {
  //     const res = await fetch("http://127.0.0.1:5000/api/analyze", {
  //       method: "POST",
  //       body: formData,
  //     });

  //     if (!res.ok) {
  //       const text = await res.text(); // debug HTML error
  //       console.error("Server returned:", text);
  //       throw new Error("Network response was not OK");
  //     }

  //     const data = await res.json(); // <-- now this will succeed
  //     console.log("response",data);
  //     setResponseMessage(data.message);
  //   } catch (err) {
  //     console.error(err);
  //     alert("Upload failed. Check Flask server is running and CORS is enabled.");
  //   }
  // };


//   return (
//     <div className="w-full flex flex-col items-center gap-4">

//       {/* Upload Box */}
//       <label
//         htmlFor="imageUpload"
//         className="w-full h-48 border-2 border-dashed border-blue-400 rounded-xl flex flex-col items-center justify-center cursor-pointer bg-white hover:bg-blue-50 transition-all"
//       >
//         <p className="text-blue-500 font-semibold">Click to upload image</p>
//         <p className="text-gray-500 text-sm mt-1">PNG, JPG, JPEG allowed</p>
//         <input
//           id="imageUpload"
//           type="file"
//           accept="image/*"
//           onChange={handleFileChange}
//           className="hidden"
//         />
//       </label>

//       {/* Preview */}
//       {preview && (
//         <div className="relative border border-blue-400 rounded-xl p-3 bg-blue-50">
//           <Image
//             src={preview}
//             alt="preview"
//             height={100}
//             width={100}
//             className="w-40 h-40 object-cover rounded-lg"
//           />
//           <button
//             onClick={removeImage}
//             className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-sm"
//           >
//             Remove
//           </button>
//         </div>
//       )}

      // <button
      // onClick={handleUpload}
      // className="py-2 px-5 bg-blue-300 hover:shadow-xl cursor-pointer rounded-lg">Change Hair Style</button>

//     </div>
//   );
// };

// export default ImageUploader;
