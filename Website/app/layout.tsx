import type { Metadata } from 'next'
import React from 'react'
import { Radley } from 'next/font/google'
import './globals.css'

const radley = Radley({ weight: '400', subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Fresh Roots Consulting, LLC | Process & Technology Efficiency Consulting',
  description: 'Fresh Roots Consulting, LLC - Process and Technology Efficiency Consulting. From Strength to Strength.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={radley.className}>{children}</body>
    </html>
  )
}

