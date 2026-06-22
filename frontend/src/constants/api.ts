const API_BASE_URL = import.meta.env.DEV
  ? typeof window !== 'undefined'
    ? window.location.origin
    : import.meta.env.VITE_API_BASE_URL
  : import.meta.env.VITE_API_BASE_URL;
export default API_BASE_URL;
