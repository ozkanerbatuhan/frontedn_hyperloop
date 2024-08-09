import { Inter, Poppins } from "next/font/google";
import Head from "next/head";
import Link from "next/link";
import "./globals.css";



const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const poppins = Poppins({ 
  subsets: ["latin"], 
  weight: ['400', '600', '700'],
  variable: "--font-poppins" 
});

export const metadata = {
  title: "Hyperloop Dashboard",
  description: "A real-time dashboard for Hyperloop systems",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable}`}>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <body className="flex flex-col min-h-screen">
        <header className="sticky top-0 z-50 w-full bg-white dark:bg-gray-800 shadow-md">
          <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
            <Link href="/" className="flex items-center space-x-2">
              <img
                src="/logo.svg"
                alt="Hyperloop Logo"
                className="w-8 h-8"
              />
              <span className="text-xl font-semibold text-gray-800 dark:text-white">
                Hyperloop
              </span>
            </Link>
            <ul className="flex space-x-4">
              <NavItem href="/" text="Home" />
              <NavItem href="/temperature" text="Temperature" />
              <NavItem href="/speed" text="Speed" />
            </ul>
          </nav>
        </header>
        <main className="flex-grow container mx-auto px-4 py-8">
          {children}
        </main>
        <footer className="bg-gray-100 dark:bg-gray-900 py-4">
          <div className="container mx-auto px-4 text-center text-gray-600 dark:text-gray-400">
            © {new Date().getFullYear()} Hyperloop Dashboard. All rights reserved.
          </div>
        </footer>
      </body>
    </html>
  );
}

function NavItem({ href, text }) {
  return (
    <li>
      <Link 
        href={href}
        className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors duration-200"
      >
        {text}
      </Link>
    </li>
  );
}