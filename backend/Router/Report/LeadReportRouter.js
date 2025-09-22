// for ES5
const express = require("express");
const pool = require("../../Database.js");

const LeadReportRouter = express.Router();

LeadReportRouter.post("/get-lead-report-table-data", (req, res) => {
  const user_role = req.session.user[0].urole;
  const user_id = req.session.user[0].u_id;

  // if (user_role === "Master" || user_role === "Admin") {
  pool.getConnection((error, connection) => {
    if (error) throw error;

    const getStatusQuery = `
                SELECT DISTINCT status
                FROM crm_lead_status
              `;

    connection.query(getStatusQuery, (err, statusResult) => {
      if (err) {
        console.log(err);
        connection.release();
        return;
      }

      const statusColumns = statusResult
        .map(
          (row) =>
            `SUM(CASE WHEN crm_lead_history.status = '${row.status}' THEN 1 ELSE 0 END) AS '${row.status}'`
        )
        .join(", ");

      const dynamicQuery = `
                  SELECT crm_lead_history.create_dt AS date,crm_lead_history.u_id, crm_users.username, ${statusColumns}, SUM(IF(crm_lead_history.status IS NOT NULL, 1, 0)) AS total_count
                  FROM crm_lead_status
                  LEFT JOIN crm_lead_history ON crm_lead_status.status = crm_lead_history.status
                  JOIN crm_users ON crm_lead_history.u_id = crm_users.u_id
                  WHERE crm_lead_history.u_id IN (?) AND DATE(crm_lead_history.create_dt) BETWEEN ? AND ?
                  GROUP BY crm_lead_history.u_id
                `;
                // console.log(dynamicQuery);
      connection.query(
        dynamicQuery,
        [req.body.user, req.body.start_date, req.body.end_date],
        (err, result) => {
          if (err) {
            console.log(err);
            connection.release();
            return;
          } else {
            const query = `SELECT crm_lead_history.create_dt AS date,crm_lead_history.u_id, crm_users.username, ${statusColumns}, SUM(IF(crm_lead_history.status IS NOT NULL, 1, 0)) AS total_count
            FROM crm_lead_status
            LEFT JOIN crm_lead_history ON crm_lead_status.status = crm_lead_history.status
            JOIN crm_users ON crm_lead_history.u_id = crm_users.u_id
            WHERE crm_lead_history.u_id IN (?) AND DATE(crm_lead_history.create_dt) BETWEEN ? AND ?
            GROUP BY DATE(crm_lead_history.create_dt)`
            connection.query(query, [req.body.user, req.body.start_date, req.body.end_date], (err, detail) => {
              if (err) {
                res.json({
                  message: "Error fetching Detail report"
                }).status(404)
              } else {
                const query = 'SELECT COUNT(CASE WHEN followup = "yes" THEN 1 ELSE 0 END) AS FollowUps,SUM(CASE WHEN previous_status = "" THEN 1 ELSE 0 END) AS NewLeads,SUM(CASE WHEN missed_lead = "Yes" THEN 1 ELSE 0 END) AS MissedLeads ,create_dt FROM crm_lead_history WHERE crm_lead_history.u_id IN (?) AND DATE(crm_lead_history.create_dt) BETWEEN ? AND ? GROUP BY DATE(crm_lead_history.create_dt)'

                connection.query(query, [req.body.user, req.body.start_date, req.body.end_date], (err, prev) => {
                  if (err) {
                    console.log("error query", err)
                    res.json({
                      message: "Error fetching Preious data detail"
                    }).status(404)
                  }
                  else {
                    // console.log("hello")
                    res.json([result, detail, prev]);
                  }
                })
              }
            })
          }
          connection.release();
        }
      );
    });
  });
  // }
});

LeadReportRouter.post("/get-all-status", async (req, res) => {
  const user_role = req.session.user[0].urole;
  const user_id = req.session.user[0].u_id;

  if (user_role === "Master" || user_role === "Admin") {
    pool.getConnection(function (error, connection) {
      if (error) throw error;
      connection.query(
        "SELECT crm_lead_status.status, crm_lead_status.color, COUNT(crm_lead_primary_details.status) AS status_count FROM crm_lead_status LEFT JOIN crm_lead_primary_details ON crm_lead_status.status = crm_lead_primary_details.status GROUP BY crm_lead_status.status",
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
  } else {
    pool.getConnection(function (error, connection) {
      if (error) throw error;
      connection.query(
        "SELECT crm_lead_req_details.assignto_id, crm_lead_status.status, crm_lead_status.color, COUNT(crm_lead_req_details.status) AS status_count FROM crm_lead_status LEFT JOIN crm_lead_req_details ON crm_lead_status.status = crm_lead_req_details.status AND ?? = ? GROUP BY crm_lead_status.status;",
        ["crm_lead_req_details.assignto_id", user_id],
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

LeadReportRouter.get("/all", (req, res) => {
  pool.getConnection((error, connection) => {
    if (error) throw error;
    const query = "SELECT previous_status FROM crm_lead_history ORDER BY previous_status ASC;"
    connection.query(query, (err, statusResult) => {
      if (err) {
        console.log(err);
        connection.release();
        return;
      }
      res.json(statusResult);
      connection.release();
    });
  }); // Corrected placement of closing parenthesis
});


// for ES5
module.exports = LeadReportRouter;