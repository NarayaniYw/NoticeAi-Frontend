import { useState, useRef, useEffect } from "react";
import Navbar from "../components/Navbar";

export default function Chatbot() {

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [history, setHistory] = useState([]);

  const chatEndRef = useRef(null);

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

    const updatedMessages = [...messages, userMsg, aiMsg];

    setMessages(updatedMessages);
    setInput("");

    if (messages.length === 0) {
      setHistory([...history, input]);
    }
  };

  const newChat = () => {
    setMessages([]);
  };

  return (
    <div className="min-h-screen flex text-white">

      {/* Sidebar */}
      <div className={`transition-all duration-300 
      ${sidebarOpen ? "w-64" : "w-0"} overflow-hidden`}>

        <div className="glass-card h-full p-4 flex flex-col">

          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold">Chats</h2>

            <button
              onClick={() => setSidebarOpen(false)}
              className="text-xl"
            >
              ←
            </button>
          </div>

          <button
            onClick={newChat}
            className="glass-button mb-6"
          >
            + New Chat
          </button>

          <div className="flex flex-col gap-2 overflow-y-auto">

            {history.map((chat, index) => (
              <div
                key={index}
                className="p-2 rounded hover:bg-white/10 cursor-pointer text-sm"
              >
                {chat}
              </div>
            ))}

          </div>

        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">

        <Navbar />

        {/* Header */}
        <div className="glass-card p-4 text-lg font-semibold text-center mx-4 mt-4">
          SmartDocAI Assistant 🤖
        </div>

        {/* Sidebar Toggle */}
        {!sidebarOpen && (
          <button
            onClick={() => setSidebarOpen(true)}
            className="glass-button w-fit m-4"
          >
            ☰
          </button>
        )}

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-6">

          {/* Welcome Screen */}
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center">
            <div className="flex flex-col items-center glass-card justify-center p-16 text-center space-y-4">

              <h1 className="text-3xl font-semibold">
                Ask SmartDocAI anything
              </h1>

              <p className="text-gray-300">
                Get instant answers about campus notices
              </p>

              <div className="grid md:grid-cols-2 gap-3 max-w-lg">

                <button
                  onClick={() => setInput("Mid sem exam schedule")}
                  className="glass-card bg-white/5 p-3 text-sm hover:bg-white/10 hover:scale-[1.02] transition"
                >
                  📄 Mid Sem Schedule
                </button>

                <button
                  onClick={() => setInput("Placement notices")}
                  className="glass-card bg-white/5 p-3 text-sm hover:bg-white/10 hover:scale-[1.02] transition"
                >
                  💼 Placement Notices
                </button>

                <button
                  onClick={() => setInput("Internship opportunities")}
                  className="glass-card bg-white/5 p-3 text-sm hover:bg-white/10 hover:scale-[1.02] transition"
                >
                  🚀 Internship Opportunities
                </button>

                <button
                  onClick={() => setInput("Library timing")}
                  className="glass-card bg-white/5 p-3 text-sm hover:bg-white/10 hover:scale-[1.02] transition"
                >
                  📚 Library Timing
                </button>

              </div>
            </div>
            </div>
          )}

          {/* Messages */}
          <div className="space-y-4">

            {messages.map((msg, index) => (

              <div
                key={index}
                className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}
              >

                <div
                  className={`max-w-xs px-4 py-3 rounded-2xl glass-card
                  ${msg.type === "user"
                      ? "bg-blue-600 text-white rounded-br-none"
                      : "text-gray-200 rounded-bl-none"
                    }`}
                >

                  <p>{msg.text}</p>

                  {msg.link && (
                    <p className="text-blue-400 text-sm mt-2 cursor-pointer">
                      📄 {msg.link}
                    </p>
                  )}

                  <p className="text-[10px] opacity-70 mt-2 text-right">
                    {msg.time}
                  </p>

                </div>

              </div>

            ))}

          </div>

          <div ref={chatEndRef} />

        </div>

        {/* Input */}
        <div className="glass-card p-3 m-4 flex items-center gap-2">

          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask SmartDocAI anything..."
            className="flex-1 bg-transparent outline-none text-white placeholder-gray-400"
          />

          <button
            onClick={sendMessage}
            className="glass-button"
          >
            ➤
          </button>

        </div>

      </div>
    </div>
  );
}