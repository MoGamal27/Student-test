import React, { createContext, useContext, useState } from 'react';
import axios from 'axios';
const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);



   
    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    return useContext(UserContext);
};