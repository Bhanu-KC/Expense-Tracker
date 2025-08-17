import React, { createContext, useState } from "react";

export const UserContext = createContext();

const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    // funciton to udpate user data
    const updateUser = (userData) => {
        setUser(userData);
    }

    // Functiopn to clear use data
    const clearUser = () => {
        setUser(null);
    }

    return (
        <UserContext.Provider
            value={{
                user,
                updateUser,
                clearUser,
            }}>
            {children}
        </UserContext.Provider>
    )
}

export default UserProvider