const admin = require('firebase-admin');

// Initialize Firebase Admin (make sure to set GOOGLE_APPLICATION_CREDENTIALS or it might fail locally if not configured, though `firebase login` usually covers it for basic local scripts).
// If it fails with "Could not load the default credentials", we can use a service account.
admin.initializeApp();

const resetAdmin = async (newEmail, newPassword) => {
  const db = admin.firestore();
  const auth = admin.auth();

  console.log("🔍 Searching for existing admins...");
  
  // 1. Find all users with role 'admin' in Firestore
  const adminsSnapshot = await db.collection("users").where("role", "==", "admin").get();
  
  if (!adminsSnapshot.empty) {
    console.log(`Found ${adminsSnapshot.size} existing admin(s). Deleting them...`);
    
    for (const doc of adminsSnapshot.docs) {
      const uid = doc.id;
      // Delete from Auth
      try {
        await auth.deleteUser(uid);
        console.log(`✅ Deleted user ${uid} from Authentication.`);
      } catch (error) {
        console.log(`⚠️ User ${uid} not found in Auth or already deleted.`);
      }
      
      // Delete from Firestore
      await db.collection("users").doc(uid).delete();
      console.log(`✅ Deleted user ${uid} from Firestore.`);
    }
  } else {
    console.log("No existing admins found.");
  }

  console.log("\n✨ Creating new admin account...");

  try {
    // 2. Create the new user in Firebase Auth
    const userRecord = await auth.createUser({
      email: newEmail,
      password: newPassword,
      displayName: "Administrator",
    });

    // 3. Add the user to Firestore with the 'admin' role
    await db.collection("users").doc(userRecord.uid).set({
      name: "Administrator",
      email: newEmail,
      role: "admin",
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    console.log(`\n🎉 SUCCESS! New admin account created.`);
    console.log(`Email: ${newEmail}`);
    console.log(`Password: ${newPassword}`);
    console.log(`You can now use these credentials to log into both the Web Dashboard and the Mobile App!`);

  } catch (error) {
    console.error("\n❌ Error creating new admin:", error.message);
  }
};

// Check arguments
const args = process.argv.slice(2);
if (args.length !== 2) {
  console.log("Usage: node reset.js <email> <password>");
  process.exit(1);
}

const email = args[0];
const password = args[1];

resetAdmin(email, password);
