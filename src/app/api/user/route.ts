import { db } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import {Webhook} from "svix";

const webhookSecret = process.env.CLERK_WEBHOOK_SIGNING_SECRET!;

interface WebhookEvent {
  data: {
    id: string;
    first_name: string;
    last_name: string;
    email_addresses?: {
      email_address: string;
    }[];
    profile_image_url?: string;
    image_url?: string;
  };
  type: string;
}

export async function POST(request: NextRequest){
    try {
        const payload = await request.text();
        const headers = Object.fromEntries(request.headers.entries());

        const wh = new Webhook(webhookSecret);

        let evt: WebhookEvent;

        try {
            evt = wh.verify(payload, headers) as WebhookEvent;
        } catch (err) {
            console.error("Error verifying webhook:", err);
            return NextResponse.json("Invalid signature", { status: 400 });
        }

        const eventType = evt.type;
        const data = evt.data;

        if((eventType !== "user.created")) {
            return NextResponse.json({ received: true, message: "Event type ignored" }, { status: 400 });
        }

        const clerkUserId = data.id;
        if (!clerkUserId) {
            return NextResponse.json({received: true, error: "Missing user id in webhook" }, { status: 400 });
        }
        
        await db.user.create({
            data: {
                name: `${data.first_name} ${data.last_name}`,
                email: data?.email_addresses?.[0]?.email_address || "",
                clerkUserId: clerkUserId,
                imageUrl: data.profile_image_url || data?.image_url || "",
            }
        });

        return NextResponse.json({ received: true }, { status: 200 });
    } catch (error) {
        console.error(`Error while creating user in db`, error);
        return NextResponse.json({received: true, message: "Error while creating user"}, {status: 500});
    }
}