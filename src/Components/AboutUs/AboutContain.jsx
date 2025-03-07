import React from "react";
import aboutpng from "../../assets/aboutus.png";

const AboutUsContain = () => {
  return (
    <div className="mt-20 p-4 sm:p-6 bg-gray-100 rounded-lg shadow-lg">
      <h1 className="text-2xl sm:text-3xl font-bold text-blue-600 text-center mb-4">
        About Us
      </h1>
      <p className="text-base sm:text-lg text-gray-700 text-center">
        Credit is the trust that allows individuals and businesses to borrow money
        with the promise to repay it later. Lenders assess a borrower's
        creditworthiness using credit scores, financial history, and repayment
        patterns. A high credit score means lower borrowing risk, while a low
        score can result in higher interest rates or loan rejections.
      </p>
      
      <div className="flex flex-col md:flex-row items-center justify-between px-4 sm:px-6 py-6 sm:py-10">
        {/* Left Side Content */}
        <div className="md:w-1/2 space-y-4 sm:space-y-6 text-center md:text-left">
          <h2 className="text-xl sm:text-2xl font-semibold text-blue-500 mt-4 md:mt-0">
            Key Factors Affecting Credit Scores:
          </h2>
          <ul className="text-base sm:text-lg list-disc list-inside text-gray-800 text-left mx-auto max-w-sm sm:max-w-lg">
            <li><strong>Payment History:</strong> On-time payments improve scores, while defaults lower them.</li>
            <li><strong>Credit Utilization:</strong> Using too much of your available credit can be risky.</li>
            <li><strong>Length of Credit History:</strong> Older credit accounts contribute to better scores.</li>
            <li><strong>Types of Credit:</strong> A mix of credit cards, loans, and mortgages can help.</li>
            <li><strong>New Credit Inquiries:</strong> Frequent loan applications may lower your score.</li>
          </ul>
        </div>
        
        {/* Right Side Image */}
        <div className="w-full md:w-1/2 flex justify-center mt-6 md:mt-0">
          <img
            src={aboutpng}
            alt="Tech Illustration"
            className="w-60 sm:w-72 md:w-full max-w-xs sm:max-w-sm md:max-w-md h-auto"
          />
        </div>
      </div>
      
      {/* FAQ Section */}
      <div className="mt-20 sm:mt-10 text-left max-w-3xl mx-auto px-4 sm:px-0">
        <h2 className=" mt-10 text-xl sm:text-2xl font-semibold text-blue-500 mb-4">Frequently Asked Questions (FAQ)</h2>
        <div className="space-y-4">
          {[  
            { q: "What is a credit score?", a: "A credit score is a three-digit number (typically 300-900) that represents your creditworthiness. Banks and financial institutions use it to decide whether to approve loans and credit cards." },
            { q: "How can I improve my credit score?", a: "Pay bills on time, reduce debt, avoid excessive credit applications, and maintain a balanced credit mix." },
            { q: "How do banks decide loan approvals?", a: "Banks consider your credit score, income stability, existing loans, and financial behavior before approving a loan." },
            { q: "What happens if I default on a loan?", a: "Defaults negatively impact your credit score, making it harder to get future loans and leading to legal action in severe cases." }
          ].map((faq, index) => (
            <div key={index}>
              <h3 className="text-base sm:text-lg font-semibold text-gray-800">{index + 1}. {faq.q}</h3>
              <p className="text-gray-700">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AboutUsContain;
