// ES5
const createPool = require("mysql").createPool;
const dotenv = require("dotenv");

// ES6
// import { createPool } from 'mysql';
// import dotenv from "dotenv";

dotenv.config();

const pool = createPool({
  // connectionLimit: 10,
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  timezone: process.env.TZ,
});

// ES5
module.exports = pool;

// ES6
// export default pool;
