/**
 * Mahmoudverse v2.5.0
 * Atmospheric Terminal Logic
 */

document.addEventListener('DOMContentLoaded', () => {
    const eyesContainer = document.getElementById('eyesContainer');
    const shootingStarsContainer = document.getElementById('shootingStarsContainer');

    // --- Subtle Mouse Parallax ---
    let mouseX = 0;
    let mouseY = 0;
    let currentX = 0;
    let currentY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX / window.innerWidth) * 2 - 1;
        mouseY = (e.clientY / window.innerHeight) * 2 - 1;
    });

    function updateParallax() {
        currentX += (mouseX - currentX) * 0.02;
        currentY += (mouseY - currentY) * 0.02;

        if (eyesContainer) {
            // Very subtle movement to maintain the "movie poster" look
            eyesContainer.style.transform = `translate(${currentX * 10}px, ${currentY * 5}px)`;
        }
        requestAnimationFrame(updateParallax);
    }

    // --- Natural Blinking ---
    function triggerBlink() {
        if (!eyesContainer) return;
        eyesContainer.classList.add('blink');
        setTimeout(() => {
            eyesContainer.classList.remove('blink');
        }, 120);
        setTimeout(triggerBlink, 3000 + Math.random() * 6000);
    }

    // --- Cinematic Shooting Stars ---
    function spawnShootingStar() {
        if (!shootingStarsContainer) return;
        
        const star = document.createElement('div');
        star.className = 'shooting-star';
        
        // Random starting positions (mostly from top right to match photo style)
        const startX = Math.random() * window.innerWidth;
        const startY = Math.random() * (window.innerHeight * 0.7);
        const angle = 45; // Diagonal
        
        star.style.left = `${startX}px`;
        star.style.top = `${startY}px`;
        star.style.transform = `rotate(${angle}deg)`;

        shootingStarsContainer.appendChild(star);

        const duration = 1500 + Math.random() * 1000;
        
        star.animate([
            { transform: `rotate(${angle}deg) translateX(0)`, opacity: 0 },
            { transform: `rotate(${angle}deg) translateX(0)`, opacity: 1, offset: 0.1 },
            { transform: `rotate(${angle}deg) translateX(-600px)`, opacity: 0 }
        ], {
            duration: duration,
            easing: 'linear'
        }).onfinish = () => star.remove();

        setTimeout(spawnShootingStar, 3000 + Math.random() * 8000);
    }

    // --- Init ---
    updateParallax();
    setTimeout(triggerBlink, 2000);
    spawnShootingStar();
    
    // Add multiple stars initially for that "starfield" density
    for(let i=0; i<3; i++) {
        setTimeout(spawnShootingStar, i * 2000);
    }
});
