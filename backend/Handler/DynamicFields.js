// databaseUtils.js
const pool = require("./../Database.js");

async function fetchRecords(
  tableName,
  columns,
  filter = "",
  orderBy = "",
  limit = null
) {
  const selectColumns = columns || "*";
  const whereClause = filter ? `WHERE ${filter}` : "";
  const orderByClause = orderBy ? `ORDER BY ${orderBy}` : "";
  const limitClause = limit ? `LIMIT ${limit}` : "";

  const query = `SELECT ${selectColumns} FROM ${tableName} ${whereClause} ${orderByClause} ${limitClause}`;
  return queryDatabase(query);
}

async function addRecord(tableName, data) {
  const keys = Object.keys(data);
  const values = Object.values(data);

  const insertColumns = keys.join(", ");
  const valuePlaceholders = values.map(() => "?").join(", ");
  const query = `INSERT INTO ${tableName} (${insertColumns}) VALUES (${valuePlaceholders})`;

  return queryDatabase(query, values);
}

async function editRecord(tableName, data, id) {
  const keys = Object.keys(data);
  const values = Object.values(data);

  const updateSet = keys.map((key) => `${key} = ?`).join(", ");
  const query = `UPDATE ${tableName} SET ${updateSet} WHERE id = ?`;

  values.push(id); // Append the ID value for the WHERE clause

  return queryDatabase(query, values);
}

async function deleteRecord(tableName, id) {
  const query = `DELETE FROM ${tableName} WHERE id = ?`;
  return queryDatabase(query, [id]);
}

async function queryDatabase(sql, values = []) {
  return new Promise((resolve, reject) => {
    pool.getConnection((error, connection) => {
      if (error) {
        reject(error);
      } else {
        connection.query(sql, values, (queryError, result) => {
          connection.release();
          if (queryError) {
            reject(queryError);
          } else {
            resolve(result);
          }
        });
      }
    });
  });
}

module.exports = {
  fetchRecords,
  addRecord,
  editRecord,
  deleteRecord,
};
