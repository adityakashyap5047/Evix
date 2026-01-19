import type { $Enums } from "@prisma/client";

export type LocationType = $Enums.LocationType;

export type TicketType = $Enums.TicketType;

export type RegistrationStatus = $Enums.RegistrationStatus;

export type User = {
	id: string;
	clerkUserId: string;
	name?: string | null;
	email: string;
	imageUrl?: string | null;
	hasCompletedOnboarding?: boolean | null;
	location?: Location | null;
	interests: string[];
	freeEventsCreated: number;
	events?: Event[];
	registrations?: Registration[];
	createdAt: Date;
	updatedAt: Date;
};

export type Location = {
	id: string;
	city: string;
	state: string;
	country: string;
	user: User;
	userId: string;
};

export type Event = {
	id: string;
	title: string;
	description: string;
	slug: string;
	organizer?: User;
	organizerId: string;
	category: string;
	tags: string[];
	startDate: Date;
	endDate: Date;
	timezone: string;
	locationType: LocationType;
	venue?: string | null;
	address?: string | null;
	city?: string | null;
	state?: string | null;
	country?: string | null;
	capacity?: number | null;
	ticketType: TicketType;
	ticketPrice?: number | null;
	registrationCount: number;
	coverImageUrl?: string | null;
	themeColor?: string | null;
	registrations?: Registration[];
	createdAt: Date;
	updatedAt: Date;
};

export type Registration = {
	id: string;
	event: Event;
	eventId: string;
	user: User;
	userId: string;
	attendeeName: string;
	attendeeEmail: string;
	qrCode: string;
	checkedIn: boolean;
	checkedInAt?: Date | null;
	status: RegistrationStatus;
	registeredAt: Date;
};

export type EventData = {
	title: string;
	description: string;
	category: string;
	tags: string[];

	startDate: Date;
	endDate: Date;
	timezone: string;

	startTime?: string;
	endTime?: string;
	
	locationType: LocationType;
	venue?: string;
	address?: string;
	city?: string;
	state?: string;
	country?: string;

	capacity: number;
	ticketType: TicketType;
	ticketPrice?: number;
	coverImageUrl?: string;
	themeColor?: string;
}