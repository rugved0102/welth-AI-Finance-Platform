import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"]})

export const metadata = {
  title: "Welth",
  description: "One stop Finance Platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${inter.className}`}
      >
        {/* header */}
        <main>{children}</main>  
        {/* this main tag is important for search engines to indentify which is the main content of our page */}
        {/* footer */}
        <footer className="bg-blue-50 py-12">
          <div className="container mx-auto py-4 text-center text-gray-600">
            
            <p>Made with ❤️ by Rugved Junghare</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
