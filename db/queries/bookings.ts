import { eq, and, gte, lte } from 'drizzle-orm'
import { db } from '../db'
import { bookings, Booking, NewBooking, rooms } from '../schema'

export async function getAllBookings(): Promise<Booking[]> {
  return await db.select().from(bookings)
}

export async function getBookingById(id: number): Promise<Booking | undefined> {
  const result = await db.select().from(bookings).where(eq(bookings.id, id))
  return result[0]
}

export async function getBookingsByRoom(roomId: number): Promise<Booking[]> {
  return await db.select().from(bookings).where(eq(bookings.roomId, roomId))
}

export async function getBookingsByDateRange(
  startDate: Date,
  endDate: Date
): Promise<Booking[]> {
  return await db
    .select()
    .from(bookings)
    .where(
      and(
        gte(bookings.checkInDate, startDate),
        lte(bookings.checkOutDate, endDate)
      )
    )
}

export async function createBooking(booking: NewBooking): Promise<Booking> {
  const result = await db.insert(bookings).values(booking).returning()
  return result[0]
}

export async function updateBooking(
  id: number,
  booking: Partial<NewBooking>
): Promise<Booking | undefined> {
  const result = await db
    .update(bookings)
    .set({ ...booking, updatedAt: new Date() })
    .where(eq(bookings.id, id))
    .returning()
  return result[0]
}

export async function deleteBooking(id: number): Promise<Booking | undefined> {
  const result = await db.delete(bookings).where(eq(bookings.id, id)).returning()
  return result[0]
}

export async function isRoomAvailable(
  roomId: number,
  checkInDate: Date,
  checkOutDate: Date
): Promise<boolean> {
  const existingBookings = await db
    .select()
    .from(bookings)
    .where(
      and(
        eq(bookings.roomId, roomId),
        and(
          lte(bookings.checkInDate, checkOutDate),
          gte(bookings.checkOutDate, checkInDate)
        )
      )
    )

  return existingBookings.length === 0
}

export async function getRoomAvailability(
  checkInDate: Date,
  checkOutDate: Date
): Promise<{ roomId: number; isAvailable: boolean }[]> {
  const allRooms = await db.select().from(rooms)
  const availability = await Promise.all(
    allRooms.map(async (room) => ({
      roomId: room.id,
      isAvailable: await isRoomAvailable(room.id, checkInDate, checkOutDate),
    }))
  )
  return availability
} 