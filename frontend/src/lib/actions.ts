// ============================================================
//  🎓 SERVER ACTIONS — Chamadas à API pelo SERVIDOR Next.js
//
//  "use server" = este código roda no Node do Next (servidor)
//  NÃO no browser do usuário!
//
//  Vantagens:
//    - Não expõe o token no browser
//    - Evita CORS (servidor → servidor)
//    - Pode usar variáveis de ambiente secretas (sem NEXT_PUBLIC_)
//    - Pode ser chamado de Server Components ou Client Components
// ============================================================
"use server";

const BASE_URL = process.env.API_URL || "http://localhost:3001";

// ============================================================
//  Busca lista de usuários — chamada pelo SERVIDOR
// ============================================================
export async function serverGetUsers(token: string) {
  const res = await fetch(`${BASE_URL}/users`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`, // Token vem do client mas a chamada sai do servidor
    },
    cache: "no-store", // Não cacheia — sempre busca dados frescos
  });

  const data = await res.json();
  return { data, status: res.status, ok: res.ok };
}

// ============================================================
//  Busca usuário por ID — chamada pelo SERVIDOR
// ============================================================
export async function serverGetUserById(id: string, token: string) {
  const res = await fetch(`${BASE_URL}/users/${id}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  const data = await res.json();
  return { data, status: res.status, ok: res.ok };
}

// ============================================================
//  Login via Server Action
//  Útil quando você não quer que as credenciais apareçam
//  no DevTools do browser (Network tab)
// ============================================================
export async function serverLogin(email: string, password: string) {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();
  return { data, status: res.status, ok: res.ok };
}

// ============================================================
//  Busca com Query Params via Server Action
//  O servidor constrói a URL com os filtros
// ============================================================
export async function serverSearchUsers(filters: {
  nome?: string;
  cidade?: string;
  minAge?: number;
  maxAge?: number;
}) {
  const params = new URLSearchParams();
  if (filters.nome) params.append("nome", filters.nome);
  if (filters.cidade) params.append("cidade", filters.cidade);
  if (filters.minAge) params.append("minAge", String(filters.minAge));
  if (filters.maxAge) params.append("maxAge", String(filters.maxAge));

  const url = `${BASE_URL}/exemplos/query-params?${params.toString()}`;

  const res = await fetch(url, { cache: "no-store" });
  const data = await res.json();
  return { data, status: res.status, ok: res.ok };
}

// ============================================================
//  Envia body payload via Server Action
// ============================================================
export async function serverPostPayload(payload: Record<string, unknown>) {
  const res = await fetch(`${BASE_URL}/exemplos/body-payload`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  return { data, status: res.status, ok: res.ok };
}
