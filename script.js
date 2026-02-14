
function createFloatingHearts() {
    const heartsContainer = document.querySelector('.hearts-container');
    const hearts = ['❤️', '💕', '💖', '💗', '💝'];
    
    function createHeart() {
        const heart = document.createElement('div');
        heart.className = 'heart';
        heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
        heart.style.left = Math.random() * 100 + '%';
        heart.style.animationDuration = (Math.random() * 10 + 10) + 's';
        heart.style.animationDelay = Math.random() * 2 + 's';
        heart.style.fontSize = (Math.random() * 1.5 + 1.5) + 'rem';
        
        heartsContainer.appendChild(heart);
        
        setTimeout(() => {
            heart.remove();
        }, 25000);
    }
    
    // Create hearts periodically
    setInterval(createHeart, 500);
    
    // Create initial hearts
    for (let i = 0; i < 5; i++) {
        createHeart();
    }
}

// Celebrate button with popup message
function celebrateClick() {
    // Play explosion sound
    const explosionSound = new Audio('explosion.mp3');
    explosionSound.volume = 0.8;
    explosionSound.play().catch(err => console.log('Sound play failed:', err));
    
    const hackedNotif = document.getElementById('hackedNotif');
    hackedNotif.classList.add('active');
    
    // Auto-hide after 2.5 seconds
    setTimeout(() => {
        hackedNotif.classList.remove('active');
    }, 2500);
    
    createConfetti();
}

// Show surprise modal
function showSurprise() {
    const modal = document.getElementById('surpriseModal');
    modal.classList.add('active');
}

// Close surprise modal
function closeSurprise() {
    const modal = document.getElementById('surpriseModal');
    modal.classList.remove('active');
}

// Create confetti animation
function createConfetti() {
    const container = document.querySelector('.confetti-container');
    const colors = ['#ff1493', '#ffb3d9', '#ffc0cb', '#ff69b4', '#fff'];
    
    for (let i = 0; i < 100; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = Math.random() * window.innerWidth + 'px';
        confetti.style.top = '-10px';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.opacity = Math.random() * 0.8 + 0.2;
        
        const angle = Math.random() * Math.PI * 2;
        const velocity = Math.random() * 5 + 3;
        let x = parseFloat(confetti.style.left);
        let y = 0;
        let vx = Math.cos(angle) * velocity;
        let vy = Math.sin(angle) * velocity;
        let rotation = Math.random() * 360;
        let rotationSpeed = Math.random() * 10 + 5;
        
        container.appendChild(confetti);
        
        const animate = () => {
            y += vy;
            x += vx;
            vy += 0.1; // gravity
            rotation += rotationSpeed;
            
            confetti.style.left = x + 'px';
            confetti.style.top = y + 'px';
            confetti.style.transform = `rotate(${rotation}deg)`;
            
            if (y < window.innerHeight && x > -20 && x < window.innerWidth + 20) {
                requestAnimationFrame(animate);
            } else {
                confetti.remove();
            }
        };
        
        animate();
    }
}

// Music toggle with background music effect
function toggleMusic() {
    const audioElement = document.getElementById('bgMusic');
    const btn = event.target.closest('.btn-secondary');
    
    if (!audioElement) return;
    
    if (audioElement.paused) {
        // Play music
        audioElement.play().catch(err => console.log('Play error:', err));
        btn.style.animation = 'pulse 1s ease-in-out infinite';
    } else {
        // Pause music
        audioElement.pause();
        btn.style.animation = 'none';
    }
}

// Music Player Controls
let audioElement = null;

function initMusicPlayer() {
    audioElement = document.getElementById('bgMusic');
    const musicBtn = document.getElementById('musicBtn');
    const musicStatus = document.getElementById('musicStatus');
    const progressBar = document.querySelector('.progress-bar');
    const progress = document.getElementById('progress');
    
    if (!audioElement || !musicBtn) return;
    
    // Preload and attempt autoplay; update UI optimistically to reduce perceived delay
    try {
        audioElement.preload = 'auto';
        audioElement.load();
    } catch (e) {}

    // Optimistic UI: show playing state immediately when attempting play, revert on error
    audioElement.muted = false; // Unmute the audio
    if (musicBtn) musicBtn.classList.add('playing');
    if (musicStatus) { musicStatus.textContent = 'Playing'; musicStatus.classList.add('playing'); }

    const playPromise = audioElement.play();
    if (playPromise !== undefined) {
        playPromise.catch((error) => {
            // Auto-play blocked or failed - revert UI
            console.log('Auto-play failed:', error);
            if (musicBtn) musicBtn.classList.remove('playing');
            if (musicStatus) { musicStatus.textContent = 'Paused'; musicStatus.classList.remove('playing'); }
        });
    }
    
    // Music button toggle (bottom player)
    musicBtn.addEventListener('click', () => {
        if (audioElement.paused) {
            // Optimistically update UI first for immediate feedback
            musicBtn.classList.add('playing');
            if (musicStatus) { musicStatus.textContent = 'Playing'; musicStatus.classList.add('playing'); }
            audioElement.muted = false; // Ensure unmuted when playing
            audioElement.play().catch(err => {
                console.log('Play error:', err);
                // Revert UI on failure
                musicBtn.classList.remove('playing');
                if (musicStatus) { musicStatus.textContent = 'Paused'; musicStatus.classList.remove('playing'); }
            });
        } else {
            audioElement.pause();
            musicBtn.classList.remove('playing');
            if (musicStatus) { musicStatus.textContent = 'Paused'; musicStatus.classList.remove('playing'); }
        }
    });
    
    // Update progress bar
    audioElement.addEventListener('timeupdate', () => {
        if (audioElement.duration) {
            const percent = (audioElement.currentTime / audioElement.duration) * 100;
            progress.style.width = percent + '%';
        }
    });
    
    // Click on progress bar to seek
    progressBar.addEventListener('click', (e) => {
        if (audioElement.duration) {
            const rect = progressBar.getBoundingClientRect();
            const percent = (e.clientX - rect.left) / rect.width;
            audioElement.currentTime = percent * audioElement.duration;
        }
    });
    
    // Handle when music ends
    audioElement.addEventListener('ended', () => {
        musicBtn.classList.remove('playing');
        if (musicStatus) { musicStatus.textContent = 'Ended'; musicStatus.classList.remove('playing'); }
    });
    
    // Handle errors
    audioElement.addEventListener('error', () => {
        console.log('Audio file not found. Please ensure the audio file exists.');
    });
}

// Simple audio tone generator
function playTone() {
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = 523.25; // C5 note
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.5);
    } catch (e) {
        console.log('Audio context not available');
    }
}

// Interactive main heart
document.addEventListener('DOMContentLoaded', () => {
    // Hide splash screen after animation completes
    setTimeout(() => {
        const splash = document.getElementById('splashScreen');
        if (splash) {
            splash.style.pointerEvents = 'none';
        }
    }, 3600);
    
    // Wait a tiny bit for DOM to fully render, then initialize music
    setTimeout(() => {
        initMusicPlayer();
    }, 100);
    

    
    const mainHeart = document.querySelector('.main-heart');
    
    if (mainHeart) {
        mainHeart.addEventListener('click', () => {
            // Create small hearts around the main heart
            const hearts = ['❤️', '💕', '💖', '💗', '💝'];
            for (let i = 0; i < 5; i++) {
                const heart = document.createElement('div');
                heart.className = 'heart';
                heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
                heart.style.position = 'fixed';
                heart.style.left = mainHeart.getBoundingClientRect().left + 75 + 'px';
                heart.style.top = mainHeart.getBoundingClientRect().top + 75 + 'px';
                heart.style.fontSize = '1.5rem';
                heart.style.zIndex = '100';
                heart.style.pointerEvents = 'none';
                document.body.appendChild(heart);
                
                // Animate heart away
                let x = parseFloat(heart.style.left);
                let y = parseFloat(heart.style.top);
                const angle = (i / 5) * Math.PI * 2;
                const speed = 3;
                let vx = Math.cos(angle) * speed;
                let vy = Math.sin(angle) * speed;
                let life = 1;
                
                const animate = () => {
                    x += vx;
                    y += vy;
                    vy += 0.1;
                    life -= 0.02;
                    
                    heart.style.left = x + 'px';
                    heart.style.top = y + 'px';
                    heart.style.opacity = life;
                    
                    if (life > 0) {
                        requestAnimationFrame(animate);
                    } else {
                        heart.remove();
                    }
                };
                
                animate();
            }
            
            // Play a tone
            playTone();
        });
    }
    
    // Create floating hearts
    createFloatingHearts();
    
    // Add glow effect on mouse move
    document.addEventListener('mousemove', (e) => {
        const container = document.querySelector('.container');
        if (container) {
            const rect = container.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            container.style.boxShadow = `
                0 20px 60px rgba(0, 0, 0, 0.3),
                ${(x - rect.width / 2) / 100}px ${(y - rect.height / 2) / 100}px 30px rgba(255, 20, 147, 0.3)
            `;
        }
    });
    
    // Close modal on background click
    document.getElementById('surpriseModal').addEventListener('click', (e) => {
        if (e.target.id === 'surpriseModal') {
            closeSurprise();
        }
    });
});

// Add CSS for pulse animation dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes pulse {
        0%, 100% {
            transform: scale(1);
        }
        50% {
            transform: scale(1.05);
        }
    }
`;
document.head.appendChild(style);
