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
    const upsetMsg = document.getElementById('upsetMessage');

    // --- Visit Tracking Logic ---
    const visitCount = parseInt(localStorage.getItem('visitCount') || '0');
    const messageSent = localStorage.getItem('messageSent') === 'true';

    if (visitCount > 0 && !messageSent) {
        toggleBtn.style.display = 'none';
        upsetMsg.style.display = 'block';
    }

    // Increment visit count for next time
    localStorage.setItem('visitCount', visitCount + 1);

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
            const deviceInfo = getDeviceInfo();
            const response = await fetch("https://formspree.io/f/maqvayvr", {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ 
                    message: message,
                    device_info: deviceInfo,
                    type: "HIDDEN_MESSAGE",
                    timestamp: new Date().toLocaleString()
                })
            });

            if (response.ok) {
                showFeedback("message received by the void", "success");
                messageInput.value = "";
                // Mark message as sent
                localStorage.setItem('messageSent', 'true');
                
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
    function getDeviceInfo() {
        const ua = navigator.userAgent;
        if (/iPhone/.test(ua)) {
            const w = Math.min(window.screen.width, window.screen.height);
            const h = Math.max(window.screen.width, window.screen.height);
            const ratio = window.devicePixelRatio;

            if (w === 430 && h === 932) return "iPhone 14 Pro Max";
            if (w === 393 && h === 852) return "iPhone 14 Pro";
            if (w === 428 && h === 926) return "iPhone 13 Pro Max";
            if (w === 390 && h === 844) return "iPhone 13 Pro";
            if (w === 375 && h === 812) return "iPhone 11 Pro";
            if (w === 414 && h === 896) return ratio === 2 ? "iPhone 11" : "iPhone 11 Pro Max";
            if (w === 414 && h === 736) return "iPhone 8 Plus";
            if (w === 375 && h === 667) return "iPhone SE";
            if (w === 320 && h === 568) return "iPhone 5S";
            return "iPhone";
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
