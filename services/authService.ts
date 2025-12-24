import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signOut, 
    onAuthStateChanged,
    fetchSignInMethodsForEmail
  } from "firebase/auth";
  import { auth } from "./firebase";
  import { saveUserProfile, getUserProfile } from "./userService";
  import { User, Language } from "../types";
  
  // Helper to convert phone to a dummy email for Firebase Auth
  // This allows us to use Password auth while keeping the UI as "Phone Number"
  const formatEmail = (phoneOrEmail: string) => {
    if (phoneOrEmail.includes('@')) return phoneOrEmail;
    return `${phoneOrEmail}@agrifields.app`;
  };
  
  export const registerUser = async (name: string, phone: string, password: string, language: Language, role: 'farmer' | 'admin' = 'farmer'): Promise<User> => {
    const email = formatEmail(phone);
    
    if (!email || !password) {
      throw new Error("Email and password are required for signup.");
    }
    
    // Check if the user already exists
    const userExists = await fetchSignInMethodsForEmail(auth, email);
    if (userExists.length > 0) {
      throw new Error("User already exists. Please log in.");
    }
    
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;
  
      const newUser: User = {
        name,
        phone,
        email,
        role,
        language,
        uid // Add UID to match the User interface
      };
  
      // Save extra details to Firestore
      await saveUserProfile(uid, newUser);
      return newUser;
    } catch (error: any) {
      throw new Error(error.message);
    }
  };
  
  export const loginUser = async (phone: string, password: string): Promise<User> => {
    const email = formatEmail(phone);
    
    if (!phone || !password) {
      throw new Error("Phone number and password are required.");
    }
    
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;
  
      // Fetch profile from Firestore
      const userProfile = await getUserProfile(uid);
      
      if (!userProfile) {
        console.warn("Profile not found. Creating a new profile.");
        const newUserProfile: User = {
          name: userCredential.user.displayName || "Unknown",
          phone,
          uid,
          role: "farmer", // Default role
          language: "en" // Default language
        };
        await saveUserProfile(uid, newUserProfile);
        return newUserProfile;
      }
      return userProfile;
    } catch (error: any) {
      console.error("Login Error", error);
      throw new Error("Invalid credentials or user not found.");
    }
  };
  
  export const logoutUser = async () => {
    await signOut(auth);
  };
  
  export const subscribeToAuthChanges = (callback: (user: User | null) => void) => {
    return onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const profile = await getUserProfile(firebaseUser.uid);
        callback(profile);
      } else {
        callback(null);
      }
    });
  };