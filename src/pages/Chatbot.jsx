import { useState, useRef, useEffect } from "react";
import Navbar from "../components/Navbar";
import { ApiError, queryAssistant } from "../services/api";

export default function Chatbot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [history, setHistory] = useState([]);
  const [isSending, setIsSending] = useState(false);

  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const getAnswerText = (data) =>
    data?.answer ||
    data?.response ||
    data?.message ||
    data?.result ||
    "I found a response, but it did not include an answer field.";

  const getDocumentLink = (data) => {
    const source = data?.document || data?.source || data?.file || data?.link || data?.sources?.[0];

    if (!source) return null;
    if (typeof source === "string") return source;

    return source.url || source.file || source.link || null;
  };

  const sendMessage = async () => {
    if (!input.trim() || isSending) return;

    const query = input.trim();
    const userMsg = {
      type: "user",
      text: query,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((currentMessages) => [...currentMessages, userMsg]);
    setInput("");
    setIsSending(true);

    if (messages.length === 0) {
      setHistory((currentHistory) => [query, ...currentHistory]);
    }

    try {
      const data = await queryAssistant(query);
      const aiMsg = {
        type: "ai",
        text: getAnswerText(data),
        link: getDocumentLink(data),
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((currentMessages) => [...currentMessages, aiMsg]);
    } catch (error) {
      const statusText = error instanceof ApiError && error.status ? ` (${error.status})` : "";
      const errorMsg = {
        type: "ai",
        text: `${error.message || "Unable to reach SmartDocAI right now."}${statusText}`,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((currentMessages) => [...currentMessages, errorMsg]);
    } finally {
      setIsSending(false);
    }
  };

  const newChat = () => {
    setMessages([]);
  };

  return (
    <div className="min-h-screen flex text-white">
      <div className={`transition-all duration-300 ${sidebarOpen ? "w-64" : "w-0"} overflow-hidden`}>
        <div className="glass-card h-full p-4 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold">Chats</h2>

            <button
              onClick={() => setSidebarOpen(false)}
              className="text-sm text-gray-300 hover:text-white"
            >
              Close
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
              <button
                key={`${chat}-${index}`}
                onClick={() => setInput(chat)}
                className="p-2 rounded hover:bg-white/10 cursor-pointer text-left text-sm"
              >
                {chat}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        <Navbar />

        <div className="glass-card p-4 text-lg font-semibold text-center mx-4 mt-4">
          SmartDocAI Assistant
        </div>

        {!sidebarOpen && (
          <button
            onClick={() => setSidebarOpen(true)}
            className="glass-button w-fit m-4"
          >
            Menu
          </button>
        )}

        <div className="flex-1 overflow-y-auto p-6">
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
                    Mid Sem Schedule
                  </button>

                  <button
                    onClick={() => setInput("Placement notices")}
                    className="glass-card bg-white/5 p-3 text-sm hover:bg-white/10 hover:scale-[1.02] transition"
                  >
                    Placement Notices
                  </button>

                  <button
                    onClick={() => setInput("Internship opportunities")}
                    className="glass-card bg-white/5 p-3 text-sm hover:bg-white/10 hover:scale-[1.02] transition"
                  >
                    Internship Opportunities
                  </button>

                  <button
                    onClick={() => setInput("Library timing")}
                    className="glass-card bg-white/5 p-3 text-sm hover:bg-white/10 hover:scale-[1.02] transition"
                  >
                    Library Timing
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-4">
            {messages.map((msg, index) => (
              <div
                key={`${msg.time}-${index}`}
                className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-xs px-4 py-3 rounded-2xl glass-card ${
                    msg.type === "user"
                      ? "bg-blue-600 text-white rounded-br-none"
                      : "text-gray-200 rounded-bl-none"
                  }`}
                >
                  <p>{msg.text}</p>

                  {msg.link && (
                    <a
                      href={msg.link}
                      target="_blank"
                      rel="noreferrer"
                      className="block text-blue-400 text-sm mt-2 hover:underline"
                    >
                      Open source document
                    </a>
                  )}

                  <p className="text-[10px] opacity-70 mt-2 text-right">
                    {msg.time}
                  </p>
                </div>
              </div>
            ))}

            {isSending && (
              <div className="flex justify-start">
                <div className="max-w-xs px-4 py-3 rounded-2xl glass-card text-gray-300 rounded-bl-none">
                  SmartDocAI is thinking...
                </div>
              </div>
            )}
          </div>

          <div ref={chatEndRef} />
        </div>

        <div className="glass-card p-3 m-4 flex items-center gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                sendMessage();
              }
            }}
            placeholder="Ask SmartDocAI anything..."
            disabled={isSending}
            className="flex-1 bg-transparent outline-none text-white placeholder-gray-400"
          />

          <button
            onClick={sendMessage}
            disabled={isSending}
            className="glass-button"
          >
            {isSending ? "..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
}
