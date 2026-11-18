// src/controllers/parkingController.js
const db = require('../config/database');

const parkingController = {
  // 1. Obtener todas las celdas y su estado en tiempo real
  getCeldas: (req, res) => {
    try {
      const stmt = db.prepare(`
        SELECT 
          c.codigo,
          c.piso,
          c.estado,
          c.placa_actual,
          tv.id as id_tipo_vehiculo,
          tv.nombre as tipo_vehiculo_nombre,
          tv.icono,
          tv.tarifa_hora,
          v.marca,
          v.modelo,
          v.color,
          ra.id as id_registro_activo,
          ra.fecha_hora_entrada,
          ra.tipo_servicio,
          cl.nombres || ' ' || cl.apellidos as propietario_nombre
        FROM celdas c
        JOIN tipos_vehiculo tv ON c.id_tipo_vehiculo = tv.id
        LEFT JOIN vehiculos v ON c.placa_actual = v.placa
        LEFT JOIN clientes cl ON v.id_cliente = cl.id
        LEFT JOIN registros_acceso ra ON c.codigo = ra.codigo_celda AND ra.estado = 'ACTIVO'
        ORDER BY c.piso ASC, c.codigo ASC
      `);
      const celdas = stmt.all();
      return res.json({ success: true, data: celdas });
    } catch (error) {
      console.error('Error al obtener celdas:', error);
      return res.status(500).json({ success: false, message: 'Error interno al consultar celdas', error: error.message });
    }
  },

  // 2. Validar vehículo y mensualidad por placa
  validarVehiculo: (req, res) => {
    try {
      const placa = (req.params.placa || '').toUpperCase().trim();
      if (!placa) {
        return res.status(400).json({ success: false, message: 'Placa no proporcionada' });
      }

      // Validar si ya está dentro
      const stmtActivo = db.prepare(`
        SELECT ra.*, c.codigo as celda
        FROM registros_acceso ra
        JOIN celdas c ON ra.codigo_celda = c.codigo
        WHERE ra.placa = ? AND ra.estado = 'ACTIVO'
      `);
      const registroActivo = stmtActivo.get(placa);

      // Consultar vehículo y cliente
      const stmtVehiculo = db.prepare(`
        SELECT v.*, tv.nombre as tipo_nombre, tv.tarifa_hora, tv.tarifa_mes,
               c.id as cliente_id, c.documento as cliente_doc, c.nombres as cliente_nombres, 
               c.apellidos as cliente_apellidos, c.telefono as cliente_telefono
        FROM vehiculos v
        JOIN tipos_vehiculo tv ON v.id_tipo_vehiculo = tv.id
        LEFT JOIN clientes c ON v.id_cliente = c.id
        WHERE v.placa = ?
      `);
      const vehiculo = stmtVehiculo.get(placa);

      // Validar mensualidad vigente
      const stmtMensualidad = db.prepare(`
        SELECT *
        FROM mensualidades
        WHERE placa = ? AND estado = 'VIGENTE' AND date('now') BETWEEN fecha_inicio AND fecha_fin
        ORDER BY fecha_fin DESC
        LIMIT 1
      `);
      const mensualidadVigente = stmtMensualidad.get(placa);

      return res.json({
        success: true,
        data: {
          placa,
          estaDentro: !!registroActivo,
          registroActivo: registroActivo || null,
          vehiculoRegistrado: vehiculo || null,
          tieneMensualidadVigente: !!mensualidadVigente,
          mensualidad: mensualidadVigente || null,
          tipoServicioSugerido: mensualidadVigente ? 'MENSUALIDAD' : 'OCASIONAL'
        }
      });
    } catch (error) {
      console.error('Error al validar vehículo:', error);
      return res.status(500).json({ success: false, message: 'Error al consultar vehículo', error: error.message });
    }
  },

  // 3. Registrar Entrada de Vehículo
  registrarEntrada: (req, res) => {
    try {
      let { placa, id_tipo_vehiculo, codigo_celda, observaciones, novedad, marca, modelo, color, operador } = req.body;
      
      placa = (placa || '').toUpperCase().trim();
      codigo_celda = (codigo_celda || '').toUpperCase().trim();
      operador = operador || 'Operador de Patio';

      if (!placa || !codigo_celda) {
        return res.status(400).json({ success: false, message: 'La placa y la celda son campos obligatorios.' });
      }

      // Validar si el vehículo ya se encuentra dentro
      const stmtActivo = db.prepare(`SELECT id, codigo_celda FROM registros_acceso WHERE placa = ? AND estado = 'ACTIVO'`);
      const dentro = stmtActivo.get(placa);
      if (dentro) {
        return res.status(400).json({ 
          success: false, 
          message: `El vehículo con placa ${placa} ya se encuentra dentro del parqueadero en la celda ${dentro.codigo_celda}.` 
        });
      }

      // Validar disponibilidad de la celda
      const stmtCelda = db.prepare(`SELECT * FROM celdas WHERE codigo = ?`);
      const celda = stmtCelda.get(codigo_celda);
      if (!celda) {
        return res.status(404).json({ success: false, message: `La celda ${codigo_celda} no existe en el sistema.` });
      }
      if (celda.estado !== 'DISPONIBLE') {
        return res.status(400).json({ 
          success: false, 
          message: `La celda ${codigo_celda} no está disponible (Estado actual: ${celda.estado}).` 
        });
      }

      // Validar si el vehículo ya está registrado en la tabla de vehículos
      const stmtVehiculo = db.prepare(`SELECT * FROM vehiculos WHERE placa = ?`);
      let vehiculoExistente = stmtVehiculo.get(placa);

      if (!vehiculoExistente) {
        // Registrar vehículo si es la primera vez que ingresa
        const tipoId = id_tipo_vehiculo || celda.id_tipo_vehiculo;
        const insertVehiculo = db.prepare(`
          INSERT INTO vehiculos (placa, id_tipo_vehiculo, marca, modelo, color)
          VALUES (?, ?, ?, ?, ?)
        `);
        insertVehiculo.run(placa, tipoId, marca || 'Sin especificar', modelo || 'N/A', color || 'N/A');
      }

      // Validar si tiene mensualidad vigente
      const stmtMensualidad = db.prepare(`
        SELECT * FROM mensualidades 
        WHERE placa = ? AND estado = 'VIGENTE' AND date('now') BETWEEN fecha_inicio AND fecha_fin
      `);
      const mensualidad = stmtMensualidad.get(placa);
      const tipoServicio = mensualidad ? 'MENSUALIDAD' : 'OCASIONAL';

      // Insertar Registro de Acceso
      const insertAcceso = db.prepare(`
        INSERT INTO registros_acceso (
          placa, codigo_celda, fecha_hora_entrada, tipo_servicio, estado, observaciones_ingreso, operador_entrada
        ) VALUES (?, ?, datetime('now', 'localtime'), ?, 'ACTIVO', ?, ?)
      `);
      const infoAcceso = insertAcceso.run(placa, codigo_celda, tipoServicio, observaciones || '', operador);
      const idRegistro = infoAcceso.lastInsertRowid;

      // Actualizar Celda a OCUPADA
      const updateCelda = db.prepare(`UPDATE celdas SET estado = 'OCUPADA', placa_actual = ? WHERE codigo = ?`);
      updateCelda.run(placa, codigo_celda);

      // Si se reportó una novedad en la entrada
      if (novedad && novedad.descripcion) {
        const insertNovedad = db.prepare(`
          INSERT INTO novedades (id_registro_acceso, placa, fecha_hora, tipo_novedad, nivel_gravedad, descripcion, ubicacion_en_vehiculo)
          VALUES (?, ?, datetime('now', 'localtime'), ?, ?, ?, ?)
        `);
        insertNovedad.run(
          idRegistro,
          placa,
          novedad.tipo || 'GOLPE',
          novedad.gravedad || 'LEVE',
          novedad.descripcion,
          novedad.ubicacion || 'General'
        );
      }

      // Consultar registro completo generado para respuesta
      const registroCreado = db.prepare(`
        SELECT ra.*, c.piso, tv.nombre as tipo_vehiculo
        FROM registros_acceso ra
        JOIN celdas c ON ra.codigo_celda = c.codigo
        JOIN vehiculos v ON ra.placa = v.placa
        JOIN tipos_vehiculo tv ON v.id_tipo_vehiculo = tv.id
        WHERE ra.id = ?
      `).get(idRegistro);

      return res.status(201).json({
        success: true,
        message: `Entrada registrada exitosamente para el vehículo ${placa} en celda ${codigo_celda}.`,
        data: registroCreado
      });
    } catch (error) {
      console.error('Error al registrar entrada:', error);
      return res.status(500).json({ success: false, message: 'Error interno al registrar entrada', error: error.message });
    }
  },

  // 4. Registrar Salida de Vehículo y Cálculo de Cobro
  registrarSalida: (req, res) => {
    try {
      let { placa, codigo_celda, operador } = req.body;
      operador = operador || 'Operador de Patio';

      let stmtRegistro;
      let registroActivo;

      if (placa) {
        placa = placa.toUpperCase().trim();
        stmtRegistro = db.prepare(`
          SELECT ra.*, v.id_tipo_vehiculo, tv.nombre as tipo_vehiculo, tv.tarifa_hora, tv.tarifa_dia
          FROM registros_acceso ra
          JOIN vehiculos v ON ra.placa = v.placa
          JOIN tipos_vehiculo tv ON v.id_tipo_vehiculo = tv.id
          WHERE ra.placa = ? AND ra.estado = 'ACTIVO'
        `);
        registroActivo = stmtRegistro.get(placa);
      } else if (codigo_celda) {
        codigo_celda = codigo_celda.toUpperCase().trim();
        stmtRegistro = db.prepare(`
          SELECT ra.*, v.id_tipo_vehiculo, tv.nombre as tipo_vehiculo, tv.tarifa_hora, tv.tarifa_dia
          FROM registros_acceso ra
          JOIN vehiculos v ON ra.placa = v.placa
          JOIN tipos_vehiculo tv ON v.id_tipo_vehiculo = tv.id
          WHERE ra.codigo_celda = ? AND ra.estado = 'ACTIVO'
        `);
        registroActivo = stmtRegistro.get(codigo_celda);
      }

      if (!registroActivo) {
        return res.status(404).json({
          success: false,
          message: 'No se encontró ningún vehículo activo dentro del parqueadero con los datos proporcionados.'
        });
      }

      // Calcular tiempo transcurrido
      const entradaTime = new Date(registroActivo.fecha_hora_entrada.replace(' ', 'T'));
      const salidaTime = new Date();
      const diffMs = Math.max(0, salidaTime - entradaTime);
      const minutosTranscurridos = Math.ceil(diffMs / (1000 * 60));
      const horasFraccion = Math.ceil(minutosTranscurridos / 60) || 1;

      let totalPagar = 0;
      let detalleCobro = '';

      if (registroActivo.tipo_servicio === 'MENSUALIDAD') {
        totalPagar = 0.0;
        detalleCobro = 'Cubierto por Contrato de Mensualidad Vigente ($0 COP)';
      } else {
        // Cobro por hora / fracción
        totalPagar = horasFraccion * (registroActivo.tarifa_hora || 4500);
        detalleCobro = `${horasFraccion} hora(s) transcurridas a $${registroActivo.tarifa_hora} COP/hora`;
      }

      // Actualizar registro de acceso
      const updateAcceso = db.prepare(`
        UPDATE registros_acceso
        SET fecha_hora_salida = datetime('now', 'localtime'),
            minutos_transcurridos = ?,
            total_pagar = ?,
            estado = 'FINALIZADO',
            operador_salida = ?
        WHERE id = ?
      `);
      updateAcceso.run(minutosTranscurridos, totalPagar, operador, registroActivo.id);

      // Liberar Celda
      const updateCelda = db.prepare(`
        UPDATE celdas
        SET estado = 'DISPONIBLE', placa_actual = NULL
        WHERE codigo = ?
      `);
      updateCelda.run(registroActivo.codigo_celda);

      // Si hubo cobro (vehículo ocasional), registrar automáticamente la transacción en la tabla pagos (Iteración 3)
      let comprobanteGenerado = null;
      if (totalPagar > 0) {
        const countRow = db.prepare('SELECT COUNT(*) as total FROM pagos').get();
        const consecutivo = ((countRow ? countRow.total : 0) + 1).toString().padStart(4, '0');
        comprobanteGenerado = `REC-2026-${consecutivo}`;

        db.prepare(`
          INSERT INTO pagos (
            numero_comprobante, tipo_pago, id_registro_acceso, id_mensualidad,
            placa, monto, metodo_pago, dinero_recibido, dinero_cambio,
            referencia_transaccion, operador_caja, fecha_hora, estado
          )
          VALUES (?, 'TIEMPO_OCASIONAL', ?, NULL, ?, ?, 'EFECTIVO', ?, 0, 'COBRO-SALIDA', ?, datetime('now', 'localtime'), 'APROBADO')
        `).run(comprobanteGenerado, registroActivo.id, registroActivo.placa, totalPagar, totalPagar, operador);
      }

      // Consultar registro actualizado
      const ticketSalida = {
        id_registro: registroActivo.id,
        placa: registroActivo.placa,
        codigo_celda: registroActivo.codigo_celda,
        tipo_vehiculo: registroActivo.tipo_vehiculo,
        tipo_servicio: registroActivo.tipo_servicio,
        fecha_hora_entrada: registroActivo.fecha_hora_entrada,
        fecha_hora_salida: new Date().toLocaleString('es-CO'),
        minutos_transcurridos: minutosTranscurridos,
        horas_cobradas: horasFraccion,
        total_pagar: totalPagar,
        detalle_cobro: detalleCobro,
        operador_salida: operador,
        numero_comprobante: comprobanteGenerado
      };

      return res.json({
        success: true,
        message: `Salida completada exitosamente para la placa ${registroActivo.placa}. Celda ${registroActivo.codigo_celda} liberada.`,
        data: ticketSalida
      });
    } catch (error) {
      console.error('Error al registrar salida:', error);
      return res.status(500).json({ success: false, message: 'Error interno al registrar salida', error: error.message });
    }
  },

  // 5. Novedades del parqueadero
  getNovedades: (req, res) => {
    try {
      const stmt = db.prepare(`
        SELECT n.*, ra.codigo_celda, ra.tipo_servicio, ra.fecha_hora_entrada
        FROM novedades n
        JOIN registros_acceso ra ON n.id_registro_acceso = ra.id
        ORDER BY n.fecha_hora DESC
      `);
      const novedades = stmt.all();
      return res.json({ success: true, data: novedades });
    } catch (error) {
      return res.status(500).json({ success: false, message: 'Error al consultar novedades', error: error.message });
    }
  },

  // Registrar novedad independiente
  registrarNovedad: (req, res) => {
    try {
      let { placa, tipo_novedad, nivel_gravedad, descripcion, ubicacion } = req.body;
      placa = (placa || '').toUpperCase().trim();

      const stmtActivo = db.prepare(`SELECT id FROM registros_acceso WHERE placa = ? AND estado = 'ACTIVO'`);
      const activo = stmtActivo.get(placa);
      if (!activo) {
        return res.status(400).json({ success: false, message: `El vehículo ${placa} no tiene un registro de acceso activo actualmente.` });
      }

      const insertNovedad = db.prepare(`
        INSERT INTO novedades (id_registro_acceso, placa, fecha_hora, tipo_novedad, nivel_gravedad, descripcion, ubicacion_en_vehiculo)
        VALUES (?, ?, datetime('now', 'localtime'), ?, ?, ?, ?)
      `);
      insertNovedad.run(activo.id, placa, tipo_novedad || 'OTRO', nivel_gravedad || 'LEVE', descripcion, ubicacion || 'General');

      return res.json({ success: true, message: 'Novedad registrada con éxito.' });
    } catch (error) {
      return res.status(500).json({ success: false, message: 'Error al registrar novedad', error: error.message });
    }
  },

  // 6. Mensualidades y Clientes
  getMensualidades: (req, res) => {
    try {
      const stmt = db.prepare(`
        SELECT 
          m.*,
          c.documento as cliente_documento,
          c.nombres || ' ' || c.apellidos as cliente_nombre_completo,
          c.telefono,
          c.email,
          v.marca,
          v.modelo,
          v.color,
          tv.nombre as tipo_vehiculo
        FROM mensualidades m
        JOIN clientes c ON m.id_cliente = c.id
        JOIN vehiculos v ON m.placa = v.placa
        JOIN tipos_vehiculo tv ON v.id_tipo_vehiculo = tv.id
        ORDER BY m.fecha_fin DESC
      `);
      const mensualidades = stmt.all();
      return res.json({ success: true, data: mensualidades });
    } catch (error) {
      return res.status(500).json({ success: false, message: 'Error al consultar mensualidades', error: error.message });
    }
  },

  // 7. Estadísticas de Patio en Vivo
  getStats: (req, res) => {
    try {
      const totalCeldas = db.prepare(`SELECT COUNT(*) as count FROM celdas`).get().count;
      const celdasOcupadas = db.prepare(`SELECT COUNT(*) as count FROM celdas WHERE estado = 'OCUPADA'`).get().count;
      const celdasDisponibles = db.prepare(`SELECT COUNT(*) as count FROM celdas WHERE estado = 'DISPONIBLE'`).get().count;
      const celdasMantenimiento = db.prepare(`SELECT COUNT(*) as count FROM celdas WHERE estado = 'MANTENIMIENTO'`).get().count;

      const activosMensualidad = db.prepare(`
        SELECT COUNT(*) as count FROM registros_acceso WHERE estado = 'ACTIVO' AND tipo_servicio = 'MENSUALIDAD'
      `).get().count;

      const activosOcasional = db.prepare(`
        SELECT COUNT(*) as count FROM registros_acceso WHERE estado = 'ACTIVO' AND tipo_servicio = 'OCASIONAL'
      `).get().count;

      const totalNovedades = db.prepare(`SELECT COUNT(*) as count FROM novedades`).get().count;

      return res.json({
        success: true,
        data: {
          totalCeldas,
          celdasOcupadas,
          celdasDisponibles,
          celdasMantenimiento,
          activosMensualidad,
          activosOcasional,
          totalVehiculosAdentro: celdasOcupadas,
          totalNovedades,
          porcentajeOcupacion: Math.round((celdasOcupadas / (totalCeldas || 1)) * 100)
        }
      });
    } catch (error) {
      return res.status(500).json({ success: false, message: 'Error al obtener estadísticas', error: error.message });
    }
  },

  // =========================================================================
  // ITERACIÓN 2: MÓDULOS DE ADMINISTRACIÓN DE USUARIOS Y GESTIÓN DE CELDAS
  // =========================================================================

  // 8. Registrar Nuevo Cliente con Vehículo (HU-05 y HU-06)
  registrarCliente: (req, res) => {
    try {
      let { documento, nombres, apellidos, telefono, email, placa, id_tipo_vehiculo, marca, modelo, color } = req.body;
      
      documento = (documento || '').trim();
      nombres = (nombres || '').trim();
      apellidos = (apellidos || '').trim();
      placa = (placa || '').toUpperCase().trim();

      if (!documento || !nombres || !apellidos || !telefono) {
        return res.status(400).json({ success: false, message: 'Documento, nombres, apellidos y teléfono son obligatorios.' });
      }

      // Validar si el cliente ya existe
      const clienteExistente = db.prepare('SELECT id FROM clientes WHERE documento = ?').get(documento);
      if (clienteExistente) {
        return res.status(400).json({ success: false, message: `El cliente con documento ${documento} ya se encuentra registrado.` });
      }

      // Insertar Cliente
      const insertCliente = db.prepare(`
        INSERT INTO clientes (documento, nombres, apellidos, telefono, email, estado)
        VALUES (?, ?, ?, ?, ?, 'ACTIVO')
      `);
      const infoCliente = insertCliente.run(documento, nombres, apellidos, telefono, email || '');
      const idCliente = infoCliente.lastInsertRowid;

      // Si se proporcionó una placa para asociar vehículo
      if (placa) {
        const vehiculoExistente = db.prepare('SELECT placa FROM vehiculos WHERE placa = ?').get(placa);
        if (vehiculoExistente) {
          db.prepare('UPDATE vehiculos SET id_cliente = ? WHERE placa = ?').run(idCliente, placa);
        } else {
          db.prepare(`
            INSERT INTO vehiculos (placa, id_tipo_vehiculo, marca, modelo, color, id_cliente)
            VALUES (?, ?, ?, ?, ?, ?)
          `).run(placa, id_tipo_vehiculo || 1, marca || 'Genérico', modelo || 'N/A', color || 'N/A', idCliente);
        }

        // Crear mensualidad de cortesía de 30 días para pruebas
        db.prepare(`
          INSERT INTO mensualidades (id_cliente, placa, fecha_inicio, fecha_fin, valor_pagado, estado)
          VALUES (?, ?, date('now'), date('now', '+30 days'), 180000, 'VIGENTE')
        `).run(idCliente, placa);
      }

      return res.status(201).json({
        success: true,
        message: `Cliente ${nombres} ${apellidos} registrado exitosamente${placa ? ` con vehículo ${placa}` : ''}.`
      });
    } catch (error) {
      console.error('Error al registrar cliente:', error);
      return res.status(500).json({ success: false, message: 'Error interno al registrar cliente', error: error.message });
    }
  },

  // 9. Crear Nueva Celda (HU-07)
  crearCelda: (req, res) => {
    try {
      let { codigo, id_tipo_vehiculo, piso } = req.body;
      codigo = (codigo || '').toUpperCase().trim();
      piso = parseInt(piso) || 1;
      id_tipo_vehiculo = parseInt(id_tipo_vehiculo) || 1;

      if (!codigo) {
        return res.status(400).json({ success: false, message: 'El código de la celda es obligatorio.' });
      }

      const celdaExistente = db.prepare('SELECT codigo FROM celdas WHERE codigo = ?').get(codigo);
      if (celdaExistente) {
        return res.status(400).json({ success: false, message: `La celda ${codigo} ya existe en el parqueadero.` });
      }

      db.prepare(`
        INSERT INTO celdas (codigo, id_tipo_vehiculo, piso, estado, placa_actual)
        VALUES (?, ?, ?, 'DISPONIBLE', NULL)
      `).run(codigo, id_tipo_vehiculo, piso);

      return res.status(201).json({
        success: true,
        message: `Celda ${codigo} (Piso ${piso}) creada exitosamente en estado DISPONIBLE.`
      });
    } catch (error) {
      console.error('Error al crear celda:', error);
      return res.status(500).json({ success: false, message: 'Error interno al crear celda', error: error.message });
    }
  },

  // 10. Cambiar Estado de Celda / Inhabilitar por Mantenimiento (HU-08)
  cambiarEstadoCelda: (req, res) => {
    try {
      const codigo = (req.params.codigo || '').toUpperCase().trim();
      const { nuevo_estado } = req.body;

      if (!['DISPONIBLE', 'MANTENIMIENTO'].includes(nuevo_estado)) {
        return res.status(400).json({ success: false, message: 'Estado inválido. Solo se permite DISPONIBLE o MANTENIMIENTO.' });
      }

      const celda = db.prepare('SELECT * FROM celdas WHERE codigo = ?').get(codigo);
      if (!celda) {
        return res.status(404).json({ success: false, message: `La celda ${codigo} no existe.` });
      }

      if (celda.estado === 'OCUPADA' && nuevo_estado === 'MANTENIMIENTO') {
        return res.status(400).json({
          success: false,
          message: `No se puede poner en mantenimiento la celda ${codigo} porque tiene el vehículo ${celda.placa_actual} adentro.`
        });
      }

      db.prepare('UPDATE celdas SET estado = ? WHERE codigo = ?').run(nuevo_estado, codigo);

      return res.json({
        success: true,
        message: `La celda ${codigo} cambió de estado a ${nuevo_estado} exitosamente.`
      });
    } catch (error) {
      console.error('Error al cambiar estado de celda:', error);
      return res.status(500).json({ success: false, message: 'Error interno al actualizar celda', error: error.message });
    }
  },

  // ============================================================================
  // ITERACIÓN 3: MÓDULO DE GESTIÓN DE PAGOS Y FACTURACIÓN
  // ============================================================================

  // 11. Registrar Pago (Mensualidad o Tiempo Ocasional)
  registrarPago: (req, res) => {
    try {
      let {
        tipo_pago,              // 'MENSUALIDAD' o 'TIEMPO_OCASIONAL'
        placa,
        id_cliente,
        id_registro_acceso,
        id_mensualidad,
        monto,
        metodo_pago,            // 'EFECTIVO', 'TARJETA_DEBITO', 'TARJETA_CREDITO', 'TRANSFERENCIA'
        dinero_recibido,
        referencia_transaccion,
        operador_caja,
        meses_a_pagar
      } = req.body;

      placa = (placa || '').toUpperCase().trim();
      metodo_pago = (metodo_pago || 'EFECTIVO').toUpperCase();
      monto = parseFloat(monto) || 0;
      dinero_recibido = parseFloat(dinero_recibido) || monto;
      operador_caja = operador_caja || 'Cajero Principal';
      tipo_pago = (tipo_pago || 'MENSUALIDAD').toUpperCase();

      if (!placa) {
        return res.status(400).json({ success: false, message: 'La placa del vehículo es obligatoria.' });
      }

      if (monto <= 0) {
        return res.status(400).json({ success: false, message: 'El monto a pagar debe ser mayor a 0.' });
      }

      if (metodo_pago === 'EFECTIVO' && dinero_recibido < monto) {
        return res.status(400).json({
          success: false,
          message: `El dinero recibido ($${dinero_recibido.toLocaleString('es-CO')}) es menor al valor a pagar ($${monto.toLocaleString('es-CO')}).`
        });
      }

      const dinero_cambio = metodo_pago === 'EFECTIVO' ? Math.max(0, dinero_recibido - monto) : 0;
      const refFinal = referencia_transaccion || (metodo_pago === 'EFECTIVO' ? 'EFECTIVO' : `AUTO-${Date.now().toString().slice(-6)}`);

      // Generar consecutivo de comprobante: REC-2026-000X
      const countRow = db.prepare('SELECT COUNT(*) as total FROM pagos').get();
      const consecutivo = ((countRow ? countRow.total : 0) + 1).toString().padStart(4, '0');
      const numero_comprobante = `REC-2026-${consecutivo}`;

      let nuevoIdMensualidad = id_mensualidad || null;

      // Si es pago de mensualidad, renovar o crear la mensualidad en la base de datos
      if (tipo_pago === 'MENSUALIDAD') {
        const meses = parseInt(meses_a_pagar) || 1;
        const dias = meses * 30;

        // Buscar cliente si no vino id_cliente
        if (!id_cliente) {
          const vehiculoRow = db.prepare('SELECT id_cliente FROM vehiculos WHERE placa = ?').get(placa);
          if (vehiculoRow && vehiculoRow.id_cliente) {
            id_cliente = vehiculoRow.id_cliente;
          }
        }

        if (id_cliente) {
          // Revisar si ya tiene mensualidad vigente para extenderla, o iniciar desde hoy
          const ultimaMensualidad = db.prepare(`
            SELECT fecha_fin FROM mensualidades
            WHERE placa = ? AND estado = 'VIGENTE' AND fecha_fin >= date('now')
            ORDER BY fecha_fin DESC LIMIT 1
          `).get(placa);

          let fechaInicioStr = "date('now')";
          let fechaFinStr = `date('now', '+${dias} days')`;

          if (ultimaMensualidad && ultimaMensualidad.fecha_fin) {
            fechaInicioStr = `'${ultimaMensualidad.fecha_fin}'`;
            fechaFinStr = `date('${ultimaMensualidad.fecha_fin}', '+${dias} days')`;
          }

          const insertMensualidad = db.prepare(`
            INSERT INTO mensualidades (id_cliente, placa, fecha_inicio, fecha_fin, valor_pagado, estado)
            VALUES (?, ?, ${fechaInicioStr}, ${fechaFinStr}, ?, 'VIGENTE')
          `);
          const resM = insertMensualidad.run(id_cliente, placa, monto);
          nuevoIdMensualidad = Number(resM.lastInsertRowid);
        }
      }

      // Insertar en tabla pagos
      const insertPago = db.prepare(`
        INSERT INTO pagos (
          numero_comprobante, tipo_pago, id_registro_acceso, id_mensualidad,
          placa, monto, metodo_pago, dinero_recibido, dinero_cambio,
          referencia_transaccion, operador_caja, fecha_hora, estado
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now', 'localtime'), 'APROBADO')
      `);

      const resPago = insertPago.run(
        numero_comprobante,
        tipo_pago,
        id_registro_acceso || null,
        nuevoIdMensualidad,
        placa,
        monto,
        metodo_pago,
        dinero_recibido,
        dinero_cambio,
        refFinal,
        operador_caja
      );

      const idPagoCreado = Number(resPago.lastInsertRowid);

      // Consultar detalle completo del pago creado
      const pagoCreado = db.prepare(`
        SELECT p.*, v.marca, v.modelo, tv.nombre as tipo_vehiculo,
               cl.documento as cliente_doc, cl.nombres as cliente_nombres, cl.apellidos as cliente_apellidos,
               cl.telefono as cliente_telefono
        FROM pagos p
        LEFT JOIN vehiculos v ON p.placa = v.placa
        LEFT JOIN tipos_vehiculo tv ON v.id_tipo_vehiculo = tv.id
        LEFT JOIN clientes cl ON v.id_cliente = cl.id
        WHERE p.id = ?
      `).get(idPagoCreado);

      return res.status(201).json({
        success: true,
        message: `Pago registrado con éxito. Comprobante N° ${numero_comprobante}`,
        data: pagoCreado
      });
    } catch (error) {
      console.error('Error al registrar pago:', error);
      return res.status(500).json({ success: false, message: 'Error interno al registrar pago', error: error.message });
    }
  },

  // 12. Obtener Historial de Pagos
  getPagos: (req, res) => {
    try {
      const { tipo, metodo, fecha } = req.query;
      let query = `
        SELECT p.*, 
               v.marca, v.modelo, tv.nombre as tipo_vehiculo,
               cl.documento as cliente_doc, cl.nombres || ' ' || cl.apellidos as cliente_nombre
        FROM pagos p
        LEFT JOIN vehiculos v ON p.placa = v.placa
        LEFT JOIN tipos_vehiculo tv ON v.id_tipo_vehiculo = tv.id
        LEFT JOIN clientes cl ON v.id_cliente = cl.id
        WHERE 1=1
      `;
      const params = [];

      if (tipo) {
        query += ` AND p.tipo_pago = ?`;
        params.push(tipo.toUpperCase());
      }
      if (metodo) {
        query += ` AND p.metodo_pago = ?`;
        params.push(metodo.toUpperCase());
      }
      if (fecha) {
        query += ` AND date(p.fecha_hora) = date(?)`;
        params.push(fecha);
      }

      query += ` ORDER BY p.id DESC`;

      const stmt = db.prepare(query);
      const pagos = stmt.all(...params);

      return res.json({ success: true, data: pagos });
    } catch (error) {
      console.error('Error al consultar pagos:', error);
      return res.status(500).json({ success: false, message: 'Error interno al consultar historial de pagos', error: error.message });
    }
  },

  // 13. Obtener Comprobante Individual
  getComprobantePago: (req, res) => {
    try {
      const id = req.params.id;
      const stmt = db.prepare(`
        SELECT p.*, 
               v.marca, v.modelo, v.color, tv.nombre as tipo_vehiculo,
               cl.documento as cliente_doc, cl.nombres, cl.apellidos, cl.telefono, cl.email,
               m.fecha_inicio as mensualidad_inicio, m.fecha_fin as mensualidad_fin
        FROM pagos p
        LEFT JOIN vehiculos v ON p.placa = v.placa
        LEFT JOIN tipos_vehiculo tv ON v.id_tipo_vehiculo = tv.id
        LEFT JOIN clientes cl ON v.id_cliente = cl.id
        LEFT JOIN mensualidades m ON p.id_mensualidad = m.id
        WHERE p.id = ? OR p.numero_comprobante = ?
      `);
      const comprobante = stmt.get(id, id);

      if (!comprobante) {
        return res.status(404).json({ success: false, message: 'Comprobante no encontrado' });
      }

      return res.json({ success: true, data: comprobante });
    } catch (error) {
      console.error('Error al consultar comprobante:', error);
      return res.status(500).json({ success: false, message: 'Error al consultar comprobante', error: error.message });
    }
  },

  // 14. Resumen y Cuadre de Caja (Arqueo Diario)
  getResumenCaja: (req, res) => {
    try {
      const fecha = req.query.fecha || new Date().toISOString().split('T')[0];

      // Totales del día
      const totalGeneral = db.prepare(`
        SELECT 
          COUNT(*) as cantidad_transacciones,
          COALESCE(SUM(monto), 0) as total_recaudado
        FROM pagos
        WHERE date(fecha_hora) = date(?) AND estado = 'APROBADO'
      `).get(fecha);

      // Desglose por método de pago
      const porMetodo = db.prepare(`
        SELECT 
          metodo_pago,
          COUNT(*) as transacciones,
          COALESCE(SUM(monto), 0) as subtotal
        FROM pagos
        WHERE date(fecha_hora) = date(?) AND estado = 'APROBADO'
        GROUP BY metodo_pago
      `).all(fecha);

      // Desglose por concepto
      const porConcepto = db.prepare(`
        SELECT 
          tipo_pago,
          COUNT(*) as transacciones,
          COALESCE(SUM(monto), 0) as subtotal
        FROM pagos
        WHERE date(fecha_hora) = date(?) AND estado = 'APROBADO'
        GROUP BY tipo_pago
      `).all(fecha);

      return res.json({
        success: true,
        data: {
          fecha,
          total_transacciones: totalGeneral.cantidad_transacciones,
          total_recaudado: totalGeneral.total_recaudado,
          desglose_metodos: porMetodo,
          desglose_conceptos: porConcepto
        }
      });
    } catch (error) {
      console.error('Error en arqueo de caja:', error);
      return res.status(500).json({ success: false, message: 'Error al calcular arqueo de caja', error: error.message });
    }
  }
};

module.exports = parkingController;
