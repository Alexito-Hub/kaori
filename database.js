import { default as low } from 'lowdb';

const FileSync = require('lowdb/adapters/FileSync');

const adapter = new FileSync('config.json');
const db = low(adapter);

db.defaults({
  prefixes: ["#"],
  owner: ["51968374620"],
  staff: ["13476665855"],
  areCommandsEnabled: true,
  versions: {
    new: [],
    ancient: []
  }
}).write();

module.exports = db
