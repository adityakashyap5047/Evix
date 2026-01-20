"use server";

import { db } from "@/lib/prisma";
import { EventData } from "@/lib/Type";
import { currentUser } from "@clerk/nextjs/server";

export async function createEvent(data: EventData){
    try {

        const { themeColor, title } = data;

        const currUser = await currentUser();
        
        if(!currUser || !currUser.id){
            return { success: false, error: "User not authenticated", status: 401 };
        }

        const user = await db.user.findUnique({
            where: {
                clerkUserId: currUser?.id,
            },
        });

        if(!user){
            return { success: false, error: "User not found", status: 404 };
        }

        if(user?.plan !== "PRO" && user?.freeEventsCreated >=1 ){
            return { success: false, error: "Free event limit reached. Please upgrade to Pro plan.", status: 403 };
        }

        const defultColor = "#1e3a8a";
        if(user?.plan !== "PRO" && themeColor && themeColor !== defultColor) {
            return { success: false, error: "Custom theme colors are a PRO feature. Please upgrade to PRO plan.", status: 403 };
        }

        const bgColor = user?.plan === "PRO" ? themeColor : defultColor;

        const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

        const event = await db.event.create({
            data: {
                themeColor: bgColor,
                slug: `${slug}-${Date.now()}`,
                organizerId: user.id,
                registrationCount: 0,
                ...data,
            }
        });

        await db.user.update({
            where: {
                id: user.id,
            },
            data: {
                freeEventsCreated: user.freeEventsCreated + 1,
            }
        });

        return {success: true, data: { event }, status: 201 };
    } catch (error) {
        return { success: false, error: `Error occurred while Creating event: ${error instanceof Error ? error.message : 'Unknown error'}`, status: 500 };
    }
}

export async function getEventBySlug(slug: string){
    try {

        const event = await db.event.findUnique({
            where: {
                slug
            },
            include: {
                organizer: true,
            }
        });

        if(!event){
            return { success: false, error: "Event not found", status: 404 };
        }

        return { success: true, data: { event }, status: 200 };
    } catch (error) {
        return { success: false, error: `Error occurred while getting event by slug: ${error instanceof Error ? error.message : 'Unknown error'}`, status: 500 };
    }
}

export async function getOrganizerEvents(){
    try {
        const currUser = await currentUser();
        
        if(!currUser || !currUser.id){
            return { success: false, error: "User not authenticated", status: 401 };
        }

        const user = await db.user.findUnique({
            where: {
                clerkUserId: currUser?.id,
            },
        });

        if(!user){
            return { success: false, error: "User not found", status: 404 };
        }

        const events = await db.event.findMany({
            where: {
                organizerId: user?.id,
            }
        });

        if(!events || events.length === 0){
            return { success: false, error: "No events found for this organizer", status: 404 };
        };

        return { success: true, data: { events }, status: 200 };
    } catch (error) {
        return { success: false, error: `Error occurred while getting Organizer event: ${error instanceof Error ? error.message : 'Unknown error'}`, status: 500 };
    }
}

export async function deleteEvent(eventId: string){
    try {
        const currUser = await currentUser();
        
        if(!currUser || !currUser.id){
            return { success: false, error: "User not authenticated", status: 401 };
        }

        const user = await db.user.findUnique({
            where: {
                clerkUserId: currUser?.id,
            },
        });

        if(!user){
            return { success: false, error: "User not found", status: 404 };
        }

        const event = await db.event.findUnique({
            where: {
                id: eventId,
                organizerId: user?.id,
            }
        });

        if(!event){
            return { success: false, error: "Event not found or you don't have permission to delete this event", status: 404 };
        }

        const registrations = await db.registration.findMany({
            where: { eventId }
        })

        if(registrations && registrations.length > 0){
            for(const registration of registrations){
                await db.registration.delete({
                    where: {id: registration.id}
                });
            }
        };

        await db.event.delete({
            where: { id: eventId }
        });

        if(user.freeEventsCreated > 0){
            await db.user.update({
                where: {id: user.id},
                data: {
                    freeEventsCreated: user.freeEventsCreated - 1,
                }
            })
        };

        return { success: true, data: { message: "Event deleted successfully" }, status: 200 };
            
    } catch (error) {
        return { success: false, error: `Error occurred while deleting event: ${error instanceof Error ? error.message : 'Unknown error'}`, status: 500 };
    }
}

export async function getMyEvents(page: number = 1, limit: number = 10){
    try {
        if(page < 1 || limit < 1){
            return { success: false, error: "Invalid page or limit parameters", status: 400 };
        }
        const currUser = await currentUser();
        if(!currUser || !currUser.id){
            return { success: false, error: "User not authenticated", status: 401 };
        }

        const user = await db.user.findUnique({
            where: {
                clerkUserId: currUser?.id,
            },
        });

        if(!user){
            return { success: false, error: "User not found", status: 404 };
        }

        const [events, total] = await Promise.all([db.event.findMany({
            where: {
                organizerId: user?.id,
            },
            include: {
                organizer: true,
            },
            orderBy: {
                createdAt: "desc"
            },
            take: limit,
            skip: (page - 1) * limit,
        }), db.event.count({
            where: {
                organizerId: user?.id,
            }
        })]);

        if(!events || events.length === 0){
            return { success: false, error: "No events found for this organizer", status: 404 };
        };

        const totalPages = Math.ceil(total / limit);

        return { success: true, data: { events, totalPages, total, page, limit }, status: 200 };
    } catch (error) {
        return { success: false, error: `Error occurred while fetching events: ${error instanceof Error ? error.message : 'Unknown error'}`, status: 500 };
    }
}