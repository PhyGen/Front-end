import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthWrapper = ({ children }) => {
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token'); // hoặc từ nơi bạn lưu token
        const isTokenValid = checkTokenValidity(token);
        
        if (!token || !isTokenValid) {
            navigate('/landing');
        }
    }, [navigate]);

    return children;
};

// Hàm kiểm tra tính hợp lệ của token
const checkTokenValidity = (token) => {
    if (!token) return false;
    
    try {
        // Decode JWT token để lấy thời gian hết hạn
        const payload = JSON.parse(atob(token.split('.')[1]));
        const expirationTime = payload.exp * 1000; // Chuyển đổi sang milliseconds
        
        return Date.now() < expirationTime;
    } catch (error) {
        return false;
    }
};

export default AuthWrapper;