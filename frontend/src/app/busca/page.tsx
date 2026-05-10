// Next.js exige Suspense em torno de useSearchParams
import { Suspense } from "react";
import BuscaContent from "./BuscaContent";

export default function BuscaPage() {
  return (
    <Suspense fallback={<div style={{ padding: "2rem", color: "#9ca3af" }}>⏳ Carregando...</div>}>
      <BuscaContent />
    </Suspense>
  );
}
