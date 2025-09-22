// for ES5
const express = require("express");
const pool = require("../../Database.js");
const dayjs = require("dayjs");

const system_date = dayjs().format("YYYY-MM-DD");

const UserStatisticsReportRouter = express.Router();

UserStatisticsReportRouter.post("/updated-lead-report", async (req, res) => {
  pool.getConnection(function (error, connection) {
    if (error) throw error;
    connection.query(
      "SELECT cls.status, cls.color, COALESCE(SUM(DATE(clh.create_dt) = CURDATE()), 0) AS current_status_count, COALESCE(SUM(DATE(clh.create_dt) = CURDATE() - INTERVAL 1 DAY), 0) AS previous_status_count FROM crm_lead_status cls LEFT JOIN crm_lead_history clh ON cls.status = clh.status AND clh.u_id = ? GROUP BY cls.status",
      [req.body.u_id],
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

UserStatisticsReportRouter.post("/get-user-lead-count", async (req, res) => {
  // Get a connection from the database connection pool
  pool.getConnection((error, connection) => {
    if (error) {
      console.error(error);
      // Send a 500 Internal Server Error response if there's a database connection error
      res.status(500).send("Internal Server Error");
      return;
    }
    // Execute the query with the provided parameters
    connection.query(
      "SELECT COUNT(lpd.l_id) AS totallead, COUNT(lpd.l_id) AS nonassignlead, COUNT(CASE WHEN lrp.assign_status = 'Yes' THEN lpd.l_id END) AS assign_lead, COUNT(CASE WHEN DATE(lrp.followup_dt) < ? AND lrp.followup = 'Yes' THEN lpd.l_id END) AS missedlead, COUNT(CASE WHEN DATE(lrp.followup_dt) = ? AND lrp.followup = 'Yes' THEN lpd.l_id END) AS persentlead FROM crm_lead_req_details AS lrp JOIN crm_lead_primary_details AS lpd ON lrp.l_id = lpd.l_id WHERE lrp.assignto_id = ?",
      [system_date, system_date, req.body.u_id],
      (err, result) => {
        // Release the database connection
        connection.release();
        if (err) {
          console.error(err);
          // Send a 500 Internal Server Error response if there's a query error
          res.status(500).send("Internal Server Error");
          return;
        } else {
          // Send the query result as a response to the client
          res.send(result);
        }
      }
    );
  });
});
UserStatisticsReportRouter.post(
  "/get-user-lead-source-count",
  async (req, res) => {
    // Get a connection from the database connection pool
    pool.getConnection((error, connection) => {
      if (error) {
        console.error(error);
        // Send a 500 Internal Server Error response if there's a database connection error
        res.status(500).send("Internal Server Error");
        return;
      }

      // Build the base SQL query
      let query =
        "SELECT TRIM(LOWER(crm_lead_primary_details.source)) AS source, COUNT(crm_lead_req_details.l_id) AS lead_count FROM crm_lead_req_details JOIN crm_lead_primary_details ON crm_lead_primary_details.l_id = crm_lead_req_details.l_id WHERE crm_lead_req_details.assignto_id = ? ";

      // Get the selected filter from the request body
      var selectedFilter = req.body.filterDetails;
      // Modify the query based on the selected filter
      if (selectedFilter === "Today") {
        // Add conditions for filtering by today
        query += " AND DATE(crm_lead_req_details.create_dt) = CURDATE()";
      } else if (selectedFilter === "Last Week") {
        // Add conditions for filtering by last week
        query +=
          " AND crm_lead_req_details.create_dt BETWEEN CURDATE() - INTERVAL 1 WEEK AND CURDATE()";
      } else if (selectedFilter === "Last Month") {
        // Add conditions for filtering by last month
        query +=
          " AND crm_lead_req_details.create_dt BETWEEN CURDATE() - INTERVAL 1 MONTH AND CURDATE()";
      }

      query += " GROUP BY TRIM(LOWER(crm_lead_primary_details.source))";

      // Execute the modified query with the provided parameters
      connection.query(query, [req.body.u_id], (err, result) => {
        // Release the database connection
        connection.release();
        if (err) {
          console.error(err);
          // Send a 500 Internal Server Error response if there's a query error
          res.status(500).send("Internal Server Error");
          return;
        } else {
          // Send the query result as a response to the client
          res.send(result);
        }
      });
    });
  }
);

// for ES5
module.exports = UserStatisticsReportRouter;
