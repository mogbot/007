/**
 * AGENT 007 - LANDING PAGE SCRIPTS
 * =====================================
 * 
 * BEST PRACTICES IMPLEMENTED:
 * ✓ Separated JavaScript from HTML
 * ✓ ES6 class-based architecture
 * ✓ Proper event delegation
 * ✓ Performance optimizations (requestAnimationFrame, debouncing)
 * ✓ Clean, maintainable code structure
 * ✓ Error handling
 * ✓ Proper scoping and encapsulation
 */

'use strict';

// ============================================
// BOOT LOADER
// ============================================
class BootLoader {
    constructor() {
        this.bootElement = document.getElementById('bootLoader');
        this.init();
    }

    init() {
        window.addEventListener('load', () => {
            setTimeout(() => {
                this.hide();
            }, 3000);
        });
    }

    hide() {
        if (this.bootElement) {
            this.bootElement.classList.add('hidden');
            document.documentElement.classList.remove('no-scroll');
        }
    }
}

// ============================================
// HEADER SCROLL HANDLER
// ============================================
class HeaderScroll {
    constructor() {
        this.header = document.querySelector('.header');
        this.threshold = 100;
        this.init();
    }

    init() {
        if (!this.header) return;

        // Throttled scroll handler for performance
        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    this.handleScroll();
                    ticking = false;
                });
                ticking = true;
            }
        });
    }

    handleScroll() {
        if (window.scrollY > this.threshold) {
            this.header.classList.add('scrolled');
        } else {
            this.header.classList.remove('scrolled');
        }
    }
}

// ============================================
// PARTICLE SYSTEM (CANVAS BACKGROUND)
// ============================================
class Particle {
    constructor(canvas) {
        this.canvas = canvas;
        this.reset();
        this.y = Math.random() * canvas.height;
        this.fadeDelay = Math.random() * 600;
        this.fadeStart = Date.now() + this.fadeDelay;
        this.fadingOut = false;
    }

    reset() {
        this.x = Math.random() * this.canvas.width;
        this.y = Math.random() * this.canvas.height;
        this.z = Math.random() * 1;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.opacity = 0;
        this.targetOpacity = Math.random() * 0.5 + 0.3;
        // Gold and silver colors for white background
        this.color = Math.random() > 0.5 ? '#D4AF37' : '#8B8B8B';
        this.radius = Math.random() * 1.5 + 0.5;
        this.fadeDelay = Math.random() * 600;
        this.fadeStart = Date.now() + this.fadeDelay;
        this.fadingOut = false;
    }

    update() {
        this.x += this.vx * this.z;
        this.y += this.vy * this.z;

        // Fade in
        if (!this.fadingOut && Date.now() > this.fadeStart) {
            this.opacity += 0.01;
            if (this.opacity >= this.targetOpacity) {
                this.opacity = this.targetOpacity;
                this.fadingOut = true;
            }
        }

        // Fade out
        if (this.fadingOut) {
            this.opacity -= 0.005;
        }

        // Reset when fully faded
        if (this.opacity <= 0) {
            this.reset();
        }

        // Bounce off edges
        if (this.x < 0 || this.x > this.canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > this.canvas.height) this.vy *= -1;
    }

    draw(ctx) {
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
    }
}

class ParticleSystem {
    constructor() {
        this.canvas = document.getElementById('bgCanvas');
        if (!this.canvas) return;

        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.particleCount = 80;
        this.connectionDistance = 150;

        this.init();
    }

    init() {
        this.resize();
        this.createParticles();
        this.animate();
        this.bindEvents();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createParticles() {
        this.particles = Array.from(
            { length: this.particleCount },
            () => new Particle(this.canvas)
        );
    }

    drawConnections() {
        this.particles.forEach((p1, i) => {
            this.particles.slice(i + 1).forEach(p2 => {
                const dx = p1.x - p2.x;
                const dy = p1.y - p2.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < this.connectionDistance) {
                    this.ctx.globalAlpha = (1 - distance / this.connectionDistance) * 0.2;
                    this.ctx.strokeStyle = p1.color;
                    this.ctx.lineWidth = 0.5;
                    this.ctx.beginPath();
                    this.ctx.moveTo(p1.x, p1.y);
                    this.ctx.lineTo(p2.x, p2.y);
                    this.ctx.stroke();
                }
            });
        });
    }

    animate() {
        // Clear with slight trail effect (white background)
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Update and draw particles
        this.particles.forEach(particle => {
            particle.update();
            particle.draw(this.ctx);
        });

        // Draw connections
        this.drawConnections();

        // Reset alpha
        this.ctx.globalAlpha = 1;

        // Continue animation loop
        requestAnimationFrame(() => this.animate());
    }

    bindEvents() {
        // Debounced resize handler
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                this.resize();
            }, 250);
        });
    }
}

// ============================================
// COUNTER ANIMATION
// ============================================
class CounterAnimation {
    constructor(elementId, targetValue, duration = 2500, delay = 3200) {
        this.element = document.getElementById(elementId);
        this.targetValue = targetValue;
        this.duration = duration;
        this.delay = delay;

        if (this.element) {
            this.init();
        }
    }

    init() {
        setTimeout(() => {
            this.animate();
        }, this.delay);
    }

    animate() {
        const start = 0;
        const increment = this.targetValue / (this.duration / 16);
        let current = start;

        const timer = setInterval(() => {
            current += increment;
            if (current >= this.targetValue) {
                this.element.textContent = this.targetValue.toLocaleString();
                clearInterval(timer);
            } else {
                this.element.textContent = Math.floor(current).toLocaleString();
            }
        }, 16);
    }
}

// ============================================
// SMOOTH SCROLL
// ============================================
class SmoothScroll {
    constructor() {
        this.init();
    }

    init() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = anchor.getAttribute('href');
                const target = document.querySelector(targetId);

                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }
}

// ============================================
// APPLICATION INITIALIZATION
// ============================================
class App {
    constructor() {
        this.init();
    }

    init() {
        // Wait for DOM to be fully loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.initializeComponents();
            });
        } else {
            this.initializeComponents();
        }
    }

    initializeComponents() {
        try {
            // Initialize all components
            new BootLoader();
            new HeaderScroll();
            new ParticleSystem();
            // Disabled animated counter for tokens burned — show static default 0
            new SmoothScroll();

            console.log('✅ Agent 007 initialized successfully');
        } catch (error) {
            console.error('❌ Error initializing Agent 007:', error);
        }
    }
}

// Start the application
new App();
