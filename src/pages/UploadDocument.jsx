import { useState } from "react";
import Navbar from "../components/Navbar";

export default function UploadDocument() {

  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);

  const handleUpload = (e) => {
    e.preventDefault();

    if (!title || !file) {
      alert("Please fill all fields");
      return;
    }

    const newDoc = {
      title: title,
      file: URL.createObjectURL(file)
    };

    const existingDocs = JSON.parse(localStorage.getItem("documents")) || [];
    existingDocs.push(newDoc);

    localStorage.setItem("documents", JSON.stringify(existingDocs));

    alert("Document Uploaded Successfully");

    setTitle("");
    setFile(null);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="p-6">
        <h1 className="text-2xl font-semibold mb-4">Upload Document</h1>

        <form
          onSubmit={handleUpload}
          className="bg-white p-6 rounded-xl shadow w-full max-w-md"
        >
          <input
            type="text"
            placeholder="Document Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border p-2 w-full mb-3 rounded"
          />

          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            className="mb-3"
          />

          <button className="bg-blue-600 text-white px-4 py-2 rounded">
            Upload
          </button>
        </form>
      </div>
    </div>
  );
}