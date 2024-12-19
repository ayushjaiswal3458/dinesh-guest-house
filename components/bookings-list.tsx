"use client";

import { useState } from "react";
import { Booking } from "@/db/schema";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { format } from "date-fns";
import { Edit2, Trash2, Calendar, Phone, MapPin, FileText } from "lucide-react";
import { cancelBooking } from "@/actions/bookings";

interface BookingsListProps {
  initialBookings: (Booking & { roomNumber: string })[];
}

export default function BookingsList({ initialBookings }: BookingsListProps) {
  const [bookings, setBookings] = useState<(Booking & { roomNumber: string })[]>(initialBookings);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<(Booking & { roomNumber: string }) | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async (booking: Booking & { roomNumber: string }) => {
    setSelectedBooking(booking);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedBooking) return;

    setIsDeleting(true);
    setError(null);

    try {
      const result = await cancelBooking(selectedBooking.id);
      if (result.error) {
        setError(result.error);
      } else {
        setBookings(bookings.filter(b => b.id !== selectedBooking.id));
        setDeleteDialogOpen(false);
      }
    } catch (err) {
      setError("Failed to delete booking. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  const getStatusColor = (booking: Booking) => {
    const now = new Date();
    const checkIn = new Date(booking.checkInDate);
    const checkOut = new Date(booking.checkOutDate);

    if (now > checkOut) return "text-gray-500"; // Past booking
    if (now >= checkIn && now <= checkOut) return "text-green-500"; // Current booking
    return "text-blue-500"; // Future booking
  };

  return (
    <div className="container py-10">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold text-dinesh-primary dark:text-dinesh-accent">
          Bookings
        </h1>
        <p className="text-lg text-dinesh-secondary dark:text-dinesh-accent/80">
          Manage your guest house bookings
        </p>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {bookings.map((booking) => (
          <Card
            key={booking.id}
            className="border-2 border-dinesh-secondary/20 hover:border-dinesh-primary/40 transition-colors"
          >
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl font-semibold text-dinesh-text dark:text-dinesh-background">
                    Room {booking.roomNumber}
                  </CardTitle>
                  <CardDescription className="flex items-center mt-1 text-dinesh-secondary dark:text-dinesh-accent">
                    <Phone className="h-4 w-4 mr-1" />
                    {booking.phone}
                  </CardDescription>
                </div>
                <div className={`font-medium ${getStatusColor(booking)}`}>
                  {new Date() > new Date(booking.checkOutDate)
                    ? "Past"
                    : new Date() >= new Date(booking.checkInDate)
                    ? "Current"
                    : "Upcoming"}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-start">
                  <FileText className="h-4 w-4 mr-2 mt-1 text-dinesh-secondary dark:text-dinesh-accent" />
                  <div>
                    <p className="font-medium text-dinesh-text dark:text-dinesh-background">
                      {booking.name}
                    </p>
                    <p className="text-sm text-dinesh-secondary dark:text-dinesh-accent">
                      {booking.idNumber}
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <MapPin className="h-4 w-4 mr-2 mt-1 text-dinesh-secondary dark:text-dinesh-accent" />
                  <p className="text-sm text-dinesh-secondary dark:text-dinesh-accent">
                    {booking.address}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <div className="flex items-center text-dinesh-secondary dark:text-dinesh-accent mb-1">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span className="text-sm">Check-in</span>
                  </div>
                  <p className="font-medium text-dinesh-text dark:text-dinesh-background">
                    {format(new Date(booking.checkInDate), "MMM d, yyyy")}
                  </p>
                  <p className="text-sm text-dinesh-secondary dark:text-dinesh-accent">
                    {booking.checkInTime}
                  </p>
                </div>
                <div>
                  <div className="flex items-center text-dinesh-secondary dark:text-dinesh-accent mb-1">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span className="text-sm">Check-out</span>
                  </div>
                  <p className="font-medium text-dinesh-text dark:text-dinesh-background">
                    {format(new Date(booking.checkOutDate), "MMM d, yyyy")}
                  </p>
                  <p className="text-sm text-dinesh-secondary dark:text-dinesh-accent">
                    {booking.checkOutTime}
                  </p>
                </div>
              </div>

              <div className="border-t border-dinesh-secondary/20 pt-4 mt-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-dinesh-secondary dark:text-dinesh-accent">
                      Total Amount
                    </p>
                    <p className="text-lg font-semibold text-dinesh-primary dark:text-dinesh-accent">
                      ${parseFloat(booking.totalAmount).toFixed(2)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-dinesh-secondary dark:text-dinesh-accent">
                      Payment Status
                    </p>
                    <p className={`font-medium ${booking.isPaid ? "text-green-500" : "text-yellow-500"}`}>
                      {booking.isPaid ? "Paid" : "Pending"}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                className="border-dinesh-secondary hover:bg-dinesh-primary hover:text-dinesh-background"
                onClick={() => {
                  // TODO: Handle modify
                }}
              >
                <Edit2 className="h-4 w-4 mr-1" />
                Modify
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-300"
                onClick={() => handleDelete(booking)}
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Delete
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-dinesh-text dark:text-dinesh-background">
              Delete Booking
            </DialogTitle>
            <DialogDescription className="text-dinesh-secondary dark:text-dinesh-accent">
              Are you sure you want to delete this booking? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
              {error}
            </div>
          )}

          <div className="flex justify-end gap-2 mt-4">
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {isDeleting ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Deleting...
                </div>
              ) : (
                "Delete Booking"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
} 