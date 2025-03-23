// register.js
import { app } from "./firebase_config.js";
import { getAuth, onAuthStateChanged, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-auth.js";
import { getFirestore, doc, getDoc, setDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-firestore.js";

const auth = getAuth(app);
const db = getFirestore(app);

// First, ensure that the current user is authenticated and is a librarian.
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    // Not logged in—redirect to librarian login page.
    window.location.href = "/librarianLogin";
  } else {
    try {
      const userDocRef = doc(db, "Users", user.uid);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        const userData = userDoc.data();
        if (userData.role !== "librarian") {
          alert("Only librarians are authorized to create new accounts.");
          window.location.href = "/";
        }
        // If the user is a librarian, they are allowed to remain on the registration page.
      } else {
        alert("User profile not found. Please contact support.");
        window.location.href = "/";
      }
    } catch (err) {
      console.error("Error checking user role:", err);
      window.location.href = "/";
    }
  }
});

// Handle registration form submission
document.getElementById("registerForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  // Get new account details to be created by the librarian
  const name = document.getElementById("name").value;
  const email = document.getElementById("regEmail").value;
  const password = document.getElementById("regPassword").value;
  const role = document.getElementById("role").value; // either "student" or "librarian"
  const rollNo = document.getElementById("rollNo").value; // applicable if role is student

  try {
    // Create the new user in Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    console.log("New user created:", userCredential.user);
    
    // Create a Firestore document for the new user, with the document ID equal to the new user's UID.
    const userData = { 
      name,
      email,
      role,
      createdAt: serverTimestamp()
    };
    if (role === "student" && rollNo) {
      userData.rollNo = rollNo;
    }
    await setDoc(doc(db, "Users", userCredential.user.uid), userData);
    console.log("User document created successfully.");
    
    // Redirect to login page after successful registration
    window.location.href = "/login";
  } catch (error) {
    console.error("Error during registration:", error.code, error.message);
    document.getElementById("reg-error-msg").innerText = error.message;
  }
});
