import axios from 'axios';
import { createContext, useContext, useState, useEffect } from 'react';


const Auth = createContext();

const initialState = { isAuth: false, user: {} }

const AuthContext = ({ children }) => {
    const [state, setState] = useState(initialState);
    const [isAppLoading, setIsAppLoading] = useState(true);

    const readProfile = (token) => {
        const jwt = token || localStorage.getItem("jwt")
        if (!jwt) { return setIsAppLoading(false) }

        axios.get(window.api + "/api/auth/user", { headers: { Authorization: `Bearer ${jwt}` } })
            .then((res) => {
                const { status, data } = res;
                if (status === 200) {
                    setState((state) => ({ ...state, isAuth: true, user: data.user }))
                }
            })
            .catch((err) => {
                console.log(err);
                localStorage.removeItem("jwt")
            })
            .finally(() => setIsAppLoading(false))
    }

    useEffect(() => {
        readProfile()
    }, [])

    const handleLogout = () => {
        setState(initialState);
        localStorage.removeItem("jwt");
        window.toastify("User Logout successfully", "success")
    }

    return (
        <Auth.Provider value={{ ...state, isAppLoading, handleLogout, dispatch: setState, readProfile }}>
            {children}
        </Auth.Provider>
    );
};

export default AuthContext;

export const useAuth = () => useContext(Auth);
