import type { Metadata } from "next";
import { Heebo } from "next/font/google";
import { Footer } from "@/components/layout/footer";
import { Providers } from "./providers";
import "./globals.css";

const heebo = Heebo({
  subsets: ["hebrew", "latin"],
  variable: "--font-heebo",
  display: "swap",
});

export const metadata: Metadata = {
  title: "PartPilot — חלקי רכב ישראלי",
  description:
    "פלטפורמת גילוי חלקי רכב ישראלית — חיפוש לפי לוחית, קטלוג OEM והשוואת ספקים",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="he" dir="rtl">
      <body className={`${heebo.variable} min-h-screen font-heebo antialiased`}>
        <Providers>
          <div className="flex min-h-screen flex-col">{children}</div>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
