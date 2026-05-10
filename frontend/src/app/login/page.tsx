// ============================================================
//  🎓 PÁGINA DE LOGIN
//
//  Conceitos cobertos:
//    - useState para controlar formulário
//    - POST request com body payload (email + password)
//    - Receber e armazenar Bearer Token
//    - useAuth (useContext) para login global
//    - Feedback de erro 400 e 401
// ============================================================
"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import JsonViewer from "@/components/JsonViewer";
import { apiPost } from "@/lib/api";

export default function LoginPage() {
  // 🎓 useState — controla os campos do formulário
  const [email, setEmail] = useState("ana@email.com");
  const [password, setPassword] = useState("123456");
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<any>(null);
  const [status, setStatus] = useState<number | null>(null);

  const { login, user } = useAuth(); // useContext
  const router = useRouter();

  // 🎓 Função de login usando a função CENTRAL (customQuery via apiPost)
  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setResponse(null);

    // Chama via customQuery (a função central)
    const result = await apiPost<{ token: string; user: any }>("/auth/login", { email, password });

    setResponse(result.data);
    setStatus(result.status);
    setIsLoading(false);

    if (result.ok && result.data?.token) {
      // Atualiza o contexto global
      await login(email, password);
      setTimeout(() => router.push("/usuarios"), 1500);
    }
  }

  // 🎓 Exemplo de login com credenciais ERRADAS para gerar erro 401
  async function handleLoginErrado() {
    setIsLoading(true);
    const result = await apiPost("/auth/login", {
      email: "naoexiste@email.com",
      password: "senhaerrada",
    });
    setResponse(result.data);
    setStatus(result.status);
    setIsLoading(false);
  }

  // 🎓 Exemplo sem body para gerar erro 400
  async function handleLogin400() {
    setIsLoading(true);
    const result = await apiPost("/auth/login", {});
    setResponse(result.data);
    setStatus(result.status);
    setIsLoading(false);
  }

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "2rem 1.5rem" }}>
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: 28, fontWeight: 800 }}>🔐 Login — POST com Body</h1>
        <p style={{ color: "#9ca3af", marginTop: "0.5rem" }}>
          Demonstra: <code>useState</code> para formulário · <code>fetch POST</code> com body JSON · receber JWT
        </p>
        <div style={{ marginTop: "0.5rem", display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
          <span className="concept-pill">useState</span>
          <span className="concept-pill">fetch POST</span>
          <span className="concept-pill">body payload</span>
          <span className="concept-pill">JWT Bearer</span>
          <span className="concept-pill">useContext</span>
          <span className="concept-pill">erro 400</span>
          <span className="concept-pill">erro 401</span>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
        {/* Formulário */}
        <div className="card">
          <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: "1rem" }}>Formulário de Login</h2>

          {user && (
            <div style={{ background: "#14532d", border: "1px solid #16a34a", borderRadius: 8, padding: "0.75rem", marginBottom: "1rem", fontSize: 13 }}>
              ✅ Logado como <strong>{user.name}</strong> ({user.role})
            </div>
          )}

          <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            <div>
              <label style={{ fontSize: 12, color: "#9ca3af", display: "block", marginBottom: 4 }}>Email</label>
              {/* 🎓 useState controlando o input */}
              <input
                className="input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@exemplo.com"
              />
            </div>
            <div>
              <label style={{ fontSize: 12, color: "#9ca3af", display: "block", marginBottom: 4 }}>Senha</label>
              <input
                className="input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••"
              />
            </div>
            <button className="btn btn-primary" type="submit" disabled={isLoading}>
              {isLoading ? "Aguarde..." : "Entrar"}
            </button>
          </form>

          <div style={{ marginTop: "1rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <p style={{ fontSize: 12, color: "#6b7280", fontWeight: 600 }}>Testar erros:</p>
            <button className="btn btn-ghost" onClick={handleLogin400}>
              ➡️ Gerar Erro 400 (body vazio)
            </button>
            <button className="btn btn-ghost" onClick={handleLoginErrado}>
              ➡️ Gerar Erro 401 (credenciais erradas)
            </button>
          </div>
        </div>

        {/* Código e resposta */}
        <div>
          <div className="card" style={{ marginBottom: "1rem" }}>
            <p style={{ fontSize: 12, color: "#6b7280", fontWeight: 600, marginBottom: "0.5rem" }}>
              🎓 O que está acontecendo por baixo:
            </p>
            <pre className="code-block">{`// lib/api.ts → customQuery (função central)
const result = await apiPost("/auth/login", {
  email: "${email}",
  password: "${password}",
});

// Que por dentro faz:
fetch("http://localhost:3001/auth/login", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({ email, password })
});`}</pre>
          </div>

          {response && (
            <JsonViewer data={response} title="Resposta da API:" status={status} />
          )}
        </div>
      </div>
    </div>
  );
}
