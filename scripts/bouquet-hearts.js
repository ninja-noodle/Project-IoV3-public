document.addEventListener('DOMContentLoaded', () => {
    const bouquet = document.getElementById('bouquet');

    if (bouquet) {
        bouquet.addEventListener('click', (e) => {
            // Get exact click location (or fallback to bouquet center)
            const x = e.clientX || bouquet.getBoundingClientRect().left + bouquet.offsetWidth / 2;
            const y = e.clientY || bouquet.getBoundingClientRect().top + bouquet.offsetHeight / 2;

            // Spawn 18 heart particles in a burst pattern
            for (let i = 0; i < 18; i++) {
                spawnHeart(x, y);
            }
        });
    }
});

function spawnHeart(x, y) {
    const heart = document.createElement('div');
    heart.className = 'heart-particle';

    // Heart emoji variants matching your theme
    const hearts = ['❤️', '💖', '💕', '💗', '🌸', '✨'];
    heart.innerText = hearts[Math.floor(Math.random() * hearts.length)];

    // Calculate random burst directions
    const angle = Math.random() * Math.PI * 2;
    const distance = 80 + Math.random() * 100;
    const tx = `${Math.cos(angle) * distance}px`;
    const ty = `${Math.sin(angle) * distance}px`;
    const tr = `${(Math.random() - 0.5) * 60}deg`;

    heart.style.left = `${x}px`;
    heart.style.top = `${y}px`;
    heart.style.setProperty('--tx', tx);
    heart.style.setProperty('--ty', ty);
    heart.style.setProperty('--tr', tr);

    document.body.appendChild(heart);

    // Clean up element after animation finishes
    setTimeout(() => {
        heart.remove();
    }, 1200);
}