import React from "react";
import useProfileData from "./hooks/useProfileData";

const WelcomeSection = () => {
    const{user,profile} = useProfileData()

    return (
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            {user 
            ? (
                <>
                    <h1 className="text-2xl font-bold text-gray-700">Welcome, {user.first_name}!</h1>
                    <p className="text-gray-600 mt-2">Email: {user.email}</p>
                    {/* Add more profile info if needed */}
                </>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    )
}

export default WelcomeSection