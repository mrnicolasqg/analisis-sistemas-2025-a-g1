const form = document.getElementById('form-tarea');
const lista = document.getElementById('lista-tareas');
const API_URL = 'http://localhost:3000/tareas';

// Mostrar tareas al cargar
window.addEventListener('DOMContentLoaded', cargarTareas);

// Agregar nueva tarea
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const nuevaTarea = {
    titulo: document.getElementById('titulo').value,
    descripcion: document.getElementById('descripcion').value,
    completada: false,
    fecha_creacion: new Date().toISOString().slice(0, 10),
    fecha_limite: document.getElementById('fecha_limite').value
  };

  await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(nuevaTarea)
  });

  form.reset();
  cargarTareas();
});

// Función para cargar tareas y mostrarlas
async function cargarTareas() {
  lista.innerHTML = '';
  const res = await fetch(API_URL);
  const tareas = await res.json();

  tareas.forEach(tarea => {
    const item = document.createElement('li');
    item.innerHTML = `
      <div>
        <strong>${tarea.titulo}</strong> - ${tarea.descripcion} <br>
        <small>Fecha límite: ${tarea.fecha_limite}</small>
      </div>
      <button onclick="eliminarTarea(${tarea.id})">Eliminar</button>
    `;
    lista.appendChild(item);
  });
}

// Eliminar tarea por ID
async function eliminarTarea(id) {
  await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
  cargarTareas();
}