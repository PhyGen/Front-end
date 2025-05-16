import { Navigate } from "react-router-dom";
import { jwtDecode } from 'jwt-decode';

const ProtectedRoute = ({ children, role }) => {
    const token = localStorage.getItem("token");

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    const user = jwtDecode(token);
    console.log(user);

    if (!user || user.role !== role) {
        return <Navigate to="/errorPage" replace />;
    }

    return children;
};

export default ProtectedRoute;