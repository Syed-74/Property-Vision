import React from "react";

/* ------------------ PROPERTY DATA ------------------ */

const properties = [
  {
    id: 1,
    title: "Meridian Luxury Complex",
    type: "Residential",
    occupancy: "98% Occupied",
    description: "Premium residential complex with 156 units",
    revenue: "$2.4M",
    image: "/resources/property-1.jpg",
    badgeColor: "bg-green-600",
  },
  {
    id: 2,
    title: "TechHub Office Park",
    type: "Commercial",
    occupancy: "92% Occupied",
    description: "Modern office complex with 89 units",
    revenue: "$1.8M",
    image: "/resources/property-2.jpg",
    badgeColor: "bg-blue-600",
  },
  {
    id: 3,
    title: "Central Plaza",
    type: "Mixed-Use",
    occupancy: "96% Occupied",
    description: "Mixed-use development with 124 units",
    revenue: "$3.1M",
    image: "/resources/property-3.jpg",
    badgeColor: "bg-purple-600",
  },
];

/* ------------------ COMPONENT ------------------ */

const ViewPropertys = () => {
  return (
    <section
      id="portfolio"
      className="bg-gray-50 py-10 sm:py-14 lg:py-20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        {/* HEADER */}
        <div className="text-center mb-10 sm:mb-14">
          <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3">
            Property <span className="text-blue-600">Portfolio</span>
          </h3>
          <p className="text-sm sm:text-base lg:text-lg text-gray-600 max-w-2xl mx-auto">
            Comprehensive overview of your real estate investments
          </p>
        </div>

        {/* PROPERTY GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {properties.map((property) => (
            <div
              key={property.id}
              className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition"
            >
              {/* IMAGE */}
              <img
                src={property.image}
                alt={property.title}
                className="w-full h-44 sm:h-48 object-cover"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = "/fallback-property.jpg";
                }}
              />

              {/* CONTENT */}
              <div className="p-4 sm:p-6">
                <div className="flex items-center justify-between mb-3">
                  <span
                    className={`${property.badgeColor} text-white px-3 py-1 rounded-full text-xs sm:text-sm`}
                  >
                    {property.type}
                  </span>
                  <span className="text-xs sm:text-sm text-green-600 font-medium">
                    {property.occupancy}
                  </span>
                </div>

                <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                  {property.title}
                </h4>

                <p className="text-sm text-gray-600 mb-4">
                  {property.description}
                </p>

                <div className="flex items-center justify-between">
                  <span className="text-lg sm:text-xl font-bold text-gray-900">
                    {property.revenue}
                  </span>
                  <span className="text-xs sm:text-sm text-gray-500">
                    Monthly Revenue
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* VIEW ALL BUTTON */}
        <div className="text-center mt-8 sm:mt-12">
          <button className="bg-blue-600 text-white px-6 sm:px-8 py-3 rounded-lg text-sm sm:text-base font-medium hover:bg-blue-700 transition">
            View All Properties
          </button>
        </div>
      </div>
    </section>
  );
};

export default ViewPropertys;
