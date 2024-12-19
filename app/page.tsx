import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative h-[600px]">
        <Image
          src="/placeholder.svg?height=600&width=1200"
          alt="Dinesh Restaurant and Guest House"
          fill
          className="object-cover brightness-50"
          priority
        />
        <div className="container relative flex h-full flex-col items-center justify-center text-center">
          <h1 className="text-4xl font-bold tracking-tighter text-[#FEFAE0] sm:text-5xl md:text-6xl lg:text-7xl">
            Welcome to Dinesh Restaurant & Guest House
          </h1>
          <p className="mt-4 max-w-[700px] text-lg text-[#FEFAE0]/90 md:text-xl">
            Experience authentic cuisine and comfortable stays in the heart of the city
          </p>
          <div className="mt-8 flex gap-4">
            <Link href="/restaurant">
              <Button 
                size="lg"
                className="bg-[#BC6C25] text-[#FEFAE0] hover:bg-[#DDA15E]"
              >
                View Menu
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/guesthouse">
              <Button 
                size="lg" 
                variant="outline"
                className="border-[#FEFAE0] text-[#FEFAE0] bg-transparent hover:bg-[#FEFAE0]/10"
              >
                Book a Stay
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Restaurant Section */}
      <section className="py-20 bg-[#FEFAE0] dark:bg-[#283618]">
        <div className="container">
          <h2 className="text-3xl font-bold tracking-tighter text-[#283618] dark:text-[#FEFAE0] sm:text-4xl md:text-5xl">
            Our Restaurant
          </h2>
          <p className="mt-4 max-w-[700px] text-lg text-[#606C38] dark:text-[#DDA15E]">
            Discover our wide range of delicious dishes prepared by expert chefs using the finest ingredients.
          </p>
          <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div key={item} className="group relative overflow-hidden rounded-lg border border-[#606C38] bg-white dark:bg-[#283618]/50">
                <Image
                  src="/placeholder.svg?height=300&width=400"
                  alt={`Featured dish ${item}`}
                  width={400}
                  height={300}
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#283618]/80 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-xl font-bold text-[#FEFAE0]">Featured Dish {item}</h3>
                  <p className="mt-2 text-sm text-[#FEFAE0]/90">
                    Description of the featured dish goes here
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-12 text-center">
            <Link href="/restaurant">
              <Button 
                size="lg"
                className="bg-[#BC6C25] text-[#FEFAE0] hover:bg-[#DDA15E]"
              >
                View Full Menu
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Guest House Section */}
      <section className="py-20 bg-[#283618] dark:bg-[#FEFAE0]">
        <div className="container">
          <h2 className="text-3xl font-bold tracking-tighter text-[#FEFAE0] dark:text-[#283618] sm:text-4xl md:text-5xl">
            Our Guest House
          </h2>
          <p className="mt-4 max-w-[700px] text-lg text-[#DDA15E] dark:text-[#606C38]">
            Comfortable and affordable accommodations for a peaceful stay.
          </p>
          <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div key={item} className="group relative overflow-hidden rounded-lg border border-[#606C38] bg-[#FEFAE0]/5 dark:bg-[#283618]/5">
                <Image
                  src="/placeholder.svg?height=300&width=400"
                  alt={`Room ${item}`}
                  width={400}
                  height={300}
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#283618]/80 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-xl font-bold text-[#FEFAE0]">Room Type {item}</h3>
                  <p className="mt-2 text-sm text-[#FEFAE0]/90">
                    Description of the room type goes here
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-12 text-center">
            <Link href="/guesthouse">
              <Button 
                size="lg"
                className="bg-[#BC6C25] text-[#FEFAE0] hover:bg-[#DDA15E]"
              >
                View All Rooms
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

