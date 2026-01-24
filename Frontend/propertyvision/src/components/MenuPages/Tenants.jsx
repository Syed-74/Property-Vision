  import React, { useEffect, useState } from "react";
  import axios from "axios";
  import { useNavigate } from "react-router-dom";

  /* ================= API ================= */
  const API = {
    tenants: "http://localhost:5000/api/tenants",
    properties: "http://localhost:5000/api/properties",
    floors: "http://localhost:5000/api/floors",
    units: "http://localhost:5000/api/units",
  };

  /* ================= HELPERS ================= */
  const generateTenantCode = () =>
    "TEN-" + Math.random().toString(36).substring(2, 7).toUpperCase();

  const getInitialTenant = () => ({
    tenantCode: generateTenantCode(),
    fullName: "",
    phone: "",
    propertyId: "",
    floorId: "",
    unitId: "",
    rentAmount: "",
    maintenanceAmount: "",
    leaseStartDate: "",
  });

  /* ================= COMPONENT ================= */
  export default function Tenants() {
    const navigate = useNavigate();

    const [tenants, setTenants] = useState([]);
    const [properties, setProperties] = useState([]);
    const [floors, setFloors] = useState([]);
    const [units, setUnits] = useState([]);

    const [tenantForm, setTenantForm] = useState(getInitialTenant());
    const [openTenant, setOpenTenant] = useState(false);
    const [loading, setLoading] = useState(false);

    const [isEditMode, setIsEditMode] = useState(false);
    const [editingTenantId, setEditingTenantId] = useState(null);

    /* ================= LOAD DATA ================= */
    const loadTenants = async () => {
      const res = await axios.get(API.tenants);
      setTenants(res.data.data || []);
    };

    useEffect(() => {
      loadTenants();
      axios.get(API.properties).then(r => setProperties(r.data.data || []));
    }, []);

    useEffect(() => {
      if (!tenantForm.propertyId) return;
      axios
        .get(`${API.floors}/property/${tenantForm.propertyId}`)
        .then(r => setFloors(r.data.data || []));
    }, [tenantForm.propertyId]);

    useEffect(() => {
      if (!tenantForm.floorId) return;
      axios.get(`${API.units}/property/${tenantForm.propertyId}`).then(r => {
        setUnits(
          (r.data.data || []).filter(
            u =>
              u.floorId?._id === tenantForm.floorId &&
              u.availabilityStatus === "Available"
          )
        );
      });
    }, [tenantForm.floorId]);

    /* ================= ACTIONS ================= */
    const saveTenant = async () => {
      if (!tenantForm.tenantCode || !tenantForm.fullName || !tenantForm.unitId) {
        alert("Tenant Code, Name and Unit are required");
        return;
      }

      try {
        setLoading(true);

        if (isEditMode) {
          await axios.put(`${API.tenants}/${editingTenantId}`, tenantForm);
        } else {
          await axios.post(API.tenants, tenantForm);
        }

        setOpenTenant(false);
        setTenantForm(getInitialTenant());
        setIsEditMode(false);
        setEditingTenantId(null);
        loadTenants();
      } catch (err) {
        alert(err.response?.data?.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    const editTenant = tenant => {
      setTenantForm({
        tenantCode: tenant.tenantCode,
        fullName: tenant.fullName,
        phone: tenant.phone,
        propertyId: tenant.propertyId?._id || "",
        floorId: tenant.floorId?._id || "",
        unitId: tenant.unitId?._id || "",
        rentAmount: tenant.rentAmount,
        maintenanceAmount: tenant.maintenanceAmount,
        leaseStartDate: tenant.leaseStartDate?.slice(0, 10),
      });

      setEditingTenantId(tenant._id);
      setIsEditMode(true);
      setOpenTenant(true);
    };

    const deleteTenant = async id => {
      if (!window.confirm("Are you sure you want to delete this tenant?")) return;
      await axios.delete(`${API.tenants}/${id}`);
      loadTenants();
    };

    /* ================= UI ================= */
    return (
      <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-semibold">Tenant Management</h1>
            <p className="text-sm text-gray-500">
              Property-wise tenant, rent & maintenance tracking
            </p>
          </div>

          <button
            onClick={() => {
              setTenantForm(getInitialTenant());
              setIsEditMode(false);
              setOpenTenant(true);
            }}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg"
          >
            + Add Tenant
          </button>
        </div>

        {/* TENANT CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {tenants.map(t => (
            <div
              key={t._id}
              className="bg-white rounded-2xl border shadow-sm hover:shadow-xl transition p-5 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold">{t.fullName}</h3>
                    <p className="text-xs text-gray-500">
                      Tenant Code: {t.tenantCode}
                    </p>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-xs ${
                      t.status === "Active"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    {t.status}
                  </span>
                </div>

                <p className="text-sm text-gray-600">
                  Flat {t.unitId?.unitNumber} • {t.propertyId?.propertyName}
                </p>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-500">Rent</p>
                    <p className="font-semibold">₹{t.rentAmount}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-500">Maintenance</p>
                    <p className="font-semibold">₹{t.maintenanceAmount}</p>
                  </div>
                </div>
              </div>

              {/* ACTIONS */}
              <div className="mt-5 grid grid-cols-3 gap-2 text-sm">
                <button
                  onClick={() => navigate(`/admin/dashboard/tenants/${t._id}`)}
                  className="bg-indigo-50 hover:bg-indigo-600 text-indigo-700 hover:text-white rounded-lg py-2 transition"
                >
                  Manage
                </button>
                <button
                  onClick={() => editTenant(t)}
                  className="bg-yellow-50 hover:bg-yellow-500 text-yellow-700 hover:text-white rounded-lg py-2 transition"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteTenant(t._id)}
                  className="bg-red-50 hover:bg-red-600 text-red-700 hover:text-white rounded-lg py-2 transition"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* ADD / EDIT MODAL */}
        {openTenant && (
          <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-4xl rounded-xl shadow-xl">
              <div className="px-6 py-4 border-b flex justify-between">
                <h2 className="font-semibold">
                  {isEditMode ? "Edit Tenant" : "Add Tenant"}
                </h2>
                <button onClick={() => setOpenTenant(false)}>&times;</button>
              </div>

              <div className="p-6 grid sm:grid-cols-2 gap-4">
                <input
                  className="input bg-gray-100 cursor-not-allowed"
                  value={tenantForm.tenantCode}
                  disabled
                />

                <input
                  className="input"
                  placeholder="Full Name"
                  value={tenantForm.fullName}
                  onChange={e =>
                    setTenantForm({ ...tenantForm, fullName: e.target.value })
                  }
                />

                <input
                  className="input"
                  placeholder="Phone"
                  value={tenantForm.phone}
                  onChange={e =>
                    setTenantForm({ ...tenantForm, phone: e.target.value })
                  }
                />

                <input
                  type="date"
                  className="input"
                  value={tenantForm.leaseStartDate}
                  onChange={e =>
                    setTenantForm({
                      ...tenantForm,
                      leaseStartDate: e.target.value,
                    })
                  }
                />

                <input
                  className="input"
                  placeholder="Rent Amount"
                  value={tenantForm.rentAmount}
                  onChange={e =>
                    setTenantForm({ ...tenantForm, rentAmount: e.target.value })
                  }
                />

                <input
                  className="input"
                  placeholder="Maintenance Amount"
                  value={tenantForm.maintenanceAmount}
                  onChange={e =>
                    setTenantForm({
                      ...tenantForm,
                      maintenanceAmount: e.target.value,
                    })
                  }
                />

                <select
                  className="input"
                  value={tenantForm.propertyId}
                  onChange={e =>
                    setTenantForm({ ...tenantForm, propertyId: e.target.value })
                  }
                >
                  <option value="">Select Property</option>
                  {properties.map(p => (
                    <option key={p._id} value={p._id}>
                      {p.propertyName}
                    </option>
                  ))}
                </select>

                <select
                  className="input"
                  value={tenantForm.floorId}
                  onChange={e =>
                    setTenantForm({ ...tenantForm, floorId: e.target.value })
                  }
                >
                  <option value="">Select Floor</option>
                  {floors.map(f => (
                    <option key={f._id} value={f._id}>
                      {f.floorName || `Floor ${f.floorNumber}`}
                    </option>
                  ))}
                </select>

                <select
                  className="input"
                  value={tenantForm.unitId}
                  onChange={e =>
                    setTenantForm({ ...tenantForm, unitId: e.target.value })
                  }
                >
                  <option value="">Select Unit</option>
                  {units.map(u => (
                    <option key={u._id} value={u._id}>
                      {u.unitNumber}
                    </option>
                  ))}
                </select>
              </div>

              <div className="px-6 py-4 border-t flex justify-end">
                <button
                  onClick={saveTenant}
                  disabled={loading}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded"
                >
                  {isEditMode ? "Update Tenant" : "Save Tenant"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }