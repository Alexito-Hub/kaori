const fs = require('fs');
const util = require('util');
const fileExists = util.promisify(fs.exists);


const filePath = './database/db.json';

// Función para inicializar la base de datos si no existe
function configData() {
  const configData = {
    prefix: ['#'],
    owner: [],
    staff: [],
    evaluate: [],
    config: {
        areCommands: true
    }
  };

  jsonfile.writeFileSync(filePath, configData);
}

// Función para obtener todos los datos de la base de datos
function getDatabase() {
  try {
    return jsonfile.readFileSync(filePath);
  } catch (error) {
    console.error('Error al leer la base de datos:', error);
    return null;
  }
}
function updateDatabase(data) {
  try {
    jsonfile.writeFileSync(filePath, data);
    console.log('Base de datos actualizada correctamente.');
  } catch (error) {
    console.error('Error al actualizar la base de datos:', error);
  }
}

async function checkFileExists(filePath) {
  return await fileExists(filePath);
}

if (!(await checkFileExists(filePath))) {
    configData();
}

// Ejemplo de uso de las funciones:
const database = getDatabase();
console.log('Base de datos actual:', database);

// Modificar la base de datos según tus necesidades
// ...

// Actualizar la base de datos
updateDatabase(database);
