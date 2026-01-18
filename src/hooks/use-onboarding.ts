"use client";

import { getCurrentUser } from "@/actions/user";
import { User } from "@/lib/Type";
import { useUser } from "@clerk/nextjs";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const ATTENDEE_PAGES = ["/explore", "/events", "/my-tickets"];

export function useOnboarding() {
    const [showOnboarding, setShowOnboarding] = useState<boolean>(false);
    const [currentUser, setCurrentUser] = useState<User | null>(null);

    const pathname = usePathname();
    const router = useRouter();

    const { user, isLoaded } = useUser();
    const clerkUserId = user?.id;

    useEffect(() => {
        if (!isLoaded || !clerkUserId) return;
        const fetchData = async () => {
            const response = await getCurrentUser(clerkUserId ?? "");
            setCurrentUser(response.data?.user || null);
            if(!response.data?.user?.hasCompletedOnboarding){
                const requiresOnboarding = ATTENDEE_PAGES.some((page) =>
                    pathname.startsWith(page)
                );
                if(requiresOnboarding){
                    setShowOnboarding(true);
                }
            }
        };
        fetchData();
    }, [isLoaded, clerkUserId, pathname]);

    const fetchData = async () => {
        const response = await getCurrentUser(clerkUserId ?? "");
        setCurrentUser(response.data?.user || null);
    };

    const handleOnboardingComplete = async () => {
        setShowOnboarding(false);
        await fetchData();
        router.refresh();
    };

    const handleOnboardingSkip = () => {
        setShowOnboarding(false);
        router.push("/");
    };

    return {
        showOnboarding,
        handleOnboardingComplete,
        handleOnboardingSkip,
        setShowOnboarding,
        needsOnboarding: currentUser && !currentUser.hasCompletedOnboarding,
    };
}