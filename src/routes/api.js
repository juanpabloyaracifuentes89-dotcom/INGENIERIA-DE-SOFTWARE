// src/routes/api.js
const express = require('express');
const router = express.Router();
const parkingController = require('../controllers/parkingController');

// Rutas de Celdas
router.get('/celdas', parkingController.getCeldas);

// Rutas de Vehículos y Mensualidades
router.get('/vehiculos/validar/:placa', parkingController.validarVehiculo);
router.get('/mensualidades', parkingController.getMensualidades);

// Rutas de Entradas y Salidas
router.post('/entradas', parkingController.registrarEntrada);
router.post('/salidas', parkingController.registrarSalida);

// Rutas de Novedades
router.get('/novedades', parkingController.getNovedades);
router.post('/novedades', parkingController.registrarNovedad);

// Estadísticas en tiempo real
router.get('/stats', parkingController.getStats);

module.exports = router;
