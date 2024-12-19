import { eq, and, gte, lte } from 'drizzle-orm'
import { db } from '../db'
import { rooms, Room, NewRoom } from '../schema'

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
  let query = db.select().from(rooms).where(eq(rooms.isAvailable, true))

  if (type) {
    query = query.where(eq(rooms.type, type))
  }

  if (maxPrice) {
    query = query.where(lte(rooms.price, maxPrice))
  }

  if (hasAC !== undefined) {
    query = query.where(eq(rooms.hasAC, hasAC))
  }

  // TODO: Add check for existing bookings in the date range

  return await query
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