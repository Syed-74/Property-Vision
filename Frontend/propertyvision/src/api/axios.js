// import axios from "axios";

// const api = axios.create({
//   baseURL: "http://localhost:5000/auth/v1/admin",
// });

// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem("token");
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// export default api;


// import axios from "axios";

// const api = axios.create({
//   baseURL: "http://localhost:5000/auth/v1/admin",
// });

// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem("token");
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// export default api;






// import axios from "axios";

// /* =========================
//    AXIOS INSTANCE
// ========================= */
// const api = axios.create({
//   baseURL: "http://localhost:5000", // ✅ ROOT API
//   withCredentials: true,            // optional (safe)
// });

// /* =========================
//    REQUEST INTERCEPTOR
// ========================= */
// api.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("token");

//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }

//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// /* =========================
//    RESPONSE INTERCEPTOR
// ========================= */
// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     // Optional global handling
//     if (error.response?.status === 401) {
//       console.warn("Unauthorized – token expired or invalid");

//       // OPTIONAL auto logout
//       // localStorage.removeItem("token");
//       // window.location.href = "/login";
//     }

//     return Promise.reject(error);
//   }
// );

// export default api;



import axios from "axios";

/* =========================
   AXIOS INSTANCE
========================= */
const api = axios.create({
  baseURL: "http://localhost:5000", // ✅ ROOT API (IMPORTANT)
  withCredentials: true,            // ✅ supports cookies if needed
});

/* =========================
   REQUEST INTERCEPTOR
========================= */
api.interceptors.request.use(
  (config) => {
    // ✅ Token from localStorage
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/* =========================
   RESPONSE INTERCEPTOR
========================= */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // ✅ Global error handling (optional)
    if (error.response?.status === 401) {
      console.warn("Unauthorized – token expired or invalid");

      // OPTIONAL AUTO LOGOUT (keep commented)
      // localStorage.removeItem("token");
      // sessionStorage.removeItem("token");
      // window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default api;
