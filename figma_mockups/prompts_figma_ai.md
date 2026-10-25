# PROMPTS MAESTROS PARA ASISTENTE DE IA EN FIGMA
## Sistema de Información Parqueadero "Autos Colombia" — Iteración 1

Esta guía contiene la colección completa de prompts listos para copiar y pegar en herramientas de Inteligencia Artificial para diseño de interfaces en **Figma** (como **Figma AI / First Draft**, **Musho AI**, **Wireframe Designer**, **Relume**, **Galileo AI** o **Uizard**).

Están organizados por pantalla y disponibles tanto en **Español** como en **Inglés** (recomendado para mejores resultados en motores de IA internacionales).

---

## 🎨 Token Contextual Base (Prompt de Estilo y Sistema de Diseño)
> **Recomendación:** Antes de generar pantallas individuales, o si el plugin tiene un campo de "Style / Context / Theme", pega este bloque inicial:

### En Español:
```text
Crea un sistema de diseño para una aplicación web de escritorio de gestión de parqueaderos llamada 'Autos Colombia' con resolución 1440x900 px. 
Estilo visual: Moderno, limpio, altamente intuitivo, profesional de grado empresarial.
Paleta de colores:
- Primario: Azul marino institucional (#1E3A8A)
- Primario claro: Azul de acción (#3B82F6)
- Éxito / Disponible: Verde esmeralda (#10B981) con fondo (#ECFDF5)
- Peligro / Ocupado: Rojo carmesí (#EF4444) con fondo (#FEF2F2)
- Advertencia / Mantenimiento: Ámbar (#F59E0B) con fondo (#FFFBEB)
- Fondo de interfaz: Gris neutro (#F1F5F9), tarjetas en blanco (#FFFFFF) con sombras suaves.
- Placas vehiculares: Estilo placa de Colombia, amarillo (#FEF08A) con borde (#CA8A04) y texto negro monoespaciado.
Tipografía: Inter o Segoe UI, jerarquía clara y alta legibilidad para operadores en patio.
```

### In English:
```text
Design system for a desktop web dashboard (1440x900 px) for a commercial parking management system called 'Autos Colombia'.
Visual style: Clean, enterprise SaaS, modern UI with high contrast for parking booth operators.
Color palette:
- Primary Brand: Deep Navy Blue (#1E3A8A)
- Action Accent: Bright Blue (#3B82F6)
- Success / Available: Emerald Green (#10B981) with light background (#ECFDF5)
- Danger / Occupied: Crimson Red (#EF4444) with light background (#FEF2F2)
- Warning / Maintenance: Amber (#F59E0B) with light background (#FFFBEB)
- Surface background: Cool gray (#F1F5F9), clean white cards (#FFFFFF) with subtle drop shadows.
- Vehicle plates: Colombian license plate style with yellow badge (#FEF08A), amber border (#CA8A04), bold monospace text.
Typography: Inter, clear hierarchy, optimized for quick operational data scanning.
```

---

## 📱 Prompt 1: Pantalla Principal / Dashboard de Monitoreo de Celdas (HU-02, HU-04, HU-06)

### En Español (Copiar y pegar en Figma AI):
```text
Diseña la pantalla principal (Dashboard) para una aplicación web de escritorio (1440x900) del parqueadero 'Autos Colombia'.
Componentes requeridos:
1. Barra superior (Navbar):
   - Logo a la izquierda con icono de parqueadero y texto 'AUTOS COLOMBIA - Control de Patio'.
   - Reloj digital en vivo con icono de hora (ej: 06:30 PM).
   - Badge con nombre de operador en turno 'Operador: Juan Pérez'.
   - Indicador verde de estado del sistema: 'En línea (Local)'.

2. Fila de tarjetas de estadísticas (KPI Cards):
   - 5 tarjetas horizontales con iconos y cifras grandes:
     a) Celdas Totales: 12 (Icono de cuadrícula)
     b) Celdas Disponibles: 9 (Icono verde de check)
     c) Vehículos en Patio / Ocupadas: 2 (Icono rojo de carro)
     d) Mensualidades Activas: 2 (Icono azul de credencial)
     e) Novedades Registradas: 1 (Icono amarillo de advertencia)

3. Barra de acciones rápidas y búsqueda:
   - Botón primario azul grande: '+ Registrar Entrada de Vehículo'
   - Botón rojo de acción: '- Registrar Salida de Vehículo'
   - Botón amarillo: '⚠️ Reportar Novedad'
   - Campo de búsqueda a la derecha con lupa: 'Buscar vehículo por placa o celda...'

4. Navegación por pestañas:
   - Pestaña activa: 'Mapa de Celdas de Patio'
   - Pestaña: 'Vehículos en Patio (2)'
   - Pestaña: 'Clientes Mensuales'
   - Pestaña: 'Historial de Novedades'

5. Cuadrícula de Celdas de Estacionamiento (Parking Grid):
   - Matriz visual de 12 tarjetas tipo celda de parqueo (3 filas x 4 columnas).
   - Cada celda muestra: Código superior (ej: A-01, A-02... M-01 para motos), badge de tipo ('Automóvil' o 'Motocicleta'), piso ('Piso 1').
   - Estados visuales:
     * Celdas Disponibles (Verde #10B981): Icono de auto/moto en verde, texto grande 'LIBRE', tarifa por hora ($4.500/h).
     * Celdas Ocupadas (Rojo #EF4444): Icono de auto en rojo, badge amarillo de placa destacada (ej: 'ABC123'), etiqueta de servicio 'MENSUALIDAD' o 'OCASIONAL', y hora de entrada.
     * Celdas en Mantenimiento (Amarillo #F59E0B): Icono de cono/herramienta, texto 'Mantenimiento'.
```

### In English (Copy & paste for Figma AI / Musho / Galileo):
```text
Generate a full desktop dashboard screen (1440x900) for a parking management web app called 'Autos Colombia'.
Required UI sections:
1. Top Navigation Bar:
   - Brand logo on the left with parking 'P' icon, title 'AUTOS COLOMBIA' and subtitle 'Parking Yard Control'.
   - Digital real-time clock widget (e.g. 06:30:00 PM).
   - Operator badge 'Operator: Juan Perez' with user avatar icon.
   - Status badge with glowing green dot 'System Online'.

2. Top KPI Metrics Row:
   - 5 KPI summary cards:
     1) Total Parking Spots: 12
     2) Available Spots: 9 (highlighted in emerald green)
     3) Occupied Spots: 2 (highlighted in crimson red)
     4) Active Monthly Subscriptions: 2 (blue badge)
     5) Reported Vehicle Incidents: 1 (amber alert badge)

3. Quick Action Toolbar:
   - Primary blue button: '+ Register Vehicle Entry'
   - Danger red button: '- Register Vehicle Exit'
   - Warning button: '⚠️ Report Vehicle Damage'
   - Search input on the right with search icon: 'Search by license plate or cell code...'

4. Tab Navigation Bar:
   - Tabs: 'Live Yard Map' (Active), 'Parked Vehicles (2)', 'Monthly Clients', 'Incident History Log'.

5. Parking Bay Grid (Main Content Area):
   - Grid layout of 12 parking bay cards (A-01 to A-08 for Cars, M-01 to M-04 for Bikes).
   - Each card contains spot code, vehicle type tag, and current state:
     - Available bay: Light green card with green border, car icon, bold 'AVAILABLE' text, hourly rate.
     - Occupied bay: Light red card with red border, car icon, prominent Colombian yellow license plate badge (e.g. 'ABC123'), tag 'MONTHLY PASS' or 'VISITOR', and entry timestamp.
     - Maintenance bay: Light yellow card with warning stripe and 'OUT OF SERVICE' label.
```

---

## 📱 Prompt 2: Modal de Registro de Entrada con Validación de Mensualidad y Daños (HU-01, HU-02, HU-03)

### En Español (Copiar y pegar en Figma AI):
```text
Diseña una ventana modal superpuesta (Modal Dialog de 620 px de ancho) sobre un fondo oscurecido para 'Registrar Entrada de Vehículo' en la app Autos Colombia.
Estructura del modal:
1. Encabezado del modal:
   - Fondo azul institucional (#1E3A8A) con texto blanco.
   - Título: Icono de entrada + 'Registrar Entrada de Vehículo'.
   - Botón de cerrar 'X' a la derecha.

2. Cuerpo del modal:
   - Fila 1:
     * Campo 'Placa del Vehículo' con botón 'Verificar' integrado a la derecha (ej: ABC123).
     * Selector desplegable 'Tipo de Vehículo' (Automóvil $4.500/h, Motocicleta $2.500/h, Camioneta $6.000/h).
   
   - Banner de validación automática (Resaltado en verde #ECFDF5 con borde #10B981):
     * Icono de verificación verde + Título 'CLIENTE MENSUAL VIGENTE'.
     * Texto: 'Propietario: Carlos Andrés Gómez Restrepo | Mensualidad activa hasta: 31/10/2026 | Tarifa de salida: $0 COP'.

   - Fila 2:
     * Selector 'Asignar Celda Disponible' con opciones como 'Celda A-02 (Piso 1 - Libre)'.
     * Campo de solo lectura 'Operador de Turno': 'Juan Pérez (Patio)'.

   - Fila 3:
     * Campo opcional 'Marca' (ej: Mazda).
     * Campo opcional 'Color' (ej: Rojo Diamante).

   - Sección colapsable de inspección de daños (Fondo gris claro con borde punteado):
     * Checkbox marcado: '¿El vehículo presenta golpes, rayones o novedades al ingresar?'
     * Selector: 'Tipo de Novedad' (Rayón superficial, Golpe, Vidrio roto, Accesorio faltante).
     * Selector: 'Nivel de Gravedad' (Leve, Moderada, Grave).
     * Campo 'Ubicación': 'Puerta trasera derecha'.
     * Área de texto: 'Descripción detallada de la novedad preexistente al ingreso para respaldo legal'.

3. Pie del modal (Footer):
   - Botón secundario gris 'Cancelar'.
   - Botón primario azul con icono de check: 'Confirmar Entrada e Imprimir Ticket'.
```

### In English (Copy & paste for Figma AI / Musho / Galileo):
```text
Design a clean, high-fidelity modal dialog (620px width) centered on a dimmed backdrop for 'Register Vehicle Entry' in Autos Colombia parking app.
Modal layout:
1. Header:
   - Solid navy blue bar (#1E3A8A), white text: Car entry icon + 'Register Vehicle Entry'. Close 'X' button.

2. Form Body:
   - Row 1:
     * License Plate input field with an inline 'Verify' action button (value: 'ABC123').
     * Vehicle Type dropdown ('Car - $4,500/hr', 'Motorcycle - $2,500/hr', 'SUV - $6,000/hr').
   
   - Real-time Verification Alert Box (Green background #ECFDF5, green border #10B981):
     * Green checkmark icon + 'ACTIVE MONTHLY SUBSCRIPTION VERIFIED'.
     * Customer: Carlos Gomez | Valid until: Oct 31, 2026 | Exit Fee: $0 COP.

   - Row 2:
     * 'Assign Parking Bay' dropdown showing available bays: 'Bay A-02 (Floor 1 - Free)'.
     * 'Booth Operator' readonly field: 'Juan Perez'.

   - Row 3:
     * Input 'Vehicle Brand' (Mazda).
     * Input 'Color' (Ruby Red).

   - Damage Inspection Accordion Box (Light gray container with dashed border):
     * Checked box: 'Does the vehicle have scratches, dents, or pre-existing damages?'
     * Dropdowns: 'Incident Type' (Scratch) & 'Severity Level' (Minor).
     * Input 'Damage Location': 'Right rear door'.
     * Textarea 'Description': '5cm superficial scratch on rear right door upon entry'.

3. Footer:
   - Secondary button 'Cancel'.
   - Primary blue button with check icon: 'Confirm Entry & Print Ticket'.
```

---

## 📱 Prompt 3: Modal de Registro de Salida y Liquidación de Tarifas (HU-05)

### En Español (Copiar y pegar en Figma AI):
```text
Diseña una ventana modal de liquidación y cobro (Modal Dialog de 560 px de ancho) para 'Registrar Salida de Vehículo' en Autos Colombia.
Estructura requerida:
1. Encabezado del modal:
   - Barra superior en color rojo carmesí (#B91C1C) con texto blanco.
   - Icono de salida + 'Registrar Salida de Vehículo'.

2. Cuerpo del formulario:
   - Selector desplegable: 'Seleccione el Vehículo a dar salida' (mostrando placa, celda y hora de entrada, ej: 'ABC123 | Celda A-01 | Automóvil - Entrada: 04:30 PM').

3. Tarjeta de resumen de liquidación (Receipt Card con borde punteado):
   - Fila: 'Placa del Vehículo:' valor en negrita 'ABC123'.
   - Fila: 'Celda que quedará liberada:' 'A-01 (Piso 1)'.
   - Fila: 'Modalidad de Servicio:' badge azul 'MENSUALIDAD VIGENTE'.
   - Fila: 'Hora de Entrada:' '04:30:15 PM' | 'Hora de Salida:' '06:30:00 PM'.
   - Fila: 'Tiempo Transcurrido:' '120 minutos (2 horas)'.
   - Separador con línea divisoria.
   - Fila de Total Destacado (Texto grande en azul marino 24px negrita):
     'TOTAL A COBRAR: $0 COP'
   - Subtexto explicativo: 'Servicio 100% amparado por contrato de mensualidad activa de Carlos Gómez'.

4. Pie del modal (Footer):
   - Botón secundario 'Cerrar'.
   - Botón rojo de peligro con doble check: 'Confirmar Salida y Liberar Celda'.
```

### In English (Copy & paste for Figma AI / Musho / Galileo):
```text
Design a fee settlement and checkout modal dialog (560px width) for 'Register Vehicle Exit' in Autos Colombia app.
Components:
1. Header:
   - Crimson red header bar (#B91C1C), white bold title: Exit car icon + 'Register Vehicle Exit'. Close icon.

2. Form Selection:
   - Dropdown 'Select Parked Vehicle to Exit' (e.g. 'ABC123 | Bay A-01 | Car - In: 04:30 PM').

3. Billing Settlement Card (Clean card with receipt aesthetics and dashed border):
   - Plate: 'ABC123' (highlighted in yellow license plate badge).
   - Bay to Release: 'A-01 (Floor 1)'.
   - Service Plan: Blue badge 'ACTIVE MONTHLY CONTRACT'.
   - Entry Timestamp: '04:30:15 PM' vs Exit Timestamp: '06:30:00 PM'.
   - Total Stay Duration: '120 minutes (2 hours billed)'.
   - Divider line.
   - Huge Total Due Row (24px bold text):
     'TOTAL TO PAY: $0 COP'
   - Explanatory note: '100% covered by active monthly pass registered to Carlos Gomez'.

4. Modal Actions:
   - Secondary button 'Close'.
   - Crimson red action button: 'Confirm Exit & Release Parking Bay'.
```

---

## 📱 Prompt 4: Comprobante Físico / Ticket de Entrada y Salida (HU-06)

### En Español (Copiar y pegar en Figma AI):
```text
Diseña una tarjeta de recibo / ticket térmico impreso (Thermal Receipt Card de 380 px de ancho) sobre fondo gris con sombra suave.
Estilo visual: Tipografía monoespaciada (estilo Courier New), líneas punteadas divisorias, estética de recibo físico oficial.
Contenido:
- Encabezado centrado:
  * 'PARQUEADERO AUTOS COLOMBIA' (Negrita grande)
  * 'NIT: 900.584.214-1 • Régimen Común'
  * 'Calle 50 # 45-20, Medellín, Colombia'
  * 'TICKET DE ENTRADA #0012' (Borde rectangular simple)
- Línea punteada divisoria.
- Datos del servicio en formato clave-valor alineados a los extremos:
  * FECHA / HORA: 21/10/2026 06:30 PM
  * PLACA: ABC-123 (en recuadro destacado)
  * CELDA ASIGNADA: A-01 (Piso 1)
  * TIPO VEHÍCULO: Automóvil
  * MODALIDAD: MENSUALIDAD
  * OPERADOR EN TURNO: Juan Pérez
- Línea punteada divisoria.
- Sección de novedades al ingreso:
  * 'NOVEDADES DETECTADAS AL INGRESO:'
  * '- Rayón superficial de 5 cm en puerta trasera derecha preexistente.'
- Línea punteada divisoria.
- Cláusulas y pie de página legal:
  * '* Conserve este recibo para retirar su vehículo.'
  * '* Autos Colombia no responde por objetos que no hayan sido inventariados en portería.'
  * '* Establecimiento amparado por póliza civil contractual.'
  * '¡Gracias por preferir a Autos Colombia!'
- Botón azul inferior fuera del recibo: 'Imprimir Comprobante' con icono de impresora.
```

### In English (Copy & paste for Figma AI / Musho / Galileo):
```text
Design a realistic thermal printed receipt card (380px width) on a subtle gray background with soft shadow.
Visual aesthetic: Monospace typography (Courier style), dashed divider lines, clean thermal ticket format.
Receipt layout:
- Centered header:
  * 'PARKING AUTOS COLOMBIA' (Bold, uppercase)
  * 'TAX ID (NIT): 900.584.214-1'
  * 'Calle 50 # 45-20, Medellin, Colombia'
  * 'ENTRY TICKET #0012' in a boxed frame
- Dashed divider line.
- Key-value metadata rows with two-column split layout:
  * DATE / TIME: 21/10/2026 06:30 PM
  * LICENSE PLATE: ABC-123 (bold centered box)
  * ASSIGNED BAY: A-01 (Floor 1)
  * VEHICLE CATEGORY: Automobile / Sedan
  * SERVICE TYPE: MONTHLY PASS
  * ATTENDANT: Juan Perez
- Dashed divider line.
- Detected Damage Section:
  * 'PRE-EXISTING DAMAGES RECORDED:'
  * '- 5cm minor scratch on rear right passenger door.'
- Dashed divider line.
- Legal disclaimer in small font:
  * '* Keep this receipt to retrieve your vehicle.'
  * '* Autos Colombia is not liable for personal items left unattended inside the vehicle.'
  * '* Covered by valid commercial liability insurance policy.'
  * 'Thank you for choosing Autos Colombia!'
- Blue primary action button below receipt: 'Print Receipt' with printer icon.
```

---

## 📱 Prompt 5: Tabla de Gestión de Contratos de Mensualidad e Historial de Novedades

### En Español (Copiar y pegar en Figma AI):
```text
Diseña una pantalla con vista de tabla de datos empresarial (Data Table View en 1440x900) para el módulo de 'Control de Mensualidades y Clientes' en Autos Colombia.
Componentes requeridos:
1. Encabezado de sección con título: 'Base de Contratos de Mensualidad' y botón secundario de filtro.
2. Barra de búsqueda y selector de filtro por estado: 'Todos', 'Vigentes', 'Por Vencer', 'Vencidas'.
3. Tabla de datos moderna con encabezados claros:
   - Cliente (Nombre en negrita + avatar circular pequeño)
   - Cédula / Documento
   - Teléfono de Contacto
   - Placa Vehicular (badge amarillo de placa colombiana)
   - Tipo y Modelo de Vehículo (ej: Automóvil - Mazda 3 Grand Touring Rojo)
   - Fecha de Inicio
   - Fecha de Vencimiento
   - Estado del Contrato (Badge verde para 'VIGENTE', badge rojo para 'VENCIDA')
   - Columna de Acciones (Botones pequeños: 'Renovar', 'Ver Historial').
4. Paginación en el pie de tabla: 'Mostrando 1 a 4 de 4 clientes registrados'.
```

### In English (Copy & paste for Figma AI / Musho / Galileo):
```text
Design a clean, modern SaaS data table view (1440x900 px) for 'Monthly Subscriptions & Customer Management' in Autos Colombia parking system.
Components:
1. Section Header: Title 'Monthly Parking Contracts Directory', with action button '+ Add Monthly Contract'.
2. Search and Filter Bar: Search bar for name or plate, filter pills: 'All', 'Active (3)', 'Expired (1)'.
3. Data Table with rounded borders and subtle zebra striping:
   - Columns:
     * Client Name (Bold, with initials avatar)
     * National ID / Document
     * Phone Number
     * License Plate (styled as yellow Colombian plate badge)
     * Vehicle Model (e.g., 'Car - Mazda 3 Grand Touring')
     * Valid From (Date)
     * Valid Until (Date)
     * Contract Status (Emerald green pill badge for 'ACTIVE', soft red pill badge for 'EXPIRED')
     * Actions (Ghost icon buttons for 'Edit', 'Renew', 'Access History').
4. Clean footer pagination showing 'Showing 1 to 4 of 4 active subscriptions'.
```

---

## 🚀 Cómo usar estos prompts en Figma paso a paso

1. Abre [Figma](https://www.figma.com/) e inicia sesión.
2. Crea un archivo nuevo en blanco: `Autos_Colombia_Mockups_EA1`.
3. Según la herramienta de IA que uses:
   - **Si usas Figma AI nativo ("Make designs"):** Presiona el icono de IA o `Ctrl + K`, selecciona "Make designs", pega el prompt correspondiente y haz clic en **Generate**.
   - **Si usas Plugins de IA en Figma (Musho AI, Wireframe Designer, Relume, Galileo AI):** Ve a la pestaña **Plugins** en Figma, ejecuta el plugin, pega el prompt y genera el frame.
4. Organiza los marcos generados en tu lienzo de Figma:
   - Marco 1: Dashboard de Celdas
   - Marco 2: Modal de Entrada Asistida
   - Marco 3: Modal de Salida y Cobro
   - Marco 4: Ticket Térmico de Recibo
   - Marco 5: Tabla de Mensualidades y Novedades
5. En Figma, haz clic en el botón superior derecho **Share** -> cambia los permisos a *"Anyone with the link can view"* -> haz clic en **Copy link** para incluirlo en tu entrega académica.
