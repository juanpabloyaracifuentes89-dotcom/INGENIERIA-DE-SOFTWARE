# ESPECIFICACIÓN DE MOCKUPS EN FIGMA (PUNTO 4)
## Sistema de Información Parqueadero "Autos Colombia" - Iteración 1

Esta guía contiene la especificación completa del **Sistema de Diseño (Design System)**, la arquitectura de interfaces y los **wireframes estructurados** para recrear los mockups interactivos en **Figma** correspondientes a las Historias de Usuario de la Iteración 1.

---

## 1. Sistema de Diseño (Design Tokens para Figma)

### 1.1 Paleta de Colores Corporativa
Crea estos estilos de color en tu archivo de Figma:

| Token / Nombre en Figma | Código HEX | Rol / Uso en la Interfaz |
| :--- | :--- | :--- |
| **Primary / Brand** | `#1E3A8A` | Color principal institucional (NavBar, botones primarios, cabeceras) |
| **Primary / Light** | `#3B82F6` | Enlaces, hover de botones, focos de formulario |
| **Success / Available** | `#10B981` | Celdas disponibles, mensualidades vigentes, badges de éxito |
| **Success / Light** | `#ECFDF5` | Fondo de celdas disponibles y banners de mensualidad activa |
| **Danger / Occupied** | `#EF4444` | Celdas ocupadas, botón de dar salida, alertas críticas |
| **Danger / Light** | `#FEF2F2` | Fondo de celdas ocupadas y avisos de cobro |
| **Warning / Alert** | `#F59E0B` | Celdas en mantenimiento, novedades moderadas |
| **Neutral / Dark** | `#0F172A` | Textos principales, títulos |
| **Neutral / Slate** | `#64748B` | Textos secundarios, etiquetas, bordes suaves |
| **Neutral / Background**| `#F1F5F9` | Fondo general de la aplicación |
| **Plate / License Yellow**| `#FEF08A` | Fondo tipo placa vehicular colombiana |

### 1.2 Tipografía
- **Familia principal:** `Inter`, `Roboto` o `Segoe UI` (Sans-Serif).
- **Escala de fuentes:**
  - H1 (Header Logo): 22px / Bold (700)
  - H2 (Títulos de Módulo): 18px / SemiBold (600)
  - Body Text: 14px / Regular (400)
  - Labels & Inputs: 13px / Medium (500)
  - KPI Numbers: 28px / ExtraBold (800)
  - Placa Vehicular: 18px / Bold (700) / Monospace

---

## 2. Pantallas y Mockups Estructurados

### Pantalla 1: Dashboard y Monitoreo Gráfico de Celdas de Patio (HU-02, HU-06)
*Propósito:* Permitir al operador monitorear en tiempo real la disponibilidad de celdas, el estado de los vehículos y lanzar las acciones de entrada y salida con un solo clic.

```
+---------------------------------------------------------------------------------------------------------+
| [P] AUTOS COLOMBIA - Control de Patio | Reloj: 06:30:00 PM | Operador: Juan Pérez | (•) En Línea       |
+---------------------------------------------------------------------------------------------------------+
| [ Celdas Totales: 12 ] [ Libres: 9 ] [ Ocupadas: 2 ] [ Mensuales: 2 ] [ Novedades: 1 ]                 |
+---------------------------------------------------------------------------------------------------------+
| [+ Registrar Entrada]   [- Registrar Salida]   [⚠️ Reportar Novedad]        [🔍 Buscar placa o celda...] |
+---------------------------------------------------------------------------------------------------------+
| [ Mapa de Celdas ]   [ Vehículos en Patio (2) ]   [ Clientes Mensuales ]   [ Historial Novedades ]      |
+---------------------------------------------------------------------------------------------------------+
|                                                                                                         |
|  +--------------------+  +--------------------+  +--------------------+  +--------------------+         |
|  | Celda A-01  [Auto] |  | Celda A-02  [Auto] |  | Celda A-03  [Auto] |  | Celda M-01  [Moto] |         |
|  |     [🚗 Icono]     |  |     [🚗 Icono]     |  |     [🚗 Icono]     |  |     [🏍️ Icono]     |         |
|  |    [ ABC123 ]      |  |    (•) DISPONIBLE  |  |    (•) DISPONIBLE  |  |    [ XYZ789 ]      |         |
|  | Mensual | 04:30 PM |  | Piso 1 | $4.500/h  |  | Piso 1 | $4.500/h  |  | Mensual | 05:45 PM |         |
|  |   (Fondo Rojo)     |  |   (Fondo Verde)    |  |   (Fondo Verde)    |  |   (Fondo Rojo)     |         |
|  +--------------------+  +--------------------+  +--------------------+  +--------------------+         |
|                                                                                                         |
|  +--------------------+  +--------------------+  +--------------------+  +--------------------+         |
|  | Celda A-04  [Auto] |  | Celda A-05  [Auto] |  | Celda M-02  [Moto] |  | Celda M-03  [Moto] |         |
|  |     [🚗 Icono]     |  |     [⚠️ Icono]     |  |     [🏍️ Icono]     |  |     [🏍️ Icono]     |         |
|  |    (•) DISPONIBLE  |  |   MANTENIMIENTO    |  |    (•) DISPONIBLE  |  |    (•) DISPONIBLE  |         |
|  | Piso 1 | $4.500/h  |  | Piso 1 | Inactiva  |  | Piso 1 | $2.500/h  |  | Piso 1 | $2.500/h  |         |
|  |   (Fondo Verde)    |  |  (Fondo Amarillo)  |  |   (Fondo Verde)    |  |   (Fondo Verde)    |         |
|  +--------------------+  +--------------------+  +--------------------+  +--------------------+         |
+---------------------------------------------------------------------------------------------------------+
```

---

### Pantalla 2: Modal Interactivo de Entrada de Vehículo (HU-01, HU-03, HU-04)
*Propósito:* Ingreso del vehículo, auto-validación de placas contra la base de datos de mensualidades, selección asistida de celda y registro opcional de daños preexistentes.

```
+-------------------------------------------------------------------------+
| 🚗 REGISTRAR ENTRADA DE VEHÍCULO                                    [X] |
+-------------------------------------------------------------------------+
| Placa del Vehículo:                      Tipo de Vehículo:              |
| [ ABC123                 ] [Verificar]   [ Automóvil ($4.500/h)     v ] |
|                                                                         |
| +---------------------------------------------------------------------+ |
| | (✓) CLIENTE MENSUAL VIGENTE                                         | |
| | Propietario: Carlos Andrés Gómez Restrepo                           | |
| | Mensualidad Activa hasta: 31/10/2026 • Tarifa de estancia: $0 COP   | |
| +---------------------------------------------------------------------+ |
|                                                                         |
| Asignar Celda Disponible:                Operador de Turno:             |
| [ Celda A-02 (Piso 1 - Libre)        v ] [ Juan Pérez (Patio)         ] |
|                                                                         |
| Marca: [ Mazda            ]              Color: [ Rojo Diamante       ] |
|                                                                         |
| [X] ¿El vehículo presenta golpes, rayones o novedades al ingresar?      |
| + - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - + |
| | Tipo de Novedad: [ Rayón superficial     v ]  Gravedad: [ Leve   v ]| |
| | Ubicación: [ Puerta trasera derecha                               ] | |
| | Descripción: [ Rayón preexistente de 5 cm en puerta derecha...    ] | |
| + - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - + |
|                                                                         |
|                              [ Cancelar ]   [ Confirmar Entrada e Ticket] |
+-------------------------------------------------------------------------+
```

---

### Pantalla 3: Modal de Registro de Salida y Liquidación de Cobro (HU-05)
*Propósito:* Liquidación del cobro por tiempo o validación de tarifa cero si es mensualidad, con posterior liberación inmediata de celda.

```
+-------------------------------------------------------------------------+
| 🏁 REGISTRAR SALIDA DE VEHÍCULO                                     [X] |
+-------------------------------------------------------------------------+
| Seleccione el Vehículo presente en patio:                               |
| [ ABC123 | Celda A-01 (Automóvil) - Entrada: 04:30 PM                 v ] |
|                                                                         |
| + - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - + |
| | RESUMEN DE LIQUIDACIÓN DE SALIDA:                                   | |
| |                                                                     | |
| | Placa:                       ABC123                                 | |
| | Celda a liberar:             A-01 (Piso 1)                          | |
| | Modalidad de Servicio:       MENSUALIDAD VIGENTE                    | |
| | Hora de Entrada:             04:30:15 PM                            | |
| | Hora de Salida:              06:30:00 PM                            | |
| | Tiempo Transcurrido:         120 minutos (2 horas)                  | |
| | ------------------------------------------------------------------- | |
| | TOTAL A COBRAR:              $0 COP                                 | |
| | Cubierto por Contrato de Mensualidad Vigente de Carlos Gómez.       | |
| + - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - + |
|                                                                         |
|                                [ Cerrar ]   [ Confirmar Salida y Liberar] |
+-------------------------------------------------------------------------+
```

---

### Pantalla 4: Comprobante / Ticket Físico Impreso (Ticket de Entrada / Factura Salida)
*Propósito:* Documento que se entrega al conductor al ingresar o salir.

```
+--------------------------------------------------+
|          PARQUEADERO AUTOS COLOMBIA              |
|        NIT: 900.584.214-1 • Régimen Común        |
|        Calle 50 # 45-20, Medellín, Colombia      |
|                                                  |
|              TICKET DE ENTRADA #0012             |
| ------------------------------------------------ |
| FECHA/HORA:     21/10/2026  06:30:15 PM          |
| PLACA:          ABC-123                          |
| CELDA ASIGNADA: A-01 (Piso 1)                    |
| TIPO VEHÍCULO:  Automóvil                        |
| MODALIDAD:      MENSUALIDAD                      |
| OPERADOR:       Juan Pérez                       |
| ------------------------------------------------ |
| NOVEDADES DETECTADAS AL INGRESO:                 |
| - Rayón de 5 cm en puerta trasera derecha.       |
| ------------------------------------------------ |
| * Conserve este recibo para retirar su vehículo. |
| * Autos Colombia no responde por objetos que no  |
|   hayan sido inventariados al ingreso.           |
| * Contamos con póliza civil contractual vigente. |
|                                                  |
|     ¡Gracias por preferir a Autos Colombia!      |
+--------------------------------------------------+
```

---

## 3. Guía Rápida para Crear el Proyecto en Figma en 5 Minutos

1. Entra a [Figma](https://www.figma.com/) y crea un archivo nuevo llamado `Autos_Colombia_Mockups_EA1`.
2. Presiona la tecla `F` y selecciona el marco **Desktop (1440 x 1024)** para la pantalla principal.
3. Inserta el NavBar superior con un rectángulo azul `#1E3A8A` y el texto `AUTOS COLOMBIA`.
4. Agrega 5 rectángulos tipo tarjeta (`border-radius: 12px`, fondo `#FFFFFF`) para los KPIs numéricos.
5. Para el mapa de celdas, crea un componente **Parking Cell**:
   - Marco de 180x150 px.
   - En estado Disponible: borde verde `#10B981`, texto verde.
   - En estado Ocupada: borde rojo `#EF4444`, placa amarilla `#FEF08A` con borde negro.
6. Duplica la celda para armar una cuadrícula de 3 columnas x 4 filas (12 celdas).
7. Crea dos marcos adicionales tipo modal (600x500 px) para el registro de entrada y el registro de salida siguiendo los esquemas de arriba.
8. En Figma, haz clic en **Share** -> **Copy link** para obtener el enlace de lectura y pegarlo en tu documento final.
