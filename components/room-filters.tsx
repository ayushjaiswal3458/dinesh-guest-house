"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Room } from "@/db/schema";

interface RoomFiltersProps {
  rooms: Room[];
  onFilter: (filteredRooms: Room[]) => void;
}

const roomTypes = ["All Types", "AC Double Room", "Non-AC Room", "Dormitory"];

export default function RoomFilters({ rooms, onFilter }: RoomFiltersProps) {
  const [search, setSearch] = useState("");
  const [type, setType] = useState("All Types");
  const [maxPrice, setMaxPrice] = useState(200);
  const [acOnly, setAcOnly] = useState(false);

  // Apply filters whenever any filter value changes
  useEffect(() => {
    const filtered = rooms.filter((room) => {
      const matchesSearch =
        room.number.toLowerCase().includes(search.toLowerCase()) ||
        room.type.toLowerCase().includes(search.toLowerCase());
      const matchesType = type === "All Types" || room.type === type;
      const matchesPrice = parseFloat(room.price) <= maxPrice;
      const matchesAC = !acOnly || room.hasAC;
      return matchesSearch && matchesType && matchesPrice && matchesAC;
    });
    onFilter(filtered);
  }, [search, type, maxPrice, acOnly, rooms, onFilter]);

  return (
    <div className="mt-8 grid gap-6 rounded-lg border border-dinesh-secondary bg-white/50 p-6 dark:bg-dinesh-text/50 md:grid-cols-2 lg:grid-cols-4">
      <div className="space-y-2">
        <Label
          htmlFor="search"
          className="text-dinesh-text dark:text-dinesh-background"
        >
          Search Room Number
        </Label>
        <Input
          id="search"
          placeholder="Enter room number..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border-dinesh-secondary bg-dinesh-background text-dinesh-text placeholder:text-dinesh-secondary/60"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="type" className="text-dinesh-text dark:text-dinesh-background">
          Room Type
        </Label>
        <Select value={type} onValueChange={setType}>
          <SelectTrigger
            id="type"
            className="border-dinesh-secondary bg-dinesh-background text-dinesh-text"
          >
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            {roomTypes.map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label className="text-dinesh-text dark:text-dinesh-background">
          Maximum Price: ${maxPrice}
        </Label>
        <Slider
          value={[maxPrice]}
          onValueChange={([value]) => setMaxPrice(value)}
          max={200}
          step={10}
          className="py-4"
          defaultValue={[maxPrice]}
        />
      </div>

      <div className="flex items-center space-x-2 pt-8">
        <Switch
          id="ac"
          checked={acOnly}
          onCheckedChange={setAcOnly}
          className="data-[state=checked]:bg-dinesh-primary"
        />
        <Label htmlFor="ac" className="text-dinesh-text dark:text-dinesh-background">
          AC Rooms Only
        </Label>
      </div>
    </div>
  );
} 