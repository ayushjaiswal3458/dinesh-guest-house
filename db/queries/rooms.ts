import { eq, and, lte, notIn, lt, gt } from 'drizzle-orm'
import { db } from '../db'
import { rooms, Room, NewRoom, bookings } from '../schema'

export async function getAllRooms(): Promise<Room[]> {
  return await db.select().from(rooms)
}

export async function getRoomById(id: number): Promise<Room | undefined> {
  const result = await db.select().from(rooms).where(eq(rooms.id, id))
  return result[0]
}

export async function getRoomByNumber(number: string): Promise<Room | undefined> {
  const result = await db.select().from(rooms).where(eq(rooms.number, number))
  return result[0]
}

export async function getAvailableRooms(
  checkInDate: Date,
  checkOutDate: Date,
  type?: string,
  maxPrice?: number,
  hasAC?: boolean
): Promise<Room[]> {
  const bookedRoomIdsSubquery = db
    .select({ roomId: bookings.roomId })
    .from(bookings)
    .where(
      and(
        lt(bookings.checkInDate, checkOutDate),
        gt(bookings.checkOutDate, checkInDate)
      )
    );

  const conditions = [
    eq(rooms.isAvailable, true),
    notIn(rooms.id, bookedRoomIdsSubquery)
  ];

  if (type) {
    conditions.push(eq(rooms.type, type));
  }

  if (maxPrice) {
    conditions.push(lte(rooms.price, maxPrice));
  }

  if (hasAC !== undefined) {
    conditions.push(eq(rooms.hasAC, hasAC));
  }

  const query = db.select().from(rooms).where(and(...conditions));

  return await query;
}

export async function createRoom(room: NewRoom): Promise<Room> {
  const result = await db.insert(rooms).values(room).returning()
  return result[0]
}

export async function updateRoom(id: number, room: Partial<NewRoom>): Promise<Room | undefined> {
  const result = await db.update(rooms).set(room).where(eq(rooms.id, id)).returning()
  return result[0]
}

export async function deleteRoom(id: number): Promise<Room | undefined> {
  const result = await db.delete(rooms).where(eq(rooms.id, id)).returning()
  return result[0]
} 