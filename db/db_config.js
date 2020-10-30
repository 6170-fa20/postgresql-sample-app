require('dotenv').config(); // This allows us to use variables in .env file through process.env
const pgp = require('pg-promise')();
const isProduction = process.env.NODE_ENV === 'production'; // process.env will be used by heroku and NODE_ENV will be set to production there.
const localHostConnectionString = `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_DATABASE}`; // Make sure your .env file has all your database information for your localhost.


let pgDb;

// name the columns of our tables for localization
const columnNames = {
  userId: "id",
  userName: "name",
  shortName: "short",
  shortCreator: "creator",
  shortURL: "url",
};
Object.freeze(columnNames);

function createDb() {
  console.log('about to create');
  pgDb = pgp(isProduction ? process.env.DATABASE_URL : localHostConnectionString);
  console.log('about to create2');
  createUserTable();
  console.log('about to create3');
  createShortsTable();
  console.log('about to create4');
};

function createUserTable() {
  pgDb.none(`CREATE TABLE IF NOT EXISTS users (
    ${columnNames.userId} SERIAL PRIMARY KEY,
    ${columnNames.userName} TEXT NOT NULL UNIQUE
  )`).then(() => { console.log("Created User table!");});
};

function createShortsTable() {
  pgDb.none(`CREATE TABLE IF NOT EXISTS shorts (
    ${columnNames.shortName} TEXT PRIMARY KEY,
    ${columnNames.shortURL} TEXT NOT NULL,
    ${columnNames.shortCreator} INTEGER NOT NULL,
    FOREIGN KEY(${columnNames.shortCreator})
    REFERENCES users(${columnNames.userId})
  )`).then(() => { console.log("Created Shorts table!");});
};

// Helper wrapper functions that return promises that resolve when sql queries are complete.
function run(sqlQuery) {
  return new Promise((resolve, reject) => {
    console.log("here222");
    pgDb.none(sqlQuery)
      .then( () => {
        console.log("run db call:", sqlQuery);
        resolve();
      })
      .catch( () => {
        console.log("run error db call:", sqlQuery);
        reject();
      })
  });
};

function get(sqlQuery) {
  return new Promise((resolve, reject) => {
    pgDb.oneOrNone(sqlQuery)
      .then((rows) => {
        console.log("get db call:", sqlQuery, rows);
        resolve(rows);
      })
      .catch((e) => {
        console.log("here3", e);
        reject();
      })
  });
};

function all(sqlQuery) {
  return new Promise((resolve, reject) => {
    pgDb.any(sqlQuery)
      .then( (rows) => {
        console.log("any db call:", sqlQuery, rows);
        resolve(rows);
      })
      .catch( () => {
        console.log("here3", sqlQuery);
        reject();
      })
  });
};

createDb();

module.exports = {
  columnNames,
  run,
  get,
  all,
};