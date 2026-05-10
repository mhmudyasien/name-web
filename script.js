document.addEventListener('DOMContentLoaded', () => {
    const mainContent = document.getElementById('mainContent');
    const nameInput = document.getElementById('nameInput');
    const submitBtn = document.getElementById('submitBtn');
    const errorMessage = document.getElementById('errorMessage');
    const successPopup = document.getElementById('successPopup');

    const wrongMessages = [
        "wrong galaxy bro :/",
        "nah u not her :')",
        "access denied.",
        "identity not recognized.",
        "404: habiba not found."
    ];

    // Function to play a soft futuristic hum
    function playSuccessSound() {
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (!AudioContext) return;
            
            const audioCtx = new AudioContext();
            const masterGain = audioCtx.createGain();
            masterGain.connect(audioCtx.destination);
            
            // Soft envelope
            masterGain.gain.setValueAtTime(0, audioCtx.currentTime);
            masterGain.gain.linearRampToValueAtTime(0.15, audioCtx.currentTime + 1);
            masterGain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 4);

            // Ethereal chord
            const frequencies = [261.63, 329.63, 392.00, 523.25]; // C4, E4, G4, C5
            
            frequencies.forEach((freq, index) => {
                const osc = audioCtx.createOscillator();
                // Mix of sine and triangle for a soft electronic feel
                osc.type = index % 2 === 0 ? 'sine' : 'triangle'; 
                osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
                
                const oscGain = audioCtx.createGain();
                oscGain.gain.value = 0.5;
                
                osc.connect(oscGain);
                oscGain.connect(masterGain);
                
                osc.start(audioCtx.currentTime);
                osc.stop(audioCtx.currentTime + 5);
            });
            
        } catch (e) {
            console.log("Audio not supported or blocked", e);
        }
    }

    function handleSubmission() {
        const name = nameInput.value.trim().toLowerCase();
        
        if (name === '') {
            showError("awaiting input...");
            return;
        }

        if (name === 'habiba') {
            // Success
            errorMessage.classList.remove('visible');
            mainContent.style.opacity = '0';
            mainContent.style.pointerEvents = 'none';
            
            setTimeout(() => {
                successPopup.classList.add('active');
                playSuccessSound();
            }, 1000); // Wait for main content to fade out
            
        } else {
            // Failure
            const randomMsg = wrongMessages[Math.floor(Math.random() * wrongMessages.length)];
            showError(randomMsg);
            
            // Glitch effect on input text momentarily
            nameInput.style.color = '#ff4d4d';
            nameInput.style.textShadow = '0 0 10px rgba(255, 77, 77, 0.8)';
            
            setTimeout(() => {
                nameInput.style.color = '#ffffff';
                nameInput.style.textShadow = '0 0 5px rgba(255, 255, 255, 0.3)';
            }, 400);
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
            nameInput.style.color = '#ffffff';
            nameInput.style.textShadow = '0 0 5px rgba(255, 255, 255, 0.3)';
        }
    });
});
