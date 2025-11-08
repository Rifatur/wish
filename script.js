// Audio context for sound effects
let audioContext;
let soundEnabled = true;

// Initialize audio context on first user interaction
function initAudio() {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
}

// Toggle sound on/off
function toggleSound() {
    soundEnabled = !soundEnabled;
    document.querySelector('.sound-toggle').textContent = soundEnabled ? '🔊' : '🔇';
}

// Play firework sound effect
function playFireworkSound() {
    if (!soundEnabled || !audioContext) return;
    
    try {
        // Create explosion sound
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        // Configure sound parameters
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(100, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(20, audioContext.currentTime + 0.5);
        
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
        
        // Play sound
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.5);
    } catch (e) {
        console.log("Error playing sound:", e);
    }
}

// Play launch sound effect
function playLaunchSound() {
    if (!soundEnabled || !audioContext) return;
    
    try {
        // Create launch sound
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        // Configure sound parameters
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(200, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(800, audioContext.currentTime + 0.3);
        
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
        
        // Play sound
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.3);
    } catch (e) {
        console.log("Error playing sound:", e);
    }
}

// Fireworks Animation
const canvas = document.getElementById('fireworksCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

class Firework {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.particles = [];
        this.exploded = false;
        this.velocity = {
            x: (Math.random() - 0.5) * 2,
            y: Math.random() * -15 - 10
        };
        this.gravity = 0.3;
        this.opacity = 1;
        this.hue = Math.random() * 360;
        // Added heart-shaped fireworks
        this.shape = Math.random() > 0.7 ? 'heart' : 'circle'; // 30% chance for heart shape
    }

    update() {
        if (!this.exploded) {
            this.velocity.y += this.gravity;
            this.x += this.velocity.x;
            this.y += this.velocity.y;

            if (this.velocity.y >= 0) {
                this.explode();
                // Play explosion sound when firework explodes
                playFireworkSound();
            }
        } else {
            this.particles.forEach((particle, index) => {
                particle.update();
                if (particle.opacity <= 0) {
                    this.particles.splice(index, 1);
                }
            });
        }
    }

    explode() {
        this.exploded = true;
        for (let i = 0; i < 70; i++) { // Increased particle count
            this.particles.push(new Particle(this.x, this.y, this.hue, this.shape));
        }
    }

    draw() {
        if (!this.exploded) {
            ctx.save();
            ctx.globalAlpha = this.opacity;
            ctx.fillStyle = `hsl(${this.hue}, 100%, 50%)`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        } else {
            this.particles.forEach(particle => particle.draw());
        }
    }
}

class Particle {
    constructor(x, y, hue, shape = 'circle') {
        this.x = x;
        this.y = y;
        this.velocity = {
            x: (Math.random() - 0.5) * 10,
            y: (Math.random() - 0.5) * 10
        };
        this.gravity = 0.1;
        this.opacity = 1;
        this.hue = hue + Math.random() * 30 - 15;
        this.size = Math.random() * 3 + 1;
        this.shape = shape;
        // Added fading effect
        this.fadeRate = Math.random() * 0.02 + 0.01;
    }

    update() {
        this.velocity.y += this.gravity;
        this.x += this.velocity.x;
        this.y += this.velocity.y;
        this.opacity -= this.fadeRate; // Using fade rate instead of fixed value
        this.velocity.x *= 0.98;
        this.velocity.y *= 0.98;
        
        // Added twinkle effect
        if (Math.random() > 0.95) {
            this.opacity = Math.min(1, this.opacity + 0.2);
        }
    }

    draw() {
        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = `hsl(${this.hue}, 100%, 50%)`;
        
        if (this.shape === 'heart') {
            // Draw heart shape
            this.drawHeart();
        } else {
            // Draw circle
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
        
        ctx.restore();
    }
    
    drawHeart() {
        // Heart shape drawing
        const size = this.size * 1.5;
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.bezierCurveTo(
            this.x, this.y - size * 0.7,
            this.x - size * 0.7, this.y - size * 0.7,
            this.x - size * 0.7, this.y
        );
        ctx.bezierCurveTo(
            this.x - size * 0.7, this.y + size * 0.5,
            this.x, this.y + size * 0.5,
            this.x, this.y + size
        );
        ctx.bezierCurveTo(
            this.x, this.y + size * 0.5,
            this.x + size * 0.7, this.y + size * 0.5,
            this.x + size * 0.7, this.y
        );
        ctx.bezierCurveTo(
            this.x + size * 0.7, this.y - size * 0.7,
            this.x, this.y - size * 0.7,
            this.x, this.y
        );
        ctx.fill();
    }
}

// Balloon class for canvas-based balloons
class CanvasBalloon {
    constructor() {
        this.reset();
        this.color = `hsl(${Math.random() * 360}, 70%, 60%)`;
        this.size = Math.random() * 20 + 20;
    }

    reset() {
        this.x = Math.random() * canvas.width;
        this.y = canvas.height + Math.random() * 100;
        this.speed = Math.random() * 0.5 + 0.5;
        this.wobble = 0;
        this.wobbleSpeed = Math.random() * 0.02 + 0.01;
        this.opacity = 0.8 + Math.random() * 0.2;
    }

    update() {
        this.y -= this.speed;
        this.wobble += this.wobbleSpeed;
        this.x += Math.sin(this.wobble) * 0.5;

        // Reset if balloon goes off screen
        if (this.y < -100) {
            this.reset();
        }
    }

    draw() {
        ctx.save();
        ctx.globalAlpha = this.opacity;
        
        // Draw balloon body
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw balloon highlight
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.beginPath();
        ctx.arc(this.x - this.size * 0.3, this.y - this.size * 0.3, this.size * 0.3, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw balloon string
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(this.x, this.y + this.size);
        ctx.lineTo(this.x, this.y + this.size + 40);
        ctx.stroke();
        
        ctx.restore();
    }
}

const fireworks = [];
const canvasBalloons = [];

// Create initial canvas balloons
for (let i = 0; i < 15; i++) {
    canvasBalloons.push(new CanvasBalloon());
}

function animateFireworks() {
    // Enhanced trail effect
    ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Update and draw fireworks
    fireworks.forEach((firework, index) => {
        firework.update();
        firework.draw();

        if (firework.exploded && firework.particles.length === 0) {
            fireworks.splice(index, 1);
        }
    });

    // Update and draw canvas balloons
    canvasBalloons.forEach(balloon => {
        balloon.update();
        balloon.draw();
    });

    requestAnimationFrame(animateFireworks);
}

// Launch fireworks more frequently with varied launch positions
setInterval(() => {
    if (soundEnabled) {
        //playLaunchSound(); // Play launch sound when firework is launched
    }
    fireworks.push(new Firework(
        Math.random() * canvas.width, 
        canvas.height
    ));
}, 600); // Increased frequency

// Special fireworks on special occasions
setInterval(() => {
    if (Math.random() > 0.7) { // 30% chance for special fireworks
        if (soundEnabled) {
            playLaunchSound(); // Play launch sound for special fireworks
        }
        fireworks.push(new Firework(
            Math.random() * canvas.width * 0.8 + canvas.width * 0.1, 
            canvas.height * 0.3 + Math.random() * canvas.height * 0.4
        ));
    }
}, 2000);

animateFireworks();

// Create floating balloons
function createBalloon() {
    const balloon = document.createElement('div');
    balloon.className = 'floating-element';
    balloon.style.left = Math.random() * window.innerWidth + 'px';
    balloon.style.animationDelay = Math.random() * 15 + 's';
    balloon.style.animationDuration = (15 + Math.random() * 10) + 's';
    
    const balloonInner = document.createElement('div');
    balloonInner.className = 'balloon';
    balloonInner.style.background = `hsl(${Math.random() * 360}, 70%, 60%)`;
    
    balloon.appendChild(balloonInner);
    document.body.appendChild(balloon);
    
    setTimeout(() => balloon.remove(), 25000);
}

// Create balloons periodically
setInterval(createBalloon, 2000); // Increased frequency
createBalloon(); // Create initial balloons

// Create floating hearts
function createHeart() {
    const heart = document.createElement('div');
    heart.className = 'heart floating-element';
    heart.innerHTML = '❤️';
    heart.style.left = Math.random() * window.innerWidth + 'px';
    heart.style.fontSize = (Math.random() * 20 + 15) + 'px';
    heart.style.animationDelay = Math.random() * 8 + 's';
    heart.style.animationDuration = (8 + Math.random() * 7) + 's';
    document.body.appendChild(heart);
    
    setTimeout(() => heart.remove(), 15000);
}

// Create hearts periodically
setInterval(createHeart, 1500);
createHeart(); // Create initial hearts

// Create confetti
function createConfetti() {
    const colors = ['#FFD700', '#FF69B4', '#00CED1', '#FF6347', '#98FB98', '#FF1493'];
    for (let i = 0; i < 50; i++) { // Increased confetti count
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = Math.random() * window.innerWidth + 'px';
            confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.animationDelay = Math.random() * 3 + 's';
            confetti.style.animationDuration = (3 + Math.random() * 2) + 's';
            confetti.style.width = (Math.random() * 15 + 5) + 'px'; // Variable size
            confetti.style.height = confetti.style.width;
            document.body.appendChild(confetti);
            
            setTimeout(() => confetti.remove(), 5000);
        }, i * 50); // Faster creation
    }
}

// Create confetti periodically
setInterval(createConfetti, 3000);
createConfetti(); // Create initial confetti

// Create stars
function createStars() {
    for (let i = 0; i < 30; i++) { // Increased star count
        const star = document.createElement('div');
        star.className = 'star';
        star.innerHTML = '✦';
        star.style.left = Math.random() * window.innerWidth + 'px';
        star.style.top = Math.random() * window.innerHeight + 'px';
        star.style.animationDelay = Math.random() * 3 + 's';
        star.style.fontSize = (Math.random() * 20 + 10) + 'px';
        document.body.appendChild(star);
    }
}

createStars();

// Create fireworks text
function createFireworksText() {
}

// Create fireworks text periodically
setInterval(createFireworksText, 4000);

// Catch Animation
function catchAnimation(event) {
    const messages = ['🎉 CAUGHT! 🎉', '✨ MAGIC! ✨', '🌟 AMAZING! 🌟', '💫 CAUGHT YOU! 💫', '🎊 SURPRISE! 🎊', '💖 LOVE! 💖', '🎂 BDAY! 🎂'];
    const message = messages[Math.floor(Math.random() * messages.length)];
    
    const catchElement = document.createElement('div');
    catchElement.className = 'catch-animation';
    catchElement.textContent = message;
    catchElement.style.left = event.clientX + 'px';
    catchElement.style.top = event.clientY + 'px';
    
    document.body.appendChild(catchElement);
    
    // Create burst of particles
    for (let i = 0; i < 20; i++) { // Increased particle count
        const particle = document.createElement('div');
        particle.style.position = 'fixed';
        particle.style.left = event.clientX + 'px';
        particle.style.top = event.clientY + 'px';
        particle.style.width = '10px';
        particle.style.height = '10px';
        particle.style.background = `hsl(${Math.random() * 360}, 100%, 50%)`;
        particle.style.borderRadius = '50%';
        particle.style.pointerEvents = 'none';
        particle.style.zIndex = '100';
        
        // Added heart-shaped particles
        if (Math.random() > 0.7) {
            particle.innerHTML = '❤️';
            particle.style.background = 'none';
            particle.style.fontSize = '16px';
        }
        
        const angle = (Math.PI * 2 * i) / 20;
        const velocity = 5 + Math.random() * 10; // Increased velocity range
        const vx = Math.cos(angle) * velocity;
        const vy = Math.sin(angle) * velocity;
        
        let x = event.clientX;
        let y = event.clientY;
        let opacity = 1;
        
        const animateParticle = () => {
            x += vx;
            y += vy;
            opacity -= 0.02;
            
            particle.style.left = x + 'px';
            particle.style.top = y + 'px';
            particle.style.opacity = opacity;
            
            if (opacity > 0) {
                requestAnimationFrame(animateParticle);
            } else {
                particle.remove();
            }
        };
        
        document.body.appendChild(particle);
        animateParticle();
    }
    
    setTimeout(() => catchElement.remove(), 2000);
    
    // Launch extra fireworks on catch
    for (let i = 0; i < 8; i++) { // Increased fireworks count
        setTimeout(() => {
            if (soundEnabled) {
                playLaunchSound(); // Play launch sound for catch fireworks
            }
            fireworks.push(new Firework(
                Math.random() * canvas.width,
                canvas.height
            ));
        }, i * 100);
    }
}

// Window resize handler
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

// Initialize audio on first user interaction
document.addEventListener('click', initAudio, { once: true });
document.addEventListener('touchstart', initAudio, { once: true });

// Mouse trail effect
let mouseTrail = [];
document.addEventListener('mousemove', (e) => {
    // Create more frequent and vibrant trails
    if (mouseTrail.length > 8) { // Increased trail length
        const oldTrail = mouseTrail.shift();
        oldTrail.remove();
    }
    
    const trail = document.createElement('div');
    trail.style.position = 'fixed';
    trail.style.left = e.clientX + 'px';
    trail.style.top = e.clientY + 'px';
    trail.style.width = '25px'; // Larger trail
    trail.style.height = '25px';
    trail.style.background = `radial-gradient(circle, rgba(255, ${Math.floor(Math.random() * 100 + 155)}, ${Math.floor(Math.random() * 100 + 155)}, 0.8) 0%, transparent 70%)`; // Pinkish gradient
    trail.style.borderRadius = '50%';
    trail.style.pointerEvents = 'none';
    trail.style.zIndex = '1';
    trail.style.transition = 'all 0.5s ease-out';
    
    document.body.appendChild(trail);
    mouseTrail.push(trail);
    
    setTimeout(() => {
        trail.style.transform = 'scale(0)';
        trail.style.opacity = '0';
    }, 10);
    
    setTimeout(() => {
        trail.remove();
        const index = mouseTrail.indexOf(trail);
        if (index > -1) {
            mouseTrail.splice(index, 1);
        }
    }, 500);
});