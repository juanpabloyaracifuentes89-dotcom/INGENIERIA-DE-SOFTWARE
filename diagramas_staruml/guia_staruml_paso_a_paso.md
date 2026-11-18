# GUÍA PASO A PASO: REPRODUCCIÓN DE DIAGRAMAS EN STARUML (ITERACIÓN 3)
## Sistema de Información Parqueadero "Autos Colombia"
### Asignatura: Ingeniería de Software — EA3 (Iteración 3: Gestión de Pagos)

Esta guía detalla de manera exacta cómo recrear, diseñar o importar en **StarUML** los tres diagramas UML requeridos en la rúbrica de evaluación:
1. **Diagrama de Casos de Uso de Gestión de Pagos** (10 pts)
2. **Diagrama de Secuencia Integral (Iteraciones 1, 2 y 3)** (15 pts)
3. **Diagrama de Componentes Integral (Iteraciones 1, 2 y 3)** (10 pts)

---

## 1. Diagrama de Casos de Uso de Gestión de Pagos en StarUML

### Pasos en StarUML:
1. Abre **StarUML**.
2. En el panel **Model Explorer** (arriba a la derecha), haz clic derecho sobre `Model` -> **Add Diagram** -> **Use Case Diagram**.
3. Nombra el diagrama: `Casos_de_Uso_Gestion_Pagos`.
4. Arrastra los siguientes **Actors** desde la barra lateral izquierda (**Toolbox**):
   - `Cajero / Operador de Turno`
   - `Administrador de Parqueadero`
   - `Cliente (Propietario / Conductor)`
   - `Pasarela / Terminal Bancario` (con stereotype `<<External System>>`)
5. Arrastra un marco contenedor tipo **Rectangle** o **System Boundary** y nómbralo:  
   `Módulo de Gestión de Pagos y Facturación (Iteración 3)`
6. Dentro del límite, crea los siguientes **Use Case**:
   - `CU13: Registrar Pago de Mensualidad`
   - `CU14: Cobrar Salida Ocasional (Por Tiempo)`
   - `CU15: Seleccionar Medio de Pago (Efectivo, Tarjeta, Transferencia)`
   - `CU16: Calcular Cambio y Vueltas en Efectivo`
   - `CU17: Validar Transacción Bancaria / Voucher`
   - `CU18: Emitir Comprobante de Pago Digital (Recibo POS)`
   - `CU19: Generar Código QR de Verificación`
   - `CU20: Enviar Comprobante por Correo Electrónico`
   - `CU21: Realizar Arqueo y Cuadre de Caja Diario`
   - `CU22: Consultar Historial de Pagos y Transacciones`
   - `CU23: Anular Comprobante de Pago por Inconsistencia`
   - `CU24: Generar Reporte de Recaudo por Período`
7. Establece las relaciones:
   - **Include (`<<include>>`):**
     - De `CU13` hacia `CU15` y hacia `CU18`.
     - De `CU14` hacia `CU15` y hacia `CU18`.
     - De `CU18` hacia `CU19`.
     - De `CU21` hacia `CU22`.
     - De `CU23` hacia `CU22`.
   - **Extend (`<<extend>>`):**
     - De `CU16` hacia `CU15` (Condición: si el método es Efectivo).
     - De `CU17` hacia `CU15` (Condición: si el método es Tarjeta o Transferencia).
     - De `CU20` hacia `CU18` (Condición: a solicitud del usuario).
   - **Generalization (Herencia):**
     - De `Administrador` hacia `Cajero / Operador de Turno`.
   - **Association:**
     - `Cajero` hacia `CU13`, `CU14`, `CU18`, `CU21`, `CU22`.
     - `Admin` hacia `CU21`, `CU22`, `CU23`, `CU24`.
     - `CU17` hacia `Pasarela / Terminal Bancario`.
     - `Cliente` hacia `CU18`.

---

## 2. Diagrama de Secuencia Integral en StarUML (Iteraciones 1, 2 y 3)

### Pasos en StarUML:
1. En el panel **Model Explorer**, haz clic derecho sobre `Model` -> **Add Diagram** -> **Sequence Diagram**.
2. Nombra el diagrama: `Diagrama_Secuencia_Integral_AutosColombia`.
3. Arrastra desde la **Toolbox** los siguientes participantes (**Lifelines** / **Actors**):
   - `Cliente`: Actor
   - `Operador`: Actor
   - `UI (Frontend SPA)`: Lifeline
   - `ParkingController (Express REST)`: Lifeline
   - `Servicio Acceso & Celdas`: Lifeline (Iteración 1 y 2)
   - `Servicio Facturación & Pagos`: Lifeline (Iteración 3)
   - `Base de Datos SQLite`: Lifeline / Database
4. Agrega los mensajes ordenados cronológicamente:
   - **Fase 1 (Ingreso y Celdas):**
     - `Cliente -> Operador`: Solicita ingreso (placa)
     - `Operador -> UI`: Ingresa placa y consulta estado
     - `UI -> ParkingController`: GET `/api/vehiculos/validar/:placa`
     - `ParkingController -> DB`: Valida mensualidad y estado de celdas
     - `Operador -> UI`: Asigna celda disponible (ej. A-01) y novedades
     - `UI -> ParkingController`: POST `/api/entradas`
     - `ParkingController -> Servicio Acceso`: Registrar entrada y bloquear celda
     - `Servicio Acceso -> DB`: INSERT registros_acceso y UPDATE celda 'OCUPADA'
     - `ParkingController --> UI`: 201 Created (Ticket de entrada emitido)
   - **Fase 2 (Gestión Clientes/Celdas - Iteración 2):**
     - `Operador -> UI`: Configurar nueva celda o bloquear por mantenimiento
     - `UI -> ParkingController`: POST `/api/celdas` / PUT `/api/celdas/:codigo/estado`
     - `ParkingController -> DB`: Actualiza catálogo de celdas
   - **Fase 3 y 4 (Salida y Gestión de Pagos - Iteración 3):**
     - `Cliente -> Operador`: Solicita retiro de vehículo
     - `Operador -> UI`: Digita placa para liquidar cobro
     - `UI -> ParkingController`: POST `/api/salidas`
     - `ParkingController -> Servicio Facturación`: Liquidar tiempo y tarifa
     - `Servicio Facturación -> DB`: Libera celda 'DISPONIBLE'
     - `Operador -> UI`: Registra cobro (Efectivo/Tarjeta/Transferencia)
     - `UI -> UI`: Calcula cambio/vueltas en tiempo real
     - `UI -> ParkingController`: POST `/api/pagos` { tipo_pago, monto, metodo_pago, recibido, cambio }
     - `ParkingController -> Servicio Facturación`: Generar consecutivo REC-2026-XXXX
     - `Servicio Facturación -> DB`: INSERT INTO pagos (...) (Transacción ACID)
     - `ParkingController --> UI`: 201 Created con Comprobante Oficial POS y QR
     - `UI --> Operador`: Muestra e imprime Tirilla Térmica
     - `Operador --> Cliente`: Entrega comprobante y vueltos en efectivo
   - **Fase 5 (Arqueo y Cierre Diario de Caja - Iteración 3):**
     - `Operador -> UI`: Clic en "Arqueo y Cierre de Caja"
     - `UI -> ParkingController`: GET `/api/pagos/resumen-caja`
     - `ParkingController -> DB`: SUM(monto) agrupado por método de pago
     - `ParkingController --> UI`: Totales recaudados en el turno

---

## 3. Diagrama de Componentes Integral en StarUML (Iteraciones 1, 2 y 3)

### Pasos en StarUML:
1. En el panel **Model Explorer**, haz clic derecho sobre `Model` -> **Add Diagram** -> **Component Diagram**.
2. Nombra el diagrama: `Diagrama_Componentes_Integral_AutosColombia`.
3. Arrastra los contenedores **Package**:
   - `Capa de Presentación (Frontend Web SPA)`:
     - Componentes: `[Mapa de Patio UI]`, `[Control Acceso/Salidas]`, `[Gestor Clientes/Celdas]`, `[Módulo Caja y Pagos (app.js)]`, `[Generador Comprobantes POS y QR]`.
   - `Capa de Enrutamiento y Servicios API (Node.js & Express)`:
     - Componentes: `[Servidor Express (server.js)]`, `[Enrutador REST (api.js)]`, `[ParkingController]`.
   - `Capa de Lógica de Negocio y Dominio`:
     - Componentes: `[Servicio Celdas y Patio]`, `[Validador Mensualidades]`, `[Calculador Tarifas]`, `[Gestor Transaccional Pagos]`, `[Motor Arqueo de Caja]`.
   - `Capa de Persistencia y Acceso a Datos`:
     - Componentes: `[Conector SQLite Nativo]`, `[Base de Datos parqueadero.db]` (con tablas: celdas, vehiculos, clientes, mensualidades, registros_acceso, novedades, pagos, tipos_vehiculo).
   - `Sistemas Externos`:
     - Componentes: `[Terminal Datáfono / Pasarela]`, `[Impresora Térmica POS]`.
4. Traza las líneas de dependencia (**Dependency** `..>`) y uso de interfaces (**Interface Realization** / **Usage**).

---

## 4. Visualización Inmediata con PlantUML

Los tres diagramas han sido generados en sintaxis estándar PlantUML en la carpeta `diagramas_staruml/`:
- `casos_de_uso_pagos.puml`
- `diagrama_secuencia_completo.puml`
- `diagrama_componentes_completo.puml`

Puedes abrirlos directamente en:
1. **StarUML** mediante la extensión PlantUML (Tools -> PlantUML).
2. El visor oficial en línea de PlantUML: [https://www.plantuml.com/plantuml/uml](https://www.plantuml.com/plantuml/uml)
3. La extensión PlantUML para Visual Studio Code.
