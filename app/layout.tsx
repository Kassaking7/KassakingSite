import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import ThreeBackground from './components/ThreeBackground'
import "./globals.css";

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Zhiyuan Wang Website',
  description: 'Welcome to my personal website showcasing my experiences and projects',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-black text-green-400 relative`}>
        <div className="absolute inset-0 -z-10">
          <ThreeBackground />
        </div>
        <div className="relative z-10">
        <header className="bg-black bg-opacity-70 text-green-400 p-4 sticky top-0 flex justify-between items-center">
            <h1 className="text-2xl font-bold">Zhiyuan Wang's Website</h1>
            <div className="flex space-x-4">
    <a href="https://github.com/Kassaking7" target="_blank" rel="noopener noreferrer">
      <img src="github.svg" alt="GitHub" className="w-6 h-6 text-green-400"  />
    </a>
    <a href="https://www.linkedin.com/in/zhiyuan-wang-923771243/" target="_blank" rel="noopener noreferrer">
      <img src="linkedin.svg" alt="LinkedIn" className="w-6 h-6" />
    </a>
    <a href="/Resume.pdf" target="_blank" rel="noopener noreferrer">
      <img src="resume.svg" alt="Resume" className="w-6 h-6" />
    </a>
  </div>
          </header>
          <main>{children}</main>
          <footer className="bg-black bg-opacity-70 text-green-400 p-4 text-center">
            <p>© 2024 Kassaking7. No rights reserved so far.</p>
          </footer>
        </div>
      </body>
    </html>
  )
}
