const BackButton = document.getElementById("BackButton");

BackButton.addEventListener("click", () => {
    window.history.back();
    window.history.pushState(null, "", window.location.href);
});