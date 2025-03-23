// librarian.js

import { app } from "./firebase_config.js";
import { getFirestore, collection, onSnapshot } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-firestore.js";

const db = getFirestore(app);

// Real-time updates
onSnapshot(collection(db, "Books"), (snapshot) => {
  const list = document.getElementById("booksRealtime");
  if (!list) return;
  list.innerHTML = "";
  snapshot.forEach((doc) => {
    const li = document.createElement("li");
    const book = doc.data();
    li.innerText = `${book.title} by ${book.author} - Available: ${book.available} - Fine: Rs ${book.fineAmount || 0}`;
    list.appendChild(li);
  });
});

// ========== Add Book ==========
const addBookForm = document.getElementById("addBookForm");
if (addBookForm) {
  addBookForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const bookId = document.getElementById("bookId").value;
    const title = document.getElementById("title").value;
    const author = document.getElementById("author").value;
    const genre = document.getElementById("genre").value;
    
    fetch("/api/add_book", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ book_id: bookId, title, author, genre })
    })
      .then(response => response.text())
      .then(msg => alert(msg))
      .catch(err => console.error("Error adding book:", err));
  });
}

// ========== Issue Book (Renamed from Update Book) ==========
const issueBookForm = document.getElementById("issueBookForm");
if (issueBookForm) {
  issueBookForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const bookId = document.getElementById("issueBookId").value;
    const studentId = document.getElementById("studentId").value;
    const returnDate = document.getElementById("returnDate").value;
    
    fetch("/api/issue_book", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        book_id: bookId,
        issuedTo: studentId,
        returnDate
      })
    })
      .then(response => response.text())
      .then(msg => alert(msg))
      .catch(err => console.error("Error issuing book:", err));
  });
}

// ========== Return Book (Renamed from Issue Book) ==========
const returnBookForm = document.getElementById("returnBookForm");
if (returnBookForm) {
  returnBookForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const bookId = document.getElementById("returnBookId").value;
    
    fetch("/api/return_book", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ book_id: bookId })
    })
      .then(response => response.text())
      .then(msg => alert(msg))
      .catch(err => console.error("Error returning book:", err));
  });
}

// ========== Delete Book ==========
const deleteBookForm = document.getElementById("deleteBookForm");
if (deleteBookForm) {
  deleteBookForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const bookId = document.getElementById("deleteBookId").value;
    
    fetch(`/api/delete_book/${bookId}`, { method: "DELETE" })
      .then(response => response.text())
      .then(msg => alert(msg))
      .catch(err => console.error("Error deleting book:", err));
  });
}

// ========== Search Feature ==========
const searchBtn = document.getElementById("searchBtn");
const searchQueryEl = document.getElementById("searchQuery");
const searchResultsEl = document.getElementById("searchResults");

if (searchBtn) {
  searchBtn.addEventListener("click", () => {
    const query = searchQueryEl.value.trim();
    if (!query) {
      if (searchResultsEl) {
        searchResultsEl.innerHTML = "";
      }
      return;
    }
    fetch(`/api/search_books?query=${encodeURIComponent(query)}`)
      .then(response => response.json())
      .then(data => {
        if (!searchResultsEl) return;
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

const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    signOut(auth)
      .then(() => {
        console.log("Logout successful");
        window.location.href = "/"; // Redirect to the home page
      })
      .catch((error) => {
        console.error("Error during logout:", error);
      });
  });
} else {
  console.error("Logout button not found on the page.");
}

function initTriviaTip() {
  const triviaTips = [
    "Did you know? The Library of Congress is the largest library in the world, with over 170 million items.",
    "Librarian Tip: Organize your digital archives with consistent naming conventions to save time.",
    "Fun Fact: The first public library in the US was founded in 1833 in Peterborough, New Hampshire.",
    "Librarian Tip: Regularly update your cataloging system to keep your collection accessible and current.",
    "Did you know? The term 'bibliophile' means a person who loves or collects books.",
    "Librarian Tip: Use keyword tagging to improve searchability and help patrons find resources faster."
  ];
  const triviaTipElement = document.getElementById("triviaTip");
  if (triviaTipElement) {
    triviaTipElement.innerText = triviaTips[Math.floor(Math.random() * triviaTips.length)];
  }
}

// And ensure it's called when the DOM is ready:
document.addEventListener("DOMContentLoaded", initTriviaTip);