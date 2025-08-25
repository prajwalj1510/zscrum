import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider"
import Header from "@/components/Header";
import { ClerkProvider } from "@clerk/nextjs";
import { shadesOfPurple } from "@clerk/themes";
import { Toaster } from "sonner";

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
    <ClerkProvider
      appearance={{
        baseTheme:shadesOfPurple,
        variables: {
          colorPrimary: '#3b82f6',
          colorBackground: '#1a202c',
          // colorInputBackground: '#2D3748',
          // colorInput: '#F3F4F6'
        },
        elements: {
          formButtonPrimary: 'text-white',
          card: 'bg-gray-800',
          headerTitle: 'text-blue-400',
          headerSubtitle: 'text-gray-400',
        }
      }}
    >
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased dotted-background`}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <Toaster richColors/>
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
    </ClerkProvider>
  );
}
