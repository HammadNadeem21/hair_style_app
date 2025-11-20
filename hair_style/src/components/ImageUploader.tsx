// "use client";

// import React, { useCallback, useState } from "react";
// import { useDropzone } from "react-dropzone";
// import { LuUpload } from "react-icons/lu";
// import { FaTimes } from "react-icons/fa";
// import Image from "next/image";

// const ImageUploader: React.FC = () => {
//   const [image, setImage] = useState<string | null>(null);
//   const [file, setFile] = useState<File | null>(null);

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

//   return (
//     <div className="flex flex-col items-center gap-4 w-full max-w-md">
//       {/* Dropzone */}
//       <div
//         {...getRootProps()}
//         className="w-full h-60 border-2 border-dashed rounded-lg p-6 flex  items-center justify-center cursor-pointer bg-black border-black hover:bg-gray-400 transition-all"
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
//     </div>
//   );
// };

// export default ImageUploader;





"use client";

import Image from "next/image";
import React, { useState } from "react";

const ImageUploader = () => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    // Only images allowed
    if (!file.type.startsWith("image/")) {
      alert("Only image files are allowed");
      return;
    }

    setImageFile(file);

    // Preview image
    const url = URL.createObjectURL(file);
    setPreview(url);
  };

  const removeImage = () => {
    setImageFile(null);
    setPreview(null);
  };


  console.log("image", imageFile);
  

  return (
    <div className="w-full flex flex-col items-center gap-4">

      {/* Upload Box */}
      <label
        htmlFor="imageUpload"
        className="w-full h-48 border-2 border-dashed border-blue-400 rounded-xl flex flex-col items-center justify-center cursor-pointer bg-white hover:bg-blue-50 transition-all"
      >
        <p className="text-blue-500 font-semibold">Click to upload image</p>
        <p className="text-gray-500 text-sm mt-1">PNG, JPG, JPEG allowed</p>
        <input
          id="imageUpload"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </label>

      {/* Preview */}
      {preview && (
        <div className="relative border border-blue-400 rounded-xl p-3 bg-blue-50">
          <Image
            src={preview}
            alt="preview"
            height={100}
            width={100}
            className="w-40 h-40 object-cover rounded-lg"
          />
          <button
            onClick={removeImage}
            className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-sm"
          >
            Remove
          </button>
        </div>
      )}

      <button className="py-2 px-5 bg-blue-300 hover:shadow-xl cursor-pointer rounded-lg">Change Hair Style</button>

    </div>
  );
};

export default ImageUploader;
