/**
 * Mahmoudverse - Realistic Sci-Fi Script
 * Handles: Realistic Parallax, Natural Blinking,
 * Ambient Space Effects, and Immersive UI.
 */

document.addEventListener('DOMContentLoaded', () => {
    const eyesContainer = document.getElementById('eyesContainer');
    const particlesContainer = document.getElementById('particlesContainer');
    const shootingStarsContainer = document.getElementById('shootingStarsContainer');

    // --- Mouse Tracking & Parallax ---
    let mouseX = 0;
    let mouseY = 0;
    let currentX = 0;
    let currentY = 0;

    document.addEventListener('mousemove', (e) => {
        // Normalize mouse positions to -1 to 1
        mouseX = (e.clientX / window.innerWidth) * 2 - 1;
        mouseY = (e.clientY / window.innerHeight) * 2 - 1;
    });

    function updateParallax() {
        // Smoothly interpolate towards mouse position
        // This gives that "slowly following" emotional feel
        currentX += (mouseX - currentX) * 0.03;
        currentY += (mouseY - currentY) * 0.03;

        // Apply transform to the container
        // Subtle tilt and shift
        if (eyesContainer) {
            eyesContainer.style.transform = `
                translate(${currentX * 15}px, ${currentY * 10}px)
                rotateY(${currentX * 5}deg)
                rotateX(${-currentY * 5}deg)
            `;
        }

        requestAnimationFrame(updateParallax);
    }

    // --- Natural Blinking Logic ---
    function triggerBlink() {
        if (!eyesContainer) return;
        
        eyesContainer.classList.add('blink');
        
        // Random blink duration (mimicking real eye behavior)
        const blinkDuration = 100 + Math.random() * 150;
        
        setTimeout(() => {
            eyesContainer.classList.remove('blink');
        }, blinkDuration);

        // Schedule next blink randomly (between 3 to 10 seconds)
        const nextBlink = 3000 + Math.random() * 7000;
        setTimeout(triggerBlink, nextBlink);
    }

    // --- Space Particles ---
    function initParticles() {
        if (!particlesContainer) return;
        const count = 50;
        
        for (let i = 0; i < count; i++) {
            const p = document.createElement('div');
            p.className = 'particle';
            
            const size = Math.random() * 3;
            const x = Math.random() * 100;
            const y = Math.random() * 100;
            const duration = 20 + Math.random() * 40;
            const delay = -Math.random() * 40;

            p.style.width = `${size}px`;
            p.style.height = `${size}px`;
            p.style.left = `${x}vw`;
            p.style.top = `${y}vh`;
            p.style.opacity = Math.random() * 0.4;
            
            // Subtle floating movement
            p.animate([
                { transform: 'translate(0, 0)', opacity: 0 },
                { transform: `translate(${(Math.random() - 0.5) * 50}px, ${(Math.random() - 0.5) * 50}px)`, opacity: 0.4, offset: 0.5 },
                { transform: `translate(${(Math.random() - 0.5) * 100}px, ${(Math.random() - 0.5) * 100}px)`, opacity: 0 }
            ], {
                duration: duration * 1000,
                delay: delay * 1000,
                iterations: Infinity,
                easing: 'ease-in-out'
            });

            particlesContainer.appendChild(p);
        }
    }

    // --- Shooting Stars ---
    function spawnShootingStar() {
        if (!shootingStarsContainer) return;
        
        const star = document.createElement('div');
        star.className = 'shooting-star';
        
        const startX = Math.random() * window.innerWidth;
        const startY = Math.random() * window.innerHeight * 0.4;
        const angle = 30 + Math.random() * 30;
        
        star.style.left = `${startX}px`;
        star.style.top = `${startY}px`;
        star.style.transform = `rotate(${angle}deg)`;

        shootingStarsContainer.appendChild(star);

        const duration = 800 + Math.random() * 1200;
        
        star.animate([
            { transform: `rotate(${angle}deg) translateX(0)`, opacity: 0 },
            { transform: `rotate(${angle}deg) translateX(0)`, opacity: 1, offset: 0.1 },
            { transform: `rotate(${angle}deg) translateX(-500px)`, opacity: 0 }
        ], {
            duration: duration,
            easing: 'linear'
        }).onfinish = () => star.remove();

        // Random interval for shooting stars
        setTimeout(spawnShootingStar, 4000 + Math.random() * 12000);
    }

    // --- Init ---
    updateParallax();
    setTimeout(triggerBlink, 2000); // Initial blink delay
    initParticles();
    spawnShootingStar();
});
