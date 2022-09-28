import { initializeApp } from "firebase/app";
import {
  GoogleAuthProvider,
  getAuth,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
} from "firebase/auth";
import {
  getFirestore,
  query,
  getDocs,
  collection,
  where,
  addDoc,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDceaT7qoZNKTuozDTqvcq5cc9blcNepso",
  authDomain: "producktive-41cdf.firebaseapp.com",
  databaseURL:
    "https://producktive-41cdf-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "producktive-41cdf",
  storageBucket: "producktive-41cdf.appspot.com",
  messagingSenderId: "983760558231",
  appId: "1:983760558231:web:337fb5ad1cc849728eb1d2",
  measurementId: "G-VM1L5FYM02",
};

/*const firebaseConfig = {
  apiKey: "AIzaSyBgzYtdOSsSSmMVvq6twm5oP9jtG8dgoo4",
  authDomain: "backup1-1f86a.firebaseapp.com",
  projectId: "backup1-1f86a",
  storageBucket: "backup1-1f86a.appspot.com",
  messagingSenderId: "576513805591",
  appId: "1:576513805591:web:ae62a0513f029d90c23b52",
};*/

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const googleProvider = new GoogleAuthProvider();

const signInWithGoogle = async () => {
  try {
    const res = await signInWithPopup(auth, googleProvider);
    const user = res.user;
    const q = query(collection(db, "users"), where("uid", "==", user.uid));
    const docs = await getDocs(q);
    if (docs.docs.length === 0) {
      await addDoc(collection(db, "users"), {
        uid: user.uid,
        name: user.displayName,
        authProvider: "google",
        email: user.email,
        projects: [],
      });
    }
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

const logInWithEmailAndPassword = async (email, password) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

const registerWithEmailAndPassword = async (name, email, password) => {
  try {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    const user = res.user;
    await addDoc(collection(db, "users"), {
      uid: user.uid,
      name,
      authProvider: "local",
      email,
      projects: [],
    });
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

const sendPasswordReset = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    alert("Password reset link sent!");
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

const logout = () => {
  signOut(auth);
};

const getUser = () => auth.currentUser;

export {
  app,
  auth,
  db,
  getUser,
  signInWithGoogle,
  logInWithEmailAndPassword,
  registerWithEmailAndPassword,
  sendPasswordReset,
  logout,
};
