import { initializeApp } from 'firebase/app';
import { getFirestore, collectionGroup, getDocs, deleteDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAw67Qp_CSTIYCq-3s7EIXC8kZQ6ll7GpA",
  authDomain: "clothiq-7314a.firebaseapp.com",
  projectId: "clothiq-7314a",
  storageBucket: "clothiq-7314a.firebasestorage.app",
  messagingSenderId: "930212381030",
  appId: "1:930212381030:web:1234567890abcdef"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function clearOrders() {
  console.log("Fetching all orders...");
  try {
    const ordersSnap = await getDocs(collectionGroup(db, 'orders'));
    console.log(`Found ${ordersSnap.size} orders to delete.`);
    
    let deletedCount = 0;
    for (const doc of ordersSnap.docs) {
      await deleteDoc(doc.ref);
      deletedCount++;
    }
    
    console.log(`Successfully deleted ${deletedCount} orders! Database is clear.`);
    process.exit(0);
  } catch (err) {
    console.error("Error clearing orders:", err);
    process.exit(1);
  }
}

clearOrders();
