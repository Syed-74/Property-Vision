import React, { useState } from "react";
import Login from "../AuthAdmin-Folder/Login";

const Home = () => {
  const [openLogin, setOpenLogin] = useState(false);

  return (
    <>
      <section className="bg-[#fafafa] pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* LEFT CONTENT */}
          <div className="space-y-6">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
              Manage Your Properties <br />
              <span className="text-blue-600">
                Smarter with PropertyVision
              </span>
            </h1>

            <p className="text-gray-600 text-base sm:text-lg max-w-xl leading-relaxed">
              PropertyVision helps you manage properties, track analytics, and
              access your dashboard seamlessly — all in one powerful platform
              designed for modern property owners and administrators.
            </p>

            {/* BUTTON */}
            <div className="flex flex-wrap gap-4 pt-4">
              <button
                onClick={() => setOpenLogin(true)}
                className="px-6 py-3 bg-[#9c4a1a] text-white rounded-md text-sm font-medium hover:bg-[#7f3c14] transition"
              >
                Access Dashboard
              </button>
            </div>
          </div>

          {/* RIGHT IMAGE */}
          <div className="flex justify-center lg:justify-end">
            <img
              src="/property-building.jpg"
              alt="Property Building"
              className="w-full max-w-xl rounded-xl shadow-lg object-cover"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src =
                  "https://images.unsplash.com/photo-1501183638710-841dd1904471";
              }}
            />
          </div>
        </div>
      </section>

      {/* LOGIN MODAL */}
      {openLogin && <Login onClose={() => setOpenLogin(false)} />}
    </>
  );
};

export default Home;
