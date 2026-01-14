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
            <div className="relative z-10">{children}</div>
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
