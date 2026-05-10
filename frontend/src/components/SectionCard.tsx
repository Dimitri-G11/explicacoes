"use client";
import Link from "next/link";

interface SectionCardProps {
  href: string;
  title: string;
  description: string;
  concepts: string[];
  color: string;
}

export default function SectionCard({ href, title, description, concepts, color }: SectionCardProps) {
  return (
    <Link href={href} style={{ textDecoration: "none" }}>
      <div
        className="card"
        style={{ borderColor: color + "40", transition: "all 0.2s", cursor: "pointer" }}
        onMouseEnter={(e) => (e.currentTarget.style.borderColor = color)}
        onMouseLeave={(e) => (e.currentTarget.style.borderColor = color + "40")}
      >
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: "0.5rem" }}>{title}</h2>
        <p style={{ color: "#9ca3af", fontSize: 13, marginBottom: "0.75rem", lineHeight: 1.5 }}>
          {description}
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem" }}>
          {concepts.map((c) => (
            <span key={c} className="concept-pill">{c}</span>
          ))}
        </div>
      </div>
    </Link>
  );
}
