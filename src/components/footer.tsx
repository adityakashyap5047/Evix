import Link from "next/link";
import {
  Linkedin,
  Github,
  Mail,
} from "lucide-react";
import Image from "next/image";

const Footer = () => {
  return (
    <footer className="overflow-hidden border-t border-t-white/5">
      
      <div className="relative max-w-7xl mx-auto px-6 pb-16">
        <div className="mt-14 grid gap-12 xs:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Link href="/" className="inline-flex items-center gap-1">
              <Image src={"/evix.png"} alt="Evix" width={30} height={30} />
              <span className="text-2xl font-semibold tracking-tight">
                Evix<span className="text-purple-400">*</span>
              </span>
            </Link>

            <p className="text-gray-400 font-light mt-4 leading-relaxed max-w-md">
              Evix is a modern event management platform where you can discover,
              create, and manage events seamlessly — designed with simplicity and
              speed.
            </p>

            <div className="mt-6 flex items-center gap-2 text-sm text-gray-400">
              <Mail className="w-4 h-4" />
              <a href="mailto:adityakashyap5047@gmail.com" className="hover:text-white transition">
                adityakashyap5047@gmail.com
              </a>
            </div>

            <div className="mt-6 flex items-center gap-3">
              {[
                { icon: Mail, label: "Mail", link: "mailto:adityakashyap5047@gmail.com" },
                { icon: Linkedin, label: "LinkedIn", link: "https://www.linkedin.com/in/adityakashyap5047/" },
                { icon: Github, label: "GitHub", link: "https://github.com/adityakashyap5047" },
              ].map((s) => (
                <a
                  key={s.label}
                  href={s.link}
                  aria-label={s.label}
                  className="w-11 h-11 rounded-2xl border border-white/10 bg-white/3 flex items-center justify-center hover:bg-white/6 hover:-translate-y-0.5 transition"
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
