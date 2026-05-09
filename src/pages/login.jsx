import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ApiError, loginWithBackend, saveAuthSession } from "../services/api";

export default function Login() {

  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // sample credentials
  const USER_CREDENTIALS = { username: "user", password: "123" };
  const ADMIN_CREDENTIALS = { username: "admin", password: "123" };

  const getDashboardRoute = (role) => (role === "admin" ? "/admin" : "/home");

  const canUseLocalCredentials = (role) => {
    const credentials = role === "admin" ? ADMIN_CREDENTIALS : USER_CREDENTIALS;

    return username === credentials.username && password === credentials.password;
  };

  const shouldUseLocalFallback = (error) =>
    error instanceof ApiError && (!error.status || error.status === 404 || error.status >= 500);

  const login = async (role) => {
    if (!username || !password) {
      alert("Please enter username and password");
      return;
    }

    setIsLoggingIn(true);

    try {
      const session = await loginWithBackend({ username, password, role });

      saveAuthSession({
        role: session?.role || role,
        token: session?.access_token || session?.token || null,
        user: session?.user || { username },
      });

      navigate(getDashboardRoute(session?.role || role));
    } catch (error) {
      if (shouldUseLocalFallback(error) && canUseLocalCredentials(role)) {
        saveAuthSession({
          role,
          token: null,
          user: { username },
        });

        navigate(getDashboardRoute(role));
        return;
      }

      alert(error.message || `Invalid ${role} credentials`);
    } finally {
      setIsLoggingIn(false);
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
            disabled={isLoggingIn}
            className="w-full p-3 mb-4 rounded-lg bg-white/10 border border-white/20 outline-none backdrop-blur text-white placeholder-gray-300"
          />

        {/* Password */}
        <input
          type="password"
            placeholder="Password"
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                login("user");
              }
            }}
            disabled={isLoggingIn}
            className="w-full p-3 mb-6 rounded-lg bg-white/10 border border-white/20 outline-none backdrop-blur text-white placeholder-gray-300"
          />

        {/* Buttons */}
        <div className="flex flex-col gap-3">

          <button
            onClick={() => login("user")}
            disabled={isLoggingIn}
            className="bg-blue-800 hover:bg-blue-900 p-3 rounded-lg font-semibold transition"
          >
            {isLoggingIn ? "Logging in..." : "Login as User"}
          </button>

          <button
            onClick={() => login("admin")}
            disabled={isLoggingIn}
            className="bg-blue-800 hover:bg-blue-900 p-3 rounded-lg font-semibold transition"
          >
            {isLoggingIn ? "Logging in..." : "Login as Admin"}
          </button>

        </div>

        <p className="text-center text-gray-300 text-sm mt-6">
          New to SmartDocAI?{" "}
          <Link to="/register" className="text-blue-300 hover:underline">
            Register
          </Link>
        </p>

      </div>

    </div>
  );
}
