// for ES5
const express = require("express");
const pool = require("../../Database.js");

const PaymentPlanRouter = express.Router();

/*
  Date: 6-09-2023
  Author Name: Shubham Sonkar
  This endpoint retrieves data from the 'crm_source' table based on the specified columns.
  Example Request:
  POST /get-all-source
  Request Body: {"columns": "source_id as id, create_dt, update_dt, source"}
*/

PaymentPlanRouter.post("/get-all-payment-plan", (req, res) => {
  // Define an array to hold the columns to be selected
  let columns;
  // Check if the 'columns' parameter is provided in the request body
  if (req.body.columns === undefined) {
    // If not provided, use default columns
    columns = ["plan_id as id", "create_dt", "update_dt", "plan"];
  } else {
    // If provided, split the comma-separated string and trim each element
    columns = req.body.columns;
  }
  // Acquire a database connection
  pool.getConnection(function (error, connection) {
    if (error) throw error;
    // Use a template literal to dynamically create the SQL query
    const query = `SELECT ${columns.join(", ")} FROM crm_payment_plan`;
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
PaymentPlanRouter.post("/get-all-unique-payment-plan", (req, res) => {
  const user_role = req.session.user[0].urole;
  pool.getConnection(function (error, connection) {
    if (error) throw error;
    connection.query(
      "SELECT DISTINCT(plan) FROM ?? ORDER BY l_id DESC",
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

PaymentPlanRouter.post("/add-payment-plan", (req, res) => {
  console.log(req.body);
  pool.getConnection(function (error, connection) {
    if (error) throw error;
    connection.query(
      "INSERT INTO crm_payment_plan (??, ??, ??) VALUES(?, ?, ?)",
      [
        "create_dt",
        "update_dt",
        "plan",
        req.body.DateTime,
        req.body.DateTime,
        req.body.data.payment_plan,
      ],
      (err, result) => {
        if (err) {
          res.send("Payment Plan with same plan already exist");
        } else {
          res.send("Payment Plan Added Successfully");
        }
        connection.release();
      }
    );
  });
});

PaymentPlanRouter.post("/edit-payment-plan", (req, res) => {
  pool.getConnection(function (error, connection) {
    if (error) throw error;
    connection.query(
      "UPDATE crm_payment_plan SET ?? = ?, ?? = ? WHERE ?? = ?",
      [
        "update_dt",
        req.body.DateTime,
        "plan",
        req.body.data.payment_plan,
        "plan_id",
        req.body.data.id,
      ],
      (err, result) => {
        if (err) {
          res.send("Payment Plan with same plan already exist");
        } else {
          res.send("Payment Plan Updated Successfully");
        }
        connection.release();
      }
    );
  });
});

PaymentPlanRouter.post("/delete-payment-plan", (req, res) => {
  pool.getConnection(function (error, connection) {
    if (error) throw error;
    connection.query(
      "DELETE FROM crm_payment_plan WHERE ?? = ?",
      ["plan_id", req.body.plan_id],
      (err, result) => {
        if (err) {
          console.log(err);
        } else {
          res.send("Payment Plan Deleted Successfully");
        }
        connection.release();
      }
    );
  });
});

// for ES5
module.exports = PaymentPlanRouter;
