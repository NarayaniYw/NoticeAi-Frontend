import { useState } from "react";
import Navbar from "../components/Navbar";
import { getAuthSession, uploadDocument } from "../services/api";

export default function UploadDocument() {

  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  const getUploadedFileUrl = (data) =>
    data?.file_url ||
    data?.fileUrl ||
    data?.url ||
    data?.data?.fileUrl ||
    data?.data?.url ||
    data?.document?.file_url ||
    data?.document?.url;

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!title || !file) {
      setError("Please enter a title and choose a file.");
      setStatus("");
      return;
    }

    setIsUploading(true);
    setError("");
    setStatus("Uploading document...");

    try {
      const uploadedBy = getAuthSession()?.user?.username || getAuthSession()?.user?.email || "anonymous";
      const data = await uploadDocument({ title, uploadedBy, file });
      const uploadedUrl = getUploadedFileUrl(data);

      setStatus(uploadedUrl ? "Document uploaded successfully." : "Document uploaded successfully. It will appear once the backend returns it in the documents list.");
      setTitle("");
      setFile(null);
      e.target.reset();
    } catch (error) {
      setError(error.message || "Upload failed. Please try again later.");
      setStatus("");
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
            disabled={isUploading}
            className="glass-input w-full"
          />

          {error && (
            <p className="rounded-lg border border-red-300/30 bg-red-500/20 p-3 text-sm text-red-100">
              {error}
            </p>
          )}

          {status && (
            <p className="rounded-lg border border-blue-300/30 bg-blue-500/20 p-3 text-sm text-blue-100">
              {status}
            </p>
          )}

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
