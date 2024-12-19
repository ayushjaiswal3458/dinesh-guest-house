import { pgTable, serial, varchar, boolean, decimal, text } from 'drizzle-orm/pg-core'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { z } from 'zod'

export const rooms = pgTable('rooms', {
  id: serial('id').primaryKey(),
  number: varchar('number', { length: 10 }).notNull().unique(),
  name: varchar('name', { length: 100 }).notNull(),
  type: varchar('type', { length: 50 }).notNull(),
  description: text('description').notNull(),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  hasAC: boolean('has_ac').notNull().default(false),
  capacity: serial('capacity').notNull(),
  image: varchar('image', { length: 255 }).notNull(),
  isAvailable: boolean('is_available').notNull().default(true),
})

// Zod schemas for validation
export const insertRoomSchema = createInsertSchema(rooms)
export const selectRoomSchema = createSelectSchema(rooms)

// Custom Zod schema for room types
export const roomTypeSchema = z.enum(['AC Double Room', 'Non-AC Room', 'Dormitory'])

// Types
export type Room = z.infer<typeof selectRoomSchema>
export type NewRoom = z.infer<typeof insertRoomSchema>
export type RoomType = z.infer<typeof roomTypeSchema> 