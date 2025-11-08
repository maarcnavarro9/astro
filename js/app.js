document.addEventListener('DOMContentLoaded', function() {
    // Inicializar partículas con más partículas y movimiento más lento
    const particles = new Particles('particles-container', {
        quantity: 80,    // Más partículas por defecto
        staticity: 80,   // Más estático = movimiento más lento
        ease: 30         // Seguimiento más suave
    });
    
    // Efecto de escritura para el título (opcional)
    const title = document.querySelector('.profile-info h1');
    const originalText = title.textContent;
    title.textContent = '';
    
    let i = 0;
    const typeWriter = () => {
        if (i < originalText.length) {
            title.textContent += originalText.charAt(i);
            i++;
            setTimeout(typeWriter, 100);
        }
    };
    
    // Iniciar efecto de escritura después de un breve delay
    setTimeout(typeWriter, 1000);
});