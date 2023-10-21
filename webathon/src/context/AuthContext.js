import { createContext, useContext, useEffect, useState } from "react";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    sendEmailVerification,

} from "firebase/auth";
import { auth } from "../firebaseConfig";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";


const UserContext = createContext();

export const AuthContextProvider = ({ children }) => {
    const [user, setUser] = useState({});
    const createUser = async (email, password) => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);  // Ensure you're retrieving the userCredential

            if (userCredential.user) {
                // Send email verification
                await sendEmailVerification(userCredential.user);

            }
        } catch (error) {
            console.error('Error creating user:', error);
            toast.error("Error creating user account.");
        }
    };



    const sendPasswordResetEmail = async (email) => {
        try {
            await sendPasswordResetEmail(auth, email);
            toast.success("Password reset email sent. Please check your inbox.");
        } catch (error) {
            toast.error("Error sending password reset email.");
        }
    };

    const signIn = async (loginEmail, loginPassword) => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
            setUser(userCredential.user);
            return userCredential.user;
        } catch (error) {
            console.error('Error signing in:', error);
            toast.error("Error signing in.");
            return null;
        }
    };

    const logout = async () => {
        try {
            await signOut(auth);
            setUser({});
        } catch (error) {
            console.error('Error logging out:', error);
            toast.error("Error logging out.");
        }
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });
        return () => {
            unsubscribe();
        };
    }, []);

    return (
        <UserContext.Provider value={{ createUser, user, logout, signIn, sendPasswordResetEmail }}>
            {children}
        </UserContext.Provider>
    );
};

export const UserAuth = () => {
    return useContext(UserContext);
};
