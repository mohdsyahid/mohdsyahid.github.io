// Terminal Matrix Rain Effect
class MatrixRain {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.drops = [];
        this.chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()_+-=[]{}|;:,.<>?';
        this.fontSize = 14;
        this.columns = 0;
        this.animationId = null;
        this.isActive = false;
    }

    init() {
        // Create canvas for matrix effect
        this.canvas = document.createElement('canvas');
        this.canvas.style.position = 'fixed';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style.pointerEvents = 'none';
        this.canvas.style.zIndex = '0';
        this.canvas.style.opacity = '0.1';
        document.body.appendChild(this.canvas);

        this.ctx = this.canvas.getContext('2d');
        this.resize();
        
        // Initialize drops
        this.columns = Math.floor(this.canvas.width / this.fontSize);
        this.drops = new Array(this.columns).fill(1);
        
        window.addEventListener('resize', () => this.resize());
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.columns = Math.floor(this.canvas.width / this.fontSize);
        this.drops = new Array(this.columns).fill(1);
    }

    draw() {
        // Semi-transparent black background
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Green text
        this.ctx.fillStyle = '#00ff00';
        this.ctx.font = `${this.fontSize}px 'Share Tech Mono', monospace`;

        for (let i = 0; i < this.drops.length; i++) {
            const char = this.chars[Math.floor(Math.random() * this.chars.length)];
            const x = i * this.fontSize;
            const y = this.drops[i] * this.fontSize;

            this.ctx.fillText(char, x, y);

            // Reset drop randomly
            if (y > this.canvas.height && Math.random() > 0.975) {
                this.drops[i] = 0;
            }
            this.drops[i]++;
        }
    }

    start() {
        if (this.isActive) return;
        this.isActive = true;
        
        const animate = () => {
            if (!this.isActive) return;
            this.draw();
            this.animationId = requestAnimationFrame(animate);
        };
        animate();
    }

    stop() {
        this.isActive = false;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
    }

    toggle() {
        if (this.isActive) {
            this.stop();
        } else {
            this.start();
        }
    }
}

// Glitch Effect Handler
class GlitchEffect {
    constructor() {
        this.isActive = false;
        this.glitchElements = [];
    }

    init() {
        // Find all glitch elements
        this.glitchElements = document.querySelectorAll('.glitch');
        
        // Add data-text attribute for glitch effect
        this.glitchElements.forEach(element => {
            if (!element.getAttribute('data-text')) {
                element.setAttribute('data-text', element.textContent);
            }
        });
    }

    trigger() {
        if (this.isActive) return;
        this.isActive = true;

        // Add intense glitch class
        this.glitchElements.forEach(element => {
            element.classList.add('intense-glitch');
        });

        // Remove after 2 seconds
        setTimeout(() => {
            this.glitchElements.forEach(element => {
                element.classList.remove('intense-glitch');
            });
            this.isActive = false;
        }, 2000);
    }
}

// Terminal Command Handler
class TerminalHandler {
    constructor() {
        this.commands = {
            'help': 'Available commands: help, about, skills, projects, contact, clear, matrix, glitch',
            'about': 'Pembangun Perisian Berpengalaman | Full-Stack Developer',
            'skills': 'Laravel, CodeIgniter, ASP.NET, MySQL, Docker, Claude AI',
            'projects': 'Sistem Pengurusan Sekolah, Portal E-Commerce, Sistem CRM',
            'contact': 'Email: mohdsyahid@example.com | GitHub: mohdsyahid',
            'clear': 'clear',
            'matrix': 'matrix',
            'glitch': 'glitch'
        };
        this.history = [];
        this.historyIndex = -1;
    }

    init() {
        const commandInput = document.querySelector('.command-input');
        if (commandInput) {
            commandInput.addEventListener('keydown', (e) => this.handleKeydown(e));
        }
    }

    handleKeydown(e) {
        const input = e.target;
        
        if (e.key === 'Enter') {
            const command = input.value.trim().toLowerCase();
            this.executeCommand(command);
            input.value = '';
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            this.navigateHistory(-1, input);
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            this.navigateHistory(1, input);
        }
    }

    executeCommand(command) {
        this.history.push(command);
        this.historyIndex = this.history.length;

        const output = document.querySelector('.terminal-output');
        if (!output) return;

        // Add command to output
        const commandLine = document.createElement('div');
        commandLine.innerHTML = `<span class="prompt">root@portfolio:~$</span> ${command}`;
        output.appendChild(commandLine);

        // Execute command
        if (this.commands[command]) {
            const result = document.createElement('div');
            result.style.color = '#00ff00';
            result.style.marginBottom = '10px';
            
            if (command === 'clear') {
                output.innerHTML = '';
                return;
            } else if (command === 'matrix') {
                matrixRain.toggle();
                result.textContent = matrixRain.isActive ? 'Matrix rain activated' : 'Matrix rain deactivated';
            } else if (command === 'glitch') {
                glitchEffect.trigger();
                result.textContent = 'Glitch effect triggered';
            } else {
                result.textContent = this.commands[command];
            }
            
            output.appendChild(result);
        } else {
            const error = document.createElement('div');
            error.style.color = '#ff0000';
            error.style.marginBottom = '10px';
            error.textContent = `Command not found: ${command}. Type 'help' for available commands.`;
            output.appendChild(error);
        }

        // Scroll to bottom
        output.scrollTop = output.scrollHeight;
    }

    navigateHistory(direction, input) {
        this.historyIndex += direction;
        
        if (this.historyIndex < 0) {
            this.historyIndex = 0;
        } else if (this.historyIndex >= this.history.length) {
            this.historyIndex = this.history.length;
            input.value = '';
            return;
        }
        
        input.value = this.history[this.historyIndex] || '';
    }
}

// Pixel Animation Effects
class PixelAnimations {
    constructor() {
        this.scanLines = [];
    }

    init() {
        this.initHoverEffects();
        this.initClickEffects();
        this.initScanLines();
        this.initTypingEffect();
    }

    initHoverEffects() {
        // Technology tags hover effect
        const tags = document.querySelectorAll('.pixel-tag');
        tags.forEach(tag => {
            tag.addEventListener('mouseenter', () => {
                this.createSparkles(tag);
            });
        });

        // Project boxes hover effect
        const projects = document.querySelectorAll('.pixel-box');
        projects.forEach(project => {
            project.addEventListener('mouseenter', () => {
                this.createGlowEffect(project);
            });
        });

        // Social links hover effect
        const socialLinks = document.querySelectorAll('.social-link');
        socialLinks.forEach(link => {
            link.addEventListener('mouseenter', () => {
                this.createRippleEffect(link);
            });
        });
    }

    initClickEffects() {
        // Add click effects to interactive elements
        const clickables = document.querySelectorAll('.pixel-tag, .pixel-box, .social-link');
        clickables.forEach(element => {
            element.addEventListener('click', (e) => {
                this.createClickExplosion(e.target, e.clientX, e.clientY);
            });
        });
    }

    initScanLines() {
        // Create scan lines for profile photo
        const profileFrame = document.querySelector('.profile-frame');
        if (profileFrame) {
            const scanLine = document.createElement('div');
            scanLine.className = 'scan-line';
            profileFrame.appendChild(scanLine);
        }
    }

    initTypingEffect() {
        // Add typing effect to specific elements
        const typewriterElements = document.querySelectorAll('.typewriter');
        typewriterElements.forEach(element => {
            this.typeWriter(element, element.textContent, 100);
        });
    }

    createSparkles(element) {
        const rect = element.getBoundingClientRect();
        
        for (let i = 0; i < 5; i++) {
            const sparkle = document.createElement('div');
            sparkle.style.position = 'fixed';
            sparkle.style.width = '2px';
            sparkle.style.height = '2px';
            sparkle.style.background = '#00ff00';
            sparkle.style.pointerEvents = 'none';
            sparkle.style.zIndex = '1000';
            sparkle.style.left = (rect.left + Math.random() * rect.width) + 'px';
            sparkle.style.top = (rect.top + Math.random() * rect.height) + 'px';
            
            document.body.appendChild(sparkle);
            
            // Animate sparkle
            sparkle.animate([
                { opacity: 1, transform: 'scale(1)' },
                { opacity: 0, transform: 'scale(2)' }
            ], {
                duration: 500,
                easing: 'ease-out'
            }).onfinish = () => sparkle.remove();
        }
    }

    createGlowEffect(element) {
        element.style.boxShadow = '0 0 30px rgba(0, 255, 0, 0.8)';
        
        setTimeout(() => {
            element.style.boxShadow = '';
        }, 300);
    }

    createRippleEffect(element) {
        const ripple = document.createElement('div');
        ripple.style.position = 'absolute';
        ripple.style.width = '100%';
        ripple.style.height = '100%';
        ripple.style.top = '0';
        ripple.style.left = '0';
        ripple.style.background = 'radial-gradient(circle, rgba(0, 255, 0, 0.3) 0%, transparent 70%)';
        ripple.style.pointerEvents = 'none';
        ripple.style.opacity = '0';
        
        element.style.position = 'relative';
        element.appendChild(ripple);
        
        ripple.animate([
            { opacity: 0, transform: 'scale(0)' },
            { opacity: 1, transform: 'scale(1)' },
            { opacity: 0, transform: 'scale(1.2)' }
        ], {
            duration: 600,
            easing: 'ease-out'
        }).onfinish = () => ripple.remove();
    }

    createClickExplosion(element, x, y) {
        for (let i = 0; i < 8; i++) {
            const particle = document.createElement('div');
            particle.style.position = 'fixed';
            particle.style.width = '4px';
            particle.style.height = '4px';
            particle.style.background = '#00ff00';
            particle.style.pointerEvents = 'none';
            particle.style.zIndex = '1000';
            particle.style.left = x + 'px';
            particle.style.top = y + 'px';
            
            document.body.appendChild(particle);
            
            const angle = (i / 8) * Math.PI * 2;
            const distance = 50;
            const endX = x + Math.cos(angle) * distance;
            const endY = y + Math.sin(angle) * distance;
            
            particle.animate([
                { 
                    left: x + 'px', 
                    top: y + 'px', 
                    opacity: 1, 
                    transform: 'scale(1)' 
                },
                { 
                    left: endX + 'px', 
                    top: endY + 'px', 
                    opacity: 0, 
                    transform: 'scale(0)' 
                }
            ], {
                duration: 500,
                easing: 'ease-out'
            }).onfinish = () => particle.remove();
        }
    }

    typeWriter(element, text, speed) {
        element.textContent = '';
        let i = 0;
        
        const timer = setInterval(() => {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
            } else {
                clearInterval(timer);
            }
        }, speed);
    }
}

// Boot Sequence
class BootSequence {
    constructor() {
        this.messages = [
            'Initializing system...',
            'Loading portfolio modules...',
            'Connecting to neural network...',
            'Establishing secure connection...',
            'Loading user interface...',
            'System ready.'
        ];
    }

    start() {
        const bootScreen = document.createElement('div');
        bootScreen.id = 'boot-screen';
        bootScreen.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: #000;
            color: #00ff00;
            font-family: 'Share Tech Mono', monospace;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            z-index: 10000;
            font-size: 14px;
        `;
        
        document.body.appendChild(bootScreen);
        
        let messageIndex = 0;
        const messageContainer = document.createElement('div');
        bootScreen.appendChild(messageContainer);
        
        const showMessage = () => {
            if (messageIndex < this.messages.length) {
                const messageLine = document.createElement('div');
                messageLine.textContent = '> ' + this.messages[messageIndex];
                messageLine.style.marginBottom = '10px';
                messageContainer.appendChild(messageLine);
                
                messageIndex++;
                setTimeout(showMessage, 800);
            } else {
                setTimeout(() => {
                    bootScreen.style.opacity = '0';
                    bootScreen.style.transition = 'opacity 1s';
                    setTimeout(() => {
                        bootScreen.remove();
                    }, 1000);
                }, 1000);
            }
        };
        
        showMessage();
    }
}

// Keyboard Shortcuts Handler
class KeyboardHandler {
    constructor() {
        this.shortcuts = {
            'KeyG': () => glitchEffect.trigger(),
            'KeyM': () => matrixRain.toggle(),
            'KeyC': () => this.showConsole(),
            'KeyH': () => this.showHelp()
        };
    }

    init() {
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.altKey) return;
            
            const handler = this.shortcuts[e.code];
            if (handler) {
                e.preventDefault();
                handler();
            }
        });
    }

    showConsole() {
        console.log('%c🚀 PORTFOLIO CONSOLE ACTIVATED', 'color: #00ff00; font-size: 16px; font-weight: bold;');
        console.log('%cAvailable shortcuts:', 'color: #00ff00; font-size: 14px;');
        console.log('%c  G - Trigger glitch effect', 'color: #ffff00;');
        console.log('%c  M - Toggle matrix rain', 'color: #ffff00;');
        console.log('%c  C - Show this console', 'color: #ffff00;');
        console.log('%c  H - Show help', 'color: #ffff00;');
    }

    showHelp() {
        const helpModal = document.createElement('div');
        helpModal.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 0, 0, 0.95);
            border: 2px solid #00ff00;
            padding: 20px;
            color: #00ff00;
            font-family: 'Share Tech Mono', monospace;
            z-index: 10000;
            border-radius: 8px;
            box-shadow: 0 0 30px rgba(0, 255, 0, 0.5);
        `;
        
        helpModal.innerHTML = `
            <h3 style="margin-top: 0; color: #00ff00;">🎮 KEYBOARD SHORTCUTS</h3>
            <p><strong>G</strong> - Trigger glitch effect</p>
            <p><strong>M</strong> - Toggle matrix rain</p>
            <p><strong>C</strong> - Show console</p>
            <p><strong>H</strong> - Show this help</p>
            <p style="margin-bottom: 0; color: #888; font-size: 12px;">Click anywhere to close</p>
        `;
        
        document.body.appendChild(helpModal);
        
        const closeModal = () => {
            helpModal.remove();
            document.removeEventListener('click', closeModal);
        };
        
        setTimeout(() => {
            document.addEventListener('click', closeModal);
        }, 100);
    }
}

// Initialize all systems
const matrixRain = new MatrixRain();
const glitchEffect = new GlitchEffect();
const terminalHandler = new TerminalHandler();
const pixelAnimations = new PixelAnimations();
const bootSequence = new BootSequence();
const keyboardHandler = new KeyboardHandler();

// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', () => {
    // Start boot sequence
    bootSequence.start();
    
    // Initialize all systems after boot
    setTimeout(() => {
        matrixRain.init();
        glitchEffect.init();
        terminalHandler.init();
        pixelAnimations.init();
        keyboardHandler.init();
        
        // Auto-start matrix rain
        setTimeout(() => {
            matrixRain.start();
        }, 2000);
        
        // Show welcome message in console
        setTimeout(() => {
            console.log('%c🎯 Welcome to Mohd Syahid\'s Portfolio!', 'color: #00ff00; font-size: 18px; font-weight: bold;');
            console.log('%cPress H for keyboard shortcuts', 'color: #ffff00;');
        }, 3000);
    }, 5000);
});

// Add CSS for intense glitch effect
const style = document.createElement('style');
style.textContent = `
    .intense-glitch {
        animation: intense-glitch 0.1s infinite !important;
    }
    
    @keyframes intense-glitch {
        0%, 100% { transform: translate(0); }
        10% { transform: translate(-5px, 5px) skew(5deg); }
        20% { transform: translate(5px, -5px) skew(-5deg); }
        30% { transform: translate(-5px, -5px) skew(5deg); }
        40% { transform: translate(5px, 5px) skew(-5deg); }
        50% { transform: translate(-5px, 5px) skew(5deg); }
        60% { transform: translate(5px, -5px) skew(-5deg); }
        70% { transform: translate(-5px, -5px) skew(5deg); }
        80% { transform: translate(5px, 5px) skew(-5deg); }
        90% { transform: translate(-2px, 2px) skew(2deg); }
    }
`;
document.head.appendChild(style);