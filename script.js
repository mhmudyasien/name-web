document.addEventListener('DOMContentLoaded', () => {
    const nameInput = document.getElementById('nameInput');
    const submitBtn = document.getElementById('submitBtn');
    const feedbackMessage = document.getElementById('feedbackMessage');
    const heartsContainer = document.getElementById('heartsContainer');
    const alienContainer = document.getElementById('alienContainer');

    const wrongMessages = [
        "wrong galaxy bro :/",
        "access denied my guy :')",
        "u from another planet fr"
    ];

    // Function to play a soft romantic futuristic synth chord
    function playSuccessSound() {
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (!AudioContext) return;
            
            const audioCtx = new AudioContext();
            const masterGain = audioCtx.createGain();
            masterGain.connect(audioCtx.destination);
            
            masterGain.gain.setValueAtTime(0, audioCtx.currentTime);
            masterGain.gain.linearRampToValueAtTime(0.2, audioCtx.currentTime + 1.5);
            masterGain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 6);

            // Romantic lush chord (Maj7)
            const frequencies = [261.63, 329.63, 392.00, 493.88]; // C4, E4, G4, B4
            
            frequencies.forEach((freq, index) => {
                const osc = audioCtx.createOscillator();
                osc.type = 'sine'; 
                
                // Add slight detune for a futuristic lush feel
                osc.detune.value = index * 5; 
                osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
                
                const oscGain = audioCtx.createGain();
                oscGain.gain.value = 0.4;
                
                osc.connect(oscGain);
                oscGain.connect(masterGain);
                
                osc.start(audioCtx.currentTime);
                osc.stop(audioCtx.currentTime + 7);
            });
            
        } catch (e) {
            console.log("Audio not supported or blocked", e);
        }
    }

    function playErrorSound() {
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (!AudioContext) return;
            
            const audioCtx = new AudioContext();
            const masterGain = audioCtx.createGain();
            masterGain.connect(audioCtx.destination);
            
            // Short, punchy envelope for an error "buzz"
            masterGain.gain.setValueAtTime(0, audioCtx.currentTime);
            masterGain.gain.linearRampToValueAtTime(0.2, audioCtx.currentTime + 0.05);
            masterGain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.4);

            // Dissonant, low frequencies for an electronic error sound
            const frequencies = [120, 125];
            
            frequencies.forEach((freq) => {
                const osc = audioCtx.createOscillator();
                osc.type = 'sawtooth'; 
                osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
                
                osc.connect(masterGain);
                
                osc.start(audioCtx.currentTime);
                osc.stop(audioCtx.currentTime + 0.5);
            });
            
        } catch (e) {
            console.log("Audio not supported or blocked", e);
        }
    }

    function createHearts() {
        const numHearts = 30;
        for (let i = 0; i < numHearts; i++) {
            setTimeout(() => {
                const heart = document.createElement('div');
                heart.classList.add('heart');
                
                // Random properties
                const left = Math.random() * 100;
                const duration = 3 + Math.random() * 4;
                const scale = 0.5 + Math.random() * 1;
                
                heart.style.left = `${left}vw`;
                heart.style.animationDuration = `${duration}s`;
                heart.style.transform = `scale(${scale})`;
                
                // Alternate colors for a neon futuristic vibe
                const colors = ['#ff66b3', '#b366ff', '#ff4d4d'];
                heart.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
                
                heartsContainer.appendChild(heart);
                
                // Cleanup
                setTimeout(() => {
                    heart.remove();
                }, duration * 1000);
            }, i * 150); // Stagger creation
        }
    }

    function spawnAlien() {
        // Clear previous alien if exists
        alienContainer.innerHTML = '';
        
        const alienWrapper = document.createElement('div');
        alienWrapper.classList.add('alien-wrapper');
        
        // Simple SVG Alien
        alienWrapper.innerHTML = `
            <svg class="alien-svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <!-- Head -->
                <ellipse cx="50" cy="50" rx="40" ry="30" />
                <path d="M 10 50 Q 50 90 90 50 Z" />
                <!-- Eyes -->
                <g class="alien-eye" transform="translate(30, 45)">
                    <ellipse cx="0" cy="0" rx="8" ry="12" transform="rotate(-20)" />
                </g>
                <g class="alien-eye" transform="translate(70, 45)">
                    <ellipse cx="0" cy="0" rx="8" ry="12" transform="rotate(20)" />
                </g>
                <!-- Mouth -->
                <path d="M 45 70 Q 50 72 55 70" stroke="#000" stroke-width="2" fill="none" />
            </svg>
        `;
        
        // Randomize alien position horizontally slightly
        const offset = (Math.random() - 0.5) * 40;
        alienWrapper.style.transform = `translateX(calc(-50% + ${offset}px))`;
        
        alienContainer.appendChild(alienWrapper);
        
        // Cleanup after animation
        setTimeout(() => {
            if(alienWrapper.parentNode) {
                alienWrapper.remove();
            }
        }, 5000);
    }

    function handleSubmission() {
        const name = nameInput.value.trim().toLowerCase();
        
        if (name === '') {
            showFeedback("enter a name first", "error");
            return;
        }

        if (name === 'habiba') {
            // Success
            showFeedback("mahmoud really loves u fr :) and will marry u isa :')", "success");
            playSuccessSound();
            createHearts();
        } else {
            // Failure
            const randomMsg = wrongMessages[Math.floor(Math.random() * wrongMessages.length)];
            showFeedback(randomMsg, "error");
            
            playErrorSound();
            spawnAlien();
            
            // Input shake effect
            nameInput.classList.remove('shake');
            void nameInput.offsetWidth; // trigger reflow
            nameInput.classList.add('shake');
            
            nameInput.style.borderBottomColor = '#ff4d4d';
            
            setTimeout(() => {
                nameInput.style.borderBottomColor = 'rgba(138, 43, 226, 0.4)';
            }, 800);
        }
    }

    function showFeedback(msg, type) {
        feedbackMessage.textContent = msg;
        feedbackMessage.className = `feedback-message visible ${type}`;
    }

    // Event Listeners
    submitBtn.addEventListener('click', handleSubmission);

    nameInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleSubmission();
        }
    });
    
    // Clear error on typing
    nameInput.addEventListener('input', () => {
        if (feedbackMessage.classList.contains('visible')) {
            feedbackMessage.classList.remove('visible');
            nameInput.style.borderBottomColor = 'rgba(138, 43, 226, 0.4)';
        }
    });
});
