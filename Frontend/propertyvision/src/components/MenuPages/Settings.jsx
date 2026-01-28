import { useEffect, useState } from "react";
import axios from "axios";
import { User, Lock, Settings as Gear } from "lucide-react";

/* ================= API CONFIG (LOCAL ONLY) ================= */

const BASE_URL = "http://localhost:5000/auth/v1/admin";

const getAuthHeaders = () => {
  const token =
    localStorage.getItem("token") ||
    sessionStorage.getItem("token");

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

const Settings = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  /* ================= FETCH PROFILE ================= */
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(
          `${BASE_URL}/profile`,
          getAuthHeaders()
        );

        const profile = res.data.user || res.data.data;

        setUser({
          username: profile.username || "",
          email: profile.email || "",
          mobileNumber: profile.mobileNumber || "",
          role: profile.role || "",
        });
      } catch (err) {
        setError("Failed to load profile");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  /* ================= CHANGE PASSWORD ================= */
  const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (
      !passwords.currentPassword ||
      !passwords.newPassword ||
      !passwords.confirmPassword
    ) {
      alert("All fields are required");
      return;
    }

    if (passwords.newPassword !== passwords.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      await axios.put(
        `${BASE_URL}/change-password`,
        {
          currentPassword: passwords.currentPassword,
          newPassword: passwords.newPassword,
        },
        getAuthHeaders()
      );

      alert("Password updated successfully");

      setPasswords({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      alert(
        err.response?.data?.message ||
          "Password update failed"
      );
    }
  };

  /* ================= STATES ================= */
  if (loading) {
    return (
      <div className="p-6 text-center text-gray-500">
        Loading settings...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center text-red-600">
        {error}
      </div>
    );
  }

  /* ================= UI ================= */
  return (
    <div className="min-h-screen bg-gray-50 px-3 py-4 sm:px-6 sm:py-6">
      {/* HEADER */}
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-semibold text-gray-800">
          Settings
        </h1>
        <p className="text-sm text-gray-500">
          Manage your account and security preferences
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="flex flex-col md:flex-row">
          {/* ================= TABS ================= */}
          <div className="w-full md:w-64 bg-gray-50 border-b md:border-b-0 md:border-r flex md:flex-col">
            <Tab
              icon={<User size={18} />}
              label="Profile"
              active={activeTab === "profile"}
              onClick={() => setActiveTab("profile")}
            />
            <Tab
              icon={<Lock size={18} />}
              label="Security"
              active={activeTab === "security"}
              onClick={() => setActiveTab("security")}
            />
            <Tab
              icon={<Gear size={18} />}
              label="Preferences"
              active={activeTab === "preferences"}
              onClick={() => setActiveTab("preferences")}
            />
          </div>

          {/* ================= CONTENT ================= */}
          <div className="flex-1 p-4 sm:p-6">
            {activeTab === "profile" && (
              <ProfileTab user={user} />
            )}
            {activeTab === "security" && (
              <SecurityTab
                passwords={passwords}
                setPasswords={setPasswords}
                onSubmit={handlePasswordChange}
              />
            )}
            {activeTab === "preferences" && (
              <PreferencesTab />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ================= TAB ================= */

const Tab = ({ icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`flex-1 md:flex-none flex items-center justify-center md:justify-start gap-2
      px-4 py-3 text-sm font-medium border-b md:border-b-0 md:border-l-4 transition
      ${
        active
          ? "bg-white text-[#9c4a1a] border-[#9c4a1a]"
          : "text-gray-600 border-transparent hover:bg-white"
      }`}
  >
    {icon}
    <span className="hidden sm:inline">{label}</span>
  </button>
);

/* ================= PROFILE ================= */

const ProfileTab = ({ user }) => (
  <div className="space-y-6">
    <Section title="Profile Information" subtitle="Account details" />

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <Input label="Username" value={user.username} disabled />
      <Input label="Email" value={user.email} disabled />
      <Input
        label="Mobile Number"
        value={user.mobileNumber}
        disabled
      />
      <Input label="Role" value={user.role} disabled />
    </div>
  </div>
);

/* ================= SECURITY ================= */

const SecurityTab = ({ passwords, setPasswords, onSubmit }) => (
  <form
    onSubmit={onSubmit}
    className="space-y-6 w-full max-w-md mx-auto"
  >
    <Section title="Security" subtitle="Change your password" />

    <div className="bg-gray-50 p-4 sm:p-6 rounded-xl space-y-4">
      <Input
        label="Current Password"
        type="password"
        value={passwords.currentPassword}
        onChange={(e) =>
          setPasswords({
            ...passwords,
            currentPassword: e.target.value,
          })
        }
      />
      <Input
        label="New Password"
        type="password"
        value={passwords.newPassword}
        onChange={(e) =>
          setPasswords({
            ...passwords,
            newPassword: e.target.value,
          })
        }
      />
      <Input
        label="Confirm Password"
        type="password"
        value={passwords.confirmPassword}
        onChange={(e) =>
          setPasswords({
            ...passwords,
            confirmPassword: e.target.value,
          })
        }
      />

      <button
        type="submit"
        className="w-full bg-[#9c4a1a] hover:bg-[#7f3c14]
        text-white py-2.5 rounded-lg text-sm transition"
      >
        Update Password
      </button>
    </div>
  </form>
);

/* ================= PREFERENCES ================= */

const PreferencesTab = () => (
  <div className="space-y-6 w-full max-w-md mx-auto">
    <Section
      title="Preferences"
      subtitle="Customize your experience"
    />
    <Toggle label="Dark Mode" />
    <Toggle label="Email Notifications" />
  </div>
);

/* ================= UI HELPERS ================= */

const Section = ({ title, subtitle }) => (
  <div>
    <h2 className="text-base sm:text-lg font-semibold text-gray-800">
      {title}
    </h2>
    <p className="text-sm text-gray-500">{subtitle}</p>
  </div>
);

const Toggle = ({ label }) => (
  <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
    <span className="text-sm">{label}</span>
    <input type="checkbox" className="accent-[#9c4a1a] w-5 h-5" />
  </div>
);

const Input = ({
  label,
  type = "text",
  value,
  disabled,
  onChange,
}) => (
  <div className="flex flex-col gap-1">
    <label className="text-sm font-medium text-gray-600">
      {label}
    </label>
    <input
      type={type}
      value={value}
      disabled={disabled}
      onChange={onChange}
      className={`border px-3 py-2.5 rounded-lg text-sm w-full
        ${
          disabled
            ? "bg-gray-100 text-gray-500"
            : "focus:ring-2 focus:ring-[#9c4a1a]"
        }`}
    />
  </div>
);

export default Settings;
