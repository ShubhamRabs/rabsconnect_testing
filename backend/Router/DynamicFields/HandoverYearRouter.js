const express = require("express");
const pool = require("../../Database.js");

const HandoverYearRouter = express.Router();

// Get all handover years
HandoverYearRouter.post("/get-all-handover-year", (req, res) => {
  let columns = req.body.columns || [
    "handover_year_sid as id",
    "create_dt",
    "update_dt",
    "handover_year",
  ];
  pool.getConnection(function (error, connection) {
    if (error) throw error;
    const query = `SELECT ${columns.join(", ")} FROM crm_handover_year`;
    connection.query(query, (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.json(result);
      }
      connection.release();
    });
  });
});

// Add a new handover year
HandoverYearRouter.post("/add-handover-year", (req, res) => {
  pool.getConnection(function (error, connection) {
    if (error) throw error;
    connection.query(
      "INSERT INTO crm_handover_year (create_dt, update_dt, handover_year) VALUES (?, ?, ?)",
      [req.body.DateTime, req.body.DateTime, req.body.data.handover_year],
      (err, result) => {
        if (err) {
          res.send("Handover Year already exists");
        } else {
          res.send("Handover Year Added Successfully");
        }
        connection.release();
      }
    );
  });
});

// Edit an existing handover year
HandoverYearRouter.post("/edit-handover-year", (req, res) => {
  pool.getConnection(function (error, connection) {
    if (error) throw error;
    connection.query(
      "UPDATE crm_handover_year SET update_dt = ?, handover_year = ? WHERE handover_year_sid = ?",
      [req.body.DateTime, req.body.data.handover_year, req.body.data.id],
      (err, result) => {
        if (err) {
          res.send("Error updating handover year");
        } else {
          res.send("Handover Year Updated Successfully");
        }
        connection.release();
      }
    );
  });
});

// Delete a handover year
HandoverYearRouter.post("/delete-handover-year", (req, res) => {
  pool.getConnection(function (error, connection) {
    if (error) throw error;
    connection.query(
      "DELETE FROM crm_handover_year WHERE handover_year_sid = ?",
      [req.body.handover_year_sid],
      (err, result) => {
        if (err) {
          console.log(err);
        } else {
          res.send("Handover Year Deleted Successfully");
        }
        connection.release();
      }
    );
  });
});

module.exports = HandoverYearRouter;
