import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";
import { getDocuments } from "../services/api";

export default function EditDocuments() {

  const [docs, setDocs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const normalizeDocuments = (data) => {
    const documents = Array.isArray(data) ? data : data?.documents || data?.docs || data?.results || [];

    return documents.map((doc) => ({
      title: doc.title || doc.name || doc.originalname || doc.filename || "Untitled document",
      file: doc.file || doc.file_url || doc.fileUrl || doc.url || doc.path || "#",
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
        const storedDocs = JSON.parse(localStorage.getItem("documents")) || [];

        if (isMounted) {
          setDocs(storedDocs);
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

  const deleteDoc = (index) => {

    const updatedDocs = docs.filter((_, i) => i !== index);

    setDocs(updatedDocs);
    localStorage.setItem("documents", JSON.stringify(updatedDocs));
  };

  return (
    <div className="min-h-screen flex flex-col text-white">

      <Navbar />

      {/* Header */}
      <div className="glass-card p-6 mx-6 mt-6 text-center">
        <h1 className="text-2xl font-semibold">
          Manage Documents
        </h1>
        <p className="text-gray-300 text-sm mt-1">
          Edit or delete uploaded notices
        </p>
      </div>

      {/* Document List */}
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
            No documents available.
          </div>
        )}

        {docs.map((doc, index) => (
          <div
            key={index}
            className="glass-card p-5 mb-4 flex justify-between items-center hover:scale-[1.01] transition"
          >

            <p className="font-medium">
              {doc.title}
            </p>

            <div className="flex gap-3">

              <a
                href={doc.file}
                target="_blank"
                rel="noreferrer"
                className="glass-button text-blue-300"
              >
                View
              </a>

              <button
                onClick={() => deleteDoc(index)}
                className="bg-red-500 px-4 py-2 rounded-lg text-sm hover:bg-red-600 transition"
              >
                Delete
              </button>

            </div>

          </div>
        ))}

      </div>

    </div>
  );
}
