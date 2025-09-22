// for ES5
const express = require("express");
const pool = require("../../Database.js");
const dayjs = require("dayjs");
const fs = require("fs");

const system_date = dayjs().format("YYYY-MM-DD");
const system_time = dayjs().format("HH:mm:ss");

const LeftsidebarRouter = express.Router();

// Define a route handler for a POST request to the endpoint "/get-sub-menu-counting"
// LeftsidebarRouter.post("/get-sub-menu-lead-counting", (req, res) => {
//   // Extract user_id and user_role from the session data in the request
//   const user_id = req.session.user[0].u_id;
//   const user_role = req.session.user[0].urole;

//   // Initialize a commonCondition variable based on user_role
//   let commonCondition = "";
//   if (user_role === "Master" || user_role === "Admin") {
//     commonCondition = ` status NOT IN ('Broker', 'Dead', 'Booking Done', 'Wrong Number', 'Not Interested', 'NI')`;
//   } else {
//     commonCondition = ` lrd.status NOT IN ('Broker', 'Dead', 'Booking Done', 'Wrong Number', 'Not Interested', 'NI')`;
//   }

//   // Define a function to execute a database query
//   const handleQuery = (query, params) => {
//     // Get a connection from the database connection pool
//     pool.getConnection((error, connection) => {
//       if (error) {
//         console.error(error);
//         // Send a 500 Internal Server Error response if there's a database connection error
//         res.status(500).send("Internal Server Error");
//         return;
//       }
//       // Execute the query with the provided parameters
//       connection.query(query, params, (err, result) => {
//         // Release the database connection
//         connection.release();
//         if (err) {
//           console.error(err);
//           // Send a 500 Internal Server Error response if there's a query error
//           res.status(500).send("Internal Server Error");
//           return;
//         } else {
//           // Send the query result as a response to the client
//           res.send(result);
//         }
//       });
//     });
//   };

//   // Check user_role to determine which SQL query to execute
//   if (user_role === "Master" || user_role === "Admin") {
//     const query = `
//       SELECT
//         COUNT(CASE WHEN identity != "imported" THEN l_id END) AS totallead,
//         COUNT(CASE WHEN identity = 'imported' THEN l_id END) AS importlead,
//         COUNT (CASE WHEN clicked=0 THEN l_id END) AS freshlead,
//         COUNT(CASE WHEN assign_status = ? THEN l_id END) AS assign_lead,
//         COUNT(CASE WHEN DATE(followup_dt) = ? AND followup = 'yes' AND ${commonCondition} THEN l_id END) AS persentlead,
//         COUNT(CASE WHEN assign_status = '' THEN l_id END) AS nonassignlead,
//         COUNT(CASE WHEN DATE(followup_dt) > ? AND followup = ? THEN l_id END) AS upcominglead,
//         COUNT(CASE WHEN DATE(followup_dt) < ? AND followup = ? THEN l_id END) AS missedlead
//       FROM crm_lead_primary_details
//     `;
//     // Define query parameters
//     const params = ["Yes", system_date, system_date, "Yes", system_date, "Yes"];
//     // Execute the query using handleQuery
//     handleQuery(query, params);
//   } else {
//     const query = `SELECT
//     COUNT(CASE WHEN lpd.identity = "" THEN lpd.l_id END) AS totallead,
//     COUNT(CASE WHEN lpd.identity = "imported" THEN lpd.l_id END) AS importlead,
//     COUNT(CASE WHEN lpd.clicked = 0 THEN lpd.l_id END) AS freshlead,
//     COUNT(CASE WHEN lrd.assign_status = '' THEN lpd.l_id END) AS nonassignlead,
//     COUNT(CASE WHEN lrd.assign_status = 'Yes' THEN lpd.l_id END) AS assign_lead, COUNT(CASE WHEN DATE(lrd.followup_dt) < ? AND lrd.followup = 'Yes' THEN lpd.l_id END) AS missedlead,
//     COUNT(CASE WHEN DATE(lrd.followup_dt) > ? AND lrd.followup = 'Yes' THEN lpd.l_id END) AS upcominglead,
//     COUNT(CASE WHEN DATE(lrd.followup_dt) = ? AND lrd.followup = 'Yes' THEN lpd.l_id END) AS persentlead FROM crm_lead_req_details AS lrd JOIN crm_lead_primary_details AS lpd ON lrd.l_id = lpd.l_id WHERE lrd.assignto_id = ?`;

//     // Define query parameters
//     const params = [system_date, system_date, system_date, user_id];
//     // Execute the query using handleQuery
//     handleQuery(query, params);
//   }
// });

// LeftsidebarRouter.post("/get-sub-menu-lead-counting", (req, res) => {
//   // Extract user_id and user_role from the session data in the request
//   const user_id = req.session.user[0].u_id;
//   const user_role = req.session.user[0].urole;

//   // Initialize a commonCondition variable based on user_role
//   let commonCondition = "";
//   if (user_role === "Master" || user_role === "Admin") {
//     commonCondition = ` status NOT IN ('Broker', 'Dead', 'Booking Done', 'Wrong Number', 'Not Interested', 'NI')`;
//   } else {
//     commonCondition = ` lrd.status NOT IN ('Broker', 'Dead', 'Booking Done', 'Wrong Number', 'Not Interested', 'NI')`;
//   }

//   // Define a function to execute a database query
//   const handleQuery = (query, params) => {
//     // Get a connection from the database connection pool
//     pool.getConnection((error, connection) => {
//       if (error) {
//         console.error(error);
//         // Send a 500 Internal Server Error response if there's a database connection error
//         res.status(500).send("Internal Server Error");
//         return;
//       }
//       // Execute the query with the provided parameters
//       connection.query(query, params, (err, result) => {
//         // Release the database connection
//         connection.release();
//         if (err) {
//           console.error(err);
//           // Send a 500 Internal Server Error response if there's a query error
//           res.status(500).send("Internal Server Error");
//           return;
//         } else {
//           // Send the query result as a response to the client
//           res.send(result);
//         }
//       });
//     });
//   };

//   // Check user_role to determine which SQL query to execute
//   if (user_role === "Master" || user_role === "Admin") {
//     const query = `
//       SELECT
//         COUNT(CASE WHEN identity != "imported" THEN l_id END) AS totallead,
//         COUNT(CASE WHEN identity = 'imported' THEN l_id END) AS importlead,
//         COUNT (CASE WHEN clicked=0 THEN l_id END) AS freshlead,
//         COUNT(CASE WHEN assign_status = ? THEN l_id END) AS assign_lead,
//         COUNT(CASE WHEN DATE(followup_dt) = ? AND followup = 'yes' AND ${commonCondition} THEN l_id END) AS persentlead,
//         COUNT(CASE WHEN assign_status = '' THEN l_id END) AS nonassignlead,
//         COUNT(CASE WHEN DATE(followup_dt) > ? AND followup = ? THEN l_id END) AS upcominglead,
//         COUNT(CASE WHEN DATE(followup_dt) < ? AND followup = ? THEN l_id END) AS missedlead
//       FROM crm_lead_primary_details
//     `;
//     // Define query parameters
//     const params = ["Yes", system_date, system_date, "Yes", system_date, "Yes"];
//     // Execute the query using handleQuery
//     handleQuery(query, params);
//   } else {
//     const query = `SELECT
//     COUNT(CASE WHEN lpd.identity != "imported" THEN lpd.l_id END) AS totallead,
//     COUNT(CASE WHEN lpd.identity = "imported" THEN lpd.l_id END) AS importlead,
//     COUNT(CASE WHEN lpd.clicked = 0 THEN lpd.l_id END) AS freshlead,
//     COUNT(CASE WHEN lrd.assign_status = '' THEN lpd.l_id END) AS nonassignlead,
//     COUNT(CASE WHEN lrd.assign_status = 'Yes' THEN lpd.l_id END) AS assign_lead, COUNT(CASE WHEN DATE(lrd.followup_dt) < ? AND lrd.followup = 'Yes' THEN lpd.l_id END) AS missedlead,
//     COUNT(CASE WHEN DATE(lrd.followup_dt) > ? AND lrd.followup = 'Yes' THEN lpd.l_id END) AS upcominglead,
//     COUNT(CASE WHEN DATE(lrd.followup_dt) = ? AND lrd.followup = 'Yes' THEN lpd.l_id END) AS persentlead FROM crm_lead_req_details AS lrd JOIN crm_lead_primary_details AS lpd ON lrd.l_id = lpd.l_id WHERE lrd.assignto_id = ?`;

//     // Define query parameters
//     const params = [system_date, system_date, system_date, user_id];
//     // Execute the query using handleQuery
//     handleQuery(query, params);
//   }
// });

LeftsidebarRouter.post("/get-sub-menu-lead-counting", (req, res) => {
  // Extract user_id and user_role from the session data in the request
  const user_id = req.session.user[0].u_id;
  const user_role = req.session.user[0].urole;

  // Initialize a commonCondition variable based on user_role
  let commonCondition = "";
  if (user_role === "Master" || user_role === "Admin") {
    commonCondition = ` status NOT IN ('Broker', 'Dead', 'Booking Done', 'Wrong Number', 'Not Interested', 'NI')`;
  } else {
    commonCondition = ` lrd.status NOT IN ('Broker', 'Dead', 'Booking Done', 'Wrong Number', 'Not Interested', 'NI')`;
  }

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
    const query = `
      SELECT
        COUNT(CASE WHEN COALESCE(identity, '') != "imported" THEN l_id END) AS totallead,
        COUNT(CASE WHEN identity = 'imported' THEN l_id END) AS importlead,
        COUNT (CASE WHEN clicked=0 THEN l_id END) AS freshlead,
        COUNT(CASE WHEN assign_status = ? THEN l_id END) AS assign_lead,
        COUNT(CASE WHEN DATE(followup_dt) = ? AND followup = 'yes' AND ${commonCondition} THEN l_id END) AS persentlead,
        COUNT(CASE WHEN assign_status = '' THEN l_id END) AS nonassignlead,
        COUNT(CASE WHEN DATE(followup_dt) > ? AND followup = ? THEN l_id END) AS upcominglead,
        COUNT(CASE WHEN DATE(followup_dt) < ? AND followup = ? THEN l_id END) AS missedlead
      FROM crm_lead_primary_details
    `;
    // Define query parameters
    const params = ["Yes", system_date, system_date, "Yes", system_date, "Yes"];
    // Execute the query using handleQuery
    handleQuery(query, params);
  } else {
    const query = `SELECT 
    COUNT(CASE WHEN COALESCE(lpd.identity, '') != 'imported' THEN lpd.l_id END) AS totallead, 
    COUNT(CASE WHEN lpd.identity = "imported" THEN lpd.l_id END) AS importlead,
    COUNT(CASE WHEN lpd.clicked = 0 THEN lpd.l_id END) AS freshlead,
    COUNT(CASE WHEN lrd.assign_status = '' THEN lpd.l_id END) AS nonassignlead, 
    COUNT(CASE WHEN lrd.assign_status = 'Yes' THEN lpd.l_id END) AS assign_lead, COUNT(CASE WHEN DATE(lrd.followup_dt) < ? AND lrd.followup = 'Yes' THEN lpd.l_id END) AS missedlead, 
    COUNT(CASE WHEN DATE(lrd.followup_dt) > ? AND lrd.followup = 'Yes' THEN lpd.l_id END) AS upcominglead, 
    COUNT(CASE WHEN DATE(lrd.followup_dt) = ? AND lrd.followup = 'Yes' THEN lpd.l_id END) AS persentlead FROM crm_lead_req_details AS lrd JOIN crm_lead_primary_details AS lpd ON lrd.l_id = lpd.l_id WHERE lrd.assignto_id = ?`;

    // Define query parameters
    const params = [system_date, system_date, system_date, user_id];
    // Execute the query using handleQuery
    handleQuery(query, params);
  }
});

// Define a route handler for a POST request to the endpoint "/get-sub-menu-counting"
LeftsidebarRouter.post("/get-sub-menu-candidate-counting", (req, res) => {
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
  if (
    user_role === "Master" ||
    user_role === "Admin" ||
    user_role === "HR Head"
  ) {
    // Construct an SQL query to count various lead types using conditional aggregation
    const query = `SELECT COUNT(c_id) AS totalcandidate, COUNT(CASE WHEN assign_by != ? AND assign_to != ? THEN c_id END) AS assigncandidate, COUNT(CASE WHEN assign_by = ? AND assign_to = ? THEN c_id END) AS nonassigncandidate FROM crm_candidate_details`;
    // Define query parameters
    const params = ["0", "0", "0", "0"];
    // Execute the query using handleQuery
    handleQuery(query, params);
  } else if (user_role === "HR") {
    // Construct a different SQL query for non-Master/Admin users
    const query = `SELECT COUNT(c_id) AS totalcandidate, COUNT(CASE WHEN assign_by = ? THEN c_id END) AS assigncandidate, COUNT(CASE WHEN assign_by = ? AND assign_to = ? THEN c_id END) AS nonassigncandidate FROM crm_candidate_details WHERE assign_to = ? OR created_by = ?`;

    // Define query parameters
    const params = [user_id, "0", "0", user_id, user_id];
    // Execute the query using handleQuery
    handleQuery(query, params);
  }
});

LeftsidebarRouter.post("/upadte-user-attendance", (req, res) => {
  const ImgName = "" + dayjs().format("DD-MM-YYYY-hh-mm-ss") + ".png";
  let logout_date = "0000-00-00";
  let logout_time = "00:00:00";

  if (req.body.status === true) {
    pool.getConnection(function (error, connection) {
      if (error) throw error;
      connection.query(
        "UPDATE crm_users_attendance SET ?? = ?, ?? = ?, ?? = ? WHERE ?? = ? AND ?? = ? AND ?? = ? AND ?? = ?",
        [
          "logout_date",
          system_date,
          "logout_time",
          system_time,
          "desk_image_logout",
          ImgName,
          "u_id",
          req.session.user[0].u_id,
          "login_date",
          system_date,
          "logout_date",
          logout_date,
          "logout_time",
          logout_time,
        ],
        (err, result) => {
          if (err) {
            console.log(err);
          } else {
            let base64Image = req.body.UserImage.split(";base64,").pop();
            fs.writeFile(
              "./uploads/attendance/" +
                req.session.user[0].username +
                "/" +
                ImgName,
              base64Image,
              { encoding: "base64" },
              function (err) {
                console.log(err);
              }
            );
            res.send(false);
          }
          connection.release();
        }
      );
    });
  } else {
    pool.getConnection(function (error, connection) {
      if (error) throw error;
      connection.query(
        "INSERT INTO crm_users_attendance (??, ??, ??, ??, ??) VALUES(?,?,?,?,?)",
        [
          "u_id",
          "system_ip",
          "login_date",
          "login_time",
          "desk_image_login",
          req.session.user[0].u_id,
          req.body.system_ip,
          system_date,
          system_time,
          ImgName,
        ],
        (err, result) => {
          if (err) {
            console.log(err);
          } else {
            let base64Image = req.body.UserImage.split(";base64,").pop();
            fs.writeFile(
              "./uploads/attendance/" +
                req.session.user[0].username +
                "/" +
                ImgName,
              base64Image,
              { encoding: "base64" },
              function (err) {
                console.log(err);
              }
            );
            res.send(true);
          }
          connection.release();
        }
      );
    });
  }
});

// Define a route handler for a POST request to the endpoint "/get-sub-menu-counting"
LeftsidebarRouter.post("/get-sub-menu-loan-counting", (req, res) => {
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
  // if (
  //   user_role === "Master" ||
  //   user_role === "Admin"
  // ) {
  // Construct an SQL query to count various lead types using conditional aggregation
  const query = `SELECT COUNT(loan_id) AS totalloan FROM crm_loan_details`;
  // Define query parameters
  const params = ["0", "0", "0", "0"];
  // Execute the query using handleQuery
  handleQuery(query, params);
  // } else if (user_role === "HR") {
  //   // Construct a different SQL query for non-Master/Admin users
  //   const query = SELECT COUNT(c_id) AS totalcandidate, COUNT(CASE WHEN assign_by = ? THEN c_id END) AS assigncandidate, COUNT(CASE WHEN assign_by = ? AND assign_to = ? THEN c_id END) AS nonassigncandidate FROM crm_candidate_details WHERE assign_to = ? OR created_by = ?;

  //   // Define query parameters
  //   const params = [user_id, "0", "0", user_id, user_id];
  //   // Execute the query using handleQuery
  //   handleQuery(query, params);
  // }
});

// Define a route handler for a POST request to the endpoint "/get-sub-menu-counting"
LeftsidebarRouter.post("/get-sub-menu-broker-counting", (req, res) => {
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
    const query = `SELECT COUNT(brk_id) AS totalbroker FROM crm_broker_details`;
    // Define query parameters
    const params = ["0", "0", "0", "0"];
    // Execute the query using handleQuery
    handleQuery(query, params);
  } else {
    // Construct a different SQL query for non-Master/Admin users
    // const query = `SELECT COUNT(c_id) AS totalcandidate, COUNT(CASE WHEN assign_by = ? THEN c_id END) AS assigncandidate, COUNT(CASE WHEN assign_by = ? AND assign_to = ? THEN c_id END) AS nonassigncandidate FROM crm_candidate_details WHERE assign_to = ? OR created_by = ?`;

    const query = `SELECT COUNT(brk_id) AS totalbroker FROM crm_broker_details where u_id = ?`;
    // Define query parameters
    const params = [user_id];
    // Execute the query using handleQuery
    handleQuery(query, params);
  }
});

// for ES5
module.exports = LeftsidebarRouter;
