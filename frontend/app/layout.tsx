import { determinePreference } from '@/utils/helpers'
import './globals.css'
import { DM_Sans } from 'next/font/google'

const dm = DM_Sans({ subsets: ['latin'] })

export const metadata = {
  title: 'Equitrack',
  description: 'Equitrack is a web service designed to provide users with real-time stock market quotes and the ability to monitor their selected stocks effortlessly',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  determinePreference()

  return (
    <html lang="en" className='dark:bg-background'>
      <head>
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png"/>
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png"/>
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png"/>
        <link rel="manifest" href="/site.webmanifest"/>
      </head>
      <body className={dm.className}>{children}</body>
    </html>
  )
}
