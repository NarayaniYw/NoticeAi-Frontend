import { useState } from "react";

export default function Navbar() {

  const [open, setOpen] = useState(false);

  const user = {
    name: "Nayu",
    email: "nayu@email.com"
  };

  return (
    <>
      {/* Top Navbar */}
      <div className="glass-card w-full p-4 flex justify-between items-center text-white">
        <h1 className="text-xl font-semibold">SmartDocAI</h1>

        <button
          onClick={() => setOpen(true)}
          className="text-2xl"
        >
          ☰
        </button>
      </div>

      {/* Sidebar */}
      {open && (
        <div className="fixed inset-0 z-50">

          {/* Background overlay */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          ></div>

          {/* Glass Sidebar */}
          <div className="absolute top-0 right-0 w-72 h-full glass-card p-6 text-white">

            <button
              onClick={() => setOpen(false)}
              className="text-xl mb-6"
            >
              ✖
            </button>

            {/* Profile */}
            <div className="mb-6">
              <h2 className="font-semibold text-lg">{user.name}</h2>
              <p className="text-gray-300 text-sm">{user.email}</p>
            </div>

            {/* Menu */}
            <div className="flex flex-col gap-4">

              <button className="text-left hover:text-blue-400">
                Profile
              </button>

              <button className="text-left hover:text-blue-400">
                Settings
              </button>

              <button className="text-left text-red-400 mt-10">
                Logout
              </button>

            </div>

          </div>

        </div>
      )}
    </>
  );
}