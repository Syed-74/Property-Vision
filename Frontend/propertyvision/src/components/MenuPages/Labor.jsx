import React, { useEffect, useState } from "react";
import axios from "axios";

const API = "http://localhost:5000/api/labors";

const emptyLabor = {
  fullName: "",
  mobileNumber: "",
  alternateNumber: "",
  gender: "Male",
  age: "",
  address: "",
  city: "",
  idProofType: "Aadhaar",
  idProofNumber: "",
};

export default function Labor() {
  const [labors, setLabors] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showView, setShowView] = useState(false);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState(emptyLabor);

  useEffect(() => { fetchLabors(); }, []);

  const fetchLabors = async () => {
    const res = await axios.get(API);
    setLabors(res.data.data || res.data);
  };

  const openCreate = () => {
    setForm(emptyLabor);
    setSelected(null);
    setShowForm(true);
  };

  const openEdit = (l) => {
    setForm(l);
    setSelected(l);
    setShowForm(true);
  };

  const submitForm = async (e) => {
    e.preventDefault();
    selected
      ? await axios.put(`${API}/${selected._id}`, form)
      : await axios.post(API, form);
    setShowForm(false);
    fetchLabors();
  };

  const deleteLabor = async (id) => {
    if (confirm("Delete labor?")) {
      await axios.delete(`${API}/${id}`);
      fetchLabors();
    }
  };

  const input = "border rounded px-3 py-2 w-full focus:ring-2 focus:ring-orange-500 outline-none";

  return (
    <div className="p-4 max-w-7xl mx-auto">

      {/* HEADER */}
      <div className="flex flex-wrap justify-between items-center mb-6 gap-3">
        <h2 className="text-2xl font-semibold">Labor Management</h2>
        <button
          onClick={openCreate}
          className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded shadow"
        >
          + Register Labor
        </button>
      </div>

      {/* CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {labors.map(l => (
          <div key={l._id} className="bg-white rounded-xl shadow hover:shadow-xl transition p-4">

            <div className="flex justify-between items-center mb-2">
              <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded">
                Active
              </span>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="h-20 w-20 rounded-full bg-orange-100 flex items-center justify-center text-3xl mb-2">
                👷
              </div>
              <h3 className="font-semibold">{l.fullName}</h3>
              <p className="text-sm text-gray-500">{l.city}</p>
            </div>

            <div className="text-sm mt-3 space-y-1 text-gray-700">
              <p>📞 {l.mobileNumber}</p>
              <p>🎂 {l.age} years</p>
              <p>🆔 {l.idProofType}</p>
            </div>

            <div className="flex justify-between mt-4 text-sm">
              <button onClick={() => openEdit(l)} className="text-blue-600 hover:underline">Edit</button>
              <button onClick={() => { setSelected(l); setShowView(true); }} className="text-green-600 hover:underline">View</button>
              <button onClick={() => deleteLabor(l._id)} className="text-red-600 hover:underline">Delete</button>
            </div>
          </div>
        ))}
      </div>

      {/* ADD / EDIT MODAL */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-3 z-50 overflow-y-auto">
          <form
            onSubmit={submitForm}
            className="bg-white rounded-xl p-5 max-w-2xl w-full grid grid-cols-1 sm:grid-cols-2 gap-3"
          >
            <h3 className="col-span-full text-xl font-semibold mb-2">
              {selected ? "Edit Labor" : "Register Labor"}
            </h3>

            <input className={input} placeholder="Full Name" value={form.fullName}
              onChange={e => setForm({...form, fullName: e.target.value})} required />

            <input className={input} placeholder="Mobile Number" value={form.mobileNumber}
              onChange={e => setForm({...form, mobileNumber: e.target.value})} required />

            <input className={input} placeholder="Alternate Number" value={form.alternateNumber}
              onChange={e => setForm({...form, alternateNumber: e.target.value})} />

            <input type="number" className={input} placeholder="Age" value={form.age}
              onChange={e => setForm({...form, age: e.target.value})} required />

            <select className={input} value={form.gender}
              onChange={e => setForm({...form, gender: e.target.value})}>
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>

            <input className={input} placeholder="City" value={form.city}
              onChange={e => setForm({...form, city: e.target.value})} required />

            <textarea className={input + " sm:col-span-2"} placeholder="Full Address"
              value={form.address}
              onChange={e => setForm({...form, address: e.target.value})} required />

            <select className={input} value={form.idProofType}
              onChange={e => setForm({...form, idProofType: e.target.value})}>
              <option>Aadhaar</option>
              <option>Voter ID</option>
              <option>Driving License</option>
            </select>

            <input className={input} placeholder="ID Proof Number" value={form.idProofNumber}
              onChange={e => setForm({...form, idProofNumber: e.target.value})} required />

            <div className="col-span-full flex justify-end gap-3 mt-3">
              <button type="button" onClick={() => setShowForm(false)}>Cancel</button>
              <button className="bg-orange-600 text-white px-5 py-2 rounded">
                Save
              </button>
            </div>
          </form>
        </div>
      )}

      {/* VIEW MODAL */}
      {showView && selected && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full space-y-2">
            <h3 className="text-xl font-semibold">{selected.fullName}</h3>
            <p>📞 {selected.mobileNumber}</p>
            <p>📍 {selected.address}, {selected.city}</p>
            <p>🎂 Age: {selected.age}</p>
            <p>🆔 {selected.idProofType}: {selected.idProofNumber}</p>

            <button
              className="w-full mt-3 bg-orange-600 text-white py-2 rounded"
              onClick={() => setShowView(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
