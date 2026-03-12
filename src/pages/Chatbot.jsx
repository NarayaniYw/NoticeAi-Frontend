import { useState, useRef, useEffect } from "react";
import Navbar from "../components/Navbar";

export default function Chatbot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const chatEndRef = useRef(null);

  // auto scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim()) return;

    const userMsg = {
      type: "user",
      text: input,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };

    const aiMsg = {
      type: "ai",
      text: "Here is a related notice for your query:",
      link: "MidSemSchedule.pdf",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };

    setMessages([...messages, userMsg, aiMsg]);
    setInput("");
  };

  return (
    <div className="h-screen flex flex-col bg-gray-100">

      {/* Navbar */}
      <Navbar />

      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 text-lg font-semibold shadow">
        AcadAI Assistant 🤖
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">

        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}>

            <div className={`max-w-xs px-4 py-2 rounded-2xl shadow 
              ${msg.type === "user"
                ? "bg-blue-600 text-white rounded-br-none"
                : "bg-white text-gray-800 rounded-bl-none"
              }`}>

              <p>{msg.text}</p>

              {msg.link && (
                <p className="text-sm text-blue-500 mt-1 cursor-pointer">
                  📄 {msg.link}
                </p>
              )}

              <p className="text-[10px] text-right opacity-70 mt-1">
                {msg.time}
              </p>

            </div>
          </div>
        ))}

        <div ref={chatEndRef} />

      </div>

      {/* Input Box */}
      <div className="p-3 bg-white border-t flex items-center gap-2">

        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask AcadAI anything..."
          className="flex-1 border rounded-full px-4 py-2 outline-none shadow-sm"
        />

        <button
          onClick={sendMessage}
          className="bg-blue-600 text-white px-5 py-2 rounded-full hover:bg-blue-700 transition"
        >
          ➤
        </button>

      </div>

    </div>
  );
}