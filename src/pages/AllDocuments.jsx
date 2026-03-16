import Navbar from "../components/Navbar";
import { useState, useEffect } from "react";

export default function AllDocuments() {

  const [docs, setDocs] = useState([]);

  useEffect(() => {
    const storedDocs = JSON.parse(localStorage.getItem("documents")) || [];
    setDocs(storedDocs);
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

        {docs.length === 0 && (
          <div className="glass-card p-6 text-center text-gray-300">
            No documents uploaded yet.
          </div>
        )}

        {docs.map((doc, index) => (
          <div
            key={index}
            className="glass-card p-5 mb-4 flex justify-between items-center hover:scale-[1.01] transition"
          >
            <p className="font-medium">{doc.title}</p>

            <a
              href={doc.file}
              target="_blank"
              rel="noreferrer"
              className="bg-blue-500 px-4 py-2 rounded-lg text-sm hover:bg-blue-600 transition"
            >
              Open
            </a>
          </div>
        ))}

      </div>

    </div>
  );
}