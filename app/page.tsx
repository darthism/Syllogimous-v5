import { LegacyApp } from "@/ui/legacy/LegacyApp";
import { loadLegacyBodyHtml } from "@/ui/legacy/loadLegacyBodyHtml";

export default function Page() {
  const markup = loadLegacyBodyHtml();
  return <LegacyApp markup={markup} />;
}


