
const firebaseConfig = {
  apiKey: "AIzaSyAtzaf4c2AluG11qVXpF1idf_TC7y32KDc",
  authDomain: "vecinos-en-paz.firebaseapp.com",
  projectId: "vecinos-en-paz",
  storageBucket: "vecinos-en-paz.firebasestorage.app",
  messagingSenderId: "3037957524",
  appId: "1:3037957524:web:d1731d7d8ad8dc773ed381",
  measurementId: "G-QS5EQS9FZK"
};

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-app.js";
import { getFirestore, collection, addDoc, onSnapshot, query, orderBy, doc, updateDoc } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-firestore.js";
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// --- 1. GUARDAR REPORTE CON ESTADO INICIAL ---
const formReporte = document.getElementById("form-reporte");

if (formReporte) {
    formReporte.addEventListener("submit", async (e) => {
        e.preventDefault();

        const nombre = document.getElementById("nombre").value;
        const categoria = document.getElementById("categoria").value;
        const problema = document.getElementById("problema").value;

        try {
            await addDoc(collection(db, "reportes"), {
                nombre: nombre,
                categoria: categoria,
                problema: problema,
                estado: "Pendiente", // Nuevo campo de estado
                fecha: new Date().toISOString()
            });

            alert("¡Reporte guardado en la nube! 🚀");
            formReporte.reset();
        } catch (error) {
            console.error("Error al guardar:", error);
            alert("Error al guardar en Firebase. Revisa la consola (F12).");
        }
    });
}

// --- 2. LEER REPORTES EN TIEMPO REAL Y PERMITIR CAMBIAR ESTADO ---
const listaReportesDiv = document.getElementById("lista-reportes");

if (listaReportesDiv) {
    // Ordenamos por fecha descendente para que los nuevos salgan arriba
    const q = query(collection(db, "reportes"), orderBy("fecha", "desc"));
    
    onSnapshot(q, (snapshot) => {
        listaReportesDiv.innerHTML = "";

        if (snapshot.empty) {
            listaReportesDiv.innerHTML = `<p style="color: #666;">No hay reportes activos aún.</p>`;
            return;
        }

        snapshot.forEach((documento) => {
            const data = documento.data();
            const idDoc = documento.id;
            const estadoActual = data.estado || "Pendiente";

            // Colores según el estado
            let colorEstado = "#f59e0b"; // Amarillo (Pendiente)
            if (estadoActual === "En proceso") colorEstado = "#3b82f6"; // Azul
            if (estadoActual === "Resuelto") colorEstado = "#10b981"; // Verde

            const reporteItem = document.createElement("div");
            reporteItem.className = "reporte-item";
            reporteItem.style.cssText = "margin-bottom: 15px; padding: 15px; border: 1px solid #e5e7eb; border-radius: 8px; background: #fff;";

            reporteItem.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <strong>${data.categoria} · ${data.nombre}</strong>
                    <span style="background: ${colorEstado}; color: white; padding: 3px 10px; border-radius: 12px; font-size: 12px; font-weight: bold;">
                        ${estadoActual}
                    </span>
                </div>
                <p style="margin: 10px 0;">${data.problema}</p>
                <div style="font-size: 12px;">
                    <label>Cambiar estado: </label>
                    <select class="select-estado" data-id="${idDoc}" style="padding: 3px; border-radius: 4px;">
                        <option value="Pendiente" ${estadoActual === "Pendiente" ? "selected" : ""}>🟡 Pendiente</option>
                        <option value="En proceso" ${estadoActual === "En proceso" ? "selected" : ""}>🔵 En proceso</option>
                        <option value="Resuelto" ${estadoActual === "Resuelto" ? "selected" : ""}>🟢 Resuelto</option>
                    </select>
                </div>
            `;

            listaReportesDiv.appendChild(reporteItem);
        });

        // Escuchar cambios en los selectores de estado
        document.querySelectorAll(".select-estado").forEach((select) => {
            select.addEventListener("change", async (e) => {
                const docId = e.target.getAttribute("data-id");
                const nuevoEstado = e.target.value;
                await updateDoc(doc(db, "reportes", docId), { estado: nuevoEstado });
            });
        });
    }, (error) => {
        console.error("Error leyendo Firestore:", error);
    });
}