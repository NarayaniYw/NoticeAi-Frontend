import Navbar from "../components/Navbar";

export default function Notices() {

  const notices = [
    {
      title: "Mid Sem Exam Schedule",
      file: "/sample.pdf"
    },
    {
      title: "Hackathon Announcement",
      file: "/sample.pdf"
    },
    {
      title: "Library Timing Update",
      file: "/sample.pdf"
    },
    {
      title: "Internship Opportunity",
      file: "/sample.pdf"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col text-white">

      <Navbar />

      {/* Header */}
      <div className="glass-card p-6 mx-6 mt-6 text-center">
        <h1 className="text-2xl font-semibold">All Notices</h1>
        <p className="text-gray-300 text-sm mt-1">
          Browse all campus announcements and documents
        </p>
      </div>

      {/* Notices Grid */}
      <div className="p-8 max-w-6xl mx-auto w-full">

        <div className="grid md:grid-cols-2 gap-6">

          {notices.map((notice, index) => (

            <div
              key={index}
              className="glass-card p-6 hover:scale-[1.02] transition"
            >

              <h2 className="font-semibold text-lg mb-3">
                {notice.title}
              </h2>

              <button
                onClick={() => window.open(notice.file)}
                className="glass-button text-blue-300"
              >
                📄 Open Document
              </button>

            </div>

          ))}

        </div>

      </div>

    </div>
  );
}