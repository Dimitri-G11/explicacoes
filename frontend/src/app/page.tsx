import SectionCard from "@/components/SectionCard";

const sections = [
  {
    title: "🔐 Login & JWT",
    href: "/login",
    description: "POST com body payload, receber token Bearer, salvar no localStorage, erro 400/401",
    concepts: ["useState", "fetch POST", "JWT", "localStorage", "erro 400", "erro 401"],
    color: "#4f46e5",
  },
  {
    title: "📝 Registro",
    href: "/registro",
    description: "POST com body rico, resposta 201 Created, erro 400 de email duplicado",
    concepts: ["useState", "POST body", "201 Created", "400 duplicado"],
    color: "#7c3aed",
  },
  {
    title: "👥 Lista de Usuários",
    href: "/usuarios",
    description: "GET protegido com Bearer Token. useEffect busca ao montar o componente",
    concepts: ["useEffect", "useState", "useApi hook", "Bearer Token", "DELETE"],
    color: "#0891b2",
  },
  {
    title: "👤 Usuário por ID",
    href: "/usuarios/1",
    description: "Rota /usuarios/[id]. useParams lê o ID. useEffect re-busca quando o ID muda",
    concepts: ["useParams", "[id] dynamic route", "useEffect deps", "erro 404"],
    color: "#059669",
  },
  {
    title: "📦 Os 3 Tipos de Dado",
    href: "/payload",
    description: "Compare body JSON vs query params (?k=v) vs URL params (/:id) lado a lado",
    concepts: ["req.body", "req.query", "req.params", "POST", "GET"],
    color: "#b45309",
  },
  {
    title: "🔍 Busca com Query Params",
    href: "/busca",
    description: "Filtros via ?nome=x&cidade=y. URLSearchParams constrói a string. useSearchParams lê da URL",
    concepts: ["useSearchParams", "URLSearchParams", "?query=string", "useRouter"],
    color: "#d97706",
  },
  {
    title: "💥 Erros HTTP",
    href: "/erros",
    description: "Dispare cada erro na prática: 400, 401, 403, 404, 500 e CORS bloqueado",
    concepts: ["400", "401", "403", "404", "500", "CORS Error"],
    color: "#dc2626",
  },
  {
    title: "⚡ Server Actions",
    href: "/server-actions",
    description: "Chamadas à API pelo servidor Next.js. Não aparecem no DevTools do browser",
    concepts: ["use server", "Server Actions", "fetch server-side", "sem CORS"],
    color: "#6366f1",
  },
  {
    title: "🔌 WebSockets (Tempo Real)",
    href: "/websocket",
    description: "Conexão bidirecional contínua com Socket.io. Eventos, Emit e Broadcast.",
    concepts: ["socket.io", "emit", "on", "broadcast", "real-time"],
    color: "#10b981",
  },
];

export default function HomePage() {
  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "2rem 1.5rem" }}>
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "3rem" }}>
        <div style={{ fontSize: 56, marginBottom: "0.75rem" }}>🎓</div>
        <h1 style={{ fontSize: 38, fontWeight: 900, color: "#f9fafb", marginBottom: "0.75rem", letterSpacing: "-0.5px" }}>
          API REST — Ambiente de Aulas
        </h1>
        <p style={{ color: "#9ca3af", fontSize: 16, maxWidth: 640, margin: "0 auto", lineHeight: 1.6 }}>
          Ambiente didático completo para aprender a consumir APIs REST com{" "}
          <strong style={{ color: "#f9fafb" }}>Next.js + React</strong>.
          Backend rodando em{" "}
          <code style={{ background: "#1f2937", padding: "2px 8px", borderRadius: 4, color: "#a5b4fc" }}>
            http://localhost:3002
          </code>
        </p>
      </div>

      {/* Grid de seções */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
        gap: "1rem",
        marginBottom: "2.5rem",
      }}>
        {sections.map((s) => (
          <SectionCard key={s.href} {...s} />
        ))}
      </div>

      {/* Credenciais + endpoints */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "1rem" }}>
        <div className="card" style={{ borderColor: "#4f46e540" }}>
          <h3 style={{ fontWeight: 700, marginBottom: "0.75rem" }}>🔑 Credenciais de Teste</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {[
              { email: "ana@email.com", role: "ADMIN", cor: "#4f46e5" },
              { email: "bruno@email.com", role: "user", cor: "#374151" },
              { email: "carla@email.com", role: "user", cor: "#374151" },
            ].map(({ email, role, cor }) => (
              <div key={email} style={{ background: "#1f2937", borderRadius: 6, padding: "8px 12px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 13, fontFamily: "monospace" }}>{email}</span>
                  <span style={{ fontSize: 11, background: cor, padding: "2px 6px", borderRadius: 4 }}>{role}</span>
                </div>
                <span style={{ fontSize: 12, color: "#6b7280" }}>senha: 123456</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h3 style={{ fontWeight: 700, marginBottom: "0.75rem" }}>🔧 Todos os Endpoints do Backend</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "0.4rem" }}>
            {[
              { method: "POST", path: "/auth/login", note: "público" },
              { method: "POST", path: "/auth/register", note: "público" },
              { method: "GET", path: "/users", note: "🔒 Bearer" },
              { method: "GET", path: "/users/:id", note: "🔒 Bearer" },
              { method: "POST", path: "/users", note: "🔒 Admin" },
              { method: "PUT", path: "/users/:id", note: "🔒 Admin" },
              { method: "DELETE", path: "/users/:id", note: "🔒 Admin" },
              { method: "GET", path: "/exemplos/query-params", note: "?filtros" },
              { method: "POST", path: "/exemplos/body-payload", note: "body JSON" },
              { method: "GET", path: "/exemplos/erro-400", note: "→ 400" },
              { method: "GET", path: "/exemplos/erro-404", note: "→ 404" },
              { method: "GET", path: "/exemplos/erro-500", note: "→ 500" },
              { method: "GET", path: "/exemplos/sem-cors", note: "❌ CORS" },
              { method: "GET", path: "/exemplos/somente-admin", note: "🔒 → 403" },
              { method: "WS", path: "socket.io", note: "🔌 Tempo Real" },
            ].map(({ method, path, note }) => (
              <div key={method + path} style={{
                background: "#0d1117", borderRadius: 4, padding: "5px 8px",
                display: "flex", justifyContent: "space-between", alignItems: "center", gap: "0.5rem"
              }}>
                <span style={{ fontSize: 10, background: method === "GET" ? "#1e3a5f" : method === "POST" ? "#14532d" : method === "PUT" ? "#78350f" : method === "WS" ? "#064e3b" : "#4c1d95", color: "white", padding: "1px 5px", borderRadius: 3, fontWeight: 700, flexShrink: 0 }}>
                  {method}
                </span>
                <code style={{ fontSize: 11, flex: 1 }}>{path}</code>
                <span style={{ fontSize: 10, color: "#6b7280", flexShrink: 0 }}>{note}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
