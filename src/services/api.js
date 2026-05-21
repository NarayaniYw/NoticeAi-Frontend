export const API = import.meta.env.VITE_API_URL;

const defaultHeaders = {
  "Content-Type": "application/json",
};

const LEGACY_AUTH_STORAGE_KEY = "smartdoc_auth";
const TOKEN_STORAGE_KEY = "token";
const USER_STORAGE_KEY = "user";

export class ApiError extends Error {
  constructor(message, { status, body, cause } = {}) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.body = body;
    this.cause = cause;
  }
}

const normalizeApiBase = (baseUrl) => baseUrl?.replace(/\/+$/, "");

const buildUrl = (path) => {
  const baseUrl = normalizeApiBase(API);

  if (!baseUrl) {
    throw new ApiError("Missing VITE_API_URL. Add it to the Render frontend environment.");
  }

  return `${baseUrl}${path.startsWith("/") ? path : `/${path}`}`;
};

export const buildApiUrl = (path) => buildUrl(path);

export const getDocumentFileUrl = (doc) =>
  doc?.fileUrl ||
  doc?.file_url ||
  doc?.url ||
  doc?.file ||
  doc?.path ||
  doc?.data?.fileUrl ||
  doc?.data?.file_url ||
  doc?.document?.fileUrl ||
  doc?.document?.file_url ||
  "";

const getAuthToken = () => getAuthSession()?.token;

const getAuthHeaders = () => {
  const token = getAuthToken();

  return token ? { Authorization: `Bearer ${token}` } : {};
};

const parseJsonResponse = async (response) => {
  const rawText = await response.text();

  if (!rawText) {
    return null;
  }

  try {
    return JSON.parse(rawText);
  } catch {
    throw new ApiError("Backend returned invalid JSON.", {
      status: response.status,
      body: rawText,
    });
  }
};

const getHttpErrorMessage = (response, data, fallbackAction = "Request") => {
  const backendMessage = data?.detail || data?.message || data?.error;

  if (backendMessage) return backendMessage;
  if (response.status === 404) return "Backend endpoint was not found. Please check the deployed API routes.";
  if (response.status >= 500) return "Backend server error. Please try again after a moment.";
  if (response.status === 401) return "Your session has expired. Please log in again.";
  if (response.status === 403) return "You do not have permission to perform this action.";

  return `${fallbackAction} failed with status ${response.status}.`;
};

const redirectToLoginForAuthError = (message) => {
  clearAuthSession();
  sessionStorage.setItem("auth_error", message);

  if (window.location.hash !== "#/") {
    window.location.hash = "#/";
  }
};

const getNetworkErrorMessage = (error) => {
  if (!navigator.onLine) {
    return "You appear to be offline. Check your internet connection and try again.";
  }

  if (error instanceof TypeError) {
    return "Could not reach the backend. This can happen if the server is down or CORS is not allowing this frontend.";
  }

  return "Backend is unavailable. Please try again later.";
};

export const requestJson = async (path, options = {}) => {
  let response;

  try {
    response = await fetch(buildUrl(path), {
      ...options,
      headers: {
        ...defaultHeaders,
        ...getAuthHeaders(),
        ...options.headers,
      },
    });
  } catch (error) {
    throw new ApiError(getNetworkErrorMessage(error), {
      body: error.message,
      cause: error,
    });
  }

  const data = await parseJsonResponse(response);

  if (!response.ok) {
    const message = getHttpErrorMessage(response, data);

    if (response.status === 401 || response.status === 403) {
      redirectToLoginForAuthError(message);
    }

    throw new ApiError(message, {
      status: response.status,
      body: data,
    });
  }

  return data;
};

export const requestForm = async (path, formData, options = {}) => {
  let response;

  try {
    response = await fetch(buildUrl(path), {
      method: options.method || "POST",
      headers: {
        ...getAuthHeaders(),
        ...options.headers,
      },
      body: formData,
    });
  } catch (error) {
    throw new ApiError(getNetworkErrorMessage(error), {
      body: error.message,
      cause: error,
    });
  }

  const data = await parseJsonResponse(response);

  if (!response.ok) {
    const message = getHttpErrorMessage(response, data, "Upload");

    if (response.status === 401 || response.status === 403) {
      redirectToLoginForAuthError(message);
    }

    throw new ApiError(message, {
      status: response.status,
      body: data,
    });
  }

  return data;
};

export const uploadForm = (path, formData) =>
  requestForm(path, formData, { method: "POST" });

export const queryAssistant = (query) =>
  requestJson("/api/query", {
    method: "POST",
    body: JSON.stringify({ question: query }),
  });

export const uploadDocument = ({ title, uploadedBy, file }) => {
  const formData = new FormData();
  formData.append("title", title);
  if (uploadedBy) {
    formData.append("uploadedBy", uploadedBy);
  }
  formData.append("file", file);

  return uploadForm("/api/documents/upload", formData);
};

export const saveAuthSession = (session) => {
  localStorage.setItem(TOKEN_STORAGE_KEY, session.token);
  localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(session.user));
  localStorage.removeItem(LEGACY_AUTH_STORAGE_KEY);
};

export const getAuthSession = () => {
  try {
    const token = localStorage.getItem(TOKEN_STORAGE_KEY);
    const user = JSON.parse(localStorage.getItem(USER_STORAGE_KEY));

    if (token && user) {
      return {
        role: user.role,
        token,
        user,
      };
    }

    const legacySession = JSON.parse(localStorage.getItem(LEGACY_AUTH_STORAGE_KEY));

    if (legacySession?.token && legacySession?.user) {
      saveAuthSession(legacySession);
      return legacySession;
    }

    return null;
  } catch {
    return null;
  }
};

export const clearAuthSession = () => {
  localStorage.removeItem(TOKEN_STORAGE_KEY);
  localStorage.removeItem(USER_STORAGE_KEY);
  localStorage.removeItem(LEGACY_AUTH_STORAGE_KEY);
};


// Login via API
export const login = async ({ email, password }) => {
  if (!email || !password) {
    throw new ApiError("Please enter email and password.");
  }
  const data = await requestJson("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  return data;
};


// Register via API
export const register = async ({ username, email, password, role }) => {
  if (!username || !email || !password) {
    throw new ApiError("Please fill all required fields.");
  }
  const data = await requestJson("/api/auth/register", {
    method: "POST",
    body: JSON.stringify({ username, email, password, role }),
  });
  return data;
};

// Get current user info (protected route)
export const getMe = async () => {
  return requestJson("/api/auth/me", {
    method: "GET",
  });
};

export const getDocuments = () => requestJson("/api/documents");

export const getAdminUsers = (status = "") => {
  const query = status ? `?status=${encodeURIComponent(status)}` : "";
  return requestJson(`/api/admin/users${query}`);
};

export const suspendAdminUser = (id) =>
  requestJson(`/api/admin/users/${id}/suspend`, {
    method: "PATCH",
  });

export const activateAdminUser = (id) =>
  requestJson(`/api/admin/users/${id}/activate`, {
    method: "PATCH",
  });

export const deleteAdminDocument = (id) =>
  requestJson(`/api/admin/documents/${id}`, {
    method: "DELETE",
  });

export const updateAdminDocument = ({ id, title, uploadedBy, file }) => {
  const formData = new FormData();

  formData.append("title", title);
  formData.append("uploadedBy", uploadedBy);

  if (file) {
    formData.append("file", file);
  }

  return requestForm(`/api/admin/documents/${id}`, formData, {
    method: "PATCH",
  });
};
