const target = document.getElementById("target");
const scoreEl = document.getElementById("score");
let score = 0;

function moveTarget() {
  const padding = 20; // keep away from edges
  const maxX = window.innerWidth - target.offsetWidth - padding;
  const maxY = window.innerHeight - target.offsetHeight - padding;

  const x = Math.random() * maxX + padding;
  const y = Math.random() * maxY + padding;

  target.style.left = x + "px";
  target.style.top = y + "px";
}

target.addEventListener("click", () => {
  score++;
  scoreEl.textContent = "Score: " + score;
  moveTarget();
});

console.log("Target found?", target);

// start at random position
moveTarget();

// reposition if screen resizes
window.addEventListener("resize", moveTarget);