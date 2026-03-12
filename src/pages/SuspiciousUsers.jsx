import Navbar from "../components/Navbar";

export default function SuspiciousUsers() {

  const users = [
    { name: "Rahul", email: "rahul@gmail.com" },
    { name: "Sneha", email: "sneha@gmail.com" }
  ];

  return (
    <div className="min-h-screen bg-gray-100">

      <Navbar />

      <div className="p-6">
        <h1 className="text-2xl font-semibold mb-4">
          Suspicious Users
        </h1>

        {users.map((user, index) => (
          <div
            key={index}
            className="bg-white p-4 mb-3 rounded shadow flex justify-between"
          >
            <div>
              <p>{user.name}</p>
              <p className="text-sm text-gray-500">{user.email}</p>
            </div>

            <div className="flex gap-2">
              <button className="bg-yellow-400 px-3 py-1 rounded">
                Warn
              </button>

              <button className="bg-red-500 text-white px-3 py-1 rounded">
                Suspend
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}