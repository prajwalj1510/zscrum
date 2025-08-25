import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider"
import Header from "@/components/Header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Zscrum",
  description: "Project Management System in Next Js",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {/* header */}
          <Header />

          <main className="min-h-screen">
            {children}
          </main>

          {/* Footer */}
          <footer className="bg-gray-900 py-12">
            <div className="container mx-auto px-4 text-center">
              <p className="text-white hover:text-purple-400">
                Made with love 💖 by Prajwal J
              </p>
            </div>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}
