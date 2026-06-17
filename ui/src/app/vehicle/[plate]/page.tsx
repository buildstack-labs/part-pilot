import { VehiclePageClient } from "@/components/vehicle/vehicle-page-client";

type PageProps = { params: Promise<{ plate: string }> };

export default async function VehiclePage({ params }: PageProps) {
  const { plate } = await params;
  return <VehiclePageClient plate={decodeURIComponent(plate)} />;
}
