import Navbar from "../components/Navbar";

export default function SuspiciousUsers() {

  const users = [
    { name: "Rahul", email: "rahul@gmail.com" },
    { name: "Sneha", email: "sneha@gmail.com" }
  ];

  return (
    <div className="min-h-screen flex flex-col text-white">

      <Navbar />

      {/* Header */}
      <div className="glass-card p-6 mx-6 mt-6 text-center">
        <h1 className="text-2xl font-semibold">
          Suspicious Users
        </h1>

        <p className="text-gray-300 text-sm mt-1">
          Monitor and control suspicious activity on the platform
        </p>
      </div>

      {/* User List */}
      <div className="p-8 max-w-5xl mx-auto w-full">

        {users.map((user, index) => (

          <div
            key={index}
            className="glass-card p-5 mb-4 flex justify-between items-center hover:scale-[1.01] transition"
          >

            <div>
              <p className="font-medium">
                {user.name}
              </p>

              <p className="text-sm text-gray-300">
                {user.email}
              </p>
            </div>

            <div className="flex gap-3">

              <button className="bg-yellow-400 text-black px-4 py-2 rounded-lg text-sm hover:bg-yellow-500 transition">
                Warn
              </button>

              <button className="bg-red-500 px-4 py-2 rounded-lg text-sm hover:bg-red-600 transition">
                Suspend
              </button>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}