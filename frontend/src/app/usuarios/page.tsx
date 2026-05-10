// ============================================================
//  🎓 PÁGINA: Lista de Usuários
//
//  Conceitos cobertos:
//    - useEffect: buscar dados quando o componente monta
//    - useState: guardar a lista, loading, erro
//    - useApi: hook customizado (encapsula useEffect + useState)
//    - GET com Bearer Token automático (via customQuery)
// ============================================================
"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useApi } from "@/hooks/useApi";
import { apiDelete } from "@/lib/api";
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

interface UsersResponse {
  data: User[];
  total: number;
  message: string;
}

export default function UsuariosPage() {
  const { user: loggedUser, token } = useAuth();

  // 🎓 useApi = hook customizado que usa useEffect + useState internamente
  // Só ativa quando o usuário está logado (tem token)
  const { data, error, status, isLoading, refetch } = useApi<UsersResponse>("/users", {
    enabled: !!token,
  });

  // 🎓 useState separado para mostrar resposta bruta de delete
  const [deleteResponse, setDeleteResponse] = useState<any>(null);
  const [deleteStatus, setDeleteStatus] = useState<number | null>(null);

  // 🎓 Exemplo explícito de useEffect (igual ao que useApi faz internamente)
  useEffect(() => {
    console.log("📦 useEffect disparou! data mudou:", data);
  }, [data]); // Dependência: roda toda vez que `data` muda

  async function handleDelete(id: string) {
    const result = await apiDelete(`/users/${id}`);
    setDeleteResponse(result.data);
    setDeleteStatus(result.status);
    if (result.ok) refetch(); // Recarrega a lista
  }

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "2rem 1.5rem" }}>
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: 28, fontWeight: 800 }}>👥 Lista de Usuários</h1>
        <p style={{ color: "#9ca3af", marginTop: "0.5rem" }}>
          GET protegido — o token Bearer é enviado automaticamente pelo <code>customQuery</code>
        </p>
        <div style={{ marginTop: "0.5rem", display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
          <span className="concept-pill">useEffect</span>
          <span className="concept-pill">useState</span>
          <span className="concept-pill">useApi (hook custom)</span>
          <span className="concept-pill">Bearer Token auto</span>
          <span className="concept-pill">DELETE</span>
        </div>
      </div>

      {!token && (
        <div style={{ background: "#7c1d1d", border: "1px solid #ef4444", borderRadius: 8, padding: "1rem", marginBottom: "1.5rem" }}>
          ⚠️ Você não está logado! <Link href="/login" style={{ color: "#fca5a5" }}>Fazer login</Link> para ver os usuários.
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
        {/* Lista */}
        <div>
          {/* 🎓 Mostra o código que está por trás */}
          <div className="card" style={{ marginBottom: "1rem" }}>
            <p style={{ fontSize: 12, color: "#6b7280", fontWeight: 600, marginBottom: "0.5rem" }}>
              🎓 Como funciona (hooks internos do useApi):
            </p>
            <pre className="code-block">{`// hooks/useApi.ts
const [data, setData] = useState(null);   // ← useState
const [isLoading, setIsLoading] = useState(false);

useEffect(() => {           // ← useEffect
  async function fetch() {
    const result = await customQuery("/users");
    setData(result.data);
  }
  fetch();
}, []); // ← [] = roda 1x ao montar

// No header da requisição vai automaticamente:
// Authorization: Bearer ${token?.slice(0, 20) ?? "<token>"}...`}</pre>
          </div>

          {/* Loading */}
          {isLoading && (
            <div className="loading" style={{ padding: "2rem", textAlign: "center", color: "#6b7280" }}>
              ⏳ Buscando usuários...
            </div>
          )}

          {/* Erro */}
          {error && !isLoading && (
            <div style={{ background: "#7c1d1d", border: "1px solid #ef4444", borderRadius: 8, padding: "1rem" }}>
              <strong>❌ Erro {status}:</strong> {error}
            </div>
          )}

          {/* Lista de usuários */}
          {data?.data && (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              <p style={{ fontSize: 13, color: "#9ca3af" }}>
                Total: <strong style={{ color: "#f9fafb" }}>{data.total}</strong> usuários
              </p>
              {data.data.map((u) => (
                <div key={u.id} className="card" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <p style={{ fontWeight: 700 }}>{u.name}</p>
                    <p style={{ fontSize: 12, color: "#9ca3af" }}>{u.email} · {u.city}</p>
                    <div style={{ display: "flex", gap: "0.35rem", marginTop: "0.35rem" }}>
                      <span className="concept-pill">{u.role}</span>
                      {u.age && <span style={{ fontSize: 11, color: "#6b7280" }}>{u.age} anos</span>}
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <Link href={`/usuarios/${u.id}`}>
                      <button className="btn btn-ghost" style={{ fontSize: 12 }}>Ver</button>
                    </Link>
                    {loggedUser?.role === "admin" && (
                      <button className="btn btn-danger" style={{ fontSize: 12 }} onClick={() => handleDelete(u.id)}>
                        Del
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Resposta JSON */}
        <div>
          <div className="card">
            <h3 style={{ fontWeight: 700, marginBottom: "0.75rem" }}>Resposta bruta da API</h3>
            <JsonViewer data={data} status={status} />
          </div>
          {deleteResponse && (
            <div className="card" style={{ marginTop: "1rem" }}>
              <h3 style={{ fontWeight: 700, marginBottom: "0.75rem" }}>Resposta do DELETE</h3>
              <JsonViewer data={deleteResponse} status={deleteStatus} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
