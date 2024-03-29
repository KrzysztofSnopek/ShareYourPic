import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "@firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCRyQvycZBrzfGDrhZb2Bk3wzj856gkWCc",
  authDomain: "show-your-picture.firebaseapp.com",
  projectId: "show-your-picture",
  storageBucket: "show-your-picture.appspot.com",
  messagingSenderId: "874717332608",
  appId: "1:874717332608:web:9e02544b0b422e61271265",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app);
