const jsonfile = require('jsonfile');
const fs = require('fs');
const util = require('util');
const path = require('path');
const fileExists = util.promisify(fs.exists);

const filePath = path.join(__dirname, '..', 'database', 'db.json');

function configData() {
    const configData = {
        config: {
            areCommands: true
    },
    prefix: ['#'],
    owner: ['51968374620'],
    staff: ['13476665855'],
    evaluate: [],
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
console.log('Database funcionando correctamente')

module.exports = { getDatabase, updateDatabase, filePath, configData };

updateDatabase(database);