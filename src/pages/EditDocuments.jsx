import Navbar from "../components/Navbar";
import { useState, useEffect } from "react";

export default function EditDocuments() {

  const [docs, setDocs] = useState([]);

  useEffect(() => {
    const storedDocs = JSON.parse(localStorage.getItem("documents")) || [];
    setDocs(storedDocs);
  }, []);

  const deleteDoc = (index) => {

    const updatedDocs = docs.filter((_, i) => i !== index);

    setDocs(updatedDocs);
    localStorage.setItem("documents", JSON.stringify(updatedDocs));
  };

  return (
    <div className="min-h-screen bg-gray-100">

      <Navbar />

      <div className="p-6">
        <h1 className="text-2xl font-semibold mb-4">
          Manage Documents
        </h1>

        {docs.map((doc, index) => (
          <div
            key={index}
            className="bg-white p-4 mb-3 rounded shadow flex justify-between"
          >
            <p>{doc.title}</p>

            <div className="flex gap-2">

              <a
                href={doc.file}
                target="_blank"
                className="text-blue-600"
              >
                View
              </a>

              <button
                onClick={() => deleteDoc(index)}
                className="text-red-500"
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