
# <img src="/public/Evix.png" alt="Evix Logo" width="30" /> Evix — Event Management Platform

Evix is a modern event management platform that enables users to discover, create, and manage events efficiently. Organizers can host meetups, concerts, workshops, and more, while attendees can register and access tickets with QR codes.

---

## Screenshots

### Code Example <br/>
<div align="center">
	<img src="/public/Code/code-1.png" alt="Code Screenshot 1" width="350" />
	<img src="/public/Code/code-2.png" alt="Code Screenshot 2" width="350" />
	<img src="/public/Code/code-3.png" alt="Code Screenshot 3" width="350" />
</div>


### Evix Responsive UI <br/>
<div align="center">
	<img src="/public/Evix/evix-1.png" alt="Evix Screenshot 1" width="250" />
	<img src="/public/Evix/evix-2.png" alt="Evix Screenshot 2" width="250" />
	<img src="/public/Evix/evix-3.png" alt="Evix Screenshot 3" width="250" />
	<img src="/public/Evix/evix-4.png" alt="Evix Screenshot 4" width="250" />
	<img src="/public/Evix/evix-5.png" alt="Evix Screenshot 5" width="250" />
	<img src="/public/Evix/evix-6.png" alt="Evix Screenshot 6" width="250" />
	<img src="/public/Evix/evix-7.png" alt="Evix Screenshot 7" width="250" />
</div>


---

## Features

- User authentication (sign up/sign in) for event and ticket management
- Create events with custom themes and cover images
- Browse and search events by category and location
- Register for events and receive QR code tickets
- Ticket scanning for organizers
- Fully responsive and accessible user interface

---

## Technology Stack

- **Next.js** (React, TypeScript, App Router)
- **Tailwind CSS**
- **Shadcn UI** and **Radix UI**
- **Prisma ORM** with **PostgreSQL**
- **Clerk** for authentication
- **Unsplash API** for event images
- QR code support for tickets

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/<your-username>/evix.git
cd evix
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env.local` file in the root directory (or copy from `.env.example`):

```
# Database (PostgreSQL)
DATABASE_URL=your_postgres_connection_url

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

# Unsplash API
NEXT_PUBLIC_UNSPLASH_ACCESS_KEY=your_unsplash_access_key

# (Optional) Google Generative AI
GOOGLE_GENERATIVE_AI_API_KEY=your_google_ai_key
```
---

## Prisma Setup

Generate Prisma Client:

```bash
npm run generate
```

Run database migrations:

```bash
npx prisma migrate dev
```

Open Prisma Studio (optional):

```bash
npx prisma studio
```

---

## Running the Application

Start the development server:

```bash
npm run dev
```

Visit: [http://localhost:3000](http://localhost:3000)

---

## Building for Production

```bash
npm run build
npm start
```

---

## Deployment (Vercel)

1. Push your project to GitHub.
2. Import the repository in Vercel.
3. Add environment variables from `.env.local` in the Vercel dashboard (Project → Settings → Environment Variables).
4. Deploy.

Build command (already configured):

```json
"build": "prisma generate && next build"
```

---

## Project Structure

```
evix/
├── prisma/
│   └── schema.prisma
│
├── public/
│   ├── event.png
│   └── (other static assets)
│
├── src/
│   ├── app/
│   │   ├── (main)/
│   │   │   ├── explore/
│   │   │   ├── create-event/
│   │   │   ├── my-events/
│   │   │   ├── my-events/[id]/
│   │   │   └── my-tickets/
│   │   ├── sign-in/
│   │   ├── sign-up/
│   │   ├── layout.tsx
│   │   ├── not-found.tsx
│   │   └── page.tsx
│   │
│   ├── actions/
│   │   ├── event.ts
│   │   └── user.ts
│   │
│   ├── components/
│   │   ├── event-card.tsx
│   │   ├── onboarding-modal.tsx
│   │   ├── footer.tsx
│   │   ├── unsplash-image-picker.tsx
│   │   └── ui/ (shadcn components)
│   │
│   ├── hooks/
│   │   └── use-fetch.ts
│   │
│   ├── lib/
│   │   ├── data.ts
│   │   ├── Types.ts
│   │   └── utils.ts
│   │
│   └── middleware.ts
│
├── .env.example
├── next.config.js
├── package.json
└── README.md
```

---

## Roadmap / Planned Features

- Paid events & payment integration
- Notifications & reminders
- Organizer analytics dashboard
- Admin panel
- Event sharing links & invites

---

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

---

## License

MIT License

---

## Author

Aditya Kumar  
B.Tech (Computer Science) | Full Stack Developer
Built using Next.js + Prisma + Clerk
