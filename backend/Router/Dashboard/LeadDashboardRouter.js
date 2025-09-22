// for ES5
const express = require("express");
const pool = require("../../Database.js");
const dayjs = require("dayjs");

const system_date = dayjs().format("YYYY-MM-DD");

const LeadDashboardRouter = express.Router();

LeadDashboardRouter.post("/get-lead-source-counting", (req, res) => {
  const user_id = req.session.user[0].u_id;
  const user_role = req.session.user[0].urole;
  if (user_role === "Master" || user_role === "Admin") {
    pool.getConnection(function (error, connection) {
      if (error) throw error;
      connection.query(
        "SELECT TRIM(LOWER(source)) AS source, COUNT(`l_id`) AS lead_count FROM crm_lead_primary_details GROUP BY TRIM(LOWER(source))",
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
        "SELECT TRIM(LOWER(crm_lead_primary_details.source)) AS source, COUNT(crm_lead_req_details.l_id) AS lead_count FROM crm_lead_req_details JOIN crm_lead_primary_details ON crm_lead_primary_details.l_id = crm_lead_req_details.l_id WHERE ?? = ? GROUP BY TRIM(LOWER(crm_lead_primary_details.source))",
        ["crm_lead_req_details.assignto_id", user_id],
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
});

LeadDashboardRouter.post("/get-leads-status-analytics-counting", (req, res) => {
  const user_id = req.session.user[0].u_id;
  const user_role = req.session.user[0].urole;
  if (user_role === "Master" || user_role === "Admin") {
    pool.getConnection(function (error, connection) {
      if (error) throw error;
      connection.query(
        "SELECT h.status, s.color, COUNT(*) AS count, COUNT(DISTINCT h.l_id) AS unique_count FROM crm_lead_history h LEFT JOIN crm_lead_status s ON h.status = s.status WHERE h.update_dt >= DATE_SUB(NOW(), INTERVAL 24 HOUR) GROUP BY h.status, s.color",
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
        "SELECT h.status, s.color, COUNT(*) AS count, COUNT(DISTINCT h.l_id) AS unique_count FROM crm_lead_history h LEFT JOIN crm_lead_status s ON h.status = s.status WHERE ?? = ? AND h.update_dt >= DATE_SUB(NOW(), INTERVAL 24 HOUR) GROUP BY h.status, s.color",
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
});

LeadDashboardRouter.post("/get-lead-status-counting", (req, res) => {
  const user_id = req.session.user[0].u_id;
  const user_role = req.session.user[0].urole;
  if (user_role === "Master" || user_role === "Admin") {
    pool.getConnection(function (error, connection) {
      if (error) throw error;
      connection.query(
        "SELECT COUNT(crm_lead_primary_details.status) AS leadstatus_count, crm_lead_status.status , crm_lead_status.color FROM crm_lead_status LEFT JOIN crm_lead_primary_details ON crm_lead_primary_details.status=crm_lead_status.status GROUP BY crm_lead_status.status ORDER BY crm_lead_status.status ASC",
        (err, result) => {
          if (err) {
            console.log(err);
          }
          if (result.length > 0) {
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
        "SELECT COUNT(crm_lead_req_details.status) AS leadstatus_count, crm_lead_status.status, crm_lead_status.color FROM crm_lead_status LEFT JOIN crm_lead_req_details ON crm_lead_req_details.status = crm_lead_status.status AND ?? = ? GROUP BY crm_lead_status.status, crm_lead_req_details.status ORDER BY crm_lead_status.status ASC",
        ["crm_lead_req_details.assignto_id", user_id],
        (err, result) => {
          if (err) {
            console.log(err);
          }
          if (result.length > 0) {
            res.send(result);
          }
          connection.release();
        }
      );
    });
  }
});

LeadDashboardRouter.post("/get-lead-project-counting", (req, res) => {
  const user_id = req.session.user[0].u_id;
  const user_role = req.session.user[0].urole;
  if (user_role === "Master" || user_role === "Admin") {
    pool.getConnection(function (error, connection) {
      if (error) throw error;
      connection.query(`SELECT 
  pname,
  COUNT(CASE WHEN create_dt >= NOW() - INTERVAL 1 DAY THEN 1 END) AS last_24_hours_count,
  COUNT(CASE WHEN create_dt >= NOW() - INTERVAL 7 DAY THEN 1 END) AS last_7_days_count,
  COUNT(CASE WHEN create_dt >= NOW() - INTERVAL 1 MONTH THEN 1 END) AS last_1_month_count
FROM crm_lead_primary_details
WHERE create_dt >= NOW() - INTERVAL 60 DAY
GROUP BY pname
ORDER BY last_7_days_count DESC;
`,
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
        "SELECT clpd.pname, COUNT(CASE WHEN clrd.create_dt >= NOW() - INTERVAL 1 DAY THEN 1 END) AS last_24_hours_count, COUNT(CASE WHEN clrd.create_dt >= NOW() - INTERVAL 7 DAY THEN 1 END) AS last_7_days_count, COUNT(CASE WHEN clrd.create_dt >= NOW() - INTERVAL 1 MONTH THEN 1 END) AS last_1_month_count FROM crm_lead_primary_details clpd JOIN crm_lead_req_details clrd ON clpd.l_id = clrd.l_id WHERE ?? = ? GROUP BY clpd.pname ORDER BY last_24_hours_count DESC, last_7_days_count DESC, last_1_month_count DESC",
        ["crm_lead_req_details.assignto_id", user_id],
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
});

LeadDashboardRouter.post("/get-mobile-lead-status-counting", (req, res) => {
  const user_id = req.session.user[0].u_id;
  const user_role = req.session.user[0].urole;
  console.log("Dashboards", user_role);
  if (user_role === "Master" || user_role === "Admin") {
    pool.getConnection(function (error, connection) {
      if (error) throw error;
      connection.query(
        "SELECT ls.status,ls.color,COALESCE(SUM(combined_status_counts.leadstatus_count), 0) AS leadstatus_count FROM crm_lead_status ls LEFT JOIN (SELECT status, COUNT(status) AS leadstatus_count FROM crm_lead_primary_details GROUP BY status UNION ALL SELECT status,COUNT(status) AS leadstatus_count FROM crm_lead_req_details GROUP BY status) AS combined_status_counts ON ls.status = combined_status_counts.status GROUP BY ls.status, ls.color",

        (err, result) => {
          if (err) {
            console.log(err);
          }
          if (result.length > 0) {
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
        "SELECT COUNT(crm_lead_req_details.status) AS leadstatus_count, crm_lead_status.status, crm_lead_status.color FROM crm_lead_status LEFT JOIN crm_lead_req_details ON crm_lead_req_details.status = crm_lead_status.status AND ?? = ? GROUP BY crm_lead_status.status, crm_lead_req_details.status ORDER BY crm_lead_status.status ASC",
        ["crm_lead_req_details.assignto_id", user_id],
        (err, result) => {
          if (err) {
            console.log(err);
          }
          if (result.length > 0) {
            res.send(result);
          }
          connection.release();
        }
      );
    });
  }
});

LeadDashboardRouter.post("/get-team-lead-status-counting", (req, res) => {
  const user_id = req.body.data.user_id;
  const user_role = req.session.user[0].urole;
  pool.getConnection(function (error, connection) {
    if (error) throw error;
    connection.query(
      "SELECT COUNT(crm_lead_req_details.status) AS leadstatus_count, crm_lead_status.status, crm_lead_status.color FROM crm_lead_status LEFT JOIN crm_lead_req_details ON crm_lead_req_details.status = crm_lead_status.status AND ?? = ? GROUP BY crm_lead_status.status, crm_lead_req_details.status ORDER BY crm_lead_status.status ASC",
      ["crm_lead_req_details.assignto_id", user_id],
      (err, result) => {
        if (err) {
          console.log(err);
        }
        if (result.length > 0) {
          res.send(result);
        }
        connection.release();
      }
    );
  });
});

LeadDashboardRouter.post("/get-user-lead-status-counting", (req, res) => {
  const user_id = req.session.user[0].u_id;
  const user_role = req.session.user[0].urole;
  if (user_role === "Master" || user_role === "Admin") {
    pool.getConnection(function (error, connection) {
      if (error) throw error;
      connection.query(
        "SELECT crm_lead_status.status, crm_lead_status.color, COUNT(crm_lead_req_details.status) AS leadstatus_count FROM crm_lead_status LEFT JOIN crm_lead_req_details ON crm_lead_status.status = crm_lead_req_details.status GROUP BY crm_lead_status.status ASC",
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
  } else if (user_role === "Team Leader") {
    pool.getConnection(function (error, connection) {
      if (error) throw error;
      connection.query(
        "SELECT s.status, s.color, COALESCE(r.leadstatus_count, 0) AS leadstatus_count FROM crm_lead_status s LEFT JOIN ( SELECT status, COUNT(*) AS leadstatus_count FROM crm_lead_req_details WHERE EXISTS ( SELECT 1 FROM crm_users WHERE crm_users.u_id = crm_lead_req_details.assignto_id AND crm_users.tl_id = ? ) GROUP BY status ) r ON s.status = r.status",
        [user_id],
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
  } else if (user_role === "Sales Manager") {
    pool.getConnection(function (error, connection) {
      if (error) throw error;
      connection.query(
        "SELECT s.status, s.color, COALESCE(r.leadstatus_count, 0) AS leadstatus_count FROM crm_lead_status s LEFT JOIN ( SELECT status, COUNT(*) AS leadstatus_count FROM crm_lead_req_details WHERE EXISTS ( SELECT 1 FROM crm_users WHERE crm_users.u_id = crm_lead_req_details.assignto_id AND crm_users.sm_id = ? ) GROUP BY status ) r ON s.status = r.status",
        [user_id],
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
  } else if (user_role === "Branch Admin") {
    pool.getConnection(function (error, connection) {
      if (error) throw error;
      connection.query(
        "SELECT s.status, s.color, COALESCE(r.leadstatus_count, 0) AS leadstatus_count FROM crm_lead_status s LEFT JOIN ( SELECT status, COUNT(*) AS leadstatus_count FROM crm_lead_req_details WHERE EXISTS ( SELECT 1 FROM crm_users WHERE crm_users.u_id = crm_lead_req_details.assignto_id AND crm_users.ba_id = ? ) GROUP BY status ) r ON s.status = r.status",
        [user_id],
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

// Define a route handler for a POST request to the endpoint "/get-sub-menu-counting"
LeadDashboardRouter.post("/get-lead-analytics-counting", (req, res) => {
  // Extract user_id and user_role from the session data in the request
  const user_id = req.session.user[0].u_id;
  const user_role = req.session.user[0].urole;

  // Define a function to execute a database query
  const handleQuery = (query, params) => {
    // Get a connection from the database connection pool
    pool.getConnection((error, connection) => {
      if (error) {
        console.error(error);
        // Send a 500 Internal Server Error response if there's a database connection error
        res.status(500).send("Internal Server Error");
        return;
      }
      // Execute the query with the provided parameters
      connection.query(query, params, (err, result) => {
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
  };

  // Check user_role to determine which SQL query to execute
  if (user_role === "Master" || user_role === "Admin") {
    // Construct an SQL query to count various lead types using conditional aggregation
    const query = `
      SELECT COUNT(l_id) AS totallead, COUNT(CASE WHEN assign_status = ? THEN l_id END) AS assign_lead, COUNT(CASE WHEN DATE(followup_dt) = ? AND followup = 'yes' THEN l_id END) AS persentlead, COUNT(CASE WHEN assign_status = '' THEN l_id END) AS nonassignlead, COUNT(CASE WHEN DATE(followup_dt) < ? AND followup = ? THEN l_id END) AS missedlead, COUNT(CASE WHEN DATE(followup_dt) > ? AND followup = ? THEN l_id END) AS upcominglead FROM crm_lead_primary_details`;
    // Define query parameters
    const params = ["Yes", system_date, system_date, "Yes", system_date, "Yes"];
    // Execute the query using handleQuery
    handleQuery(query, params);
  } else {
    // Construct a different SQL query for non-Master/Admin users
    const query = `
        SELECT 
          COUNT(lpd.l_id) AS totallead,
          COUNT(lpd.l_id) AS nonassignlead,
          COUNT(CASE WHEN lrp.assign_status = 'Yes' THEN lpd.l_id END) AS assign_lead,
          COUNT(CASE WHEN DATE(lrp.followup_dt) < ? AND lrp.followup = 'Yes' THEN lpd.l_id END) AS missedlead, 
          COUNT(CASE WHEN DATE(lrp.followup_dt) > ? AND lrp.followup = 'Yes' THEN lpd.l_id END) AS upcominglead,
          COUNT(CASE WHEN DATE(lrp.followup_dt) = ? AND lrp.followup = 'Yes' THEN lpd.l_id END) AS persentlead
        FROM crm_lead_req_details AS lrp 
        JOIN crm_lead_primary_details AS lpd ON lrp.l_id = lpd.l_id WHERE lrp.assignto_id = ?`;

    // Define query parameters
    const params = [system_date, system_date, system_date, user_id];
    // Execute the query using handleQuery
    handleQuery(query, params);
  }
});

LeadDashboardRouter.post("/get-user-loaction", (req, res) => {
  const user_role = req.session.user[0].urole;
  if (user_role === "Master" || user_role === "Admin") {
    pool.getConnection(function (error, connection) {
      if (error) throw error;
      connection.query(
        "SELECT u.u_id, u.username, l.latitude, l.longitude, MAX(l.datetime) AS latest_datetime FROM crm_users_location l JOIN crm_users u ON l.u_id = u.u_id GROUP BY u.u_id",
        (err, result) => {
          if (err) {
            console.log(err);
          }
          if (result.length > 0) {
            res.send(result);
          }
          connection.release();
        }
      );
    });
  }
});

// for ES5
module.exports = LeadDashboardRouter;
