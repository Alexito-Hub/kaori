const jsonServer = require('json-server');
const path = require('path');

const server = jsonServer.create();
const router = jsonServer.router(path.join(__dirname, 'database', 'db.json'));
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(router);

const PORT = 3000; // El puerto que deseas usar

server.listen(PORT, () => {
  console.log(`JSON Server está corriendo en http://localhost:${PORT}`);
});
