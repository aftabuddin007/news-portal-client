import  { use } from 'react';
import { AuthContexts } from '../contexts/AuthContext';

const useAuth = () => {
    const authInfo = use(AuthContexts);

    return authInfo;
    
}

export default useAuth;