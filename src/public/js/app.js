// ============================================================================
// AUTOS COLOMBIA - LÓGICA FRONTEND INTERACTIVA (ITERACIONES 1, 2 Y 3)
// ============================================================================

const app = {
  celdas: [],
  mensualidades: [],
  novedades: [],
  vehiculosActivos: [],
  pagos: [],

  init() {
    this.initClock();
    this.initEventListeners();
    this.loadAllData();

    // Auto-refresco cada 25 segundos
    setInterval(() => {
      this.loadAllData(false);
    }, 25000);
  },

  // 1. Reloj en tiempo real
  initClock() {
    const updateTime = () => {
      const now = new Date();
      const str = now.toLocaleTimeString('es-CO', { hour12: true });
      const el = document.getElementById('liveClock');
      if (el) el.innerHTML = `<i class="fa-regular fa-clock"></i> ${str}`;
    };
    updateTime();
    setInterval(updateTime, 1000);
  },

  // 2. Listeners de eventos de la UI
  initEventListeners() {
    // Pestañas
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        btn.classList.add('active');
        const targetTab = btn.getAttribute('data-tab');
        document.getElementById(targetTab).classList.add('active');
      });
    });

    // Botones para abrir modales
    document.getElementById('btnOpenModalEntrada').addEventListener('click', () => {
      this.resetFormEntrada();
      this.openModal('modalEntrada');
    });

    document.getElementById('btnOpenModalSalida').addEventListener('click', () => {
      this.populateSelectSalida();
      this.openModal('modalSalida');
    });

    document.getElementById('btnOpenModalNovedad').addEventListener('click', () => {
      this.populateSelectNovedadIndep();
      this.openModal('modalNovedad');
    });

    // ITERACIÓN 2: Modales de Nuevo Cliente y Configuración de Celda
    document.getElementById('btnOpenModalNuevoCliente').addEventListener('click', () => {
      document.getElementById('formNuevoCliente').reset();
      this.openModal('modalNuevoCliente');
    });

    document.getElementById('btnOpenModalNuevaCelda').addEventListener('click', () => {
      document.getElementById('formNuevaCelda').reset();
      this.populateSelectCeldasMantenimiento();
      this.openModal('modalNuevaCelda');
    });

    // Pestañitas internas del modal de celdas
    document.getElementById('tabBtnCrearCelda').addEventListener('click', () => {
      document.getElementById('formNuevaCelda').classList.remove('hidden');
      document.getElementById('formEstadoCelda').classList.add('hidden');
      document.getElementById('tabBtnCrearCelda').className = 'btn btn-sm btn-primary';
      document.getElementById('tabBtnMantenimiento').className = 'btn btn-sm btn-secondary';
    });

    document.getElementById('tabBtnMantenimiento').addEventListener('click', () => {
      document.getElementById('formNuevaCelda').classList.add('hidden');
      document.getElementById('formEstadoCelda').classList.remove('hidden');
      document.getElementById('tabBtnCrearCelda').className = 'btn btn-sm btn-secondary';
      document.getElementById('tabBtnMantenimiento').className = 'btn btn-sm btn-primary';
    });

    // Envío de Formulario Nuevo Cliente (Iteración 2)
    document.getElementById('formNuevoCliente').addEventListener('submit', async (e) => {
      e.preventDefault();
      await this.handleFormNuevoCliente();
    });

    // ITERACIÓN 3: Listeners de Gestión de Pagos y Caja
    const btnOpenPago = document.getElementById('btnOpenModalPago');
    if (btnOpenPago) {
      btnOpenPago.addEventListener('click', () => {
        this.openModalPagoRapido();
      });
    }

    const btnOpenArqueo = document.getElementById('btnOpenModalArqueo');
    if (btnOpenArqueo) {
      btnOpenArqueo.addEventListener('click', () => {
        this.verArqueoCaja();
      });
    }

    // Buscar vehículo/monto en modal de pago
    const btnBuscarPago = document.getElementById('btnBuscarVehiculoPago');
    if (btnBuscarPago) {
      btnBuscarPago.addEventListener('click', () => {
        this.buscarVehiculoParaPago();
      });
    }

    // Cambio de método de pago (mostrar/ocultar efectivo vs voucher)
    const selectMetodo = document.getElementById('selectMetodoPago');
    if (selectMetodo) {
      selectMetodo.addEventListener('change', (e) => {
        const metodo = e.target.value;
        const rowEfectivo = document.getElementById('rowEfectivo');
        const rowRef = document.getElementById('rowReferencia');
        if (metodo === 'EFECTIVO') {
          rowEfectivo.style.display = 'flex';
          rowRef.style.display = 'none';
        } else {
          rowEfectivo.style.display = 'none';
          rowRef.style.display = 'block';
        }
      });
    }

    // Cálculo dinámico de vueltos
    const inputRecibido = document.getElementById('inputDineroRecibido');
    const inputMonto = document.getElementById('inputMontoPago');
    const inputCambio = document.getElementById('inputCambioVueltas');
    if (inputRecibido && inputMonto && inputCambio) {
      const calcCambio = () => {
        const total = parseFloat(inputMonto.value) || 0;
        const recibido = parseFloat(inputRecibido.value) || 0;
        const cambio = Math.max(0, recibido - total);
        inputCambio.value = `$${cambio.toLocaleString('es-CO')}`;
      };
      inputRecibido.addEventListener('input', calcCambio);
      inputMonto.addEventListener('input', calcCambio);
    }

    // Envío de Formulario Registrar Pago
    const formPago = document.getElementById('formRegistrarPago');
    if (formPago) {
      formPago.addEventListener('submit', async (e) => {
        e.preventDefault();
        await this.handleFormRegistrarPago();
      });
    }

    // Envío de Formulario Crear Celda (Iteración 2)
    document.getElementById('formNuevaCelda').addEventListener('submit', async (e) => {
      e.preventDefault();
      await this.handleFormCrearCelda();
    });

    // Envío de Formulario Estado Celda / Mantenimiento (Iteración 2)
    document.getElementById('formEstadoCelda').addEventListener('submit', async (e) => {
      e.preventDefault();
      await this.handleFormCambiarEstadoCelda();
    });

    // Toggle para novedades en entrada
    const checkNovedad = document.getElementById('checkTieneNovedad');
    if (checkNovedad) {
      checkNovedad.addEventListener('change', (e) => {
        const box = document.getElementById('boxNovedadIngreso');
        if (e.target.checked) {
          box.classList.remove('hidden');
        } else {
          box.classList.add('hidden');
        }
      });
    }

    // Botón verificar placa en modal entrada
    document.getElementById('btnValidarPlaca').addEventListener('click', () => {
      this.validarPlacaEntrada();
    });

    // Auto-verificar placa al salir del campo o dar Enter
    const inputPlaca = document.getElementById('inputPlacaEntrada');
    inputPlaca.addEventListener('blur', () => {
      if (inputPlaca.value.trim().length >= 5) {
        this.validarPlacaEntrada();
      }
    });
    inputPlaca.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        this.validarPlacaEntrada();
      }
    });

    // Filtro de celdas según tipo de vehículo seleccionado
    document.getElementById('selectTipoVehiculo').addEventListener('change', () => {
      this.populateAvailableCells();
    });

    // Cambio en el select de vehículo para salida
    document.getElementById('selectVehiculoSalida').addEventListener('change', (e) => {
      this.calcularResumenSalida(e.target.value);
    });

    // Envíos de Formularios
    document.getElementById('formEntrada').addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleFormEntrada();
    });

    document.getElementById('formSalida').addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleFormSalida();
    });

    document.getElementById('formNovedadIndependiente').addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleFormNovedad();
    });

    // Filtro de búsqueda rápida
    document.getElementById('filterPlacaInput').addEventListener('input', (e) => {
      this.filterGridAndTable(e.target.value.toLowerCase().trim());
    });
  },

  // 3. Cargar todos los datos desde el Backend
  async loadAllData(showToastAlert = false) {
    try {
      const [resCeldas, resStats, resMensualidades, resNovedades] = await Promise.all([
        fetch('/api/celdas').then(r => r.json()),
        fetch('/api/stats').then(r => r.json()),
        fetch('/api/mensualidades').then(r => r.json()),
        fetch('/api/novedades').then(r => r.json())
      ]);

      if (resCeldas.success) {
        this.celdas = resCeldas.data;
        this.vehiculosActivos = this.celdas.filter(c => c.estado === 'OCUPADA' && c.placa_actual);
        this.renderCellsGrid();
        this.renderTableActivos();
      }

      if (resStats.success) {
        this.renderKPIs(resStats.data);
      }

      if (resMensualidades.success) {
        this.mensualidades = resMensualidades.data;
        this.renderTableMensualidades();
      }

      if (resNovedades.success) {
        this.novedades = resNovedades.data;
        this.renderTableNovedades();
      }

      // ITERACIÓN 3: Cargar pagos y arqueo
      await this.loadPagos();

      if (showToastAlert) {
        this.showToast('Datos actualizados en tiempo real', 'info');
      }
    } catch (error) {
      console.error('Error cargando datos:', error);
      this.showToast('Error conectando con el servidor', 'error');
    }
  },

  // 4. Renderizar KPIs
  renderKPIs(stats) {
    document.getElementById('kpiTotalCeldas').textContent = stats.totalCeldas || 0;
    document.getElementById('kpiDisponibles').textContent = stats.celdasDisponibles || 0;
    document.getElementById('kpiOcupadas').textContent = stats.celdasOcupadas || 0;
    document.getElementById('kpiMensualidades').textContent = stats.activosMensualidad || 0;
    document.getElementById('kpiNovedades').textContent = stats.totalNovedades || 0;
    document.getElementById('countVehiculosAdentro').textContent = stats.celdasOcupadas || 0;
  },

  // 5. Renderizar Cuadrícula Gráfica de Celdas
  renderCellsGrid() {
    const container = document.getElementById('cellsGridContainer');
    container.innerHTML = '';

    if (this.celdas.length === 0) {
      container.innerHTML = '<p class="text-muted">No hay celdas registradas en el sistema.</p>';
      return;
    }

    this.celdas.forEach(c => {
      const card = document.createElement('div');
      const statusClass = c.estado === 'DISPONIBLE' ? 'status-available' :
                          c.estado === 'OCUPADA' ? 'status-occupied' : 'status-maintenance';
      
      card.className = `parking-cell ${statusClass}`;
      card.setAttribute('data-code', c.codigo);
      card.setAttribute('data-plate', c.placa_actual || '');

      let iconClass = 'fa-car';
      if (c.id_tipo_vehiculo === 2) iconClass = 'fa-motorcycle';
      if (c.id_tipo_vehiculo === 3) iconClass = 'fa-truck-pickup';

      let bodyContent = '';
      let footerContent = '';

      if (c.estado === 'DISPONIBLE') {
        bodyContent = `
          <div class="cell-icon"><i class="fa-solid ${iconClass}"></i></div>
          <div class="cell-empty-text"><i class="fa-solid fa-circle-check"></i> LIBRE</div>
        `;
        footerContent = `<span>Piso ${c.piso}</span><span>$${c.tarifa_hora.toLocaleString()}/h</span>`;
        card.title = `Haga clic para registrar entrada en la celda ${c.codigo}`;
        card.onclick = () => this.abrirEntradaConCelda(c.codigo, c.id_tipo_vehiculo);
      } else if (c.estado === 'OCUPADA') {
        const horaEntrada = c.fecha_hora_entrada ? c.fecha_hora_entrada.split(' ')[1] : '--:--';
        const tagClass = c.tipo_servicio === 'MENSUALIDAD' ? 'tag-monthly' : 'tag-occasional';
        bodyContent = `
          <div class="cell-icon"><i class="fa-solid ${iconClass}"></i></div>
          <div class="cell-plate">${c.placa_actual}</div>
        `;
        footerContent = `
          <span class="service-tag ${tagClass}">${c.tipo_servicio}</span>
          <span><i class="fa-regular fa-clock"></i> ${horaEntrada}</span>
        `;
        card.title = `Haga clic para dar salida rápida al vehículo ${c.placa_actual}`;
        card.onclick = () => this.abrirSalidaConPlaca(c.placa_actual);
      } else {
        bodyContent = `
          <div class="cell-icon"><i class="fa-solid fa-triangle-exclamation"></i></div>
          <div class="text-muted">Mantenimiento</div>
        `;
        footerContent = `<span>Piso ${c.piso}</span><span>Inactiva</span>`;
      }

      card.innerHTML = `
        <div class="cell-top">
          <span class="cell-code">${c.codigo}</span>
          <span class="cell-type-badge">${c.tipo_vehiculo_nombre}</span>
        </div>
        <div class="cell-body">
          ${bodyContent}
        </div>
        <div class="cell-footer">
          ${footerContent}
        </div>
      `;

      container.appendChild(card);
    });
  },

  // 6. Renderizar Tabla de Vehículos Activos en Patio
  renderTableActivos() {
    const tbody = document.getElementById('tbodyActivos');
    tbody.innerHTML = '';

    if (this.vehiculosActivos.length === 0) {
      tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding: 20px;">No hay vehículos dentro del parqueadero en este momento.</td></tr>`;
      return;
    }

    this.vehiculosActivos.forEach(v => {
      const tr = document.createElement('tr');
      const tagClass = v.tipo_servicio === 'MENSUALIDAD' ? 'badge-active' : 'badge-warn';
      const propietario = v.propietario_nombre || 'Visitante Ocasional';
      const vehiculoDesc = `${v.marca || ''} ${v.modelo || ''} (${v.color || ''})`.trim() || 'N/A';

      tr.innerHTML = `
        <td><strong class="cell-plate" style="font-size:0.9rem;">${v.placa_actual}</strong></td>
        <td><i class="fa-solid ${v.icono}"></i> ${v.tipo_vehiculo_nombre}</td>
        <td><span class="badge-status badge-active">${v.codigo} (Piso ${v.piso})</span></td>
        <td>${v.fecha_hora_entrada || 'Reciente'}</td>
        <td><span class="badge-status ${tagClass}">${v.tipo_servicio}</span></td>
        <td>${propietario} <br><small class="text-muted">${vehiculoDesc}</small></td>
        <td>
          <button class="btn btn-sm btn-danger" onclick="app.abrirSalidaConPlaca('${v.placa_actual}')">
            <i class="fa-solid fa-arrow-right-from-bracket"></i> Salida
          </button>
        </td>
      `;
      tbody.appendChild(tr);
    });
  },

  // 7. Renderizar Tabla de Mensualidades
  renderTableMensualidades() {
    const tbody = document.getElementById('tbodyMensualidades');
    tbody.innerHTML = '';

    if (this.mensualidades.length === 0) {
      tbody.innerHTML = `<tr><td colspan="8" style="text-align:center; padding: 20px;">No hay contratos de mensualidad registrados.</td></tr>`;
      return;
    }

    this.mensualidades.forEach(m => {
      const tr = document.createElement('tr');
      const badgeClass = m.estado === 'VIGENTE' ? 'badge-active' : 'badge-expired';
      tr.innerHTML = `
        <td><strong>${m.cliente_nombre_completo}</strong></td>
        <td>${m.cliente_documento}</td>
        <td>${m.telefono}</td>
        <td><span class="cell-plate" style="font-size:0.85rem;">${m.placa}</span></td>
        <td>${m.tipo_vehiculo} - ${m.marca} ${m.modelo}</td>
        <td>${m.fecha_inicio}</td>
        <td><strong>${m.fecha_fin}</strong></td>
        <td><span class="badge-status ${badgeClass}">${m.estado}</span></td>
      `;
      tbody.appendChild(tr);
    });
  },

  // 8. Renderizar Tabla de Novedades
  renderTableNovedades() {
    const tbody = document.getElementById('tbodyNovedades');
    tbody.innerHTML = '';

    if (this.novedades.length === 0) {
      tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding: 20px;">No hay novedades reportadas en el sistema.</td></tr>`;
      return;
    }

    this.novedades.forEach(n => {
      const tr = document.createElement('tr');
      const gravClass = n.nivel_gravedad === 'GRAVE' ? 'badge-expired' : 
                        n.nivel_gravedad === 'MODERADA' ? 'badge-warn' : 'badge-active';
      tr.innerHTML = `
        <td>${n.fecha_hora}</td>
        <td><span class="cell-plate" style="font-size:0.85rem;">${n.placa}</span></td>
        <td>${n.codigo_celda || 'N/A'}</td>
        <td><strong>${n.tipo_novedad}</strong></td>
        <td><span class="badge-status ${gravClass}">${n.nivel_gravedad}</span></td>
        <td>${n.ubicacion_en_vehiculo || 'No especificada'}</td>
        <td>${n.descripcion}</td>
      `;
      tbody.appendChild(tr);
    });
  },

  // 9. Validar placa en tiempo real en Modal Entrada
  async validarPlacaEntrada() {
    const placaInput = document.getElementById('inputPlacaEntrada');
    const placa = (placaInput.value || '').toUpperCase().trim();
    const banner = document.getElementById('bannerValidacionPlaca');

    if (!placa) {
      banner.className = 'validation-banner banner-danger';
      banner.innerHTML = `<i class="fa-solid fa-circle-xmark"></i> Ingrese una placa válida.`;
      banner.classList.remove('hidden');
      return;
    }

    try {
      const res = await fetch(`/api/vehiculos/validar/${placa}`).then(r => r.json());
      if (!res.success) {
        throw new Error(res.message);
      }

      const info = res.data;

      // Si ya está dentro
      if (info.estaDentro) {
        banner.className = 'validation-banner banner-danger';
        banner.innerHTML = `
          <strong><i class="fa-solid fa-triangle-exclamation"></i> VEHÍCULO YA EN PATIO:</strong><br>
          La placa <strong>${placa}</strong> ya ingresó y se encuentra en la celda <strong>${info.registroActivo.celda}</strong> desde las ${info.registroActivo.fecha_hora_entrada}. No puede ingresar dos veces.
        `;
        banner.classList.remove('hidden');
        return;
      }

      // Si tiene mensualidad vigente
      if (info.tieneMensualidadVigente) {
        banner.className = 'validation-banner banner-success';
        banner.innerHTML = `
          <strong><i class="fa-solid fa-circle-check"></i> CLIENTE MENSUAL VIGENTE:</strong><br>
          Vehículo registrado a nombre de: <strong>${info.vehiculoRegistrado.cliente_nombres} ${info.vehiculoRegistrado.cliente_apellidos}</strong>.<br>
          Mensualidad activa hasta el: <strong>${info.mensualidad.fecha_fin}</strong>. Tarifa de salida: <strong>$0 COP</strong>.
        `;
        banner.classList.remove('hidden');

        // Preseleccionar tipo de vehículo
        if (info.vehiculoRegistrado.id_tipo_vehiculo) {
          document.getElementById('selectTipoVehiculo').value = info.vehiculoRegistrado.id_tipo_vehiculo;
        }
        if (info.vehiculoRegistrado.marca) {
          document.getElementById('inputMarca').value = info.vehiculoRegistrado.marca;
        }
        if (info.vehiculoRegistrado.color) {
          document.getElementById('inputColor').value = info.vehiculoRegistrado.color;
        }
      } else {
        banner.className = 'validation-banner banner-info';
        banner.innerHTML = `
          <strong><i class="fa-solid fa-circle-info"></i> VEHÍCULO VISITANTE OCASIONAL:</strong><br>
          Este vehículo no cuenta con contrato de mensualidad activa. Se liquidará por horas según la tarifa oficial al salir.
        `;
        banner.classList.remove('hidden');
      }

      this.populateAvailableCells();
    } catch (err) {
      console.error(err);
      banner.className = 'validation-banner banner-danger';
      banner.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i> Error al verificar placa: ${err.message}`;
      banner.classList.remove('hidden');
    }
  },

  // 10. Llenar dropdown de celdas disponibles
  populateAvailableCells(preselectedCell = null) {
    const select = document.getElementById('selectCeldaEntrada');
    const tipoVehiculoId = parseInt(document.getElementById('selectTipoVehiculo').value);
    select.innerHTML = '';

    const disponibles = this.celdas.filter(c => c.estado === 'DISPONIBLE' && c.id_tipo_vehiculo === tipoVehiculoId);

    if (disponibles.length === 0) {
      const opt = document.createElement('option');
      opt.value = '';
      opt.textContent = '❌ No hay celdas disponibles para este tipo de vehículo';
      select.appendChild(opt);
      return;
    }

    disponibles.forEach(c => {
      const opt = document.createElement('option');
      opt.value = c.codigo;
      opt.textContent = `Celda ${c.codigo} (Piso ${c.piso}) - Disponible`;
      if (preselectedCell && preselectedCell === c.codigo) {
        opt.selected = true;
      }
      select.appendChild(opt);
    });
  },

  // 11. Registrar Entrada de Vehículo (Submit)
  async handleFormEntrada() {
    const placa = document.getElementById('inputPlacaEntrada').value.toUpperCase().trim();
    const id_tipo_vehiculo = parseInt(document.getElementById('selectTipoVehiculo').value);
    const codigo_celda = document.getElementById('selectCeldaEntrada').value;
    const marca = document.getElementById('inputMarca').value.trim();
    const color = document.getElementById('inputColor').value.trim();

    if (!codigo_celda) {
      this.showToast('Debe seleccionar una celda disponible válida', 'warning');
      return;
    }

    const payload = {
      placa,
      id_tipo_vehiculo,
      codigo_celda,
      marca,
      color,
      operador: 'Juan Pérez'
    };

    // Si tiene novedad
    const tieneNovedad = document.getElementById('checkTieneNovedad').checked;
    if (tieneNovedad) {
      const desc = document.getElementById('inputDescNovedad').value.trim();
      if (!desc) {
        this.showToast('Por favor describa la novedad identificada al ingreso.', 'warning');
        return;
      }
      payload.novedad = {
        tipo: document.getElementById('selectTipoNovedadIngreso').value,
        gravedad: document.getElementById('selectGravedadIngreso').value,
        ubicacion: document.getElementById('inputUbicacionNovedad').value.trim(),
        descripcion: desc
      };
    }

    try {
      const res = await fetch('/api/entradas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }).then(r => r.json());

      if (!res.success) {
        this.showToast(res.message, 'error');
        return;
      }

      this.closeModal('modalEntrada');
      this.showToast(res.message, 'success');
      this.loadAllData();

      // Mostrar Comprobante de Entrada
      this.mostrarTicketEntrada(res.data);
    } catch (err) {
      console.error(err);
      this.showToast('Error de red al registrar entrada', 'error');
    }
  },

  // 12. Modal Salida: Poblar lista de vehículos para salir
  populateSelectSalida(preselectedPlate = null) {
    const select = document.getElementById('selectVehiculoSalida');
    const resumenBox = document.getElementById('resumenSalidaBox');
    const btnSalida = document.getElementById('btnConfirmarSalida');

    select.innerHTML = '<option value="">-- Seleccionar vehículo presente en patio --</option>';
    resumenBox.classList.add('hidden');
    btnSalida.disabled = true;

    if (this.vehiculosActivos.length === 0) {
      const opt = document.createElement('option');
      opt.value = '';
      opt.textContent = 'No hay vehículos adentro para liquidar';
      select.appendChild(opt);
      return;
    }

    this.vehiculosActivos.forEach(v => {
      const opt = document.createElement('option');
      opt.value = v.placa_actual;
      opt.textContent = `${v.placa_actual} | Celda ${v.codigo} (${v.tipo_vehiculo_nombre}) - Entrada: ${v.fecha_hora_entrada}`;
      if (preselectedPlate && preselectedPlate === v.placa_actual) {
        opt.selected = true;
      }
      select.appendChild(opt);
    });

    if (preselectedPlate) {
      this.calcularResumenSalida(preselectedPlate);
    }
  },

  // 13. Calcular liquidación preliminar de salida
  calcularResumenSalida(placa) {
    const resumenBox = document.getElementById('resumenSalidaBox');
    const btnSalida = document.getElementById('btnConfirmarSalida');

    if (!placa) {
      resumenBox.classList.add('hidden');
      btnSalida.disabled = true;
      return;
    }

    const vehiculo = this.vehiculosActivos.find(v => v.placa_actual === placa);
    if (!vehiculo) return;

    const entrada = new Date(vehiculo.fecha_hora_entrada.replace(' ', 'T'));
    const ahora = new Date();
    const diffMin = Math.max(1, Math.ceil((ahora - entrada) / (1000 * 60)));
    const horas = Math.ceil(diffMin / 60) || 1;

    let total = 0;
    let nota = '';

    if (vehiculo.tipo_servicio === 'MENSUALIDAD') {
      total = 0;
      nota = 'Vehículo amparado por contrato de mensualidad vigente. Tarifa de estancia: $0 COP.';
    } else {
      total = horas * (vehiculo.tarifa_hora || 4500);
      nota = `${horas} hora(s) calculada(s) x $${vehiculo.tarifa_hora.toLocaleString()} COP/hora.`;
    }

    resumenBox.innerHTML = `
      <div class="resumen-row"><span>Placa:</span><strong>${vehiculo.placa_actual}</strong></div>
      <div class="resumen-row"><span>Celda a liberar:</span><strong>${vehiculo.codigo}</strong></div>
      <div class="resumen-row"><span>Tipo de Servicio:</span><span class="badge-status ${vehiculo.tipo_servicio === 'MENSUALIDAD' ? 'badge-active' : 'badge-warn'}">${vehiculo.tipo_servicio}</span></div>
      <div class="resumen-row"><span>Hora de Entrada:</span><span>${vehiculo.fecha_hora_entrada}</span></div>
      <div class="resumen-row"><span>Hora Estimada de Salida:</span><span>${ahora.toLocaleTimeString('es-CO')}</span></div>
      <div class="resumen-row"><span>Tiempo en Patio:</span><span>${diffMin} minutos (~${horas} hora/s)</span></div>
      <div class="resumen-row total">
        <span>TOTAL A COBRAR:</span>
        <span>$${total.toLocaleString()} COP</span>
      </div>
      <p style="font-size:0.8rem; color:#64748b; margin-top:6px;">${nota}</p>
    `;

    resumenBox.classList.remove('hidden');
    btnSalida.disabled = false;
  },

  // 14. Registrar Salida (Submit)
  async handleFormSalida() {
    const placa = document.getElementById('selectVehiculoSalida').value;
    if (!placa) {
      this.showToast('Seleccione un vehículo válido', 'warning');
      return;
    }

    try {
      const res = await fetch('/api/salidas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ placa, operador: 'Juan Pérez' })
      }).then(r => r.json());

      if (!res.success) {
        this.showToast(res.message, 'error');
        return;
      }

      this.closeModal('modalSalida');
      this.showToast(res.message, 'success');
      this.loadAllData();

      // Mostrar Ticket de Salida
      this.mostrarTicketSalida(res.data);
    } catch (err) {
      console.error(err);
      this.showToast('Error de red al registrar salida', 'error');
    }
  },

  // 15. Novedad Independiente
  populateSelectNovedadIndep() {
    const select = document.getElementById('selectPlacaNovedad');
    select.innerHTML = '<option value="">-- Seleccionar vehículo presente --</option>';

    if (this.vehiculosActivos.length === 0) {
      const opt = document.createElement('option');
      opt.value = '';
      opt.textContent = 'No hay vehículos adentro';
      select.appendChild(opt);
      return;
    }

    this.vehiculosActivos.forEach(v => {
      const opt = document.createElement('option');
      opt.value = v.placa_actual;
      opt.textContent = `${v.placa_actual} (Celda ${v.codigo})`;
      select.appendChild(opt);
    });
  },

  async handleFormNovedad() {
    const placa = document.getElementById('selectPlacaNovedad').value;
    const tipo = document.getElementById('selectTipoNovIndep').value;
    const gravedad = document.getElementById('selectGravedadNovIndep').value;
    const ubicacion = document.getElementById('inputUbicacionNovIndep').value.trim();
    const descripcion = document.getElementById('inputDescNovIndep').value.trim();

    if (!placa || !descripcion) {
      this.showToast('La placa y la descripción son requeridas', 'warning');
      return;
    }

    try {
      const res = await fetch('/api/novedades', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          placa,
          tipo_novedad: tipo,
          nivel_gravedad: gravedad,
          ubicacion,
          descripcion
        })
      }).then(r => r.json());

      if (!res.success) {
        this.showToast(res.message, 'error');
        return;
      }

      this.closeModal('modalNovedad');
      this.showToast('Novedad guardada exitosamente', 'success');
      this.loadAllData();
    } catch (err) {
      console.error(err);
      this.showToast('Error al guardar novedad', 'error');
    }
  },

  // 16. Mostrar Comprobantes
  mostrarTicketEntrada(datos) {
    const container = document.getElementById('ticketContent');
    container.innerHTML = `
      <div class="ticket-print">
        <div class="ticket-header">
          <div class="ticket-title">PARQUEADERO AUTOS COLOMBIA</div>
          <div>NIT: 900.584.214-1 &bull; Régimen Común</div>
          <div>Calle 50 # 45-20, Medellín, Colombia</div>
          <div style="font-weight:bold; margin-top:5px;">TICKET DE ENTRADA #${datos.id}</div>
        </div>
        <div class="ticket-item"><span>FECHA/HORA:</span><strong>${datos.fecha_hora_entrada}</strong></div>
        <div class="ticket-item"><span>PLACA:</span><strong style="font-size:1.2rem;">${datos.placa}</strong></div>
        <div class="ticket-item"><span>CELDA ASIGNADA:</span><strong>${datos.codigo_celda} (Piso ${datos.piso})</strong></div>
        <div class="ticket-item"><span>TIPO VEHÍCULO:</span><span>${datos.tipo_vehiculo}</span></div>
        <div class="ticket-item"><span>MODALIDAD:</span><strong>${datos.tipo_servicio}</strong></div>
        <div class="ticket-item"><span>OPERADOR:</span><span>${datos.operador_entrada}</span></div>
        <div class="ticket-divider"></div>
        <div style="font-size:0.75rem;">
          * Conserve este recibo para retirar su vehículo.<br>
          * Autos Colombia no se hace responsable por objetos de valor no declarados en el inventario de ingreso.<br>
          * El parqueadero cuenta con póliza de responsabilidad civil contractual.
        </div>
        <div class="ticket-footer">¡Gracias por preferir a Autos Colombia!</div>
      </div>
    `;
    this.openModal('modalTicket');
  },

  mostrarTicketSalida(datos) {
    const container = document.getElementById('ticketContent');
    container.innerHTML = `
      <div class="ticket-print">
        <div class="ticket-header">
          <div class="ticket-title">PARQUEADERO AUTOS COLOMBIA</div>
          <div>NIT: 900.584.214-1 &bull; Régimen Común</div>
          <div>Calle 50 # 45-20, Medellín, Colombia</div>
          <div style="font-weight:bold; margin-top:5px;">FACTURA DE SALIDA #${datos.id_registro}</div>
        </div>
        <div class="ticket-item"><span>PLACA:</span><strong style="font-size:1.2rem;">${datos.placa}</strong></div>
        <div class="ticket-item"><span>CELDA LIBERADA:</span><strong>${datos.codigo_celda}</strong></div>
        <div class="ticket-item"><span>MODALIDAD:</span><strong>${datos.tipo_servicio}</strong></div>
        <div class="ticket-item"><span>HORA ENTRADA:</span><span>${datos.fecha_hora_entrada}</span></div>
        <div class="ticket-item"><span>HORA SALIDA:</span><span>${datos.fecha_hora_salida}</span></div>
        <div class="ticket-item"><span>TIEMPO TOTAL:</span><strong>${datos.minutos_transcurridos} min (~${datos.horas_cobradas} h)</strong></div>
        <div class="ticket-divider"></div>
        <div class="ticket-total">
          <span>VALOR PAGADO:</span>
          <span>$${datos.total_pagar.toLocaleString()} COP</span>
        </div>
        <div style="font-size:0.8rem; color:#475569; margin-bottom:8px;">${datos.detalle_cobro}</div>
        <div class="ticket-item"><span>OPERADOR:</span><span>${datos.operador_salida}</span></div>
        <div class="ticket-divider"></div>
        <div class="ticket-footer">¡Vehículo retirado a satisfacción! Vuelva pronto.</div>
      </div>
    `;
    this.openModal('modalTicket');
  },

  // 17. Acciones directas desde el mapa de celdas
  abrirEntradaConCelda(codigoCelda, idTipoVehiculo) {
    this.resetFormEntrada();
    document.getElementById('selectTipoVehiculo').value = idTipoVehiculo;
    this.populateAvailableCells(codigoCelda);
    this.openModal('modalEntrada');
    document.getElementById('inputPlacaEntrada').focus();
  },

  abrirSalidaConPlaca(placa) {
    this.populateSelectSalida(placa);
    this.openModal('modalSalida');
  },

  // 18. Filtro visual en mapa y tablas
  filterGridAndTable(query) {
    document.querySelectorAll('.parking-cell').forEach(cell => {
      const code = (cell.getAttribute('data-code') || '').toLowerCase();
      const plate = (cell.getAttribute('data-plate') || '').toLowerCase();
      if (!query || code.includes(query) || plate.includes(query)) {
        cell.style.display = 'flex';
      } else {
        cell.style.display = 'none';
      }
    });

    document.querySelectorAll('#tbodyActivos tr').forEach(tr => {
      const text = tr.textContent.toLowerCase();
      if (!query || text.includes(query)) {
        tr.style.display = '';
      } else {
        tr.style.display = 'none';
      }
    });
  },

  // Helpers para Iteración 2: Gestión de Usuarios y Celdas
  populateSelectCeldasMantenimiento() {
    const select = document.getElementById('selectCeldaMantenimiento');
    select.innerHTML = '';

    // Solo mostrar celdas que NO estén OCUPADAS (no se puede poner en mantenimiento si hay un carro adentro)
    const celdasValidas = this.celdas.filter(c => c.estado !== 'OCUPADA');

    if (celdasValidas.length === 0) {
      const opt = document.createElement('option');
      opt.value = '';
      opt.textContent = 'No hay celdas disponibles para cambiar de estado';
      select.appendChild(opt);
      return;
    }

    celdasValidas.forEach(c => {
      const opt = document.createElement('option');
      opt.value = c.codigo;
      opt.textContent = `Celda ${c.codigo} (${c.tipo_vehiculo_nombre}) - Estado actual: ${c.estado}`;
      select.appendChild(opt);
    });
  },

  async handleFormNuevoCliente() {
    const documento = document.getElementById('inputCliDoc').value.trim();
    const nombres = document.getElementById('inputCliNom').value.trim();
    const apellidos = document.getElementById('inputCliApe').value.trim();
    const telefono = document.getElementById('inputCliTel').value.trim();

    // Validación en frontend antes de enviar al servidor
    if (!documento || !nombres || !apellidos || !telefono) {
      this.showToast('Documento, nombres, apellidos y teléfono son obligatorios.', 'warning');
      return;
    }

    const payload = {
      documento,
      nombres,
      apellidos,
      telefono,
      email: document.getElementById('inputCliEmail').value.trim(),
      placa: document.getElementById('inputCliPlaca').value.trim().toUpperCase(),
      id_tipo_vehiculo: parseInt(document.getElementById('selectCliTipoVeh').value) || 1,
      marca: document.getElementById('inputCliMarca').value.trim(),
      modelo: document.getElementById('inputCliModelo').value.trim()
    };

    try {
      const res = await fetch('/api/clientes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }).then(r => r.json());

      if (!res.success) {
        this.showToast(res.message, 'error');
        return;
      }

      this.closeModal('modalNuevoCliente');
      this.showToast(res.message, 'success');
      this.loadAllData();
    } catch (err) {
      this.showToast('Error de conexión al guardar cliente', 'error');
    }
  },

  async handleFormCrearCelda() {
    const codigo = document.getElementById('inputCodCelda').value.trim().toUpperCase();

    // Validación en frontend antes de enviar al servidor
    if (!codigo) {
      this.showToast('El código de la celda es obligatorio.', 'warning');
      return;
    }

    const payload = {
      codigo,
      piso: parseInt(document.getElementById('selectPisoCelda').value) || 1,
      id_tipo_vehiculo: parseInt(document.getElementById('selectTipoCelda').value) || 1
    };

    try {
      const res = await fetch('/api/celdas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }).then(r => r.json());

      if (!res.success) {
        this.showToast(res.message, 'error');
        return;
      }

      this.closeModal('modalNuevaCelda');
      this.showToast(res.message, 'success');
      this.loadAllData();
    } catch (err) {
      this.showToast('Error de red al crear celda', 'error');
    }
  },

  async handleFormCambiarEstadoCelda() {
    const codigo = document.getElementById('selectCeldaMantenimiento').value;
    const nuevo_estado = document.getElementById('selectAccionCelda').value;

    // Validación en frontend antes de enviar al servidor
    if (!codigo) {
      this.showToast('Debe seleccionar una celda válida.', 'warning');
      return;
    }

    try {
      const res = await fetch(`/api/celdas/${codigo}/estado`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nuevo_estado })
      }).then(r => r.json());

      if (!res.success) {
        this.showToast(res.message, 'error');
        return;
      }

      this.closeModal('modalNuevaCelda');
      this.showToast(res.message, 'success');
      this.loadAllData();
    } catch (err) {
      this.showToast('Error al actualizar estado de celda', 'error');
    }
  },

  // ============================================================================
  // ITERACIÓN 3: MÉTODOS DE GESTIÓN DE PAGOS Y FACTURACIÓN
  // ============================================================================

  // Cargar pagos y resumen de caja desde API
  async loadPagos() {
    try {
      const [resPagos, resCaja] = await Promise.all([
        fetch('/api/pagos').then(r => r.json()),
        fetch('/api/pagos/resumen-caja').then(r => r.json())
      ]);

      if (resPagos.success) {
        this.pagos = resPagos.data;
        this.renderTablePagos();
      }

      if (resCaja.success) {
        this.renderResumenCaja(resCaja.data);
      }
    } catch (err) {
      console.error('Error cargando pagos:', err);
    }
  },

  // Renderizar tabla de historial de pagos
  renderTablePagos() {
    const tbody = document.getElementById('tbodyPagos');
    if (!tbody) return;
    tbody.innerHTML = '';

    if (this.pagos.length === 0) {
      tbody.innerHTML = `<tr><td colspan="9" class="text-center text-muted">No se registran transacciones de pago el día de hoy.</td></tr>`;
      return;
    }

    this.pagos.forEach(p => {
      const tr = document.createElement('tr');
      const badgeMetodo = p.metodo_pago === 'EFECTIVO' ? 'efectivo' :
                          p.metodo_pago.includes('TARJETA') ? 'tarjeta' : 'transferencia';

      const conceptoLabel = p.tipo_pago === 'MENSUALIDAD' ? '🗓️ Mensualidad' : '⏱️ Tiempo Ocasional';

      tr.innerHTML = `
        <td><strong>${p.numero_comprobante}</strong></td>
        <td>${p.fecha_hora}</td>
        <td><span class="plate-badge">${p.placa}</span></td>
        <td>${p.cliente_nombre || 'Cliente Ocasional'}</td>
        <td>${conceptoLabel}</td>
        <td><span class="badge-payment ${badgeMetodo}">${p.metodo_pago.replace('_', ' ')}</span></td>
        <td><strong>$${p.monto.toLocaleString('es-CO')} COP</strong></td>
        <td><span class="badge-payment aprobado">${p.estado}</span></td>
        <td>
          <button class="btn btn-sm btn-outline" onclick="app.verComprobante('${p.numero_comprobante}')" title="Ver Comprobante">
            <i class="fa-solid fa-receipt"></i> Recibo
          </button>
        </td>
      `;
      tbody.appendChild(tr);
    });
  },

  // Renderizar KPIs de caja
  renderResumenCaja(data) {
    const kpiTotal = document.getElementById('kpiRecaudoTotal');
    const kpiEfectivo = document.getElementById('kpiRecaudoEfectivo');
    const kpiDigital = document.getElementById('kpiRecaudoDigital');
    const kpiTrans = document.getElementById('kpiTransaccionesTotal');

    if (kpiTotal) kpiTotal.textContent = `$${(data.total_recaudado || 0).toLocaleString('es-CO')}`;
    if (kpiTrans) kpiTrans.textContent = data.total_transacciones || 0;

    let totalEfectivo = 0;
    let totalDigital = 0;

    (data.desglose_metodos || []).forEach(m => {
      if (m.metodo_pago === 'EFECTIVO') totalEfectivo += m.subtotal;
      else totalDigital += m.subtotal;
    });

    if (kpiEfectivo) kpiEfectivo.textContent = `$${totalEfectivo.toLocaleString('es-CO')}`;
    if (kpiDigital) kpiDigital.textContent = `$${totalDigital.toLocaleString('es-CO')}`;
  },

  // Abrir modal de registrar pago
  openModalPagoRapido(placaSugerida = '', montoSugerido = 0, tipoSugerido = 'MENSUALIDAD') {
    const form = document.getElementById('formRegistrarPago');
    if (form) form.reset();
    
    document.getElementById('bannerInfoPago').classList.add('hidden');
    document.getElementById('rowEfectivo').style.display = 'flex';
    document.getElementById('rowReferencia').style.display = 'none';
    document.getElementById('inputCambioVueltas').value = '$0';

    if (placaSugerida) {
      document.getElementById('inputPlacaPago').value = placaSugerida;
      this.buscarVehiculoParaPago();
    }
    if (montoSugerido > 0) {
      document.getElementById('inputMontoPago').value = montoSugerido;
      document.getElementById('inputDineroRecibido').value = montoSugerido;
    }
    if (tipoSugerido) {
      document.getElementById('selectTipoPago').value = tipoSugerido;
    }

    this.openModal('modalRegistrarPago');
  },

  // Buscar información del vehículo para liquidar o cobrar
  async buscarVehiculoParaPago() {
    const placa = (document.getElementById('inputPlacaPago').value || '').trim().toUpperCase();
    const banner = document.getElementById('bannerInfoPago');
    if (!placa) {
      this.showToast('Ingrese la placa a consultar', 'warning');
      return;
    }

    try {
      const res = await fetch(`/api/vehiculos/validar/${placa}`).then(r => r.json());
      if (res.success) {
        banner.classList.remove('hidden');
        if (res.vehiculo) {
          const v = res.vehiculo;
          const cliente = v.cliente_nombres ? `${v.cliente_nombres} ${v.cliente_apellidos}` : 'No vinculado a contrato mensual';
          banner.innerHTML = `
            <strong>Vehículo:</strong> ${v.marca || ''} ${v.modelo || ''} (${v.tipo_nombre})<br>
            <strong>Titular:</strong> ${cliente} ${v.cliente_doc ? `(C.C ${v.cliente_doc})` : ''}<br>
            <strong>Tarifa Mes Sugerida:</strong> $${(v.tarifa_mes || 180000).toLocaleString('es-CO')} COP | 
            <strong>Tarifa Hora:</strong> $${(v.tarifa_hora || 4500).toLocaleString('es-CO')} COP
          `;
          // Auto-asignar valor mensual si el concepto es MENSUALIDAD
          const concepto = document.getElementById('selectTipoPago').value;
          if (concepto === 'MENSUALIDAD' && v.tarifa_mes) {
            document.getElementById('inputMontoPago').value = v.tarifa_mes;
            document.getElementById('inputDineroRecibido').value = v.tarifa_mes;
          }
        } else {
          banner.innerHTML = `<em>Placa no registrada previamente como mensual. Se registrará como cliente de ocasión.</em>`;
        }
      }
    } catch (e) {
      console.error(e);
    }
  },

  // Procesar registro de pago
  async handleFormRegistrarPago() {
    const tipo_pago = document.getElementById('selectTipoPago').value;
    const placa = (document.getElementById('inputPlacaPago').value || '').trim().toUpperCase();
    const monto = parseFloat(document.getElementById('inputMontoPago').value) || 0;
    const metodo_pago = document.getElementById('selectMetodoPago').value;
    const dinero_recibido = parseFloat(document.getElementById('inputDineroRecibido').value) || monto;
    const referencia_transaccion = document.getElementById('inputReferenciaTransaccion').value || '';
    const operador_caja = document.getElementById('inputOperadorCaja').value;

    if (!placa || monto <= 0) {
      this.showToast('Por favor ingrese la placa y un monto válido', 'warning');
      return;
    }

    if (metodo_pago === 'EFECTIVO' && dinero_recibido < monto) {
      this.showToast('El dinero recibido es menor que el monto a pagar', 'error');
      return;
    }

    try {
      const res = await fetch('/api/pagos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tipo_pago,
          placa,
          monto,
          metodo_pago,
          dinero_recibido,
          referencia_transaccion,
          operador_caja,
          meses_a_pagar: 1
        })
      }).then(r => r.json());

      if (!res.success) {
        this.showToast(res.message, 'error');
        return;
      }

      this.closeModal('modalRegistrarPago');
      this.showToast(res.message, 'success');
      await this.loadAllData();

      // Abrir automáticamente el comprobante digital
      if (res.data && res.data.numero_comprobante) {
        this.verComprobante(res.data.numero_comprobante);
      }
    } catch (err) {
      console.error(err);
      this.showToast('Error de conexión al procesar el pago', 'error');
    }
  },

  // Ver e imprimir Comprobante de Pago
  async verComprobante(identificador) {
    try {
      const res = await fetch(`/api/pagos/comprobante/${identificador}`).then(r => r.json());
      if (!res.success || !res.data) {
        this.showToast('No se encontró el comprobante de pago', 'error');
        return;
      }

      const c = res.data;
      document.getElementById('recNumero').textContent = c.numero_comprobante;
      document.getElementById('recFecha').textContent = c.fecha_hora;
      document.getElementById('recPlaca').textContent = c.placa;
      document.getElementById('recVehiculo').textContent = `${c.tipo_vehiculo || 'Automotor'} - ${c.marca || ''} ${c.modelo || ''}`;
      document.getElementById('recCliente').textContent = (c.nombres && c.apellidos) ? `${c.nombres} ${c.apellidos}` : 'Cliente Ocasional';
      document.getElementById('recDoc').textContent = c.cliente_doc || 'No Registrado';
      document.getElementById('recConcepto').textContent = c.tipo_pago === 'MENSUALIDAD' ? 'Suscripción Mensualidad Parqueadero' : 'Servicio Parqueadero por Horas';
      document.getElementById('recMetodo').textContent = c.metodo_pago.replace('_', ' ');
      document.getElementById('recRef').textContent = c.referencia_transaccion || 'N/A';
      document.getElementById('recTotal').textContent = `$${(c.monto || 0).toLocaleString('es-CO')} COP`;
      document.getElementById('recRecibido').textContent = `$${(c.dinero_recibido || c.monto || 0).toLocaleString('es-CO')} COP`;
      document.getElementById('recCambio').textContent = `$${(c.dinero_cambio || 0).toLocaleString('es-CO')} COP`;
      document.getElementById('recCajero').textContent = c.operador_caja || 'Cajero Principal';

      this.openModal('modalComprobante');
    } catch (err) {
      console.error(err);
      this.showToast('Error al cargar datos del comprobante', 'error');
    }
  },

  // Ver Arqueo y Cuadre de Caja Diario
  async verArqueoCaja() {
    try {
      const res = await fetch('/api/pagos/resumen-caja').then(r => r.json());
      if (!res.success) {
        this.showToast('Error al consultar arqueo de caja', 'error');
        return;
      }

      const d = res.data;
      document.getElementById('arqueoFechaTitulo').textContent = `Corte de Caja: ${d.fecha}`;
      document.getElementById('arqTotalRecaudado').textContent = `$${(d.total_recaudado || 0).toLocaleString('es-CO')} COP`;
      document.getElementById('arqTotalTransacciones').textContent = d.total_transacciones || 0;

      // Métodos
      const tbodyMetodos = document.getElementById('tbodyArqueoMetodos');
      tbodyMetodos.innerHTML = '';
      (d.desglose_metodos || []).forEach(m => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td><strong>${m.metodo_pago.replace('_', ' ')}</strong></td>
          <td>${m.transacciones}</td>
          <td><strong>$${m.subtotal.toLocaleString('es-CO')} COP</strong></td>
        `;
        tbodyMetodos.appendChild(tr);
      });

      // Conceptos
      const tbodyConceptos = document.getElementById('tbodyArqueoConceptos');
      tbodyConceptos.innerHTML = '';
      (d.desglose_conceptos || []).forEach(c => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${c.tipo_pago === 'MENSUALIDAD' ? '🗓️ Mensualidades' : '⏱️ Estadías Ocasionales'}</td>
          <td>${c.transacciones}</td>
          <td><strong>$${c.subtotal.toLocaleString('es-CO')} COP</strong></td>
        `;
        tbodyConceptos.appendChild(tr);
      });

      this.openModal('modalArqueoCaja');
    } catch (err) {
      console.error(err);
      this.showToast('Error al cargar arqueo de caja', 'error');
    }
  },

  // Helpers de modales
  openModal(id) {
    const el = document.getElementById(id);
    if (el) el.classList.add('open');
  },

  closeModal(id) {
    const el = document.getElementById(id);
    if (el) el.classList.remove('open');
  },

  resetFormEntrada() {
    document.getElementById('formEntrada').reset();
    document.getElementById('bannerValidacionPlaca').classList.add('hidden');
    document.getElementById('boxNovedadIngreso').classList.add('hidden');
    this.populateAvailableCells();
  },

  showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    let icon = 'fa-circle-info';
    if (type === 'success') icon = 'fa-circle-check';
    if (type === 'error') icon = 'fa-circle-xmark';
    if (type === 'warning') icon = 'fa-triangle-exclamation';

    toast.innerHTML = `<i class="fa-solid ${icon}"></i> <span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  }
};

// Iniciar al cargar el DOM
document.addEventListener('DOMContentLoaded', () => {
  app.init();
});
