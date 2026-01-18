"use server";

import { db } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";

export async function getCurrentUser(clerkUserId: string) {
    try {
        if (!clerkUserId) {
            return { success: false, error: "Clerk User ID is required", status: 400 };
        }

        const user = await db.user.findUnique({
            where: {
                clerkUserId
            }
        });

        return ({success: true, data:{ user }, status: 200 });
    } catch (error) {
        return { success: false, error: `Error occurred while fetching users: ${error instanceof Error ? error.message : 'Unknown error'}`, status: 500 };
    }
}

export async function completeOnboarding(location: { city: string; state: string, country: string }, interests: string[]){
    try {
        const currUser = await currentUser();

        if(!currUser || !currUser.id){
            return { success: false, error: "User not authenticated", status: 401 };
        }

        const user = await db.user.update({
            where: {
                clerkUserId: currUser?.id || ""
            },
            data: {
                location: {
                    upsert: {
                        create: {
                            city: location.city,
                            state: location.state,
                            country: location.country,
                        },
                        update: {
                            city: location.city,
                            state: location.state,
                            country: location.country,
                        }
                    },
                },
                interests,
                hasCompletedOnboarding: true,
                updatedAt: new Date(),
            }
        });

        return { success: true, data: { user }, status: 200 };
    } catch (error) {
        return { success: false, error: `Error occurred while completing onboarding: ${error instanceof Error ? error.message : 'Unknown error'}`, status: 500 };
    }
}