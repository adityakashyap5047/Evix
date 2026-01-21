import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Compass, Home } from "lucide-react";

const NotFound = () => {
  return (
    <div className="relative flex items-center justify-center overflow-hidden px-6 py-20">
      
      <div className="max-w-7xl mx-auto grid gap-12 lg:grid-cols-2 items-center">
        <div className="text-center lg:text-left">
          <p className="text-gray-500 font-light tracking-wide mb-4">
            evix<span className="text-purple-400">*</span>
          </p>

          <h1 className="text-6xl md:text-7xl font-bold leading-[0.95] tracking-tight">
            404
            <br />
            <span className="bg-linear-to-r from-blue-400 via-purple-400 to-orange-400 bg-clip-text text-transparent">
              Page not found
            </span>
          </h1>

          <p className="text-lg text-gray-400 font-light mt-6 max-w-xl mx-auto lg:mx-0">
            Looks like this page doesn’t exist. Maybe it was moved or deleted —
            but don’t worry, your next event is still waiting.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
            <Link href="/">
              <Button size="lg" className="rounded-sm gap-2 w-full sm:w-auto">
                <Home className="w-4 h-4" />
                Back to Home
              </Button>
            </Link>

            <Link href="/explore">
              <Button
                size="lg"
                variant="outline"
                className="rounded-sm gap-2 w-full sm:w-auto"
              >
                <Compass className="w-4 h-4" />
                Explore Events
              </Button>
            </Link>
          </div>

          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-300 transition mt-10"
          >
            <ArrowLeft className="w-4 h-4" />
            Go back
          </Link>
        </div>

        {/* Right Illustration */}
        <div className="hidden lg:block relative max-w-xl mx-auto">
          <div className="rounded-3xl border border-white/5 bg-white/3 p-8">
            <Image
              src="/event.png"
              alt="Evix"
              width={650}
              height={650}
              className="w-full h-auto opacity-90"
              priority
            />
          </div>

          <div className="absolute -top-6 -right-6 px-3 py-2 rounded-xl border border-white/10 bg-black/30 text-sm text-gray-300">
            Lost? Let&apos;s get you back.
          </div>
        </div>
      </div>
    </div>
  );
}

export default NotFound;