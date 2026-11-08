// src/server.js
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const apiRoutes = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir frontend estático
app.use(express.static(path.join(__dirname, 'public')));

// Rutas de API
app.use('/api', apiRoutes);

// Ruta fallback — siempre devuelve el index.html para rutas no-API
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`SISTEMA DE INFORMACION "AUTOS COLOMBIA" - EA2`);
  console.log(`Servidor corriendo exitosamente en el puerto ${PORT}`);
  console.log(`Accede a la interfaz web: http://localhost:${PORT}`);
  console.log(`====================================================`);
});
