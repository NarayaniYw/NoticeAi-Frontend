import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import {
  activateAdminUser,
  ApiError,
  clearAuthSession,
  deleteAdminDocument,
  getAdminUsers,
  getAuthSession,
  getDocumentFileUrl,
  getDocuments,
  suspendAdminUser,
  updateAdminDocument,
  uploadDocument,
} from "../services/api";

export default function AdminDashboard() {
  const navigate = useNavigate();

  const [activeUsers, setActiveUsers] = useState([]);
  const [suspendedUsers, setSuspendedUsers] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionId, setActionId] = useState("");
  const [editingId, setEditingId] = useState("");
  const [editForm, setEditForm] = useState({ title: "", uploadedBy: "", file: null });
  const [uploadTitle, setUploadTitle] = useState("");
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadInputKey, setUploadInputKey] = useState(0);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleAuthFailure = (apiError) => {
    if (apiError instanceof ApiError && (apiError.status === 401 || apiError.status === 403)) {
      clearAuthSession();
      navigate("/");
      return true;
    }

    return false;
  };

  const getItems = (data) =>
    Array.isArray(data) ? data : data?.data || data?.users || data?.documents || data?.docs || data?.results || [];

  const normalizeUser = (user) => ({
    id: user._id || user.id,
    username: user.username || user.name || "Unknown user",
    email: user.email || "No email",
    suspended: Boolean(user.suspended || user.isSuspended || user.status === "suspended"),
    createdAt: user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "Unknown",
  });

  const normalizeDocument = (doc) => ({
    id: doc._id || doc.id,
    title: doc.title || doc.name || doc.originalname || doc.filename || "Untitled document",
    uploadedBy: doc.uploadedBy || "anonymous",
    uploadedAt: doc.createdAt ? new Date(doc.createdAt).toLocaleDateString() : "",
    file: getDocumentFileUrl(doc),
  });

  const refreshDocuments = async () => {
    const documentData = await getDocuments();
    setDocuments(getItems(documentData).map(normalizeDocument));
  };

  const loadAdminData = async () => {
    setIsLoading(true);
    setError("");
    setMessage("");

    try {
      const session = getAuthSession();

      if (!session?.token || session?.user?.role !== "admin") {
        setError("Access denied. Please log in with an admin account.");
        return;
      }

      const [activeData, suspendedData, documentData] = await Promise.all([
        getAdminUsers(),
        getAdminUsers("suspended"),
        getDocuments(),
      ]);

      setActiveUsers(getItems(activeData).map(normalizeUser).filter((user) => !user.suspended));
      setSuspendedUsers(getItems(suspendedData).map(normalizeUser));
      setDocuments(getItems(documentData).map(normalizeDocument));
    } catch (apiError) {
      if (!handleAuthFailure(apiError)) {
        setError(apiError.message || "Unable to load admin data.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  const suspendUser = async (user) => {
    setActionId(`suspend-${user.id}`);
    setError("");
    setMessage("");

    try {
      await suspendAdminUser(user.id);
      setMessage(`${user.username} has been suspended.`);
      await loadAdminData();
    } catch (apiError) {
      if (!handleAuthFailure(apiError)) {
        setError(apiError.message || "Unable to suspend user.");
      }
    } finally {
      setActionId("");
    }
  };

  const activateUser = async (user) => {
    setActionId(`activate-${user.id}`);
    setError("");
    setMessage("");

    try {
      await activateAdminUser(user.id);
      setMessage(`${user.username} has been activated.`);
      await loadAdminData();
    } catch (apiError) {
      if (!handleAuthFailure(apiError)) {
        setError(apiError.message || "Unable to activate user.");
      }
    } finally {
      setActionId("");
    }
  };

  const deleteDocument = async (doc) => {
    setActionId(`delete-${doc.id}`);
    setError("");
    setMessage("");

    try {
      await deleteAdminDocument(doc.id);
      setDocuments((current) => current.filter((item) => item.id !== doc.id));
      setMessage(`${doc.title} has been deleted.`);
    } catch (apiError) {
      if (!handleAuthFailure(apiError)) {
        setError(apiError.message || "Unable to delete document.");
      }
    } finally {
      setActionId("");
    }
  };

  const startEdit = (doc) => {
    setEditingId(doc.id);
    setEditForm({
      title: doc.title,
      uploadedBy: doc.uploadedBy,
      file: null,
    });
  };

  const submitEdit = async (e, doc) => {
    e.preventDefault();
    setActionId(`edit-${doc.id}`);
    setError("");
    setMessage("");

    try {
      await updateAdminDocument({
        id: doc.id,
        title: editForm.title,
        uploadedBy: editForm.uploadedBy,
        file: editForm.file,
      });

      setMessage(`${editForm.title} has been updated.`);
      setEditingId("");
      setEditForm({ title: "", uploadedBy: "", file: null });
      await loadAdminData();
    } catch (apiError) {
      if (!handleAuthFailure(apiError)) {
        setError(apiError.message || "Unable to update document.");
      }
    } finally {
      setActionId("");
    }
  };

  const submitUpload = async (e) => {
    e.preventDefault();

    if (!uploadTitle || !uploadFile) {
      setError("Please enter a title and choose a PDF file.");
      setMessage("");
      return;
    }

    setActionId("upload-document");
    setError("");
    setMessage("");

    try {
      await uploadDocument({
        title: uploadTitle,
        file: uploadFile,
      });

      setUploadTitle("");
      setUploadFile(null);
      setUploadInputKey((current) => current + 1);
      await refreshDocuments();
      setMessage("Document uploaded successfully.");
    } catch (apiError) {
      if (!handleAuthFailure(apiError)) {
        setError(apiError.message || "Document upload failed.");
      }
    } finally {
      setActionId("");
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col text-white">
      <Navbar />

      <div className="glass-card p-10 mb-10 mx-6 mt-6 border border-white/20">
        <h1 className="text-4xl font-bold tracking-tight">
          Admin Dashboard
        </h1>
        <p className="text-sm mt-2 opacity-80">
          Manage users, notices, and uploaded campus documents.
        </p>
      </div>

      <div className="p-8 max-w-6xl mx-auto w-full space-y-8">
        {error && (
          <p className="rounded-lg border border-red-300/30 bg-red-500/20 p-3 text-sm text-red-100">
            {error}
          </p>
        )}

        {message && (
          <p className="rounded-lg border border-blue-300/30 bg-blue-500/20 p-3 text-sm text-blue-100">
            {message}
          </p>
        )}

        {isLoading && (
          <div className="glass-card p-6 text-center text-gray-300">
            Loading admin portal...
          </div>
        )}

        {!isLoading && !error && (
          <>
            <section className="glass-card p-7 border border-white/20">
              <h2 className="text-xl font-bold mb-6">Users</h2>

              <div className="space-y-4">
                {activeUsers.length === 0 && (
                  <p className="text-gray-300">No active users found.</p>
                )}

                {activeUsers.map((user) => (
                  <div
                    key={user.id}
                    className="flex flex-col gap-4 py-4 border-b border-white/10 last:border-none md:flex-row md:items-center md:justify-between"
                  >
                    <div>
                      <p className="font-medium">{user.username}</p>
                      <p className="text-sm text-gray-300">{user.email}</p>
                      <p className="text-xs text-gray-400">
                        Created {user.createdAt} · Suspended: {user.suspended ? "Yes" : "No"}
                      </p>
                    </div>

                    <button
                      onClick={() => suspendUser(user)}
                      disabled={actionId === `suspend-${user.id}`}
                      className="bg-red-500 px-4 py-2 text-sm rounded-lg hover:bg-red-600 transition disabled:opacity-60"
                    >
                      {actionId === `suspend-${user.id}` ? "Suspending..." : "Suspend"}
                    </button>
                  </div>
                ))}
              </div>
            </section>

            <section className="glass-card p-7 border border-white/20">
              <h2 className="text-xl font-bold mb-6">Suspended Users</h2>

              <div className="space-y-4">
                {suspendedUsers.length === 0 && (
                  <p className="text-gray-300">No suspended users found.</p>
                )}

                {suspendedUsers.map((user) => (
                  <div
                    key={user.id}
                    className="flex flex-col gap-4 py-4 border-b border-white/10 last:border-none md:flex-row md:items-center md:justify-between"
                  >
                    <div>
                      <p className="font-medium">{user.username}</p>
                      <p className="text-sm text-gray-300">{user.email}</p>
                      <p className="text-xs text-gray-400">
                        Created {user.createdAt} · Suspended: {user.suspended ? "Yes" : "No"}
                      </p>
                    </div>

                    <button
                      onClick={() => activateUser(user)}
                      disabled={actionId === `activate-${user.id}`}
                      className="bg-green-600 px-4 py-2 text-sm rounded-lg hover:bg-green-700 transition disabled:opacity-60"
                    >
                      {actionId === `activate-${user.id}` ? "Activating..." : "Activate"}
                    </button>
                  </div>
                ))}
              </div>
            </section>

            <section className="glass-card p-7 border border-white/20">
              <h2 className="text-xl font-bold mb-6">Documents</h2>

              <form onSubmit={submitUpload} className="mb-8 grid gap-3 border-b border-white/10 pb-6">
                <h3 className="text-lg font-semibold">Upload Document</h3>

                <input
                  type="text"
                  value={uploadTitle}
                  onChange={(e) => setUploadTitle(e.target.value)}
                  disabled={actionId === "upload-document"}
                  className="w-full p-3 rounded-lg bg-white/10 border border-white/20 outline-none text-white placeholder-gray-300"
                  placeholder="Title"
                />

                <input
                  key={uploadInputKey}
                  type="file"
                  accept="application/pdf"
                  onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                  disabled={actionId === "upload-document"}
                  className="w-full p-3 rounded-lg bg-white/10 border border-white/20 outline-none text-white"
                />

                <button
                  type="submit"
                  disabled={actionId === "upload-document"}
                  className="bg-blue-600 px-4 py-2 text-sm rounded-lg hover:bg-blue-700 transition disabled:opacity-60 w-fit"
                >
                  {actionId === "upload-document" ? "Uploading..." : "Upload Document"}
                </button>
              </form>

              <div className="space-y-5">
                {documents.length === 0 && (
                  <p className="text-gray-300">No documents found.</p>
                )}

                {documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="py-5 border-b border-white/10 last:border-none"
                  >
                    {editingId === doc.id ? (
                      <form onSubmit={(e) => submitEdit(e, doc)} className="grid gap-3">
                        <input
                          type="text"
                          value={editForm.title}
                          onChange={(e) => setEditForm((current) => ({ ...current, title: e.target.value }))}
                          className="w-full p-3 rounded-lg bg-white/10 border border-white/20 outline-none text-white placeholder-gray-300"
                          placeholder="Title"
                        />

                        <input
                          type="text"
                          value={editForm.uploadedBy}
                          onChange={(e) => setEditForm((current) => ({ ...current, uploadedBy: e.target.value }))}
                          className="w-full p-3 rounded-lg bg-white/10 border border-white/20 outline-none text-white placeholder-gray-300"
                          placeholder="Uploaded by"
                        />

                        <input
                          type="file"
                          accept="application/pdf"
                          onChange={(e) => setEditForm((current) => ({ ...current, file: e.target.files?.[0] || null }))}
                          className="w-full p-3 rounded-lg bg-white/10 border border-white/20 outline-none text-white"
                        />

                        <div className="flex flex-wrap gap-3">
                          <button
                            type="submit"
                            disabled={actionId === `edit-${doc.id}`}
                            className="bg-blue-600 px-4 py-2 text-sm rounded-lg hover:bg-blue-700 transition disabled:opacity-60"
                          >
                            {actionId === `edit-${doc.id}` ? "Saving..." : "Save"}
                          </button>

                          <button
                            type="button"
                            onClick={() => setEditingId("")}
                            className="bg-white/10 px-4 py-2 text-sm rounded-lg hover:bg-white/20 transition"
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    ) : (
                      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div>
                          <p className="font-medium">{doc.title}</p>
                          <p className="text-sm text-gray-300">
                            Uploaded by {doc.uploadedBy}{doc.uploadedAt ? ` on ${doc.uploadedAt}` : ""}
                          </p>
                        </div>

                        <div className="flex flex-wrap gap-3">
                          {doc.file && (
                            <a
                              href={doc.file}
                              target="_blank"
                              rel="noreferrer"
                              className="bg-white/10 px-4 py-2 text-sm rounded-lg hover:bg-white/20 transition"
                            >
                              Open
                            </a>
                          )}

                          <button
                            onClick={() => startEdit(doc)}
                            className="bg-blue-600 px-4 py-2 text-sm rounded-lg hover:bg-blue-700 transition"
                          >
                            Edit
                          </button>

                          <button
                            onClick={() => deleteDocument(doc)}
                            disabled={actionId === `delete-${doc.id}`}
                            className="bg-red-500 px-4 py-2 text-sm rounded-lg hover:bg-red-600 transition disabled:opacity-60"
                          >
                            {actionId === `delete-${doc.id}` ? "Deleting..." : "Delete"}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  );
}
