;(async () => {
  try {
    const JSONPreset = await import("lowdb/node");
    const fs = require("fs");
    const path = require("path");

    const configData = {
      config: {
        prefixes: ["#"],
        owner: ["51968374620"],
        staff: [],
      },
    };

    const dbPath = path.resolve(__dirname, "db.json");
    if (!fs.existsSync(dbPath)) {
      fs.writeFileSync(dbPath, JSON.stringify(configData));
    }
    const db = await JSONPreset(dbPath);
    db.defaults(configData).write();

    module.exports = db;
  } catch (error) {
    console.error(error);
  }
})();
