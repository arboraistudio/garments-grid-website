import { Outfit, DM_Serif_Display, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

const dmSerifDisplay = DM_Serif_Display({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-dm-serif-display",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata = {
  title: "Garments Grid | Premium Laundry-as-a-Service (LaaS) Platform",
  description: "Garments Grid is a premium on-demand platform for corporate and government professionals in major hubs like Toronto, Montreal, Calgary, Winnipeg, Washington D.C., and New York. Save 10+ hours a month on ironing and laundry.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${dmSerifDisplay.variable} ${jetbrainsMono.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
