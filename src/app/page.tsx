import { Button } from '@/components/ui/button'
import Image from 'next/image'
import Link from 'next/link'

const Page = () => {
  return (
    <div>
      <section className='pb-16 relative overflow-hidden'>
        <div className='max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center relative z-10'>
          <div className='text-center lg:text-left'>
            <span className='text-gray-500 font-light tracking-wide mb-6'>evix<span className='text-purple-400'>*</span></span>

            <h1 className='text-5xl sm:text-6xl md:text-7xl font-bold mb-6 leading-[0.95] tracking-tight'>
              Discover &<br />
              create amazing<br />
              <span className='bg-linear-to-r from-blue-400 via-purple-400 to-orange-400 bg-clip-text text-transparent'>event.</span>
            </h1>
            <p className='text-lg sm:text-xl text-gray-400 mb-12 max-w-lg font-light mx-auto lg:mx-0'>
              {" "}
              Whether you&apos;re hosting or attending, evix makes every event memorable. Join our community today.
            </p>
            <Link href={"/explore"}>
              <Button size={"lg"} className='rounded-sm'>
                Get Started
              </Button>
            </Link>
          </div>
          <div className='relative block max-w-3xl mx-auto'>
            <Image 
              src={"/event.png"}
              alt='Event'
              width={700}
              height={700}
              className='w-full h-auto'
              priority
            />
          </div>
        </div>
      </section>
    </div>
  )
}

export default Page