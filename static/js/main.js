// main.js (or logout.js if you separate it)
import { getAuth, signOut } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-auth.js";
import { app } from "./firebase_config.js";

const auth = getAuth(app);

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
  console.log("initTriviaTip function is running"); // Debugging line
  
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
    console.log("TriviaTip element found"); // Debugging line
    triviaTipElement.innerText = triviaTips[Math.floor(Math.random() * triviaTips.length)];
  } else {
    console.error("TriviaTip element NOT found on the page.");
  }
}

initTriviaTip();
