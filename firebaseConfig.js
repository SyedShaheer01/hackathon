import { initializeApp } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js";
  import { getAuth ,createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut} from "https://www.gstatic.com/firebasejs/10.1.0/firebase-auth.js";
  import { getFirestore , doc, setDoc, getDoc,collection, addDoc, getDocs, deleteDoc, updateDoc, serverTimestamp, query, orderBy} from "https://www.gstatic.com/firebasejs/10.1.0/firebase-firestore.js";
  import { getStorage ,ref, uploadBytesResumable, getDownloadURL} from "https://www.gstatic.com/firebasejs/10.1.0/firebase-storage.js";
  
  const firebaseConfig = {
    apiKey: "AIzaSyCgDcL7Lu0lAPl8Xg4L98raEV7ciD2KpKA",
    authDomain: "todo-smit9.firebaseapp.com",
    projectId: "todo-smit9",
    storageBucket: "todo-smit9.appspot.com",
    messagingSenderId: "386779277564",
    appId: "1:386779277564:web:333e34fcdb34f5c1e7cf79"
};



  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const db = getFirestore(app);
  const storage = getStorage(app);
  export { app ,auth, createUserWithEmailAndPassword, db ,doc , setDoc, signInWithEmailAndPassword, onAuthStateChanged, signOut, getDoc, collection, addDoc, getDocs, deleteDoc, updateDoc, serverTimestamp, query, orderBy, storage, ref, uploadBytesResumable, getDownloadURL} 
