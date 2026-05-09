import { useState } from "react";
import Navbar from "../components/Navbar";
import { uploadDocument } from "../services/api";

export default function UploadDocument() {

  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const getUploadedFileUrl = (data) =>
    data?.file_url ||
    data?.fileUrl ||
    data?.url ||
    data?.document?.file_url ||
    data?.document?.url;

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!title || !file) {
      alert("Please fill all fields");
      return;
    }

    setIsUploading(true);

    try {
      const data = await uploadDocument({ title, file });
      const newDoc = {
        title: title,
        file: getUploadedFileUrl(data) || URL.createObjectURL(file)
      };

      const existingDocs = JSON.parse(localStorage.getItem("documents")) || [];
      existingDocs.push(newDoc);

      localStorage.setItem("documents", JSON.stringify(existingDocs));

      alert("Document Uploaded Successfully");

      setTitle("");
      setFile(null);
      e.target.reset();
    } catch (error) {
      alert(error.message || "Upload failed. Please try again later.");
    } finally {
      setIsUploading(false);
    }
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
            disabled={isUploading}
            className="glass-button w-full text-center"
          >
            {isUploading ? "Uploading..." : "Upload Document"}
          </button>

        </form>

      </div>

    </div>
  );
}
