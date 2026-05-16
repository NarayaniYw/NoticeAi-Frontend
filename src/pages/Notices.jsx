import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { buildApiUrl, getDocuments } from "../services/api";

export default function Notices() {
  const [notices, setNotices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadNotices = async () => {
      try {
        const data = await getDocuments();
        const documents = Array.isArray(data) ? data : data?.data || [];

        if (isMounted) {
          setNotices(documents.map((doc) => ({
            id: doc._id || doc.fileName || doc.title,
            title: doc.title || "Untitled notice",
            file: doc.fileName ? buildApiUrl(`/uploads/${encodeURIComponent(doc.fileName)}`) : "#",
          })));
          setError("");
        }
      } catch (error) {
        if (isMounted) {
          setError(error.message || "Unable to load notices.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadNotices();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col text-white">
      <Navbar />

      <div className="glass-card p-6 mx-6 mt-6 text-center">
        <h1 className="text-2xl font-semibold">All Notices</h1>
        <p className="text-gray-300 text-sm mt-1">
          Browse all campus announcements and documents
        </p>
      </div>

      <div className="p-8 max-w-6xl mx-auto w-full">
        <div className="grid md:grid-cols-2 gap-6">
          {isLoading && (
            <div className="glass-card p-6 text-center text-gray-300 md:col-span-2">
              Loading notices...
            </div>
          )}

          {!isLoading && error && (
            <div className="glass-card p-6 text-center text-yellow-200 md:col-span-2">
              {error}
            </div>
          )}

          {!isLoading && !error && notices.length === 0 && (
            <div className="glass-card p-6 text-center text-gray-300 md:col-span-2">
              No notices uploaded yet.
            </div>
          )}

          {notices.map((notice, index) => (
            <div
              key={notice.id || index}
              className="glass-card p-6 hover:scale-[1.02] transition"
            >
              <h2 className="font-semibold text-lg mb-3">
                {notice.title}
              </h2>

              <button
                onClick={() => window.open(notice.file)}
                className="glass-button text-blue-300"
              >
                Open Document
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
