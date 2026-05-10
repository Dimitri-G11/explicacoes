// ============================================================
//  🎓 PÁGINA: Erros HTTP
//
//  Demonstra na prática cada tipo de erro HTTP:
//    - 400 Bad Request
//    - 401 Unauthorized
//    - 403 Forbidden
//    - 404 Not Found
//    - 500 Internal Server Error
//    - CORS Error (erro de rede, sem status HTTP)
// ============================================================
"use client";

import { useState } from "react";
import { customQuery } from "@/lib/api";
import JsonViewer from "@/components/JsonViewer";

interface ErroDemo {
  label: string;
  badge: string;
  badgeClass: string;
  endpoint: string;
  method?: string;
  body?: object;
  semCors?: boolean;
  descricao: string;
  explicacao: string;
  cor: string;
}

const erros: ErroDemo[] = [
  {
    label: "400 — Bad Request",
    badge: "400",
    badgeClass: "badge-400",
    endpoint: "/exemplos/erro-400",
    descricao: "Dados inválidos ou faltando no request",
    explicacao: "O CLIENTE enviou dados errados. Cheque o body/params que você enviou.",
    cor: "#7c2d12",
  },
  {
    label: "401 — Unauthorized",
    badge: "401",
    badgeClass: "badge-401",
    endpoint: "/users",
    descricao: "Sem token Bearer ou token inválido",
    explicacao: "Você precisa enviar: Authorization: Bearer <token>. Tente sem estar logado!",
    cor: "#7c1d1d",
  },
  {
    label: "403 — Forbidden",
    badge: "403",
    badgeClass: "badge-403",
    endpoint: "/exemplos/somente-admin",
    descricao: "Autenticado, mas sem permissão (não é admin)",
    explicacao: "Você está logado, mas seu role não dá acesso. Logue como 'user' para ver o 403.",
    cor: "#78350f",
  },
  {
    label: "404 — Not Found",
    badge: "404",
    badgeClass: "badge-404",
    endpoint: "/exemplos/erro-404",
    descricao: "Recurso não existe",
    explicacao: "A URL existe, mas o RECURSO pedido não foi encontrado. Ex: /users/999",
    cor: "#1e3a5f",
  },
  {
    label: "500 — Server Error",
    badge: "500",
    badgeClass: "badge-500",
    endpoint: "/exemplos/erro-500",
    descricao: "Erro interno — bug no servidor",
    explicacao: "Problema NO SERVIDOR. O cliente não fez nada errado. Cheque os logs do backend.",
    cor: "#4c1d95",
  },
  {
    label: "CORS Error",
    badge: "CORS",
    badgeClass: "badge-cors",
    endpoint: "/exemplos/sem-cors",
    semCors: true,
    descricao: "Servidor não envia Access-Control-Allow-Origin",
    explicacao: "O servidor respondeu (200!), mas o BROWSER bloqueou. No Postman não dá erro!",
    cor: "#1e1b4b",
  },
];

export default function ErrosPage() {
  const [results, setResults] = useState<Record<string, { data: any; status: number | null; error: string | null }>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});

  async function testarErro(erro: ErroDemo) {
    setLoading((l) => ({ ...l, [erro.label]: true }));

    const result = await customQuery(erro.endpoint, {
      method: erro.method || "GET",
      body: erro.body ? JSON.stringify(erro.body) : undefined,
    });

    setResults((r) => ({
      ...r,
      [erro.label]: { data: result.data, status: result.status, error: result.error },
    }));
    setLoading((l) => ({ ...l, [erro.label]: false }));
  }

  async function testarTodos() {
    for (const erro of erros) {
      await testarErro(erro);
    }
  }

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "2rem 1.5rem" }}>
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: 28, fontWeight: 800 }}>💥 Erros HTTP na Prática</h1>
        <p style={{ color: "#9ca3af", marginTop: "0.5rem" }}>
          Clique em cada botão para disparar o erro real e ver a resposta da API
        </p>
        <div style={{ marginTop: "0.5rem", display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
          {["400", "401", "403", "404", "500", "CORS"].map((b) => (
            <span key={b} className={`badge-${b.toLowerCase()}`}>HTTP {b}</span>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: "1.5rem" }}>
        <button className="btn btn-primary" onClick={testarTodos}>
          ⚡ Testar Todos de uma vez
        </button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
        {erros.map((erro) => {
          const result = results[erro.label];
          const isLoading = loading[erro.label];

          return (
            <div key={erro.label} className="card" style={{ borderColor: erro.cor + "60" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
                {/* Info do erro */}
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem" }}>
                    <span className={erro.badgeClass}>{erro.badge}</span>
                    <h2 style={{ fontWeight: 700, fontSize: 18 }}>{erro.label}</h2>
                  </div>
                  <p style={{ color: "#d1d5db", fontSize: 14, marginBottom: "0.5rem" }}>
                    {erro.descricao}
                  </p>
                  <div style={{ background: erro.cor + "30", border: `1px solid ${erro.cor}60`, borderRadius: 6, padding: "0.6rem", fontSize: 12, color: "#d1d5db", marginBottom: "0.75rem" }}>
                    💡 {erro.explicacao}
                  </div>
                  <code style={{ fontSize: 11, color: "#6b7280", display: "block", marginBottom: "0.75rem" }}>
                    GET {erro.endpoint}
                    {erro.semCors && " (sem CORS configurado)"}
                  </code>
                  <button
                    className="btn btn-ghost"
                    onClick={() => testarErro(erro)}
                    disabled={isLoading}
                  >
                    {isLoading ? "⏳ Chamando..." : "▶ Disparar este erro"}
                  </button>
                </div>

                {/* Resposta */}
                <div>
                  {result ? (
                    <>
                      {result.error && !result.status && (
                        <div style={{ background: "#1e1b4b", border: "1px solid #4f46e5", borderRadius: 8, padding: "0.75rem", marginBottom: "0.5rem", fontSize: 13 }}>
                          <strong>🚫 Erro de rede/CORS:</strong> {result.error}
                        </div>
                      )}
                      <JsonViewer data={result.data} status={result.status} title="Resposta:" />
                    </>
                  ) : (
                    <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "#4b5563", fontSize: 13 }}>
                      {isLoading ? "⏳ Aguardando..." : "— Clique para disparar —"}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
