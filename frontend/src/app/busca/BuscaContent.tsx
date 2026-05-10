// ============================================================
//  🎓 COMPONENTE: BuscaContent (usa useSearchParams)
//
//  Separado em arquivo próprio pois useSearchParams
//  exige Suspense boundary no Next.js 14
// ============================================================
"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { apiGet } from "@/lib/api";
import JsonViewer from "@/components/JsonViewer";

export default function BuscaContent() {
  const searchParams = useSearchParams(); // 🎓 lê ?params da URL atual
  const router = useRouter();

  const [nome, setNome] = useState(searchParams.get("nome") || "");
  const [cidade, setCidade] = useState(searchParams.get("cidade") || "");
  const [minAge, setMinAge] = useState(searchParams.get("minAge") || "");
  const [maxAge, setMaxAge] = useState(searchParams.get("maxAge") || "");

  const [response, setResponse] = useState<any>(null);
  const [status, setStatus] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [urlUsada, setUrlUsada] = useState("");

  async function handleBuscar() {
    setIsLoading(true);

    // 🎓 URLSearchParams — constrói a query string
    const params = new URLSearchParams();
    if (nome) params.set("nome", nome);
    if (cidade) params.set("cidade", cidade);
    if (minAge) params.set("minAge", minAge);
    if (maxAge) params.set("maxAge", maxAge);

    const queryString = params.toString();
    const endpoint = `/exemplos/query-params${queryString ? `?${queryString}` : ""}`;
    setUrlUsada(`http://localhost:3001${endpoint}`);

    // Atualiza a URL do browser sem recarregar
    router.replace(`/busca?${queryString}`, { scroll: false });

    const result = await apiGet(endpoint);
    setResponse(result.data);
    setStatus(result.status);
    setIsLoading(false);
  }

  function handleLimpar() {
    setNome(""); setCidade(""); setMinAge(""); setMaxAge("");
    setResponse(null); setUrlUsada("");
    router.replace("/busca");
  }

  return (
    <div style={{ maxWidth: 1000, margin: "0 auto", padding: "2rem 1.5rem" }}>
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: 28, fontWeight: 800 }}>🔍 Busca com Query Params</h1>
        <p style={{ color: "#9ca3af", marginTop: "0.5rem" }}>
          Filtros enviados via <code>?nome=x&cidade=y</code> na URL — <code>req.query</code> no backend
        </p>
        <div style={{ marginTop: "0.5rem", display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
          <span className="concept-pill">useSearchParams</span>
          <span className="concept-pill">URLSearchParams</span>
          <span className="concept-pill">?query=string</span>
          <span className="concept-pill">useRouter.replace</span>
          <span className="concept-pill">req.query (backend)</span>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
        <div>
          <div className="card" style={{ marginBottom: "1rem" }}>
            <h3 style={{ fontWeight: 700, marginBottom: "1rem" }}>Filtros (Query Params)</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              <div>
                <label style={{ fontSize: 12, color: "#9ca3af", display: "block", marginBottom: 4 }}>Nome (?nome=)</label>
                <input className="input" value={nome} onChange={e => setNome(e.target.value)} placeholder="Ex: Ana" />
              </div>
              <div>
                <label style={{ fontSize: 12, color: "#9ca3af", display: "block", marginBottom: 4 }}>Cidade (?cidade=)</label>
                <input className="input" value={cidade} onChange={e => setCidade(e.target.value)} placeholder="Ex: São Paulo" />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
                <div>
                  <label style={{ fontSize: 12, color: "#9ca3af", display: "block", marginBottom: 4 }}>Idade mín</label>
                  <input className="input" type="number" value={minAge} onChange={e => setMinAge(e.target.value)} placeholder="20" />
                </div>
                <div>
                  <label style={{ fontSize: 12, color: "#9ca3af", display: "block", marginBottom: 4 }}>Idade máx</label>
                  <input className="input" type="number" value={maxAge} onChange={e => setMaxAge(e.target.value)} placeholder="40" />
                </div>
              </div>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <button className="btn btn-primary" onClick={handleBuscar} disabled={isLoading} style={{ flex: 1 }}>
                  {isLoading ? "Buscando..." : "Buscar"}
                </button>
                <button className="btn btn-ghost" onClick={handleLimpar}>Limpar</button>
              </div>
            </div>
          </div>

          {urlUsada && (
            <div className="card">
              <p style={{ fontSize: 12, color: "#6b7280", fontWeight: 600, marginBottom: "0.5rem" }}>🎓 URL chamada:</p>
              <code style={{ fontSize: 12, color: "#a5b4fc", wordBreak: "break-all" }}>{urlUsada}</code>
              <p style={{ fontSize: 12, color: "#6b7280", fontWeight: 600, marginTop: "1rem", marginBottom: "0.5rem" }}>
                🎓 No backend (Node.js):
              </p>
              <pre className="code-block">{`// server.js
app.get("/exemplos/query-params", (req, res) => {
  const { nome, cidade, minAge, maxAge } = req.query;
  // nome   = "${nome || ""}"
  // cidade = "${cidade || ""}"
});`}</pre>
            </div>
          )}
        </div>

        <div className="card">
          <h3 style={{ fontWeight: 700, marginBottom: "0.75rem" }}>Resposta da API</h3>
          {isLoading && <p className="loading" style={{ color: "#6b7280" }}>⏳ Buscando...</p>}
          <JsonViewer data={response} status={status} />
        </div>
      </div>
    </div>
  );
}
