const mainPageButton = document.getElementById("MainPageButton");

mainPageButton.addEventListener("click", () => {
    // Logic to navigate to the main page
    window.location.href = "mainpage.html";
    window.History.pushState(null, "", window.location.href);
});
    