// ========== MOBILE MENU ==========
const mobileToggle = document.querySelector('.mobile-toggle');
const navLinks = document.querySelector('.nav-links');
const body = document.body;

mobileToggle.addEventListener('click', () => {
    const isActive = navLinks.classList.toggle('active');
    mobileToggle.textContent = isActive ? '✕' : '☰';
    body.classList.toggle('nav-open', isActive);
});

// ========== HEADER SCROLL ==========
const header = document.querySelector('.header');
window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 50);
});

// ========== HERO CAROUSEL ==========
const slides = document.querySelectorAll('.hero-slide');
let currentSlide = 0;

if (slides.length > 0) {
    slides[currentSlide].classList.add('active');
    setInterval(() => {
        slides[currentSlide].classList.remove('active');
        currentSlide = (currentSlide + 1) % slides.length;
        slides[currentSlide].classList.add('active');
    }, 6000);
}

// ========== RESPONSIVE CAROUSEL FUNCTIONALITY (MOBILE-ONLY) ==========
class MobileCarousel {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) return;

        this.items = Array.from(this.container.children);
        if (this.items.length === 0) return;

        this.indicatorsContainer = document.querySelector(`.carousel-indicators[data-carousel="${containerId}"]`);
        this.currentIndex = 0;
        this.autoPlayTimer = null;
        
        this.init();
    }

    init() {
        this.createIndicators();
        this.setupControls();
        this.setupInteractionObserver();
        this.startAutoPlay();
    }

    setupControls() {
        const prevBtn = document.querySelector(`.carousel-prev[data-carousel="${this.container.id}"]`);
        const nextBtn = document.querySelector(`.carousel-next[data-carousel="${this.container.id}"]`);

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                this.prev();
                this.resetAutoPlay();
            });
        }
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                this.next();
                this.resetAutoPlay();
            });
        }
    }

    prev() {
        const targetIndex = (this.currentIndex - 1 + this.items.length) % this.items.length;
        this.scrollToItem(targetIndex);
    }

    next() {
        const targetIndex = (this.currentIndex + 1) % this.items.length;
        this.scrollToItem(targetIndex);
    }

    scrollToItem(index) {
        const item = this.items[index];
        if (item) {
            const scrollLeft = item.offsetLeft - this.container.offsetLeft;
            this.container.scrollTo({
                left: scrollLeft,
                behavior: 'smooth'
            });
        }
    }

    createIndicators() {
        if (!this.indicatorsContainer) return;
        
        this.indicatorsContainer.innerHTML = '';
        this.items.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.classList.add('carousel-dot');
            if (index === 0) dot.classList.add('active');
            
            dot.addEventListener('click', () => {
                this.scrollToItem(index);
                this.resetAutoPlay();
            });
            this.indicatorsContainer.appendChild(dot);
        });
        
        this.indicators = this.indicatorsContainer.querySelectorAll('.carousel-dot');
    }

    setupInteractionObserver() {
        this.container.addEventListener('touchstart', () => this.stopAutoPlay(), { once: true });

        let scrollTimer;
        this.container.addEventListener('scroll', () => {
            clearTimeout(scrollTimer);
            scrollTimer = setTimeout(() => {
                this.updateActiveIndicator();
                this.resetAutoPlay();
            }, 150);
        });
    }
    
    updateActiveIndicator() {
        const scrollLeft = this.container.scrollLeft;
        const containerWidth = this.container.offsetWidth;

        let closestIndex = 0;
        let minDistance = Infinity;

        this.items.forEach((item, index) => {
            const itemCenter = item.offsetLeft - this.container.offsetLeft + item.offsetWidth / 2;
            const containerCenter = scrollLeft + containerWidth / 2;
            const distance = Math.abs(itemCenter - containerCenter);

            if (distance < minDistance) {
                minDistance = distance;
                closestIndex = index;
            }
        });

        if (this.currentIndex !== closestIndex) {
            this.currentIndex = closestIndex;
            this.updateIndicators();
        }
    }

    updateIndicators() {
        if (this.indicators) {
            this.indicators.forEach((dot, index) => {
                dot.classList.toggle('active', index === this.currentIndex);
            });
        }
    }

    startAutoPlay() {
        this.stopAutoPlay();
        this.autoPlayTimer = setInterval(() => {
            this.next();
        }, 5000);
    }

    stopAutoPlay() {
        if (this.autoPlayTimer) {
            clearInterval(this.autoPlayTimer);
            this.autoPlayTimer = null;
        }
    }

    resetAutoPlay() {
        this.stopAutoPlay();
        setTimeout(() => this.startAutoPlay(), 8000);
    }
}

// Initialize carousels
let mobileCarousels = [];

function initCarousels() {
    mobileCarousels.forEach(c => c.stopAutoPlay());
    mobileCarousels = [];
    
    if (window.innerWidth <= 767) {
        mobileCarousels.push(new MobileCarousel('problemsCarousel'));
        mobileCarousels.push(new MobileCarousel('blogCarousel'));
        mobileCarousels.push(new MobileCarousel('testimonialsCarousel'));
    }
}

// ========== FAQ ACCORDION ==========
const faqItems = document.querySelectorAll('.faq-item');

faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    
    question.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        
        faqItems.forEach(i => {
            if (i !== item) {
                i.classList.remove('active');
            }
        });
        
        item.classList.toggle('active', !isActive);
    });
});

// ========== SMOOTH SCROLL ==========
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const target = document.querySelector(targetId);
        
        if (target) {
            if (navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                mobileToggle.textContent = '☰';
                body.classList.remove('nav-open');
            }
            
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// ========== FORM SUBMISSION ==========
const contactForm = document.querySelector('.contact-form form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Mensagem enviada com sucesso! Nossa equipe entrará em contato em até 2 horas úteis.');
        contactForm.reset();
    });
}

// ========== TOUCH EFFECTS FOR MOBILE ==========
function addTouchEffects(selector) {
    const elements = document.querySelectorAll(selector);
    elements.forEach(element => {
        let touchActive = false;
        element.addEventListener('touchstart', function() {
            touchActive = true;
            setTimeout(() => {
                if(touchActive) this.classList.add('touch-active');
            }, 100);
        });
        
        element.addEventListener('touchmove', function() {
            touchActive = false;
            this.classList.remove('touch-active');
        });

        element.addEventListener('touchend', function() {
            touchActive = false;
            this.classList.remove('touch-active');
        });
        
        element.addEventListener('touchcancel', function() {
            touchActive = false;
            this.classList.remove('touch-active');
        });
    });
}

addTouchEffects('.problem-card');
addTouchEffects('.blog-card');
addTouchEffects('.testimonial-card');
addTouchEffects('.faq-item');
addTouchEffects('.contact-item');


// ========== CANVAS ANIMATIONS & RESIZE HANDLING ==========
const canvases = document.querySelectorAll('.section-animation, .hero-animation');

function resizeAllCanvases() {
    canvases.forEach(canvas => {
        if (canvas) {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
        }
    });
    initCarousels();
}

resizeAllCanvases();
initCarousels();

let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(resizeAllCanvases, 250);
});


// ========== HERO ANIMATION: Balança da Justiça com Documentos ==========
const heroCanvas = document.getElementById('heroCanvas');
if (heroCanvas) {
    const heroCtx = heroCanvas.getContext('2d');

    function getScreenSize() {
        const width = window.innerWidth;
        if (width < 767) return 'mobile';
        if (width < 992) return 'tablet';
        return 'desktop';
    }

    class Scale {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.swingAngle = 0;
            this.swingSpeed = 0.008;
            this.baseY = y;
        }

        update() {
            this.swingAngle += this.swingSpeed;
            this.y = this.baseY + Math.sin(this.swingAngle * 2) * 3;
        }

        draw(ctx) {
            const centerX = this.x;
            const centerY = this.y;
            const swing = Math.sin(this.swingAngle) * 0.08;
            
            ctx.strokeStyle = 'rgba(201, 169, 97, 0.6)';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(centerX, centerY + 80);
            ctx.lineTo(centerX, centerY - 40);
            ctx.stroke();
            
            const beamLength = 120;
            ctx.save();
            ctx.translate(centerX, centerY - 40);
            ctx.rotate(swing);
            ctx.beginPath();
            ctx.moveTo(-beamLength, 0);
            ctx.lineTo(beamLength, 0);
            ctx.stroke();
            
            [-beamLength + 20, beamLength - 20].forEach(side => {
                ctx.beginPath();
                ctx.moveTo(side, 0);
                ctx.lineTo(side, 50);
                ctx.stroke();
                
                ctx.beginPath();
                ctx.ellipse(side, 55, 30, 5, 0, 0, Math.PI * 2);
                ctx.stroke();
            });
            
            ctx.restore();
            
            ctx.beginPath();
            ctx.arc(centerX, centerY - 40, 8, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(201, 169, 97, 0.6)';
            ctx.fill();
        }
    }

    class Document {
        constructor(x, y, size) {
            this.x = x;
            this.y = y;
            this.size = size;
            this.rotation = Math.random() * Math.PI * 2;
            this.rotationSpeed = (Math.random() - 0.5) * 0.01;
            this.speedX = (Math.random() - 0.5) * 0.3;
            this.speedY = (Math.random() - 0.5) * 0.3;
            this.opacity = 0.15 + Math.random() * 0.15;
        }

        update(w, h) {
            this.x += this.speedX;
            this.y += this.speedY;
            this.rotation += this.rotationSpeed;

            if (this.x < -this.size) this.x = w + this.size;
            if (this.x > w + this.size) this.x = -this.size;
            if (this.y < -this.size) this.y = h + this.size;
            if (this.y > h + this.size) this.y = -this.size;
        }

        draw(ctx) {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotation);
            ctx.strokeStyle = `rgba(201, 169, 97, ${this.opacity})`;
            ctx.lineWidth = 1.5;
            
            ctx.beginPath();
            ctx.rect(-this.size/2, -this.size/2, this.size, this.size * 1.3);
            ctx.stroke();
            
            for (let i = 0; i < 4; i++) {
                ctx.beginPath();
                ctx.moveTo(-this.size/3, -this.size/4 + i * this.size/6);
                ctx.lineTo(this.size/3, -this.size/4 + i * this.size/6);
                ctx.stroke();
            }
            
            ctx.restore();
        }
    }

    let scale = new Scale(heroCanvas.width / 2, heroCanvas.height / 2);
    let documents = [];

    function createDocuments() {
        const screenSize = getScreenSize();
        const count = screenSize === 'mobile' ? 8 : screenSize === 'tablet' ? 12 : 18;
        documents = Array.from({ length: count }, () => 
            new Document(
                Math.random() * heroCanvas.width,
                Math.random() * heroCanvas.height,
                screenSize === 'mobile' ? 15 + Math.random() * 15 : 20 + Math.random() * 25
            )
        );
    }

    function animateHero() {
        if (!heroCanvas) return;
        heroCtx.clearRect(0, 0, heroCanvas.width, heroCanvas.height);
        
        documents.forEach(doc => {
            doc.update(heroCanvas.width, heroCanvas.height);
            doc.draw(heroCtx);
        });
        
        scale.update();
        scale.draw(heroCtx);
        
        requestAnimationFrame(animateHero);
    }
    
    window.addEventListener('resize', () => {
        scale = new Scale(heroCanvas.width / 2, heroCanvas.height / 2);
        createDocuments();
    });

    createDocuments();
    animateHero();
}


// ========== GENERIC ANIMATION LOGIC ==========
function createParticleAnimation(canvasId, particleClass, count) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let particles = Array.from({ length: count }, () => new particleClass(Math.random() * canvas.width, Math.random() * canvas.height, canvas));

    function animate() {
        if (!canvas) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.update();
            p.draw(ctx);
        });
        requestAnimationFrame(animate);
    }

    window.addEventListener('resize', () => {
        if (canvas) {
            particles = Array.from({ length: count }, () => new particleClass(Math.random() * canvas.width, Math.random() * canvas.height, canvas));
        }
    });
    
    animate();
}

// ========== PARTICLES FOR EACH SECTION ==========
class Knot {
    constructor(x, y) {
        this.x = x; this.y = y;
        this.size = 30 + Math.random() * 30;
        this.untangleProgress = Math.random();
        this.untangleSpeed = 0.001 + Math.random() * 0.001;
        this.rotation = Math.random() * Math.PI * 2;
        this.opacity = 0.08 + Math.random() * 0.05;
    }
    update() {
        this.untangleProgress += this.untangleSpeed;
        if (this.untangleProgress > 1) this.untangleProgress = 0;
        this.rotation += 0.003;
    }
    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.strokeStyle = `rgba(44, 44, 44, ${this.opacity})`;
        ctx.lineWidth = 1.5;
        const spread = this.untangleProgress * 40;
        for (let i = 0; i < 4; i++) {
            const angle = (i / 4) * Math.PI * 2;
            const startX = Math.cos(angle) * this.size * (1 - this.untangleProgress);
            const startY = Math.sin(angle) * this.size * (1 - this.untangleProgress);
            const endX = Math.cos(angle) * (this.size + spread);
            const endY = Math.sin(angle) * (this.size + spread);
            ctx.beginPath();
            ctx.moveTo(startX, startY);
            ctx.lineTo(endX, endY);
            ctx.stroke();
        }
        ctx.restore();
    }
}

class FloatingBook {
    constructor(x, y) {
        this.x = x; this.y = y; this.baseY = y;
        this.width = 20 + Math.random() * 15;
        this.height = this.width * 1.4;
        this.floatPhase = Math.random() * Math.PI * 2;
        this.floatSpeed = 0.01 + Math.random() * 0.01;
        this.opacity = 0.08 + Math.random() * 0.05;
    }
    update() {
        this.floatPhase += this.floatSpeed;
        this.y = this.baseY + Math.sin(this.floatPhase) * 15;
    }
    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.strokeStyle = `rgba(201, 169, 97, ${this.opacity})`;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.rect(-this.width/2, -this.height/2, this.width, this.height);
        ctx.stroke();
        ctx.restore();
    }
}

class StarRating {
    constructor(x, y) {
        this.x = x; this.y = y;
        this.size = 10 + Math.random() * 10;
        this.twinklePhase = Math.random() * Math.PI * 2;
        this.twinkleSpeed = 0.02 + Math.random() * 0.02;
        this.opacity = 0.1 + Math.random() * 0.08;
    }
    update() { this.twinklePhase += this.twinkleSpeed; }
    draw(ctx) {
        const twinkle = 0.7 + Math.sin(this.twinklePhase) * 0.3;
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.scale(twinkle, twinkle);
        ctx.fillStyle = `rgba(201, 169, 97, ${this.opacity})`;
        ctx.beginPath();
        for (let i = 0; i < 5; i++) {
            const angle = (i * 4 * Math.PI) / 5 - Math.PI / 2;
            const radius = i % 2 === 0 ? this.size : this.size / 2;
            ctx.lineTo(Math.cos(angle) * radius, Math.sin(angle) * radius);
        }
        ctx.closePath();
        ctx.fill();
        ctx.restore();
    }
}

class ContactNode {
    constructor(x, y, canvas) {
        this.x = x; this.y = y; this.canvas = canvas;
        this.vx = (Math.random() - 0.5) * 0.3;
        this.vy = (Math.random() - 0.5) * 0.3;
        this.size = 2 + Math.random() * 2;
        this.opacity = 0.1 + Math.random() * 0.1;
    }
    update() {
        this.x += this.vx; this.y += this.vy;
        if (this.x < 0 || this.x > this.canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > this.canvas.height) this.vy *= -1;
    }
    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(201, 169, 97, ${this.opacity})`;
        ctx.fill();
    }
}

class QuestionMark {
    constructor(x, y) {
        this.x = x; this.y = y;
        this.size = 20 + Math.random() * 20;
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 0.005;
        this.opacity = 0.06 + Math.random() * 0.04;
    }
    update() { this.rotation += this.rotationSpeed; }
    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.strokeStyle = `rgba(201, 169, 97, ${this.opacity})`;
        ctx.lineWidth = 2;
        ctx.font = `${this.size}px Playfair Display`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.strokeText('?', 0, 0);
        ctx.restore();
    }
}

class LegalBook {
    constructor(x, y) {
        this.x = x; this.y = y;
        this.size = 25 + Math.random() * 20;
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 0.003;
        this.opacity = 0.06 + Math.random() * 0.04;
    }
    update() { this.rotation += this.rotationSpeed; }
    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.strokeStyle = `rgba(255, 255, 255, ${this.opacity})`;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.rect(-this.size/2, -this.size/2, this.size, this.size * 1.4);
        ctx.stroke();
        ctx.restore();
    }
}

// Initialize animations
createParticleAnimation('problemsCanvas', Knot, 12);
createParticleAnimation('aboutCanvas', LegalBook, 15);
createParticleAnimation('blogCanvas', FloatingBook, 15);
createParticleAnimation('testimonialsCanvas', StarRating, 25);
createParticleAnimation('contactCanvas', ContactNode, 30);
createParticleAnimation('faqCanvas', QuestionMark, 15);
{// ========== DIFFERENTIALS SECTION ANIMATION ==========

// Animação da partícula para o canvas de fundo
class DifferentialParticle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = 20 + Math.random() * 20;
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 0.003;
        this.opacity = 0.05 + Math.random() * 0.03;
    }
    
    update() {
        this.rotation += this.rotationSpeed;
    }
    
    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.strokeStyle = `rgba(212, 175, 55, ${this.opacity})`;
        ctx.lineWidth = 1.5;
        
        // Desenha uma balança simples
        ctx.beginPath();
        ctx.moveTo(-this.size/2, 0);
        ctx.lineTo(this.size/2, 0);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.arc(0, -this.size/3, this.size/6, 0, Math.PI * 2);
        ctx.stroke();
        
        ctx.restore();
    }
}

// Inicializa a animação do canvas de fundo
createParticleAnimation('differentialsCanvas', DifferentialParticle, 12);

// ========== ROTATING TEXTS ANIMATION ==========
let diffCurrentIndex = 0;
const rotatingTextItems = document.querySelectorAll('.rotating-text-item');
const diffIndicators = document.querySelectorAll('.diff-indicator');

function rotateDifferentialsText() {
    if (rotatingTextItems.length === 0 || diffIndicators.length === 0) return;
    
    // Remove active da classe atual
    rotatingTextItems[diffCurrentIndex].classList.remove('active');
    diffIndicators[diffCurrentIndex].classList.remove('active');
    
    // Avança para o próximo
    diffCurrentIndex = (diffCurrentIndex + 1) % rotatingTextItems.length;
    
    // Adiciona active na nova classe
    rotatingTextItems[diffCurrentIndex].classList.add('active');
    diffIndicators[diffCurrentIndex].classList.add('active');
}

// Verifica se os elementos existem antes de iniciar
if (rotatingTextItems.length > 0 && diffIndicators.length > 0) {
    // Inicia a rotação automática após 1 segundo
    setTimeout(() => {
        setInterval(rotateDifferentialsText, 3000);
    }, 1000);
    
    // Click nos indicadores para navegação manual
    diffIndicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            if (diffCurrentIndex === index) return;
            
            rotatingTextItems[diffCurrentIndex].classList.remove('active');
            diffIndicators[diffCurrentIndex].classList.remove('active');
            
            diffCurrentIndex = index;
            
            rotatingTextItems[diffCurrentIndex].classList.add('active');
            diffIndicators[diffCurrentIndex].classList.add('active');
        });
    });
}

// ========== TOUCH EFFECTS PARA COMMITMENT CARDS ==========
addTouchEffects('.commitment-card');}