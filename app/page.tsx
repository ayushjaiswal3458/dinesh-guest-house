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
          <h1 className="text-4xl font-bold tracking-tighter text-primary-foreground sm:text-5xl md:text-6xl lg:text-7xl">
            Welcome to Dinesh Restaurant & Guest House
          </h1>
          <p className="mt-4 max-w-[700px] text-lg text-primary-foreground/90 md:text-xl">
            Experience authentic cuisine and comfortable stays in the heart of the city
          </p>
          <div className="mt-8 flex gap-4">
            <Link href="/restaurant">
              <Button 
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-accent"
              >
                View Menu
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/guesthouse">
              <Button 
                size="lg" 
                variant="outline"
                className="border-primary-foreground text-primary-foreground bg-transparent hover:bg-primary-foreground/10"
              >
                Book a Stay
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Restaurant Section */}
      <section className="py-20 bg-background dark:bg-background">
        <div className="container">
          <h2 className="text-3xl font-bold tracking-tighter text-foreground dark:text-foreground sm:text-4xl md:text-5xl">
            Our Restaurant
          </h2>
          <p className="mt-4 max-w-[700px] text-lg text-secondary dark:text-accent">
            Discover our wide range of delicious dishes prepared by expert chefs using the finest ingredients.
          </p>
          <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div key={item} className="group relative overflow-hidden rounded-lg border border-secondary bg-white dark:bg-background/50">
                <Image
                  src="/placeholder.svg?height=300&width=400"
                  alt={`Featured dish ${item}`}
                  width={400}
                  height={300}
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-xl font-bold text-primary-foreground">Featured Dish {item}</h3>
                  <p className="mt-2 text-sm text-primary-foreground/90">
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
                className="bg-primary text-primary-foreground hover:bg-accent"
              >
                View Full Menu
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Guest House Section */}
      <section className="py-20 bg-foreground dark:bg-foreground">
        <div className="container">
          <h2 className="text-3xl font-bold tracking-tighter text-background dark:text-background sm:text-4xl md:text-5xl">
            Our Guest House
          </h2>
          <p className="mt-4 max-w-[700px] text-lg text-accent dark:text-secondary">
            Comfortable and affordable accommodations for a peaceful stay.
          </p>
          <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div key={item} className="group relative overflow-hidden rounded-lg border border-secondary bg-background/5 dark:bg-background/5">
                <Image
                  src="/placeholder.svg?height=300&width=400"
                  alt={`Room ${item}`}
                  width={400}
                  height={300}
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-xl font-bold text-primary-foreground">Room Type {item}</h3>
                  <p className="mt-2 text-sm text-primary-foreground/90">
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
                className="bg-primary text-primary-foreground hover:bg-accent"
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

