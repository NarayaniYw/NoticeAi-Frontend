import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {

  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // sample credentials
  const USER_CREDENTIALS = { username: "user", password: "123" };
  const ADMIN_CREDENTIALS = { username: "admin", password: "123" };

  const loginUser = () => {
    if (!username || !password) {
      alert("Please enter username and password");
      return;
    }

    if (
      username === USER_CREDENTIALS.username &&
      password === USER_CREDENTIALS.password
    ) {
      navigate("/home");
    } else {
      alert("Invalid user credentials");
    }
  };

  const loginAdmin = () => {
    if (!username || !password) {
      alert("Please enter username and password");
      return;
    }

    if (
      username === ADMIN_CREDENTIALS.username &&
      password === ADMIN_CREDENTIALS.password
    ) {
      navigate("/admin");
    } else {
      alert("Invalid admin credentials");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center text-white">

      {/* Login Card */}
      <div className="glass-card w-[380px] p-8">

        {/* Title */}
        <h1 className="text-4xl font-bold text-center mb-2">
          SmartDocAI
        </h1>

        <p className="text-center text-gray-300 mb-8">
          Intelligent Campus Document Assistant
        </p>

        {/* Username */}
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e)=>setUsername(e.target.value)}
          className="w-full p-3 mb-4 rounded-lg bg-white/10 border border-white/20 outline-none backdrop-blur text-white placeholder-gray-300"
        />

        {/* Password */}
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e)=>setPassword(e.target.value)}
          className="w-full p-3 mb-6 rounded-lg bg-white/10 border border-white/20 outline-none backdrop-blur text-white placeholder-gray-300"
        />

        {/* Buttons */}
        <div className="flex flex-col gap-3">

          <button
            onClick={loginUser}
            className="bg-blue-800 hover:bg-blue-900 p-3 rounded-lg font-semibold transition"
          >
            Login as User
          </button>

          <button
            onClick={loginAdmin}
            className="bg-blue-800 hover:bg-blue-900 p-3 rounded-lg font-semibold transition"
          >
            Login as Admin
          </button>

        </div>

      </div>

    </div>
  );
}