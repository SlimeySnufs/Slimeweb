// assets/js/main.js
document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("container");
  const frames = document.querySelectorAll(".glass");
  let highestZ = 10;
  let activeFrame = null;
  let offsetX = 0;
  let offsetY = 0;
  let targetX = 0;
  let targetY = 0;
  let isDragging = false;

  // Smooth lerp animation
  function animate() {
    if (activeFrame) {
      const rect = activeFrame.getBoundingClientRect();
      const currentX = rect.left - container.getBoundingClientRect().left;
      const currentY = rect.top - container.getBoundingClientRect().top;

      const lerpFactor = 0.2;
      const newX = currentX + (targetX - currentX) * lerpFactor;
      const newY = currentY + (targetY - currentY) * lerpFactor;

      activeFrame.style.left = `${newX}px`;
      activeFrame.style.top = `${newY}px`;
    }
    requestAnimationFrame(animate);
  }
  animate();

  frames.forEach(frame => {
    const bar = frame.querySelector(".bar");

    const startDrag = e => {
      e.preventDefault();
      isDragging = true;
      activeFrame = frame;

      highestZ += 1;
      frame.style.zIndex = highestZ;

      const clientX = e.type.startsWith("touch") ? e.touches[0].clientX : e.clientX;
      const clientY = e.type.startsWith("touch") ? e.touches[0].clientY : e.clientY;

      const rect = frame.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();

      offsetX = clientX - rect.left;
      offsetY = clientY - rect.top;

      targetX = rect.left - containerRect.left;
      targetY = rect.top - containerRect.top;
    };

    const dragMove = e => {
      if (!isDragging || activeFrame !== frame) return;

      const clientX = e.type.startsWith("touch") ? e.touches[0].clientX : e.clientX;
      const clientY = e.type.startsWith("touch") ? e.touches[0].clientY : e.clientY;

      const containerRect = container.getBoundingClientRect();

      targetX = clientX - containerRect.left - offsetX;
      targetY = clientY - containerRect.top - offsetY;

      // Clamp to container
      targetX = Math.max(0, Math.min(targetX, container.clientWidth - frame.offsetWidth));
      targetY = Math.max(0, Math.min(targetY, container.clientHeight - frame.offsetHeight));
    };

    const endDrag = () => {
      if (activeFrame === frame) {
        isDragging = false;
        activeFrame = null;
      }
    };

    // Mouse events
    bar.addEventListener("mousedown", startDrag);
    window.addEventListener("mousemove", dragMove);
    window.addEventListener("mouseup", endDrag);

    // Touch events
    bar.addEventListener("touchstart", startDrag, {passive: false});
    window.addEventListener("touchmove", dragMove, {passive: false});
    window.addEventListener("touchend", endDrag);
    window.addEventListener("touchcancel", endDrag);
  });
});
