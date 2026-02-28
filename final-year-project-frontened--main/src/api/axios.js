import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080",
});

// Attach access token to every request
api.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem("accessToken");
  console.log("Access token:", accessToken ? "Present" : "Missing");
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
    console.log("Authorization header set:", config.headers.Authorization.substring(0, 20) + "...");
  }
  return config;
});

// Handle expired access token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If access token expired
    if (
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      // For now, just logout since backend doesn't have refresh endpoint
      localStorage.clear();
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default api;
