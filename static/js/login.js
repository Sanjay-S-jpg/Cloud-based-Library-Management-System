// login.js
import { app } from "./firebase_config.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-firestore.js";

const auth = getAuth(app);
const db = getFirestore(app);

document.getElementById("loginForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  signInWithEmailAndPassword(auth, email, password)
    .then(async (userCredential) => {
      console.log("Login successful:", userCredential.user);
      const uid = userCredential.user.uid;

      // Fetch the user document from the "Users" collection
      const userDocRef = doc(db, "Users", uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        console.log("User Data:", userData);

        // Redirect based on the 'role' field
        if (userData.role === "librarian") {
          window.location.href = "/librarian";
        } else {
          window.location.href = "/student";
        }
      } else {
        console.error("No user document found!");
        // If you want to create a default doc, you can do so here
        // Otherwise, just default to student
        window.location.href = "/student";
      }
    })
    .catch((error) => {
      console.error("Error during login:", error.code, error.message);
      document.getElementById("error-msg").innerText = error.message;
    });
});
