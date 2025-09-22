// for ES5
const express = require("express");
const pool = require("../../Database.js");

const ConfigurationRouter = express.Router();

/*
  Date: 30-09-2023
  Author Name: Nikhil Prakash
  This endpoint retrieves data from the 'crm_configuration' table based on the specified columns.
  Example Request:
  POST /get-all-configuration
  Request Body: {"columns": "confi_id as id, create_dt, update_dt, configuration, configuration_type"}
*/
ConfigurationRouter.post("/get-all-configuration", (req, res) => {
  // Define an array to hold the columns to be selected
  let columns;

  // Check if the 'columns' parameter is provided in the request body
  if (req.body.columns === undefined) {
    // If not provided, use default columns
    columns = [
      "confi_id as id",
      "create_dt",
      "update_dt",
      "configuration",
      "configuration_type",
    ];
  } else {
    // If provided, split the comma-separated string and trim each element
    columns = req.body.columns;
  }
  // Acquire a database connection
  pool.getConnection(function (error, connection) {
    if (error) throw error;
    // Use a template literal to dynamically create the SQL query
    const query = `SELECT ${columns.join(", ")} FROM crm_configuration`;
    // Execute the SQL query
    connection.query(query, (err, result) => {
      if (err) {
        console.log(err);
      } else {
        // Send the query result as a JSON response
        res.json(result);
      }
      // Release the database connection
      connection.release();
    });
  });
});

ConfigurationRouter.post("/add-configuration", (req, res) => {
  pool.getConnection(function (error, connection) {
    if (error) throw error;
    connection.query(
      "INSERT INTO crm_configuration (??, ??, ??, ??) VALUES(?, ?, ?, ?)",
      [
        "create_dt",
        "update_dt",
        "configuration_type",
        "configuration",
        req.body.DateTime,
        req.body.DateTime,
        req.body.data.configuration_type,
        req.body.data.configuration,
      ],
      (err, result) => {
        if (err) {
          res.send("Configuration with same name already exist");
        } else {
          res.send("Configuration Added Successfully");
        }
        connection.release();
      }
    );
  });
});

ConfigurationRouter.post("/edit-configuration", (req, res) => {
  pool.getConnection(function (error, connection) {
    if (error) throw error;
    connection.query(
      "UPDATE crm_configuration SET ?? = ?, ?? = ?, ?? = ? WHERE ?? = ?",
      [
        "update_dt",
        req.body.DateTime,
        "configuration_type",
        req.body.data.configuration_type,
        "configuration",
        req.body.data.configuration,
        "confi_id",
        req.body.data.id,
      ],
      (err, result) => {
        if (err) {
          res.send("Configuration with same name already exist");
        } else {
          res.send("Configuration Updated Successfully");
        }
        connection.release();
      }
    );
  });
});

ConfigurationRouter.post("/delete-configuration", (req, res) => {
  pool.getConnection(function (error, connection) {
    if (error) throw error;
    connection.query(
      "DELETE FROM crm_configuration WHERE ?? = ?",
      ["confi_id", req.body.confi_id],
      (err, result) => {
        if (err) {
          console.log(err);
        } else {
          res.send("Configuration Deleted Successfully");
        }
        connection.release();
      }
    );
  });
});

// for ES5
module.exports = ConfigurationRouter;
