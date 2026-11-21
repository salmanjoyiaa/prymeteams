import { HomePage } from "@/components/home/HomePage";
import { getSiteSettings } from "@/lib/settings-server";

export default async function Page() {
  const settings = await getSiteSettings();
  return <HomePage settings={settings} />;
}
