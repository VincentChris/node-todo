const homeDir = require("os").homedir();
const home = process.env.HOME || homeDir;
const p = require("path");
const fs = require("fs");
const dbPath = p.join(home, ".todo");

module.exports = {
  readFile(path = dbPath) {
    return new Promise((resolve, reject) => {
      fs.readFile(path, { flag: "a+" }, (err, data) => {
        if (err) return console.log(err);
        let list;
        try {
          list = JSON.parse(data.toString());
        } catch (e) {
          list = [];
        }
        resolve(list);
      });
    });
  },
  writeFile(list, path = dbPath) {
    return new Promise((resolve, reject) => {
      const data = JSON.stringify(list);
      fs.writeFile(path, data + "\n", (err) => {
        if (err) return reject(err);
        resolve();
      });
    });
  },
};
