import React, { useEffect, useState } from "react";
import axios from "axios";

const PROPERTY_API = "http://localhost:5000/api/properties";
const FLOOR_API = "http://localhost:5000/api/floors";
const UNIT_API = "http://localhost:5000/api/units";

/* =========================
   INITIAL STATE
========================= */
const initialUnit = {
  unitNumber: "",
  unitType: "Flat",

  builtUpArea: "",
  carpetArea: "",

  bedrooms: "",
  bathrooms: "",
  balconies: "",

  rentAmount: "",
  securityDeposit: "",
  maintenanceCharge: "",

  availabilityStatus: "Available",
  furnishingStatus: "Unfurnished",
  parkingAvailable: false,
};

const Units = () => {
  const [properties, setProperties] = useState([]);
  const [floors, setFloors] = useState([]);
  const [units, setUnits] = useState([]);

  const [propertyId, setPropertyId] = useState("");
  const [floorId, setFloorId] = useState("");

  const [open, setOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(initialUnit);

  /* =========================
     FETCH PROPERTIES
  ========================== */
  useEffect(() => {
    axios.get(PROPERTY_API).then((res) => {
      setProperties(res.data?.data || []);
    });
  }, []);

  /* =========================
     FETCH FLOORS
  ========================== */
  useEffect(() => {
    if (!propertyId) return;

    axios
      .get(`${FLOOR_API}/property/${propertyId}`)
      .then((res) => setFloors(res.data?.data || []));

    setFloorId("");
    setUnits([]);
  }, [propertyId]);

  /* =========================
     FETCH UNITS
  ========================== */
  useEffect(() => {
    if (!propertyId) return;

    axios.get(`${UNIT_API}/property/${propertyId}`).then((res) => {
      const list = floorId
        ? res.data.data.filter((u) => u.floorId?._id === floorId)
        : res.data.data;
      setUnits(list);
    });
  }, [propertyId, floorId]);

  /* =========================
     SAVE / UPDATE UNIT
  ========================== */
  const saveUnit = async () => {
    if (!propertyId || !floorId || !form.unitNumber) {
      alert("Property, Floor and Unit Number are required");
      return;
    }

    const payload = {
      ...form,
      propertyId,
      floorId,
    };

    if (isEdit) {
      await axios.put(`${UNIT_API}/${editId}`, payload);
    } else {
      await axios.post(UNIT_API, payload);
    }

    setOpen(false);
    setIsEdit(false);
    setEditId(null);
    setForm(initialUnit);

    const res = await axios.get(`${UNIT_API}/property/${propertyId}`);
    setUnits(res.data.data);
  };

  /* =========================
     DELETE UNIT
  ========================== */
  const deleteUnit = async (id) => {
    if (!window.confirm("Delete this unit?")) return;
    await axios.delete(`${UNIT_API}/${id}`);
    setUnits((prev) => prev.filter((u) => u._id !== id));
  };

  /* =========================
     EDIT UNIT
  ========================== */
  const editUnit = (unit) => {
    setForm({
      unitNumber: unit.unitNumber || "",
      unitType: unit.unitType || "Flat",

      builtUpArea: unit.builtUpArea || "",
      carpetArea: unit.carpetArea || "",

      bedrooms: unit.bedrooms || "",
      bathrooms: unit.bathrooms || "",
      balconies: unit.balconies || "",

      rentAmount: unit.rentAmount || "",
      securityDeposit: unit.securityDeposit || "",
      maintenanceCharge: unit.maintenanceCharge || "",

      availabilityStatus: unit.availabilityStatus || "Available",
      furnishingStatus: unit.furnishingStatus || "Unfurnished",
      parkingAvailable: unit.parkingAvailable || false,
    });

    setEditId(unit._id);
    setIsEdit(true);
    setOpen(true);
  };

  return (
    <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-semibold mb-6">Flats / Units Management</h1>

      {/* FILTERS */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <select
          className="input"
          value={propertyId}
          onChange={(e) => setPropertyId(e.target.value)}
        >
          <option value="">Select Property</option>
          {properties.map((p) => (
            <option key={p._id} value={p._id}>
              {p.propertyName}
            </option>
          ))}
        </select>

        <select
          className="input"
          value={floorId}
          disabled={!propertyId}
          onChange={(e) => setFloorId(e.target.value)}
        >
          <option value="">Select Floor</option>
          {floors.map((f) => (
            <option key={f._id} value={f._id}>
              {f.floorName || `Floor ${f.floorNumber}`}
            </option>
          ))}
        </select>

        <button
          disabled={!floorId}
          onClick={() => {
            setForm(initialUnit);
            setIsEdit(false);
            setOpen(true);
          }}
          className="bg-[#9c4a1a] text-white px-4 py-2 rounded disabled:opacity-50"
        >
          + Add Unit
        </button>
      </div>

      {/* UNITS GRID */}
     <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
  {units.map((u) => (
    <div
      key={u._id}
      className="
        group relative bg-white rounded-2xl
        border border-gray-100
        shadow-sm hover:shadow-2xl
        transition-all duration-300
        flex flex-col justify-between
        overflow-hidden
      "
    >
      {/* TOP ACCENT */}
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#9c4a1a] to-orange-400" />

      {/* HEADER */}
      <div className="p-5 space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 leading-tight">
              Unit {u.unitNumber}
            </h3>
            <p className="text-sm text-gray-500">
              {u.floorId?.floorName || `Floor ${u.floorId?.floorNumber}`}
            </p>
          </div>

          {/* STATUS */}
          <span
            className={`
              text-xs font-semibold px-3 py-1 rounded-full
              ${
                u.availabilityStatus === "Available"
                  ? "bg-green-50 text-green-700 ring-1 ring-green-200"
                  : u.availabilityStatus === "Occupied"
                  ? "bg-red-50 text-red-700 ring-1 ring-red-200"
                  : "bg-yellow-50 text-yellow-700 ring-1 ring-yellow-200"
              }
            `}
          >
            {u.availabilityStatus}
          </span>
        </div>

        {/* RENT */}
        <div className="pt-2">
          <p className="text-xs uppercase tracking-wide text-gray-400">
            Monthly Rent
          </p>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            ₹{u.rentAmount || 0}
            <span className="text-sm font-medium text-gray-500"> / month</span>
          </p>
        </div>
      </div>

      {/* ACTIONS */}
      <div
        className="
          px-5 py-4 border-t
          bg-gray-50
          flex items-center justify-end gap-3
        "
      >
        <button
          onClick={() => editUnit(u)}
          className="
            px-4 py-2 rounded-lg text-sm font-medium
            text-[#9c4a1a]
            border border-[#9c4a1a]/20
            hover:bg-[#9c4a1a]/10
            transition
          "
        >
          Edit
        </button>

        <button
          onClick={() => deleteUnit(u._id)}
          className="
            px-4 py-2 rounded-lg text-sm font-medium
            text-red-600
            border border-red-200
            hover:bg-red-50
            transition
          "
        >
          Delete
        </button>
      </div>
    </div>
  ))}
</div>


      {/* MODAL */}
      {open && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-4xl rounded-2xl shadow-xl overflow-hidden">
            <div className="px-6 py-4 border-b flex justify-between items-center">
              <h2 className="text-lg font-semibold">
                {isEdit ? "Edit Unit" : "Add Unit"}
              </h2>
              <button onClick={() => setOpen(false)} className="text-2xl">
                &times;
              </button>
            </div>

            <div className="p-6 space-y-8 max-h-[75vh] overflow-y-auto text-sm">
              {/* BASIC */}
              <section>
                <h3 className="font-semibold mb-4">Basic Details</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <input
                    className="input"
                    placeholder="Unit Number"
                    value={form.unitNumber}
                    onChange={(e) =>
                      setForm({ ...form, unitNumber: e.target.value })
                    }
                  />

                  <select
                    className="input"
                    value={form.unitType}
                    onChange={(e) =>
                      setForm({ ...form, unitType: e.target.value })
                    }
                  >
                    <option>Flat</option>
                    <option>Studio</option>
                    <option>Duplex</option>
                    <option>Penthouse</option>
                  </select>
                </div>
              </section>

              {/* AREA & ROOMS */}
              <section>
                <h3 className="font-semibold mb-4">Area & Rooms</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <input
                    className="input"
                    type="String"
                    placeholder="Built-up Area"
                    value={form.builtUpArea}
                    onChange={(e) =>
                      setForm({ ...form, builtUpArea: e.target.value })
                    }
                  />

                  <input
                    className="input"
                    type="String"
                    placeholder="Carpet Area"
                    value={form.carpetArea}
                    onChange={(e) =>
                      setForm({ ...form, carpetArea: e.target.value })
                    }
                  />

                  <input
                    className="input"
                    type="String"
                    placeholder="Bedrooms"
                    value={form.bedrooms}
                    onChange={(e) =>
                      setForm({ ...form, bedrooms: e.target.value })
                    }
                  />

                  <input
                    className="input"
                    type="String"
                    placeholder="Bathrooms"
                    value={form.bathrooms}
                    onChange={(e) =>
                      setForm({ ...form, bathrooms: e.target.value })
                    }
                  />

                  <input
                    className="input"
                    type="String"
                    placeholder="Balconies"
                    value={form.balconies}
                    onChange={(e) =>
                      setForm({ ...form, balconies: e.target.value })
                    }
                  />
                </div>
              </section>

              {/* RENT */}
              <section>
                <h3 className="font-semibold mb-4">Rent & Charges</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <input
                    className="input"
                    type="number"
                    placeholder="Rent Amount"
                    value={form.rentAmount}
                    onChange={(e) =>
                      setForm({ ...form, rentAmount: e.target.value })
                    }
                  />

                  <input
                    className="input"
                    type="number"
                    placeholder="Security Deposit"
                    value={form.securityDeposit}
                    onChange={(e) =>
                      setForm({ ...form, securityDeposit: e.target.value })
                    }
                  />

                  <input
                    className="input"
                    type="number"
                    placeholder="Maintenance Charge"
                    value={form.maintenanceCharge}
                    onChange={(e) =>
                      setForm({ ...form, maintenanceCharge: e.target.value })
                    }
                  />
                </div>
              </section>

              {/* STATUS */}
              <section>
                <h3 className="font-semibold mb-4">Status & Options</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <select
                    className="input"
                    value={form.availabilityStatus}
                    onChange={(e) =>
                      setForm({ ...form, availabilityStatus: e.target.value })
                    }
                  >
                    <option>Available</option>
                    <option>Occupied</option>
                    <option>Reserved</option>
                  </select>

                  <select
                    className="input"
                    value={form.furnishingStatus}
                    onChange={(e) =>
                      setForm({ ...form, furnishingStatus: e.target.value })
                    }
                  >
                    <option>Unfurnished</option>
                    <option>Semi-Furnished</option>
                    <option>Fully-Furnished</option>
                  </select>

                  <div className="flex items-center gap-3 sm:col-span-2">
                    <input
                      type="checkbox"
                      checked={form.parkingAvailable}
                      onChange={(e) =>
                        setForm({ ...form, parkingAvailable: e.target.checked })
                      }
                    />
                    <label>Parking Available</label>
                  </div>
                </div>
              </section>
            </div>

            <div className="px-6 py-4 border-t flex justify-end">
              <button
                onClick={saveUnit}
                className="bg-green-600 text-white px-6 py-2 rounded"
              >
                {isEdit ? "Update Unit" : "Save Unit"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Units;
