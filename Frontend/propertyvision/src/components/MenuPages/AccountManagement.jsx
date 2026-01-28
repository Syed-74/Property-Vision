import { useEffect, useState } from "react";
import { Plus, Trash2, Edit, X } from "lucide-react";
import api from "../../api/axios";

const initialFormState = {
  username: "",
  email: "",
  password: "",
  mobileNumber: "",
  address: "",
};

const AccountManagement = () => {
  const [open, setOpen] = useState(false);
  const [admins, setAdmins] = useState([]);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(initialFormState);
  const [loading, setLoading] = useState(false);

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
      delete payload.password; // ✅ don't update password if empty
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
    }
  };

  /* ================= EDIT ================= */
  const handleEdit = (admin) => {
    setEditId(admin._id);
    setForm({
      username: admin.username,
      email: admin.email,
      password: "",
      mobileNumber: admin.mobileNumber,
      address: admin.address,
    });
    setOpen(true);
  };

  /* ================= DELETE ================= */
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this account?")) return;
    try {
      await api.delete(`/auth/v1/admin/admin/${id}`);
      fetchAdmins();
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      {/* HEADER */}
      <div className="bg-white rounded-xl p-4 sm:p-6 mb-6 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-xl font-semibold text-gray-800">
          Account Management
        </h1>

        <button
          onClick={() => {
            setForm(initialFormState);
            setEditId(null);
            setOpen(true);
          }}
          className="bg-[#9c4a1a] hover:bg-[#7f3c14] text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2"
        >
          <Plus size={18} /> Create Account
        </button>
      </div>

      {/* RESPONSIVE LIST */}
      <div className="bg-white rounded-xl border shadow-sm">
        {loading ? (
          <p className="p-6 text-center text-gray-500">Loading...</p>
        ) : admins.length === 0 ? (
          <p className="p-6 text-center text-gray-500">No accounts found</p>
        ) : (
          <div className="divide-y">
            {admins.map((admin) => (
              <div
                key={admin._id}
                className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
              >
                <div>
                  <p className="font-medium text-gray-800">
                    {admin.username}
                  </p>
                  <p className="text-sm text-gray-500">{admin.email}</p>
                  <p className="text-sm text-gray-500">
                    {admin.mobileNumber}
                  </p>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => handleEdit(admin)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(admin._id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* MODAL */}
      {open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-3">
          <div className="bg-white w-full max-w-lg rounded-xl shadow-lg">
            <div className="flex justify-between items-center border-b px-6 py-4">
              <h2 className="font-semibold">
                {editId ? "Update Account" : "Create Account"}
              </h2>
              <button onClick={() => setOpen(false)}>
                <X />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <input
                placeholder="Username"
                value={form.username}
                onChange={(e) =>
                  setForm({ ...form, username: e.target.value })
                }
                required
                className="w-full input"
              />

              <input
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={(e) =>
                  setForm({ ...form, email: e.target.value })
                }
                required
                className="w-full input"
              />

              <input
                type="password"
                placeholder={editId ? "New password (optional)" : "Password"}
                value={form.password}
                onChange={(e) =>
                  setForm({ ...form, password: e.target.value })
                }
                required={!editId}
                className="w-full input"
              />

              <input
                placeholder="Mobile Number"
                value={form.mobileNumber}
                onChange={(e) =>
                  setForm({ ...form, mobileNumber: e.target.value })
                }
                required
                className="w-full input"
              />

              <textarea
                placeholder="Address"
                value={form.address}
                onChange={(e) =>
                  setForm({ ...form, address: e.target.value })
                }
                className="w-full input"
              />

              <button className="w-full bg-[#9c4a1a] text-white py-2 rounded-lg">
                {editId ? "Update Account" : "Create Account"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountManagement;
