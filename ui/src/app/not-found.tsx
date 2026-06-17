import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="flex flex-1 flex-col items-center justify-center px-6 py-20 text-center">
        <div className="mb-4 text-6xl">🚗</div>
        <h1 className="mb-2 text-2xl font-extrabold text-navy">הדף לא נמצא</h1>
        <p className="mb-6 text-muted">ייתכן שהקישור שגוי או שהדף הוסר.</p>
        <Link href="/">
          <Button type="button">חזרה לדף הבית</Button>
        </Link>
      </main>
    </>
  );
}
