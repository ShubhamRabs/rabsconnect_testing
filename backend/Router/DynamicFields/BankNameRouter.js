const express = require("express");
const pool = require("../../Database.js");

const BankNameRouter = express.Router();

BankNameRouter.post("/get-all-bank-name", (req, res) => {
  // Define an array to hold the columns to be selected
  let columns;
  // Check if the 'columns' parameter is provided in the request body
  if (req.body.columns === undefined) {
    // If not provided, use default columns
    columns = [
      "bank_id as id",
      "create_dt",
      "update_dt",
      "bank_name",
      "acc_num",
      "branch_name",
      "ifsc_code",
      "pan_num",
      "gst_status",
      "gst_code",
    ];
  } else {
    // If provided, split the comma-separated string and trim each element
    columns = req.body.columns;
  }
  // Acquire a database connection
  pool.getConnection(function (error, connection) {
    if (error) throw error;
    // Use a template literal to dynamically create the SQL query
    const query = `SELECT ${columns.join(", ")} FROM crm_bankname`;
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

BankNameRouter.post("/delete-bank-name", (req, res) => {
  pool.getConnection(function (error, connection) {
    if (error) throw error;
    connection.query(
      "DELETE FROM crm_bankname WHERE ?? = ?",
      ["bank_id", req.body.bank_id],
      (err, result) => {
        if (err) {
          res.send("Bank Name with same name already exist");
        } else {
          res.send("Bank Name Deleted Successfully");
        }
        connection.release();
      }
    );
  });
});

BankNameRouter.post("/edit-bank-name", (req, res) => {
  pool.getConnection(function (error, connection) {
    if (error) throw error;
    connection.query(
      "UPDATE crm_bankname SET ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ? WHERE ?? = ?",
      [
        "update_dt",
        req.body.DateTime,
        "bank_name",
        req.body.data.bank_name,
        "acc_num",
        req.body.data.acc_num,
        "branch_name",
        req.body.data.branch_name,
        "ifsc_code",
        req.body.data.ifsc_code,
        "pan_num",
        req.body.data.pan_num,
        "gst_status",
        req.body.data.gst_status,
        "gst_code",
        req.body.data.gst_code,
        "bank_id",
        req.body.data.bank_id,
      ],
      (err, result) => {
        // console.log("ifsc: ", req.body.data.ifsc_code);
        // console.log("Bank: ", req.body.data.bank_id);

        if (err) {
          // console.log(err);
          res.send("Bank Name with same name already exist");
        } else {
          res.send("Bank Name Updated Successfully");
        }
        connection.release();
      }
    );
  });
});

BankNameRouter.post("/add-bank-name", (req, res) => {
  pool.getConnection(function (error, connection) {
    if (error) throw error;
    connection.query(
      "INSERT INTO crm_bankname (??, ??, ??, ??, ??, ??, ??, ??, ??) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        "create_dt",
        "update_dt",
        "bank_name",
        "acc_num",
        "branch_name",
        "ifsc_code",
        "pan_num",
        "gst_status",
        "gst_code",
        req.body.DateTime,
        req.body.DateTime,
        req.body.data.bank_name,
        req.body.data.acc_num,
        req.body.data.branch_name,
        req.body.data.ifsc_code,
        req.body.data.pan_num,
        req.body.data.gst_status,
        req.body.data.gst_code,
      ],
      (err, result) => {
        if (err) {
          res.send("Bank Name with same name already exist");
        } else {
          res.send("Bank Name Added Successfully");
        }
        connection.release();
      }
    );
  });
});

module.exports = BankNameRouter;