# GUÍA PASO A PASO: REPRODUCCIÓN DE DIAGRAMAS EN STARUML
## Sistema de Información Parqueadero "Autos Colombia" - Iteración 1

Esta guía detalla de manera exacta cómo recrear o importar los diagramas solicitados en **StarUML** para la entrega académica.

---

### Opción 1: Creación Nativa en StarUML (Recomendada para la entrega)

#### 1. Diagrama de Casos de Uso (Punto 6)
1. Abre **StarUML**.
2. En el panel **Model Explorer** (arriba a la derecha), haz clic derecho en `Model` -> **Add Diagram** -> **Use Case Diagram**.
3. Nombra el diagrama: `Casos_de_Uso_AutosColombia`.
4. Desde la barra de herramientas de la izquierda (**Toolbox**):
   - Arrastra elementos tipo **Actor**:
     - `Operador de Patio`
     - `Administrador de Parqueadero`
     - `Cliente Mensual`
   - Arrastra un **Rectangle** (o *System Boundary*) y llámalo: `Sistema Autos Colombia`.
   - Dentro del límite de sistema, arrastra los **Use Case**:
     - `CU01: Registrar Entrada de Vehículo`
     - `CU02: Validar Vigencia de Mensualidad`
     - `CU03: Asignar Celda de Estacionamiento`
     - `CU04: Registrar Novedad Vehicular al Ingreso`
     - `CU05: Consultar Mapa de Celdas en Tiempo Real`
     - `CU06: Registrar Salida de Vehículo`
     - `CU07: Liquidar Tiempo y Calcular Cobro`
     - `CU08: Generar e Imprimir Ticket / Factura`
     - `CU09: Liberar Celda de Estacionamiento`
     - `CU10: Registrar Novedad Durante Estancia`
     - `CU11: Consultar Historial de Novedades`
     - `CU12: Monitorear Indicadores de Ocupación (KPIs)`
   - Conecta con la herramienta **Include** (`<<include>>`):
     - De `CU01` hacia `CU02` y hacia `CU03`.
     - De `CU06` hacia `CU07`, `CU08` y `CU09`.
   - Conecta con la herramienta **Extend** (`<<extend>>`):
     - De `CU04` hacia `CU01`.
   - Conecta con la herramienta **Generalization** (herencia):
     - De `Administrador` hacia `Operador de Patio`.
   - Conecta con la herramienta **Association**:
     - De `Operador` hacia `CU01`, `CU04`, `CU05`, `CU06`, `CU10`, `CU11`.
     - De `Cliente` hacia `CU08`.

---

#### 2. Diagrama de Clases (Punto 7)
1. En **Model Explorer**, haz clic derecho en `Model` -> **Add Diagram** -> **Class Diagram**.
2. Nombra el diagrama: `Diagrama_Clases_AutosColombia`.
3. Desde la barra **Toolbox**, arrastra elementos **Class**:
   - `Vehiculo`:
     - Atributos: `- placa: String`, `- marca: String`, `- modelo: String`, `- color: String`
     - Métodos: `+ getPlaca(): String`, `+ validarFormatoPlaca(): Boolean`, `+ esMensual(): Boolean`
   - `TipoVehiculo`:
     - Atributos: `- id: Integer`, `- nombre: String`, `- tarifaHora: Double`, `- tarifaMes: Double`
     - Métodos: `+ calcularTarifa(minutos: Integer): Double`
   - `Cliente`:
     - Atributos: `- id: Integer`, `- documento: String`, `- nombres: String`, `- telefono: String`
     - Métodos: `+ tieneMensualidadActiva(): Boolean`
   - `Mensualidad`:
     - Atributos: `- id: Integer`, `- fechaInicio: Date`, `- fechaFin: Date`, `- valorPagado: Double`
     - Métodos: `+ esVigente(): Boolean`, `+ diasRestantes(): Integer`
   - `Celda`:
     - Atributos: `- codigo: String`, `- piso: Integer`, `- estado: EstadoCelda`, `- placaActual: String`
     - Métodos: `+ asignarVehiculo(placa: String): Boolean`, `+ liberarCelda(): Boolean`
   - `RegistroAcceso`:
     - Atributos: `- id: Integer`, `- fechaHoraEntrada: DateTime`, `- fechaHoraSalida: DateTime`, `- tipoServicio: TipoServicio`, `- totalPagar: Double`
     - Métodos: `+ calcularTiempoEstancia(): Integer`, `+ liquidarSalida(): Double`
   - `Novedad`:
     - Atributos: `- id: Integer`, `- tipoNovedad: String`, `- nivelGravedad: String`, `- descripcion: String`
     - Métodos: `+ registrarDetalle(): Void`
4. Arrastra elementos **Enumeration** para:
   - `EstadoCelda` (`DISPONIBLE`, `OCUPADA`, `MANTENIMIENTO`)
   - `TipoServicio` (`MENSUALIDAD`, `OCASIONAL`)
   - `NivelGravedad` (`LEVE`, `MODERADA`, `GRAVE`)
5. Agrega las relaciones:
   - **Composition** (rombo relleno) de `Vehiculo` a `RegistroAcceso` (1 a 0..*).
   - **Composition** de `RegistroAcceso` a `Novedad` (1 a 0..*).
   - **Aggregation** (rombo vacío) de `Cliente` a `Vehiculo` (1 a 0..*).
   - **Aggregation** de `Celda` a `Vehiculo` (1 a 0..1).
   - **Association** de `Vehiculo` a `TipoVehiculo` (1 a 1).

---

#### 3. Diagrama de Paquetes (Punto 8)
1. En **Model Explorer**, haz clic derecho en `Model` -> **Add Diagram** -> **Package Diagram**.
2. Nombra el diagrama: `Diagrama_Paquetes_AutosColombia`.
3. Desde la barra **Toolbox**, arrastra elementos **Package**:
   - `co.edu.autoscolombia.presentation` (Vistas HTML, CSS, app.js)
   - `co.edu.autoscolombia.controllers` (ParkingController, VehicleController)
   - `co.edu.autoscolombia.services` (AccessService, BillingService, CellService)
   - `co.edu.autoscolombia.models` (Vehiculo, Celda, RegistroAcceso, Novedad, Mensualidad)
   - `co.edu.autoscolombia.repositories` (SqliteCeldaRepository, SqliteRegistroRepository)
   - `co.edu.autoscolombia.config` (DatabaseConfig, Migraciones)
4. Traza relaciones de dependencia (**Dependency** - línea punteada con flecha):
   - `presentation` ..> `controllers`
   - `controllers` ..> `services`
   - `controllers` ..> `models`
   - `services` ..> `repositories`
   - `services` ..> `models`
   - `repositories` ..> `config`

---

#### 4. Diagrama de Arquitectura de la Aplicación (Punto 3)
1. En **Model Explorer**, clic derecho -> **Add Diagram** -> **Component Diagram** (o Deployment Diagram).
2. Crea 3 paquetes contenedores que representen las capas:
   - **Capa 1: Presentación (Frontend / UI)**: `Navegador Web`, `Dashboard en Vivo`, `app.js`.
   - **Capa 2: Lógica y Aplicación (Backend Express)**: `REST API Router`, `parkingController`, `Validador de Mensualidades`, `Motor de Liquidación`.
   - **Capa 3: Persistencia y Datos**: `SQLite Adapter (DatabaseSync)`, `Base de Datos Relacional (parqueadero.db)`.
3. Conecta las capas mediante dependencias e interfaces de comunicación (`HTTP/JSON REST API`, `SQL Queries / ACID`).

---

### Opción 2: Visualización y Exportación Directa de Archivos `.puml`

Si deseas previsualizar o exportar los archivos `.puml` provistos en esta carpeta (`diagramas_staruml/`):
1. Puedes visualizarlos directamente en [PlantText.com](https://www.planttext.com/) o [PlantUML Online](https://www.plantuml.com/plantuml/uml/).
2. Copias el contenido del archivo `.puml` correspondiente, lo pegas y obtienes la imagen en PNG/SVG para pegarla directamente en tu documento o importarla en StarUML mediante la extensión PlantUML.
