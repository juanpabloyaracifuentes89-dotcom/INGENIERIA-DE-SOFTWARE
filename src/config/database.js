// src/config/database.js
const { DatabaseSync } = require('node:sqlite');
const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '..', '..', 'database', 'parqueadero.db');
const schemaPath = path.join(__dirname, '..', '..', 'database', 'schema.sql');
const seedPath = path.join(__dirname, '..', '..', 'database', 'seed.sql');

const isNewDb = !fs.existsSync(dbPath);

const db = new DatabaseSync(dbPath);

// Activar llaves foráneas
db.exec('PRAGMA foreign_keys = ON;');

if (isNewDb) {
  console.log('🔄 Inicializando base de datos nueva...');
  const schemaSql = fs.readFileSync(schemaPath, 'utf8');
  db.exec(schemaSql);

  const seedSql = fs.readFileSync(seedPath, 'utf8');
  db.exec(seedSql);
  console.log('✅ Base de datos "parqueadero.db" inicializada con éxito con tablas y datos semilla.');
} else {
  // Asegurar esquema
  const schemaSql = fs.readFileSync(schemaPath, 'utf8');
  db.exec(schemaSql);
  console.log('✅ Conexión establecida con la base de datos "parqueadero.db".');
}

module.exports = db;
