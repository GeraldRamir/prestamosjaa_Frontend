import axios from "axios";

// Helper function to normalize the base URL
const getBaseURL = () => {
  if (import.meta.env.VITE_BACKEND_URL) {
    // Remove trailing slashes and ensure we use http (not https) for localhost
    const url = import.meta.env.VITE_BACKEND_URL.trim().replace(/\/+$/, '');
    // Replace https with http for localhost to avoid SSL errors
    const normalizedUrl = url.replace(/^https:\/\/localhost/, 'http://localhost');
    return `${normalizedUrl}/api`;
  }
  return "http://localhost:4000/api";
};

const clienteAxios = axios.create({
    baseURL: getBaseURL()
})

export default clienteAxios