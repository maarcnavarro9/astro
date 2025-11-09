// Actualizar el año dinámicamente en el footer
function updateCurrentYear() {
    const currentYear = new Date().getFullYear();
    const yearElement = document.querySelector('footer p');
    
    if (yearElement) {
        yearElement.innerHTML = yearElement.innerHTML.replace('2024', currentYear);
    }
}

// Ejecutar cuando se cargue la página
document.addEventListener('DOMContentLoaded', function() {
    updateCurrentYear();
});