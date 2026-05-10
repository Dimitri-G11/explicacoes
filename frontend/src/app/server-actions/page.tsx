// ============================================================
//  🎓 PÁGINA: Server Actions
//
//  Demonstra a diferença entre:
//    1. Client-side fetch (roda no browser, visível no DevTools)
//    2. Server Actions (roda no servidor Next.js, invisível)
//
//  Conceitos cobertos:
//    - "use server" — código que roda no Node do Next
//    - Sem CORS (servidor fala com servidor)
//    - Token não exposto no browser
//    - Pode usar variáveis sem NEXT_PUBLIC_
//    - Chamado de Client Component com um simples await
// ============================================================
"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  serverGetUsers,
  serverGetUserById,
  serverSearchUsers,
  serverPostPayload,
  serverLogin,
} from "@/lib/actions";
import JsonViewer from "@/components/JsonViewer";

export default function ServerActionsPage() {
  const { token } = useAuth();
  const [activeTab, setActiveTab] = useState<string>("getUsers");
  const [result, setResult] = useState<any>(null);
  const [status, setStatus] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Estados dos formulários
  const [userId, setUserId] = useState("1");
  const [saEmail, setSaEmail] = useState("ana@email.com");
  const [saPassword, setSaPassword] = useState("123456");
  const [searchNome, setSearchNome] = useState("Ana");
  const [payload, setPayload] = useState(JSON.stringify({ mensagem: "Olá servidor!", valor: 42 }, null, 2));

  async function run(fn: () => Promise<{ data: any; status: number; ok: boolean }>) {
    setIsLoading(true);
    setResult(null);
    const r = await fn();
    setResult(r.data);
    setStatus(r.status);
    setIsLoading(false);
  }

  const tabs = [
    { id: "getUsers", label: "GET /users" },
    { id: "getById", label: "GET /users/:id" },
    { id: "search", label: "Query Params" },
    { id: "payload", label: "POST body" },
    { id: "login", label: "Login" },
  ];

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "2rem 1.5rem" }}>
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: 28, fontWeight: 800 }}>⚡ Server Actions</h1>
        <p style={{ color: "#9ca3af", marginTop: "0.5rem" }}>
          Estas chamadas saem do <strong>servidor Next.js</strong>, não do browser.
          Abra o DevTools → Network — você não vai ver as requisições à API!
        </p>
        <div style={{ marginTop: "0.5rem", display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
          <span className="concept-pill">"use server"</span>
          <span className="concept-pill">sem CORS</span>
          <span className="concept-pill">token oculto</span>
          <span className="concept-pill">server-side fetch</span>
        </div>
      </div>

      {/* Explicação visual da diferença */}
      <div className="card" style={{ marginBottom: "1.5rem", borderColor: "#7c3aed40" }}>
        <h3 style={{ fontWeight: 700, marginBottom: "0.75rem" }}>
          🔄 Diferença: Client Fetch vs Server Action
        </h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          <div>
            <p style={{ fontSize: 12, color: "#ef4444", fontWeight: 600, marginBottom: "0.5rem" }}>
              ❌ Client-side fetch (browser):
            </p>
            <pre className="code-block">{`// Roda no BROWSER
// Visível no DevTools → Network
// Precisa de CORS no servidor
// Token visível no localStorage

"use client"
fetch("http://api.com/users", {
  headers: { Authorization: \`Bearer \${token}\` }
})`}</pre>
          </div>
          <div>
            <p style={{ fontSize: 12, color: "#22c55e", fontWeight: 600, marginBottom: "0.5rem" }}>
              ✅ Server Action (servidor):
            </p>
            <pre className="code-block">{`// Roda no SERVIDOR Next.js
// NÃO aparece no DevTools do browser
// Sem problema de CORS
// Token/secrets protegidos

"use server"
export async function serverGetUsers(token) {
  const res = await fetch("http://api.com/users", {
    headers: { Authorization: \`Bearer \${token}\` }
  });
  return res.json();
}`}</pre>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem", flexWrap: "wrap" }}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => { setActiveTab(tab.id); setResult(null); }}
            className={`btn ${activeTab === tab.id ? "btn-primary" : "btn-ghost"}`}
            style={{ fontSize: 13 }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
        {/* Painel esquerdo — controles */}
        <div className="card">
          {activeTab === "getUsers" && (
            <div>
              <h3 style={{ fontWeight: 700, marginBottom: "0.75rem" }}>serverGetUsers(token)</h3>
              <p style={{ fontSize: 13, color: "#9ca3af", marginBottom: "1rem" }}>
                Busca todos os usuários usando seu token atual.
                A chamada sai do servidor Next.js.
              </p>
              <pre className="code-block" style={{ marginBottom: "1rem" }}>{`// lib/actions.ts
"use server"
export async function serverGetUsers(token) {
  const res = await fetch(\`\${BASE_URL}/users\`, {
    headers: { Authorization: \`Bearer \${token}\` }
  });
  return { data: await res.json(), status: res.status };
}`}</pre>
              <button
                className="btn btn-primary"
                disabled={isLoading || !token}
                onClick={() => run(() => serverGetUsers(token!))}
              >
                {isLoading ? "⏳..." : "▶ Executar Server Action"}
              </button>
              {!token && <p style={{ color: "#f59e0b", fontSize: 12, marginTop: "0.5rem" }}>⚠️ Faça login primeiro</p>}
            </div>
          )}

          {activeTab === "getById" && (
            <div>
              <h3 style={{ fontWeight: 700, marginBottom: "0.75rem" }}>serverGetUserById(id, token)</h3>
              <label style={{ fontSize: 12, color: "#9ca3af", display: "block", marginBottom: 4 }}>ID do usuário</label>
              <input className="input" value={userId} onChange={e => setUserId(e.target.value)} style={{ marginBottom: "0.75rem" }} />
              <pre className="code-block" style={{ marginBottom: "1rem" }}>{`// Endpoint chamado no servidor:
GET /users/${userId}`}</pre>
              <button
                className="btn btn-primary"
                disabled={isLoading || !token}
                onClick={() => run(() => serverGetUserById(userId, token!))}
              >
                {isLoading ? "⏳..." : "▶ Executar"}
              </button>
            </div>
          )}

          {activeTab === "search" && (
            <div>
              <h3 style={{ fontWeight: 700, marginBottom: "0.75rem" }}>serverSearchUsers(filters)</h3>
              <p style={{ fontSize: 13, color: "#9ca3af", marginBottom: "0.75rem" }}>
                O servidor constrói os query params e faz o fetch
              </p>
              <label style={{ fontSize: 12, color: "#9ca3af", display: "block", marginBottom: 4 }}>Nome</label>
              <input className="input" value={searchNome} onChange={e => setSearchNome(e.target.value)} style={{ marginBottom: "0.75rem" }} />
              <pre className="code-block" style={{ marginBottom: "1rem" }}>{`// URL construída no servidor:
/exemplos/query-params?nome=${searchNome}`}</pre>
              <button
                className="btn btn-primary"
                disabled={isLoading}
                onClick={() => run(() => serverSearchUsers({ nome: searchNome }))}
              >
                {isLoading ? "⏳..." : "▶ Executar"}
              </button>
            </div>
          )}

          {activeTab === "payload" && (
            <div>
              <h3 style={{ fontWeight: 700, marginBottom: "0.75rem" }}>serverPostPayload(body)</h3>
              <label style={{ fontSize: 12, color: "#9ca3af", display: "block", marginBottom: 4 }}>JSON para enviar no body</label>
              <textarea
                className="input"
                value={payload}
                onChange={e => setPayload(e.target.value)}
                rows={5}
                style={{ fontFamily: "monospace", fontSize: 12, marginBottom: "0.75rem", resize: "vertical" }}
              />
              <button
                className="btn btn-primary"
                disabled={isLoading}
                onClick={() => {
                  try {
                    const parsed = JSON.parse(payload);
                    run(() => serverPostPayload(parsed));
                  } catch {
                    alert("JSON inválido!");
                  }
                }}
              >
                {isLoading ? "⏳..." : "▶ Executar"}
              </button>
            </div>
          )}

          {activeTab === "login" && (
            <div>
              <h3 style={{ fontWeight: 700, marginBottom: "0.75rem" }}>serverLogin(email, password)</h3>
              <p style={{ fontSize: 13, color: "#9ca3af", marginBottom: "0.75rem" }}>
                Credenciais enviadas pelo servidor — não aparecem no Network do browser!
              </p>
              <label style={{ fontSize: 12, color: "#9ca3af", display: "block", marginBottom: 4 }}>Email</label>
              <input className="input" value={saEmail} onChange={e => setSaEmail(e.target.value)} style={{ marginBottom: "0.5rem" }} />
              <label style={{ fontSize: 12, color: "#9ca3af", display: "block", marginBottom: 4 }}>Senha</label>
              <input className="input" type="password" value={saPassword} onChange={e => setSaPassword(e.target.value)} style={{ marginBottom: "0.75rem" }} />
              <button
                className="btn btn-primary"
                disabled={isLoading}
                onClick={() => run(() => serverLogin(saEmail, saPassword))}
              >
                {isLoading ? "⏳..." : "▶ Login via Server Action"}
              </button>
            </div>
          )}
        </div>

        {/* Resposta */}
        <div className="card">
          <h3 style={{ fontWeight: 700, marginBottom: "0.75rem" }}>Resposta (vinda do servidor)</h3>
          {isLoading ? (
            <p className="loading" style={{ color: "#6b7280" }}>⏳ Servidor processando...</p>
          ) : (
            <JsonViewer data={result} status={status} />
          )}
          {result && (
            <div style={{ marginTop: "1rem", padding: "0.75rem", background: "#1f2937", borderRadius: 8, fontSize: 12, color: "#9ca3af" }}>
              💡 Esta resposta chegou via Server Action — o browser nunca fez diretamente a chamada à porta 3001.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
