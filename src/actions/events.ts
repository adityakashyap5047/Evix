"use server";

import { db } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { Prisma } from "@prisma/client";

export async function getEvents(page = 1, limit = 10) {
    try {
        if (page < 1 || limit < 1) {
            return { success: false, error: 'Page and limit must be positive integers', status: 400 };
        }

        const now = new Date();

        let userInterests: string[] = [];
        try {
            const currUser = await currentUser();
            if (currUser && currUser.id) {
                const user = await db.user.findUnique({ where: { clerkUserId: currUser.id } });
                if (user && Array.isArray(user.interests)) {
                    userInterests = user.interests;
                }
            }
        } catch {}

        const [events, total] = await Promise.all([
            db.event.findMany({
                where: {
                    startDate: { gte: now }
                },
                orderBy: {
                    startDate: "desc"
                },
            }),
            db.event.count({
                where: { startDate: { gte: now } }
            })
        ]);

        let prioritizedEvents = events;
        if (userInterests.length > 0) {
            prioritizedEvents = [...events].sort((a, b) => {
                const aMatch = userInterests.includes(a.category);
                const bMatch = userInterests.includes(b.category);
                if (aMatch === bMatch) return 0;
                return aMatch ? -1 : 1;
            });
        }

        const featured = [...prioritizedEvents].sort((a, b) => b.registrationCount - a.registrationCount);
        const totalPages = Math.ceil(total / limit);

        return ({success: true, data:{ events: prioritizedEvents.slice((page - 1) * limit, page * limit), featured: featured.slice((page - 1) * limit, page * limit), page, limit, total, totalPages }, status: 200 });
    } catch (error) {
        return { success: false, error: `Error occurred while fetching events: ${error instanceof Error ? error.message : 'Unknown error'}`, status: 500 };
    }
}

export async function getAllEvents(page = 1, limit = 10) {
    try {
        if (page < 1 || limit < 1) {
            return { success: false, error: "Page and limit must be positive integers", status: 400 };
        }

        let userInterests: string[] = [];
        try {
            const currUser = await currentUser();
            if (currUser && currUser.id) {
                const user = await db.user.findUnique({ where: { clerkUserId: currUser.id } });
                if (user && Array.isArray(user.interests)) {
                    userInterests = user.interests;
                }
            }
        } catch {}

        const [events, total] = await Promise.all([
            db.event.findMany({
                orderBy: { startDate: "desc" },
            }),
            db.event.count()
        ]);

        let prioritizedEvents = events;
        if (userInterests.length > 0) {
            prioritizedEvents = [...events].sort((a, b) => {
                const aMatch = userInterests.includes(a.category);
                const bMatch = userInterests.includes(b.category);
                if (aMatch === bMatch) return 0;
                return aMatch ? -1 : 1;
            });
        }

        const featured = [...prioritizedEvents].sort((a, b) => b.registrationCount - a.registrationCount);
        const totalPages = Math.ceil(total / limit);

        return { success: true, data: { events: prioritizedEvents.slice((page - 1) * limit, page * limit), featured: featured.slice((page - 1) * limit, page * limit), page, limit, total, totalPages }, status: 200 };
    } catch (error) {
        return {
            success: false,
            error: `Error occurred while fetching all events: ${
                error instanceof Error ? error.message : "Unknown error"
            }`,
            status: 500,
        };
    }
}

export async function getEventsByLocation(
  city: string | null,
  state: string | null,
  country: string | null,
  localEvents: boolean = false,
  page = 1,
  limit = 10
) {
  try {
    if (page < 1 || limit < 1) {
      return { success: false, error: "Page and limit must be positive integers", status: 400 };
    }

    const currUser = await currentUser();
    if(!currUser || !currUser.id){
        return { success: false, error: "User not authenticated", status: 401 };
    }

    const user = await db.user.findUnique({
        where: {
            clerkUserId: currUser.id,
        },
        include: {
            location: true,
        }
    })

    const now = new Date();

    const orConditions: Prisma.EventWhereInput[] = [];

    if(localEvents && !city) {
        orConditions.push({city: {equals: user?.location?.city || "", mode: "insensitive"}});
    }
    if(localEvents && !state) {
        orConditions.push({state: {equals: user?.location?.state || "", mode: "insensitive"}});
    }
    if(localEvents && !country) {
        orConditions.push({country: {equals: user?.location?.country || "", mode: "insensitive"}});
    }
    if (city) {
      orConditions.push({ city: { equals: city, mode: "insensitive" } });
    }
    if (state) {
      orConditions.push({ state: { equals: state, mode: "insensitive" } });
    }
    if (country) {
      orConditions.push({ country: { equals: country, mode: "insensitive" } });
    }

    const where: Prisma.EventWhereInput = {
      startDate: { gte: now },
      ...(orConditions.length > 0 ? { OR: orConditions } : {}),
    };

        const [events, total] = await Promise.all([
            db.event.findMany({
                where,
                orderBy: { startDate: "desc" },
            }),
            db.event.count({ where }),
        ]);

        let prioritizedEvents = events;
        if (user && user.interests && Array.isArray(user.interests) && user.interests.length > 0) {
            prioritizedEvents = [...events].sort((a, b) => {
                const aMatch = user.interests.includes(a.category);
                const bMatch = user.interests.includes(b.category);
                if (aMatch === bMatch) return 0;
                return aMatch ? -1 : 1;
            });
        }

        const totalPages = Math.ceil(total / limit);

        return { success: true, data: { events: prioritizedEvents.slice((page - 1) * limit, page * limit), page, limit, total, totalPages }, status: 200 };
  } catch (error) {
    return {
      success: false,
      error: `Error occurred while fetching events based on Location: ${
        error instanceof Error ? error.message : "Unknown error"
      }`,
      status: 500,
    };
  }
}

export async function getEventsByCategory(
  category: string,
  page = 1,
  limit = 10
) {
    try {
        if (page < 1 || limit < 1) {
            return { success: false, error: "Page and limit must be positive integers", status: 400 };
        }

        const now = new Date();

        const [events, total] = await Promise.all([
            db.event.findMany({
                where: { category, startDate: { gte: now } },
                orderBy: { startDate: "desc" },
                skip: (page - 1) * limit,
                take: limit,
            }),
            db.event.count({
                where: { category, startDate: { gte: now } }
            })
        ]);

        const totalPages = Math.ceil(total / limit);

        return { success: true, data: { events, page, limit, total, totalPages }, status: 200 };
    } catch (error) {
        return {
        success: false,
        error: `Error occurred while fetching events based on Category: ${
            error instanceof Error ? error.message : "Unknown error"
        }`,
        status: 500,
    };
  }
}

export async function getCateogyCount(){
    try {

        const now = new Date();
        const events = await db.event.findMany({
            where: {startDate: { gte: now } },
        })

        const counts: { [key: string]: number } = {};
        events.forEach((event) => {
            counts[event.category] = (counts[event.category] || 0) + 1;
        });

        return { success: true, data: { counts }, status: 200 };
    } catch (error) {
        return {
            success: false,
            error: `Error occurred while fetching events based on Category: ${
                error instanceof Error ? error.message : "Unknown error"
            }`,
            status: 500,
        };
    }
}