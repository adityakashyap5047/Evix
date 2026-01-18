"use client"

import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from './ui/button'
import { useState } from 'react'
import { Building, Plus, Ticket } from 'lucide-react'
import { OnboardingModal } from './onboarding-modal'
import { useOnboarding } from '@/hooks/use-onboarding'

const Header = () => {

    const [showUpgradeModel, setShowUpgradeModel] = useState<boolean>(false)
    const { showOnboarding, handleOnboardingComplete, handleOnboardingSkip } = useOnboarding();

    return (
        <>
            <nav className='fixed top-0 left-0 right-0 bg-background/80 backdrop-blur-xl z-20 border-b'>
                <div className='max-w-5xl mx-auto px-6 py-4 flex items-center justify-between'>
                    <Link href={"/"}>
                        <Image src={"/Evix.png"} alt="Evix Logo" width={100} height={100} className='w-12 h-12' priority />
                    </Link>

                    <div className="flex items-center">
                        <Button variant={"ghost"} size={"sm"} onClick={() => setShowUpgradeModel(true)}>Pricing</Button>

                        <Button variant={"ghost"} size={"sm"} asChild className='mr-2'>
                            <Link href={"/explore"}>Explore</Link>
                        </Button>
                        <SignedIn>
                            <Button size={"sm"} asChild className='flex gap-2 mr-4'>
                                <Link href={"/create-event"}>
                                    <Plus className='w-4 h-4' />
                                    <span className="hidden sm:inline">Create Event</span>
                                </Link>
                            </Button>
                            <UserButton>
                                <UserButton.MenuItems>
                                    <UserButton.Link
                                        label='My Tickets'
                                        labelIcon={<Ticket size={16} />}
                                        href='/my-tickets'
                                    />
                                    <UserButton.Link
                                        label='My Events'
                                        labelIcon={<Building size={16} />}
                                        href='/my-events'
                                    />
                                    <UserButton.Action label='manageAccount' />
                                </UserButton.MenuItems>
                            </UserButton>
                        </SignedIn>
                        <SignedOut>
                            <SignInButton>
                                <Button size={"sm"}>Sign In</Button>
                            </SignInButton>
                        </SignedOut>
                    </div>
                </div>
            </nav>
            <OnboardingModal
                isOpen={showOnboarding}
                onClose={handleOnboardingSkip}
                onComplete={handleOnboardingComplete}
            />
        </>
    )
}

export default Header