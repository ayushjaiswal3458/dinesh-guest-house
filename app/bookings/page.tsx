import { getBookings } from "@/actions/bookings";
import { getRoomById } from "@/db/queries/rooms";
import BookingsList from "@/components/bookings-list";

export default async function BookingsPage() {
  const { data: bookings, error } = await getBookings();

  if (error) {
    return (
      <div className="container py-10">
        <div className="text-center text-red-500">
          <p>Error loading bookings: {error}</p>
        </div>
      </div>
    );
  }

  if (!bookings || bookings.length === 0) {
    return (
      <div className="container py-10">
        <div className="text-center">
          <p className="text-lg text-dinesh-secondary dark:text-dinesh-accent">
            No bookings available
          </p>
        </div>
      </div>
    );
  }

  // Get room numbers for each booking
  const bookingsWithRoomNumbers = await Promise.all(
    bookings.map(async (booking) => {
      const room = await getRoomById(booking.roomId);
      return {
        ...booking,
        roomNumber: room?.number || "Unknown",
      };
    })
  );

  return <BookingsList initialBookings={bookingsWithRoomNumbers} />;
} 