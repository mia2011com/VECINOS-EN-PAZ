document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("form-reporte");
    const listaReportes = document.getElementById("lista-reportes");

    if (form && listaReportes) {
        form.addEventListener("submit", (e) => {
            e.preventDefault(); 

            const nombre = document.getElementById("nombre").value;
            const categoria = document.getElementById("categoria").value;
            const problema = document.getElementById("problema").value;

           
            const nuevoReporte = document.createElement("div");
            nuevoReporte.classList.add("reporte-item");
            nuevoReporte.innerHTML = `
                <strong>${categoria} · ${nombre}</strong>
                <p style="margin: 8px 0 0 0;">${problema}</p>
            `;
            listaReportes.prepend(nuevoReporte);

           
            form.reset();
        });
    }
});


window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        preloader.style.opacity = '0';
        preloader.style.transition = 'opacity 0.5s ease';
        setTimeout(() => {
            preloader.style.display = 'none';
        }, 500); 
    }
});