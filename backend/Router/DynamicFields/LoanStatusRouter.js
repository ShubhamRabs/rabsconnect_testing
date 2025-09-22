// for ES5
const express = require("express");
const pool = require("../../Database.js");

const LoanStatusRouter = express.Router();

/*
  Date: 6-09-2023
  Author Name: Shubham Sonkar
  This endpoint retrieves data from the 'crm_loan_status' table based on the specified columns.
  Example Request:
  POST /get-all-loan-status
  Request Body: {"columns": "loan_sid as id, create_dt, update_dt, loan_status"}
*/

LoanStatusRouter.post("/get-all-loan-status", (req, res) => {
  // Define an array to hold the columns to be selected
  let columns;
  // Check if the 'columns' parameter is provided in the request body
  if (req.body.columns === undefined) {
    // If not provided, use default columns
    columns = ["loan_sid as id", "create_dt", "update_dt", "loan_status"];
  } else {
    // If provided, split the comma-separated string and trim each element
    columns = req.body.columns;
  }
  // Acquire a database connection
  pool.getConnection(function (error, connection) {
    if (error) throw error;
    // Use a template literal to dynamically create the SQL query
    const query = `SELECT ${columns.join(", ")} FROM crm_loan_status`;
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

LoanStatusRouter.post("/add-loan-status", (req, res) => {
  pool.getConnection(function (error, connection) {
    if (error) throw error;
    connection.query(
      "INSERT INTO crm_loan_status (??, ??, ??) VALUES(?, ?, ?)",
      [
        "create_dt",
        "update_dt",
        "loan_status",
        req.body.DateTime,
        req.body.DateTime,
        req.body.data.loan_status,
      ],
      (err, result) => {
        if (err) {
          res.send("Loan Status with same name already exist");
        } else {
          res.send("Loan Status Added Successfully");
        }
        connection.release();
      }
    );
  });
});

LoanStatusRouter.post("/edit-loan-status", (req, res) => {
  pool.getConnection(function (error, connection) {
    if (error) throw error;
    connection.query(
      "UPDATE crm_loan_status SET ?? = ?, ?? = ? WHERE ?? = ?",
      [
        "update_dt",
        req.body.DateTime,
        "loan_status",
        req.body.data.loan_status,
        "loan_sid",
        req.body.data.id,
      ],
      (err, result) => {
        if (err) {
          res.send("Loan Status with same name already exist");
        } else {
          res.send("Loan Status Updated Successfully");
        }
        connection.release();
      }
    );
  });
});

LoanStatusRouter.post("/delete-loan-status", (req, res) => {
  pool.getConnection(function (error, connection) {
    if (error) throw error;
    connection.query(
      "DELETE FROM crm_loan_status WHERE ?? = ?",
      ["loan_sid", req.body.loan_sid],
      (err, result) => {
        if (err) {
          console.log(err);
        } else {
          res.send("Loan Status Deleted Successfully");
        }
        connection.release();
      }
    );
  });
});

// for ES5
module.exports = LoanStatusRouter;
