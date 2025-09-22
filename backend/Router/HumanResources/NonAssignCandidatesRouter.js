// for ES5
const express = require("express");
const pool = require("../../Database.js");

const NonAssignCandidatesRouter = express.Router();

NonAssignCandidatesRouter.get(
  "/get-non-assign-candidate-table-data",
  (req, res) => {
    const user_role = req.session.user[0].urole;
    const user_id = req.session.user[0].u_id;
    const { page, pageSize } = req.query;
    const offset = (page - 1) * pageSize;
    const limit = parseInt(pageSize);

    if (
      user_role === "HR Head" ||
      user_role === "Master" ||
      user_role === "Admin"
    ) {
      pool.getConnection(function (error, connection) {
        if (error) throw error;
        connection.query(
          "SELECT `c_id`,`create_dt`,`update_dt`,`c_ccode`,`c_mob`,`c_email`,`c_name`,`c_source`,`c_position`,`c_status`,`country`,`state`,`city`,`locality`,`followup`,`followup_dt`,`comments`,`c_pdf`,`assign_to` FROM `crm_candidate_details` WHERE ?? = ? AND ?? = ? ORDER BY crm_candidate_details.c_id DESC LIMIT ? OFFSET ?",
          ["assign_by", "0", "assign_to", "0", limit, offset],
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
  }
);

NonAssignCandidatesRouter.post(
  "/get-non-assign-candidate-table-data-count",
  (req, res) => {
    const user_role = req.session.user[0].urole;
    const user_id = req.session.user[0].u_id;
    if (
      user_role === "HR Head" ||
      user_role === "Master" ||
      user_role === "Admin"
    ) {
      pool.getConnection(function (error, connection) {
        if (error) throw error;
        connection.query(
          "SELECT COUNT(c_id) AS totalCount FROM `crm_candidate_details` WHERE ?? = ? AND ?? = ? ORDER BY crm_candidate_details.c_id",
          ["assign_by", "0", "assign_to", "0"],
          (err, result) => {
            if (err) {
              console.log("error");
            } else {
              res.json(result[0].totalCount);
            }
            connection.release();
          }
        );
      });
    }
  }
);

// for ES5
module.exports = NonAssignCandidatesRouter;
