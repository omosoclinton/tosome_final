import React from "react";
import Register from "./Register";

function RegisterAndLogOut() {
    localStorage.clear()
    return <Register />
}

export default RegisterAndLogOut;