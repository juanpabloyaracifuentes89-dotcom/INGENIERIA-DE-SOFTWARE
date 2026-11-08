# Sistema de Información Parqueadero "Autos Colombia"

## Asignatura: Ingeniería de Software
### Evidencia de Aprendizaje 2 (EA2) — Iteración 2: Gestión de Usuarios y Gestión de Celdas

| Campo | Detalle |
|---|---|
| **Estudiante** | Juan Pablo Yara Cifuentes |
| **Grupo** | PREICA2602B020081 |
| **Institución** | Institución Universitaria Digital de Antioquia |
| **Docente** | Esteban Montoya |
| **Fecha de entrega** | Noviembre 8 de 2026 |
| **Programa** | Tecnología en Desarrollo de Software |

---

## ¿De qué trata este proyecto?

Este repositorio contiene el sistema de información del parqueadero **Autos Colombia**, desarrollado de forma evolutiva en iteraciones dentro de la asignatura Ingeniería de Software.

La **Iteración 2** extiende las funcionalidades del sistema incorporando los módulos de **gestión administrativa de clientes/usuarios** y **configuración dinámica de celdas de parqueo**, integrando todo con los flujos operativos de la Iteración 1.

---

## Qué hace el sistema (Iteraciones 1 y 2)

### Iteración 1 — Control de Entrada y Salida de Vehículos
- Mapa visual interactivo del patio con estado en tiempo real (Disponible, Ocupada, Mantenimiento).
- Validación automática de mensualidades vigentes al momento del ingreso.
- Asignación de celda y registro del ticket de entrada.
- Liquidación automática del cobro al registrar la salida (por horas o mensualidad).
- Registro de novedades e incidentes detectados al ingreso del vehículo.

### Iteración 2 — Gestión de Usuarios y Celdas
- **Registro de Clientes:** Guardar, editar y desactivar clientes con validación de cédula única.
- **Vinculación de Vehículos:** Asociar una o varias placas a un cliente titular para contratos de mensualidad.
- **Crear Celdas:** Parametrizar nuevos puestos de parqueo con código único, piso y tipo de vehículo.
- **Mantenimiento de Celdas:** Bloquear preventivamente celdas con daños locativos (fugas, baches, pintura), excluyéndolas del flujo de ingreso automáticamente.
- **Aforo en Tiempo Real:** Tarjetas de control con cupos totales, ocupados, libres y porcentaje de ocupación.

---

## Tecnologías usadas

| Capa | Tecnología |
|---|---|
| Servidor (Backend) | Node.js v20+, Express.js, Morgan, Cors |
| Base de Datos | SQLite nativo (`node:sqlite`) con claves foráneas activas |
| Interfaz (Frontend) | HTML5, CSS3 con variables y Grid, JavaScript ES6 Vanilla |
| Diagramas UML | Draw.io (diagramas.net) con PlantUML |
| Mockups | Prototipado de alta fidelidad sobre el sistema real |

---

## Estructura del proyecto

```
INGENIERIA-DE-SOFTWARE/
├── database/
│   ├── schema.sql          # Creación de tablas e índices
│   └── seed.sql            # Datos iniciales de prueba
├── src/
│   ├── config/
│   │   └── database.js     # Conexión y auto-migración SQLite
│   ├── controllers/
│   │   └── parkingController.js  # Toda la lógica de negocio (Iter. 1 y 2)
│   ├── routes/
│   │   └── api.js          # Rutas de la API REST
│   ├── public/
│   │   ├── index.html      # Interfaz web completa
│   │   ├── css/styles.css  # Estilos del sistema
│   │   └── js/app.js       # Lógica del frontend
│   └── server.js           # Servidor Express principal
├── package.json
└── README.md
```

---

## Cómo ejecutar el proyecto localmente

### Requisitos previos
- Tener instalado **Node.js versión 20 o superior**.

### Pasos

**1. Clonar el repositorio:**
```bash
git clone https://github.com/juanpabloyaracifuentes89-dotcom/INGENIERIA-DE-SOFTWARE.git
```

**2. Entrar a la carpeta del proyecto:**
```bash
cd INGENIERIA-DE-SOFTWARE
```

**3. Instalar dependencias:**
```bash
npm install
```

**4. Iniciar la aplicación:**
```bash
npm start
```

**5. Abrir en el navegador:**
```
http://localhost:3000
```

---

## Datos de prueba incluidos

Al iniciar por primera vez, el sistema carga automáticamente los siguientes datos de prueba:

| Placa | Cliente | Vehículo | Estado |
|---|---|---|---|
| ABC123 | Carlos Gómez | Mazda 3 — Celda A-01 | Mensualidad Vigente |
| XYZ789 | Mariana López | Yamaha MT-03 — Celda M-01 | Mensualidad Vigente |
| DEF321 | Diana Marcela Ospina | Renault Logan | Mensualidad Vigente |
| UVW456 | Juan Ramírez | Toyota Fortuner | Mensualidad Vencida |
| QWE987 | Visitante | Chevrolet Onix | Ocasional |

---

## Endpoints de la API REST

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/celdas` | Consultar todas las celdas y su estado |
| POST | `/api/celdas` | Crear nueva celda (Iter. 2) |
| PUT | `/api/celdas/:codigo/estado` | Cambiar estado de celda a Mantenimiento (Iter. 2) |
| POST | `/api/clientes` | Registrar nuevo cliente con vehículo (Iter. 2) |
| GET | `/api/vehiculos/validar/:placa` | Validar placa y mensualidad vigente |
| POST | `/api/entradas` | Registrar entrada de vehículo |
| POST | `/api/salidas` | Registrar salida y liquidar cobro |
| GET | `/api/mensualidades` | Listar contratos de mensualidad |
| GET | `/api/novedades` | Listar novedades registradas |
| POST | `/api/novedades` | Registrar novedad de un vehículo |
| GET | `/api/stats` | Estadísticas de aforo en tiempo real |
