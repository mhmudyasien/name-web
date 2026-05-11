document.addEventListener('DOMContentLoaded', () => {
    const nameInput = document.getElementById('nameInput');
    const submitBtn = document.getElementById('submitBtn');
    const notifyBtn = document.getElementById('notifyBtn');
    const feedbackMessage = document.getElementById('feedbackMessage');
    const heartsContainer = document.getElementById('heartsContainer');
    const alienContainer = document.getElementById('alienContainer');

    function getDeviceName() {
        const ua = navigator.userAgent;
        if (/iPhone/.test(ua)) {
            // Infer iPhone model based on logical screen resolution and pixel ratio
            const w = Math.min(window.screen.width, window.screen.height);
            const h = Math.max(window.screen.width, window.screen.height);
            const ratio = window.devicePixelRatio;

            if (w === 430 && h === 932) return "iPhone 14 Pro Max / 15 Plus / 15 Pro Max";
            if (w === 393 && h === 852) return "iPhone 14 Pro / 15 / 15 Pro";
            if (w === 428 && h === 926) return "iPhone 12 Pro Max / 13 Pro Max / 14 Plus";
            if (w === 390 && h === 844) return "iPhone 12 / 12 Pro / 13 / 13 Pro / 14";
            if (w === 375 && h === 812) return "iPhone X / XS / 11 Pro / 12 mini / 13 mini";
            if (w === 414 && h === 896) return ratio === 2 ? "iPhone XR / 11" : "iPhone XS Max / 11 Pro Max";
            if (w === 414 && h === 736) return "iPhone 6/7/8 Plus";
            if (w === 375 && h === 667) return "iPhone 6/7/8 / SE (2nd/3rd gen)";
            if (w === 320 && h === 568) return "iPhone 5/5S / SE (1st gen)";
            return "iPhone (New or Unknown)";
        }
        if (/iPad/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)) {
            return "iPad";
        }
        if (/Android/.test(ua)) {
            const match = ua.match(/Android.*?; (.*?) Build/);
            return match ? `Android (${match[1]})` : "Android Device";
        }
        if (/Mac/.test(ua)) return "MacBook / Mac";
        if (/Windows/.test(ua)) return "Windows PC";
        
        return "Unknown Device";
    }

    // Automatically notify you when someone visits the site (once per session to avoid spam)
    if (!sessionStorage.getItem('visitorNotified')) {
        try {
            const deviceInfo = getDeviceName();
            const platformInfo = navigator.platform || 'Unknown';
            
            fetch("https://formspree.io/f/mlgzaejg", {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ 
                    message: "A new visitor has just arrived on the website! 👀",
                    device_info: deviceInfo,
                    platform: platformInfo,
                    timestamp: new Date().toLocaleString()
                })
            });
            sessionStorage.setItem('visitorNotified', 'true');
        } catch (e) {
            // Silently ignore errors
        }
    }

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
        const originalName = nameInput.value.trim();
        
        if (name === '') {
            showFeedback("enter a name first", "error");
            return;
        }

        // Silently notify the owner about the name attempt
        try {
            const deviceInfo = getDeviceName();
            
            fetch("https://formspree.io/f/mlgzaejg", {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ 
                    message: `Someone just tried to log in using the name: "${originalName}" 🕵️‍♂️`,
                    device_info: deviceInfo,
                    timestamp: new Date().toLocaleString()
                })
            });
        } catch (e) {
            // Silently ignore
        }

        if (name === 'habiba') {
            // Success
            showFeedback("mahmoud really loves u fr :) and will marry u isa :')", "success");
            playSuccessSound();
            createHearts();
            
            // Show notify button
            notifyBtn.classList.add('visible');
            notifyBtn.textContent = "tell him i'm here 💌";
            notifyBtn.disabled = false;
        } else {
            // Failure
            notifyBtn.classList.remove('visible');
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
            notifyBtn.classList.remove('visible');
            nameInput.style.borderBottomColor = 'rgba(138, 43, 226, 0.4)';
        }
    });

    // Notify Button Logic (Formspree)
    notifyBtn.addEventListener('click', async () => {
        notifyBtn.disabled = true;
        notifyBtn.textContent = "sending...";
        
        try {
            const response = await fetch("https://formspree.io/f/mlgzaejg", {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ 
                    message: "Habiba is on the website right now and clicked the button! 💖",
                    timestamp: new Date().toLocaleString()
                })
            });
            
            if (response.ok) {
                notifyBtn.textContent = "notification sent! ✨";
            } else {
                notifyBtn.textContent = "error sending :(";
                notifyBtn.disabled = false;
            }
        } catch (e) {
            notifyBtn.textContent = "error sending :(";
            notifyBtn.disabled = false;
        }
    });
});
