const openMessage = document.getElementById('openMessage');
const messageSection = document.getElementById('message');
const celebrateBtn = document.getElementById('celebrateBtn');
const toast = document.getElementById('toast');
const canvas = document.getElementById('confettiCanvas');
const ctx = canvas.getContext('2d');
const musicToggle = document.getElementById('musicToggle');
const musicLabel = document.getElementById('musicLabel');
const musicIcon = document.getElementById('musicIcon');
document.getElementById('year').textContent = new Date().getFullYear();

openMessage.addEventListener('click', () => {
  messageSection.scrollIntoView({ behavior: 'smooth' });
  messageSection.classList.add('message-highlight');
  window.setTimeout(() => messageSection.classList.remove('message-highlight'), 1300);
  launchConfetti(100);
});

let toastTimer;
function showToast(text) {
  toast.textContent = text;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2800);
}
celebrateBtn.addEventListener('click', () => {
  launchConfetti(220);
  showToast('🎉 Sending birthday blessings to Pastor David!');
});

/* A small celebratory confetti effect, with no external libraries. */
let particles = [];
let animationId = null;
function resizeCanvas() {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.floor(window.innerWidth * dpr);
  canvas.height = Math.floor(window.innerHeight * dpr);
  canvas.style.width = `${window.innerWidth}px`;
  canvas.style.height = `${window.innerHeight}px`;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

function launchConfetti(count = 150) {
  const colors = ['#d6ad55', '#fff0bd', '#244c7e', '#e9c9cf', '#ffffff', '#7898bf'];
  for (let i = 0; i < count; i++) {
    particles.push({
      x: Math.random() * window.innerWidth,
      y: -20 - Math.random() * window.innerHeight * 0.4,
      vx: (Math.random() - 0.5) * 5,
      vy: 2 + Math.random() * 4,
      size: 3 + Math.random() * 5,
      rotation: Math.random() * Math.PI,
      spin: (Math.random() - 0.5) * 0.18,
      color: colors[Math.floor(Math.random() * colors.length)],
      life: 150 + Math.random() * 80
    });
  }
  if (!animationId) animateConfetti();
}
function animateConfetti() {
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  particles = particles.filter(p => p.life > 0 && p.y < window.innerHeight + 30);
  for (const p of particles) {
    p.x += p.vx; p.y += p.vy; p.vy += 0.025;
    p.rotation += p.spin; p.life -= 1;
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rotation);
    ctx.fillStyle = p.color;
    ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 1.65);
    ctx.restore();
  }
  if (particles.length) animationId = requestAnimationFrame(animateConfetti);
  else { cancelAnimationFrame(animationId); animationId = null; ctx.clearRect(0, 0, window.innerWidth, window.innerHeight); }
}

/* The official YouTube upload is embedded rather than copied into the project.
   Browsers commonly block autoplay with sound, so it starts muted and visitors can
   tap the music button to enable sound. */
const worshipPlayer = document.getElementById('worshipPlayer');
const musicStatus = document.getElementById('musicStatus');
const youtubeBase = 'https://www.youtube-nocookie.com/embed/gqIwEbCyxBo';
let musicEnabled = false;

function setWorshipMusic(enabled) {
  musicEnabled = enabled;
  const params = new URLSearchParams({
    autoplay: '1',
    mute: enabled ? '0' : '1',
    controls: '1',
    playsinline: '1',
    loop: '1',
    playlist: 'gqIwEbCyxBo'
  });
  worshipPlayer.src = `${youtubeBase}?${params.toString()}`;
  musicToggle.setAttribute('aria-pressed', String(enabled));
  musicLabel.textContent = enabled ? 'Music on' : 'Enable music';
  musicIcon.textContent = enabled ? '♫' : '▶';
  musicStatus.textContent = enabled
    ? '♫ Playing Fragrance to Fire · Dunsin Oyekan'
    : '♫ Fragrance to Fire · Tap “Enable music” for sound';
  if (enabled) {
    launchConfetti(35);
    showToast('🙏🏽 Worship music enabled!');
  } else {
    showToast('Background music paused or muted.');
  }
}
musicToggle.addEventListener('click', () => setWorshipMusic(!musicEnabled));
