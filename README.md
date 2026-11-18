# Sistema de Información Parqueadero "Autos Colombia"

## Asignatura: Ingeniería de Software
### Evidencia de Aprendizaje 3 (EA3) — Iteración 3: Gestión de Pagos

| Campo | Detalle |
|---|---|
| **Estudiante** | Juan Pablo Yara Cifuentes |
| **Grupo** | PREICA2602B020081 |
| **Institución** | Institución Universitaria Digital de Antioquia (IU Digital) |
| **Docente** | Esteban Montoya |
| **Fecha de entrega** | Noviembre 17 de 2026 |
| **Programa** | Tecnología en Desarrollo de Software |
| **Repositorio GitHub** | [https://github.com/juanpabloyaracifuentes89-dotcom/INGENIERIA-DE-SOFTWARE.git](https://github.com/juanpabloyaracifuentes89-dotcom/INGENIERIA-DE-SOFTWARE.git) |

---

## ¿De qué trata este proyecto?

Este repositorio contiene la solución completa de software para el parqueadero **Autos Colombia**, desarrollada siguiendo un ciclo de vida evolutivo e incremental en 3 iteraciones dentro de la asignatura Ingeniería de Software:

1. **Iteración 1:** Gestión y control de entrada y salida de vehículos con patio interactivo y novedades.
2. **Iteración 2:** Gestión de usuarios (clientes propietarios) y configuración/mantenimiento de celdas.
3. **Iteración 3:** **Gestión integral de pagos y facturación**, soporte multi-medio de pago (efectivo, tarjetas, transferencias PSE/Nequi), emisión de comprobantes de pago digitales con código QR, cálculo de vueltos, cuadre/arqueo de caja diario y conciliación de transacciones.

---

## Qué hace el sistema (Resumen de las 3 Iteraciones)

### Iteración 1 — Control Operativo de Entradas y Salidas
- Mapa visual interactivo del patio con estado en tiempo real (Disponible, Ocupada, Mantenimiento).
- Validación automática de mensualidades vigentes al momento del ingreso.
- Asignación de celda y registro del ticket de entrada.
- Liquidación automática del cobro al registrar la salida (por horas o mensualidad).
- Registro de novedades e incidentes vehiculares detectados al ingreso (golpes, rayones).

### Iteración 2 — Gestión de Usuarios y Celdas
- **Registro de Clientes:** Guardar, editar y desactivar clientes con validación de documento de identidad único.
- **Vinculación de Vehículos:** Asociar una o varias placas a un cliente titular para contratos de mensualidad.
- **Parametrización de Celdas:** Crear nuevos puestos de estacionamiento con código único, piso y tipo de automotor.
- **Mantenimiento Locativo:** Inhabilitar celdas preventivamente por reparaciones o baches, excluyéndolas del flujo de ingreso automáticamente.
- **Aforo y KPIs en Tiempo Real:** Métricas de cupos totales, ocupados, libres y porcentaje de ocupación.

### Iteración 3 — Gestión de Pagos y Facturación (Nueva)
- **Registro de Pagos Transaccionales:** Cobro de contratos de mensualidad y cobro por estadía ocasional por horas.
- **Soporte Multi-Medio de Pago:** Efectivo con cálculo dinámico de cambio/vueltas en tiempo real, datáfono (tarjetas de crédito y débito) y transferencias bancarias (Nequi, Daviplata, PSE) con código de voucher/aprobación.
- **Emisión de Comprobante Oficial POS:** Generación de recibo de caja digital con consecutivo único (`REC-2026-XXXX`), datos de la empresa (NIT 901.842.103-5), desglose de servicio, IVA/impuestos, cajero responsable y código QR simulado para verificación digital e impresión física.
- **Arqueo y Cierre Diario de Caja:** Reporte en vivo del dinero recaudado en el turno/día, discriminado por medio de pago (Efectivo, Tarjetas, Transferencias) y por concepto de servicio (Mensualidades vs Tiempo Ocasional).
- **Trazabilidad y Seguridad Financiera:** Registro inmutable en base de datos bajo transacciones ACID, previniendo inconsistencias de saldo o duplicidad de recibos.

---

## Tecnologías usadas

| Capa | Tecnología |
|---|---|
| Servidor (Backend) | Node.js v20+, Express.js, Cors, Morgan |
| Base de Datos | SQLite nativo (`node:sqlite`) con claves foráneas activas y transacciones ACID |
| Interfaz (Frontend) | HTML5 Semántico, CSS3 con variables/Grid/Flexbox, JavaScript ES6 Vanilla |
| Diagramas UML | StarUML y PlantUML (Casos de Uso, Secuencia Integral y Componentes) |
| Prototipos / Mockups | Interfaz SPA de alta fidelidad con visor de tirilla POS y modales interactivos |

---

## Estructura del proyecto

```
INGENIERIA-DE-SOFTWARE/
├── database/
│   ├── schema.sql                         # DDL: Creación de tablas e índices (incluye tabla pagos)
│   ├── seed.sql                           # DML: Datos iniciales de prueba e historial de pagos
│   └── parqueadero.db                     # Base de datos SQLite física persistida
├── diagramas_staruml/
│   ├── casos_de_uso_pagos.puml            # Casos de uso de gestión de pagos (Iteración 3)
│   ├── diagrama_secuencia_completo.puml   # Secuencia integral del ciclo de vida (Iteraciones 1, 2 y 3)
│   ├── diagrama_componentes_completo.puml # Componentes integrados del sistema (Iteraciones 1, 2 y 3)
│   ├── guia_staruml_paso_a_paso.md        # Manual para reproducir los diagramas en StarUML
│   ├── arquitectura_sistema.puml          # Arquitectura en capas
│   ├── casos_de_uso.puml                  # Casos de uso generales iniciales
│   ├── diagrama_clases.puml               # Diagrama de clases del dominio
│   ├── diagrama_paquetes.puml             # Diagrama de paquetes modular
│   └── modelo_er.puml                     # Modelo entidad-relación
├── src/
│   ├── config/
│   │   └── database.js                    # Conexión nativa y auto-migración SQLite
│   ├── controllers/
│   │   └── parkingController.js           # Lógica de negocio (Iteraciones 1, 2 y 3: pagos y caja)
│   ├── routes/
│   │   └── api.js                         # Enrutador REST (rutas de celdas, accesos, clientes y pagos)
│   ├── public/
│   │   ├── index.html                     # Interfaz web SPA completa (pestaña de pagos, modales y recibos)
│   │   ├── css/styles.css                 # Estilos profesionales (tarjetas financieras, tirilla POS)
│   │   └── js/app.js                      # Lógica interactiva del cliente (arqueo, pagos, cálculo de vueltos)
│   └── server.js                          # Servidor Express principal
├── package.json
└── README.md
```

---

## Endpoints de la API REST (Actualizados a la Iteración 3)

| Método | Ruta | Descripción | Iteración |
|---|---|---|---|
| GET | `/api/celdas` | Consultar todas las celdas y su estado | 1 y 2 |
| POST | `/api/celdas` | Crear nueva celda de estacionamiento | 2 |
| PUT | `/api/celdas/:codigo/estado` | Inhabilitar/habilitar celda por mantenimiento | 2 |
| POST | `/api/clientes` | Registrar nuevo cliente con vehículo | 2 |
| GET | `/api/vehiculos/validar/:placa` | Validar placa y mensualidad vigente | 1 |
| POST | `/api/entradas` | Registrar entrada de vehículo y asignar celda | 1 |
| POST | `/api/salidas` | Registrar salida, liberar celda y liquidar valor | 1 y 3 |
| GET | `/api/mensualidades` | Listar contratos de mensualidad | 1 y 2 |
| GET | `/api/novedades` | Listar novedades vehiculares | 1 |
| POST | `/api/novedades` | Registrar novedad de un vehículo | 1 |
| **POST** | **`/api/pagos`** | **Registrar cobro de mensualidad o tiempo ocasional** | **3** |
| **GET** | **`/api/pagos`** | **Consultar historial de pagos con filtros** | **3** |
| **GET** | **`/api/pagos/comprobante/:id`** | **Obtener datos del comprobante oficial con QR** | **3** |
| **GET** | **`/api/pagos/resumen-caja`** | **Obtener balance y arqueo diario de caja** | **3** |
| GET | `/api/stats` | Estadísticas de aforo y ocupación en vivo | 1 y 2 |

---

## Cómo ejecutar el proyecto localmente

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/juanpabloyaracifuentes89-dotcom/INGENIERIA-DE-SOFTWARE.git
   ```

2. **Entrar a la carpeta del proyecto:**
   ```bash
   cd INGENIERIA-DE-SOFTWARE
   ```

3. **Instalar dependencias:**
   ```bash
   npm install
   ```

4. **Iniciar la aplicación:**
   ```bash
   npm start
   ```

5. **Abrir en el navegador:**
   ```
   http://localhost:3000
   ```
