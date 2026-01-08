import React, { useState } from "react";
import { Link } from "react-scroll";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeItem, setActiveItem] = useState("home");

  const handleClick = (item) => {
    setActiveItem(item);
    setIsMenuOpen(false);
  };

  const menuItems = [
    { label: "Home", to: "home" },
    { label: "Analytics", to: "analytics" },
    { label: "View Properties", to: "viewpropertys" },
  ];

  return (
    <nav className="fixed top-0 left-0 w-full bg-[#e5e7eb] shadow-sm z-0 h-16">
      <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">

        {/* Logo + Brand */}
        <div className="flex items-center gap-2">
          {/* <img
            src="/sups-hbn.png"
            alt="logo"
            className="h-10 md:h-12 object-contain"
            onError={(e) => (e.target.src = "https://via.placeholder.com/120")}
          /> */}
          <span className="text-lg md:text-xl font-semibold text-gray-800">
            PropertyVision
          </span>
        </div>

        {/* Desktop Menu */}
        <ul className="hidden md:flex space-x-6">
          {menuItems.map((item) => (
            <li key={item.to}>
              <Link
                to={item.to}
                smooth
                duration={500}
                offset={-64}   // ✅ EXACT navbar height
                onClick={() => handleClick(item.to)}
                className={`cursor-pointer text-sm font-medium transition ${
                  activeItem === item.to
                    ? "text-blue-600"
                    : "text-gray-700 hover:text-blue-600"
                }`}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 rounded hover:bg-gray-200"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor">
            {isMenuOpen ? (
              <path strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t shadow">
          {menuItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              smooth
              duration={500}
              offset={-64}   // ✅ EXACT navbar height
              onClick={() => handleClick(item.to)}
              className={`block px-5 py-3 text-sm ${
                activeItem === item.to
                  ? "text-blue-600 bg-gray-50"
                  : "text-gray-700"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
