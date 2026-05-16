/**
 * MAHMOUDVERSE v3.0.0
 * Hidden Message Interaction Logic
 */

document.addEventListener('DOMContentLoaded', () => {
    const assetList = document.getElementById('asset-list');
    
    const assets = [
        { name: 'Bitcoin', symbol: 'BTC', price: 64230.50, change: 2.4, mcap: '1.2T', icon: 'https://cryptologos.cc/logos/bitcoin-btc-logo.svg' },
        { name: 'Ethereum', symbol: 'ETH', price: 3450.20, change: -1.2, mcap: '410B', icon: 'https://cryptologos.cc/logos/ethereum-eth-logo.svg' },
        { name: 'Solana', symbol: 'SOL', price: 145.15, change: 8.5, mcap: '64B', icon: 'https://cryptologos.cc/logos/solana-sol-logo.svg' },
        { name: 'Cardano', symbol: 'ADA', price: 0.45, change: 0.5, mcap: '16B', icon: 'https://cryptologos.cc/logos/cardano-ada-logo.svg' },
        { name: 'Polkadot', symbol: 'DOT', price: 7.20, change: -3.4, mcap: '10B', icon: 'https://cryptologos.cc/logos/polkadot-new-dot-logo.svg' }
    ];

    function renderAssets() {
        assetList.innerHTML = assets.map(asset => `
            <tr>
                <td>
                    <div class="coin-info">
                        <img src="${asset.icon}" width="24" height="24">
                        <div>
                            <div style="font-weight: 600;">${asset.name}</div>
                            <div style="font-size: 0.8rem; color: var(--text-secondary);">${asset.symbol}</div>
                        </div>
                    </div>
                </td>
                <td>$${asset.price.toLocaleString()}</td>
                <td class="${asset.change >= 0 ? 'positive' : 'negative'}">
                    ${asset.change >= 0 ? '+' : ''}${asset.change}%
                </td>
                <td>$${asset.mcap}</td>
                <td>
                    <button style="background: var(--accent-primary); border: none; color: white; padding: 6px 12px; border-radius: 6px; cursor: pointer; font-size: 0.8rem;">Trade</button>
                </td>
            </tr>
        `).join('');
    }

    // Initial render
    renderAssets();

    // Simulate real-time updates
    setInterval(() => {
        assets.forEach(asset => {
            const fluctuation = (Math.random() - 0.5) * (asset.price * 0.001);
            asset.price += fluctuation;
        });
        renderAssets();
    }, 3000);

    // Count-up animation for balance
    const balanceEl = document.querySelector('.stat-value');
    let currentBalance = 120000;
    const targetBalance = 124592.40;
    const duration = 2000;
    const increment = (targetBalance - currentBalance) / (duration / 16);

    const animateBalance = () => {
        if (currentBalance < targetBalance) {
            currentBalance += increment;
            balanceEl.textContent = `$${currentBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
            requestAnimationFrame(animateBalance);
        } else {
            balanceEl.textContent = `$${targetBalance.toLocaleString()}`;
        }
    };

    animateBalance();

    // Add subtle hover effect to cards
    document.querySelectorAll('.stat-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });

    const toggleBtn = document.getElementById('toggleMessageBtn');
    const modal = document.getElementById('messageModal');
    const closeBtn = document.getElementById('closeBtn');
    const sendBtn = document.getElementById('sendBtn');
    const messageInput = document.getElementById('hiddenMessage');
    const feedback = document.getElementById('feedback');
    const upsetMsg = document.getElementById('upsetMessage');

    // --- Visit Tracking Logic ---
    // localStorage persists across sessions
    const globalVisitCount = parseInt(localStorage.getItem('globalVisitCount') || '0');
    const messageSent = localStorage.getItem('messageSent') === 'true';
    
    // sessionStorage resets when the tab is closed
    const sessionVisitCount = parseInt(sessionStorage.getItem('sessionVisitCount') || '0');

    // Show upset message if: (returned from a previous visit) AND (this is the first load of the session - not a refresh) AND (no message sent)
    if (globalVisitCount > 0 && sessionVisitCount === 0 && !messageSent) {
        toggleBtn.style.display = 'none';
        upsetMsg.style.display = 'block';
    } else {
        toggleBtn.style.display = 'block';
        upsetMsg.style.display = 'none';
    }

    // Update counts
    localStorage.setItem('globalVisitCount', globalVisitCount + 1);
    sessionStorage.setItem('sessionVisitCount', sessionVisitCount + 1);

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
