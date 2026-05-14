/**
 * MAHMOUDVERSE v3.0.0
 * Hidden Message Interaction Logic
 */

document.addEventListener('DOMContentLoaded', () => {
    const toggleBtn = document.getElementById('toggleMessageBtn');
    const modal = document.getElementById('messageModal');
    const closeBtn = document.getElementById('closeBtn');
    const sendBtn = document.getElementById('sendBtn');
    const messageInput = document.getElementById('hiddenMessage');
    const feedback = document.getElementById('feedback');

    // --- Modal Logic ---
    toggleBtn.addEventListener('click', () => {
        modal.classList.add('active');
        messageInput.focus();
    });

    closeBtn.addEventListener('click', () => {
        modal.classList.remove('active');
        resetFeedback();
    });

    // Close on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            modal.classList.remove('active');
            resetFeedback();
        }
    });

    // --- Message Submission ---
    sendBtn.addEventListener('click', async () => {
        const message = messageInput.value.trim();
        
        if (!message) {
            showFeedback("empty message cannot be sent", "error");
            return;
        }

        setLoading(true);

        try {
            const response = await fetch("https://formspree.io/f/maqvayvr", {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ 
                    message: message,
                    type: "HIDDEN_MESSAGE",
                    timestamp: new Date().toLocaleString()
                })
            });

            if (response.ok) {
                showFeedback("message received by the void", "success");
                messageInput.value = "";
                setTimeout(() => {
                    modal.classList.remove('active');
                    resetFeedback();
                }, 2000);
            } else {
                throw new Error("Failed to send");
            }
        } catch (error) {
            showFeedback("transmission failed. try again.", "error");
        } finally {
            setLoading(false);
        }
    });

    // --- Helpers ---
    function showFeedback(msg, type) {
        feedback.textContent = msg;
        feedback.style.color = type === 'error' ? '#ff0000' : '#ffffff';
        feedback.classList.add('visible');
    }

    function resetFeedback() {
        feedback.classList.remove('visible');
        setTimeout(() => { feedback.textContent = ""; }, 300);
    }

    function setLoading(isLoading) {
        sendBtn.disabled = isLoading;
        sendBtn.textContent = isLoading ? "sending..." : "execute";
        sendBtn.style.opacity = isLoading ? "0.5" : "1";
    }
});
