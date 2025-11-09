document.addEventListener("DOMContentLoaded", function () {
  // Inicializar partículas con más partículas y movimiento más lento
  const particles = new Particles("particles-container", {
    quantity: 80, // Más partículas por defecto
    staticity: 80, // Más estático = movimiento más lento
    ease: 30, // Seguimiento más suave
  });

  // Efecto de escritura para el título con borrado lento
  const title = document.querySelector(".profile-info h1");
  const originalText = "Marc Navarro";

  function typeWriter() {
    let i = 0;
    title.textContent = "";

    // Fase de escritura
    const typing = () => {
      if (i < originalText.length) {
        title.textContent += originalText.charAt(i);
        i++;
        setTimeout(typing, 80); // Velocidad de escritura
      } else {
        // Esperar 2 segundos y empezar a borrar
        setTimeout(deleteText, 2000);
      }
    };

    // Fase de borrado
    const deleteText = () => {
      let currentText = title.textContent;
      if (currentText.length > 0) {
        title.textContent = currentText.slice(0, -1);
        setTimeout(deleteText, 60); // Velocidad de borrado (un poco más rápido)
      } else {
        // Reiniciar el ciclo después de una pausa corta
        setTimeout(typeWriter, 500);
      }
    };

    typing();
  }

  // Iniciar efecto de escritura inmediatamente
  typeWriter();

  // Función específica para elemento con ID
  function updateCurrentYear() {
    const currentYear = new Date().getFullYear();
    const yearElement = document.getElementById("current-year");

    if (yearElement) {
      yearElement.textContent = currentYear;
    }
  }

  // EJECUTAR DIRECTAMENTE - SIN SEGUNDO DOMContentLoaded
  updateCurrentYear();
});