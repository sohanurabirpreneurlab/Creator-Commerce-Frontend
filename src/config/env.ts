const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

if (!apiBaseUrl) {
  throw new Error("Missing VITE_API_BASE_URL in frontend environment.");
}

export const env = {
  apiBaseUrl,
} as const;
