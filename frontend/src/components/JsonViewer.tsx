// ============================================================
//  🎓 COMPONENTE: JsonViewer
//  Exibe qualquer objeto JSON com syntax highlighting bonito
//  Reutilizado em todas as páginas para mostrar respostas da API
// ============================================================
interface JsonViewerProps {
  data: unknown;
  title?: string;
  status?: number | null;
}

function getStatusClass(status: number | null | undefined) {
  if (!status) return "badge-cors";
  if (status >= 200 && status < 300) return status === 201 ? "badge-201" : "badge-200";
  if (status === 400) return "badge-400";
  if (status === 401) return "badge-401";
  if (status === 403) return "badge-403";
  if (status === 404) return "badge-404";
  if (status >= 500) return "badge-500";
  return "badge-200";
}

export default function JsonViewer({ data, title, status }: JsonViewerProps) {
  return (
    <div style={{ marginTop: "1rem" }}>
      {(title || status) && (
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
          {title && <span style={{ fontSize: 13, color: "#9ca3af" }}>{title}</span>}
          {status && <span className={getStatusClass(status)}>HTTP {status}</span>}
        </div>
      )}
      <pre className="code-block">
        {data ? JSON.stringify(data, null, 2) : "— sem resposta —"}
      </pre>
    </div>
  );
}
