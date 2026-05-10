// ============================================================
//  🎓 PÁGINA: Usuário por ID — Rota Dinâmica [id]
//
//  Arquivo: /app/usuarios/[id]/page.tsx
//  URL:     /usuarios/1   /usuarios/2   /usuarios/abc
//
//  Conceitos cobertos:
//    - Pasta [id] = rota dinâmica do Next.js
//    - useParams() para ler o :id da URL
//    - useEffect com [id] como dependência (re-busca quando muda)
//    - Erro 404 quando ID não existe
// ============================================================
"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation"; // 🎓 useParams!
import { apiGet } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import JsonViewer from "@/components/JsonViewer";
import Link from "next/link";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  age: number;
  city: string;
}

export default function UsuarioPage() {
  // 🎓 useParams — lê os segmentos dinâmicos da URL
  // A pasta se chama [id], então params.id = valor da URL
  const params = useParams();
  const id = params.id as string; // ex: "1", "2", "3"

  const { token } = useAuth();

  // Estado local
  const [user, setUser] = useState<User | null>(null);
  const [response, setResponse] = useState<any>(null);
  const [status, setStatus] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // 🎓 useEffect com [id] como dependência:
  // Toda vez que o ID na URL muda, busca novamente!
  useEffect(() => {
    if (!token || !id) return;

    async function buscarUsuario() {
      setIsLoading(true);
      setUser(null);

      const result = await apiGet<{ data: User }>(`/users/${id}`);

      setResponse(result.data);
      setStatus(result.status);

      if (result.ok && result.data?.data) {
        setUser(result.data.data);
      }
      setIsLoading(false);
    }

    buscarUsuario();
  }, [id, token]); // 🎓 Dependências: roda quando id OU token mudam

  const otherIds = ["1", "2", "3", "abc-nao-existe"];

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "2rem 1.5rem" }}>
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: 28, fontWeight: 800 }}>👤 Usuário por ID</h1>
        <p style={{ color: "#9ca3af", marginTop: "0.5rem" }}>
          Rota: <code style={{ background: "#1f2937", padding: "2px 6px", borderRadius: 4 }}>/usuarios/[id]</code>
          → endpoint: <code style={{ background: "#1f2937", padding: "2px 6px", borderRadius: 4 }}>GET /users/{id}</code>
        </p>
        <div style={{ marginTop: "0.5rem", display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
          <span className="concept-pill">useParams</span>
          <span className="concept-pill">[id] dynamic route</span>
          <span className="concept-pill">useEffect com deps</span>
          <span className="concept-pill">erro 404</span>
        </div>
      </div>

      {/* Navegação entre IDs para demonstrar re-fetch */}
      <div className="card" style={{ marginBottom: "1.5rem" }}>
        <p style={{ fontSize: 13, color: "#9ca3af", marginBottom: "0.75rem" }}>
          🎓 Clique em outro ID — o <code>useEffect([id])</code> vai re-buscar automaticamente:
        </p>
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
          {otherIds.map((otherId) => (
            <Link key={otherId} href={`/usuarios/${otherId}`}>
              <button
                className={`btn ${otherId === id ? "btn-primary" : "btn-ghost"}`}
                style={{ fontSize: 13 }}
              >
                /usuarios/<strong>{otherId}</strong>
              </button>
            </Link>
          ))}
        </div>
      </div>

      {!token && (
        <div style={{ background: "#7c1d1d", border: "1px solid #ef4444", borderRadius: 8, padding: "1rem", marginBottom: "1.5rem" }}>
          ⚠️ <Link href="/login" style={{ color: "#fca5a5" }}>Faça login</Link> para buscar usuários.
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
        {/* Info do usuário */}
        <div>
          <div className="card" style={{ marginBottom: "1rem" }}>
            <p style={{ fontSize: 12, color: "#6b7280", fontWeight: 600, marginBottom: "0.5rem" }}>
              🎓 Código na página:
            </p>
            <pre className="code-block">{`// 1️⃣ Pasta: app/usuarios/[id]/page.tsx
// 2️⃣ Hook:
const params = useParams();
const id = params.id; // "${id}"

// 3️⃣ useEffect com dependência [id]:
useEffect(() => {
  buscarUsuario(id); // re-busca quando id muda!
}, [id]); // ← dependência

// 4️⃣ Endpoint chamado:
GET /users/${id}`}</pre>
          </div>

          {isLoading && (
            <div className="loading card" style={{ textAlign: "center", color: "#6b7280" }}>
              ⏳ Buscando usuário {id}...
            </div>
          )}

          {user && !isLoading && (
            <div className="card">
              <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1rem" }}>
                <div style={{
                  width: 60, height: 60, borderRadius: "50%",
                  background: "#4f46e5", display: "flex", alignItems: "center",
                  justifyContent: "center", fontSize: 24
                }}>
                  {user.name[0]}
                </div>
                <div>
                  <h2 style={{ fontWeight: 700, fontSize: 20 }}>{user.name}</h2>
                  <span className="concept-pill">{user.role}</span>
                </div>
              </div>
              {[
                { label: "ID", value: user.id },
                { label: "Email", value: user.email },
                { label: "Cidade", value: user.city },
                { label: "Idade", value: user.age ? `${user.age} anos` : "—" },
              ].map(({ label, value }) => (
                <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #1f2937", fontSize: 14 }}>
                  <span style={{ color: "#9ca3af" }}>{label}</span>
                  <span style={{ fontFamily: "monospace" }}>{value}</span>
                </div>
              ))}
            </div>
          )}

          {status === 404 && !isLoading && (
            <div style={{ background: "#1e3a5f", border: "1px solid #3b82f6", borderRadius: 8, padding: "1rem" }}>
              <p style={{ fontWeight: 700 }}>404 — Usuário não encontrado</p>
              <p style={{ fontSize: 13, color: "#93c5fd", marginTop: "0.5rem" }}>
                O ID &quot;<strong>{id}</strong>&quot; não existe no banco de dados.
              </p>
            </div>
          )}
        </div>

        {/* Resposta JSON */}
        <div className="card">
          <h3 style={{ fontWeight: 700, marginBottom: "0.75rem" }}>Resposta bruta da API</h3>
          <JsonViewer data={response} status={status} />
        </div>
      </div>
    </div>
  );
}
