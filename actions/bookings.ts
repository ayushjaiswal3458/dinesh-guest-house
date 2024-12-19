'use server'

import { revalidatePath } from 'next/cache'
import { ActionState } from '@/types/action-types'
import {
  getAllBookings,
  getBookingById,
  getBookingsByRoom,
  getBookingsByDateRange,
  createBooking,
  updateBooking,
  deleteBooking,
  isRoomAvailable,
  getRoomAvailability
} from '@/db/queries/bookings'
import { getRoomByNumber } from '@/db/queries/rooms'
import { Booking, NewBooking, CreateBooking } from '@/db/schema'

export async function getBookings(): Promise<ActionState<Booking[]>> {
  try {
    const bookings = await getAllBookings()
    return { data: bookings, error: null }
  } catch (error) {
    return { data: null, error: 'Failed to fetch bookings' }
  }
}

export async function getBooking(id: number): Promise<ActionState<Booking>> {
  try {
    const booking = await getBookingById(id)
    if (!booking) {
      return { data: null, error: 'Booking not found' }
    }
    return { data: booking, error: null }
  } catch (error) {
    return { data: null, error: 'Failed to fetch booking' }
  }
}

export async function getBookingsForRoom(roomId: number): Promise<ActionState<Booking[]>> {
  try {
    const bookings = await getBookingsByRoom(roomId)
    return { data: bookings, error: null }
  } catch (error) {
    return { data: null, error: 'Failed to fetch bookings for room' }
  }
}

export async function getBookingsInDateRange(
  startDate: Date,
  endDate: Date
): Promise<ActionState<Booking[]>> {
  try {
    const bookings = await getBookingsByDateRange(startDate, endDate)
    return { data: bookings, error: null }
  } catch (error) {
    return { data: null, error: 'Failed to fetch bookings in date range' }
  }
}

export async function createNewBooking(bookingData: CreateBooking): Promise<ActionState<Booking>> {
  try {
    // Get room by number
    const room = await getRoomByNumber(bookingData.roomNumber)
    if (!room) {
      return { data: null, error: 'Room not found' }
    }

    // Check if room is available for the given dates
    const available = await isRoomAvailable(
      room.id,
      bookingData.checkInDate,
      bookingData.checkOutDate
    )
    if (!available) {
      return { data: null, error: 'Room is not available for the selected dates' }
    }

    // Create the booking
    const newBooking: NewBooking = {
      roomId: room.id,
      name: bookingData.name,
      address: bookingData.address,
      idNumber: bookingData.idNumber,
      phone: bookingData.phone,
      purpose: bookingData.purpose,
      checkInDate: bookingData.checkInDate,
      checkInTime: bookingData.checkInTime,
      checkOutDate: bookingData.checkOutDate,
      checkOutTime: bookingData.checkOutTime,
      totalAmount: bookingData.totalAmount.toString(),
      advanceAmount: bookingData.advanceAmount.toString(),
      isPaid: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const booking = await createBooking(newBooking)
    revalidatePath('/guesthouse')
    return { data: booking, error: null }
  } catch (error) {
    return { data: null, error: 'Failed to create booking' }
  }
}

export async function updateExistingBooking(
  id: number,
  booking: Partial<NewBooking>
): Promise<ActionState<Booking>> {
  try {
    const updatedBooking = await updateBooking(id, booking)
    if (!updatedBooking) {
      return { data: null, error: 'Booking not found' }
    }
    revalidatePath('/guesthouse')
    return { data: updatedBooking, error: null }
  } catch (error) {
    return { data: null, error: 'Failed to update booking' }
  }
}

export async function cancelBooking(id: number): Promise<ActionState<Booking>> {
  try {
    const deletedBooking = await deleteBooking(id)
    if (!deletedBooking) {
      return { data: null, error: 'Booking not found' }
    }
    revalidatePath('/guesthouse')
    return { data: deletedBooking, error: null }
  } catch (error) {
    return { data: null, error: 'Failed to cancel booking' }
  }
}

export async function checkRoomAvailability(
  checkInDate: Date,
  checkOutDate: Date
): Promise<ActionState<{ roomId: number; isAvailable: boolean }[]>> {
  try {
    const availability = await getRoomAvailability(checkInDate, checkOutDate)
    return { data: availability, error: null }
  } catch (error) {
    return { data: null, error: 'Failed to check room availability' }
  }
} 