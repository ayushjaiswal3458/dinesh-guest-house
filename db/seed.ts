import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema'
import { rooms, bookings } from './schema'
import { config } from 'dotenv'

config({ path: '.env' })

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is required");
}

// Initial room data
const roomsData = [
  // AC Double Rooms
  {
    number: "101",
    name: "AC Double Room",
    type: "AC Double Room",
    description: "Comfortable air-conditioned room with double bed",
    price: "79.99",
    hasAC: true,
    capacity: 2,
    image: "/placeholder.svg?height=200&width=300",
    isAvailable: true,
  },
  {
    number: "105",
    name: "AC Double Room",
    type: "AC Double Room",
    description: "Comfortable air-conditioned room with double bed",
    price: "79.99",
    hasAC: true,
    capacity: 2,
    image: "/placeholder.svg?height=200&width=300",
    isAvailable: true,
  },
  {
    number: "201",
    name: "AC Double Room",
    type: "AC Double Room",
    description: "Comfortable air-conditioned room with double bed",
    price: "79.99",
    hasAC: true,
    capacity: 2,
    image: "/placeholder.svg?height=200&width=300",
    isAvailable: true,
  },
  {
    number: "205",
    name: "AC Double Room",
    type: "AC Double Room",
    description: "Comfortable air-conditioned room with double bed",
    price: "79.99",
    hasAC: true,
    capacity: 2,
    image: "/placeholder.svg?height=200&width=300",
    isAvailable: true,
  },
  // Non-AC Rooms
  {
    number: "102",
    name: "Non-AC Room",
    type: "Non-AC Room",
    description: "Comfortable room with natural ventilation",
    price: "49.99",
    hasAC: false,
    capacity: 2,
    image: "/placeholder.svg?height=200&width=300",
    isAvailable: true,
  },
  {
    number: "103",
    name: "Non-AC Room",
    type: "Non-AC Room",
    description: "Comfortable room with natural ventilation",
    price: "49.99",
    hasAC: false,
    capacity: 2,
    image: "/placeholder.svg?height=200&width=300",
    isAvailable: true,
  },
  {
    number: "104",
    name: "Non-AC Room",
    type: "Non-AC Room",
    description: "Comfortable room with natural ventilation",
    price: "49.99",
    hasAC: false,
    capacity: 2,
    image: "/placeholder.svg?height=200&width=300",
    isAvailable: true,
  },
  // Dormitory Rooms
  {
    number: "D1",
    name: "Dormitory Bed",
    type: "Dormitory",
    description: "Affordable bed in shared dormitory",
    price: "19.99",
    hasAC: true,
    capacity: 1,
    image: "/placeholder.svg?height=200&width=300",
    isAvailable: true,
  },
  {
    number: "D2",
    name: "Dormitory Bed",
    type: "Dormitory",
    description: "Affordable bed in shared dormitory",
    price: "19.99",
    hasAC: true,
    capacity: 1,
    image: "/placeholder.svg?height=200&width=300",
    isAvailable: true,
  },
]

// Sample booking data
const bookingsData = [
  {
    roomId: 1, // Will be updated after rooms are inserted
    name: "John Doe",
    address: "123 Main St, City",
    idNumber: "AADH123456",
    phone: "1234567890",
    purpose: "Business Trip",
    checkInDate: new Date("2024-03-20"),
    checkInTime: "14:00",
    checkOutDate: new Date("2024-03-22"),
    checkOutTime: "11:00",
    totalAmount: "159.98",
    advanceAmount: "79.99",
    isPaid: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    roomId: 2, // Will be updated after rooms are inserted
    name: "Jane Smith",
    address: "456 Park Ave, Town",
    idNumber: "AADH789012",
    phone: "9876543210",
    purpose: "Vacation",
    checkInDate: new Date("2024-03-25"),
    checkInTime: "15:00",
    checkOutDate: new Date("2024-03-28"),
    checkOutTime: "10:00",
    totalAmount: "239.97",
    advanceAmount: "119.98",
    isPaid: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]

async function seed() {
  // Create postgres client
  const client = postgres(process.env.DATABASE_URL, {
    ssl: {
      rejectUnauthorized: false
    },
    max: 1,
    prepare: false
  })
  
  // Create drizzle database instance
  const db = drizzle(client, { schema })

  try {
    console.log('🌱 Seeding database...')

    // Insert rooms
    console.log('Inserting rooms...')
    const insertedRooms = await db.insert(rooms).values(roomsData).returning()
    console.log(`✅ Inserted ${insertedRooms.length} rooms`)

    // Update booking data with actual room IDs
    const updatedBookingsData = bookingsData.map((booking, index) => ({
      ...booking,
      roomId: insertedRooms[index].id,
    }))

    // Insert bookings
    console.log('Inserting bookings...')
    const insertedBookings = await db.insert(bookings).values(updatedBookingsData).returning()
    console.log(`✅ Inserted ${insertedBookings.length} bookings`)

    console.log('✅ Seed completed successfully')
  } catch (error) {
    console.error('❌ Seed failed:', error)
  } finally {
    await client.end()
  }
}

seed() 