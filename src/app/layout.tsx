import type { Metadata, Viewport } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: { default: "Fodmap Tracker", template: "%s · Fodmap Tracker" },
  description: "Houd voeding en symptomen overzichtelijk bij.",
  applicationName: "Fodmap Tracker",
  manifest: "/manifest.webmanifest",
};
export const viewport: Viewport = { themeColor: "#22664f", width: "device-width", initialScale: 1, maximumScale: 1 };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="nl"><body>{children}</body></html>;
}
