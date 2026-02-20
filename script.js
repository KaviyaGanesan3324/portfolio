<script>

const canvas = document.getElementById("animationCanvas");
const context = canvas.getContext("2d");

const frameCount = 240;
const images = [];
let currentFrameIndex = 0;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const currentFrame = index =>
  `frames/ezgif-frame-${String(index).padStart(3, '0')}.jpg`;

// Preload frames
for (let i = 1; i <= frameCount; i++) {
  const img = new Image();
  img.src = currentFrame(i);
  images.push(img);
}

images[0].onload = () => drawFrame(0);

function drawFrame(index) {
  context.clearRect(0, 0, canvas.width, canvas.height);

  // Slight glow highlight
  context.filter = "brightness(1.2) contrast(1.1)";
  context.globalAlpha = 0.5;

  context.drawImage(images[index], 0, 0, canvas.width, canvas.height);

  context.filter = "none";
}

window.addEventListener("scroll", () => {

  const scrollTop = document.documentElement.scrollTop;
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const scrollFraction = scrollTop / maxScroll;

  const frameIndex = Math.min(
    frameCount - 1,
    Math.floor(scrollFraction * frameCount)
  );

  if (frameIndex !== currentFrameIndex) {
    currentFrameIndex = frameIndex;
    requestAnimationFrame(() => drawFrame(frameIndex));
  }

});

// Resize fix
window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  drawFrame(currentFrameIndex);
});

</script>
