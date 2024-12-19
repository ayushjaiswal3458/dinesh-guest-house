'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useCart } from '@/components/providers/cart-provider'
import { Plus } from 'lucide-react'
import Image from 'next/image'

// Mock data - replace with your actual menu items
const menuItems = [
  {
    id: '1',
    name: 'Butter Chicken',
    description: 'Tender chicken in a rich, creamy tomato sauce',
    price: 14.99,
    category: 'Main Course',
    image: '/placeholder.svg?height=200&width=300',
  },
  {
    id: '2',
    name: 'Vegetable Biryani',
    description: 'Fragrant rice dish with mixed vegetables and aromatic spices',
    price: 12.99,
    category: 'Main Course',
    image: '/placeholder.svg?height=200&width=300',
  },
  // Add more menu items...
]

const categories = ['All', 'Appetizers', 'Main Course', 'Desserts', 'Beverages']

export default function RestaurantPage() {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const { addItem } = useCart()

  const filteredItems = menuItems.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = category === 'All' || item.category === category
    return matchesSearch && matchesCategory
  })

  return (
    <div className="container py-10">
      <h1 className="text-4xl font-bold">Our Menu</h1>
      
      {/* Search and Filters */}
      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
        <Input
          placeholder="Search menu..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-xs"
        />
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="max-w-xs">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Menu Items Grid */}
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="group rounded-lg border p-4 transition-shadow hover:shadow-md"
          >
            <div className="relative aspect-video overflow-hidden rounded-md">
              <Image
                src={item.image}
                alt={item.name}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <div className="mt-4">
              <h3 className="text-lg font-semibold">{item.name}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{item.description}</p>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-lg font-semibold">${item.price.toFixed(2)}</span>
                <Button
                  onClick={() =>
                    addItem({
                      id: item.id,
                      name: item.name,
                      price: item.price,
                      quantity: 1,
                      image: item.image,
                    })
                  }
                  size="sm"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add to Cart
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

