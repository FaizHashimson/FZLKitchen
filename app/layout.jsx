import "./globals.css";
import { Bricolage_Grotesque, Plus_Jakarta_Sans } from "next/font/google";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600", "700", "800"],
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata = {
  title: "FZL Kitchen",
  description: "FZL Kitchen landing page",
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${bricolage.variable} ${plusJakarta.variable}`} suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
