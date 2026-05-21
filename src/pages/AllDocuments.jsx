import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";
import { getDocumentFileUrl, getDocuments } from "../services/api";

export default function AllDocuments() {

  const [docs, setDocs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const normalizeDocuments = (data) => {
    const documents = Array.isArray(data) ? data : data?.data || data?.documents || data?.docs || data?.results || [];

    return documents.map((doc) => ({
      id: doc._id || doc.id || doc.fileName || doc.title,
      title: doc.title || doc.name || doc.originalname || doc.filename || "Untitled document",
      uploadedBy: doc.uploadedBy || "anonymous",
      uploadedAt: doc.createdAt ? new Date(doc.createdAt).toLocaleString() : "",
      file: getDocumentFileUrl(doc),
    }));
  };

  useEffect(() => {
    let isMounted = true;

    const loadDocuments = async () => {
      try {
        const data = await getDocuments();

        if (isMounted) {
          setDocs(normalizeDocuments(data));
          setError("");
        }
      } catch (error) {
        if (isMounted) {
          setDocs([]);
          setError(error.message || "Unable to load documents from backend.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadDocuments();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col text-white">

      <Navbar />

      {/* Header */}
      <div className="glass-card p-6 mx-6 mt-6 text-center">
        <h1 className="text-3xl font-bold">All Documents</h1>
        <p className="text-sm opacity-80 mt-1">
          Browse all uploaded campus notices and documents.
        </p>
      </div>

      {/* Content */}
      <div className="p-8 max-w-5xl mx-auto w-full">

        {isLoading && (
          <div className="glass-card p-6 text-center text-gray-300">
            Loading documents...
          </div>
        )}

        {!isLoading && error && (
          <div className="glass-card p-4 mb-4 text-center text-yellow-200">
            {error}
          </div>
        )}

        {!isLoading && docs.length === 0 && (
          <div className="glass-card p-6 text-center text-gray-300">
            No documents uploaded yet.
          </div>
        )}

        {docs.map((doc, index) => (
          <div
            key={doc.id || index}
            className="glass-card p-5 mb-4 flex justify-between items-center hover:scale-[1.01] transition"
          >
            <div>
              <p className="font-medium">{doc.title}</p>
              <p className="text-sm text-gray-300">
                Uploaded by {doc.uploadedBy}{doc.uploadedAt ? ` on ${doc.uploadedAt}` : ""}
              </p>
            </div>

            {doc.file ? (
              <a
                href={doc.file}
                target="_blank"
                rel="noreferrer"
                className="bg-blue-500 px-4 py-2 rounded-lg text-sm hover:bg-blue-600 transition"
              >
                Open
              </a>
            ) : (
              <span className="px-4 py-2 rounded-lg text-sm bg-white/10 text-gray-300">
                File unavailable
              </span>
            )}
          </div>
        ))}

      </div>

    </div>
  );
}
