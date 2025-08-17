// assets/js/main.js
document.addEventListener("DOMContentLoaded", () => {
  const frames = document.querySelectorAll(".glass");
  let highestZ = 1;
  let activeFrame = null;
  let offsetX = 0;
  let offsetY = 0;
  let targetX = 0;
  let targetY = 0;
  let isDragging = false;

  // Smooth animation loop
  function animate() {
    if (activeFrame) {
      let rect = activeFrame.getBoundingClientRect();
      let currentX = rect.left + window.scrollX;
      let currentY = rect.top + window.scrollY;

      // Lerp formula
      let lerpFactor = 0.2; // smaller = smoother, larger = snappier
      let newX = currentX + (targetX - currentX) * lerpFactor;
      let newY = currentY + (targetY - currentY) * lerpFactor;

      activeFrame.style.left = `${newX}px`;
      activeFrame.style.top = `${newY}px`;
    }
    requestAnimationFrame(animate);
  }
  animate();

  frames.forEach((frame) => {
    const bar = frame.querySelector(".bar");

    bar.addEventListener("mousedown", (e) => {
      isDragging = true;
      activeFrame = frame;

      // Raise z-index
      highestZ += 1;
      frame.style.zIndex = highestZ;

      // Calculate offset so it sticks where you grabbed
      const rect = frame.getBoundingClientRect();
      offsetX = e.clientX - rect.left;
      offsetY = e.clientY - rect.top;

      // Initialize target
      targetX = rect.left + window.scrollX;
      targetY = rect.top + window.scrollY;
    });
  });

  document.addEventListener("mousemove", (e) => {
    if (!isDragging || !activeFrame) return;
    targetX = e.clientX - offsetX;
    targetY = e.clientY - offsetY;
  });

  document.addEventListener("mouseup", () => {
    isDragging = false;
    activeFrame = null;
  });
});
