import { Header } from "@/components/layout/header";
import { PartsCatalogView } from "@/components/parts/parts-catalog-view";

type PageProps = { params: Promise<{ plate: string }> };

export default async function PartsPage({ params }: PageProps) {
  const { plate } = await params;
  return (
    <>
      <Header showSearchHint />
      <main className="flex-1">
        <PartsCatalogView plate={decodeURIComponent(plate)} />
      </main>
    </>
  );
}
