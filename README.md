# Sistema de Información Parqueadero "Autos Colombia"
## Asignatura: Ingeniería de Software
### Evidencia de Aprendizaje 1 (EA1) - Iteración 1: Gestión de la Entrada y Salida de Vehículos

- **Estudiante:** Juan Pablo Yara Cifuentes
- **Grupo:** PREICA2602B020081
- **Institución:** Institución Universitaria Digital de Antioquia - IU Digital
- **Materia:** Ingeniería de Software

Este repositorio contiene la solución de software desarrollada para el parqueadero **Autos Colombia**, enfocada en la gestión operativa de entradas, salidas, control de mensualidades, monitoreo de celdas en tiempo real y registro de novedades vehiculares.

---

## Características Principales (Iteración 1)

- **Control de Patio en Tiempo Real:** Visualización gráfica e interactiva de celdas organizadas por tipo de vehículo (Automóviles, Motocicletas, Camionetas) y estado (Disponible, Ocupada, Mantenimiento).
- **Validación Automática de Mensualidades:** Verificación instantánea de contratos vigentes por placa, exonerando cobros en la salida ($0 COP) para clientes mensuales y derivando a cobro por fracción/hora para visitantes ocasionales.
- **Asignación y Liberación Dinámica de Celdas:** Actualización atómica en la base de datos de la celda ocupada y liberación inmediata al registrar la salida.
- **Control Anti-Passback:** Bloqueo de ingresos duplicados para vehículos que ya figuren dentro de las instalaciones.
- **Registro de Novedades e Incidentes:** Módulo de inspección para documentar rayones, golpes o accesorios faltantes preexistentes al ingreso para respaldo legal.
- **Liquidación Automática y Emisión de Tickets:** Cálculo del tiempo transcurrido en minutos/horas y liquidación tarifaria con generación de tickets imprimibles.
- **Arquitectura en Tres Capas:** Separación limpia de presentación (HTML5/CSS3/JS), lógica de negocio (Express.js REST API) y persistencia relacional con transacciones (SQLite / SQL).

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
