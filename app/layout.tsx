import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Noto_Sans_Ethiopic } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"

const ethiopicFont = Noto_Sans_Ethiopic({
  subsets: ["ethiopic"],
  weight: ["400"],
})

export const metadata: Metadata = {
  title: "ወረብ ከዓመት እስከ ዓመት",
  description: "Listen to Ethiopian Orthodox Church wereb online",
  authors: [{ name: "Esubalew Chekol", url: "https://esubalew.et" }],
  creator: "Esubalew Chekol",
  publisher: "Esubalew Chekol",
  openGraph: {
    type: "website",
    locale: "am_ET",
    url: "https://wereb.esubalew.et",
    title: "ወረብ ከዓመት እስከ ዓመት",
    description: "Listen to Ethiopian Orthodox Church wereb online",
    siteName: "ወረብ ከዓመት እስከ ዓመት",
    images: [
      {
        url: "/og-wereb.png",
        width: 1200,
        height: 630,
        alt: "Wereb Preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ወረብ ከዓመት እስከ ዓመት",
    description: "Listen to Ethiopian Orthodox Church wereb online",
    creator: "@esubaalew",
    images: ["/og-wereb.png"],
  },
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="am" suppressHydrationWarning>
      <body className={ethiopicFont.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}



import './globals.css'