import { PartDetailPageClient } from "@/components/parts/part-detail-page-client";

type PageProps = { params: Promise<{ plate: string; partId: string }> };

export default async function PartDetailPage({ params }: PageProps) {
  const { plate, partId } = await params;
  return (
    <PartDetailPageClient
      plate={decodeURIComponent(plate)}
      partId={decodeURIComponent(partId)}
    />
  );
}
