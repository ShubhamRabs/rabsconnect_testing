// for ES5
const express = require("express");
const pool = require("../../Database.js");
const dayjs = require("dayjs");

const system_date = dayjs().format("YYYY-MM-DD");

const HRDashboardRouter = express.Router();

HRDashboardRouter.post("/get-candidate-source-counting", (req, res) => {
  const user_id = req.session.user[0].u_id;
  const user_role = req.session.user[0].urole;
  if (
    user_role === "HR Head" ||
    user_role === "Master" ||
    user_role === "Admin"
  ) {
    pool.getConnection(function (error, connection) {
      if (error) throw error;
      connection.query(
        "SELECT TRIM(LOWER(c_source)) AS source, COUNT(`c_id`) AS candidate_count FROM crm_candidate_details GROUP BY TRIM(LOWER(c_source))",
        (err, result) => {
          if (err) {
            console.log(err);
          } else {
            res.send(result);
          }
          connection.release();
        }
      );
    });
  } else {
    pool.getConnection(function (error, connection) {
      if (error) throw error;
      connection.query(
        "SELECT TRIM(LOWER(c_source)) AS source, COUNT(`c_id`) AS candidate_count FROM crm_candidate_details WHERE ?? = ? GROUP BY TRIM(LOWER(c_source))",
        ["crm_candidate_details.assign_to", user_id],
        (err, result) => {
          if (err) {
            console.log(err);
          } else {
            res.send(result);
          }
          connection.release();
        }
      );
    });
  }
});

HRDashboardRouter.post(
  "/get-candidate-status-analytics-counting",
  (req, res) => {
    const user_id = req.session.user[0].u_id;
    const user_role = req.session.user[0].urole;
    if (
      user_role === "Master" ||
      user_role === "Admin" || 
      user_role === "HR Head"
    ) {
      pool.getConnection(function (error, connection) {
        if (error) throw error;
        connection.query(
          "SELECT h.c_status, COUNT(*) AS count, COUNT(DISTINCT h.c_id)  AS unique_count FROM crm_candidate_history h LEFT JOIN crm_candidate_status s ON h.c_status = s.candidate_status WHERE h.update_dt >= DATE_SUB(NOW(), INTERVAL 24 HOUR) GROUP BY h.c_status",
          (err, result) => {
            if (err) {
              console.log("error");
            } else {
              res.send(result);
            }
            connection.release();
          }
        );
      });
    } else {
      pool.getConnection(function (error, connection) {
        if (error) throw error;
        connection.query(
          "SELECT h.c_status, COUNT(*) AS count, COUNT(DISTINCT h.c_id)  AS unique_count FROM crm_candidate_history h LEFT JOIN crm_candidate_status s ON h.c_status = s.candidate_status WHERE ?? = ? h.update_dt >= DATE_SUB(NOW(), INTERVAL 24 HOUR) GROUP BY h.c_status",
          ["h.u_id", user_id],
          (err, result) => {
            if (err) {
              console.log("error");
            } else {
              res.send(result);
            }
            connection.release();
          }
        );
      });
    }
  }
);

// for ES5
module.exports = HRDashboardRouter;
