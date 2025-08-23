const mainPageButton = document.getElementById("MainPageButton");

mainPageButton.addEventListener("click", () => {
    // Logic to navigate to the main page
    window.location.href = "/mainpage/";
    window.history.pushState(null, "", window.location.href);
});
