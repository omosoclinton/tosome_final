import LoadingIndicator from "../LoadingIndicator";
import { useState } from "react";
const PageTwo = ({ formData, handleChange, prevStep, handleSubmit, setLoading, loading }) => {
    //const [loading, setLoading] = useState(false)

    return (
        <div className="max-w-4xl mx-auto py-12 px-4" style={{ margin: "10px" }}>
            {/* Tutor Application Form */}
            <form onSubmit={handleSubmit} className="bg-white shadow-md p-6 rounded-lg">
                <div>
                    <label className="text-gray-800 text-sm mb-2 block">Username</label>
                    <input
                        name="username"
                        type="text"
                        value={formData.username}
                        onChange={handleChange}
                        className="text-gray-800 bg-white border border-gray-300 w-full text-sm px-4 py-3 rounded-md outline-blue-500"
                        placeholder="Enter your username"
                    />
                </div>

                <div>
                    <label className="text-gray-800 text-sm mb-2 block">Email</label>
                    <input
                        name="email"
                        type="text"
                        value={formData.email}
                        onChange={handleChange}
                        className="text-gray-800 bg-white border border-gray-300 w-full text-sm px-4 py-3 rounded-md outline-blue-500"
                        placeholder="Enter email"
                    />
                </div>

                <div>
                    <label className="text-gray-800 text-sm mb-2 block">Password</label>
                    <input
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="text-gray-800 bg-white border border-gray-300 w-full text-sm px-4 py-3 rounded-md outline-blue-500"
                        placeholder="Enter password"
                    />
                </div>

                <div>
                    <label className="text-gray-800 text-sm mb-2 block">Confirm Password</label>
                    <input
                        name="password2"
                        type="password"
                        value={formData.password2}
                        onChange={handleChange}
                        className="text-gray-800 bg-white border border-gray-300 w-full text-sm px-4 py-3 rounded-md outline-blue-500"
                        placeholder="Enter password again"
                    />
                </div>


                
                <button type="button" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600" onClick={prevStep}>Back</button>
                {/* {loading && <LoadingIndicator />} */}
                <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    Submit Application
                </button>
            </form>
        </div>
    )
}

export default PageTwo;