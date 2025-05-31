class InteractiveNameTag {
    constructor() {
        this.currentTheme = 'default';
        this.themes = ['default', 'neon', 'sunset'];
        this.musicEnabled = false;
        this.particles = [];
        this.cursorTrail = [];
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.createParticles();
        this.startTypingAnimation();
        this.animateSkillBars();
        this.setupCursorTrail();
        this.setupAudioContext();
        this.randomizeShapeColors();
    }

    setupEventListeners() {
        document.querySelector('.theme-toggle').addEventListener('click', () => {
            this.switchTheme();
        });

        document.querySelector('.music-toggle').addEventListener('click', () => {
            this.toggleMusic();
        });

        document.querySelectorAll('.tech-icon').forEach((icon, index) => {
            icon.addEventListener('mouseenter', () => {
                this.playHoverSound();
                this.createTechParticles(icon);
            });

            icon.addEventListener('click', () => {
                this.showTechInfo(icon.dataset.tech);
            });
        });

        document.querySelectorAll('.gaming-profile').forEach(profile => {
            profile.addEventListener('click', () => {
                this.copyToClipboard(profile);
            });
        });

        window.addEventListener('resize', () => {
            this.handleResize();
        });

        document.addEventListener('mousemove', (e) => {
            this.updateCursorTrail(e);
        });
    }

    switchTheme() {
        const currentIndex = this.themes.indexOf(this.currentTheme);
        const nextIndex = (currentIndex + 1) % this.themes.length;
        this.currentTheme = this.themes[nextIndex];
        
        if (this.currentTheme === 'default') {
            document.body.removeAttribute('data-theme');
        } else {
            document.body.setAttribute('data-theme', this.currentTheme);
        }

        this.showNotification(`Theme changed to ${this.currentTheme}! 🎨`);
        this.createThemeSwitchEffect();
    }

    createThemeSwitchEffect() {
        const effect = document.createElement('div');
        effect.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: radial-gradient(circle, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%);
            pointer-events: none;
            z-index: 9998;
            animation: themeSwitch 0.5s ease-out;
        `;
        
        const style = document.createElement('style');
        style.textContent = `
            @keyframes themeSwitch {
                0% { opacity: 0; transform: scale(0); }
                50% { opacity: 1; transform: scale(2); }
                100% { opacity: 0; transform: scale(0); }
            }
        `;
        document.head.appendChild(style);
        document.body.appendChild(effect);
        
        setTimeout(() => {
            document.body.removeChild(effect);
            document.head.removeChild(style);
        }, 500);
    }

    toggleMusic() {
        this.musicEnabled = !this.musicEnabled;
        const musicToggle = document.querySelector('.music-toggle i');
        
        if (this.musicEnabled) {
            musicToggle.className = 'fas fa-volume-up';
            this.showNotification('🎵 Now vibing to Payphone by Maroon 5! 🎵');
            this.playBackgroundMusic();
        } else {
            musicToggle.className = 'fas fa-music';
            this.showNotification('Music paused! 🎵');
            this.stopBackgroundMusic();
        }
    }

    setupAudioContext() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            console.log('Web Audio API not supported');
        }
    }

    playHoverSound() {
        if (!this.audioContext || !this.musicEnabled) return;
        
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.frequency.value = 800;
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.2);
        
        oscillator.start();
        oscillator.stop(this.audioContext.currentTime + 0.2);
    }

    startTypingAnimation() {
        const nameElement = document.getElementById('typingName');
        const fullName = 'Edgar Vidysto Ramadhan';
        let currentText = '';
        let index = 0;
        let isDeleting = false;

        const typeEffect = () => {
            if (!isDeleting && index < fullName.length) {
                currentText += fullName[index];
                index++;
            } else if (isDeleting && currentText.length > 0) {
                currentText = currentText.slice(0, -1);
            } else if (!isDeleting && index === fullName.length) {
                setTimeout(() => {
                    isDeleting = true;
                }, 2000);
            } else if (isDeleting && currentText.length === 0) {
                isDeleting = false;
                index = 0;
            }

            nameElement.textContent = currentText + (Math.random() > 0.5 ? '|' : '');
            
            const speed = isDeleting ? 50 : 100;
            setTimeout(typeEffect, speed);
        };

        typeEffect();
    }

    animateSkillBars() {
        const skillBars = document.querySelectorAll('.skill-progress');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const width = entry.target.dataset.width;
                    setTimeout(() => {
                        entry.target.style.width = width + '%';
                    }, 500);
                    observer.unobserve(entry.target);
                }
            });
        });

        skillBars.forEach(bar => observer.observe(bar));
    }

    createParticles() {
        const particleContainer = document.querySelector('.particle-container');
        
        const createParticle = () => {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 2 + 's';
            particle.style.animationDuration = (Math.random() * 4 + 4) + 's';
            
            particleContainer.appendChild(particle);
            
            setTimeout(() => {
                if (particle.parentNode) {
                    particle.parentNode.removeChild(particle);
                }
            }, 8000);
        };

        setInterval(createParticle, 300);
    }

    createTechParticles(techIcon) {
        const rect = techIcon.getBoundingClientRect();
        const colors = ['#6366f1', '#8b5cf6', '#06d6a0', '#f59e0b'];
        
        for (let i = 0; i < 5; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: fixed;
                width: 6px;
                height: 6px;
                background: ${colors[Math.floor(Math.random() * colors.length)]};
                border-radius: 50%;
                pointer-events: none;
                z-index: 1000;
                left: ${rect.left + rect.width / 2}px;
                top: ${rect.top + rect.height / 2}px;
            `;
            
            document.body.appendChild(particle);
            
            const angle = (Math.PI * 2 * i) / 5;
            const velocity = 50 + Math.random() * 50;
            
            const animation = particle.animate([
                {
                    transform: 'translate(0, 0) scale(1)',
                    opacity: 1
                },
                {
                    transform: `translate(${Math.cos(angle) * velocity}px, ${Math.sin(angle) * velocity}px) scale(0)`,
                    opacity: 0
                }
            ], {
                duration: 1000,
                easing: 'ease-out'
            });
            
            animation.onfinish = () => {
                document.body.removeChild(particle);
            };
        }
    }

    setupCursorTrail() {
        const cursorTrail = document.querySelector('.cursor-trail');
        let mouseX = 0, mouseY = 0;
        let trailX = 0, trailY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            cursorTrail.style.opacity = '0.7';
        });

        document.addEventListener('mouseleave', () => {
            cursorTrail.style.opacity = '0';
        });

        const updateTrail = () => {
            trailX += (mouseX - trailX) * 0.1;
            trailY += (mouseY - trailY) * 0.1;
            
            cursorTrail.style.left = trailX - 10 + 'px';
            cursorTrail.style.top = trailY - 10 + 'px';
            
            requestAnimationFrame(updateTrail);
        };

        updateTrail();
    }

    updateCursorTrail(e) {
        const trail = document.querySelector('.cursor-trail');
        if (trail) {
            trail.style.left = e.clientX - 10 + 'px';
            trail.style.top = e.clientY - 10 + 'px';
        }
    }

    randomizeShapeColors() {
        const shapes = document.querySelectorAll('.shape');
        
        const updateColors = () => {
            shapes.forEach(shape => {
                const hue1 = Math.random() * 360;
                const hue2 = (hue1 + 60) % 360;
                shape.style.background = `linear-gradient(45deg, hsl(${hue1}, 70%, 60%), hsl(${hue2}, 70%, 60%))`;
            });
        };

        updateColors();
        setInterval(updateColors, 5000);
    }

    showTechInfo(tech) {
        const techInfo = {
            'HTML5': 'Building the web, one tag at a time! 🏗️',
            'CSS3': 'Making things look awesome! ✨',
            'JavaScript': 'Bringing websites to life! ⚡',
            'React': 'Component magic for modern apps! ⚛️',
            'Vue.js': 'Progressive and fun to work with! 💚',
            'Node.js': 'JavaScript everywhere! 🚀',
            'Figma': 'Where design dreams come true! 🎨',
            'Git': 'Version control superhero! 🦸‍♂️'
        };

        this.showNotification(`${tech}: ${techInfo[tech] || 'One of my favorite tools!'}`);
    }

    copyToClipboard(profile) {
        const username = profile.querySelector('.username').textContent;
        const platform = profile.querySelector('.platform').textContent;
        
        navigator.clipboard.writeText(username).then(() => {
            this.showNotification(`${platform} username copied: ${username} 📋`);
        }).catch(() => {
            this.showNotification('Copy not supported in this browser 😅');
        });
    }

    showNotification(message) {
        const notification = document.getElementById('notification');
        notification.textContent = message;
        notification.classList.add('show');
        
        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    }

    handleResize() {
        console.log('Window resized - adjusting layout');
    }

    playBackgroundMusic() {
        console.log('🎵 Playing Payphone by Maroon 5 vibes! 🎵');
    }

    stopBackgroundMusic() {
        console.log('🎵 Music paused');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new InteractiveNameTag();
    
    console.log('🎉 Fun Interactive Name Tag Loaded!');
    console.log('✨ Features:');
    console.log('  - Theme switching (click palette icon)');
    console.log('  - Interactive tech stack');
    console.log('  - Particle effects');
    console.log('  - Typing animation');
    console.log('  - Gaming profiles with copy functionality');
    console.log('  - Smooth animations and transitions');
    console.log('  - Mobile responsive design');
    console.log('  - Cursor trail effect');
    console.log('  - Payphone vibes when music is on! 🎵');
    console.log('Made with ❤️ and lots of fun for Edgar!');
}); 