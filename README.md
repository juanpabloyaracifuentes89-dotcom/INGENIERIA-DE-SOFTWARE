# Sistema de Información Parqueadero "Autos Colombia"
## Asignatura: Ingeniería de Software • Evidencia de Aprendizaje 1 (EA1)
### Iteración 1: Gestión de la Entrada y Salida de Vehículos

Este repositorio contiene la solución completa de ingeniería de software para el parqueadero **Autos Colombia**, enfocado en la gestión operativa de entradas, salidas, control de mensualidades, monitoreo de celdas en tiempo real y libro de novedades vehiculares.

---

## 🚀 Características Principales (Iteración 1)

- **Control de Patio en Tiempo Real:** Visualización gráfica e interactiva de celdas organizadas por tipo de vehículo (Automóviles, Motocicletas, Camionetas) y estado (Disponible, Ocupada, Mantenimiento).
- **Validación Automática de Mensualidades:** Al ingresar la placa del vehículo, el sistema verifica de forma instantánea si el conductor posee un contrato de mensualidad vigente, exonerando el cobro en la salida ($0 COP) o derivándolo a cobro por fracción/hora para visitantes ocasionales.
- **Asignación y Liberación Dinámica de Celdas:** Actualización atómica en la base de datos de la celda ocupada y liberación inmediata al registrar la salida.
- **Registro de Novedades e Incidentes:** Módulo para documentar rayones, golpes, accesorios faltantes o averías preexistentes al momento del ingreso o durante la estancia, con tipificación de gravedad y ubicación.
- **Liquidación Automática y Emisión de Tickets:** Cálculo del tiempo transcurrido en minutos/horas, cálculo del monto a pagar según las tarifas vigentes y generación de tickets imprimibles de entrada y salida con soporte para póliza contractual.
- **Arquitectura en 3 Capas:** Separación limpia de presentación (HTML5/CSS3/JS modular), lógica de negocio (Express.js REST API) y persistencia relacional con transacciones (SQLite / PostgreSQL).

---

## 🛠️ Tecnologías Empleadas

- **Backend:** Node.js (v20+ / v24+), Express.js.
- **Base de Datos:** SQLite embebido nativo (`node:sqlite`) con soporte de claves foráneas y scripts DDL estándar compatibles con PostgreSQL / MySQL.
- **Frontend:** HTML5 semántico, CSS3 moderno con variables y Flexbox/CSS Grid, JavaScript ES6 (Fetch API, eventos asíncronos).
- **Modelado y Arquitectura:** StarUML (diagramas de Casos de Uso, Clases, Paquetes, Arquitectura), PlantUML, Figma (Mockups).

---

## 📂 Estructura del Repositorio

```text
├── database/
│   ├── schema.sql                    # Modelo Físico DDL (tablas, constraints, índices)
│   ├── seed.sql                      # Datos iniciales de prueba (celdas, clientes, mensualidades)
│   └── parqueadero.db                # Base de datos SQLite (se genera automáticamente al iniciar)
├── diagramas_staruml/
│   ├── arquitectura_sistema.puml      # Diagrama de Arquitectura en Capas
│   ├── casos_de_uso.puml              # Diagrama de Casos de Uso UML
│   ├── diagrama_clases.puml           # Diagrama de Clases del Dominio
│   ├── diagrama_paquetes.puml         # Diagrama de Paquetes Modular
│   ├── modelo_er.puml                 # Modelo Entidad-Relación y Relacional
│   └── guia_staruml_paso_a_paso.md    # Instrucciones detalladas para StarUML
├── figma_mockups/
│   └── guia_mockups_figma.md          # Especificación de interfaz, colores y wireframes
├── src/
│   ├── config/
│   │   └── database.js               # Conexión y auto-migración SQLite
│   ├── controllers/
│   │   └── parkingController.js      # Controlador de entradas, salidas, celdas y cobros
│   ├── routes/
│   │   └── api.js                    # Endpoints de la API REST
│   ├── public/
│   │   ├── index.html                # Interfaz web del operador de patio
│   │   ├── css/styles.css            # Estilos corporativos de Autos Colombia
│   │   └── js/app.js                 # Lógica cliente y consumo de API
│   └── server.js                     # Servidor HTTP Express principal
├── Autos_Colombia_EA1_Documento.docx  # Documento final editable listo para entrega en Word
├── Autos_Colombia_EA1_Documento.md    # Informe técnico completo en Markdown
├── package.json
└── README.md
```

---

## ⚡ Instrucciones de Instalación y Ejecución Local

### 1. Prerrequisitos
Tener instalado Node.js (versión 20 o superior).

### 2. Clonar o descargar el proyecto
```bash
cd "INGENIERIA DE SOFTWARE"
```

### 3. Instalar dependencias
```bash
npm install
```

### 4. Iniciar la aplicación
```bash
npm start
```

### 5. Abrir en el navegador
Ingresa a: **[http://localhost:3000](http://localhost:3000)**

---

## 📤 Instrucciones para Subir a GitHub (Punto 9)

Si vas a subir este proyecto a tu propia cuenta de GitHub, sigue estos sencillos comandos en tu terminal de PowerShell o Git Bash:

1. **Crear un repositorio vacío en GitHub:**
   - Ve a [GitHub.com](https://github.com/new).
   - Crea un repositorio llamado `autos-colombia-parqueadero` (puedes dejarlo Público).
   - No marques "Add README" ni ".gitignore" (ya los tenemos creados localmente).

2. **Vincular y subir tus archivos locales:**
```bash
# 1. Verificar estado de git
git status

# 2. Agregar todos los archivos
git add .

# 3. Realizar el commit
git commit -m "feat: entrega completa Iteración 1 - Sistema Parqueadero Autos Colombia EA1"

# 4. Asignar rama principal
git branch -M main

# 5. Conectar con tu repositorio remoto (reemplaza TU_USUARIO por tu usuario real)
git remote add origin https://github.com/TU_USUARIO/autos-colombia-parqueadero.git

# 6. Subir el código
git push -u origin main
```
