export const API = import.meta.env.VITE_API_URL;

const defaultHeaders = {
  "Content-Type": "application/json",
};

const AUTH_STORAGE_KEY = "smartdoc_auth";

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
    throw new ApiError(getHttpErrorMessage(response, data), {
      status: response.status,
      body: data,
    });
  }

  return data;
};

export const uploadForm = async (path, formData) => {
  let response;

  try {
    response = await fetch(buildUrl(path), {
      method: "POST",
      headers: {
        ...getAuthHeaders(),
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
    throw new ApiError(getHttpErrorMessage(response, data, "Upload"), {
      status: response.status,
      body: data,
    });
  }

  return data;
};

export const queryAssistant = (query) =>
  requestJson("/api/query", {
    method: "POST",
    body: JSON.stringify({ query }),
  });

export const uploadDocument = ({ title, file }) => {
  const formData = new FormData();
  formData.append("title", title);
  formData.append("file", file);

  return uploadForm("/api/documents/upload", formData);
};

export const saveAuthSession = (session) => {
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
};

export const getAuthSession = () => {
  try {
    return JSON.parse(localStorage.getItem(AUTH_STORAGE_KEY));
  } catch {
    return null;
  }
};

export const clearAuthSession = () => {
  localStorage.removeItem(AUTH_STORAGE_KEY);
};

export const loginWithBackend = ({ username, password, role }) =>
  requestJson("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ username, password, role }),
  });

export const registerWithBackend = ({ username, email, password, role }) =>
  requestJson("/api/auth/register", {
    method: "POST",
    body: JSON.stringify({ username, email, password }),
  });

export const getDocuments = () => requestJson("/api/documents");
