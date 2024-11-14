import React from "react";

const PageOne = ({ formData, handleChange, nextStep }) => {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4" style={{ margin: "10px" }}>
      {/* Why Become a Tutor Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Become a Tutor</h1>
        <p className="text-gray-700 mb-4">
          Join our platform to help students succeed and grow your tutoring business. As a tutor, you can:
        </p>
        <ul className="list-disc list-inside text-gray-600">
          <li>Set your own rates and schedule.</li>
          <li>Teach subjects you're passionate about.</li>
          <li>Connect with students from around the world.</li>
        </ul>
      </div>

      {/* Tutor Application Form */}
      <form className="bg-white shadow-md p-6 rounded-lg">
        <div className="mb-4">
          <label htmlFor="first_name" className="block text-gray-700 font-bold mb-2">First Name</label>
          <input
            type="text"
            id="first_name"
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
            className="border p-2 w-full rounded"
            placeholder="Enter your first name"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="last_name" className="block text-gray-700 font-bold mb-2">Last Name</label>
          <input
            type="text"
            id="last_name"
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
            className="border p-2 w-full rounded"
            placeholder="Enter your last name"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="subjects" className="block text-gray-700 font-bold mb-2">Subject</label>
          <select
            id="subjects"
            name="subjects"
            value={formData.subjects}
            onChange={handleChange}
            className="border p-2 w-full rounded"
          >
            <option value="">Select a subject</option>
            <option value="Math">Math</option>
            <option value="English">English</option>
            <option value="Kiswahili">Kiswahili</option>
            <option value="Chemistry">Chemistry</option>
            <option value="Physics">Physics</option>
            <option value="Geography">Geography</option>
            <option value="History">History</option>
            {/* Add more subjects */}
          </select>
        </div>
        <div className="mb-4">
          <label htmlFor="qualifications" className="block text-gray-700 font-bold mb-2">Qualifications</label>
          <input
            type="text"
            id="qualifications"
            name="qualifications"
            value={formData.qualifications}
            onChange={handleChange}
            className="border p-2 w-full rounded"
            placeholder="List your qualifications"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="experience" className="block text-gray-700 font-bold mb-2">Experience</label>
          <input
            type="textarea"
            id="experience"
            name="experience"
            value={formData.experience}
            onChange={handleChange}
            className="border p-2 w-full rounded"
            placeholder="Briefly describe your experience"
          />
        </div>

        <button type="button" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600" onClick={nextStep}>
          Next
        </button>
      </form>
    </div>
  )
}

export default PageOne