import React, { createContext, useContext, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

export const UserContext = createContext();

const UserContextProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));

    const getUserById = async (id) => {
        try {
            const currentToken = localStorage.getItem('token'); // Get fresh token
            const response = await axios.get(`http://localhost:3000/api/users/${id}`, {
                headers: {
                    Authorization: `Bearer ${currentToken}`
                }
            });
            if (response.data.success) {
                setUser(response.data.user);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
        }
    };

    return (
        <UserContext.Provider value={{ user, setUser, getUserById, token }}>
            {children}
        </UserContext.Provider>
    );
};

export default UserContextProvider;