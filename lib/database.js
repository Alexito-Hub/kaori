const jsonfile = require('jsonfile');
const fs = require('fs');
const util = require('util');
const path = require('path');
const fileExists = util.promisify(fs.exists);


const filePath = path.join(__dirname, '..', 'database', 'db.json');

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

(async () => {
  if (!(await checkFileExists(filePath))) {
      configData()
  }
})();
const database = getDatabase();
console.log('Base de datos actual:', database);

module.exports = { getDatabase, updateDatabase };

updateDatabase(database);
