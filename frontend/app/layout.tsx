import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SUEU Voting System",
  description: "Student Union Election Results Dashboard — real-time live results",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
