import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const navigate = useNavigate();

  const users = [
    { name: "Rahul", email: "rahul@email.com" },
    { name: "Priya", email: "priya@email.com" },
  ];

  return (
    <div className="min-h-screen w-full flex flex-col text-white">
      <Navbar />

      <div className="glass-card p-10 mb-10 mx-6 mt-6 border border-white/20">
        <h1 className="text-4xl font-bold tracking-tight">
          Admin Dashboard
        </h1>

        <p className="text-sm mt-2 opacity-80">
          Manage notices, track user activity, and secure your campus platform.
        </p>
      </div>

      <div className="p-8 max-w-6xl mx-auto w-full">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          <div
            onClick={() => navigate("/upload")}
            className="glass-card p-6 cursor-pointer hover:scale-[1.03] transition"
          >
            <h2 className="text-xl font-semibold mb-2">Upload Notice</h2>
            <p className="text-gray-300 text-sm">
              Add new campus documents
            </p>
          </div>

          <div
            onClick={() => navigate("/edit-docs")}
            className="glass-card p-6 cursor-pointer hover:scale-[1.03] transition"
          >
            <h2 className="text-xl font-semibold mb-2">Modify Notices</h2>
            <p className="text-gray-300 text-sm">
              Edit or delete posted notices
            </p>
          </div>

          <div
            onClick={() => navigate("/documents")}
            className="glass-card p-6 cursor-pointer hover:scale-[1.03] transition"
          >
            <h2 className="text-xl font-semibold mb-2">All Documents</h2>
            <p className="text-gray-300 text-sm">
              View all uploaded content
            </p>
          </div>
        </div>

        <div className="glass-card p-7 mb-10 border border-white/20">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            All Users
          </h2>

          {users.map((user, i) => (
            <div
              key={i}
              className="flex justify-between items-center py-4 border-b border-white/10 last:border-none"
            >
              <div>
                <p className="font-medium">{user.name}</p>
                <p className="text-sm text-gray-300">{user.email}</p>
              </div>

              <button
                className="bg-red-500 px-4 py-2 text-sm rounded-lg hover:bg-red-600 transition"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
