// ========== MOBILE MENU ==========
const mobileToggle = document.querySelector('.mobile-toggle');
const navLinks = document.querySelector('.nav-links');

mobileToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    mobileToggle.textContent = navLinks.classList.contains('active') ? '✕' : '☰';
});

// ========== HEADER SCROLL ==========
const header = document.querySelector('.header');
window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 50);
});

// ========== HERO CAROUSEL ==========
const slides = document.querySelectorAll('.hero-slide');
let currentSlide = 0;

setInterval(() => {
    slides[currentSlide].classList.remove('active');
    currentSlide = (currentSlide + 1) % slides.length;
    slides[currentSlide].classList.add('active');
}, 6000);

// ========== CAROUSEL FUNCTIONALITY ==========
class Carousel {
    constructor(container, options = {}) {
        this.container = document.getElementById(container);
        if (!this.container) return;
        
        this.wrapper = this.container.closest('.carousel-wrapper');
        this.items = Array.from(this.container.children);
        this.currentIndex = 0;
        this.startX = 0;
        this.currentX = 0;
        this.isDragging = false;
        this.threshold = 50;
        
        // Options
        this.autoPlay = options.autoPlay || false;
        this.autoPlayInterval = options.autoPlayInterval || 5000;
        
        this.init();
    }

    init() {
        if (window.innerWidth > 768) return;
        
        // Setup indicators
        this.createIndicators();
        
        // Setup controls
        this.setupControls();
        
        // Setup touch events
        this.setupTouchEvents();
        
        // Setup auto play if enabled
        if (this.autoPlay) {
            this.startAutoPlay();
        }
        
        // Initial position
        this.updatePosition();
    }

    createIndicators() {
        const indicatorsContainer = document.querySelector(`.carousel-indicators[data-carousel="${this.container.id}"]`);
        if (!indicatorsContainer) return;
        
        indicatorsContainer.innerHTML = '';
        this.items.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.classList.add('carousel-dot');
            if (index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => this.goToSlide(index));
            indicatorsContainer.appendChild(dot);
        });
        
        this.indicators = indicatorsContainer.querySelectorAll('.carousel-dot');
    }

    setupControls() {
        const prevBtn = document.querySelector(`.carousel-prev[data-carousel="${this.container.id}"]`);
        const nextBtn = document.querySelector(`.carousel-next[data-carousel="${this.container.id}"]`);
        
        if (prevBtn) {
            prevBtn.addEventListener('click', () => this.prev());
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', () => this.next());
        }
    }

    setupTouchEvents() {
        this.container.addEventListener('touchstart', (e) => this.touchStart(e), { passive: true });
        this.container.addEventListener('touchmove', (e) => this.touchMove(e), { passive: true });
        this.container.addEventListener('touchend', () => this.touchEnd());
        
        this.container.addEventListener('mousedown', (e) => this.touchStart(e));
        this.container.addEventListener('mousemove', (e) => this.touchMove(e));
        this.container.addEventListener('mouseup', () => this.touchEnd());
        this.container.addEventListener('mouseleave', () => this.touchEnd());
    }

    touchStart(e) {
        this.isDragging = true;
        this.startX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
        this.currentX = this.startX;
        this.container.style.transition = 'none';
    }

    touchMove(e) {
        if (!this.isDragging) return;
        
        e.preventDefault();
        this.currentX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
        const diff = this.currentX - this.startX;
        const currentTranslate = -this.currentIndex * 100;
        const translate = currentTranslate + (diff / this.container.offsetWidth) * 100;
        
        this.container.style.transform = `translateX(${translate}%)`;
    }

    touchEnd() {
        if (!this.isDragging) return;
        
        this.isDragging = false;
        const diff = this.currentX - this.startX;
        
        if (Math.abs(diff) > this.threshold) {
            if (diff > 0) {
                this.prev();
            } else {
                this.next();
            }
        } else {
            this.updatePosition();
        }
    }

    prev() {
        this.currentIndex = Math.max(0, this.currentIndex - 1);
        this.updatePosition();
    }

    next() {
        this.currentIndex = Math.min(this.items.length - 1, this.currentIndex + 1);
        this.updatePosition();
    }

    goToSlide(index) {
        this.currentIndex = index;
        this.updatePosition();
    }

    updatePosition() {
        const translateX = -this.currentIndex * 100;
        this.container.style.transition = 'transform 0.4s cubic-bezier(0.4, 0.0, 0.2, 1)';
        this.container.style.transform = `translateX(${translateX}%)`;
        
        // Update indicators
        if (this.indicators) {
            this.indicators.forEach((dot, index) => {
                dot.classList.toggle('active', index === this.currentIndex);
            });
        }
    }

    startAutoPlay() {
        this.autoPlayTimer = setInterval(() => {
            if (this.currentIndex === this.items.length - 1) {
                this.goToSlide(0);
            } else {
                this.next();
            }
        }, this.autoPlayInterval);
    }

    stopAutoPlay() {
        if (this.autoPlayTimer) {
            clearInterval(this.autoPlayTimer);
        }
    }
}

// Initialize carousels
let carousels = [];

function initCarousels() {
    // Clear existing carousels
    carousels = [];
    
    // Only initialize on mobile
    if (window.innerWidth <= 768) {
        carousels.push(new Carousel('problemsCarousel'));
        carousels.push(new Carousel('benefitsCarousel'));
        carousels.push(new Carousel('blogCarousel'));
        carousels.push(new Carousel('testimonialsCarousel'));
    }
}

// Initialize on load
initCarousels();

// Reinitialize on resize
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        initCarousels();
        resizeCanvas(heroCanvas);
        resizeCanvas(problemsCanvas);
        resizeCanvas(benefitsCanvas);
        resizeCanvas(aboutCanvas);
        resizeCanvas(blogCanvas);
        resizeCanvas(testimonialsCanvas);
        resizeCanvas(contactCanvas);
        resizeCanvas(faqCanvas);
    }, 250);
});

// ========== HERO ANIMATION: Balança da Justiça com Documentos ==========
const heroCanvas = document.getElementById('heroCanvas');
const heroCtx = heroCanvas.getContext('2d');

function resizeCanvas(canvas) {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
}
resizeCanvas(heroCanvas);

// Detectar tamanho de tela
function getScreenSize() {
    const width = window.innerWidth;
    if (width < 768) return 'mobile';
    if (width < 1024) return 'tablet';
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
        
        // Base
        ctx.strokeStyle = 'rgba(201, 169, 97, 0.6)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY + 80);
        ctx.lineTo(centerX, centerY - 40);
        ctx.stroke();
        
        // Beam
        const beamLength = 120;
        ctx.save();
        ctx.translate(centerX, centerY - 40);
        ctx.rotate(swing);
        ctx.beginPath();
        ctx.moveTo(-beamLength, 0);
        ctx.lineTo(beamLength, 0);
        ctx.stroke();
        
        // Chains and plates
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
        
        // Top decoration
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
        
        // Document outline
        ctx.beginPath();
        ctx.rect(-this.size/2, -this.size/2, this.size, this.size * 1.3);
        ctx.stroke();
        
        // Lines
        for (let i = 0; i < 4; i++) {
            ctx.beginPath();
            ctx.moveTo(-this.size/3, -this.size/4 + i * this.size/6);
            ctx.lineTo(this.size/3, -this.size/4 + i * this.size/6);
            ctx.stroke();
        }
        
        ctx.restore();
    }
}

const scale = new Scale(heroCanvas.width / 2, heroCanvas.height / 2);

// Ajustar número de documentos baseado no tamanho da tela
function createDocuments() {
    const screenSize = getScreenSize();
    const count = screenSize === 'mobile' ? 10 : screenSize === 'tablet' ? 15 : 20;
    return Array.from({ length: count }, () => 
        new Document(
            Math.random() * heroCanvas.width,
            Math.random() * heroCanvas.height,
            screenSize === 'mobile' ? 15 + Math.random() * 20 : 20 + Math.random() * 30
        )
    );
}

let documents = createDocuments();

function animateHero() {
    heroCtx.clearRect(0, 0, heroCanvas.width, heroCanvas.height);
    
    documents.forEach(doc => {
        doc.update(heroCanvas.width, heroCanvas.height);
        doc.draw(heroCtx);
    });
    
    scale.update();
    scale.draw(heroCtx);
    
    requestAnimationFrame(animateHero);
}
animateHero();

// ========== PROBLEMS ANIMATION: Nós se Desfazendo ==========
const problemsCanvas = document.getElementById('problemsCanvas');
const problemsCtx = problemsCanvas.getContext('2d');
resizeCanvas(problemsCanvas);

class Knot {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = 40 + Math.random() * 40;
        this.complexity = Math.floor(3 + Math.random() * 3);
        this.untangleProgress = 0;
        this.untangleSpeed = 0.002 + Math.random() * 0.002;
        this.rotation = Math.random() * Math.PI * 2;
        this.opacity = 0.15 + Math.random() * 0.1;
    }

    update() {
        this.untangleProgress += this.untangleSpeed;
        if (this.untangleProgress > 1) this.untangleProgress = 0;
        this.rotation += 0.005;
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.strokeStyle = `rgba(44, 44, 44, ${this.opacity})`;
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        
        const progress = this.untangleProgress;
        const spread = progress * 60;
        
        for (let i = 0; i < this.complexity; i++) {
            const angle = (i / this.complexity) * Math.PI * 2;
            const startX = Math.cos(angle) * (this.size/2) * (1 - progress);
            const startY = Math.sin(angle) * (this.size/2) * (1 - progress);
            const endX = Math.cos(angle) * (this.size/2 + spread);
            const endY = Math.sin(angle) * (this.size/2 + spread);
            
            ctx.beginPath();
            ctx.moveTo(startX, startY);
            
            const cp1x = Math.cos(angle + 0.5) * this.size * (1 - progress * 0.5);
            const cp1y = Math.sin(angle + 0.5) * this.size * (1 - progress * 0.5);
            const cp2x = Math.cos(angle - 0.5) * this.size * (1 - progress * 0.3);
            const cp2y = Math.sin(angle - 0.5) * this.size * (1 - progress * 0.3);
            
            ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, endX, endY);
            ctx.stroke();
        }
        
        ctx.restore();
    }
}

const knots = Array.from({ length: 15 }, () =>
    new Knot(
        Math.random() * problemsCanvas.width,
        Math.random() * problemsCanvas.height
    )
);

// Recriar elementos ao redimensionar
let lastScreenSize = getScreenSize();
function checkResize() {
    const currentSize = getScreenSize();
    if (currentSize !== lastScreenSize) {
        lastScreenSize = currentSize;
        documents = createDocuments();
    }
}
setInterval(checkResize, 1000);

function animateProblems() {
    problemsCtx.clearRect(0, 0, problemsCanvas.width, problemsCanvas.height);
    knots.forEach(knot => {
        knot.update();
        knot.draw(problemsCtx);
    });
    requestAnimationFrame(animateProblems);
}
animateProblems();

// ========== BENEFITS ANIMATION: Escudos de Proteção ==========
const benefitsCanvas = document.getElementById('benefitsCanvas');
const benefitsCtx = benefitsCanvas.getContext('2d');
resizeCanvas(benefitsCanvas);

class Shield {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = 30 + Math.random() * 30;
        this.pulsePhase = Math.random() * Math.PI * 2;
        this.pulseSpeed = 0.02;
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = 0.005;
        this.opacity = 0.1 + Math.random() * 0.08;
    }

    update() {
        this.pulsePhase += this.pulseSpeed;
        this.rotation += this.rotationSpeed;
    }

    draw(ctx) {
        const pulse = 1 + Math.sin(this.pulsePhase) * 0.15;
        
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.scale(pulse, pulse);
        
        ctx.strokeStyle = `rgba(201, 169, 97, ${this.opacity})`;
        ctx.lineWidth = 1.5;
        
        // Shield shape
        ctx.beginPath();
        ctx.moveTo(0, -this.size);
        ctx.bezierCurveTo(
            this.size * 0.7, -this.size,
            this.size * 0.7, 0,
            0, this.size * 1.2
        );
        ctx.bezierCurveTo(
            -this.size * 0.7, 0,
            -this.size * 0.7, -this.size,
            0, -this.size
        );
        ctx.stroke();
        
        // Inner decoration
        ctx.beginPath();
        ctx.moveTo(0, -this.size * 0.6);
        ctx.lineTo(0, this.size * 0.7);
        ctx.moveTo(-this.size * 0.4, -this.size * 0.3);
        ctx.lineTo(this.size * 0.4, -this.size * 0.3);
        ctx.stroke();
        
        ctx.restore();
    }
}

const shields = Array.from({ length: 25 }, () =>
    new Shield(
        Math.random() * benefitsCanvas.width,
        Math.random() * benefitsCanvas.height
    )
);

function animateBenefits() {
    benefitsCtx.clearRect(0, 0, benefitsCanvas.width, benefitsCanvas.height);
    shields.forEach(shield => {
        shield.update();
        shield.draw(benefitsCtx);
    });
    requestAnimationFrame(animateBenefits);
}
animateBenefits();

// ========== ABOUT ANIMATION: Linha do Tempo ==========
const aboutCanvas = document.getElementById('aboutCanvas');
const aboutCtx = aboutCanvas.getContext('2d');
resizeCanvas(aboutCanvas);

class Timeline {
    constructor() {
        this.progress = 0;
        this.speed = 0.003;
        this.nodes = [
            { year: '2015', label: 'Fundação', x: 0.15 },
            { year: '2017', label: '50 Clientes', x: 0.30 },
            { year: '2019', label: '100 Clientes', x: 0.45 },
            { year: '2021', label: 'Expansão Nacional', x: 0.60 },
            { year: '2023', label: '200 Clientes', x: 0.75 },
            { year: '2025', label: 'Líder de Mercado', x: 0.90 }
        ];
    }

    update() {
        this.progress += this.speed;
        if (this.progress > 1) this.progress = 0;
    }

    draw(ctx, w, h) {
        const centerY = h / 2;
        const startX = w * 0.1;
        const endX = w * 0.9;
        
        // Main line - mais visível
        ctx.strokeStyle = 'rgba(201, 169, 97, 0.5)';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(startX, centerY);
        ctx.lineTo(endX, centerY);
        ctx.stroke();
        
        // Progress line - mais visível
        const progressX = startX + (endX - startX) * this.progress;
        ctx.strokeStyle = 'rgba(201, 169, 97, 0.9)';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(startX, centerY);
        ctx.lineTo(progressX, centerY);
        ctx.stroke();
        
        // Nodes
        this.nodes.forEach((node, i) => {
            const x = startX + (endX - startX) * node.x;
            const revealed = this.progress >= node.x;
            const isActive = Math.abs(this.progress - node.x) < 0.05;
            
            // Node circle - mais visível
            ctx.beginPath();
            ctx.arc(x, centerY, isActive ? 14 : 10, 0, Math.PI * 2);
            ctx.fillStyle = revealed ? 'rgba(201, 169, 97, 0.95)' : 'rgba(201, 169, 97, 0.4)';
            ctx.fill();
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.95)';
            ctx.lineWidth = 3;
            ctx.stroke();
            
            if (revealed) {
                // Connection line
                const isTop = i % 2 === 0;
                const yOffset = isTop ? -70 : 70;
                
                ctx.strokeStyle = 'rgba(201, 169, 97, 0.5)';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(x, centerY);
                ctx.lineTo(x, centerY + yOffset);
                ctx.stroke();
                
                // Text - mais visível
                ctx.font = 'bold 16px Inter';
                ctx.fillStyle = 'rgba(201, 169, 97, 1)';
                ctx.textAlign = 'center';
                ctx.fillText(node.year, x, centerY + yOffset + (isTop ? -12 : 22));
                
                ctx.font = '13px Inter';
                ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
                ctx.fillText(node.label, x, centerY + yOffset + (isTop ? -28 : 38));
            }
        });
    }
}

const timeline = new Timeline();

function animateAbout() {
    aboutCtx.clearRect(0, 0, aboutCanvas.width, aboutCanvas.height);
    timeline.update();
    timeline.draw(aboutCtx, aboutCanvas.width, aboutCanvas.height);
    requestAnimationFrame(animateAbout);
}
animateAbout();

// ========== ABOUT VISUAL CANVAS ==========
const aboutVisualCanvas = document.getElementById('aboutVisualCanvas');
const aboutVisualCtx = aboutVisualCanvas.getContext('2d');

function resizeAboutVisualCanvas() {
    const container = aboutVisualCanvas.parentElement;
    const width = Math.min(container.offsetWidth, 400);
    const height = container.offsetHeight;
    aboutVisualCanvas.width = width;
    aboutVisualCanvas.height = height;
}
resizeAboutVisualCanvas();
window.addEventListener('resize', resizeAboutVisualCanvas);

class ConnectionNetwork {
    constructor(canvas) {
        this.canvas = canvas;
        this.nodes = [];
        this.connections = [];
        this.time = 0;
        this.createNodes();
    }
    
    createNodes() {
        this.nodes = [];
        const nodeCount = getScreenSize() === 'mobile' ? 20 : 30;
        
        for (let i = 0; i < nodeCount; i++) {
            this.nodes.push({
                x: 50 + Math.random() * (this.canvas.width - 100),
                y: 50 + Math.random() * (this.canvas.height - 100),
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                size: 2 + Math.random() * 3,
                pulsePhase: Math.random() * Math.PI * 2
            });
        }
    }

    update() {
        this.time += 0.01;
        
        // Atualizar limites baseado no tamanho atual do canvas
        const maxX = this.canvas.width - 20;
        const maxY = this.canvas.height - 20;
        
        // Update nodes
        this.nodes.forEach(node => {
            node.x += node.vx;
            node.y += node.vy;
            node.pulsePhase += 0.03;
            
            // Bounce off edges
            if (node.x < 20 || node.x > maxX) node.vx *= -1;
            if (node.y < 20 || node.y > maxY) node.vy *= -1;
        });
        
        // Update connections
        this.connections = [];
        for (let i = 0; i < this.nodes.length; i++) {
            for (let j = i + 1; j < this.nodes.length; j++) {
                const dx = this.nodes[i].x - this.nodes[j].x;
                const dy = this.nodes[i].y - this.nodes[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                
                if (dist < 120) {
                    this.connections.push({
                        from: this.nodes[i],
                        to: this.nodes[j],
                        opacity: (1 - dist / 120) * 0.4
                    });
                }
            }
        }
    }

    draw(ctx) {
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw connections
        this.connections.forEach(conn => {
            ctx.beginPath();
            ctx.moveTo(conn.from.x, conn.from.y);
            ctx.lineTo(conn.to.x, conn.to.y);
            ctx.strokeStyle = `rgba(201, 169, 97, ${conn.opacity})`;
            ctx.lineWidth = 1;
            ctx.stroke();
        });
        
        // Draw nodes
        this.nodes.forEach(node => {
            const pulse = 1 + Math.sin(node.pulsePhase) * 0.3;
            ctx.beginPath();
            ctx.arc(node.x, node.y, node.size * pulse, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(201, 169, 97, 0.9)';
            ctx.fill();
            
            ctx.beginPath();
            ctx.arc(node.x, node.y, node.size * pulse + 4, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(201, 169, 97, ${0.3 * pulse})`;
            ctx.lineWidth = 2;
            ctx.stroke();
        });
    }
}

const network = new ConnectionNetwork(aboutVisualCanvas);

function animateAboutVisual() {
    network.update();
    network.draw(aboutVisualCtx);
    requestAnimationFrame(animateAboutVisual);
}
animateAboutVisual();

// Recriar nós quando o canvas for redimensionado
let lastAboutWidth = aboutVisualCanvas.width;
setInterval(() => {
    if (aboutVisualCanvas.width !== lastAboutWidth) {
        lastAboutWidth = aboutVisualCanvas.width;
        network.createNodes();
    }
}, 1000);

// ========== BLOG ANIMATION: Livros Flutuantes ==========
const blogCanvas = document.getElementById('blogCanvas');
const blogCtx = blogCanvas.getContext('2d');
resizeCanvas(blogCanvas);

class FloatingBook {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.baseY = y;
        this.width = 25 + Math.random() * 20;
        this.height = this.width * 1.4;
        this.floatPhase = Math.random() * Math.PI * 2;
        this.floatSpeed = 0.01 + Math.random() * 0.01;
        this.floatAmplitude = 10 + Math.random() * 10;
        this.rotation = (Math.random() - 0.5) * 0.3;
        this.opacity = 0.08 + Math.random() * 0.07;
    }

    update() {
        this.floatPhase += this.floatSpeed;
        this.y = this.baseY + Math.sin(this.floatPhase) * this.floatAmplitude;
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        
        ctx.strokeStyle = `rgba(201, 169, 97, ${this.opacity})`;
        ctx.lineWidth = 1.5;
        
        // Book cover
        ctx.beginPath();
        ctx.rect(-this.width/2, -this.height/2, this.width, this.height);
        ctx.stroke();
        
        // Spine
        ctx.beginPath();
        ctx.moveTo(-this.width/2 + 5, -this.height/2);
        ctx.lineTo(-this.width/2 + 5, this.height/2);
        ctx.stroke();
        
        // Pages detail
        ctx.strokeStyle = `rgba(44, 44, 44, ${this.opacity * 0.6})`;
        for (let i = 0; i < 3; i++) {
            ctx.beginPath();
            ctx.moveTo(-this.width/4, -this.height/4 + i * this.height/6);
            ctx.lineTo(this.width/3, -this.height/4 + i * this.height/6);
            ctx.stroke();
        }
        
        ctx.restore();
    }
}

const books = Array.from({ length: 20 }, () =>
    new FloatingBook(
        Math.random() * blogCanvas.width,
        Math.random() * blogCanvas.height
    )
);

function animateBlog() {
    blogCtx.clearRect(0, 0, blogCanvas.width, blogCanvas.height);
    books.forEach(book => {
        book.update();
        book.draw(blogCtx);
    });
    requestAnimationFrame(animateBlog);
}
animateBlog();

// ========== TESTIMONIALS ANIMATION: Estrelas e Feedback ==========
const testimonialsCanvas = document.getElementById('testimonialsCanvas');
const testimonialsCtx = testimonialsCanvas.getContext('2d');
resizeCanvas(testimonialsCanvas);

class StarRating {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = 15 + Math.random() * 15;
        this.twinklePhase = Math.random() * Math.PI * 2;
        this.twinkleSpeed = 0.02 + Math.random() * 0.02;
        this.opacity = 0.1 + Math.random() * 0.08;
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 0.01;
    }

    update() {
        this.twinklePhase += this.twinkleSpeed;
        this.rotation += this.rotationSpeed;
    }

    draw(ctx) {
        const twinkle = 0.7 + Math.sin(this.twinklePhase) * 0.3;
        
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.scale(twinkle, twinkle);
        
        ctx.fillStyle = `rgba(201, 169, 97, ${this.opacity})`;
        ctx.strokeStyle = `rgba(201, 169, 97, ${this.opacity})`;
        ctx.lineWidth = 1.5;
        
        // Star shape
        ctx.beginPath();
        for (let i = 0; i < 5; i++) {
            const angle = (i * 4 * Math.PI) / 5 - Math.PI / 2;
            const radius = i % 2 === 0 ? this.size : this.size / 2;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.stroke();
        
        ctx.restore();
    }
}

const stars = Array.from({ length: 30 }, () =>
    new StarRating(
        Math.random() * testimonialsCanvas.width,
        Math.random() * testimonialsCanvas.height
    )
);

function animateTestimonials() {
    testimonialsCtx.clearRect(0, 0, testimonialsCanvas.width, testimonialsCanvas.height);
    stars.forEach(star => {
        star.update();
        star.draw(testimonialsCtx);
    });
    requestAnimationFrame(animateTestimonials);
}
animateTestimonials();

// ========== CONTACT ANIMATION: Rede de Conexões ==========
const contactCanvas = document.getElementById('contactCanvas');
const contactCtx = contactCanvas.getContext('2d');
resizeCanvas(contactCanvas);

class ContactNode {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.vx = (Math.random() - 0.5) * 0.4;
        this.vy = (Math.random() - 0.5) * 0.4;
        this.size = 3 + Math.random() * 3;
        this.pulsePhase = Math.random() * Math.PI * 2;
        this.opacity = 0.1 + Math.random() * 0.1;
    }

    update(w, h) {
        this.x += this.vx;
        this.y += this.vy;
        this.pulsePhase += 0.03;
        
        if (this.x < 0 || this.x > w) this.vx *= -1;
        if (this.y < 0 || this.y > h) this.vy *= -1;
    }

    draw(ctx) {
        const pulse = 1 + Math.sin(this.pulsePhase) * 0.2;
        
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * pulse, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(201, 169, 97, ${this.opacity})`;
        ctx.fill();
    }
}

const contactNodes = Array.from({ length: 40 }, () =>
    new ContactNode(
        Math.random() * contactCanvas.width,
        Math.random() * contactCanvas.height
    )
);

function animateContact() {
    contactCtx.clearRect(0, 0, contactCanvas.width, contactCanvas.height);
    
    // Update nodes
    contactNodes.forEach(node => {
        node.update(contactCanvas.width, contactCanvas.height);
    });
    
    // Draw connections
    for (let i = 0; i < contactNodes.length; i++) {
        for (let j = i + 1; j < contactNodes.length; j++) {
            const dx = contactNodes[i].x - contactNodes[j].x;
            const dy = contactNodes[i].y - contactNodes[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            if (dist < 100) {
                contactCtx.beginPath();
                contactCtx.moveTo(contactNodes[i].x, contactNodes[i].y);
                contactCtx.lineTo(contactNodes[j].x, contactNodes[j].y);
                contactCtx.strokeStyle = `rgba(201, 169, 97, ${(1 - dist / 100) * 0.1})`;
                contactCtx.lineWidth = 1;
                contactCtx.stroke();
            }
        }
    }
    
    // Draw nodes
    contactNodes.forEach(node => node.draw(contactCtx));
    
    requestAnimationFrame(animateContact);
}
animateContact();

// ========== FAQ ANIMATION: Pontos de Interrogação ==========
const faqCanvas = document.getElementById('faqCanvas');
const faqCtx = faqCanvas.getContext('2d');
resizeCanvas(faqCanvas);

class QuestionMark {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = 25 + Math.random() * 25;
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 0.008;
        this.pulsePhase = Math.random() * Math.PI * 2;
        this.pulseSpeed = 0.015 + Math.random() * 0.015;
        this.opacity = 0.06 + Math.random() * 0.05;
    }

    update() {
        this.rotation += this.rotationSpeed;
        this.pulsePhase += this.pulseSpeed;
    }

    draw(ctx) {
        const pulse = 1 + Math.sin(this.pulsePhase) * 0.15;
        
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.scale(pulse, pulse);
        
        ctx.strokeStyle = `rgba(201, 169, 97, ${this.opacity})`;
        ctx.fillStyle = `rgba(201, 169, 97, ${this.opacity})`;
        ctx.lineWidth = 2;
        
        // Circle around question mark
        ctx.beginPath();
        ctx.arc(0, 0, this.size, 0, Math.PI * 2);
        ctx.stroke();
        
        // Question mark
        ctx.font = `${this.size * 0.9}px Playfair Display`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('?', 0, this.size * 0.05);
        
        ctx.restore();
    }
}

const questions = Array.from({ length: 18 }, () =>
    new QuestionMark(
        Math.random() * faqCanvas.width,
        Math.random() * faqCanvas.height
    )
);

function animateFaq() {
    faqCtx.clearRect(0, 0, faqCanvas.width, faqCanvas.height);
    questions.forEach(q => {
        q.update();
        q.draw(faqCtx);
    });
    requestAnimationFrame(animateFaq);
}
animateFaq();

// ========== FAQ ACCORDION ==========
const faqItems = document.querySelectorAll('.faq-item');

faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    
    question.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        
        faqItems.forEach(i => i.classList.remove('active'));
        
        if (!isActive) {
            item.classList.add('active');
        }
    });
});

// ========== SMOOTH SCROLL ==========
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            navLinks.classList.remove('active');
            mobileToggle.textContent = '☰';
        }
    });
});

// ========== FORM SUBMISSION ==========
const contactForm = document.querySelector('.contact-form form');
contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    alert('Mensagem enviada com sucesso! Nossa equipe entrará em contato em até 2 horas úteis.');
    contactForm.reset();
});

// ========== TOUCH EFFECTS FOR MOBILE ==========
function addTouchEffects(selector) {
    const elements = document.querySelectorAll(selector);
    elements.forEach(element => {
        element.addEventListener('touchstart', function() {
            this.classList.add('touch-active');
        });
        
        element.addEventListener('touchend', function() {
            setTimeout(() => {
                this.classList.remove('touch-active');
            }, 300);
        });
        
        element.addEventListener('touchcancel', function() {
            this.classList.remove('touch-active');
        });
    });
}

// Aplicar efeitos touch em todos os cards interativos
addTouchEffects('.problem-card');
addTouchEffects('.benefit-card');
addTouchEffects('.blog-card');
addTouchEffects('.testimonial-card');
addTouchEffects('.faq-item');
addTouchEffects('.contact-item');

// ========== RESPONSIVE CANVAS OPTIMIZATION ==========
// Reduzir elementos em telas menores para melhor performance
function optimizeCanvasForScreen() {
    const screenSize = getScreenSize();
    
    if (screenSize === 'mobile') {
        // Reduzir opacidade das animações em mobile para não sobrecarregar
        heroCanvas.style.opacity = '0.35';
        problemsCanvas.style.opacity = '0.06';
        benefitsCanvas.style.opacity = '0.06';
        aboutCanvas.style.opacity = '0.06';
        blogCanvas.style.opacity = '0.06';
        testimonialsCanvas.style.opacity = '0.06';
        contactCanvas.style.opacity = '0.06';
        faqCanvas.style.opacity = '0.06';
    } else if (screenSize === 'tablet') {
        heroCanvas.style.opacity = '0.4';
        problemsCanvas.style.opacity = '0.08';
        benefitsCanvas.style.opacity = '0.08';
        aboutCanvas.style.opacity = '0.08';
        blogCanvas.style.opacity = '0.08';
        testimonialsCanvas.style.opacity = '0.08';
        contactCanvas.style.opacity = '0.08';
        faqCanvas.style.opacity = '0.08';
    } else {
        heroCanvas.style.opacity = '0.4';
        problemsCanvas.style.opacity = '0.08';
        benefitsCanvas.style.opacity = '0.08';
        aboutCanvas.style.opacity = '0.08';
        blogCanvas.style.opacity = '0.08';
        testimonialsCanvas.style.opacity = '0.08';
        contactCanvas.style.opacity = '0.08';
        faqCanvas.style.opacity = '0.08';
    }
}

optimizeCanvasForScreen();
window.addEventListener('resize', optimizeCanvasForScreen);
