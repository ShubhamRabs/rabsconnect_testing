// for ES5
const express = require("express");
const pool = require("../../Database.js");
const {
  fetchRecords,
  addRecord,
  editRecord,
  deleteRecord,
} = require("../../Handler/DynamicFields.js");

const LoanSalesManagerRouter = express.Router();

LoanSalesManagerRouter.post("/add-loan-sales-manager", async (req, res) => {
  try {
    const { DateTime, data } = req.body;
    await addRecord("crm_loan_sales_manager", {
      create_dt: DateTime,
      update_dt: DateTime,
      bank_name: data.bank_name,
      sales_manager: data.sales_manager,
    });
    res.send("Loan Sales Manager Added Successfully");
  } catch (error) {
    handleServerError(error, res);
  }
});

LoanSalesManagerRouter.post("/get-all-loan-sales-manager", async (req, res) => {
  try {
    const records = await fetchRecords(
      "crm_loan_sales_manager",
      "lsm_id as id, create_dt, update_dt, bank_name, sales_manager"
    );
    res.json(records);
  } catch (error) {
    handleServerError(error, res);
  }
});

LoanSalesManagerRouter.post("/delete-loan-sales-manager", async (req, res) => {
  pool.getConnection(function (error, connection) {
    if (error) throw error;
    connection.query(
      "DELETE FROM crm_loan_sales_manager WHERE ?? = ?",
      ["lsm_id", req.body.lsm_id],
      (err, result) => {
        if (err) {
          console.log(err);
        } else {
          res.send("Loan Sales Manager Deleted Successfully");
        }
        connection.release();
      }
    );
  });
});

LoanSalesManagerRouter.post("/edit-loan-sales-manager", async (req, res) => {
    pool.getConnection(function (error, connection) {
        if (error) throw error;
        connection.query(
          "UPDATE crm_loan_sales_manager SET ?? = ?, ?? = ?, ?? = ? WHERE ?? = ?",
          ["update_dt", req.body.DateTime, "bank_name", req.body.data.bank_name, "sales_manager", req.body.data.sales_manager, "lsm_id", req.body.data.id],
          (err, result) => {
            if (err) {
              console.log(err);
            } else {
              res.send("Loan Sales Manager Updated Successfully");
            }
            connection.release();
          }
        );
    });
});

// for ES5
module.exports = LoanSalesManagerRouter;
