// for ES5
const express = require("express");
const pool = require("../../Database.js");

const CandidateStatusRouter = express.Router();

/*
  Date: 6-09-2023
  Author Name: Shubham Sonkar
  This endpoint retrieves data from the 'crm_candidate_status' table based on the specified columns.
  Example Request:
  POST /get-all-candidates-status
  Request Body: {"columns": "c_status_id as id, create_dt, update_dt, candidate_status"}
*/

CandidateStatusRouter.post("/get-all-candidates-status", (req, res) => {
  // Define an array to hold the columns to be selected
  let columns;
  // Check if the 'columns' parameter is provided in the request body
  if (req.body.columns === undefined) {
    // If not provided, use default columns
    columns = ["c_status_id as id", "create_dt", "update_dt", "candidate_status"];
  } else {
    // If provided, split the comma-separated string and trim each element
    columns = req.body.columns;
  }
  // Acquire a database connection
  pool.getConnection(function (error, connection) {
    if (error) throw error;
    // Use a template literal to dynamically create the SQL query
    const query = `SELECT ${columns.join(", ")} FROM crm_candidate_status`;
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

CandidateStatusRouter.post("/add-candidates-status", (req, res) => {
  pool.getConnection(function (error, connection) {
    if (error) throw error;
    connection.query(
      "INSERT INTO crm_candidate_status (??, ??, ??) VALUES(?, ?, ?)",
      [
        "create_dt",
        "update_dt",
        "candidate_status",
        req.body.DateTime,
        req.body.DateTime,
        req.body.data.candidate_status,
      ],
      (err, result) => {
        if (err) {
          res.send("Candidate Status with same name already exist");
        } else {
          res.send("Candidate Status Added Successfully");
        }
        connection.release();
      }
    );
  });
});

CandidateStatusRouter.post("/edit-candidates-status", (req, res) => {
  pool.getConnection(function (error, connection) {
    if (error) throw error;
    connection.query(
      "UPDATE crm_candidate_status SET ?? = ?, ?? = ? WHERE ?? = ?",
      [
        "update_dt",
        req.body.DateTime,
        "candidate_status",
        req.body.data.candidate_status,
        "c_status_id",
        req.body.data.id,
      ],
      (err, result) => {
        if (err) {
          res.send("Candidate Status with same name already exist");
        } else {
          res.send("Candidate Status Updated Successfully");
        }
        connection.release();
      }
    );
  });
});

CandidateStatusRouter.post("/delete-candidates-status", (req, res) => {
  pool.getConnection(function (error, connection) {
    if (error) throw error;
    connection.query(
      "DELETE FROM crm_candidate_status WHERE ?? = ?",
      ["c_status_id", req.body.c_status_id],
      (err, result) => {
        if (err) {
          console.log(err);
        } else {
          res.send("Candidate Status Deleted Successfully");
        }
        connection.release();
      }
    );
  });
});

// for ES5
module.exports = CandidateStatusRouter;
