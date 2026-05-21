import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { getAuthSession } from "../services/api";

export default function UserHome() {

  const navigate = useNavigate();

  const session = getAuthSession();
  const username =
    session?.user?.username ||
    session?.user?.name ||
    session?.user?.email?.split("@")[0] ||
    "User";

  const notices = [
    "Mid Sem Exam Schedule Released",
    "Hackathon Registration Open",
    "Library Timing Updated",
    "Internship Opportunity Notice"
  ];

  return (
    <div className="min-h-screen flex flex-col text-white">

      <Navbar />

      <div className="max-w-5xl mx-auto w-full p-6">

        {/* Welcome Card */}
        <div className="glass-card p-8 mb-6">

          <h1 className="text-3xl font-bold">
            Hello, {username}! 👋
          </h1>

          <p className="text-gray-300 mt-1">
            Welcome back. Stay updated with the latest campus notices.
          </p>

        </div>

        {/* Notices Section */}
        <div className="glass-card p-6">

          <div className="flex justify-between items-center mb-5">

            <h2 className="text-xl font-semibold">
              Recent Notices
            </h2>

            <button
              onClick={() => navigate("/notices")}
              className="text-blue-400 text-sm hover:underline"
            >
              View All
            </button>

          </div>

          <div className="space-y-3">

            {notices.map((notice, index) => (

              <div
                key={index}
                onClick={() => navigate("/notices")}
                className="glass-card p-4 flex items-center justify-between hover:scale-[1.01] transition cursor-pointer"
              >

                <div className="flex items-center gap-3">
                  <span className="text-lg">📄</span>

                  <p className="font-medium">
                    {notice}
                  </p>
                </div>

                <span className="text-blue-400 text-sm">
                  Open →
                </span>

              </div>

            ))}

          </div>

        </div>

      </div>

      {/* Chatbot Bar */}
      <div className="fixed bottom-8 left-0 right-0 flex justify-center">

        <div
          onClick={() => navigate("/chat")}
          className="glass-card px-6 py-3 w-[460px] flex items-center justify-between cursor-pointer hover:scale-[1.02] transition"
        >

          <span className="text-gray-200">
            🤖 Ask AcadAI anything about notices...
          </span>

          <span className="text-blue-400 font-semibold">
            Ask →
          </span>

        </div>

      </div>

    </div>
  );
}
