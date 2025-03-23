document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("issueBookForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    // Get and trim input values
    const bookId = document.getElementById("issueBookId").value.trim();
    console.log("Book ID:", bookId);  // Debug log
    const studentId = document.getElementById("studentId").value.trim();
    const dueDate = document.getElementById("dueDate").value;

    // Validate inputs
    if (!bookId || !studentId || !dueDate) {
      showMessage("Please fill all fields!", "error");
      return;
    }

    try {
      // 1. Check if the book exists and is available
      const checkResponse = await fetch(`/api/check_book/${bookId}`);
      const checkData = await checkResponse.json();
      if (!checkData.exists) {
        showMessage("Book not found!", "error");
        return;
      }
      if (!checkData.available) {
        showMessage(`Book is already issued to Student ID: ${checkData.issuedTo}`, "error");
        return;
      }

      // 2. Send POST request to issue the book
      const response = await fetch("/api/issue_book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          book_id: bookId, 
          student_id: studentId,  
          returnDate: dueDate  
        }),
      });

      const data = await response.json();

      if (data.success) {
        showMessage("Book issued successfully!", "success");
        document.getElementById("issueBookForm").reset();
      } else {
        console.error("Issue Book Error:", data.message);
        showMessage(data.message || "Failed to issue book!", "error");
      }
    
    } catch (error) {
      console.error("Error issuing book:", error);
      showMessage("An error occurred. Try again!", "error");
    }
  });

  function showMessage(message, type) {
    const messageBox = document.getElementById("message");
    
    // Format message properly
    if (typeof message === "object") {
        message = message.message || "Something went wrong!";
    }
    
    messageBox.innerHTML = `<strong>${type.toUpperCase()}:</strong> ${message}`;
    messageBox.className = `message ${type}`;
    messageBox.style.display = "block";

    setTimeout(() => {
        messageBox.style.display = "none";
    }, 3000);
}

});
