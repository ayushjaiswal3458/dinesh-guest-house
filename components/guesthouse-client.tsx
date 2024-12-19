"use client";

import { useState } from "react";
import { Room } from "@/db/schema";
import RoomFilters from "./room-filters";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bed, ThermometerSun, Users } from "lucide-react";
import Image from "next/image";
import BookingForm from "@/components/booking-form";

interface GuesthouseClientProps {
  initialRooms: Room[];
}

export default function GuesthouseClient({ initialRooms }: GuesthouseClientProps) {
  const [filteredRooms, setFilteredRooms] = useState<Room[]>(initialRooms);

  return (
    <div className="container py-10">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold text-dinesh-primary dark:text-dinesh-accent">
          Our Rooms
        </h1>
        <p className="text-lg text-dinesh-secondary dark:text-dinesh-accent/80">
          Find the perfect room for your stay
        </p>
      </div>

      {/* Room Filters */}
      <RoomFilters rooms={initialRooms} onFilter={setFilteredRooms} />

      {/* Rooms Grid */}
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredRooms.map((room) => (
          <Card
            key={room.id}
            className="overflow-hidden border-dinesh-secondary bg-white/50 dark:bg-dinesh-text/50"
          >
            <div className="relative aspect-video">
              <Image
                src={room.image}
                alt={room.name}
                fill
                className="object-cover"
              />
              <div className="absolute top-4 right-4">
                <Badge className="text-lg font-bold bg-dinesh-primary text-dinesh-background hover:bg-dinesh-accent">
                  {room.type === "Dormitory"
                    ? `Bed ${room.number}`
                    : `Room ${room.number}`}
                </Badge>
              </div>
            </div>
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-dinesh-text dark:text-dinesh-background">
                <span>{room.type}</span>
                <Badge
                  variant={room.hasAC ? "default" : "secondary"}
                  className={
                    room.hasAC
                      ? "bg-dinesh-secondary text-dinesh-background hover:bg-dinesh-secondary/80"
                      : "bg-dinesh-secondary text-dinesh-background hover:bg-dinesh-secondary/80"
                  }
                >
                  {room.hasAC ? "AC" : "Non-AC"}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-dinesh-secondary dark:text-dinesh-accent">
                {room.description}
              </p>
              <div className="mt-4 flex items-center gap-4 text-sm text-dinesh-text dark:text-dinesh-background">
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span>Capacity: {room.capacity}</span>
                </div>
                {room.hasAC && (
                  <div className="flex items-center gap-1">
                    <ThermometerSun className="h-4 w-4" />
                    <span>AC</span>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex items-center justify-between">
              <span className="text-2xl font-bold text-dinesh-primary dark:text-dinesh-accent">
                ${parseFloat(room.price).toFixed(2)}
                <span className="text-sm font-normal">/night</span>
              </span>
              <BookingForm
                roomNumber={room.number}
                roomType={room.type}
                price={parseFloat(room.price)}
              />
            </CardFooter>
          </Card>
        ))}
      </div>

      {filteredRooms.length === 0 && (
        <div className="mt-8 text-center">
          <p className="text-lg text-dinesh-secondary dark:text-dinesh-accent">
            No rooms found matching your criteria
          </p>
        </div>
      )}
    </div>
  );
} 