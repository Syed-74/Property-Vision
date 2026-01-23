import React, { useEffect, useState } from "react";
import axios from "axios";

/* =========================
   CONFIG
========================= */
const API_URL = "http://localhost:5000/api/floors";
const PROPERTY_API = "http://localhost:5000/api/properties";

const initialForm = {
  propertyId: "",
  floorNumber: "",
  floorName: "",
  floorType: "Residential",
  totalUnits: "",
  isActive: true,
};

const Floor = () => {
  const [floors, setFloors] = useState([]);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [openForm, setOpenForm] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedFloor, setSelectedFloor] = useState(null);
  const [formData, setFormData] = useState(initialForm);
  const [error, setError] = useState("");

  /* ================= FETCH ================= */
  const fetchFloors = async () => {
    try {
      setLoading(true);
      const res = await axios.get(API_URL);
      setFloors(res.data.data || []);
    } catch {
      setError("Failed to load floors");
    } finally {
      setLoading(false);
    }
  };

  const fetchProperties = async () => {
    try {
      const res = await axios.get(PROPERTY_API);
      setProperties(res.data.data || []);
    } catch {
      setError("Failed to load properties");
    }
  };

  useEffect(() => {
    fetchFloors();
    fetchProperties();
  }, []);

  /* ================= HELPERS ================= */
  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const closeForm = () => {
    setOpenForm(false);
    setIsEdit(false);
    setSelectedFloor(null);
    setFormData(initialForm);
    setError("");
  };

  const submit = async () => {
    if (!formData.propertyId || formData.floorNumber === "") {
      setError("Property and Floor Number are required");
      return;
    }

    try {
      setSubmitting(true);
      if (isEdit) {
        await axios.put(`${API_URL}/${selectedFloor._id}`, formData);
      } else {
        await axios.post(API_URL, formData);
      }
      fetchFloors();
      closeForm();
    } catch {
      setError("Failed to save floor");
    } finally {
      setSubmitting(false);
    }
  };

  const deleteFloor = async id => {
    if (!window.confirm("Are you sure you want to delete this floor?")) return;
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchFloors();
    } catch {
      setError("Failed to delete floor");
    }
  };

  return (
    <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Floor Management</h1>
          <p className="text-sm text-gray-500">
            Manage floors under each property
          </p>
        </div>

        <button
          onClick={() => setOpenForm(true)}
          className="bg-[#9c4a1a] hover:bg-indigo-700 text-white px-4 py-2 rounded-lg"
        >
          + Add Floor
        </button>
      </div>

      {/* ERROR */}
      {error && (
        <div className="mb-4 bg-red-100 text-red-700 px-4 py-2 rounded">
          {error}
        </div>
      )}

      {/* FLOOR CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {loading ? (
          <div className="col-span-full text-center py-10">Loading floors…</div>
        ) : floors.length === 0 ? (
          <div className="col-span-full text-center py-10 text-gray-500">
            No floors found
          </div>
        ) : (
          floors.map(f => (
            <div
              key={f._id}
              className="bg-white rounded-2xl border shadow-sm hover:shadow-xl transition flex flex-col justify-between"
            >
              {/* CARD BODY */}
              <div className="p-5 space-y-3">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-semibold">
                    {f.floorName || `Floor ${f.floorNumber}`}
                  </h3>

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium
                      ${
                        f.isActive
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                  >
                    {f.isActive ? "Active" : "Inactive"}
                  </span>
                </div>

                <p className="text-sm text-gray-600">
                  <b>Property:</b> {f.propertyId?.propertyName || "—"}
                </p>

                <div className="grid grid-cols-2 gap-4 text-sm pt-2">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500">Floor No</p>
                    <p className="font-semibold">{f.floorNumber}</p>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500">Units</p>
                    <p className="font-semibold">{f.totalUnits || "—"}</p>
                  </div>
                </div>

                <p className="text-sm text-gray-500">
                  Type: {f.floorType}
                </p>
              </div>

              {/* ACTIONS */}
              <div className="border-t px-5 py-3 grid grid-cols-2 gap-2 text-sm">
                <button
                  onClick={() => {
                    setSelectedFloor(f);
                    setFormData({
                      propertyId: f.propertyId?._id || "",
                      floorNumber: f.floorNumber,
                      floorName: f.floorName || "",
                      floorType: f.floorType,
                      totalUnits: f.totalUnits || "",
                      isActive: f.isActive,
                    });
                    setIsEdit(true);
                    setOpenForm(true);
                  }}
                  className="bg-indigo-50 hover:bg-[#9c4a1a] text-indigo-700 hover:text-white rounded-lg py-2 transition"
                >
                  Edit
                </button>

                <button
                  onClick={() => deleteFloor(f._id)}
                  className="bg-red-50 hover:bg-red-600 text-red-700 hover:text-white rounded-lg py-2 transition"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ADD / EDIT MODAL */}
      {openForm && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-xl rounded-xl shadow-xl">

            <div className="px-6 py-4 border-b flex justify-between items-center">
              <h2 className="font-semibold text-lg">
                {isEdit ? "Edit Floor" : "Add Floor"}
              </h2>
              <button onClick={closeForm} className="text-2xl">&times;</button>
            </div>

            <div className="p-6 space-y-4 text-sm">
              <select
                className="input"
                value={formData.propertyId}
                onChange={e => updateField("propertyId", e.target.value)}
              >
                <option value="">Select Property</option>
                {properties.map(p => (
                  <option key={p._id} value={p._id}>
                    {p.propertyName}
                  </option>
                ))}
              </select>

              <input
                type="number"
                className="input"
                placeholder="Floor Number"
                value={formData.floorNumber}
                onChange={e => updateField("floorNumber", e.target.value)}
              />

              <input
                className="input"
                placeholder="Floor Name"
                value={formData.floorName}
                onChange={e => updateField("floorName", e.target.value)}
              />

              <select
                className="input"
                value={formData.floorType}
                onChange={e => updateField("floorType", e.target.value)}
              >
                <option>Residential</option>
                <option>Commercial</option>
                <option>Mixed</option>
              </select>

              <input
                type="number"
                className="input"
                placeholder="Total Units"
                value={formData.totalUnits}
                onChange={e => updateField("totalUnits", e.target.value)}
              />

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={e => updateField("isActive", e.target.checked)}
                />
                Active
              </label>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <button onClick={closeForm} className="border px-4 py-2 rounded">
                  Cancel
                </button>
                <button
                  onClick={submit}
                  disabled={submitting}
                  className="bg-[#9c4a1a] text-white px-6 py-2 rounded disabled:opacity-50"
                >
                  {isEdit ? "Update Floor" : "Create Floor"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Floor;
