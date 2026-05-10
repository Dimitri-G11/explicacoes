// ============================================================
//  🎓 PÁGINA: Registro — POST com Body Payload completo
//
//  Conceitos cobertos:
//    - useState para controlar múltiplos campos
//    - POST com body rico (name, email, password, age, city)
//    - Resposta 201 Created vs 400 duplicado
// ============================================================
"use client";

import { useState } from "react";
import { apiPost } from "@/lib/api";
import JsonViewer from "@/components/JsonViewer";
import Link from "next/link";

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    age: "",
    city: "",
  });
  const [response, setResponse] = useState<any>(null);
  const [status, setStatus] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // 🎓 Handler genérico — atualiza qualquer campo pelo name
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);

    // 🎓 apiPost envia os dados no body como JSON
    const result = await apiPost("/auth/register", {
      name: form.name,
      email: form.email,
      password: form.password,
      age: form.age ? parseInt(form.age) : undefined,
      city: form.city || undefined,
    });

    setResponse(result.data);
    setStatus(result.status);
    setIsLoading(false);
  }

  // Teste: email duplicado (vai gerar 400)
  async function handleDuplicado() {
    setIsLoading(true);
    const result = await apiPost("/auth/register", {
      name: "Ana Duplicada",
      email: "ana@email.com", // já existe!
      password: "123456",
    });
    setResponse(result.data);
    setStatus(result.status);
    setIsLoading(false);
  }

  // Teste: campos obrigatórios faltando (vai gerar 400)
  async function handleSemDados() {
    setIsLoading(true);
    const result = await apiPost("/auth/register", { name: "Só o nome" });
    setResponse(result.data);
    setStatus(result.status);
    setIsLoading(false);
  }

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "2rem 1.5rem" }}>
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: 28, fontWeight: 800 }}>📝 Registro — POST com Body</h1>
        <p style={{ color: "#9ca3af", marginTop: "0.5rem" }}>
          Cria um novo usuário. Demonstra envio de body rico e respostas 201 / 400.
        </p>
        <div style={{ marginTop: "0.5rem", display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
          <span className="concept-pill">useState</span>
          <span className="concept-pill">POST body</span>
          <span className="concept-pill">201 Created</span>
          <span className="concept-pill">400 Validação</span>
          <span className="concept-pill">400 Duplicado</span>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
        <div>
          <div className="card">
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {[
                { name: "name", label: "Nome *", placeholder: "Maria Silva", type: "text" },
                { name: "email", label: "Email *", placeholder: "maria@email.com", type: "email" },
                { name: "password", label: "Senha *", placeholder: "••••••", type: "password" },
                { name: "age", label: "Idade (opcional)", placeholder: "25", type: "number" },
                { name: "city", label: "Cidade (opcional)", placeholder: "São Paulo", type: "text" },
              ].map((field) => (
                <div key={field.name}>
                  <label style={{ fontSize: 12, color: "#9ca3af", display: "block", marginBottom: 4 }}>
                    {field.label}
                  </label>
                  <input
                    className="input"
                    name={field.name}
                    type={field.type}
                    placeholder={field.placeholder}
                    value={form[field.name as keyof typeof form]}
                    onChange={handleChange}
                  />
                </div>
              ))}
              <button className="btn btn-success" type="submit" disabled={isLoading}>
                {isLoading ? "Registrando..." : "✅ Criar Conta"}
              </button>
            </form>

            <div style={{ marginTop: "1rem", borderTop: "1px solid #1f2937", paddingTop: "1rem" }}>
              <p style={{ fontSize: 12, color: "#6b7280", fontWeight: 600, marginBottom: "0.5rem" }}>
                Testar erros:
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <button className="btn btn-ghost" onClick={handleDuplicado}>
                  ➡️ Erro 400: Email duplicado (ana@email.com)
                </button>
                <button className="btn btn-ghost" onClick={handleSemDados}>
                  ➡️ Erro 400: Campos obrigatórios ausentes
                </button>
              </div>
            </div>
          </div>

          <div className="card" style={{ marginTop: "1rem" }}>
            <p style={{ fontSize: 12, color: "#6b7280", fontWeight: 600, marginBottom: "0.5rem" }}>
              🎓 Body enviado ao servidor:
            </p>
            <pre className="code-block">{JSON.stringify(
              { name: form.name || "...", email: form.email || "...", password: "***", age: form.age || undefined, city: form.city || undefined },
              null, 2
            )}</pre>
            <p style={{ fontSize: 12, color: "#9ca3af", marginTop: "0.75rem" }}>
              Após registrar → <Link href="/login" style={{ color: "#6366f1" }}>faça login</Link>
            </p>
          </div>
        </div>

        <div className="card">
          <h3 style={{ fontWeight: 700, marginBottom: "0.75rem" }}>Resposta da API</h3>
          <JsonViewer data={response} status={status} />

          <div style={{ marginTop: "1.5rem", borderTop: "1px solid #1f2937", paddingTop: "1rem" }}>
            <p style={{ fontSize: 12, color: "#6b7280", fontWeight: 600, marginBottom: "0.5rem" }}>
              🎓 O que o backend faz:
            </p>
            <pre className="code-block">{`// server.js — POST /auth/register
const { name, email, password, age, city } = req.body;

// Validação → 400 se faltar campos
if (!name || !email || !password) {
  return res.status(400).json({ error: "..." });
}

// Duplicado → 400 se email já existe
const exists = users.find(u => u.email === email);
if (exists) return res.status(400).json({ ... });

// Sucesso → 201 Created
users.push({ id: uuidv4(), ...dados });
return res.status(201).json({ user: {...} });`}</pre>
          </div>
        </div>
      </div>
    </div>
  );
}
