import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const navigate = useNavigate();

  const users = [
    { name: "Rahul", email: "rahul@email.com" },
    { name: "Priya", email: "priya@email.com" }
  ];

  const suspiciousUsers = [
    { name: "Aman", reason: "Too many chatbot queries" },
    { name: "Sneha", reason: "Abusive content" }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      
      <Navbar />

      {/* Header */}
      <div className="bg-gradient-to-br from-blue-700 via-indigo-700 to-purple-700 text-white p-10 shadow-lg">
        <h1 className="text-4xl font-extrabold tracking-tight">Admin Dashboard</h1>
        <p className="text-sm mt-2 opacity-80">
          Manage notices, track user activity, and secure your campus platform.
        </p>
      </div>

      {/* Main */}
      <div className="p-8 max-w-6xl mx-auto w-full">

        {/* Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">

          <div
            onClick={() => navigate("/upload")}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 cursor-pointer 
            hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
          >
            <h2 className="text-xl font-semibold mb-2">📤 Upload Notice</h2>
            <p className="text-sm text-gray-500">
              Add new campus documents
            </p>
          </div>

          <div
            onClick={() => navigate("/edit-docs")}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 cursor-pointer
            hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
          >
            <h2 className="text-xl font-semibold mb-2">✏ Modify Notices</h2>
            <p className="text-sm text-gray-500">Edit or delete posted notices</p>
          </div>

          <div
            onClick={() => navigate("/documents")}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 cursor-pointer
            hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
          >
            <h2 className="text-xl font-semibold mb-2">📄 All Documents</h2>
            <p className="text-sm text-gray-500">View all uploaded content</p>
          </div>

          <div
            onClick={() => navigate("/suspicious-users")}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 cursor-pointer
            hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
          >
            <h2 className="text-xl font-semibold mb-2">⚠ Suspicious Users</h2>
            <p className="text-sm text-gray-500">Monitor unusual activity</p>
          </div>
        </div>

        {/* All Users */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-7 mb-10">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            👥 All Users
          </h2>

          {users.map((user, i) => (
            <div
              key={i}
              className="flex justify-between items-center py-4 border-b last:border-none"
            >
              <div>
                <p className="font-medium">{user.name}</p>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>

              <button className="bg-red-500 text-white px-4 py-2 text-sm rounded-lg 
                hover:bg-red-600 active:scale-95 transition">
                Delete
              </button>
            </div>
          ))}
        </div>

        {/* Suspicious Users */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-7">
          <h2 className="text-xl font-bold mb-6 text-red-600">
            ⚠ Suspicious Activity
          </h2>

          {suspiciousUsers.map((user, i) => (
            <div
              key={i}
              className="flex justify-between items-center py-4 border-b last:border-none"
            >
              <div>
                <p className="font-medium">{user.name}</p>
                <p className="text-sm text-gray-500">{user.reason}</p>
              </div>

              <div className="flex gap-3">
                <button className="bg-yellow-400 text-black px-4 py-2 text-sm rounded-lg
                  hover:bg-yellow-500 active:scale-95 transition">
                  Warn
                </button>

                <button className="bg-red-500 text-white px-4 py-2 text-sm rounded-lg
                  hover:bg-red-600 active:scale-95 transition">
                  Suspend
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
