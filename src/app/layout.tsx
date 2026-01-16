import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Footer from "@/components/footer";
import Header from "@/components/header";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";

export const metadata: Metadata = {
  title: "Evix",
  description: "Evix is an interactive event-handling built for handling events in a seamless manner.",
  icons: {
    icon: "/Evix.png",
    shortcut: "/Evix.png",
    apple: "/Evix.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-linear-to-br from-gray-950 via-zinc-900 to-stone-900 text-white">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ClerkProvider
            appearance={{
              theme: dark,
            }}
          >
          <Header />
          <main className="relative flex flex-col min-h-screen container max-w-5xl mx-auto pt-40 md:pt-32">
            <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
              <div className="absolute left-1/4 top-0 h-96 w-96 bg-pink-600/20 rounded-full blur-3xl" />
              <div className="absolute right-1/4 bottom-0 h-96 w-96 bg-orange-600/20 rounded-full blur-3xl" />
            </div>

            <div className="relative z-10 flex-1">{children}</div>
            <Footer />
          </main>
          </ClerkProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
