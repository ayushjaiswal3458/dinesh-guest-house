"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Camera, PenLine } from "lucide-react";

interface BookingMethodProps {
  onMethodSelect: (method: "manual" | "camera") => void;
  roomType: string;
  roomNumber: string;
}

export default function BookingMethod({
  onMethodSelect,
  roomType,
  roomNumber,
}: BookingMethodProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="default" 
          className="bg-dinesh-primary hover:bg-dinesh-accent text-dinesh-background font-medium px-6 py-2 rounded-lg transition-colors"
        >
          Book Now
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-dinesh-text dark:text-dinesh-background">
            Book {roomType} - Room {roomNumber}
          </DialogTitle>
          <DialogDescription className="text-dinesh-secondary dark:text-dinesh-accent">
            Choose how you would like to enter your details
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4 mt-4">
          <Button
            variant="outline"
            className="h-32 flex flex-col items-center justify-center gap-3 border-2 border-dinesh-secondary hover:border-dinesh-primary hover:bg-dinesh-background/5"
            onClick={() => {
              onMethodSelect("manual");
              setOpen(false);
            }}
          >
            <PenLine className="h-8 w-8 text-dinesh-primary" />
            <div className="text-center">
              <div className="font-semibold text-dinesh-text dark:text-dinesh-background">Manual Entry</div>
              <div className="text-sm text-dinesh-secondary dark:text-dinesh-accent">Fill in the form manually</div>
            </div>
          </Button>
          <Button
            variant="outline"
            className="h-32 flex flex-col items-center justify-center gap-3 border-2 border-dinesh-secondary hover:border-dinesh-primary hover:bg-dinesh-background/5"
            onClick={() => {
              onMethodSelect("camera");
              setOpen(false);
            }}
          >
            <Camera className="h-8 w-8 text-dinesh-primary" />
            <div className="text-center">
              <div className="font-semibold text-dinesh-text dark:text-dinesh-background">Camera Capture</div>
              <div className="text-sm text-dinesh-secondary dark:text-dinesh-accent">Scan your ID document</div>
            </div>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
} 