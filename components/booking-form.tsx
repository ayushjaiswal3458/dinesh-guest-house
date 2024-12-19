"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon, Clock } from "lucide-react";
import { createNewBooking } from "@/actions/bookings";
import { CreateBooking } from "@/db/schema";
import BookingMethod from "./booking-method";
import CameraCapture from "./camera-capture";

interface BookingFormProps {
  roomNumber: string;
  roomType: string;
  price: number;
}

// Helper function to format time
const formatTime = (hours: number, minutes: number, period: "AM" | "PM"): string => {
  const formattedHours = period === "AM" ? 
    (hours === 12 ? 0 : hours) : 
    (hours === 12 ? 12 : hours + 12);
  return `${formattedHours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
};

// Generate time options
const generateTimeOptions = () => {
  const options: Array<{ label: string; value: string }> = [];
  for (let period of ["AM", "PM"]) {
    for (let hour = 1; hour <= 12; hour++) {
      for (let minute of [0, 30]) {
        options.push({
          label: `${hour}:${minute.toString().padStart(2, "0")} ${period}`,
          value: formatTime(hour, minute, period as "AM" | "PM"),
        });
      }
    }
  }
  return options;
};

const timeOptions = generateTimeOptions();

// Convert 24-hour format to 12-hour format
const formatTimeDisplay = (time: string): string => {
  const [hours, minutes] = time.split(":").map(Number);
  const period = hours >= 12 ? "PM" : "AM";
  const displayHours = hours % 12 || 12;
  return `${displayHours}:${minutes.toString().padStart(2, "0")} ${period}`;
};

interface FormValues {
  name: string;
  address: string;
  idNumber: string;
  phone: string;
  purpose: string;
  checkInTime: string;
  checkOutTime: string;
}

export default function BookingForm({
  roomNumber,
  roomType,
  price,
}: BookingFormProps) {
  const [showForm, setShowForm] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [checkInDate, setCheckInDate] = useState<Date>();
  const [checkOutDate, setCheckOutDate] = useState<Date>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      name: "",
      address: "",
      idNumber: "",
      phone: "",
      purpose: "",
      checkInTime: "14:00",
      checkOutTime: "11:00",
    },
  });

  const checkInTime = watch("checkInTime");
  const checkOutTime = watch("checkOutTime");

  const handleMethodSelect = (method: "manual" | "camera") => {
    if (method === "manual") {
      setShowForm(true);
    } else {
      setShowCamera(true);
    }
  };

  const handleDataExtracted = (data: {
    name?: string;
    address?: string;
    idNumber?: string;
  }) => {
    if (data.name) setValue("name", data.name);
    if (data.address) setValue("address", data.address);
    if (data.idNumber) setValue("idNumber", data.idNumber);
    setShowForm(true);
  };

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    if (!checkInDate || !checkOutDate) {
      setError("Please select check-in and check-out dates");
      setIsLoading(false);
      return;
    }

    // Calculate total nights and amount
    const nights = Math.ceil(
      (checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    const totalAmount = price * nights;
    const advanceAmount = totalAmount * 0.5; // 50% advance payment

    const bookingData: CreateBooking = {
      roomNumber,
      name: data.name,
      address: data.address,
      idNumber: data.idNumber,
      phone: data.phone,
      purpose: data.purpose,
      checkInDate,
      checkInTime: data.checkInTime,
      checkOutDate,
      checkOutTime: data.checkOutTime,
      totalAmount,
      advanceAmount,
    };

    try {
      const result = await createNewBooking(bookingData);
      
      if (result.error) {
        setError(result.error);
      } else {
        setSuccess(true);
        reset();
        setCheckInDate(undefined);
        setCheckOutDate(undefined);
        // Close dialog after 2 seconds
        setTimeout(() => {
          setShowForm(false);
          setSuccess(false);
        }, 2000);
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <BookingMethod
        roomType={roomType}
        roomNumber={roomNumber}
        onMethodSelect={handleMethodSelect}
      />

      <CameraCapture
        open={showCamera}
        onOpenChange={setShowCamera}
        onDataExtracted={handleDataExtracted}
      />

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-h-[90vh] overflow-y-auto bg-dinesh-background dark:bg-dinesh-text">
          <DialogHeader className="sticky top-0 bg-dinesh-background dark:bg-dinesh-text z-10 py-2">
            <DialogTitle className="text-xl font-semibold text-dinesh-text dark:text-dinesh-background">
              Book {roomType} - Room {roomNumber}
            </DialogTitle>
            <DialogDescription className="text-dinesh-secondary dark:text-dinesh-accent">
              Fill in your details to book the room
            </DialogDescription>
          </DialogHeader>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-md">
              Booking successful! Redirecting...
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-dinesh-text dark:text-dinesh-background font-medium">
                Full Name
              </Label>
              <Input
                id="name"
                {...register("name", { required: "Name is required" })}
                className="border-2 border-dinesh-secondary/50 focus:border-dinesh-primary bg-white dark:bg-dinesh-background"
                disabled={isLoading}
              />
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name.message as string}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="address" className="text-dinesh-text dark:text-dinesh-background font-medium">
                Address
              </Label>
              <Textarea
                id="address"
                {...register("address", { required: "Address is required" })}
                className="border-2 border-dinesh-secondary/50 focus:border-dinesh-primary bg-white dark:bg-dinesh-background min-h-[100px]"
                disabled={isLoading}
              />
              {errors.address && (
                <p className="text-red-500 text-sm">{errors.address.message as string}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="idNumber" className="text-dinesh-text dark:text-dinesh-background font-medium">
                  ID Number
                </Label>
                <Input
                  id="idNumber"
                  {...register("idNumber", { required: "ID Number is required" })}
                  className="border-2 border-dinesh-secondary/50 focus:border-dinesh-primary bg-white dark:bg-dinesh-background"
                  disabled={isLoading}
                />
                {errors.idNumber && (
                  <p className="text-red-500 text-sm">{errors.idNumber.message as string}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-dinesh-text dark:text-dinesh-background font-medium">
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  {...register("phone", {
                    required: "Phone number is required",
                    pattern: {
                      value: /^\d{10}$/,
                      message: "Please enter a valid 10-digit phone number",
                    },
                  })}
                  className="border-2 border-dinesh-secondary/50 focus:border-dinesh-primary bg-white dark:bg-dinesh-background"
                  disabled={isLoading}
                />
                {errors.phone && (
                  <p className="text-red-500 text-sm">{errors.phone.message as string}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="purpose" className="text-dinesh-text dark:text-dinesh-background font-medium">
                Purpose of Stay
              </Label>
              <Input
                id="purpose"
                {...register("purpose", { required: "Purpose is required" })}
                className="border-2 border-dinesh-secondary/50 focus:border-dinesh-primary bg-white dark:bg-dinesh-background"
                disabled={isLoading}
              />
              {errors.purpose && (
                <p className="text-red-500 text-sm">{errors.purpose.message as string}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-dinesh-text dark:text-dinesh-background font-medium">
                  Check-in Date
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal border-2",
                        !checkInDate 
                          ? "text-dinesh-secondary border-dinesh-secondary/50" 
                          : "border-dinesh-primary",
                      )}
                      disabled={isLoading}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {checkInDate ? format(checkInDate, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={checkInDate}
                      onSelect={setCheckInDate}
                      initialFocus
                      disabled={(date) =>
                        date < new Date() || (checkOutDate ? date >= checkOutDate : false)
                      }
                      className="rounded-md border border-dinesh-secondary"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label className="text-dinesh-text dark:text-dinesh-background font-medium">
                  Check-out Date
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal border-2",
                        !checkOutDate 
                          ? "text-dinesh-secondary border-dinesh-secondary/50" 
                          : "border-dinesh-primary",
                      )}
                      disabled={isLoading}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {checkOutDate ? format(checkOutDate, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={checkOutDate}
                      onSelect={setCheckOutDate}
                      initialFocus
                      disabled={(date) =>
                        !checkInDate || date <= checkInDate
                      }
                      className="rounded-md border border-dinesh-secondary"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="checkInTime" className="text-dinesh-text dark:text-dinesh-background font-medium">
                  Check-in Time
                </Label>
                <Select
                  value={checkInTime}
                  onValueChange={(value) => setValue("checkInTime", value)}
                  disabled={isLoading}
                >
                  <SelectTrigger
                    id="checkInTime"
                    className="border-2 border-dinesh-secondary/50 focus:border-dinesh-primary bg-white dark:bg-dinesh-background"
                  >
                    <SelectValue>
                      <div className="flex items-center">
                        <Clock className="mr-2 h-4 w-4" />
                        <span>{formatTimeDisplay(checkInTime)}</span>
                      </div>
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent className="max-h-[200px] overflow-y-auto">
                    {timeOptions.map((time) => (
                      <SelectItem key={time.value} value={time.value}>
                        {time.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="checkOutTime" className="text-dinesh-text dark:text-dinesh-background font-medium">
                  Check-out Time
                </Label>
                <Select
                  value={checkOutTime}
                  onValueChange={(value) => setValue("checkOutTime", value)}
                  disabled={isLoading}
                >
                  <SelectTrigger
                    id="checkOutTime"
                    className="border-2 border-dinesh-secondary/50 focus:border-dinesh-primary bg-white dark:bg-dinesh-background"
                  >
                    <SelectValue>
                      <div className="flex items-center">
                        <Clock className="mr-2 h-4 w-4" />
                        <span>{formatTimeDisplay(checkOutTime)}</span>
                      </div>
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent className="max-h-[200px] overflow-y-auto">
                    {timeOptions.map((time) => (
                      <SelectItem key={time.value} value={time.value}>
                        {time.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {checkInDate && checkOutDate && (
              <div className="space-y-3 bg-dinesh-background/5 dark:bg-dinesh-text/5 p-4 rounded-lg border-2 border-dinesh-secondary/50">
                <h3 className="font-semibold text-lg text-dinesh-text dark:text-dinesh-background">
                  Booking Summary
                </h3>
                <div className="space-y-2 text-dinesh-secondary dark:text-dinesh-accent">
                  <p className="flex justify-between">
                    <span>Number of Nights:</span>
                    <span className="font-medium">
                      {Math.ceil(
                        (checkOutDate.getTime() - checkInDate.getTime()) /
                          (1000 * 60 * 60 * 24)
                      )}
                    </span>
                  </p>
                  <p className="flex justify-between">
                    <span>Price per Night:</span>
                    <span className="font-medium">${price.toFixed(2)}</span>
                  </p>
                  <div className="border-t border-dinesh-secondary/20 pt-2">
                    <p className="flex justify-between text-lg">
                      <span>Total Amount:</span>
                      <span className="font-semibold text-dinesh-primary dark:text-dinesh-accent">
                        $
                        {(
                          price *
                          Math.ceil(
                            (checkOutDate.getTime() - checkInDate.getTime()) /
                              (1000 * 60 * 60 * 24)
                          )
                        ).toFixed(2)}
                      </span>
                    </p>
                    <p className="flex justify-between text-sm mt-1">
                      <span>Advance Payment (50%):</span>
                      <span className="font-medium">
                        $
                        {(
                          (price *
                            Math.ceil(
                              (checkOutDate.getTime() - checkInDate.getTime()) /
                                (1000 * 60 * 60 * 24)
                            )) *
                          0.5
                        ).toFixed(2)}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-dinesh-primary hover:bg-dinesh-accent text-dinesh-background font-medium h-12 text-lg"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-dinesh-background mr-2"></div>
                  Processing...
                </div>
              ) : (
                "Confirm Booking"
              )}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}

