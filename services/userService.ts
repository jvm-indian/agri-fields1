import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "./firebase";
import { User } from "../types";

export const saveUserProfile = async (uid: string, userData: User) => {
  try {
    if (!userData.email) {
      throw new Error("Email field is required and cannot be undefined.");
    }

    await setDoc(doc(db, "users", uid), userData);
  } catch (error) {
    console.error("Error saving user profile:", error);
    throw error;
  }
};

export const getUserProfile = async (uid: string): Promise<User | null> => {
  try {
    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data() as User;
    } else {
      console.warn("No such user profile!");
      return null;
    }
  } catch (error) {
    console.error("Error getting user profile:", error);
    return null;
  }
};

export const updateUserProfile = async (uid: string, updates: Partial<User>) => {
  try {
    const userRef = doc(db, "users", uid);
    await updateDoc(userRef, updates);
  } catch (error) {
    console.error("Error updating profile:", error);
    throw error;
  }
};