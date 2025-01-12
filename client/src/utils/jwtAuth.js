import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

export const getAuthHeaders = () => {
    const token = Cookies.get('jwt');
    console.log(token)
    if (!token) {
        // Redirection vers la page de login si pas jwt
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const navigate = useNavigate();
        navigate('/login'); 
        return {}; 
    }
    return token ? { Authorization: token } : {};
};