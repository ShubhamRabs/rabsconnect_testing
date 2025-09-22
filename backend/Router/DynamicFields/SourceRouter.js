// for ES5
const express = require("express");
const pool = require("../../Database.js");

const SourceRouter = express.Router();

/*
  Date: 6-09-2023
  Author Name: Shubham Sonkar
  This endpoint retrieves data from the 'crm_source' table based on the specified columns.
  Example Request:
  POST /get-all-source
  Request Body: {"columns": "source_id as id, create_dt, update_dt, source"}
*/

SourceRouter.post("/get-all-source", (req, res) => {
  // Define an array to hold the columns to be selected
  let columns;
  // Check if the 'columns' parameter is provided in the request body
  if (req.body.columns === undefined) {
    // If not provided, use default columns
    columns = ["source_id as id", "create_dt", "update_dt", "source"];
  } else {
    // If provided, split the comma-separated string and trim each element
    columns = req.body.columns;
  }
  // Acquire a database connection
  pool.getConnection(function (error, connection) {
    if (error) throw error;
    // Use a template literal to dynamically create the SQL query
    const query = `SELECT ${columns.join(", ")} FROM crm_source`;
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

//  Mobile App Router
SourceRouter.post("/get-all-unique-leads-source", (req, res) => {
  const user_role = req.session.user[0].urole;
  pool.getConnection(function (error, connection) {
    if (error) throw error;
    connection.query(
      "SELECT DISTINCT(source) FROM ?? ORDER BY l_id DESC",
      [
        user_role === "Master" || user_role === "Admin"
          ? "crm_lead_primary_details"
          : "crm_lead_primary_details",
      ],
      (err, result) => {
        if (err) {
          console.log(err);
        } else {
          res.json(result);
        }
        connection.release();
      }
    );
  });
});

SourceRouter.post("/add-source", (req, res) => {
  pool.getConnection(function (error, connection) {
    if (error) throw error;
    connection.query(
      "INSERT INTO crm_source (??, ??, ??) VALUES(?, ?, ?)",
      [
        "create_dt",
        "update_dt",
        "source",
        req.body.DateTime,
        req.body.DateTime,
        req.body.data.source,
      ],
      (err, result) => {
        if (err) {
          res.send("Source with same name already exist");
        } else {
          res.send("Source Added Successfully");
        }
        connection.release();
      }
    );
  });
});

SourceRouter.post("/edit-source", (req, res) => {
  pool.getConnection(function (error, connection) {
    if (error) throw error;
    connection.query(
      "UPDATE crm_source SET ?? = ?, ?? = ? WHERE ?? = ?",
      [
        "update_dt",
        req.body.DateTime,
        "source",
        req.body.data.source,
        "source_id",
        req.body.data.id,
      ],
      (err, result) => {
        if (err) {
          res.send("Source with same name already exist");
        } else {
          res.send("Source Updated Successfully");
        }
        connection.release();
      }
    );
  });
});

SourceRouter.post("/delete-source", (req, res) => {
  pool.getConnection(function (error, connection) {
    if (error) throw error;
    connection.query(
      "DELETE FROM crm_source WHERE ?? = ?",
      ["source_id", req.body.source_id],
      (err, result) => {
        if (err) {
          console.log(err);
        } else {
          res.send("Source Deleted Successfully");
        }
        connection.release();
      }
    );
  });
});

// for ES5
module.exports = SourceRouter;
