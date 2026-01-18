"use server";

import { db } from "@/lib/prisma";

export async function searchEvents(query: string, limit = 10) {
    try {
        if(!query || query.trim().length < 2) {
            return { success: false, error: "Query must be at least 2 characters long", status: 400 };
        }

        if (limit < 1) {
            return { success: false, error: 'Limit must be a positive integer', status: 400 };
        }


        const now = new Date();

        const events = await db.event.findMany({
            where: {
                startDate: { gte: now },
                title: { contains: query, mode: "insensitive" }
            },
            orderBy: {
                startDate: "desc"
            },
            take: limit
        });
        return ({success: true, data:{ events, limit }, status: 200 });
    } catch (error) {
        return { success: false, error: `Error occurred while searching events: ${error instanceof Error ? error.message : 'Unknown error'}`, status: 500 };
    }
}