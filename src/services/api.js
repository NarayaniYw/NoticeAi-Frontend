export const API = import.meta.env.VITE_API_URL || "https://smartdoc-ai-si4n.onrender.com";

const defaultHeaders = {
  "Content-Type": "application/json",
};

export class ApiError extends Error {
  constructor(message, { status, body } = {}) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.body = body;
  }
}

const buildUrl = (path) => `${API}${path.startsWith("/") ? path : `/${path}`}`;
const AUTH_STORAGE_KEY = "smartdoc_auth";

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
    throw new ApiError("Backend is unavailable. Please try again later.", {
      body: error.message,
    });
  }

  const data = await parseJsonResponse(response);

  if (!response.ok) {
    throw new ApiError(data?.detail || data?.message || `Request failed with status ${response.status}.`, {
      status: response.status,
      body: data,
    });
  }

  return data;
};

const requestFirstAvailable = async (paths, options) => {
  let notFoundError;

  for (const path of paths) {
    try {
      return await requestJson(path, options);
    } catch (error) {
      if (error instanceof ApiError && error.status === 404) {
        notFoundError = error;
        continue;
      }

      throw error;
    }
  }

  throw notFoundError || new ApiError("No matching backend endpoint was found.");
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
    throw new ApiError("Backend is unavailable. Please try again later.", {
      body: error.message,
    });
  }

  const data = await parseJsonResponse(response);

  if (!response.ok) {
    throw new ApiError(data?.detail || data?.message || `Upload failed with status ${response.status}.`, {
      status: response.status,
      body: data,
    });
  }

  return data;
};

const uploadFirstAvailable = async (paths, formData) => {
  let notFoundError;

  for (const path of paths) {
    try {
      return await uploadForm(path, formData);
    } catch (error) {
      if (error instanceof ApiError && error.status === 404) {
        notFoundError = error;
        continue;
      }

      throw error;
    }
  }

  throw notFoundError || new ApiError("No matching upload endpoint was found.");
};

export const queryAssistant = (query) =>
  requestFirstAvailable(["/query", "/api/query"], {
    method: "POST",
    body: JSON.stringify({ query }),
  });

export const uploadDocument = ({ title, file }) => {
  const formData = new FormData();
  formData.append("title", title);
  formData.append("file", file);

  return uploadFirstAvailable([
    "/upload",
    "/documents/upload",
    "/api/upload",
    "/api/documents/upload",
  ], formData);
};

export const getDocuments = async () => {
  let response;

  try {
    response = await fetch(`${API}/documents`, {
      headers: {
        ...defaultHeaders,
        ...getAuthHeaders(),
      },
    });
  } catch (error) {
    throw new ApiError("Backend is unavailable. Please try again later.", {
      body: error.message,
    });
  }

  const data = await parseJsonResponse(response);

  if (!response.ok) {
    throw new ApiError(data?.detail || data?.message || `Documents request failed with status ${response.status}.`, {
      status: response.status,
      body: data,
    });
  }

  return data;
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
  requestFirstAvailable([
    "/login",
    "/auth/login",
    "/api/login",
    "/api/auth/login",
  ], {
    method: "POST",
    body: JSON.stringify({ username, password, role }),
  });

export const registerWithBackend = ({ username, email, password, role }) =>
  requestFirstAvailable([
    "/signup",
    "/auth/signup",
    "/api/signup",
    "/api/auth/signup",
    "/register",
    "/auth/register",
    "/api/register",
    "/api/auth/register",
  ], {
    method: "POST",
    body: JSON.stringify({ username, email, password, role }),
  });
