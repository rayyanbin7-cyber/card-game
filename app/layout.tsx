import './globals.css'

export const metadata = {
  title: 'Business Card Game',
  description: 'UNO-style game with business cards',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
