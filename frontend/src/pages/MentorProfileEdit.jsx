import React, { useState, useEffect } from 'react';

const MentorProfileEdit = () => {
  const token = localStorage.getItem("token");

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    expertise: "",
    experience: "",
    domain: "",
    linkedin: "",
    github: "",
    whyMentor: "",
  });

  // Fetch user profile to pre-fill form (optional)
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const res = await fetch("/api/users/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error(`Failed to fetch profile: ${res.status}`);
        const data = await res.json();
        setFormData(data);
      } catch (error) {
        console.error("Error loading profile:", error);
      }
    };

    fetchUserProfile();
  }, [token]);

  // Handle form field change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Handle form submission with better error handling
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/users/update-profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      // ✅ Inspect raw response
      console.log("Full Response Object:", response);

      if (!response.ok) {
        const errorText = await response.text(); // get raw HTML/text if error
        throw new Error(`HTTP error! Status: ${response.status}\nBody: ${errorText}`);
      }

      const data = await response.json();
      console.log("Profile updated successfully:", data);
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Server Error:", error);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10">
      <h2 className="text-xl font-bold mb-4">Edit Mentor Profile</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {["fullName", "email", "expertise", "experience", "domain", "linkedin", "github", "whyMentor"].map((field) => (
          <div key={field}>
            <label className="block mb-1 capitalize">{field}</label>
            <input
              type="text"
              name={field}
              value={formData[field]}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
        ))}
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default MentorProfileEdit;
