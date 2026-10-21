-- ============================================================================
-- PROYECTO: SISTEMA DE INFORMACIÓN PARQUEADERO "AUTOS COLOMBIA"
-- ITERACIÓN 1: GESTIÓN DE ENTRADA Y SALIDA DE VEHÍCULOS
-- DATOS SEMILLA / INICIALES (SEED DATA)
-- ============================================================================

-- 1. TIPOS DE VEHÍCULO
INSERT INTO tipos_vehiculo (id, nombre, tarifa_hora, tarifa_dia, tarifa_mes, icono) VALUES
(1, 'Automóvil', 4500.0, 35000.0, 180000.0, 'car'),
(2, 'Motocicleta', 2500.0, 18000.0, 95000.0, 'motorcycle'),
(3, 'Camioneta / SUV', 6000.0, 45000.0, 220000.0, 'truck');

-- 2. CLIENTES (CONTRATANTES DE MENSUALIDADES)
INSERT INTO clientes (id, documento, nombres, apellidos, telefono, email, estado) VALUES
(1, '1020304050', 'Carlos Andrés', 'Gómez Restrepo', '3104567890', 'carlos.gomez@gmail.com', 'ACTIVO'),
(2, '1098765432', 'Mariana', 'López Salazar', '3159876543', 'mariana.lopez@outlook.com', 'ACTIVO'),
(3, '1037654321', 'Juan Esteban', 'Ramírez Castro', '3001234567', 'juan.ramirez@empresa.com', 'ACTIVO'),
(4, '71234567', 'Diana Marcela', 'Ospina Torres', '3123456789', 'diana.ospina@gmail.com', 'ACTIVO');

-- 3. VEHÍCULOS REGISTRADOS
INSERT INTO vehiculos (placa, id_tipo_vehiculo, marca, modelo, color, id_cliente) VALUES
('ABC123', 1, 'Mazda', '3 Grand Touring', 'Rojo Diamante', 1),
('XYZ789', 2, 'Yamaha', 'MT-03', 'Negro Mate', 2),
('UVW456', 3, 'Toyota', 'Fortuner', 'Blanco Perlado', 3),
('DEF321', 1, 'Renault', 'Logan', 'Gris Estrella', 4),
('QWE987', 1, 'Chevrolet', 'Onix', 'Plata', NULL); -- Visitante ocasional

-- 4. CONTRATOS DE MENSUALIDADES VIGENTES Y VENCIDAS
INSERT INTO mensualidades (id, id_cliente, placa, fecha_inicio, fecha_fin, valor_pagado, estado) VALUES
(1, 1, 'ABC123', '2026-10-01', '2026-10-31', 180000.0, 'VIGENTE'),
(2, 2, 'XYZ789', '2026-10-05', '2026-11-05', 95000.0, 'VIGENTE'),
(3, 3, 'UVW456', '2026-09-01', '2026-09-30', 220000.0, 'VENCIDA'),
(4, 4, 'DEF321', '2026-10-15', '2026-11-15', 180000.0, 'VIGENTE');

-- 5. CELDAS DE ESTACIONAMIENTO (Piso 1 - Autos y Motos)
INSERT INTO celdas (codigo, id_tipo_vehiculo, piso, estado, placa_actual) VALUES
('A-01', 1, 1, 'OCUPADA', 'ABC123'),
('A-02', 1, 1, 'DISPONIBLE', NULL),
('A-03', 1, 1, 'DISPONIBLE', NULL),
('A-04', 1, 1, 'DISPONIBLE', NULL),
('A-05', 1, 1, 'MANTENIMIENTO', NULL),
('A-06', 1, 1, 'DISPONIBLE', NULL),
('A-07', 3, 1, 'DISPONIBLE', NULL),
('A-08', 3, 1, 'DISPONIBLE', NULL),
('M-01', 2, 1, 'OCUPADA', 'XYZ789'),
('M-02', 2, 1, 'DISPONIBLE', NULL),
('M-03', 2, 1, 'DISPONIBLE', NULL),
('M-04', 2, 1, 'DISPONIBLE', NULL);

-- 6. REGISTROS DE ACCESO ACTIVOS (VEHÍCULOS DENTRO DEL PARQUEADERO)
INSERT INTO registros_acceso (id, placa, codigo_celda, fecha_hora_entrada, fecha_hora_salida, tipo_servicio, total_pagar, estado, observaciones_ingreso, operador_entrada) VALUES
(1, 'ABC123', 'A-01', datetime('now', '-2 hours'), NULL, 'MENSUALIDAD', 0.0, 'ACTIVO', 'Ingreso normal de cliente mensual', 'Juan Pérez'),
(2, 'XYZ789', 'M-01', datetime('now', '-45 minutes'), NULL, 'MENSUALIDAD', 0.0, 'ACTIVO', 'Motocicleta con casco en celda', 'Juan Pérez');

-- 7. NOVEDADES REGISTRADAS
INSERT INTO novedades (id, id_registro_acceso, placa, fecha_hora, tipo_novedad, nivel_gravedad, descripcion, ubicacion_en_vehiculo) VALUES
(1, 1, 'ABC123', datetime('now', '-2 hours'), 'RAYÓN', 'LEVE', 'Rayón superficial de 5 cm en puerta trasera derecha preexistente al ingreso', 'Puerta trasera derecha');
