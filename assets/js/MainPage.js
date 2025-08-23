const BackButton = document.getElementById("BackButton");
const ProfileButton = document.getElementById("ProfileButton");

BackButton.addEventListener("click", () => {
    window.location.href = "sidepage.html";
    window.history.pushState(null, "", window.location.href);
});

ProfileButton.addEventListener("click", () => {
    window.location.href = "loginpage.html";
    window.history.pushState(null, "", window.location.href);
});