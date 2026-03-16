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
    <div className="min-h-screen flex flex-col text-white">

      <Navbar />

      {/* Header */}
      <div className="glass-card p-6 mx-6 mt-6 text-center">
        <h1 className="text-2xl font-semibold">
          Upload Document
        </h1>
        <p className="text-gray-300 text-sm mt-1">
          Upload campus notices and documents
        </p>
      </div>

      {/* Upload Form */}
      <div className="p-8 flex justify-center">

        <form
          onSubmit={handleUpload}
          className="glass-card p-8 w-full max-w-md space-y-4"
        >

          <input
            type="text"
            placeholder="Document Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="glass-input w-full"
          />

          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            className="glass-input w-full"
          />

          <button
            type="submit"
            className="glass-button w-full text-center"
          >
            Upload Document
          </button>

        </form>

      </div>

    </div>
  );
}