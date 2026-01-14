import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

export const metadata: Metadata = {
  title: "Emitify",
  description: "Emitify is an interactive event-handling built for handling events in a seamless manner.",
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
          <main className="relative min-h-screen container max-w-5xl mx-auto pt-40 md:pt-32">
            <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
              <div className="absolute left-1/4 top-0 h-96 w-96 bg-pink-600/20 rounded-full blur-3xl" />
              <div className="absolute right-1/4 bottom-0 h-96 w-96 bg-orange-600/20 rounded-full blur-3xl" />
            </div>

            <div className="relative z-10">{children}</div>
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
