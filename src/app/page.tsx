import { getPublicDownloads } from "@/lib/downloads";
import VaultClient from "@/components/VaultClient";


export default function HomePage() {
  const items = getPublicDownloads();

  return <VaultClient initialItems={items} />;
}
