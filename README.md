# Sistema de Información Parqueadero "Autos Colombia"
## Asignatura: Ingeniería de Software
### Evidencia de Aprendizaje 2 (EA2) - Iteración 2: Gestión de Usuarios y Gestión de Celdas

- **Estudiante:** Juan Pablo Yara Cifuentes
- **Grupo:** PREICA2602B020081
- **Institución:** Institución Universitaria Digital de Antioquia - IU Digital
- **Materia:** Ingeniería de Software

Este repositorio contiene la evolución del software desarrollado para el parqueadero **Autos Colombia**, integrando los módulos de la **Iteración 1** (control de entradas, salidas, celdas y novedades) y de la **Iteración 2** (gestión de usuarios/clientes y administración de celdas).

---

## Características Principales (Iteraciones 1 y 2)

### Iteración 1: Gestión de Entrada y Salida de Vehículos
- Control de patio en tiempo real con visualización gráfica de celdas.
- Validación automática de mensualidades y control anti-passback.
- Asignación asistida y liberación de celdas de parqueo.
- Registro de novedades e incidentes preexistentes al ingreso.
- Liquidación automática y generación de tickets imprimibles.

### Iteración 2: Gestión de Usuarios y Gestión de Celdas
- **CRUD de Clientes y Usuarios:** Módulo administrativo para registrar clientes capturando documento, nombres, teléfono y correo electrónico con validación de unicidad.
- **Vinculación Vehicular:** Asociación de uno o más automotores (placas) a un cliente titular con emisión de mensualidades.
- **Configuración de Celdas:** Parametrización de nuevas celdas indicando código identificador único, piso de ubicación y categoría vehicular permitida.
- **Gestión de Estados de Celda (Mantenimiento):** Bloqueo preventivo de celdas inhabilitadas por averías locativas, excluyéndolas automáticamente del flujo de ingreso de vehículos.
- **Control de Aforo Dinámico:** Cálculo reactivo de capacidad total, cupos ocupados y porcentaje de ocupación en patio.

---

## Tecnologías Empleadas

- **Backend:** Node.js (v20+ / v24+), Express.js, Cors, Morgan.
- **Base de Datos:** SQLite embebido nativo (`node:sqlite`) con soporte de claves foráneas, restricciones de integridad referencial y scripts DDL estándar.
- **Frontend:** HTML5 semántico, CSS3 moderno con variables y Flexbox/CSS Grid, JavaScript ES6 (Fetch API, manipulación del DOM asíncrona).
- **Modelado:** Draw.io (diagramas.net), UML (Casos de Uso, Clases, Paquetes, Arquitectura), Figma (Mockups).

---

## Estructura del Repositorio

```text
├── database/
│   ├── schema.sql                    # Script DDL de creación de tablas, restricciones e índices
│   └── seed.sql                      # Datos iniciales para pruebas (celdas, clientes, mensualidades)
├── diagramas_staruml/
│   ├── arquitectura_sistema.puml      # Diagrama de Arquitectura en Tres Capas
│   ├── casos_de_uso.puml              # Diagrama de Casos de Uso UML
│   ├── diagrama_clases.puml           # Diagrama de Clases del Dominio
│   ├── diagrama_paquetes.puml         # Diagrama de Paquetes Modular
│   └── modelo_er.puml                 # Modelo Entidad-Relación y Relacional
├── src/
│   ├── config/
│   │   └── database.js               # Conexión y auto-migración SQLite
│   ├── controllers/
│   │   └── parkingController.js      # Controlador de entradas, salidas, celdas y liquidación
│   ├── routes/
│   │   └── api.js                    # Enrutador de la API REST
│   ├── public/
│   │   ├── index.html                # Interfaz web del operador
│   │   ├── css/styles.css            # Estilos corporativos de Autos Colombia
│   │   └── js/app.js                 # Lógica cliente y consumo de endpoints
│   └── server.js                     # Servidor HTTP Express principal
├── .gitignore
├── package.json
└── README.md
```

---

## Instrucciones de Instalación y Ejecución Local

### 1. Prerrequisitos
Tener instalado Node.js (versión 20 o superior).

### 2. Clonar o descargar el repositorio
```bash
```

### 3. Instalar dependencias
```bash
npm install
```

### 4. Iniciar la aplicación
```bash
npm start
```

### 5. Acceder a la interfaz web
Abrir el navegador web en: **http://localhost:3000**

---

## Datos de Prueba Incluidos

El sistema inicializa automáticamente una base de datos con los siguientes registros de prueba para validar los flujos operativos:

- **Celdas:** 12 celdas configuradas (A-01 a A-08 para Automóviles y Camionetas; M-01 a M-04 para Motocicletas).
- **Clientes con Mensualidad Vigente:**
  - Placa `ABC123`: Carlos Gómez (Mazda 3 - Celda A-01).
  - Placa `XYZ789`: Mariana López (Yamaha MT-03 - Celda M-01).
  - Placa `DEF321`: Diana Marcela Ospina (Renault Logan).
- **Cliente con Mensualidad Vencida:**
  - Placa `UVW456`: Juan Ramírez (Toyota Fortuner).
- **Visitante Ocasional:**
  - Placa `QWE987`: Chevrolet Onix.
