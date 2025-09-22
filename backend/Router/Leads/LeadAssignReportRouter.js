// for ES5
const express = require("express");
const pool = require("../../Database.js");

const LeadAssignReportRouter = express.Router();

LeadAssignReportRouter.get("/get-lead-assign-report-table-data", (req, res) => {
  const user_role = req.session.user[0].urole;
  const user_id = req.session.user[0].u_id;
  const utype = req.session.user[0].utype;
  const { page, pageSize } = req.query;
  const offset = (page - 1) * pageSize;
  const limit = parseInt(pageSize);

  pool.getConnection(function (error, connection) {
    if (error) throw error;
    connection.query(
      "SELECT lah.lah_id, lah.create_dt, lah.update_dt, lah.l_id, lah.lreq_id, lah.lsche_id, lah.assign_type, lah.assign_by, lah.assign_to, cu.username AS assignby, GROUP_CONCAT(au.username) AS assignto FROM crm_lead_assign_history AS lah LEFT JOIN crm_users AS cu ON cu.u_id = lah.assign_by LEFT JOIN crm_users AS au ON FIND_IN_SET(au.u_id, lah.assign_to) GROUP BY lah.lah_id, lah.create_dt, lah.update_dt, lah.l_id, lah.lreq_id, lah.lsche_id, lah.assign_type, lah.assign_by, lah.assign_to, cu.username ORDER BY lah.lah_id DESC LIMIT ? OFFSET ?",
      [limit, offset],
      (err, result) => {
        if (err) {
          console.log("error hi");
        } else {
          res.json(result);
        }
        connection.release();
      }
    );
  });
});

LeadAssignReportRouter.post(
  "/get-lead-assign-report-table-data-count",
  (req, res) => {
    const user_role = req.session.user[0].urole;
    const user_id = req.session.user[0].u_id;

    pool.getConnection(function (error, connection) {
      if (error) throw error;
      connection.query(
        "SELECT COUNT(lah_id) AS totalCount FROM crm_lead_assign_history ORDER BY lah_id DESC",
        (err, result) => {
          if (err) {
            console.log("error bye");
          } else {
            res.json(result[0].totalCount);
          }
          connection.release();
        }
      );
    });
  }
);

// for ES5
module.exports = LeadAssignReportRouter;
