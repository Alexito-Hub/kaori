try {
    const low = require("lowdb");
    const FileAsync = require("lowdb/adapters/FileAsync");
    const db = low(new FileAsync("db.json"));
    db.defaults({ posts: [], user: {} }).write();
    module.exports = db;
} catch (e) {
    console.log(`Error de database ${e}`)
}