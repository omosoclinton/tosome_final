import React from "react";
import Navbar from "../components/Navbarr";
import Dashboard from "./Dashboard";

function Home () {
    return (
        <>
            <Navbar/>
            <div className="container mt-5">
                <Dashboard/>
            </div>
        </>
    )
}

export default Home