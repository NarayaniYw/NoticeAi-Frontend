import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login as apiLogin, saveAuthSession } from "../services/api";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [error, setError] = useState("");

  const getDashboardRoute = (role) => (role === "admin" ? "/admin" : "/home");

  useEffect(() => {
    const authError = sessionStorage.getItem("auth_error");

    if (authError) {
      setError(authError);
      sessionStorage.removeItem("auth_error");
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Please enter email and password.");
      return;
    }

    setIsLoggingIn(true);
    setError("");

    try {
      const data = await apiLogin({ email, password });
      const token = data.token || data.data?.token;
      const user = data.user || data.data?.user;
      const role = user?.role || "user";

      if (!token || !user) {
        setError("Login response did not include a valid session.");
        return;
      }

      saveAuthSession({
        role,
        token,
        user,
      });

      navigate(getDashboardRoute(role));
    } catch (error) {
      setError(error.message || "Invalid credentials.");
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center text-white">
      <form onSubmit={handleLogin} className="glass-card w-[380px] p-8">
        <h1 className="text-4xl font-bold text-center mb-2">
          SmartDocAI
        </h1>

        <p className="text-center text-gray-300 mb-8">
          Intelligent Campus Document Assistant
        </p>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isLoggingIn}
          className="w-full p-3 mb-4 rounded-lg bg-white/10 border border-white/20 outline-none backdrop-blur text-white placeholder-gray-300"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isLoggingIn}
          className="w-full p-3 mb-6 rounded-lg bg-white/10 border border-white/20 outline-none backdrop-blur text-white placeholder-gray-300"
        />

        {error && (
          <p className="mb-4 rounded-lg border border-red-300/30 bg-red-500/20 p-3 text-sm text-red-100">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={isLoggingIn}
          className="bg-blue-800 hover:bg-blue-900 p-3 rounded-lg font-semibold transition w-full"
        >
          {isLoggingIn ? "Logging in..." : "Login"}
        </button>

        <p className="text-center text-gray-300 text-sm mt-6">
          New to SmartDocAI?{" "}
          <Link to="/register" className="text-blue-300 hover:underline">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
}
