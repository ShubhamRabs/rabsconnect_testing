// for ES5
const express = require("express");
const pool = require("../../Database.js");

const CallingReportRouter = express.Router();

CallingReportRouter.get("/get-calling-report-table-data", (req, res) => {
  const user_role = req.session.user[0].urole;
  const { u_id, start_date, end_date, status, page, pageSize } = req.query;
  const offset = (page - 1) * pageSize;
  const limit = parseInt(pageSize);

  if (user_role === "Master" || user_role === "Admin") {
    pool.getConnection(function (error, connection) {
      if (error) throw error;
      connection.query(
        "SELECT * FROM crm_lead_history AS clh LEFT JOIN crm_users AS cu ON cu.u_id = clh.u_id WHERE clh.u_id = ? AND clh.status = ? AND DATE(clh.create_dt) BETWEEN ? AND ? ORDER BY clh.create_dt DESC LIMIT ? OFFSET ?",
        [u_id, status, start_date, end_date, limit, offset],
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
  }
});

// for ES5
module.exports = CallingReportRouter;
