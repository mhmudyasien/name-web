/**
 * Mahmoudverse v2.5.0
 * Cosmic Singularity Logic
 */

document.addEventListener('DOMContentLoaded', () => {
    const starContainer = document.getElementById('starContainer');
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

        if (starContainer) {
            // Star "floats" subtly in response to mouse
            starContainer.style.transform = `translate(${currentX * 20}px, ${currentY * 15}px)`;
        }
        requestAnimationFrame(updateParallax);
    }

    // --- Cinematic Shooting Stars ---
    function spawnShootingStar() {
        if (!shootingStarsContainer) return;
        
        const star = document.createElement('div');
        star.className = 'shooting-star';
        
        const startX = Math.random() * window.innerWidth;
        const startY = Math.random() * (window.innerHeight * 0.7);
        const angle = 45;
        
        star.style.left = `${startX}px`;
        star.style.top = `${startY}px`;
        star.style.transform = `rotate(${angle}deg)`;

        shootingStarsContainer.appendChild(star);

        const duration = 1200 + Math.random() * 1000;
        
        star.animate([
            { transform: `rotate(${angle}deg) translateX(0)`, opacity: 0 },
            { transform: `rotate(${angle}deg) translateX(0)`, opacity: 1, offset: 0.1 },
            { transform: `rotate(${angle}deg) translateX(-800px)`, opacity: 0 }
        ], {
            duration: duration,
            easing: 'linear'
        }).onfinish = () => star.remove();

        setTimeout(spawnShootingStar, 4000 + Math.random() * 8000);
    }

    // --- Init ---
    updateParallax();
    spawnShootingStar();
    
    // Multiple stars on start
    for(let i=0; i<3; i++) {
        setTimeout(spawnShootingStar, i * 2000);
    }
});
