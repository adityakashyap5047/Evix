"use server";

import { db } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";

const generateQRCode = () => {
    return `EVT-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
}

export async function registerForEvent(eventId: string, attendeeName: string, attendeeEmail: string){
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
            where: { id: eventId }
        });

        if(!event){
            return { success: false, error: "Event not found", status: 404 };
        }

        if(event.registrationCount >= (event.capacity ?? 0)){
            return { success: false, error: "Event is at full capacity", status: 400 };
        }

        const existingRegistration = await db.registration.findFirst({
            where: {
                eventId,
                userId: user?.id
            }
        });

        if(existingRegistration){
            return { success: false, error: "You have already registered for this event", status: 400 };
        }

        const qrCode = generateQRCode();

        const registration = await db.registration.create({
            data: {
                eventId,
                userId: user.id,
                attendeeName,
                attendeeEmail,
                qrCode,
                checkedIn: false,
                status: "CONFIRMED",
                registeredAt: new Date(),
            }
        });

        await db.event.update({
            where: { id: eventId },
            data: { 
                registrationCount: event.registrationCount + 1,
             },
        });

        return { success: true, data: { registration }, status: 201 };
    } catch (error) {
        return { success: false, error: `Error occurred while registering for event: ${error instanceof Error ? error.message : 'Unknown error'}`, status: 500 };
    }
}

export async function checkRegistration(eventId: string){
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

        if(!eventId){
            return { success: true, message: "Event ID is required", status: 400 };
        }

        const registration = await db.registration.findFirst({
            where: {
                eventId,
                userId: user?.id
            }
        });

        return { success: true, data: { isRegistered: !!registration }, status: 200 };

    } catch (error) {
        return { success: false, error: `Error occurred while checking registration for event: ${error instanceof Error ? error.message : 'Unknown error'}`, status: 500 };
    }
}

export async function getMyRegistrations(){
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

        const registrations = await db.registration.findMany({
            where: {
                userId: user?.id,
            },
            include: {
                event: true,
            },
            orderBy: {
                registeredAt: "desc"
            }
        });

        if(!registrations || registrations.length === 0){
            return { success: false, error: "No registrations found", status: 404 };
        }

        return { success: true, data: { registrations }, status: 200 };
    } catch (error) {
        return { success: false, error: `Error occurred while fetching registrations: ${error instanceof Error ? error.message : 'Unknown error'}`, status: 500 };
    }
}

export async function cancelRegistration(registrationId: string){
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

        const registration = await db.registration.findUnique({
            where: { id: registrationId }
        });

        if(!registration || registration.userId !== user.id){
            return { success: false, error: "Registration not found or access denied", status: 404 };
        }

        const event = await db.event.findUnique({
            where: { id: registration.eventId }
        });

        if(!event){
            return { success: false, error: "Event not found", status: 404 };
        }

        await db.registration.update({
            where: { id: registrationId },
            data: { status: "CANCELLED" }
        });

        await db.event.update({
            where: { id: event.id },
            data: { 
                registrationCount: Math.max(0, event.registrationCount - 1),
             },
        });

        return { success: true, message: "Registration cancelled successfully", status: 200 };
    } catch (error) {
        return { success: false, error: `Error occurred while cancelling registration: ${error instanceof Error ? error.message : 'Unknown error'}`, status: 500 };
    }
}

export async function getEventRegistration(eventId: string){
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
                organizerId: user.id, 
            }
        });

        if(!event){
            return { success: false, error: "Event not found or access denied", status: 404 };
        };

        const registrations = await db.registration.findMany({
            where: {
                eventId: eventId,
            },
        });

        if(!registrations || registrations.length === 0){
            return { success: false, error: "No registrations found for this event", status: 404 };
        }

        return { success: true, data: { registrations }, status: 200 };
    } catch (error) {
        return { success: false, error: `Error occurred while fetching registration for event: ${error instanceof Error ? error.message : 'Unknown error'}`, status: 500 };
    }
}