import Navbar from "../components/Navbar";
import { useState, useEffect } from "react";

export default function AllDocuments() {

  const [docs, setDocs] = useState([]);

  useEffect(() => {
    const storedDocs = JSON.parse(localStorage.getItem("documents")) || [];
    setDocs(storedDocs);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">

      <Navbar />

      <div className="p-6">
        <h1 className="text-2xl font-semibold mb-4">All Documents</h1>

        {docs.map((doc, index) => (
          <div
            key={index}
            className="bg-white p-4 mb-3 rounded shadow flex justify-between"
          >
            <p>{doc.title}</p>

            <a
              href={doc.file}
              target="_blank"
              className="text-blue-600"
            >
              Open
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}