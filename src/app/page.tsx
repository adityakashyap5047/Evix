import { Button } from '@/components/ui/button'
import Image from 'next/image'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { CalendarDays, MapPin, Sparkles, Ticket, Users } from 'lucide-react'
import { CATEGORIES } from '@/lib/data'

const Page = () => {
  return (
    <div>
      {/* HERO */}
      <section className="pb-16 relative overflow-hidden">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center relative z-10 px-6">
          <div className="text-center lg:text-left">
            <span className="text-gray-500 font-light tracking-wide mb-6 inline-block">
              evix<span className="text-purple-400">*</span>
            </span>

            <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold mb-6 leading-[0.95] tracking-tight">
              Discover &<br />
              create amazing<br />
              <span className="bg-linear-to-r from-blue-400 via-purple-400 to-orange-400 bg-clip-text text-transparent">
                event.
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-gray-400 mb-12 max-w-lg font-light mx-auto lg:mx-0">
              Whether you&apos;re hosting or attending, evix makes every event memorable.
              Join our community today.
            </p>

            <div className="flex items-center justify-center lg:justify-start gap-3">
              <Link href="/explore">
                <Button size="lg" className="rounded-sm">
                  Get Started
                </Button>
              </Link>

              <Link href="/create-event">
                <Button size="lg" variant="outline" className="rounded-sm">
                  Create Event
                </Button>
              </Link>
            </div>

            <div className="mt-10 flex flex-wrap gap-3 justify-center lg:justify-start">
              <Badge variant="secondary" className="rounded-sm font-light">
                <Sparkles className="w-3.5 h-3.5 mr-1" /> Smart discovery
              </Badge>
              <Badge variant="secondary" className="rounded-sm font-light">
                <Ticket className="w-3.5 h-3.5 mr-1" /> Easy registration
              </Badge>
              <Badge variant="secondary" className="rounded-sm font-light">
                <Users className="w-3.5 h-3.5 mr-1" /> Community driven
              </Badge>
            </div>
          </div>

          <div className="relative block max-w-3xl mx-auto">
            <Image
              src="/event.png"
              alt="Event"
              width={700}
              height={700}
              className="w-full h-auto"
              priority
            />
          </div>
        </div>
      </section>

      {/* STATS STRIP */}
      <section className="py-10 border-y border-white/5 bg-white/2">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { label: "Events created", value: "1K+" },
            { label: "Active users", value: "5K+" },
            { label: "Cities covered", value: "80+" },
            { label: "Tickets booked", value: "12K+" },
          ].map((s) => (
            <div key={s.label} className="rounded-xl p-5 border border-white/5 bg-black/10">
              <p className="text-2xl font-semibold tracking-tight">{s.value}</p>
              <p className="text-sm text-gray-400 font-light mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-2xl">
            <p className="text-gray-500 font-light tracking-wide">
              Why evix<span className="text-purple-400">*</span>
            </p>
            <h2 className="text-4xl md:text-5xl font-bold mt-3 tracking-tight">
              Everything you need to build, share and attend events.
            </h2>
            <p className="text-gray-400 mt-4 font-light">
              A modern event platform designed for speed, simplicity and beautiful experiences.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
            {[
              {
                icon: CalendarDays,
                title: "Smooth event creation",
                desc: "Create your events in minutes with clean UI and smart validation.",
              },
              {
                icon: MapPin,
                title: "Location-based discovery",
                desc: "Explore events near you with city & state filter support.",
              },
              {
                icon: Ticket,
                title: "Tickets & registrations",
                desc: "Fast registration system with ticket access in one click.",
              },
              {
                icon: Users,
                title: "Community engagement",
                desc: "Build your audience and share your events with your network.",
              },
              {
                icon: Sparkles,
                title: "Beautiful branding",
                desc: "Theme colors, cover images, and a premium modern feel.",
              },
              {
                icon: CalendarDays,
                title: "Event tracking",
                desc: "Manage upcoming and past events without confusion.",
              },
            ].map((f) => (
              <div
                key={f.title}
                className="rounded-2xl p-6 border border-white/5 bg-white/3 hover:bg-white/5 transition"
              >
                <div className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-4">
                  <f.icon className="w-5 h-5 text-purple-300" />
                </div>
                <h3 className="text-lg font-semibold">{f.title}</h3>
                <p className="text-gray-400 mt-2 font-light">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-20 bg-white/2 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-gray-500 font-light tracking-wide">
              How it works<span className="text-purple-400">*</span>
            </p>
            <h2 className="text-4xl md:text-5xl font-bold mt-3 tracking-tight">
              Create. Share. Experience.
            </h2>
            <p className="text-gray-400 mt-4 font-light max-w-xl">
              The workflow is simple and designed to keep your focus on the experience, not the complexity.
            </p>

            <div className="mt-10 space-y-5">
              {[
                { step: "01", title: "Create your event", desc: "Add details, cover image, location and time." },
                { step: "02", title: "Publish and share", desc: "Share with friends and let people register instantly." },
                { step: "03", title: "Manage easily", desc: "Track tickets, attendees and update anytime." },
              ].map((s) => (
                <div key={s.step} className="flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                    <span className="text-sm text-purple-200">{s.step}</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{s.title}</h3>
                    <p className="text-gray-400 font-light mt-1">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10">
              <Link href="/create-event">
                <Button size="lg" className="rounded-sm">
                  Start Creating
                </Button>
              </Link>
            </div>
          </div>

          <div className="rounded-3xl border border-white/5 bg-black/10 p-8">
            <div className="flex flex-col gap-4">
              <p className="text-sm text-gray-400 font-light">Featured event</p>
              <div className="rounded-2xl p-5 flex justify-between items-center border border-white/5 bg-white/3">
                <p className="text-xl font-semibold mt-1">TechForward: Innovate, Integrate, Inspire</p>
                <div className="flex items-center gap-3 mt-3 text-gray-400">
                  <Badge variant="secondary" className="rounded-sm">Technology</Badge>
                </div>
              </div>
              <div className="rounded-2xl p-5 flex justify-between items-center border border-white/5 bg-white/3">
                <p className="text-xl font-semibold mt-1">Rock Concert Night</p>
                <div className="flex items-center gap-3 mt-3 text-gray-400">
                  <Badge variant="secondary" className="rounded-sm">Music</Badge>
                </div>
              </div>
              <div className="rounded-2xl p-5 flex justify-between items-center border border-white/5 bg-white/3">
                <p className="text-xl font-semibold mt-1">Trekking to Triund</p>
                <div className="flex items-center gap-3 mt-3 text-gray-400">
                  <Badge variant="secondary" className="rounded-sm">Outdoor & Adventure</Badge>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <p className="text-gray-500 font-light tracking-wide">
                Explore categories<span className="text-purple-400">*</span>
              </p>
              <h2 className="text-4xl md:text-5xl font-bold mt-3 tracking-tight">
                Find events that match your vibe.
              </h2>
              <p className="text-gray-400 mt-4 font-light max-w-xl">
                From workshops to concerts to hackathons — explore what you love.
              </p>
            </div>

            <Link href="/explore">
              <Button variant="outline" size="lg" className="rounded-sm">
                Browse all
              </Button>
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-12">
            {CATEGORIES.slice(0, 8).map((cat) => (
              <Link
                href={`/explore/${cat.id}`}
                key={cat.id}
                className="rounded-2xl border border-white/5 bg-white/3 hover:bg-white/5 transition p-6 group"
              >
                <div className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                  <cat.icon className="w-5 h-5 text-purple-300" />
                </div>
                <h3 className="mt-4 font-semibold text-lg">{cat.label}</h3>
                <p className="text-gray-400 font-light mt-2 text-sm">
                  Explore trending {cat.label.toLowerCase()} events.
                </p>
                <span className="text-sm text-purple-300 mt-4 inline-block group-hover:translate-x-1 transition">
                  Explore →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="rounded-3xl border border-white/5 bg-linear-to-r from-white/6 via-white/3 to-white/6 p-10 md:p-14 overflow-hidden relative">
            <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_top,rgba(168,85,247,0.25),transparent_60%)]" />
            <div className="relative z-10 grid lg:grid-cols-2 gap-10 items-center">
              <div>
                <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
                  Your next event deserves a premium experience.
                </h2>
                <p className="text-gray-400 font-light mt-4 max-w-xl">
                  Start discovering events near you or create your own in minutes.
                </p>

                <div className="mt-8 flex flex-wrap gap-3">
                  <Link href="/explore">
                    <Button size="lg" className="rounded-sm">Explore Events</Button>
                  </Link>
                  <Link href="/create-event">
                    <Button size="lg" variant="outline" className="rounded-sm">
                      Create Event
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="hidden lg:block">
                <div className="rounded-2xl border border-white/5 bg-black/10 p-6">
                  <p className="text-gray-400 font-light text-sm flex items-center gap-2"><Image src={"/Evix.png"} alt='Evix' width={30} height={30} /> Evix highlights</p>
                  <ul className="mt-4 space-y-3 text-gray-300 font-light">
                    <li>• Minimal & premium UI</li>
                    <li>• Ultra-fast event booking</li>
                    <li>• Easy onboarding experience</li>
                    <li>• Tickets & event discovery</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Page