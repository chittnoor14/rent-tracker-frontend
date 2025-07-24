function login() {
  const username = document.getElementById("username").value;
  localStorage.setItem("user", username);
  document.getElementById("userName").innerText = username;
  document.getElementById("loginDiv").style.display = "none";
  document.getElementById("dashboard").style.display = "block";
}

function markPaid() {
  const user = localStorage.getItem("user");
  fetch("https://your-backend-url.com/mark-paid", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user })
  })
  .then(res => res.json())
  .then(data => {
    document.getElementById("status").innerText = "Rent Marked as Paid ✅";
  });
}
