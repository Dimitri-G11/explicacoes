"use client";

import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

export default function WebSocketPage() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<{ tipo: string; txt: string; time: string }[]>([]);
  const [inputMsg, setInputMsg] = useState("");

  useEffect(() => {
    // 🎓 Conecta ao servidor Socket.io na porta 3002
    const socketIo = io("http://localhost:3002");
    setSocket(socketIo);

    socketIo.on("connect", () => {
      setIsConnected(true);
      setMessages(m => [...m, { tipo: "sistema", txt: "🔌 Conectado ao servidor!", time: new Date().toLocaleTimeString() }]);
    });

    socketIo.on("disconnect", () => {
      setIsConnected(false);
      setMessages(m => [...m, { tipo: "sistema", txt: "❌ Desconectado do servidor.", time: new Date().toLocaleTimeString() }]);
    });

    // 🎓 Ouve resposta direta do servidor
    socketIo.on("resposta_servidor", (data: any) => {
      setMessages(m => [...m, { tipo: "servidor", txt: data.mensagem, time: new Date(data.timestamp).toLocaleTimeString() }]);
    });

    // 🎓 Ouve broadcast (mensagens para todos)
    socketIo.on("aviso_geral", (data: any) => {
      setMessages(m => [...m, { tipo: "broadcast", txt: data.mensagem, time: new Date(data.timestamp).toLocaleTimeString() }]);
    });

    return () => {
      socketIo.disconnect();
    };
  }, []);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMsg.trim() || !socket) return;

    // 🎓 Envia a mensagem para o servidor
    socket.emit("mensagem_cliente", { mensagem: inputMsg });
    setMessages(m => [...m, { tipo: "eu", txt: inputMsg, time: new Date().toLocaleTimeString() }]);
    setInputMsg("");
  };

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "2rem 1.5rem" }}>
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: 28, fontWeight: 800 }}>🔌 WebSockets (Socket.io)</h1>
        <p style={{ color: "#9ca3af", marginTop: "0.5rem" }}>
          Ao contrário do HTTP (que é sempre <em>Requisição → Resposta</em>), o WebSocket mantém uma conexão aberta bidirecional.
        </p>
      </div>

      <div className="card" style={{ marginBottom: "2rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1rem" }}>
          <div style={{
            width: 12, height: 12, borderRadius: "50%",
            background: isConnected ? "#10b981" : "#ef4444",
            boxShadow: `0 0 10px ${isConnected ? "#10b981" : "#ef4444"}`
          }} />
          <span style={{ fontWeight: 600 }}>Status: {isConnected ? "Conectado" : "Desconectado"}</span>
        </div>

        <div style={{
          background: "#0d1117",
          border: "1px solid #1f2937",
          borderRadius: 8,
          height: 300,
          overflowY: "auto",
          padding: "1rem",
          display: "flex",
          flexDirection: "column",
          gap: "0.75rem",
          marginBottom: "1rem"
        }}>
          {messages.map((msg, idx) => (
            <div key={idx} style={{
              alignSelf: msg.tipo === "eu" ? "flex-end" : "flex-start",
              background: msg.tipo === "eu" ? "#4f46e5" : msg.tipo === "sistema" ? "#374151" : msg.tipo === "broadcast" ? "#d97706" : "#059669",
              padding: "8px 12px",
              borderRadius: 8,
              maxWidth: "80%",
              fontSize: 14
            }}>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.7)", marginBottom: 4 }}>
                {msg.tipo.toUpperCase()} • {msg.time}
              </div>
              <div>{msg.txt}</div>
            </div>
          ))}
          {messages.length === 0 && (
            <div style={{ color: "#6b7280", textAlign: "center", marginTop: "auto", marginBottom: "auto" }}>
              Nenhuma mensagem ainda.
            </div>
          )}
        </div>

        <form onSubmit={sendMessage} style={{ display: "flex", gap: "0.5rem" }}>
          <input
            type="text"
            className="input"
            value={inputMsg}
            onChange={(e) => setInputMsg(e.target.value)}
            placeholder="Digite uma mensagem..."
            disabled={!isConnected}
            style={{ flex: 1 }}
          />
          <button type="submit" className="btn btn-primary" disabled={!isConnected || !inputMsg.trim()}>
            Enviar 📤
          </button>
        </form>
      </div>

      <div className="card">
        <h3 style={{ fontWeight: 700, marginBottom: "0.75rem" }}>💡 Conceitos para a Aula</h3>
        <ul style={{ color: "#d1d5db", fontSize: 14, lineHeight: 1.6, paddingLeft: "1.2rem" }}>
          <li><strong>Conexão Contínua:</strong> O servidor pode enviar dados a qualquer momento, sem o cliente pedir (ex: Chat, Notificações).</li>
          <li><strong>Emit / On:</strong> <code>socket.emit()</code> envia o dado, <code>socket.on()</code> escuta o evento.</li>
          <li><strong>Broadcast:</strong> O servidor envia uma mensagem para <strong>todos</strong> os clientes conectados ao mesmo tempo (veja o "AVISO_GERAL" amarelo).</li>
          <li>Abra esta página em <strong>duas abas diferentes</strong> e mande mensagem em uma delas para ver o broadcast funcionando na outra!</li>
        </ul>
      </div>
    </div>
  );
}
