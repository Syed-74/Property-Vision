import { useEffect, useState } from "react";
import { Plus, Trash2, Edit, X, User, Search, Shield, Grid, List as ListIcon } from "lucide-react";
import api from "../../api/axios";

const initialFormState = {
  username: "",
  email: "",
  password: "",
  mobileNumber: "",
  address: "",
  role: "admin", // Default role
};

const AccountManagement = () => {
  const [open, setOpen] = useState(false);
  const [admins, setAdmins] = useState([]);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(initialFormState);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("grid"); // grid or list

  /* ================= FETCH ADMINS ================= */
  const fetchAdmins = async () => {
    try {
      setLoading(true);
      const res = await api.get("/auth/v1/admin/admins");
      setAdmins(res.data);
    } catch (err) {
      console.error("Fetch admins failed", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = { ...form };
    if (editId && !payload.password) {
      delete payload.password;
    }

    try {
      if (editId) {
        await api.put(`/auth/v1/admin/admin/${editId}`, payload);
      } else {
        await api.post("/auth/v1/admin/register", payload);
      }

      setOpen(false);
      setEditId(null);
      setForm(initialFormState);
      fetchAdmins();
    } catch (err) {
      console.error("Submit failed", err);
      // Optional: Add toast notification here
    }
  };

  /* ================= HELPERS ================= */
  const handleEdit = (admin) => {
    setEditId(admin._id);
    setForm({
      username: admin.username,
      email: admin.email,
      password: "",
      mobileNumber: admin.mobileNumber,
      address: admin.address || "",
      role: admin.role || "admin",
    });
    setOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this account? This action cannot be undone.")) return;
    try {
      await api.delete(`/auth/v1/admin/admin/${id}`);
      fetchAdmins();
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  const filteredAdmins = admins.filter(admin =>
    admin.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    admin.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50/50 p-4 sm:p-8 max-w-[1600px] mx-auto">

      {/* HEADER SECTION */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <User className="text-indigo-600" /> Account Management
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Create and manage administrative accounts and permissions.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search accounts..."
              className="pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full sm:w-64 shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2 bg-white p-1 rounded-xl border border-gray-200 shadow-sm">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-lg transition-all ${viewMode === "grid" ? "bg-indigo-50 text-indigo-600" : "text-gray-400 hover:text-gray-600"}`}
            >
              <Grid size={18} />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-lg transition-all ${viewMode === "list" ? "bg-indigo-50 text-indigo-600" : "text-gray-400 hover:text-gray-600"}`}
            >
              <ListIcon size={18} />
            </button>
          </div>

          <button
            onClick={() => {
              setForm(initialFormState);
              setEditId(null);
              setOpen(true);
            }}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-medium shadow-md shadow-indigo-200 transition-all hover:shadow-lg flex items-center justify-center gap-2"
          >
            <Plus size={18} /> New Account
          </button>
        </div>
      </div>

      {/* CONTENT GRID/LIST */}
      {loading ? (
        <div className="flex items-center justify-center h-64 text-gray-400">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mr-3"></div>
          Loading accounts...
        </div>
      ) : filteredAdmins.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-300">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="text-gray-400" size={32} />
          </div>
          <h3 className="text-lg font-medium text-gray-900">No accounts found</h3>
          <p className="text-gray-500 mt-1">Try adjusting your search or create a new account.</p>
        </div>
      ) : (
        <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" : "space-y-4"}>
          {filteredAdmins.map((admin) => (
            <div key={admin._id} className={`bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow group overflow-hidden ${viewMode === 'list' ? 'flex items-center justify-between p-4' : 'p-6 flex flex-col'}`}>

              <div className={`${viewMode === 'list' ? 'flex items-center gap-6' : 'mb-6 text-center'}`}>
                <div className={`relative inline-block ${viewMode === 'list' ? '' : 'mx-auto mb-4'}`}>
                  <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-white text-xl font-bold shadow-indigo-200 shadow-lg">
                    {admin.username?.[0]?.toUpperCase()}
                  </div>
                  <div className="absolute -bottom-1 -right-1 bg-white p-1 rounded-full">
                    <Shield className="w-4 h-4 text-emerald-500 fill-emerald-500" />
                  </div>
                </div>

                <div className={viewMode === 'list' ? 'text-left' : ''}>
                  <h3 className="font-bold text-gray-900 text-lg">{admin.username}</h3>
                  <p className="text-sm text-gray-500">{admin.email}</p>
                  {viewMode === 'grid' && (
                    <div className="mt-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 capitalize">
                      {admin.role || "Admin"}
                    </div>
                  )}
                </div>
              </div>

              {viewMode === 'grid' && (
                <div className="space-y-3 mb-6 border-t border-gray-50 pt-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Mobile</span>
                    <span className="font-medium text-gray-700">{admin.mobileNumber || "N/A"}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Joined</span>
                    <span className="font-medium text-gray-700">Recent</span>
                  </div>
                </div>
              )}

              <div className={`flex gap-3 ${viewMode === 'list' ? '' : 'mt-auto pt-4 border-t border-gray-100'}`}>
                <button
                  onClick={() => handleEdit(admin)}
                  className="flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-xl text-sm font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 transition-colors"
                >
                  <Edit size={16} /> <span className={viewMode === 'list' ? 'hidden sm:inline' : ''}>Edit</span>
                </button>
                <button
                  onClick={() => handleDelete(admin._id)}
                  className="flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-xl text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 transition-colors"
                >
                  <Trash2 size={16} /> <span className={viewMode === 'list' ? 'hidden sm:inline' : ''}>Delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CREATE/EDIT MODAL */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setOpen(false)}></div>
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-fadeIn">

            <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50/50">
              <h2 className="text-lg font-bold text-gray-800">
                {editId ? "Update Account" : "Create New Account"}
              </h2>
              <button
                onClick={() => setOpen(false)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div className="grid grid-cols-2 gap-5">
                <Input
                  label="Username"
                  value={form.username}
                  onChange={(e) => setForm({ ...form, username: e.target.value })}
                  required
                  placeholder="John Doe"
                />
                <Input
                  label="Role"
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                  placeholder="admin"
                />
              </div>

              <Input
                label="Email Address"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
                placeholder="john@example.com"
              />

              <div className="grid grid-cols-2 gap-5">
                <Input
                  label="Password"
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required={!editId}
                  placeholder={editId ? "Only to change" : "••••••••"}
                />
                <Input
                  label="Mobile Number"
                  value={form.mobileNumber}
                  onChange={(e) => setForm({ ...form, mobileNumber: e.target.value })}
                  required
                  placeholder="+91 98765 43210"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-sm font-semibold text-gray-700">Address</label>
                <textarea
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  placeholder="Residential address..."
                  rows="3"
                  className="block w-full px-4 py-3 rounded-xl text-sm border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all resize-none"
                />
              </div>

              <div className="pt-2">
                <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 rounded-xl shadow-lg shadow-indigo-200 transition-all hover:shadow-xl active:scale-[0.98]">
                  {editId ? "Update Account Details" : "Create Account"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// Reusable Input Component
const Input = ({ label, type = "text", value, onChange, required, placeholder }) => (
  <div className="space-y-1.5 w-full">
    <label className="block text-sm font-semibold text-gray-700">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      required={required}
      placeholder={placeholder}
      className="block w-full px-4 py-3 rounded-xl text-sm border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
    />
  </div>
);

export default AccountManagement;
