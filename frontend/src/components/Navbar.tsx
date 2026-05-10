"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "🏠 Home" },
  { href: "/login", label: "🔐 Login" },
  { href: "/registro", label: "📝 Registro" },
  { href: "/usuarios", label: "👥 Usuários" },
  { href: "/usuarios/1", label: "👤 Por ID" },
  { href: "/busca", label: "🔍 Query Params" },
  { href: "/payload", label: "📦 3 Tipos de Dado" },
  { href: "/erros", label: "💥 Erros HTTP" },
  { href: "/server-actions", label: "⚡ Server Actions" },
  { href: "/websocket", label: "🔌 WebSocket" },
];

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const pathname = usePathname();

  return (
    <nav style={{
      background: "#0d1117",
      borderBottom: "1px solid #21262d",
      padding: "0 1rem",
      display: "flex",
      alignItems: "center",
      gap: "0.25rem",
      overflowX: "auto",
      minHeight: "56px",
      position: "sticky",
      top: 0,
      zIndex: 100,
    }}>
      <span style={{
        color: "#6366f1", fontWeight: 800, fontSize: 16,
        whiteSpace: "nowrap", marginRight: "0.5rem",
        padding: "4px 10px", background: "#1e1b4b",
        borderRadius: 6,
      }}>
        🎓
      </span>

      {links.map((link) => {
        const active = pathname === link.href;
        return (
          <Link
            key={link.href}
            href={link.href}
            style={{
              padding: "5px 10px",
              borderRadius: 6,
              fontSize: 12,
              fontWeight: active ? 700 : 500,
              whiteSpace: "nowrap",
              color: active ? "#a5b4fc" : "#8b949e",
              background: active ? "#1e1b4b" : "transparent",
              textDecoration: "none",
              transition: "all 0.15s",
              border: active ? "1px solid #4f46e580" : "1px solid transparent",
            }}
          >
            {link.label}
          </Link>
        );
      })}

      <div style={{ flex: 1 }} />

      {user ? (
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", whiteSpace: "nowrap" }}>
          <div style={{
            background: "#1f2937", border: "1px solid #374151",
            borderRadius: 6, padding: "4px 10px", fontSize: 12,
          }}>
            <span style={{ color: "#9ca3af" }}>👤 </span>
            <strong style={{ color: "#f9fafb" }}>{user.name.split(" ")[0]}</strong>
            {isAdmin && (
              <span style={{
                marginLeft: 6, fontSize: 10, background: "#4f46e5",
                padding: "1px 5px", borderRadius: 3, color: "white"
              }}>ADMIN</span>
            )}
          </div>
          <button
            onClick={logout}
            style={{
              background: "transparent", border: "1px solid #374151",
              color: "#9ca3af", padding: "4px 10px", borderRadius: 6,
              fontSize: 12, cursor: "pointer",
            }}
          >
            Sair
          </button>
        </div>
      ) : (
        <Link href="/login" style={{
          fontSize: 12, color: "#6366f1", fontWeight: 700,
          textDecoration: "none", whiteSpace: "nowrap",
          background: "#1e1b4b", padding: "5px 12px",
          borderRadius: 6, border: "1px solid #4f46e580",
        }}>
          Login →
        </Link>
      )}
    </nav>
  );
}
