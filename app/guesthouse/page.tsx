import { getRooms } from "@/actions/rooms";
import GuesthouseClient from "@/components/guesthouse-client";
import { Button } from "@/components/ui/button";
import { ClipboardList } from "lucide-react";
import Link from "next/link";

export default async function GuestHousePage() {
  // Fetch rooms from database
  const { data: rooms, error } = await getRooms();

  if (error) {
    return (
      <div className="container py-10">
        <div className="text-center text-red-500">
          <p>Error loading rooms: {error}</p>
        </div>
      </div>
    );
  }

  if (!rooms || rooms.length === 0) {
    return (
      <div className="container py-10">
        <div className="text-center">
          <p className="text-lg text-dinesh-secondary dark:text-dinesh-accent">
            No rooms available
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-10">
      <div className="flex justify-between items-center mb-8">
        <div className="space-y-2">
        </div>
        <Link href="/bookings">
          <Button
            variant="outline"
            className="border-2 border-dinesh-secondary hover:bg-dinesh-primary hover:text-dinesh-background"
          >
            <ClipboardList className="h-4 w-4 mr-2" />
            View Bookings
          </Button>
        </Link>
      </div>
      <GuesthouseClient initialRooms={rooms} />
    </div>
  );
}
