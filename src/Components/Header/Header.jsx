import React, { useState } from "react";
import logo from "../../assets/logo2.png"; // Ensure correct asset path

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-white shadow-md fixed top-0 left-0 w-full z-50">
      <div className="container mx-auto px-4 py-2 flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center">
          <img
            onClick={() => (window.location.href = "/")}
            src={logo}
            alt="HackVerse Logo"
              className="h-16 w-46 sm:h-14 md:h-16 ml-6"
          />
          <span
            onClick={() => (window.location.href = "/")}
            className="ml-2 font-black text-3xl bg-gradient-to-r from-[#000000] via-[#314481] to-[#1e29c4] text-transparent bg-clip-text tracking-wide"
          >
            
          </span>
        </div>

        {/* Desktop and Tablet Navigation */}
        <nav className="hidden lg:flex space-x-6 mr-25">
  <a href="/" className="relative text-black hover:text-[#3646F5] pb-1 after:block after:content-[''] after:absolute after:w-0 after:h-[2px] after:bg-[#3646F5] after:transition-all after:duration-300 after:left-0 after:bottom-0 hover:after:w-full">
    Home
  </a>
  <a href="/AboutUs" className="relative text-black hover:text-[#3646F5] pb-1 after:block after:content-[''] after:absolute after:w-0 after:h-[2px] after:bg-[#3646F5] after:transition-all after:duration-300 after:left-0 after:bottom-0 hover:after:w-full">
    About Us
  </a>
  
  <a href="/ContactUs" className="relative text-black hover:text-[#3646F5] pb-1 after:block after:content-[''] after:absolute after:w-0 after:h-[2px] after:bg-[#3646F5] after:transition-all after:duration-300 after:left-0 after:bottom-0 hover:after:w-full">
    Contact Us
  </a>
</nav>




        {/* Login Button */}
        <div className="hidden lg:block">
          <button className="border border-black px-4 py-2 rounded-md hover:bg-black hover:text-white">
            Login
          </button>
        </div>

        {/* Mobile Menu Button */}
        <div className="lg:hidden">
          <button onClick={toggleMenu} className="text-black">
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
            onClick={toggleMenu}
            className="text-black hover:text-red-600"
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
          <a
            href="/"
            className="text-black hover:text-[#3646F5] border border-black px-4 py-2"
          >
            Home
          </a>
          <a
            href="/AboutUs"
            className="text-black hover:text-[#3646F5] border border-black px-4 py-2"
          >
            About Us
          </a>
         
          
          <a
            href="/ContactUs"
            className="text-black hover:text-[#3646F5] border border-black px-4 py-2"
          >
            Contact Us
          </a>
          <button className="border border-black px-4 py-2 rounded-md hover:bg-black hover:text-white">
            Login
          </button>
        </div>
      </nav>
    </header>
  );
};

export default Header;
