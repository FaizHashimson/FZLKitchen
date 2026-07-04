import HomeClient from "./HomeClient";

const title = "FZL Kitchen Taman Desa | Ayam Geprek & Western Food";
const description =
  "Order ayam geprek, chicken chop, burgers and drinks from FZL Kitchen in Taman Desa, Kuala Lumpur via WhatsApp, foodpanda or GrabFood.";
const keywords = [
  "FZL Kitchen Taman Desa",
  "ayam geprek Taman Desa",
  "ayam geprek Kuala Lumpur",
  "western food Taman Desa",
  "chicken chop Taman Desa",
  "burger ayam goreng cheese",
  "food delivery Taman Desa",
  "lunch Taman Desa",
  "dinner Taman Desa",
  "GrabFood FZL Kitchen",
  "foodpanda FZL Kitchen",
  "WhatsApp order food Kuala Lumpur",
];

export const metadata = {
  title,
  description,
  keywords,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title,
    description,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
};

export default function Home() {
  return <HomeClient />;
}
