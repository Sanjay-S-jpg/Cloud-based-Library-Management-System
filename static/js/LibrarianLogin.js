// librarianLogin.js
import { app } from "./firebase_config.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-firestore.js";

const auth = getAuth(app);
const db = getFirestore(app);

document.getElementById("librarianLoginForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const email = document.getElementById("libEmail").value;
  const password = document.getElementById("libPassword").value;

  signInWithEmailAndPassword(auth, email, password)
    .then(async (userCredential) => {
      console.log("Librarian login successful:", userCredential.user);
      const uid = userCredential.user.uid;
      // Fetch the user document from the "Users" collection
      const userDocRef = doc(db, "Users", uid);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        const userData = userDoc.data();
        // Only allow access if the role is 'librarian'
        if (userData.role === "librarian") {
          // Redirect to the registration page so librarian can create new accounts
          window.location.href = "/register";
        } else {
          document.getElementById("lib-error-msg").innerText = "You are not authorized as a librarian.";
        }
      } else {
        document.getElementById("lib-error-msg").innerText = "User profile not found.";
      }
    })
    .catch((error) => {
      console.error("Error during librarian login:", error.code, error.message);
      document.getElementById("lib-error-msg").innerText = error.message;
    });
});
