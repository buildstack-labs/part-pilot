import { Header } from "@/components/layout/header";
import { HeroSearch } from "@/components/home/hero-search";

export default function HomePage() {
  return (
    <>
      <Header />
      <main className="flex flex-1 flex-col">
        <HeroSearch />
      </main>
    </>
  );
}
