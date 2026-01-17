"use server";

import { db } from "@/lib/prisma";

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