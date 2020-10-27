const { MongoClient } = require('mongodb');

// Nombre de bd
const dbName = 'Recetaaas';
// Conexión URL (estas corriendo en local)
//const url = 'mongodb://localhost:27017';

const config = require('../config/config');

const client = new MongoClient(config.URL, {
  useUnifiedTopology: true
});

module.exports = async () => {
  // Conectamos al servidor
  await client.connect();

  return client.db(dbName); // retornamos la conexión con el nombre de la bd a usar
};