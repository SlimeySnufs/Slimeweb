const target = document.getElementById("target");
const scoreEl = document.getElementById("score");
let score = 0;

function moveTarget() {
  const padding = 10;

  // Get actual size
  const rect = target.getBoundingClientRect();
  const targetWidth = rect.width;
  const targetHeight = rect.height;

  // viewport bounds
  const maxX = window.innerWidth - targetWidth - padding;
  const maxY = window.innerHeight - targetHeight - padding;

  const x = Math.random() * (maxX - padding) + padding;
  const y = Math.random() * (maxY - padding) + padding;

  target.style.left = `${x}px`;
  target.style.top = `${y}px`;
}


const addScore = e => {
  e.preventDefault();
  score++;
  scoreEl.textContent = `Score: ${score}`;
  moveTarget();
};

target.addEventListener("click", addScore);
target.addEventListener("touchstart", addScore, {passive:false});

moveTarget();
window.addEventListener("resize", moveTarget);
