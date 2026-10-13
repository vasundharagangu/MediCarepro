import axios from "axios";
import useAuthStore from "../store/auth.js";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const { token } = useAuthStore.getState();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Demo / Offline Mock Handler for static hosting (e.g. GitHub Pages)
const DEFAULT_DOCTORS = [
  {
    _id: "doc1",
    name: "Dr. Alice Smith",
    email: "alice.smith@clinic.test",
    role: "doctor",
    specialization: "Cardiologist",
    experienceYears: 12,
    rating: 4.8,
    ratingCount: 129,
  },
  {
    _id: "doc2",
    name: "Dr. Brian Lee",
    email: "brian.lee@clinic.test",
    role: "doctor",
    specialization: "Dermatologist",
    experienceYears: 8,
    rating: 4.6,
    ratingCount: 94,
  },
  {
    _id: "doc3",
    name: "Dr. Neha Patel",
    email: "neha.patel@clinic.test",
    role: "doctor",
    specialization: "Neurologist",
    experienceYears: 10,
    rating: 4.9,
    ratingCount: 173,
  },
];

const DEFAULT_USERS = [
  {
    _id: "u_admin",
    name: "System Admin",
    email: "jhon@admin",
    role: "admin",
  },
  ...DEFAULT_DOCTORS,
  {
    _id: "u_patient",
    name: "John Doe",
    email: "patient@medicare.test",
    role: "patient",
    age: 32,
    phone: "+1 234 567 8900",
  },
];

const DEFAULT_APPOINTMENTS = [
  {
    _id: "appt_1",
    patient: { _id: "u_patient", name: "John Doe", age: 32 },
    doctor: DEFAULT_DOCTORS[0],
    scheduledAt: new Date(Date.now() + 86400000).toISOString(),
    status: "accepted",
    paymentStatus: "pending",
  },
  {
    _id: "appt_2",
    patient: { _id: "u_patient", name: "John Doe", age: 32 },
    doctor: DEFAULT_DOCTORS[1],
    scheduledAt: new Date(Date.now() + 172800000).toISOString(),
    status: "pending",
    paymentStatus: "pending",
  },
];

function getStored(key, fallback) {
  try {
    const val = localStorage.getItem(key);
    return val ? JSON.parse(val) : fallback;
  } catch {
    return fallback;
  }
}

function setStored(key, val) {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch {
    // ignore
  }
}

// Intercept errors and provide fallback mock responses if backend is unreachable
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const isNetworkOr404 =
      !error.response ||
      error.response.status === 404 ||
      error.code === "ERR_NETWORK";

    if (!isNetworkOr404) {
      return Promise.reject(error);
    }

    const { url = "", method = "get", data: rawData } = error.config || {};
    const parsedData = typeof rawData === "string" ? JSON.parse(rawData || "{}") : rawData || {};
    const cleanUrl = url.replace(/^[a-zA-Z]+:\/\/[^/]+/, "").replace(/^\/api/, "");

    // Mock Authentication
    if (cleanUrl.startsWith("/auth/login")) {
      const { email, password } = parsedData;
      const users = getStored("demo_users", DEFAULT_USERS);
      let found = users.find((u) => u.email?.toLowerCase() === email?.toLowerCase());
      
      // Default fallback demo logins
      if (!found) {
        if (email === "jhon@admin" || email?.includes("admin")) {
          found = { _id: "u_admin", name: "System Admin", email, role: "admin" };
        } else if (email?.includes("doctor") || email === "alice.smith@clinic.test") {
          found = { _id: "doc1", name: "Dr. Alice Smith", email, role: "doctor", specialization: "Cardiologist" };
        } else {
          found = { _id: "u_patient", name: "Patient Demo", email: email || "patient@medicare.test", role: "patient" };
        }
      }
      return {
        status: 200,
        data: {
          token: "demo-jwt-" + Date.now(),
          role: found.role,
          name: found.name,
        },
      };
    }

    if (cleanUrl.startsWith("/auth/register")) {
      const users = getStored("demo_users", DEFAULT_USERS);
      const newUser = {
        _id: "u_" + Date.now(),
        ...parsedData,
      };
      users.push(newUser);
      setStored("demo_users", users);
      return { status: 201, data: { id: newUser._id } };
    }

    // Mock Doctors
    if (cleanUrl === "/doctors" || cleanUrl === "/patients/doctors") {
      const users = getStored("demo_users", DEFAULT_USERS);
      const docs = users.filter((u) => u.role === "doctor");
      return { status: 200, data: docs.length ? docs : DEFAULT_DOCTORS };
    }

    // Mock Patient Appointments
    if (cleanUrl === "/patients/appointments") {
      const appts = getStored("demo_appointments", DEFAULT_APPOINTMENTS);
      if (method.toLowerCase() === "post") {
        const docs = getStored("demo_users", DEFAULT_USERS).filter((u) => u.role === "doctor");
        const doc = docs.find((d) => d._id === parsedData.doctorId) || DEFAULT_DOCTORS[0];
        const newAppt = {
          _id: "appt_" + Date.now(),
          doctor: doc,
          scheduledAt: parsedData.scheduledAt || new Date().toISOString(),
          status: "pending",
          paymentStatus: "pending",
        };
        appts.push(newAppt);
        setStored("demo_appointments", appts);
        return { status: 201, data: newAppt };
      }
      return { status: 200, data: appts };
    }

    // Mock Doctor Appointments
    if (cleanUrl.startsWith("/doctors/appointments")) {
      const appts = getStored("demo_appointments", DEFAULT_APPOINTMENTS);
      if (cleanUrl.endsWith("/accept")) {
        const id = cleanUrl.split("/")[3];
        const found = appts.find((a) => a._id === id);
        if (found) found.status = "accepted";
        setStored("demo_appointments", appts);
        return { status: 200, data: found };
      }
      if (cleanUrl.endsWith("/reject")) {
        const id = cleanUrl.split("/")[3];
        const found = appts.find((a) => a._id === id);
        if (found) found.status = "rejected";
        setStored("demo_appointments", appts);
        return { status: 200, data: found };
      }
      if (cleanUrl.endsWith("/complete")) {
        const id = cleanUrl.split("/")[3];
        const found = appts.find((a) => a._id === id);
        if (found) found.status = "completed";
        setStored("demo_appointments", appts);
        return { status: 200, data: found };
      }
      return { status: 200, data: appts };
    }

    // Mock Payment
    if (cleanUrl.includes("/pay")) {
      const idMatch = cleanUrl.match(/\/appointments\/([^/]+)\/pay/);
      if (idMatch) {
        const appts = getStored("demo_appointments", DEFAULT_APPOINTMENTS);
        const found = appts.find((a) => a._id === idMatch[1]);
        if (found) found.paymentStatus = "paid";
        setStored("demo_appointments", appts);
      }
      return {
        status: 200,
        data: {
          message: "Payment processed successfully",
          transactionId: "TXN" + Date.now(),
          amount: parsedData.amount || 500,
          status: "paid",
          paymentMethod: parsedData.paymentMethod || "card",
        },
      };
    }

    // Mock Users / Roles for Admin
    if (cleanUrl === "/users") {
      const users = getStored("demo_users", DEFAULT_USERS);
      return { status: 200, data: users };
    }

    if (cleanUrl === "/roles") {
      const defaultRoles = [
        { _id: "r1", name: "admin", description: "System Administrator" },
        { _id: "r2", name: "doctor", description: "Medical Professional" },
        { _id: "r3", name: "patient", description: "Healthcare Consumer" },
      ];
      const roles = getStored("demo_roles", defaultRoles);
      if (method.toLowerCase() === "post") {
        const newRole = { _id: "r_" + Date.now(), name: parsedData.name };
        roles.push(newRole);
        setStored("demo_roles", roles);
        return { status: 201, data: newRole };
      }
      return { status: 200, data: roles };
    }

    if (cleanUrl === "/users/cleanup-duplicates") {
      return { status: 200, data: { removed: 0 } };
    }

    return Promise.reject(error);
  }
);

export default api;
