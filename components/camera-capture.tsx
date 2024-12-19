"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Camera, RotateCcw } from "lucide-react";

interface CameraCaptureProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDataExtracted: (data: {
    name?: string;
    address?: string;
    idNumber?: string;
  }) => void;
}

export default function CameraCapture({
  open,
  onOpenChange,
  onDataExtracted,
}: CameraCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCameraActive(true);
        setError(null);
      }
    } catch (err) {
      setError("Could not access camera. Please make sure you have granted camera permissions.");
      console.error("Error accessing camera:", err);
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setIsCameraActive(false);
    }
  };

  const captureImage = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    setIsProcessing(true);
    try {
      // Capture frame from video
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      ctx?.drawImage(video, 0, 0);

      // Convert to base64
      const imageData = canvas.toDataURL("image/jpeg");

      // TODO: Send to OCR API
      // For now, simulate OCR with dummy data
      setTimeout(() => {
        const extractedData = {
          name: "John Doe",
          address: "123 Main St, City",
          idNumber: "AADH123456",
        };

        onDataExtracted(extractedData);
        stopCamera();
        onOpenChange(false);
        setIsProcessing(false);
      }, 2000);

    } catch (err) {
      setError("Failed to process image. Please try again.");
      setIsProcessing(false);
      console.error("Error capturing image:", err);
    }
  };

  // Start camera when dialog opens
  useState(() => {
    if (open) {
      startCamera();
    } else {
      stopCamera();
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-dinesh-text dark:text-dinesh-background">
            Scan ID Document
          </DialogTitle>
          <DialogDescription className="text-dinesh-secondary dark:text-dinesh-accent">
            Position your ID document within the frame and ensure good lighting
          </DialogDescription>
        </DialogHeader>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded-md">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div className="relative aspect-[4/3] rounded-lg border-2 border-dashed border-dinesh-secondary overflow-hidden bg-dinesh-background/5">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="absolute inset-0 w-full h-full object-cover"
            />
            <canvas ref={canvasRef} className="hidden" />
            
            {!isCameraActive && !isProcessing && (
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <Camera className="h-12 w-12 text-dinesh-secondary mb-2" />
                <p className="text-sm text-dinesh-secondary">Initializing camera...</p>
              </div>
            )}

            {isProcessing && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-dinesh-primary"></div>
                <p className="text-sm text-dinesh-background mt-2">Processing...</p>
              </div>
            )}
          </div>

          <div className="flex justify-between gap-4">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => {
                stopCamera();
                startCamera();
              }}
              disabled={isProcessing}
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Retry
            </Button>
            <Button
              variant="default"
              className="flex-1 bg-dinesh-primary hover:bg-dinesh-accent text-dinesh-background"
              onClick={captureImage}
              disabled={!isCameraActive || isProcessing}
            >
              <Camera className="h-4 w-4 mr-2" />
              Capture
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 