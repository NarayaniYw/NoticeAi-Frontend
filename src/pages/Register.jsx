import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerWithBackend } from "../services/api";

export default function Register() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("user");
  const [isRegistering, setIsRegistering] = useState(false);

  const register = async (e) => {
    e.preventDefault();

    if (!username || !email || !password || !confirmPassword) {
      alert("Please fill all fields");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    setIsRegistering(true);

    try {
      await registerWithBackend({ username, email, password, role });
      alert("Registration successful. Please login.");
      navigate("/");
    } catch (error) {
      alert(error.message || "Registration failed. Please try again.");
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center text-white p-4">
      <form onSubmit={register} className="glass-card w-full max-w-[420px] p-8">
        <h1 className="text-4xl font-bold text-center mb-2">
          Create Account
        </h1>

        <p className="text-center text-gray-300 mb-8">
          Join SmartDocAI
        </p>

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          disabled={isRegistering}
          className="w-full p-3 mb-4 rounded-lg bg-white/10 border border-white/20 outline-none backdrop-blur text-white placeholder-gray-300"
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isRegistering}
          className="w-full p-3 mb-4 rounded-lg bg-white/10 border border-white/20 outline-none backdrop-blur text-white placeholder-gray-300"
        />

        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          disabled={isRegistering}
          className="w-full p-3 mb-4 rounded-lg bg-white/10 border border-white/20 outline-none backdrop-blur text-white"
        >
          <option className="text-black" value="user">User</option>
          <option className="text-black" value="admin">Admin</option>
        </select>

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isRegistering}
          className="w-full p-3 mb-4 rounded-lg bg-white/10 border border-white/20 outline-none backdrop-blur text-white placeholder-gray-300"
        />

        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          disabled={isRegistering}
          className="w-full p-3 mb-6 rounded-lg bg-white/10 border border-white/20 outline-none backdrop-blur text-white placeholder-gray-300"
        />

        <button
          type="submit"
          disabled={isRegistering}
          className="bg-blue-800 hover:bg-blue-900 p-3 rounded-lg font-semibold transition w-full"
        >
          {isRegistering ? "Creating account..." : "Register"}
        </button>

        <p className="text-center text-gray-300 text-sm mt-6">
          Already have an account?{" "}
          <Link to="/" className="text-blue-300 hover:underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}
