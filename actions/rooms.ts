'use server'

import { revalidatePath } from 'next/cache'
import { ActionState } from '@/types/action-types'
import { 
  getAllRooms, 
  getRoomById, 
  getRoomByNumber,
  getAvailableRooms,
  createRoom,
  updateRoom,
  deleteRoom
} from '@/db/queries/rooms'
import { Room, NewRoom, roomTypeSchema } from '@/db/schema'

export async function getRooms(): Promise<ActionState<Room[]>> {
  try {
    const rooms = await getAllRooms()
    return { data: rooms, error: null }
  } catch (error) {
    return { data: null, error: 'Failed to fetch rooms' }
  }
}

export async function getRoom(id: number): Promise<ActionState<Room>> {
  try {
    const room = await getRoomById(id)
    if (!room) {
      return { data: null, error: 'Room not found' }
    }
    return { data: room, error: null }
  } catch (error) {
    return { data: null, error: 'Failed to fetch room' }
  }
}

export async function getRoomByRoomNumber(number: string): Promise<ActionState<Room>> {
  try {
    const room = await getRoomByNumber(number)
    if (!room) {
      return { data: null, error: 'Room not found' }
    }
    return { data: room, error: null }
  } catch (error) {
    return { data: null, error: 'Failed to fetch room' }
  }
}

export async function getAvailableRoomsAction(
  checkInDate: Date,
  checkOutDate: Date,
  type?: string,
  maxPrice?: number,
  hasAC?: boolean
): Promise<ActionState<Room[]>> {
  try {
    if (type && !roomTypeSchema.safeParse(type).success) {
      return { data: null, error: 'Invalid room type' }
    }

    const rooms = await getAvailableRooms(checkInDate, checkOutDate, type, maxPrice, hasAC)
    return { data: rooms, error: null }
  } catch (error) {
    return { data: null, error: 'Failed to fetch available rooms' }
  }
}

export async function addRoom(room: NewRoom): Promise<ActionState<Room>> {
  try {
    const newRoom = await createRoom(room)
    revalidatePath('/guesthouse')
    return { data: newRoom, error: null }
  } catch (error) {
    return { data: null, error: 'Failed to create room' }
  }
}

export async function editRoom(id: number, room: Partial<NewRoom>): Promise<ActionState<Room>> {
  try {
    const updatedRoom = await updateRoom(id, room)
    if (!updatedRoom) {
      return { data: null, error: 'Room not found' }
    }
    revalidatePath('/guesthouse')
    return { data: updatedRoom, error: null }
  } catch (error) {
    return { data: null, error: 'Failed to update room' }
  }
}

export async function removeRoom(id: number): Promise<ActionState<Room>> {
  try {
    const deletedRoom = await deleteRoom(id)
    if (!deletedRoom) {
      return { data: null, error: 'Room not found' }
    }
    revalidatePath('/guesthouse')
    return { data: deletedRoom, error: null }
  } catch (error) {
    return { data: null, error: 'Failed to delete room' }
  }
} 