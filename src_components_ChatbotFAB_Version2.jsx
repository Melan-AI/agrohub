import React, { useState } from "react";

/*
  Chatbot is a simulated agent. Integration point: replace generateResponse with Gemini/LLM endpoint.
  The bot always uses the terms "Agroexplorers" and "seller" and handles Hausa/Yoruba/English selection.
*/
export default function ChatbotFAB({ user }) {
  const [open, setOpen] = useState(false);
  const [lang, setLang] = useState("en");
  const [messages, setMessages] = useState([
    { from: "agent", text: "Welcome to AgroHub. I am the AgroHub Intelligent Agent assisting Agroexplorers and seller interactions." }
  ]);
  const [input, setInput] = useState("");

  function send() {
    if (!input.trim()) return;
    const userMsg = { from: "user", text: input };
    setMessages(m => [...m, userMsg]);
    setInput("");
    // Simulated agent response
    const reply = generateResponse(input, lang);
    setTimeout(() => setMessages(m => [...m, { from: "agent", text: reply }]), 600);
  }

  return (
    <>
      <button className="fab" onClick={() => setOpen(true)}>💬</button>
      {open && (
        <div className="chat-modal glass-box chat-size">
          <div className="chat-header">
            <h4>AgroHub Agent</h4>
            <div className="lang-select">
              <select value={lang} onChange={(e)=>setLang(e.target.value)}>
                <option value="en">English</option>
                <option value="ha">Hausa</option>
                <option value="yo">Yoruba</option>
              </select>
            </div>
            <button className="btn ghost" onClick={() => setOpen(false)}>Close</button>
          </div>
          <div className="chat-body">
            {messages.map((m, i) => <div key={i} className={"chat-msg " + (m.from==='agent' ? 'agent' : 'user')}>{m.text}</div>)}
          </div>
          <div className="chat-input">
            <input value={input} onChange={(e)=>setInput(e.target.value)} placeholder="Ask about nutrition, health-safe produce, pricing, or orders..." />
            <button className="btn primary" onClick={send}>Send</button>
          </div>
        </div>
      )}
    </>
  );
}

function generateResponse(prompt, lang) {
  // NOTE: This is a deterministic, local stub. Replace with Gemini integration.
  const base = {
    en: "As the AgroHub Intelligent Agent, I help Agroexplorers and seller decisions. ",
    ha: "A matsayina na AgroHub Agent, zan taimaka wa Agroexplorers da seller. ",
    yo: "Gẹ́gẹ́ bí AgroHub Agent, mà ń ràn Agroexplorers àti seller lọ́wọ́. "
  }[lang || 'en'];

  // Simple parsing to show features: health filtering and escrow explanation
  if (prompt.toLowerCase().includes("escrow") || prompt.toLowerCase().includes("fund")) {
    return base + "Price breakdown: item cost + logistics + service fee. Payment options: Linked Account Autofill or Blockchain Payment (crypto held in escrow until delivery confirmation). Funds are locked as 'Funds Locked in Escrow' until 'Delivered - Funds Released'.";
  }
  if (prompt.toLowerCase().includes("diet") || prompt.toLowerCase().includes("nutrition")) {
    return base + "I can create a balanced diet timetable using health-approved produce currently available from sellers. Please upload your Wellness Profile (Medical Report) in My Wellness Profile for precision filtering.";
  }
  return base + "I can assist with product suggestions, health-safe recommendations, price breakdowns, and order tracking. Always using the words Agroexplorers and seller in my responses.";
}