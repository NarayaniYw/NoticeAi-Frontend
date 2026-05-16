import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { clearAuthSession, getAuthSession } from "../services/api";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const session = getAuthSession();
  const user = session?.user || {
    username: "Guest",
    email: "Not signed in",
  };

  const logout = () => {
    clearAuthSession();
    navigate("/");
  };

  return (
    <>
      <div className="glass-card w-full p-4 flex justify-between items-center text-white">
        <h1 className="text-xl font-semibold">SmartDocAI</h1>

        <button
          onClick={() => setOpen(true)}
          className="text-sm font-semibold hover:text-blue-300"
          aria-label="Open menu"
        >
          Menu
        </button>
      </div>

      {open && (
        <div className="fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />

          <div className="absolute top-0 right-0 w-72 h-full glass-card p-6 text-white">
            <button
              onClick={() => setOpen(false)}
              className="text-sm font-semibold mb-6 hover:text-blue-300"
              aria-label="Close menu"
            >
              Close
            </button>

            <div className="mb-6">
              <h2 className="font-semibold text-lg">{user.username || user.name}</h2>
              <p className="text-gray-300 text-sm">{user.email}</p>
            </div>

            <div className="flex flex-col gap-4">
              <button className="text-left hover:text-blue-400">
                Profile
              </button>

              <button className="text-left hover:text-blue-400">
                Settings
              </button>

              <button onClick={logout} className="text-left text-red-400 mt-10">
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
