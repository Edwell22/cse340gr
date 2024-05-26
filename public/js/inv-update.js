const form = document.querySelector("#updateForm");
form.addEventListener("change", function() {
  const updateBtn = form.querySelector(".editInvButton");
  updateBtn.removeAttribute("disabled");
});