document.addEventListener('DOMContentLoaded', () => {
    const loginCard = document.getElementById('loginCard');
    const nameInput = document.getElementById('nameInput');
    const submitBtn = document.getElementById('submitBtn');
    const errorMessage = document.getElementById('errorMessage');
    const successPopup = document.getElementById('successPopup');

    const wrongMessages = [
        "Nah bro... wrong universe :/",
        "Access denied lil bro :')",
        "Who even are you? 🤨",
        "Error 404: Name not found in this galaxy.",
        "Imposter detected! 🚨"
    ];

    // Function to play a sweet chime sound using pure Web Audio API
    function playSuccessSound() {
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (!AudioContext) return;
            
            const audioCtx = new AudioContext();
            
            // Create a custom gain node to control overall volume and fade out
            const masterGain = audioCtx.createGain();
            masterGain.connect(audioCtx.destination);
            
            // Envelope
            masterGain.gain.setValueAtTime(0, audioCtx.currentTime);
            masterGain.gain.linearRampToValueAtTime(0.3, audioCtx.currentTime + 0.1);
            masterGain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 2.5);

            // Create sweet chords (C major arpeggio)
            const frequencies = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
            
            frequencies.forEach((freq, index) => {
                const osc = audioCtx.createOscillator();
                osc.type = 'sine';
                osc.frequency.setValueAtTime(freq, audioCtx.currentTime + (index * 0.15));
                
                const oscGain = audioCtx.createGain();
                oscGain.gain.setValueAtTime(0, audioCtx.currentTime);
                oscGain.gain.setValueAtTime(1, audioCtx.currentTime + (index * 0.15));
                oscGain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + (index * 0.15) + 2);
                
                osc.connect(oscGain);
                oscGain.connect(masterGain);
                
                osc.start(audioCtx.currentTime + (index * 0.15));
                osc.stop(audioCtx.currentTime + (index * 0.15) + 2.5);
            });
            
        } catch (e) {
            console.log("Audio not supported or blocked", e);
        }
    }

    function handleSubmission() {
        const name = nameInput.value.trim().toLowerCase();
        
        if (name === '') {
            showError("Please enter a name first.");
            return;
        }

        if (name === 'habiba') {
            // Success
            errorMessage.classList.remove('visible');
            loginCard.style.opacity = '0';
            loginCard.style.pointerEvents = 'none';
            
            setTimeout(() => {
                successPopup.classList.add('active');
                playSuccessSound();
            }, 300); // Wait for card to fade out
            
        } else {
            // Failure
            const randomMsg = wrongMessages[Math.floor(Math.random() * wrongMessages.length)];
            showError(randomMsg);
            
            // Trigger shake animation
            loginCard.classList.remove('shake');
            void loginCard.offsetWidth; // Trigger reflow to restart animation
            loginCard.classList.add('shake');
            
            // Red border on input momentarily
            nameInput.style.borderBottomColor = '#ff4d4d';
            setTimeout(() => {
                nameInput.style.borderBottomColor = 'rgba(255, 255, 255, 0.2)';
            }, 1000);
        }
    }

    function showError(msg) {
        errorMessage.textContent = msg;
        errorMessage.classList.add('visible');
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
        if (errorMessage.classList.contains('visible')) {
            errorMessage.classList.remove('visible');
            loginCard.classList.remove('shake');
            nameInput.style.borderBottomColor = 'rgba(255, 255, 255, 0.2)';
        }
    });
});
