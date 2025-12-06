import fs from "fs";
import path from "path";

const dbPath = path.resolve(process.env.DB_FILE || "./db.json");

export function readDB() {
  const raw = fs.readFileSync(dbPath, "utf8");
  return JSON.parse(raw);
}

export function writeDB(data) {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), "utf8");
}
