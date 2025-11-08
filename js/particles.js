class Particles {
    constructor(containerId, options = {}) {
        this.container = document.getElementById(containerId);
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.container.appendChild(this.canvas);
        
        // Configuración por defecto con más partículas y movimiento más lento
        this.config = {
            quantity: options.quantity || 80, // Más partículas por defecto
            staticity: options.staticity || 80, // Más estático = más lento
            ease: options.ease || 30, // Menos ease = más rápido seguimiento
            dpr: window.devicePixelRatio || 1
        };
        
        // Estado
        this.mouse = { x: 0, y: 0 };
        this.canvasSize = { w: 0, h: 0 };
        this.circles = [];
        
        // Inicializar
        this.init();
    }
    
    init() {
        this.initCanvas();
        this.initEvents();
        this.animate();
    }
    
    initCanvas() {
        this.resizeCanvas();
        this.drawParticles();
    }
    
    initEvents() {
        window.addEventListener('resize', () => this.resizeCanvas());
        document.addEventListener('mousemove', (e) => this.onMouseMove(e));
    }
    
    resizeCanvas() {
        this.canvasSize.w = this.container.offsetWidth;
        this.canvasSize.h = this.container.offsetHeight;
        
        this.canvas.width = this.canvasSize.w * this.config.dpr;
        this.canvas.height = this.canvasSize.h * this.config.dpr;
        this.canvas.style.width = `${this.canvasSize.w}px`;
        this.canvas.style.height = `${this.canvasSize.h}px`;
        this.ctx.scale(this.config.dpr, this.config.dpr);
        
        // Redibujar partículas si el canvas cambia de tamaño
        this.drawParticles();
    }
    
    onMouseMove(e) {
        const rect = this.canvas.getBoundingClientRect();
        const { w, h } = this.canvasSize;
        const x = e.clientX - rect.left - w / 2;
        const y = e.clientY - rect.top - h / 2;
        const inside = x < w / 2 && x > -w / 2 && y < h / 2 && y > -h / 2;
        
        if (inside) {
            this.mouse.x = x;
            this.mouse.y = y;
        }
    }
    
    circleParams() {
        const x = Math.floor(Math.random() * this.canvasSize.w);
        const y = Math.floor(Math.random() * this.canvasSize.h);
        const translateX = 0;
        const translateY = 0;
        const size = Math.floor(Math.random() * 2) + 0.1;
        const alpha = 0;
        const targetAlpha = parseFloat((Math.random() * 0.6 + 0.1).toFixed(1));
        const dx = (Math.random() - 0.5) * 0.2;
        const dy = (Math.random() - 0.5) * 0.2;
        const magnetism = 0.1 + Math.random() * 4;
        
        return {
            x,
            y,
            translateX,
            translateY,
            size,
            alpha,
            targetAlpha,
            dx,
            dy,
            magnetism
        };
    }
    
    drawCircle(circle, update = false) {
        const { x, y, translateX, translateY, size, alpha } = circle;
        
        this.ctx.save();
        this.ctx.translate(translateX, translateY);
        this.ctx.beginPath();
        this.ctx.arc(x, y, size, 0, 2 * Math.PI);
        this.ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        this.ctx.fill();
        this.ctx.restore();
        
        if (!update) {
            this.circles.push(circle);
        }
    }
    
    clearContext() {
        this.ctx.clearRect(0, 0, this.canvasSize.w, this.canvasSize.h);
    }
    
    drawParticles() {
        this.clearContext();
        this.circles = [];
        
        for (let i = 0; i < this.config.quantity; i++) {
            const circle = this.circleParams();
            this.drawCircle(circle);
        }
    }
    
    remapValue(value, start1, end1, start2, end2) {
        const remapped = ((value - start1) * (end2 - start2)) / (end1 - start1) + start2;
        return remapped > 0 ? remapped : 0;
    }
    
    animate() {
        this.clearContext();
        
        this.circles.forEach((circle, i) => {
            // Manejar el valor alpha
            const edge = [
                circle.x + circle.translateX - circle.size,
                this.canvasSize.w - circle.x - circle.translateX - circle.size,
                circle.y + circle.translateY - circle.size,
                this.canvasSize.h - circle.y - circle.translateY - circle.size
            ];
            
            const closestEdge = edge.reduce((a, b) => Math.min(a, b));
            const remapClosestEdge = parseFloat(
                this.remapValue(closestEdge, 0, 20, 0, 1).toFixed(2)
            );
            
            if (remapClosestEdge > 1) {
                circle.alpha += 0.02;
                if (circle.alpha > circle.targetAlpha) {
                    circle.alpha = circle.targetAlpha;
                }
            } else {
                circle.alpha = circle.targetAlpha * remapClosestEdge;
            }
            
            circle.x += circle.dx;
            circle.y += circle.dy;
            
            circle.translateX +=
                (this.mouse.x / (this.config.staticity / circle.magnetism) - circle.translateX) /
                this.config.ease;
            circle.translateY +=
                (this.mouse.y / (this.config.staticity / circle.magnetism) - circle.translateY) /
                this.config.ease;
            
            // Si el círculo sale del canvas
            if (
                circle.x < -circle.size ||
                circle.x > this.canvasSize.w + circle.size ||
                circle.y < -circle.size ||
                circle.y > this.canvasSize.h + circle.size
            ) {
                // Eliminar el círculo del array
                this.circles.splice(i, 1);
                // Crear un nuevo círculo
                const newCircle = this.circleParams();
                this.drawCircle(newCircle);
            } else {
                this.drawCircle(
                    {
                        ...circle,
                        x: circle.x,
                        y: circle.y,
                        translateX: circle.translateX,
                        translateY: circle.translateY,
                        alpha: circle.alpha
                    },
                    true
                );
            }
        });
        
        requestAnimationFrame(() => this.animate());
    }
}