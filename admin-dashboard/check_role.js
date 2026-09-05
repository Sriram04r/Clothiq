import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyAw67Qp_CSTIYCq-3s7EIXC8kZQ6ll7GpA",
    authDomain: "clothiq-7314a.firebaseapp.com",
    projectId: "clothiq-7314a",
    storageBucket: "clothiq-7314a.firebasestorage.app",
    messagingSenderId: "930212381030",
    appId: "1:930212381030:web:1234567890abcdef"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

async function check() {
    try {
        const cred = await signInWithEmailAndPassword(auth, 'adminclothiq@gmail.com', 'Ram_Deep_5062');
        console.log("Logged in:", cred.user.uid);
        const d = await getDoc(doc(db, 'users', cred.user.uid));
        if (d.exists()) {
            console.log("ROLE IS:", d.data().role);
        } else {
            console.log("DOCUMENT DOES NOT EXIST");
        }
    } catch (e) {
        console.error("ERROR:", e.message);
    }
    process.exit(0);
}
check();
