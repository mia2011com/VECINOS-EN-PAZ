document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("form-reporte");
    const listaReportes = document.getElementById("lista-reportes");

    if (form && listaReportes) {
        form.addEventListener("submit", (e) => {
            e.preventDefault(); // Evita que la página se recargue sola

            const nombre = document.getElementById("nombre").value;
            const categoria = document.getElementById("categoria").value;
            const problema = document.getElementById("problema").value;

            // Crear la nueva tarjeta de reporte con diseño limpio
            const nuevoReporte = document.createElement("div");
            nuevoReporte.classList.add("reporte-item");
            nuevoReporte.innerHTML = `
                <strong>${categoria} · ${nombre}</strong>
                <p style="margin: 8px 0 0 0;">${problema}</p>
            `;

            // Agregarlo al inicio de la lista
            listaReportes.prepend(nuevoReporte);

            // Limpiar los campos del formulario
            form.reset();
        });
    }
});