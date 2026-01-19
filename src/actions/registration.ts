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