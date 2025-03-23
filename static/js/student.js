// student.js
import { app } from "./firebase_config.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-auth.js";
import { getFirestore, doc, getDoc, serverTimestamp, setDoc } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-firestore.js";

const auth = getAuth(app);
const db = getFirestore(app);

window.addEventListener("DOMContentLoaded", () => {
  const logoutBtn = document.getElementById("logoutBtn");
  const userNameEl = document.getElementById("userName");
  const userRollNoEl = document.getElementById("userRollNo");

  // === 1. Logout event listener ===
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      signOut(auth)
        .then(() => {
          console.log("Logout successful");
          window.location.href = "/";
        })
        .catch((error) => {
          console.error("Error during logout:", error);
        });
    });
  } else {
    console.error("Logout button not found.");
  }

  // === 2. Listen for auth state changes ===
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      console.log("Auth UID:", user.uid);

      try {
        // Attempt to fetch user doc
        const userDocRef = doc(db, "Users", user.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          console.log("User Data:", userData);

          // Update name
          userNameEl.innerText = `Name: ${userData.name || "Not set"}`;

          // If role is student, show rollNo
          if (userData.role === "student") {
            userRollNoEl.innerText = `Roll No: ${userData.rollNo || "Not provided"}`;
          } else {
            userRollNoEl.innerText = "";
          }
        } else {
          console.log("No user document found in Firestore!");

          // Optional: Create a default doc if missing
          /*
          const defaultData = {
            name: "Unknown",
            email: user.email,
            role: "student",
            rollNo: "",
            createdAt: serverTimestamp()
          };
          await setDoc(userDocRef, defaultData);
          userNameEl.innerText = `Name: ${defaultData.name}`;
          userRollNoEl.innerText = `Roll No: ${defaultData.rollNo || "Not provided"}`;
          */
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
      }
    } else {
      console.log("No user is signed in.");
      window.location.href = "/login";
    }
  });

  // === 3. Fetch and display available books ===
  fetch("/api/get_books")
    .then(response => response.json())
    .then(data => {
      const booksUl = document.getElementById("books");
      if (booksUl) {
        booksUl.innerHTML = "";
        data.forEach((bookObj) => {
          for (const id in bookObj) {
            const book = bookObj[id];
            if (book.available) {
              const li = document.createElement("li");
              li.innerText = `${book.title} by ${book.author} [${book.genre}]`;
              booksUl.appendChild(li);
            }
          }
        });
      }
    })
    .catch(error => console.error("Error fetching books:", error));

  // === 4. Search Feature ===
  const searchBtn = document.getElementById("searchBtn");
  const searchQueryEl = document.getElementById("searchQuery");
  const searchResultsEl = document.getElementById("searchResults");

  if (searchBtn) {
    searchBtn.addEventListener("click", () => {
      const query = searchQueryEl.value.trim();
      if (!query) {
        // Clear search results if empty query
        searchResultsEl.innerHTML = "";
        return;
      }
      fetch(`/api/search_books?query=${encodeURIComponent(query)}`)
        .then(response => response.json())
        .then(data => {
          searchResultsEl.innerHTML = "";
          if (data.length === 0) {
            searchResultsEl.innerHTML = "<li>No matching books found.</li>";
          } else {
            data.forEach(docObj => {
              for (const id in docObj) {
                const book = docObj[id];
                const li = document.createElement("li");
                li.textContent = `${book.title} by ${book.author} [${book.genre}]`;
                searchResultsEl.appendChild(li);
              }
            });
          }
        })
        .catch(err => console.error("Error searching books:", err));
    });
  }
});
