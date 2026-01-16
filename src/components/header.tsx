import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { Button } from './ui/button'

const Header = () => {
  return (
    <>
        <nav className='fixed top-0 left-0 right-0 bg-background/80 backdrop-blur-xl z-20 border-b'>
            <div className='max-w-5xl mx-auto px-6 py-4 flex items-center justify-between'>
                <Link href={"/"}>
                    <Image src={"/Evix.png"} alt="Evix Logo" width={100} height={100} className='w-12 h-12' priority />
                </Link>
                
                <div className="flex items-center">
                    <SignedOut>
                        <SignInButton>
                            <Button size={"sm"}>Sign In</Button>
                        </SignInButton>
                    </SignedOut>
                    <SignedIn>
                        <UserButton />
                    </SignedIn>
                </div>
            </div>
        </nav>
    </>
  )
}

export default Header