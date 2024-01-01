const Database = require("better-sqlite3");
const db = new Database("./database/database.db", { verbose: console.log });

db.pragma("journal_mode = WAL");

function createTables() {
  db.prepare(
    "CREATE TABLE IF NOT EXISTS profiles ('id' TEXT PRIMARY KEY,  'bench' INT DEFAULT NONE, 'squat' INT DEFAULT NONE, 'deadlift' INT DEFAULT NONE, 'unit' TEXT DEFAULT 'kg')"
  ).run();

  db.prepare(
    "CREATE TABLE IF NOT EXISTS sessions ('id' TEXT PRIMARY KEY, 'sessions' INT DEFAULT 0, lastSession INT DEFAULT 0, 'chest' INT DEFAULT 0, 'back' INT DEFAULT 0, 'shoulders' INT DEFAULT 0, 'triceps' INT DEFAULT 0, 'biceps' INT DEFAULT 0, 'legs' INT DEFAULT 0, 'core' INT DEFAULT 0, 'cardio' INT DEFAULT 0, 'other' INT DEFAULT 0, 'total' INT DEFAULT 0, 'lastTrained' STRING DEFAULT 'None')"
  ).run();
}

createTables();

/**
 * @returns {Database}
 */
function getDatabase() {
  return db;
}

module.exports.getDatabase = getDatabase;
