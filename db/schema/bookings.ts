import { pgTable, serial, varchar, timestamp, text, decimal, integer, boolean } from 'drizzle-orm/pg-core'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { z } from 'zod'
import { rooms } from './rooms'

export const bookings = pgTable('bookings', {
  id: serial('id').primaryKey(),
  roomId: integer('room_id').references(() => rooms.id).notNull(),
  name: varchar('name', { length: 100 }).notNull(),
  address: text('address').notNull(),
  idNumber: varchar('id_number', { length: 50 }).notNull(),
  phone: varchar('phone', { length: 20 }).notNull(),
  purpose: text('purpose').notNull(),
  checkInDate: timestamp('check_in_date').notNull(),
  checkInTime: varchar('check_in_time', { length: 5 }).notNull(),
  checkOutDate: timestamp('check_out_date').notNull(),
  checkOutTime: varchar('check_out_time', { length: 5 }).notNull(),
  totalAmount: decimal('total_amount', { precision: 10, scale: 2 }).notNull(),
  advanceAmount: decimal('advance_amount', { precision: 10, scale: 2 }).notNull(),
  isPaid: boolean('is_paid').notNull().default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// Zod schemas for validation
export const insertBookingSchema = createInsertSchema(bookings)
export const selectBookingSchema = createSelectSchema(bookings)

// Custom Zod schema for booking creation
export const createBookingSchema = z.object({
  roomNumber: z.string(),
  name: z.string().min(1),
  address: z.string().min(1),
  idNumber: z.string().min(1),
  phone: z.string().min(10),
  purpose: z.string().min(1),
  checkInDate: z.date(),
  checkInTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
  checkOutDate: z.date(),
  checkOutTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
  totalAmount: z.number().positive(),
  advanceAmount: z.number().positive(),
})

// Types
export type Booking = z.infer<typeof selectBookingSchema>
export type NewBooking = z.infer<typeof insertBookingSchema>
export type CreateBooking = z.infer<typeof createBookingSchema> 