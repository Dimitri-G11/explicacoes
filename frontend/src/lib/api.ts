// ============================================================
//  🎓 FUNÇÃO CENTRAL DE FETCH — "customQuery"
//
//  Todos os outros hooks e pages chamam DAQUI.
//  Conceitos cobertos:
//    - Centralização de lógica de requisição
//    - Headers automáticos (Content-Type, Authorization)
//    - Tratamento de erros HTTP padronizado
//    - Token JWT lido do localStorage
// ============================================================

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

// Tipo genérico para a resposta
export interface ApiResponse<T = unknown> {
  data: T | null;
  error: string | null;
  status: number | null;
  ok: boolean;
}

// ============================================================
//  customQuery — função central de chamada à API
// ============================================================
export async function customQuery<T = unknown>(
  endpoint: string,
  options: RequestInit = {},
  debug: boolean = false
): Promise<ApiResponse<T>> {
  // Pega o token salvo no localStorage (se existir)
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const defaultHeaders: Record<string, string> = {
    "Content-Type": "application/json",
  };

  // Se existir token, adiciona o header Authorization: Bearer <token>
  if (token) {
    defaultHeaders["Authorization"] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...((options.headers as Record<string, string>) || {}),
      },
    });

    if (debug) {
      console.log("Endpoint:", endpoint);
      console.log("Options:", options);
      console.log("Headers:", defaultHeaders);
      console.log("Response:", response);
    }

    // Tenta parsear o JSON da resposta
    let data: T | null = null;
    try {
      data = await response.json();
    } catch {
      data = null;
    }

    return {
      data,
      error: response.ok ? null : (data as any)?.message || `Erro HTTP ${response.status}`,
      status: response.status,
      ok: response.ok,
    };
  } catch (err: any) {
    // Erro de rede (ex: CORS, servidor offline)
    return {
      data: null,
      error: err.message || "Erro de rede ou CORS",
      status: null,
      ok: false,
    };
  }
}

// ============================================================
//  Helpers de conveniência
// ============================================================
export const apiGet = <T>(endpoint: string) =>
  customQuery<T>(endpoint, { method: "GET" });

export const apiPost = <T>(endpoint: string, payload: unknown) =>
  customQuery<T>(endpoint, { method: "POST", body: JSON.stringify(payload) });

export const apiPut = <T>(endpoint: string, payload: unknown) =>
  customQuery<T>(endpoint, { method: "PUT", body: JSON.stringify(payload) });

export const apiDelete = <T>(endpoint: string) =>
  customQuery<T>(endpoint, { method: "DELETE" });
