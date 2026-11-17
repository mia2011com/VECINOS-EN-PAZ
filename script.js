import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyAtzaf4c2AluG11qVXpF1idf_TC7y32KDc",
  authDomain: "vecinos-en-paz.firebaseapp.com",
  projectId: "vecinos-en-paz",
  storageBucket: "vecinos-en-paz.firebasestorage.app",
  messagingSenderId: "3037957524",
  appId: "1:3037957524:web:d1731d7d8ad8dc773ed381",
  measurementId: "G-QS5EQS9FZK"
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);


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

            alert("¡Reporte guardado exitosamente!");
            formReporte.reset();
        } catch (error) {
            console.error("Error al guardar:", error);
            alert("Error al guardar en Firebase. Revisa la consola (F12).");
        }
    });
}


const listaReportesDiv = document.getElementById("lista-reportes");

if (listaReportesDiv) {

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


let indiceActual = 0;
let totalSlides = 0;

async function cargarComunicados() {
  const track = document.getElementById("carruselTrack");
  if (!track) return; 

  try {
    const querySnapshot = await getDocs(collection(db, "comunicados"));
    
    if (querySnapshot.empty) {
      track.innerHTML = `<div class="carrusel-cargando">No hay comunicados publicados aún.</div>`;
      return;
    }

    track.innerHTML = ""; 
    totalSlides = querySnapshot.size;

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      
      const imagen = data.imagenUrl || "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=900&q=80";
      
      track.innerHTML += `
        <div class="carrusel-slide">
          <img src="${imagen}" alt="${data.titulo || 'Comunicado'}">
          <div class="slide-info">
            <span class="slide-badge">${data.categoria || 'Administración'}</span>
            <h3>${data.titulo || 'Aviso Comunitario'}</h3>
            <p>${data.descripcion || ''}</p>
          </div>
        </div>
      `;
    });

    configurarBotonesCarrusel();
  } catch (error) {
    console.error("Error cargando comunicados:", error);
    track.innerHTML = `<div class="carrusel-cargando">Error al cargar los comunicados.</div>`;
  }
}

function configurarBotonesCarrusel() {
  const track = document.getElementById("carruselTrack");
  const btnPrev = document.getElementById("btnPrev");
  const btnNext = document.getElementById("btnNext");

  function actualizarPosicion() {
    track.style.transform = `translateX(-${indiceActual * 100}%)`;
  }

  btnNext.addEventListener("click", () => {
    indiceActual = (indiceActual + 1) % totalSlides;
    actualizarPosicion();
  });

  btnPrev.addEventListener("click", () => {
    indiceActual = (indiceActual - 1 + totalSlides) % totalSlides;
    actualizarPosicion();
  });
}


cargarComunicados();

const btnAuth = document.getElementById("btnAuth");
const modalAuth = document.getElementById("modalAuth");
const cerrarModalAuth = document.getElementById("cerrarModalAuth");
const formLogin = document.getElementById("formLogin");
const mensajeAuth = document.getElementById("mensajeAuth");

btnAuth.addEventListener("click", () => {
  if (auth.currentUser) {
    signOut(auth);
  } else {
    modalAuth.style.display = "flex";
  }
});

// Cerrar modal con la X
cerrarModalAuth.addEventListener("click", () => {
  modalAuth.style.display = "none";
  mensajeAuth.textContent = "";
});


formLogin.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  try {
    await signInWithEmailAndPassword(auth, email, password);
    modalAuth.style.display = "none";
    formLogin.reset();
    mensajeAuth.textContent = "";
  } catch (error) {
    mensajeAuth.textContent = "Correo o contraseña incorrectos.";
  }
});


onAuthStateChanged(auth, (user) => {
  if (user) {
    btnAuth.textContent = "Cerrar Sesión";
  } else {
    btnAuth.textContent = "Iniciar Sesión";
  }
});


const tarjetas = document.querySelectorAll('.about-card');


const vigilante = new IntersectionObserver((entradas) => {
  entradas.forEach((entrada) => {
  
    if (entrada.isIntersecting) {
      entrada.target.classList.add('visible'); 
      vigilante.unobserve(entrada.target); 
    }
  });
}, {
  threshold: 0.15 
});


tarjetas.forEach((tarjeta) => {
  vigilante.observe(tarjeta);
});