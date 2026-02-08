// src/services/authService.js
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { auth } from "../config/firebase";

const ADMIN_EMAIL = "riorajaa2018@gmail.com";

export const isAdmin = (user) => {
  return user && user.email === ADMIN_EMAIL;
};

export const loginAdmin = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password,
    );
    const user = userCredential.user;

    if (!isAdmin(user)) {
      await signOut(auth);
      throw new Error("Unauthorized: You do not have admin privileges");
    }

    return user;
  } catch (error) {
    throw error;
  }
};

export const logoutAdmin = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    throw error;
  }
};

export const checkAuthState = (callback) => {
  return onAuthStateChanged(auth, callback);
};
