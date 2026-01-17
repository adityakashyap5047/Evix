"use server";

import { db } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export async function getEvents(page = 1, limit = 10) {
    try {
        if (page < 1 || limit < 1) {
            return { success: false, error: 'Page and limit must be positive integers', status: 400 };
        }

        const now = new Date();

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

        const featured = [...events].sort((a, b) => b.registrationCount - a.registrationCount);
        const totalPages = Math.ceil(total / limit);

        return ({success: true, data:{ events: events.slice((page - 1) * limit, page * limit), featured: featured.slice((page - 1) * limit, page * limit), page, limit, total, totalPages }, status: 200 });
    } catch (error) {
        return { success: false, error: `Error occurred while fetching events: ${error instanceof Error ? error.message : 'Unknown error'}`, status: 500 };
    }
}

export async function getAllEvents(page = 1, limit = 10) {
    try {
        if (page < 1 || limit < 1) {
            return { success: false, error: "Page and limit must be positive integers", status: 400 };
        }

        const [events, total] = await Promise.all([
            db.event.findMany({
                orderBy: { startDate: "desc" },
                skip: (page - 1) * limit,
                take: limit,
            }),
            db.event.count()
        ]);

        const featured = [...events].sort((a, b) => b.registrationCount - a.registrationCount);
        const totalPages = Math.ceil(total / limit);

        return { success: true, data: { events, featured, page, limit, total, totalPages }, status: 200 };
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
  page = 1,
  limit = 10
) {
  try {
    if (page < 1 || limit < 1) {
      return { success: false, error: "Page and limit must be positive integers", status: 400 };
    }

    const now = new Date();

    const orConditions: Prisma.EventWhereInput[] = [];

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
        skip: (page - 1) * limit,
        take: limit,
      }),
      db.event.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return { success: true, data: { events, page, limit, total, totalPages }, status: 200 };
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