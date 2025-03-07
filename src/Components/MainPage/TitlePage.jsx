import React from "react";
import landing from "../../assets/landing.jpg";
import logo from "../../assets/logo2.png";

const TitlePage = () => {
  return (
    <div className="flex flex-col md:flex-row items-center justify-between px-6 md:px-10 py-10 md:py-20 bg-white">
      {/* Left Side Content */}
      <div className="md:w-1/2 space-y-6 text-center md:text-left">
        <img
          src={logo}
          alt="Tech Illustration"
          className="w-full h-full max-w-lg md:mx-0"
        />
        
        <p className="0 text-gray-600 text-lg text-left md:text-lg leading-relaxed  mx-auto md:mx-0">
          BizCredIQ empowers businesses with AI-driven credit intelligence, bridging the gap between emerging enterprises and financial opportunities. Whether you're a lender seeking smarter risk assessment or a growing business looking for fair credit evaluation, our platform provides data-driven insights, seamless integration, and a supportive ecosystem to fuel financial growth.
        </p>
        
        {/* Buttons */}
        <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-6">
        <button
  className="border border-blue-500 hover:bg-blue-500 hover:text-white text-blue-500 px-5 py-2 md:px-6 md:py-3 rounded-lg font-semibold"
  onClick={() => window.location.href = "https://9bf1008600e42c7b94.gradio.live/"}
>
  Report And Analysis
</button>

        </div>
      </div>
      
      {/* Right Side Image */}
      <div className="hidden md:flex md:w-1/2 justify-center mt-8 md:mt-0">
        <img
          src={landing}
          alt="Tech Illustration"
          className="w-72 h-auto md:w-full max-w-sm md:max-w-full"
        />
      </div>
    </div>
  );
};

export default TitlePage;