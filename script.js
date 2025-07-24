const backendURL = "https://rent-backend-de8i.onrender.com"; // or your deployed URL

function showSignup() {
  document.getElementById("loginDiv").style.display = "none";
  document.getElementById("signupDiv").style.display = "block";
}

function signup() {
  const name = document.getElementById("signupName").value;
  const shopNumber = document.getElementById("signupShop").value;
  const contact = document.getElementById("signupContact").value;

  fetch(`${backendURL}/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, shopNumber, contact })
  })
    .then(res => {
      if (!res.ok) throw new Error("Signup failed");
      alert("Signup successful! Please login.");
      document.getElementById("signupDiv").style.display = "none";
      document.getElementById("loginDiv").style.display = "block";
    })
    .catch(err => alert("Error: " + err.message));
}

function login() {
  const username = document.getElementById("loginName").value;
  localStorage.setItem("user", username);
  document.getElementById("userName").innerText = username;
  document.getElementById("loginDiv").style.display = "none";
  document.getElementById("signupDiv").style.display = "none";
  document.getElementById("dashboard").style.display = "block";

  // Load rent history
  fetch(`${backendURL}/rents/${username}`)
    .then(res => res.json())
    .then(data => {
      const historyList = document.getElementById("historyList");
      historyList.innerHTML = "";

      if (data.length === 0) {
        historyList.innerHTML = "<li>No rent records found.</li>";
        return;
      }

      data.forEach(entry => {
        const li = document.createElement("li");
        li.innerHTML = `
          <strong>${entry.month}</strong><br>
          ₹${entry.amount} - ${entry.isPaid ? "✅ Paid" : "❌ Unpaid"}
          ${entry.proofImageUrl ? `<br><img src="${entry.proofImageUrl}" alt="Proof">` : ""}
        `;
        historyList.appendChild(li);
      });
    });
}

function markPaid() {
  const user = localStorage.getItem("user");
  const currentMonth = new Date().toLocaleString("default", { month: "long", year: "numeric" });
  const amount = prompt("Enter amount paid:");
  const proof = document.getElementById("proofInput").files[0];

  const formData = new FormData();
  formData.append("tenantName", user);
  formData.append("shopNumber", "S1"); // you can make this dynamic if needed
  formData.append("month", currentMonth);
  formData.append("isPaid", true);
  formData.append("amount", amount);
  if (proof) formData.append("proof", proof);

  fetch(`${backendURL}/rents`, {
    method: "POST",
    body: formData
  })
  .then(res => res.json())
  .then(data => {
    alert("✅ Rent marked as paid!");
    document.getElementById("status").innerText = "✅ Rent marked as paid!";
    login(); // Refresh history
  })
  .catch(err => alert("❌ Error uploading rent: " + err.message));
}

