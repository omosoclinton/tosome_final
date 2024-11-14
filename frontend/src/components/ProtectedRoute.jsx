import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LoadingIndicator from "./LoadingIndicator";


const ProtectedRoute = ({children}) => {
    const {isAuthorized} =  useAuth();

    if (isAuthorized === null) {
        return <LoadingIndicator/>
    }

    return isAuthorized ? children : <Navigate to='/login'/>;
};

export default ProtectedRoute