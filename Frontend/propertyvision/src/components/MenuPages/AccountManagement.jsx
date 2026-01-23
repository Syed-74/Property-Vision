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

  useEffect(() => {
    let isMounted = true;

    const fetchAdmins = async () => {
      try {
        setLoading(true);
        const res = await api.get("/admins");
        if (isMounted) setAdmins(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchAdmins();
    return () => (isMounted = false);
  }, []);

  const fetchAdmins = async () => {
    const res = await api.get("/admins");
    setAdmins(res.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editId) {
      await api.put(`/admin/${editId}`, form);
    } else {
      await api.post("/register", form);
    }

    setOpen(false);
    setEditId(null);
    setForm(initialFormState);
    fetchAdmins();
  };

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

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this account?")) return;
    await api.delete(`/admin/${id}`);
    fetchAdmins();
  };

  // 🔹 UI-only validation color
  const getInputBorder = (key) => {
    if (key === "address") return "border-l-gray-300";
    if (!form[key]) return "border-l-red-500";
    return "border-l-green-500";
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
          className="bg-[#9c4a1a] hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <Plus size={18} /> Create Account
        </button>
      </div>

      {/* TABLE CARD */}
      <div className="bg-white rounded-xl border shadow-sm overflow-x-auto">
        {loading ? (
          <p className="p-6 text-center text-gray-500">Loading...</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-100 text-gray-600">
              <tr>
                <th className="p-4 text-left">Username</th>
                <th className="p-4 text-left">Email</th>
                <th className="p-4 text-left">Mobile</th>
                <th className="p-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {admins.length === 0 ? (
                <tr>
                  <td colSpan="4" className="p-6 text-center text-gray-500">
                    No accounts found
                  </td>
                </tr>
              ) : (
                admins.map((admin) => (
                  <tr
                    key={admin._id}
                    className="border-t hover:bg-gray-50 transition"
                  >
                    <td className="p-4">{admin.username}</td>
                    <td className="p-4">{admin.email}</td>
                    <td className="p-4">{admin.mobileNumber}</td>
                    <td className="p-4 flex gap-4">
                      <button
                        onClick={() => handleEdit(admin)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(admin._id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* MODAL */}
      {open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-3">
          <div className="bg-white w-full max-w-lg rounded-xl shadow-lg relative">
            <div className="flex justify-between items-center border-b px-6 py-4">
              <h2 className="font-semibold text-gray-800">
                {editId ? "Update Account" : "Create Account"}
              </h2>
              <button onClick={() => setOpen(false)}>
                <X className="text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {Object.keys(form).map((key) => (
                <div key={key}>
                  <input
                    type={key === "password" ? "password" : "text"}
                    placeholder={key}
                    value={form[key]}
                    required={key !== "address"}
                    onChange={(e) =>
                      setForm({ ...form, [key]: e.target.value })
                    }
                    className={`w-full px-3 py-2 border border-l-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${getInputBorder(
                      key
                    )}`}
                  />
                </div>
              ))}

              <button
                type="submit"
                className="w-full bg-[#9c4a1a] hover:bg-indigo-700 text-white py-2 rounded-lg font-medium"
              >
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
