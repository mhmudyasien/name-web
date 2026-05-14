/**
 * Mahmoudverse - Cinematic Script
 * Handles: Mouse tracking, Blinking, Random Eye Movement, 
 * Ambient Particles, and Shooting Stars.
 */

document.addEventListener('DOMContentLoaded', () => {
    const eyes = document.querySelectorAll('.eye-container');
    const irises = document.querySelectorAll('.iris');
    const shootingStarsContainer = document.getElementById('shootingStarsContainer');
    const particlesContainer = document.getElementById('particlesContainer');

    // --- State ---
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    // --- Mouse Tracking ---
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    // --- Eye Logic ---
    function updateEyes() {
        // Calculate the distance and angle for eye tracking
        eyes.forEach((eye, index) => {
            const iris = irises[index];
            const rect = eye.getBoundingClientRect();
            const eyeCenterX = rect.left + rect.width / 2;
            const eyeCenterY = rect.top + rect.height / 2;

            const angle = Math.atan2(mouseY - eyeCenterY, mouseX - eyeCenterX);
            const dist = Math.min(Math.hypot(mouseX - eyeCenterX, mouseY - eyeCenterY) / 15, 12);

            // Calculate target offset
            const tx = Math.cos(angle) * dist;
            const ty = Math.sin(angle) * dist;

            // Smooth interpolation for "emotional tiredness"
            currentX += (tx - currentX) * 0.05;
            currentY += (ty - currentY) * 0.05;

            iris.style.transform = `translate(${currentX}px, ${currentY}px)`;
            
            // Subtle container rotation
            eye.style.transform = `rotateX(${-currentY * 0.5}deg) rotateY(${currentX * 0.5}deg)`;
        });

        requestAnimationFrame(updateEyes);
    }

    // --- Random Blinking ---
    function blink() {
        eyes.forEach(eye => eye.classList.add('blink'));
        
        // Duration of a blink
        setTimeout(() => {
            eyes.forEach(eye => eye.classList.remove('blink'));
        }, 150);

        // Schedule next blink randomly (between 3 to 8 seconds)
        const nextBlink = 3000 + Math.random() * 5000;
        setTimeout(blink, nextBlink);
    }

    // --- Random Pupil Look (Occasional wandering) ---
    function wander() {
        // Only wander if mouse hasn't moved much recently
        // For simplicity, we just add a random bias every few seconds
        const biasX = (Math.random() - 0.5) * 10;
        const biasY = Math.random() * 5; // Look slightly down more often (tired)
        
        targetX = biasX;
        targetY = biasY;

        setTimeout(wander, 2000 + Math.random() * 4000);
    }

    // --- Ambient Particles ---
    function initParticles() {
        const count = 40;
        for (let i = 0; i < count; i++) {
            createParticle();
        }
    }

    function createParticle() {
        const p = document.createElement('div');
        p.className = 'particle';
        
        const size = Math.random() * 2 + 1;
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        const duration = 10 + Math.random() * 20;
        const delay = -Math.random() * 20;

        p.style.width = `${size}px`;
        p.style.height = `${size}px`;
        p.style.left = `${x}vw`;
        p.style.top = `${y}vh`;
        p.style.opacity = Math.random() * 0.3;
        
        // Floating animation
        p.animate([
            { transform: `translate(0, 0)`, opacity: 0 },
            { transform: `translate(${(Math.random() - 0.5) * 100}px, ${(Math.random() - 0.5) * 100}px)`, opacity: 0.3 },
            { transform: `translate(${(Math.random() - 0.5) * 200}px, ${(Math.random() - 0.5) * 200}px)`, opacity: 0 }
        ], {
            duration: duration * 1000,
            delay: delay * 1000,
            iterations: Infinity,
            easing: 'ease-in-out'
        });

        particlesContainer.appendChild(p);
    }

    // --- Shooting Stars ---
    function spawnShootingStar() {
        const star = document.createElement('div');
        star.className = 'shooting-star';
        
        const startX = Math.random() * window.innerWidth;
        const startY = Math.random() * window.innerHeight * 0.5;
        const angle = 45; // Fixed diagonal path
        
        star.style.left = `${startX}px`;
        star.style.top = `${startY}px`;
        star.style.transform = `rotate(${angle}deg)`;

        shootingStarsContainer.appendChild(star);

        const duration = 1000 + Math.random() * 1000;
        
        star.animate([
            { transform: `rotate(${angle}deg) translateX(0)`, opacity: 0 },
            { transform: `rotate(${angle}deg) translateX(0)`, opacity: 1, offset: 0.1 },
            { transform: `rotate(${angle}deg) translateX(-400px)`, opacity: 0 }
        ], {
            duration: duration,
            easing: 'linear'
        }).onfinish = () => star.remove();

        setTimeout(spawnShootingStar, 5000 + Math.random() * 10000);
    }

    // --- Init ---
    updateEyes();
    blink();
    wander();
    initParticles();
    spawnShootingStar();
});
