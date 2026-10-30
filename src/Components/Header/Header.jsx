import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/logo2.png";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navLinkStyle = "relative text-black hover:text-[#3646F5] pb-1 after:block after:content-[''] after:absolute after:w-0 after:h-[2px] after:bg-[#3646F5] after:transition-all after:duration-300 after:left-0 after:bottom-0 hover:after:w-full";

  return (
    <header className="bg-white shadow-md fixed top-0 left-0 w-full z-50">
      <div className="container mx-auto px-4 py-2 flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center cursor-pointer" onClick={() => navigate("/")}>
          <img
            src={logo}
            alt="BizCred Logo"
            className="h-16 w-auto sm:h-14 md:h-16 ml-4"
          />
        </div>

        {/* Desktop and Tablet Navigation */}
        <nav className="hidden lg:flex space-x-6 mr-6 items-center">
          <Link to="/" className={navLinkStyle}>
            Home
          </Link>
          <Link to="/AboutUs" className={navLinkStyle}>
            About Us
          </Link>
          <Link to="/Consumer_Grievance" className={navLinkStyle}>
            Consumer Grievance
          </Link>
          <Link to="/ContactUs" className={navLinkStyle}>
            Contact Us
          </Link>
        </nav>

        {/* Login Button */}
        <div className="hidden lg:block">
          <button 
            type="button"
            onClick={() => setShowLoginModal(true)}
            className="border border-black px-4 py-2 rounded-md hover:bg-black hover:text-white transition-colors cursor-pointer"
          >
            Login
          </button>
        </div>

        {/* Mobile Menu Button */}
        <div className="lg:hidden">
          <button type="button" onClick={toggleMenu} className="text-black p-2 cursor-pointer" aria-label="Toggle Navigation">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 6h18M3 12h18m-9 6h9"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <nav
        className={`${
          isMenuOpen ? "flex" : "hidden"
        } bg-white lg:hidden absolute top-0 left-0 w-full z-10 shadow-lg flex-col items-center`}
      >
        {/* Close Button */}
        <div className="w-full flex justify-end p-4">
          <button
            type="button"
            onClick={toggleMenu}
            className="text-black hover:text-red-600 p-2 cursor-pointer"
            aria-label="Close Navigation"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="flex flex-col space-y-4 p-4 w-full text-center">
          <Link
            to="/"
            onClick={() => setIsMenuOpen(false)}
            className="text-black hover:text-[#3646F5] border border-black px-4 py-2"
          >
            Home
          </Link>
          <Link
            to="/AboutUs"
            onClick={() => setIsMenuOpen(false)}
            className="text-black hover:text-[#3646F5] border border-black px-4 py-2"
          >
            About Us
          </Link>
          <Link
            to="/Consumer_Grievance"
            onClick={() => setIsMenuOpen(false)}
            className="text-black hover:text-[#3646F5] border border-black px-4 py-2"
          >
            Consumer Grievance
          </Link>
          <Link
            to="/ContactUs"
            onClick={() => setIsMenuOpen(false)}
            className="text-black hover:text-[#3646F5] border border-black px-4 py-2"
          >
            Contact Us
          </Link>
          <button 
            type="button"
            onClick={() => {
              setIsMenuOpen(false);
              setShowLoginModal(true);
            }}
            className="border border-black px-4 py-2 rounded-md hover:bg-black hover:text-white"
          >
            Login
          </button>
        </div>
      </nav>

      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full shadow-2xl relative">
            <h3 className="text-xl font-bold mb-4 text-gray-900">Member Login</h3>
            <p className="text-sm text-gray-600 mb-4">
              Enter your corporate credentials to access your lender dashboard and underwriting history.
            </p>
            <form onSubmit={(e) => { e.preventDefault(); setShowLoginModal(false); }}>
              <input
                type="email"
                placeholder="Corporate Email"
                className="w-full p-2 border rounded mb-3 text-sm"
                required
              />
              <input
                type="password"
                placeholder="Password"
                className="w-full p-2 border rounded mb-4 text-sm"
                required
              />
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowLoginModal(false)}
                  className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 font-medium"
                >
                  Sign In
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
