// for ES5
const express = require("express");
const pool = require("../../Database.js");

const CandidatesSourceRouter = express.Router();

/*
  Date: 6-09-2023
  Author Name: Shubham Sonkar
  This endpoint retrieves data from the 'crm_source' table based on the specified columns.
  Example Request:
  POST /get-all-candidates-source
  Request Body: {"columns": "c_source_id as id, create_dt, update_dt, candidate_source"}
*/

CandidatesSourceRouter.post("/get-all-candidates-source", (req, res) => {
  // Define an array to hold the columns to be selected
  let columns;
  // Check if the 'columns' parameter is provided in the request body
  if (req.body.columns === undefined) {
    // If not provided, use default columns
    columns = [
      "c_source_id as id",
      "create_dt",
      "update_dt",
      "candidate_source",
    ];
  } else {
    // If provided, split the comma-separated string and trim each element
    columns = req.body.columns;
  }
  // Acquire a database connection
  pool.getConnection(function (error, connection) {
    if (error) throw error;
    // Use a template literal to dynamically create the SQL query
    const query = `SELECT ${columns.join(", ")} FROM crm_candidate_source`;
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

CandidatesSourceRouter.post("/add-candidates-source", (req, res) => {
  pool.getConnection(function (error, connection) {
    if (error) throw error;
    connection.query(
      "INSERT INTO crm_candidate_source (??, ??, ??) VALUES(?, ?, ?)",
      [
        "create_dt",
        "update_dt",
        "candidate_source",
        req.body.DateTime,
        req.body.DateTime,
        req.body.data.candidate_source,
      ],
      (err, result) => {
        if (err) {
          res.send("Candidate Source with same name already exist");
        } else {
          res.send("Candidate Source Added Successfully");
        }
        connection.release();
      }
    );
  });
});

CandidatesSourceRouter.post("/edit-candidates-source", (req, res) => {
  pool.getConnection(function (error, connection) {
    if (error) throw error;
    connection.query(
      "UPDATE crm_candidate_source SET ?? = ?, ?? = ? WHERE ?? = ?",
      [
        "update_dt",
        req.body.DateTime,
        "candidate_source",
        req.body.data.candidate_source,
        "c_source_id",
        req.body.data.id,
      ],
      (err, result) => {
        if (err) {
          res.send("Candidate Source with same name already exist");
        } else {
          res.send("Candidate Source Updated Successfully");
        }
        connection.release();
      }
    );
  });
});

CandidatesSourceRouter.post("/delete-candidates-source", (req, res) => {
  pool.getConnection(function (error, connection) {
    if (error) throw error;
    connection.query(
      "DELETE FROM crm_candidate_source WHERE ?? = ?",
      ["c_source_id", req.body.c_source_id],
      (err, result) => {
        if (err) {
          res.send("Candidate Source with same name already exist");
        } else {
          res.send("Candidate Source Deleted Successfully");
        }
        connection.release();
      }
    );
  });
});

// for ES5
module.exports = CandidatesSourceRouter;
