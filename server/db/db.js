import { MongoClient } from 'mongodb';

let db = undefined;
const appDatabaseName = "examination";


export function getDbCollection(name) {
  return fetchDatabase().collection(name);
}

function fetchDatabase() {
  if (db != undefined) {
    return db;
  }

  const url = 'mongodb://127.0.0.1:27017';
  const client = new MongoClient(url);

  db = client.db(appDatabaseName); // Samling av collections (skapas dynamisk, har ej skapats explicit i atlas)

  return db;
}