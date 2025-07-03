import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';


const AuthWrapper = ({ children }) => {
    const navigate = useNavigate();
    const { user, loading } = useAuth();
    
    useEffect(() => {
        if (!loading && !user) {
            navigate('/landing');
        }
    }, [user, loading, navigate]);

     useEffect(() => {
       console.log("User Information",user);
    }, [user]);

    if (loading) {
        return <div>Loading...</div>;
    }

    return children;
};

export default AuthWrapper;