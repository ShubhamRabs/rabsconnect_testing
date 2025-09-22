const express = require("express");
const pool = require("../../Database.js");

const LeadPriorityRouter = express.Router();

// Get All Lead Priority
LeadPriorityRouter.post("/get-all-lead-priority", (req, res) => {
  let columns = req.body.columns || [
    "lead_pid as id",
    "create_dt",
    "update_dt",
    "lead_priority",
  ];

  pool.getConnection(function (error, connection) {
    if (error) throw error;
    const query = `SELECT ${columns.join(", ")} FROM crm_lead_priority`;

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

// Add Lead Priority
LeadPriorityRouter.post("/add-lead-priority", (req, res) => {
  pool.getConnection(function (error, connection) {
    if (error) throw error;
    connection.query(
      "INSERT INTO crm_lead_priority (??, ??, ??) VALUES(?, ?, ?)",
      [
        "create_dt",
        "update_dt",
        "lead_priority",
        req.body.DateTime,
        req.body.DateTime,
        req.body.data.lead_priority,
      ],
      (err, result) => {
        if (err) {
          res.send("Lead Priority with same name already exists");
        } else {
          res.send("Lead Priority Added Successfully");
        }
        connection.release();
      }
    );
  });
});

// Edit Lead Priority
LeadPriorityRouter.post("/edit-lead-priority", (req, res) => {
  pool.getConnection(function (error, connection) {
    if (error) throw error;
    connection.query(
      "UPDATE crm_lead_priority SET ?? = ?, ?? = ? WHERE ?? = ?",
      [
        "update_dt",
        req.body.DateTime,
        "lead_priority",
        req.body.data.lead_priority,
        "lead_pid",
        req.body.data.id,
      ],
      (err, result) => {
        if (err) {
          res.send("Lead Priority with same name already exists");
        } else {
          res.send("Lead Priority Updated Successfully");
        }
        connection.release();
      }
    );
  });
});

// Delete Lead Priority
LeadPriorityRouter.post("/delete-lead-priority", (req, res) => {
  pool.getConnection(function (error, connection) {
    if (error) throw error;
    connection.query(
      "DELETE FROM crm_lead_priority WHERE ?? = ?",
      ["lead_pid", req.body.lead_pid],
      (err, result) => {
        if (err) {
          console.log(err);
        } else {
          res.send("Lead Priority Deleted Successfully");
        }
        connection.release();
      }
    );
  });
});

module.exports = LeadPriorityRouter;
