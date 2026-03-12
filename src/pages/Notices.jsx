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
    <div className="min-h-screen bg-gray-100">

      <Navbar />

      <div className="p-6">
        <h1 className="text-2xl font-semibold mb-4">All Notices</h1>

        <div className="grid md:grid-cols-2 gap-4">
          {notices.map((notice, index) => (
            <div key={index} className="bg-white p-4 rounded-xl shadow">

              <h2 className="font-semibold mb-2">{notice.title}</h2>

              <button
                onClick={() => window.open(notice.file)}
                className="text-blue-600 font-medium"
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