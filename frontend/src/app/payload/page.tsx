// ============================================================
//  🎓 PÁGINA: Body Payload — Demonstração Completa
//
//  Mostra lado a lado:
//    - Dados enviados via BODY (JSON)
//    - Dados enviados via QUERY PARAMS (?key=value)
//    - Dados enviados via URL PARAMS (/users/:id)
//  Para a aluna entender a diferença entre os 3 lugares
// ============================================================
"use client";

import { useState } from "react";
import { customQuery } from "@/lib/api";
import JsonViewer from "@/components/JsonViewer";

export default function PayloadPage() {
  // Body payload
  const [bodyData, setBodyData] = useState(
    JSON.stringify({ mensagem: "Olá API!", numero: 42, ativo: true }, null, 2)
  );
  const [bodyResult, setBodyResult] = useState<any>(null);
  const [bodyStatus, setBodyStatus] = useState<number | null>(null);

  // Query params
  const [qNome, setQNome] = useState("Ana");
  const [qCidade, setQCidade] = useState("São Paulo");
  const [queryResult, setQueryResult] = useState<any>(null);
  const [queryStatus, setQueryStatus] = useState<number | null>(null);

  // URL params
  const [urlId, setUrlId] = useState("1");
  const [urlResult, setUrlResult] = useState<any>(null);
  const [urlStatus, setUrlStatus] = useState<number | null>(null);

  const [loading, setLoading] = useState<Record<string, boolean>>({});

  async function sendBody() {
    setLoading(l => ({ ...l, body: true }));
    try {
      const parsed = JSON.parse(bodyData);
      const r = await customQuery("/exemplos/body-payload", {
        method: "POST",
        body: JSON.stringify(parsed),
      });
      setBodyResult(r.data);
      setBodyStatus(r.status);
    } catch {
      alert("JSON inválido no body!");
    }
    setLoading(l => ({ ...l, body: false }));
  }

  async function sendQuery() {
    setLoading(l => ({ ...l, query: true }));
    const params = new URLSearchParams();
    if (qNome) params.set("nome", qNome);
    if (qCidade) params.set("cidade", qCidade);
    const r = await customQuery(`/exemplos/query-params?${params}`);
    setQueryResult(r.data);
    setQueryStatus(r.status);
    setLoading(l => ({ ...l, query: false }));
  }

  async function sendUrlParam() {
    setLoading(l => ({ ...l, url: true }));
    const r = await customQuery(`/users/${urlId}`);
    setUrlResult(r.data);
    setUrlStatus(r.status);
    setLoading(l => ({ ...l, url: false }));
  }

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "2rem 1.5rem" }}>
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: 28, fontWeight: 800 }}>📦 Os 3 Jeitos de Enviar Dados</h1>
        <p style={{ color: "#9ca3af", marginTop: "0.5rem" }}>
          Compare lado a lado: <strong>Body</strong> · <strong>Query Params</strong> · <strong>URL Params</strong>
        </p>
      </div>

      {/* Tabela comparativa */}
      <div className="card" style={{ marginBottom: "2rem", overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #374151" }}>
              {["", "Body (JSON)", "Query Params (?k=v)", "URL Params (/:id)"].map(h => (
                <th key={h} style={{ padding: "10px 12px", textAlign: "left", color: "#9ca3af", fontWeight: 600 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              ["Onde aparece", "Corpo da requisição (invisível na URL)", "Na URL após o ?", "Na própria URL"],
              ["Método HTTP", "POST, PUT, PATCH", "GET (normalmente)", "GET, DELETE, PUT..."],
              ["Exemplo", '{ "email": "a@b.com" }', "?nome=Ana&cidade=SP", "/users/1"],
              ["Backend lê em", "req.body", "req.query", "req.params"],
              ["Visível no browser", "❌ Não (DevTools → Network)", "✅ Sim (barra de endereço)", "✅ Sim (barra de endereço)"],
              ["Bom para", "Dados sensíveis, payloads grandes", "Filtros, buscas, paginação", "Identificar um recurso único"],
            ].map(([label, ...cols]) => (
              <tr key={label} style={{ borderBottom: "1px solid #1f2937" }}>
                <td style={{ padding: "10px 12px", color: "#6b7280", fontWeight: 600 }}>{label}</td>
                {cols.map((c, i) => (
                  <td key={i} style={{ padding: "10px 12px", color: "#d1d5db" }}>{c}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Os 3 exemplos práticos */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.25rem" }}>

        {/* 1. Body */}
        <div className="card" style={{ borderColor: "#4f46e560" }}>
          <h2 style={{ fontWeight: 700, marginBottom: "0.5rem" }}>
            1️⃣ Body (JSON)
            <span className="concept-pill" style={{ marginLeft: "0.5rem" }}>POST</span>
          </h2>
          <p style={{ fontSize: 12, color: "#9ca3af", marginBottom: "0.75rem" }}>
            Enviado no corpo — não aparece na URL
          </p>
          <code style={{ fontSize: 11, color: "#6b7280", display: "block", marginBottom: "0.75rem" }}>
            POST /exemplos/body-payload
          </code>
          <textarea
            className="input"
            value={bodyData}
            onChange={e => setBodyData(e.target.value)}
            rows={5}
            style={{ fontFamily: "monospace", fontSize: 11, marginBottom: "0.75rem", resize: "vertical" }}
          />
          <button className="btn btn-primary" onClick={sendBody} disabled={loading.body} style={{ width: "100%" }}>
            {loading.body ? "⏳..." : "▶ Enviar via Body"}
          </button>
          <pre className="code-block" style={{ marginTop: "0.75rem", fontSize: 11 }}>{`// Backend:
const dados = req.body;`}</pre>
          {bodyResult && <JsonViewer data={bodyResult} status={bodyStatus} />}
        </div>

        {/* 2. Query Params */}
        <div className="card" style={{ borderColor: "#d9770660" }}>
          <h2 style={{ fontWeight: 700, marginBottom: "0.5rem" }}>
            2️⃣ Query Params
            <span className="concept-pill" style={{ marginLeft: "0.5rem" }}>?k=v</span>
          </h2>
          <p style={{ fontSize: 12, color: "#9ca3af", marginBottom: "0.75rem" }}>
            Aparece na URL após o <code>?</code>
          </p>
          <code style={{ fontSize: 11, color: "#6b7280", display: "block", marginBottom: "0.75rem" }}>
            GET /exemplos/query-params?nome={qNome}&cidade={qCidade}
          </code>
          <input className="input" value={qNome} onChange={e => setQNome(e.target.value)}
            placeholder="nome" style={{ marginBottom: "0.5rem" }} />
          <input className="input" value={qCidade} onChange={e => setQCidade(e.target.value)}
            placeholder="cidade" style={{ marginBottom: "0.75rem" }} />
          <button className="btn btn-primary" onClick={sendQuery} disabled={loading.query} style={{ width: "100%", background: "#d97706" }}>
            {loading.query ? "⏳..." : "▶ Enviar via Query"}
          </button>
          <pre className="code-block" style={{ marginTop: "0.75rem", fontSize: 11 }}>{`// Backend:
const { nome, cidade } = req.query;`}</pre>
          {queryResult && <JsonViewer data={queryResult} status={queryStatus} />}
        </div>

        {/* 3. URL Params */}
        <div className="card" style={{ borderColor: "#05966960" }}>
          <h2 style={{ fontWeight: 700, marginBottom: "0.5rem" }}>
            3️⃣ URL Params
            <span className="concept-pill" style={{ marginLeft: "0.5rem" }}>/:id</span>
          </h2>
          <p style={{ fontSize: 12, color: "#9ca3af", marginBottom: "0.75rem" }}>
            Faz parte da URL — identifica um recurso
          </p>
          <code style={{ fontSize: 11, color: "#6b7280", display: "block", marginBottom: "0.75rem" }}>
            GET /users/{urlId}
          </code>
          <input className="input" value={urlId} onChange={e => setUrlId(e.target.value)}
            placeholder="id do usuário" style={{ marginBottom: "0.75rem" }} />
          <button className="btn btn-primary" onClick={sendUrlParam} disabled={loading.url} style={{ width: "100%", background: "#059669" }}>
            {loading.url ? "⏳..." : "▶ Enviar via URL Param"}
          </button>
          <pre className="code-block" style={{ marginTop: "0.75rem", fontSize: 11 }}>{`// Backend:
const { id } = req.params;`}</pre>
          {urlResult && <JsonViewer data={urlResult} status={urlStatus} />}
        </div>
      </div>
    </div>
  );
}
