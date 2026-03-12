import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function UserHome() {

  const navigate = useNavigate();

  const username = "Nayu";

  const notices = [
    "Mid Sem Exam Schedule Released",
    "Hackathon Registration Open",
    "Library Timing Updated",
    "Internship Opportunity Notice"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex flex-col">

      <Navbar />

      <div className="max-w-5xl mx-auto w-full p-6">

        {/* Welcome Card */}
        <div className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-2xl shadow-lg p-8 mb-6">

          <h1 className="text-3xl font-bold">
            Hello, {username}! 👋
          </h1>

          <p className="opacity-90 mt-1">
            Welcome back. Stay updated with the latest campus notices.
          </p>

        </div>

        {/* Notices Section */}
        <div className="backdrop-blur-md bg-white/60 border border-white/40 rounded-2xl shadow-lg p-6">

          <div className="flex justify-between items-center mb-5">

            <h2 className="text-xl font-semibold text-gray-800">
              Recent Notices
            </h2>

            <button
              onClick={() => navigate("/notices")}
              className="text-blue-600 text-sm font-medium hover:underline"
            >
              View All
            </button>

          </div>

          <div className="space-y-3">

            {notices.map((notice, index) => (
              <div
                key={index}
                onClick={() => navigate("/notices")}
                className="flex items-center justify-between p-4 rounded-xl bg-white/70 border border-gray-200 hover:shadow-md hover:scale-[1.01] transition cursor-pointer"
              >

                <div className="flex items-center gap-3">
                  <span className="text-lg">📄</span>
                  <p className="text-gray-700 font-medium">
                    {notice}
                  </p>
                </div>

                <span className="text-blue-500 text-sm">
                  Open →
                </span>

              </div>
            ))}

          </div>

        </div>

      </div>

      {/* Floating Chatbot Bar */}
      <div className="fixed bottom-8 left-0 right-0 flex justify-center">

        <div
          onClick={() => navigate("/chat")}
          className="backdrop-blur-lg bg-white/70 border border-white/50 shadow-xl rounded-full px-6 py-3 w-[460px] flex items-center justify-between cursor-pointer hover:scale-[1.02] transition"
        >

          <span className="text-gray-700">
            🤖 Ask AcadAI anything about notices...
          </span>

          <span className="text-blue-500 font-semibold">
            Ask →
          </span>

        </div>

      </div>

    </div>
  );
}