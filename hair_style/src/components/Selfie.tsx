"use client";

import { useRef, useState } from "react";

export default function SelfieCamera({ onCapture }: { onCapture: (img: string, file: File) => void }) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" }, // Selfie Camera
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setIsCameraOn(true);
      }
    } catch (err) {
      alert("Camera access denied");
      console.log(err);
    }
  };

  const capturePhoto = () => {
    if (!canvasRef.current || !videoRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const imgData = canvas.toDataURL("image/png");
    setPreview(imgData);

    // Convert to File for backend upload
    fetch(imgData)
      .then((res) => res.blob())
      .then((blob) => {
        const file = new File([blob], "selfie.png", {
          type: "image/png",
        });

        onCapture(imgData, file);
      });
  };

  return (
    <div className="flex flex-col items-center gap-4">

      {/* Camera Start Button */}
      {!isCameraOn && (
        <button
          onClick={startCamera}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Open Selfie Camera
        </button>
      )}

      {/* Live Camera */}
      {isCameraOn && (
        <video
          ref={videoRef}
          className="w-64 h-64 rounded-lg shadow"
        />
      )}

      {/* Capture Button */}
      {isCameraOn && (
        <button
          onClick={capturePhoto}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Take Selfie
        </button>
      )}

      {/* Hidden Canvas */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Preview */}
      {preview && (
        <img src={preview} className="w-64 h-64 rounded-lg shadow mt-3" />
      )}
    </div>
  );
}
