/* ==========================================
   INTERACTIVE LOGIC (BALLOONS & BIG CONFETTI)
   ========================================== */

// 1. BALLOON GENERATOR ON SECTION LANDING
const balloonContainer = document.getElementById('balloon-container');
const cakeSection = document.getElementById('cake');
let balloonsTriggered = false;

const balloonColors = ['#ffcad4', '#ffedd8', '#b7e4c7', '#e5989b', '#f7d6e0', '#d8e2dc'];

function spawnBalloons() {
    if (balloonsTriggered) return;
    balloonsTriggered = true;

    for (let i = 0; i < 20; i++) {
        setTimeout(() => {
            const balloon = document.createElement('div');
            balloon.className = 'balloon';

            const randomColor = balloonColors[Math.floor(Math.random() * balloonColors.length)];
            const randomLeft = Math.random() * 90 + 5; // 5% to 95%
            const randomDuration = Math.random() * 3 + 6; // 6s - 9s
            const randomScale = Math.random() * 0.5 + 0.8; // 0.8x - 1.3x

            balloon.style.backgroundColor = randomColor;
            balloon.style.left = `${randomLeft}%`;
            balloon.style.animationDuration = `${randomDuration}s`;
            balloon.style.transform = `scale(${randomScale})`;

            balloonContainer.appendChild(balloon);

            // Clean up after animation
            setTimeout(() => balloon.remove(), randomDuration * 1000);
        }, i * 250); // Staggered spawn
    }
}

// Observer to detect when user lands on #cake section
const observer = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                spawnBalloons();
            }
        });
    },
    { threshold: 0.4 }
);

observer.observe(cakeSection);


// 2. BIG CONFETTI EXPLOSION SYSTEM
const canvas = document.getElementById('confetti-canvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

let confettiParticles = [];

class ConfettiParticle {
    constructor() {
        this.x = canvas.width / 2;
        this.y = canvas.height / 2 + 50;

        // Large explosion physics
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 18 + 8; // High blast velocity
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed - Math.random() * 6;

        // Big particle sizing
        this.size = Math.random() * 12 + 8; // 8px to 20px particles
        this.color = ['#ff6b6b', '#ffd166', '#06d6a0', '#118ab2', '#ff85a1', '#ffffff', '#b57edc'][
            Math.floor(Math.random() * 7)
        ];
        this.rotation = Math.random() * 360;
        this.rotationSpeed = (Math.random() - 0.5) * 10;
        this.gravity = 0.25;
        this.drag = 0.96;
        this.opacity = 1;
    }

    update() {
        this.vx *= this.drag;
        this.vy *= this.drag;
        this.vy += this.gravity;
        this.x += this.vx;
        this.y += this.vy;
        this.rotation += this.rotationSpeed;
        this.opacity -= 0.006;
    }

    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate((this.rotation * Math.PI) / 180);
        ctx.globalAlpha = Math.max(this.opacity, 0);
        ctx.fillStyle = this.color;

        // Draw enlarged rectangular / ribbon confetti piece
        ctx.fillRect(-this.size / 2, -this.size / 4, this.size, this.size / 2);
        ctx.restore();
    }
}

function triggerBigConfetti() {
    confettiParticles = [];

    // Generate 180 large confetti particles
    for (let i = 0; i < 180; i++) {
        confettiParticles.push(new ConfettiParticle());
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        confettiParticles.forEach((p, index) => {
            p.update();
            p.draw();
            if (p.opacity <= 0) confettiParticles.splice(index, 1);
        });

        if (confettiParticles.length > 0) {
            requestAnimationFrame(animate);
        }
    }

    animate();
}

const wishBtn = document.getElementById('wish-btn');
const btnProgress = document.getElementById('btn-progress');
const btnText = document.getElementById('btn-text');
const flame = document.getElementById('main-flame');
const messageSection = document.getElementById('message-section');

let holdTimer = null;
const HOLD_DURATION = 2000; // Time in milliseconds (2 seconds)
let isCompleted = false;

function startHold(e) {
    if (isCompleted) return;
    e.preventDefault();

    wishBtn.classList.add('holding');

    // Animate progress fill across 2 seconds
    btnProgress.style.transition = `width ${HOLD_DURATION}ms linear`;
    btnProgress.style.width = '100%';

    // Set timer to trigger completion
    holdTimer = setTimeout(() => {
        completeHold();
    }, HOLD_DURATION);
}

function cancelHold() {
    if (isCompleted) return;

    clearTimeout(holdTimer);
    wishBtn.classList.remove('holding');

    // Smoothly empty progress bar if released early
    btnProgress.style.transition = 'width 0.2s ease-out';
    btnProgress.style.width = '0%';
}

function completeHold() {
    isCompleted = true;
    wishBtn.classList.remove('holding');
    wishBtn.classList.add('completed');

    // 1. Update UI & trigger blow-out
    btnText.innerText = 'Wish Made!';
    flame.classList.add('out');
    triggerBigConfetti();

    // 2. Navigate to the new message section after brief delay
    setTimeout(async () => {
        await window.decryptSection('#message-section');

        navigateSections('#cake', '#message-section', false);
        document.body.style.padding = '0 8px';
        document.documentElement.style.padding = '0 8px';
    }, 1200);
}

// Mouse Events
wishBtn.addEventListener('mousedown', startHold);
wishBtn.addEventListener('mouseup', cancelHold);
wishBtn.addEventListener('mouseleave', cancelHold);

// Touch Events (Mobile Support)
wishBtn.addEventListener('touchstart', startHold);
wishBtn.addEventListener('touchend', cancelHold);
wishBtn.addEventListener('touchcancel', cancelHold);