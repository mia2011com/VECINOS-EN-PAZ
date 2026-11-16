window.addEventListener("load", function() {
    const preloader = document.getElementById("preloader");

    // Esperamos un momento opcional para disfrutar la animación y luego desvanecer
    setTimeout(function() {
        // Bajamos la opacidad a 0 (recuerda que en tu CSS puedes ponerle transition: opacity 0.5s ease;)
        preloader.style.opacity = "0";

        // Después de que termine la transición de medio segundo, lo ocultamos por completo
        setTimeout(function() {
            preloader.style.display = "none";
        }, 500);

    }, 1000); // 1 segundo de retraso para que luzca el preloader
});