import React, { useState } from 'react';
import Footer from "../Components/Footer/Fotter";
import Header from "../Components/Header/Header";

const ContactUs = () => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#0f1632] relative overflow-hidden flex flex-col mt-12">
      {/* Starry Background */}
      <div className="absolute inset-0 z-0">
        {Array.from({ length: 300 }).map((_, index) => (
          <div
            key={index}
            className="absolute bg-white rounded-full animate-twinkle"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 2 + 1}px`, // 1px - 3px
              height: `${Math.random() * 2 + 1}px`,
              opacity: Math.random() * 0.8 + 0.2, // Brightness variation
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 3}s`, // Twinkle effect
            }}
          ></div>
        ))}
      </div>

      {/* Page Content */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <Header />
        <div className="flex-grow flex items-center justify-center p-4">
          <div className="bg-white/10 backdrop-blur-lg p-6 md:p-8 rounded-lg shadow-2xl w-full max-w-sm md:max-w-md border border-white/20 mt-20 mb-20 lg:ml-[110px]">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center text-white">
              Contact Us
            </h2>
            {submitted ? (
              <div className="text-center py-6 text-white space-y-4">
                <div className="w-12 h-12 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mx-auto text-2xl font-bold border border-green-500/40">
                  ✓
                </div>
                <h3 className="text-xl font-bold">Message Sent!</h3>
                <p className="text-sm text-white/80">
                  Thank you for reaching out, {formData.name}. Our fintech advisory team will get back to you at {formData.email}.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({ name: '', email: '', message: '' });
                  }}
                  className="mt-4 bg-white/20 hover:bg-white/30 text-white font-medium py-2 px-4 rounded transition-colors text-sm cursor-pointer"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label
                    className="block text-white text-sm font-bold mb-2"
                    htmlFor="name"
                  >
                    Name
                  </label>
                  <input
                    className="w-full px-3 py-2 rounded bg-transparent text-white border border-white/20 placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your Name"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label
                    className="block text-white text-sm font-bold mb-2"
                    htmlFor="email"
                  >
                    Email
                  </label>
                  <input
                    className="w-full px-3 py-2 rounded bg-transparent text-white border border-white/20 placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Your Email"
                    required
                  />
                </div>
                <div className="mb-6">
                  <label
                    className="block text-white text-sm font-bold mb-2"
                    htmlFor="message"
                  >
                    Message
                  </label>
                  <textarea
                    className="w-full px-3 py-2 rounded bg-transparent text-white border border-white/20 placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Your Message"
                    rows="4"
                    required
                  ></textarea>
                </div>
                <div className="flex justify-center">
                  <button
                    className="bg-green-600 hover:bg-green-800 text-white font-bold py-2 px-4 rounded transition-all duration-300 w-full cursor-pointer"
                    type="submit"
                  >
                    Send Message
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
        <Footer />
      </div>

      {/* Keyframe Animations */}
      <style>
        {`
          @keyframes twinkle {
            0%, 100% { opacity: 0.3; }
            50% { opacity: 1; }
          }
          .animate-twinkle {
            animation: twinkle 3s infinite alternate;
          }
        `}
      </style>
    </div>
  );
};

export default ContactUs;
