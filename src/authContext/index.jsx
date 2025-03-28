import React, { useContext, useState, useEffect } from "react";
import { auth } from "../firebase/firebase.js";
import { GoogleAuthProvider } from "firebase/auth";
import { onAuthStateChanged } from "firebase/auth";

const Index = React.createContext(undefined, undefined);

export function useAuth() {
    return useContext(Index);
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [userLoggedIn, setUserLoggedIn] = useState(false);
    const [isEmailUser, setIsEmailUser] = useState(false);
    const [isGoogleUser, setIsGoogleUser] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, initializeUser);
        return unsubscribe;
    }, []);

    async function initializeUser(user) {
        if (user) {

            setCurrentUser({ ...user });

            const isEmail = user.providerData.some(
                (provider) => provider.providerId === "password"
            );
            setIsEmailUser(isEmail);
             const isGoogle = user.providerData.some(
                (provider) => provider.providerId === GoogleAuthProvider.PROVIDER_ID
              );
              setIsGoogleUser(isGoogle);

            setUserLoggedIn(true);
        } else {
            setCurrentUser(null);
            setUserLoggedIn(false);
        }

        setLoading(false);
    }

    const value = {
        userLoggedIn,
        isEmailUser,
        isGoogleUser,
        currentUser,
        setCurrentUser
    };

    return (
        <Index.Provider value={value}>
            {!loading && children}
        </Index.Provider>
    );
}