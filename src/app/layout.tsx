import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GreenWave - Hydroponic Smart Farming",
  description: "Complete hydroponic cannabis smart farming management system with CCTV, POS, inventory, dry room, store room, and affiliate features.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
