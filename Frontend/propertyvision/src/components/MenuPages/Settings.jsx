import { useEffect, useState } from "react";
import axios from "axios";
import { User, Lock, Settings as Gear, ShieldCheck, Bell, ChevronRight, Menu, X } from "lucide-react";

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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Mobile sidebar state

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

  /* ================= LOADING & ERROR ================= */
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-500">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mr-2"></div>
        Loading settings...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center text-red-600 bg-red-50 min-h-screen flex items-center justify-center">
        {error}
      </div>
    );
  }

  /* ================= UI ================= */
  return (
    <div className="min-h-screen bg-gray-50/50 p-4 sm:p-8 max-w-[1600px] mx-auto">

      {/* HEADER */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Gear className="text-indigo-600" /> Settings
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Manage your account and security preferences
          </p>
        </div>
        {/* Mobile Sidebar Toggle */}
        <button
          className="lg:hidden flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          <Menu size={18} /> Menu
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative">

        {/* ================= SIDEBAR (Desktop) ================= */}
        <div className="hidden lg:block lg:col-span-3 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden sticky top-8">
          <div className="p-2 space-y-1">
            <NavButton icon={<User size={18} />} label="Profile" active={activeTab === "profile"} onClick={() => setActiveTab("profile")} />
            <NavButton icon={<Lock size={18} />} label="Security" active={activeTab === "security"} onClick={() => setActiveTab("security")} />
            <NavButton icon={<Bell size={18} />} label="Preferences" active={activeTab === "preferences"} onClick={() => setActiveTab("preferences")} />
          </div>
          <div className="p-4 border-t border-gray-100 mt-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                {user.username?.[0]?.toUpperCase() || "U"}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{user.username}</p>
                <p className="text-xs text-gray-500 truncate">{user.email}</p>
              </div>
            </div>
          </div>
        </div>

        {/* ================= SIDEBAR (Mobile Drawer) ================= */}
        {isSidebarOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setIsSidebarOpen(false)}></div>
            <div className="absolute left-0 top-0 bottom-0 w-3/4 max-w-xs bg-white shadow-xl p-4 flex flex-col gap-4">
              <div className="flex justify-between items-center pb-4 border-b">
                <h2 className="font-bold text-lg">Settings Menu</h2>
                <button onClick={() => setIsSidebarOpen(false)} className="p-2 hover:bg-gray-100 rounded-full"><X size={20} /></button>
              </div>
              <div className="flex flex-col gap-2">
                <NavButton icon={<User size={18} />} label="Profile" active={activeTab === "profile"} onClick={() => { setActiveTab("profile"); setIsSidebarOpen(false) }} />
                <NavButton icon={<Lock size={18} />} label="Security" active={activeTab === "security"} onClick={() => { setActiveTab("security"); setIsSidebarOpen(false) }} />
                <NavButton icon={<Bell size={18} />} label="Preferences" active={activeTab === "preferences"} onClick={() => { setActiveTab("preferences"); setIsSidebarOpen(false) }} />
              </div>
            </div>
          </div>
        )}

        {/* ================= CONTENT AREA ================= */}
        <div className="lg:col-span-9 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 min-h-[500px]">
            {activeTab === "profile" && <ProfileTab user={user} />}
            {activeTab === "security" && <SecurityTab passwords={passwords} setPasswords={setPasswords} onSubmit={handlePasswordChange} />}
            {activeTab === "preferences" && <PreferencesTab />}
          </div>
        </div>

      </div>
    </div>
  );
};

/* ================= COMPONENTS ================= */

const NavButton = ({ icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${active
        ? "bg-indigo-50 text-indigo-700 shadow-sm ring-1 ring-indigo-200"
        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
      }`}
  >
    {icon}
    <span className="flex-1 text-left">{label}</span>
    {active && <ChevronRight size={16} className="opacity-50" />}
  </button>
);

const ProfileTab = ({ user }) => (
  <div className="space-y-8 animate-fadeIn">
    <div className="border-b pb-4">
      <h2 className="text-xl font-bold text-gray-800">Personol Details</h2>
      <p className="text-gray-500 text-sm">Review your personal information.</p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Input label="Full Name / Username" value={user.username} disabled />
      <Input label="Email Address" value={user.email} disabled />
      <Input label="Phone Number" value={user.mobileNumber} disabled />
      <Input label="Account Role" value={user.role} disabled badge />
    </div>
  </div>
);


const SecurityTab = ({ passwords, setPasswords, onSubmit }) => (
  <form onSubmit={onSubmit} className="max-w-lg space-y-8 animate-fadeIn">
    <div className="border-b pb-4">
      <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
        Change Password
      </h2>
      <p className="text-gray-500 text-sm">Ensure your account is using a long, random password to stay secure.</p>
    </div>

    <div className="space-y-5">
      <Input
        label="Current Password"
        type="password"
        value={passwords.currentPassword}
        onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
        placeholder="••••••••"
      />

      <div className="grid grid-cols-1 gap-5">
        <Input
          label="New Password"
          type="password"
          value={passwords.newPassword}
          onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
          placeholder="••••••••"
        />
        <Input
          label="Confirm New Password"
          type="password"
          value={passwords.confirmPassword}
          onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
          placeholder="••••••••"
        />
      </div>

      <div className="pt-4 flex items-center gap-4">
        <button
          type="submit"
          className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl shadow-md shadow-indigo-200 transition-all hover:shadow-lg disabled:opacity-50"
        >
          Update Password
        </button>
        <a href="#" className="text-sm text-gray-500 hover:text-indigo-600 font-medium">I forgot my password</a>
      </div>
    </div>
  </form>
);


const PreferencesTab = () => (
  <div className="max-w-2xl space-y-8 animate-fadeIn">
    <div className="border-b pb-4">
      <h2 className="text-xl font-bold text-gray-800">Preferences</h2>
      <p className="text-gray-500 text-sm">Customize how the application behaves for you.</p>
    </div>

    <div className="space-y-4">
      <Toggle
        title="Email Notifications"
        desc="Get emails to find out what's going on when you're not online."
        defaultChecked
      />
      <Toggle
        title="Two-Factor Authentication"
        desc="Add an extra layer of security to your account."
      />
      <Toggle
        title="Desktop Notifications"
        desc="Get notified for critical alerts and updates."
        defaultChecked
      />
      <Toggle
        title="Dark Mode"
        desc="Switch to a darker theme for low-light environments."
      />
    </div>
  </div>
);


/* ================= UI HELPERS ================= */

const Toggle = ({ title, desc, defaultChecked }) => (
  <label className="flex items-start justify-between cursor-pointer p-4 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors group">
    <div className="flex-1 pr-4">
      <h4 className="font-semibold text-gray-900 group-hover:text-indigo-700 transition-colors">{title}</h4>
      <p className="text-sm text-gray-500 mt-0.5">{desc}</p>
    </div>
    <div className="relative inline-flex items-center cursor-pointer">
      <input type="checkbox" className="sr-only peer" defaultChecked={defaultChecked} />
      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
    </div>
  </label>
);

const Input = ({ label, type = "text", value, disabled, onChange, placeholder, badge }) => (
  <div className="space-y-1.5">
    <label className="block text-sm font-semibold text-gray-700">
      {label}
    </label>
    <div className="relative">
      <input
        type={type}
        value={value}
        disabled={disabled}
        onChange={onChange}
        placeholder={placeholder}
        className={`block w-full px-4 py-3 rounded-xl text-sm transition-all
            ${disabled
            ? "bg-gray-50 text-gray-500 border-gray-200 cursor-not-allowed"
            : "border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          } border`}
      />
      {badge && (
        <span className="absolute right-3 top-1/2 -translate-y-1/2 px-2 py-0.5 bg-green-100 text-green-700 text-xs font-bold rounded-md uppercase tracking-wide">
          {value}
        </span>
      )}
    </div>
  </div>
);

export default Settings;
