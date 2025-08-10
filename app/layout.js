import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/header";
import { ClerkProvider } from '@clerk/nextjs';
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"]})

export const metadata = {
  title: "Welth",
  description: "One stop Finance Platform",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
      <body
        className={`${inter.className}`}
      >
        {/* header */}
        <Header/>
        <main className="min-h-screen">{children}</main>  
        {/* this main tag is important for search engines to indentify which is the main content of our page */}

        <Toaster richColors/>
        {/* footer */}
        <footer className="bg-blue-50 py-12">
          <div className="container mx-auto py-4 text-center text-gray-600">
            
            <p>Made with ❤️ by Rugved Junghare</p>
          </div>
        </footer>
      </body>
    </html>
    </ClerkProvider>
  );
}
