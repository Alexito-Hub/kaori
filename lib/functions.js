const { getDatabase, updateDatabase, filePath } = require('./database');

const Json = (string) => JSON.stringify(string, null, 2)

const removeAccents = (str) => str.normalize("NFD").replace(/[\u0300-\u036f]/g, "")

const dbManager = {
  getDatabase: () => {
    return getDatabase();
  },

  updateDatabase: (data) => {
    updateDatabase(data);
  },

  // Función para agregar un valor a una propiedad de tipo array
  add: (propertyPath, value) => {
    const db = getDatabase();
    const property = db[propertyPath];

    if (Array.isArray(property)) {
      property.push(value);
      updateDatabase(db);
      console.log(`Agregado ${value} a ${propertyPath}`);
    } else {
      console.error(`${propertyPath} no es una propiedad de tipo array.`);
    }
  },

  // Función para remover un valor de una propiedad de tipo array
  remove: (propertyPath, value) => {
    const db = getDatabase();
    const property = db[propertyPath];

    if (Array.isArray(property)) {
      const index = property.indexOf(value);
      if (index !== -1) {
        property.splice(index, 1);
        updateDatabase(db);
        console.log(`Removido ${value} de ${propertyPath}`);
      } else {
        console.error(`${value} no encontrado en ${propertyPath}.`);
      }
    } else {
      console.error(`${propertyPath} no es una propiedad de tipo array.`);
    }
  },

  // Función para modificar un valor en una propiedad de tipo array
  modify: (propertyPath, oldValue, newValue) => {
    const db = getDatabase();
    const property = db[propertyPath];

    if (Array.isArray(property)) {
      const index = property.indexOf(oldValue);
      if (index !== -1) {
        property[index] = newValue;
        updateDatabase(db);
        console.log(`Modificado ${oldValue} a ${newValue} en ${propertyPath}`);
      } else {
        console.error(`${oldValue} no encontrado en ${propertyPath}.`);
      }
    } else {
      console.error(`${propertyPath} no es una propiedad de tipo array.`);
    }
  },
  boolean: (propertyPath) => {
    const db = getDatabase();
    const property = db[propertyPath];

    if (typeof property === 'boolean') {
      db[propertyPath] = !property;
      updateDatabase(db);
      console.log(`Cambiado ${propertyPath} a ${!property}`);
    } else {
      console.error(`${propertyPath} no es una propiedad de tipo boolean.`);
    }
  },
};

module.exports = { Json, removeAccents, dbManager }
