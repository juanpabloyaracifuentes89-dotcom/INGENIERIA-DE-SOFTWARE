// src/routes/api.js
const express = require('express');
const router = express.Router();
const parkingController = require('../controllers/parkingController');

// Rutas de Celdas (Iteración 1 y 2)
router.get('/celdas', parkingController.getCeldas);
router.post('/celdas', parkingController.crearCelda);
router.put('/celdas/:codigo/estado', parkingController.cambiarEstadoCelda);

// Rutas de Clientes y Mensualidades (Iteración 1 y 2)
router.post('/clientes', parkingController.registrarCliente);
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
