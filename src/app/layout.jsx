import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "../components/Navbar"; // Ensure the correct path and casing
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "SHIV-VIBES-JS",
  description: "Generated by SHIVS-BRAIN",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <div className="relative w-full flex items-center justify-center">
          <Navbar />
        </div>
        {children}
      </body>
    </html>
  );
}
