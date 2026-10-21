-- ============================================================================
-- PROYECTO: SISTEMA DE INFORMACIÓN PARQUEADERO "AUTOS COLOMBIA"
-- ITERACIÓN 1: GESTIÓN DE ENTRADA Y SALIDA DE VEHÍCULOS
-- MODELO FÍSICO DE BASE DE DATOS (DDL - SQL ESTÁNDAR / SQLITE / POSTGRESQL)
-- ============================================================================

PRAGMA foreign_keys = ON;

-- 1. TABLA: TIPOS DE VEHÍCULO
CREATE TABLE IF NOT EXISTS tipos_vehiculo (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre VARCHAR(50) NOT NULL UNIQUE,       -- 'Automóvil', 'Motocicleta', 'Camioneta'
    tarifa_hora REAL NOT NULL DEFAULT 0.0,
    tarifa_dia REAL NOT NULL DEFAULT 0.0,
    tarifa_mes REAL NOT NULL DEFAULT 0.0,
    icono VARCHAR(30) DEFAULT 'car'
);

-- 2. TABLA: CLIENTES (PROPIETARIOS / MENSUALIDADES)
CREATE TABLE IF NOT EXISTS clientes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    documento VARCHAR(20) NOT NULL UNIQUE,
    nombres VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    telefono VARCHAR(20) NOT NULL,
    email VARCHAR(120),
    estado VARCHAR(20) NOT NULL DEFAULT 'ACTIVO', -- 'ACTIVO', 'INACTIVO'
    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 3. TABLA: VEHÍCULOS
CREATE TABLE IF NOT EXISTS vehiculos (
    placa VARCHAR(10) PRIMARY KEY,
    id_tipo_vehiculo INTEGER NOT NULL,
    marca VARCHAR(50),
    modelo VARCHAR(50),
    color VARCHAR(30),
    id_cliente INTEGER, -- Puede ser NULL si es un vehículo visitante ocasional
    FOREIGN KEY (id_tipo_vehiculo) REFERENCES tipos_vehiculo(id) ON UPDATE CASCADE,
    FOREIGN KEY (id_cliente) REFERENCES clientes(id) ON UPDATE CASCADE ON DELETE SET NULL
);

-- 4. TABLA: CONTRATOS DE MENSUALIDAD
CREATE TABLE IF NOT EXISTS mensualidades (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    id_cliente INTEGER NOT NULL,
    placa VARCHAR(10) NOT NULL,
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE NOT NULL,
    valor_pagado REAL NOT NULL,
    estado VARCHAR(20) NOT NULL DEFAULT 'VIGENTE', -- 'VIGENTE', 'VENCIDA', 'CANCELADA'
    fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_cliente) REFERENCES clientes(id) ON UPDATE CASCADE,
    FOREIGN KEY (placa) REFERENCES vehiculos(placa) ON UPDATE CASCADE
);

-- 5. TABLA: CELDAS DE ESTACIONAMIENTO
CREATE TABLE IF NOT EXISTS celdas (
    codigo VARCHAR(10) PRIMARY KEY,               -- Ej: 'A-01', 'M-01'
    id_tipo_vehiculo INTEGER NOT NULL,
    piso INTEGER NOT NULL DEFAULT 1,
    estado VARCHAR(20) NOT NULL DEFAULT 'DISPONIBLE', -- 'DISPONIBLE', 'OCUPADA', 'MANTENIMIENTO'
    placa_actual VARCHAR(10),
    FOREIGN KEY (id_tipo_vehiculo) REFERENCES tipos_vehiculo(id) ON UPDATE CASCADE,
    FOREIGN KEY (placa_actual) REFERENCES vehiculos(placa) ON UPDATE CASCADE ON DELETE SET NULL
);

-- 6. TABLA: REGISTROS DE ACCESO (ENTRADAS Y SALIDAS)
CREATE TABLE IF NOT EXISTS registros_acceso (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    placa VARCHAR(10) NOT NULL,
    codigo_celda VARCHAR(10) NOT NULL,
    fecha_hora_entrada DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_hora_salida DATETIME,
    tipo_servicio VARCHAR(20) NOT NULL DEFAULT 'MENSUALIDAD', -- 'MENSUALIDAD', 'OCASIONAL'
    minutos_transcurridos INTEGER DEFAULT 0,
    total_pagar REAL DEFAULT 0.0,
    estado VARCHAR(20) NOT NULL DEFAULT 'ACTIVO', -- 'ACTIVO', 'FINALIZADO'
    observaciones_ingreso TEXT,
    operador_entrada VARCHAR(50) DEFAULT 'Operador Patio',
    operador_salida VARCHAR(50),
    FOREIGN KEY (placa) REFERENCES vehiculos(placa) ON UPDATE CASCADE,
    FOREIGN KEY (codigo_celda) REFERENCES celdas(codigo) ON UPDATE CASCADE
);

-- 7. TABLA: NOVEDADES DEL VEHÍCULO AL INGRESAR O SALIR
CREATE TABLE IF NOT EXISTS novedades (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    id_registro_acceso INTEGER NOT NULL,
    placa VARCHAR(10) NOT NULL,
    fecha_hora DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    tipo_novedad VARCHAR(30) NOT NULL, -- 'GOLPE', 'RAYÓN', 'ROTURA_VIDRIO', 'ACCESORIO_FALTANTE', 'OTRO'
    nivel_gravedad VARCHAR(20) NOT NULL DEFAULT 'LEVE', -- 'LEVE', 'MODERADA', 'GRAVE'
    descripcion TEXT NOT NULL,
    ubicacion_en_vehiculo VARCHAR(50), -- 'Frontal', 'Puerta izquierda', 'Techo', etc.
    FOREIGN KEY (id_registro_acceso) REFERENCES registros_acceso(id) ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY (placa) REFERENCES vehiculos(placa) ON UPDATE CASCADE
);

-- ÍNDICES PARA OPTIMIZAR BÚSQUEDAS EN TIEMPO REAL
CREATE INDEX IF NOT EXISTS idx_registros_placa ON registros_acceso(placa);
CREATE INDEX IF NOT EXISTS idx_registros_estado ON registros_acceso(estado);
CREATE INDEX IF NOT EXISTS idx_celdas_estado ON celdas(estado);
CREATE INDEX IF NOT EXISTS idx_mensualidades_placa ON mensualidades(placa, estado);
