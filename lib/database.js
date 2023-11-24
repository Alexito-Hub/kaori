const { JSONPreset } = (await import("lowdb/node").default) || {};

;(async () => {
    
    try {
        const { JSONPreset } = await import("lowdb/node").default;
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
    
        module.exports = db, configData;
    } catch (error) {
      console.error(error);
    }
})();
