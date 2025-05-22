const express = require('express');
const fs = require('fs');
const router = express.Router();
const path = require('path');

const dataPath = path.join(__dirname, '../data/tareas.json');

// GET /tareas - listar todas las tareas
router.get('/', (req, res) => {
  fs.readFile(dataPath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'No se pudieron leer las tareas' });
    }
    const tareas = JSON.parse(data);
    res.json(tareas);
  });
});

// POST /tareas - crear nueva tarea
router.post('/', (req, res) => {
  const nuevaTarea = req.body;

  // Validar que venga el cuerpo
  if (!nuevaTarea || Object.keys(nuevaTarea).length === 0) {
    return res.status(400).json({ error: 'No se recibió ninguna tarea' });
  }

  fs.readFile(dataPath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'No se pudo leer el archivo' });
    }

    const tareas = JSON.parse(data);
    nuevaTarea.id = Date.now(); // ID único basado en tiempo
    tareas.push(nuevaTarea);

    fs.writeFile(dataPath, JSON.stringify(tareas, null, 2), (err) => {
      if (err) {
        return res.status(500).json({ error: 'No se pudo guardar la tarea' });
      }
      res.status(201).json(nuevaTarea);
    });
  });
});

// DELETE /tareas/:id - eliminar una tarea por ID
router.delete('/:id', (req, res) => {
  const id = parseInt(req.params.id);

  fs.readFile(dataPath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'No se pudo leer el archivo' });
    }

    let tareas = JSON.parse(data);
    const tareaExistente = tareas.find(t => t.id === id);

    if (!tareaExistente) {
      return res.status(404).json({ error: 'Tarea no encontrada' });
    }

    tareas = tareas.filter(t => t.id !== id);

    fs.writeFile(dataPath, JSON.stringify(tareas, null, 2), (err) => {
      if (err) {
        return res.status(500).json({ error: 'No se pudo eliminar la tarea' });
      }
      res.status(200).json({ mensaje: 'Tarea eliminada correctamente' });
    });
  });
});

module.exports = router;

