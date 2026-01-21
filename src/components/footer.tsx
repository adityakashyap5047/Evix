import Link from "next/link";
import {
  Instagram,
  Linkedin,
  Twitter,
  Github,
  Mail,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Footer = () => {
  return (
    <footer className="relative overflow-hidden border-t border-white/5 bg-black/30">
      {/* Glow */}
      <div className="pointer-events-none absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_top,rgba(168,85,247,0.18),transparent_55%)]" />
      <div className="pointer-events-none absolute -top-32 -left-32 h-72 w-72 rounded-full bg-purple-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-6 py-16">
        <div className="mt-14 grid gap-12 xs:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Link href="/" className="inline-flex items-center gap-1">
              <span className="text-2xl font-semibold tracking-tight">
                evix<span className="text-purple-400">*</span>
              </span>
            </Link>

            <p className="text-gray-400 font-light mt-4 leading-relaxed max-w-md">
              Evix is a modern event management platform where you can discover,
              create, and manage events seamlessly — designed with simplicity and
              speed.
            </p>

            <div className="mt-6 flex items-center gap-2 text-sm text-gray-400">
              <Mail className="w-4 h-4" />
              <a href="mailto:support@evix.com" className="hover:text-white transition">
                support@evix.com
              </a>
            </div>

            <div className="mt-6 flex items-center gap-3">
              {[
                { icon: Twitter, label: "Twitter" },
                { icon: Instagram, label: "Instagram" },
                { icon: Linkedin, label: "LinkedIn" },
                { icon: Github, label: "GitHub" },
              ].map((s) => (
                <a
                  key={s.label}
                  href="#"
                  aria-label={s.label}
                  className="w-11 h-11 rounded-2xl border border-white/10 bg-white/[0.03] flex items-center justify-center hover:bg-white/[0.06] hover:-translate-y-0.5 transition"
                >
                  <s.icon className="w-5 h-5 text-gray-300" />
                </a>
              ))}
            </div>
          </div>

          <FooterColumn
            title="Explore"
            links={[
              { name: "Explore Events", href: "/explore" },
              { name: "Categories", href: "/explore" },
              { name: "Trending Events", href: "/explore" },
              { name: "Nearby Events", href: "/explore" },
            ]}
          />

          <FooterColumn
            title="Host"
            links={[
              { name: "Create Event", href: "/create-event" },
              { name: "My Events", href: "/my-events" },
              { name: "Event Analytics", href: "/my-events" },
              { name: "Manage Tickets", href: "/my-events" },
            ]}
          />

          <FooterColumn
            title="Company"
            links={[
              { name: "About", href: "/about" },
              { name: "Pricing", href: "/pricing" },
              { name: "Support", href: "/support" },
              { name: "Contact", href: "/contact" },
            ]}
          />
        </div>

        {/* Bottom */}
        <div className="mt-14 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500 font-light">
            © {new Date().getFullYear()} Evix. All rights reserved.
          </p>

          <div className="flex items-center gap-5 text-sm text-gray-500 font-light">
            <Link href="/privacy" className="hover:text-white transition">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-white transition">
              Terms
            </Link>
            <Link href="/refund" className="hover:text-white transition">
              Refunds
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { name: string; href: string }[];
}) {
  return (
    <div>
      <h4 className="text-sm text-center font-semibold tracking-wide">{title}</h4>
      <ul className="mt-5 space-y-3 text-center text-sm text-gray-400 font-light">
        {links.map((link) => (
          <li key={link.name}>
            <Link
              href={link.href}
              className="hover:text-white transition inline-flex items-center gap-2 group"
            >
              <span>{link.name}</span>
              <span className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition">
                →
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
