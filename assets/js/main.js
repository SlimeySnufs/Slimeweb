document.addEventListener("DOMContentLoaded", () => {
  const frames = document.querySelectorAll(".glass");
  let highestZ = 10;
  let activeFrame = null;
  let offsetX = 0;
  let offsetY = 0;
  let targetX = 0;
  let targetY = 0;
  let isDragging = false;

  // Animate lerp
  function animate() {
    if (activeFrame) {
      const rect = activeFrame.getBoundingClientRect();
      const currentX = rect.left + window.scrollX;
      const currentY = rect.top + window.scrollY;

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

      let clientX = e.type.startsWith("touch") ? e.touches[0].clientX : e.clientX;
      let clientY = e.type.startsWith("touch") ? e.touches[0].clientY : e.clientY;

      const rect = frame.getBoundingClientRect();
      offsetX = clientX - rect.left;
      offsetY = clientY - rect.top;
      targetX = rect.left + window.scrollX;
      targetY = rect.top + window.scrollY;
    };

    const dragMove = e => {
      if (!isDragging || !activeFrame) return;
      let clientX = e.type.startsWith("touch") ? e.touches[0].clientX : e.clientX;
      let clientY = e.type.startsWith("touch") ? e.touches[0].clientY : e.clientY;

      targetX = clientX - offsetX;
      targetY = clientY - offsetY;

      // clamp to viewport
      targetX = Math.max(0, Math.min(targetX, window.innerWidth - frame.offsetWidth));
      targetY = Math.max(0, Math.min(targetY, window.innerHeight - frame.offsetHeight));
    };

    const endDrag = () => {
      isDragging = false;
      activeFrame = null;
    };

    bar.addEventListener("mousedown", startDrag);
    bar.addEventListener("touchstart", startDrag, {passive:false});
    window.addEventListener("mousemove", dragMove);
    window.addEventListener("touchmove", dragMove, {passive:false});
    window.addEventListener("mouseup", endDrag);
    window.addEventListener("touchend", endDrag);
  });
});
