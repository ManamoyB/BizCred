import React, { useState } from "react";

const CustomerGContain = () => {
  const [submitted, setSubmitted] = useState(false);
  const [ticketId, setTicketId] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    businessName: "",
    applicationId: "",
    grievanceType: "Credit Score Discrepancy",
    description: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const id = "GRV-" + Math.floor(100000 + Math.random() * 900000);
    setTicketId(id);
    setSubmitted(true);
  };

  return (
    <div className="mt-20 max-w-4xl mx-auto p-6">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-blue-900 mb-2">Consumer Grievance Redressal</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          We are committed to fair credit evaluation and transparency. If you believe your business credit evaluation or alternative metrics contain discrepancies, submit your grievance below.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8">
        {submitted ? (
          <div className="text-center py-10">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
              ✓
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Grievance Registered Successfully</h2>
            <p className="text-gray-600 mb-4">
              Your ticket reference number is: <span className="font-mono font-bold text-blue-600">{ticketId}</span>
            </p>
            <p className="text-sm text-gray-500 max-w-md mx-auto mb-6">
              Our Credit Grievance Redressal Officer will review your submission and contact you within 48 business hours at <span className="font-medium">{formData.email}</span>.
            </p>
            <button
              type="button"
              onClick={() => {
                setSubmitted(false);
                setFormData({
                  name: "",
                  email: "",
                  phone: "",
                  businessName: "",
                  applicationId: "",
                  grievanceType: "Credit Score Discrepancy",
                  description: "",
                });
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2.5 rounded-lg transition-colors cursor-pointer"
            >
              Submit Another Grievance
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Applicant / Representative Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="Full Name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Registered Business Name
                </label>
                <input
                  type="text"
                  name="businessName"
                  value={formData.businessName}
                  onChange={handleChange}
                  required
                  className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="Enterprise Pvt Ltd"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="contact@business.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="+91 98765 43210"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Evaluation / Application ID (Optional)
                </label>
                <input
                  type="text"
                  name="applicationId"
                  value={formData.applicationId}
                  onChange={handleChange}
                  className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="e.g. BIZ-2026-891"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nature of Grievance
                </label>
                <select
                  name="grievanceType"
                  value={formData.grievanceType}
                  onChange={handleChange}
                  className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
                >
                  <option value="Credit Score Discrepancy">Credit Score Discrepancy</option>
                  <option value="GST / Tax Data Mismatch">GST / Tax Data Mismatch</option>
                  <option value="Incorrect Loan Default Record">Incorrect Loan Default Record</option>
                  <option value="Bank Transaction Verification">Bank Transaction Verification</option>
                  <option value="Other Inquiries">Other Inquiries</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Detailed Description of the Issue
              </label>
              <textarea
                name="description"
                rows="4"
                value={formData.description}
                onChange={handleChange}
                required
                placeholder="Explain the discrepancy and provide any supporting details or reference documents..."
                className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              ></textarea>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors cursor-pointer"
              >
                Submit Grievance
              </button>
            </div>
          </form>
        )}
      </div>

      <div className="mt-8 text-sm text-gray-500 text-center">
        Principal Nodal Officer: grievance@bizcred.internal | Grievance Redressal Turnaround: 48-72 Business Hours
      </div>
    </div>
  );
};

export default CustomerGContain;
