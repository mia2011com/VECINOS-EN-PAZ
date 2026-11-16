// Importa Firebase y Firestore desde los CDNs oficiales
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, onSnapshot, query, orderBy } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-firestore.js";

// Tu configuración oficial de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAtzaf4c2AluG11qVXpF1idf_TC7y32KDc",
  authDomain: "vecinos-en-paz.firebaseapp.com",
  projectId: "vecinos-en-paz",
  storageBucket: "vecinos-en-paz.firebasestorage.app",
  messagingSenderId: "3037957524",
  appId: "1:3037957524:web:d1731d7d8ad8dc773ed381",
  measurementId: "G-QS5EQS9FZK"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

console.log
("Firebase inicializado correctamente.");
const formReporte = document.getElementById("form-reporte");

if (formReporte) {
    formReporte.addEventListener("submit", async (e) => {
        e.preventDefault(); // Evita que la página parpadee o se recargue

        
        const nombre = document.getElementById("nombre").value;
        const categoria = document.getElementById("categoria").value;
        const problema = document.getElementById("problema").value;

        try {
           
            await addDoc(collection(db, "reportes"), {
                nombre: nombre,
                categoria: categoria,
                problema: problema,
                fecha: new Date().toISOString()
            });

            console.log("¡Reporte guardado en la nube!");
            alert("¡Reporte publicado con éxito en la comunidad! 🚀");
            
            formReporte.reset(); 
        } catch (error) {
            console.error("Error al guardar el reporte: ", error);
            alert("Hubo un error al enviar el reporte. Revisa la consola.");
        }
    });
}

const listaReportesDiv = document.getElementById("lista-reportes");

if (listaReportesDiv) {
    const q = query(collection(db, "reportes"));
    
    onSnapshot(q, (snapshot) => {

        listaReportesDiv.innerHTML = "";

        if (snapshot.empty) {
            listaReportesDiv.innerHTML = `<p style="color: #666; font-size: 14px;">No hay reportes activos en este momento.</p>`;
            return;
        }

        snapshot.forEach((doc) => {
            const data = doc.data();
            
            const reporteItem = document.createElement("div");
            reporteItem.className = "reporte-item";
            reporteItem.style.marginBottom = "15px";
            reporteItem.style.padding = "10px";
            reporteItem.style.borderBottom = "1px solid #eee";

            reporteItem.innerHTML = `
                <strong>${data.categoria} · ${data.nombre}</strong>
                <p style="margin: 8px 0 0 0;">${data.problema}</p>
            `;

            listaReportesDiv.appendChild(reporteItem);
        });
    });
}