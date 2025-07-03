import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const roleToPath = {
  "1": "/",
  "2": "/admin",
  "3": "/mod"
};

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/landing" replace />;
  }

  // Kiểm tra roleId và path
  const expectedPath = roleToPath[user.roleId];
  if (expectedPath && !location.pathname.startsWith(expectedPath)) {
    return <Navigate to={expectedPath} replace />;
  }

  return children;
};

export default ProtectedRoute;