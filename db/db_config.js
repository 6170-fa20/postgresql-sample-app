require('dotenv').config(); // This allows us to use variables in .env file through process.env
const pgp = require('pg-promise')();
const isProduction = process.env.NODE_ENV === 'production'; // process.env will be used by heroku to provide configs and NODE_ENV will be set to production there.
const localHostConnectionString = `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_DATABASE}`; // Make sure your .env file has all your database information for your localhost.

// name the columns of our tables for localization
const columnNames = {
  userId: "id",
  userName: "name",
  shortName: "short",
  shortCreator: "creator",
  shortURL: "url",
};
Object.freeze(columnNames);

let pgDb;

function createDb() {
  pgDb = pgp(isProduction ? process.env.DATABASE_URL : localHostConnectionString);
  createUserTable()
    .then( () => { // use .then to ensure user table gets created before shorts table since shorts table references user table.
      createShortsTable()
    });
};

function createUserTable() {
  return pgDb.none(`CREATE TABLE IF NOT EXISTS users (
    ${columnNames.userId} SERIAL PRIMARY KEY,
    ${columnNames.userName} TEXT NOT NULL UNIQUE
  )`).then(() => { console.log("Created User table!");});
};

function createShortsTable() {
  return pgDb.none(`CREATE TABLE IF NOT EXISTS shorts (
    ${columnNames.shortName} TEXT PRIMARY KEY,
    ${columnNames.shortURL} TEXT NOT NULL,
    ${columnNames.shortCreator} INTEGER NOT NULL,
    FOREIGN KEY(${columnNames.shortCreator})
    REFERENCES users(${columnNames.userId})
  )`).then(() => { console.log("Created Shorts table!");});
};

// Helper wrapper functions that return promises that resolve when sql queries are complete.
function run(sqlQuery) {
  console.log("db run call", sqlQuery); // Adding this log to help with Heroku debugging if needed.
  return pgDb.none(sqlQuery);
};

function get(sqlQuery) {
  console.log("db get call", sqlQuery); // Adding this log to help with Heroku debugging if needed.
  return pgDb.oneOrNone(sqlQuery);
};

function all(sqlQuery) {
  console.log("db all call", sqlQuery); // Adding this log to help with Heroku debugging if needed.
  return pgDb.any(sqlQuery);
};

createDb();

module.exports = {
  columnNames,
  run,
  get,
  all,
};