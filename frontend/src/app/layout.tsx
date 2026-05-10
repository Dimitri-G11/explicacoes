import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "🎓 API REST — Aulas Didáticas",
  description: "Ambiente completo para aprender a consumir APIs REST com Next.js",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        {/* AuthProvider envolve tudo — useContext disponível em qualquer página */}
        <AuthProvider>
          <Navbar />
          <main className="min-h-screen bg-gray-950 text-white">
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}
