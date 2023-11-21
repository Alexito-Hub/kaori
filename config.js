const db = require('./database');

global.prefix = db.get('prefixes').value();
global.owner = db.get('owner').value();
global.staff = db.get('staff').value();