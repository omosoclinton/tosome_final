import React from "react";
import Navbar from "../components/Navbarr";
import UserProfile from "../components/UserProfile";



function ProfilePage () {
    return (
        <>
            <Navbar/>
            <div>
                <UserProfile/>
            </div>
        </>
    )
}

export default ProfilePage