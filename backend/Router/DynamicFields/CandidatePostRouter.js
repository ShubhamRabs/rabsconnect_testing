// for ES5
const express = require("express");
const pool = require("../../Database.js");

const CandidatePostRouter = express.Router();

/*
  Date: 6-09-2023
  Author Name: Shubham Sonkar
  This endpoint retrieves data from the 'crm_candidate_post' table based on the specified columns.
  Example Request:
  POST /get-all-candidates-post
  Request Body: {"columns": "c_post_id as id, create_dt, update_dt, candidate_post"}
*/

CandidatePostRouter.post("/get-all-candidates-post", (req, res) => {
  // Define an array to hold the columns to be selected
  let columns;
  // Check if the 'columns' parameter is provided in the request body
  if (req.body.columns === undefined) {
    // If not provided, use default columns
    columns = ["c_post_id as id", "create_dt", "update_dt", "candidate_post"];
  } else {
    // If provided, split the comma-separated string and trim each element
    columns = req.body.columns;
  }
  // Acquire a database connection
  pool.getConnection(function (error, connection) {
    if (error) throw error;
    // Use a template literal to dynamically create the SQL query
    const query = `SELECT ${columns.join(", ")} FROM crm_candidate_post`;
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

CandidatePostRouter.post("/add-candidates-post", (req, res) => {
  pool.getConnection(function (error, connection) {
    if (error) throw error;
    connection.query(
      "INSERT INTO crm_candidate_post (??, ??, ??) VALUES(?, ?, ?)",
      [
        "create_dt",
        "update_dt",
        "candidate_post",
        req.body.DateTime,
        req.body.DateTime,
        req.body.data.candidate_post,
      ],
      (err, result) => {
        if (err) {
          res.send("Candidate Post with same name already exist");
        } else {
          res.send("Candidate Post Added Successfully");
        }
        connection.release();
      }
    );
  });
});

CandidatePostRouter.post("/edit-candidates-post", (req, res) => {
  pool.getConnection(function (error, connection) {
    if (error) throw error;
    connection.query(
      "UPDATE crm_candidate_post SET ?? = ?, ?? = ? WHERE ?? = ?",
      [
        "update_dt",
        req.body.DateTime,
        "candidate_post",
        req.body.data.candidate_post,
        "c_post_id",
        req.body.data.id,
      ],
      (err, result) => {
        if (err) {
          res.send("Candidate Post with same name already exist");
        } else {
          res.send("Candidate Post Updated Successfully");
        }
        connection.release();
      }
    );
  });
});

CandidatePostRouter.post("/delete-candidates-post", (req, res) => {
  pool.getConnection(function (error, connection) {
    if (error) throw error;
    connection.query(
      "DELETE FROM crm_candidate_post WHERE ?? = ?",
      ["c_post_id", req.body.c_post_id],
      (err, result) => {
        if (err) {
          console.log(err);
        } else {
          res.send("Candidate Post Deleted Successfully");
        }
        connection.release();
      }
    );
  });
});

// for ES5
module.exports = CandidatePostRouter;
