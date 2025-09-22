// for ES5
const express = require("express");
const pool = require("../../Database.js");
const dayjs = require("dayjs");
const { json } = require("body-parser");

const FreshLeadRouter = express.Router();

FreshLeadRouter.post("/get-fresh-lead-count", (req, res) => {

  const user_role = req.session.user[0].urole;
  const user_id = req.session.user[0].u_id;

  if (user_role === "Master" || user_role === "Admin") {
    pool.getConnection(function (error, connection) {
      if (error) throw error;
      connection.query(
        "SELECT COUNT(l_id) AS newlead_count FROM crm_lead_primary_details WHERE clicked = ?",
        [0],
        (err, result) => {
          if (err) {
            console.log("error");
            res.status(500).json({ error: "Database query error" });
          } else {
            res.json(result[0].newlead_count);
          }
          connection.release();
        }
      );
    });
  } else {
    pool.getConnection(function (error, connection) {
      if (error) throw error;
      connection.query(
        "SELECT COUNT(crm_lead_req_details.l_id) AS newlead_count FROM crm_lead_req_details WHERE clicked = ? AND crm_lead_req_details.assignto_id = ?",
        [0, user_id],
        (err, result) => {
          if (err) {
            console.log("error");
            res.status(500).json({ error: "Database query error" });
          } else {
            res.json(result[0].newlead_count);
          }
          connection.release();
        }
      );
    });
  }
});

// FreshLeadRouter.get("/get-fresh-lead-table-data", (req, res) => {

//   const user_role = req.session.user[0].urole;
//   const user_id = req.session.user[0].u_id;
//   const { page, pageSize } = req.query;
//   const offset = (page - 1) * pageSize;
//   const limit = parseInt(pageSize);

//   let query = "";
//   let queryParams = [];

//   if (user_role === "Master" || user_role === "Admin") {
//     query = `
//         SELECT crm_lead_primary_details.l_id AS l_id, crm_lead_req_details.lreq_id AS assignlead_id, 
//                crm_lead_primary_details.create_dt, crm_lead_primary_details.lname, 
//                crm_lead_primary_details.p_ccode, crm_lead_primary_details.p_mob, 
//                crm_lead_primary_details.p_email, crm_lead_primary_details.status, 
//                crm_lead_primary_details.pname, crm_lead_primary_details.followup, 
//                crm_lead_primary_details.followup_dt, crm_lead_primary_details.source, 
//                crm_lead_primary_details.city, crm_lead_primary_details.locality, 
//                crm_lead_primary_details.sub_locality,crm_lead_status.color ,crm_lead_primary_details.buyer_type,crm_lead_primary_details.investment_type ,crm_lead_primary_details.post_handover,
//                crm_lead_primary_details.clicked 
//         FROM crm_lead_primary_details 
//         LEFT JOIN crm_lead_status ON crm_lead_primary_details.status = crm_lead_status.status 
//         LEFT JOIN crm_lead_req_details ON crm_lead_primary_details.l_id = crm_lead_req_details.l_id 
//         WHERE crm_lead_primary_details.clicked = ? 
//         ORDER BY crm_lead_primary_details.l_id DESC 
//         LIMIT ? OFFSET ?`;
//     queryParams = [0, limit, offset];
//   } else {
//     query = `
//         SELECT crm_lead_req_details.lreq_id AS l_id, crm_lead_req_details.l_id AS assignlead_id, 
//                crm_lead_req_details.create_dt, crm_lead_primary_details.lname, 
//                crm_lead_primary_details.p_ccode, crm_lead_primary_details.p_mob, 
//                crm_lead_primary_details.p_email, crm_lead_req_details.status, 
//                crm_lead_primary_details.pname, crm_lead_primary_details.followup, 
//                crm_lead_primary_details.followup_dt, crm_lead_primary_details.source, 
//                crm_lead_primary_details.city, crm_lead_primary_details.locality, 
//                crm_lead_primary_details.sub_locality,crm_lead_primary_details.buyer_type,crm_lead_primary_details.investment_type ,crm_lead_primary_details.post_handover , crm_lead_status.color, 
//                crm_lead_req_details.clicked 
//         FROM crm_lead_req_details 
//         JOIN crm_lead_primary_details ON crm_lead_req_details.l_id = crm_lead_primary_details.l_id 
//         LEFT JOIN crm_lead_status ON crm_lead_req_details.status = crm_lead_status.status 
//         WHERE crm_lead_req_details.clicked = ? AND crm_lead_req_details.assignto_id = ? 
//         ORDER BY crm_lead_req_details.lreq_id DESC 
//         LIMIT ? OFFSET ?`;
//     queryParams = [0, user_id, limit, offset];
//   }

//   pool.getConnection((error, connection) => {
//     if (error) throw error;

//     connection.query(query, queryParams, (err, result) => {
//       if (err) {
//         console.log(err);
//         res.status(500).json({ error: "Database query error" });
//         connection.release();
//       } else {
//         res.json(result);

//         if (
//           result.length > 0 &&
//           user_role !== "Master" &&
//           user_role !== "Admin"
//         ) {
//           const leadIds = result.map((lead) => lead.l_id);

//           // Update the clicked status for the fetched leads
//           const updateQuery = `
//               UPDATE crm_lead_primary_details 
//               SET clicked = 1 
//               WHERE l_id IN (?)`;

//           connection.query(updateQuery, [leadIds], (updateErr) => {
//             if (updateErr) {
//               console.log(
//                 "Error updating clicked status for fetched leads:",
//                 updateErr
//               );
//             } else {
//               // Additionally, update clicked status for Master and Admin
//               const updateMasterAdminQuery = `
//                   UPDATE crm_lead_primary_details 
//                   SET clicked = 1 
//                   WHERE l_id IN (?) AND (EXISTS (
//                     SELECT 1 FROM crm_users WHERE crm_users.u_id = crm_lead_primary_details.assigned_user_id 
//                     AND crm_users.urole IN ('Master', 'Admin')))`;

//               connection.query(
//                 updateMasterAdminQuery,
//                 [leadIds],
//                 (masterAdminErr) => {
//                   if (masterAdminErr) {
//                     console.log(
//                       "Error updating clicked status for Master/Admin:",
//                       masterAdminErr
//                     );
//                   }
//                   connection.release();
//                 }
//               );
//             }
//           });
//         } else {
//           connection.release();
//         }
//       }
//     });
//   });
// });

FreshLeadRouter.get("/get-fresh-lead-table-data", (req, res) => {
  const user_role = req.session.user[0].urole;
  const user_id = req.session.user[0].u_id;
  const { page, pageSize } = req.query;
  const offset = (page - 1) * pageSize;
  const limit = parseInt(pageSize);

  if (user_role === "Master" || user_role === "Admin") {
    pool.getConnection(function (error, connection) {
      if (error) throw error;
      connection.query(
        "SELECT crm_lead_primary_details.l_id AS l_id, crm_lead_req_details.lreq_id AS assignlead_id, crm_lead_primary_details.create_dt, crm_lead_primary_details.lname, crm_lead_primary_details.lead_priority,crm_lead_primary_details.p_ccode, crm_lead_primary_details.p_mob, crm_lead_primary_details.p_email, crm_lead_primary_details.status, crm_lead_primary_details.pname, crm_lead_primary_details.followup, crm_lead_primary_details.followup_dt, crm_lead_primary_details.source, crm_lead_primary_details.city, crm_lead_primary_details.locality, crm_lead_primary_details.sub_locality, crm_lead_status.color, crm_lead_primary_details.clicked FROM crm_lead_primary_details LEFT JOIN crm_lead_status ON crm_lead_primary_details.status = crm_lead_status.status LEFT JOIN crm_lead_req_details ON crm_lead_primary_details.l_id = crm_lead_req_details.l_id WHERE crm_lead_primary_details.clicked = ? ORDER BY crm_lead_primary_details.l_id DESC LIMIT ? OFFSET ?",
        [0, limit, offset],
        (err, result) => {
          if (err) {
            console.log(error);
            res.status(500).json({ error: "Database query error" });
          } else {
            res.json(result);
          }
          connection.release();
        }
      );
    });
  } else if (user_role === "Team Leader") {
    pool.getConnection(function (error, connection) {
      if (error) throw error;
      connection.query(
        "SELECT crm_lead_req_details.lreq_id AS l_id, crm_lead_req_details.l_id AS assignlead_id, crm_lead_req_details.create_dt, crm_lead_primary_details.lname, crm_lead_primary_details.lead_priority,crm_lead_primary_details.p_ccode, crm_lead_primary_details.p_mob, crm_lead_primary_details.p_email, crm_lead_req_details.status, crm_lead_primary_details.pname, crm_lead_primary_details.followup, crm_lead_primary_details.followup_dt, crm_lead_primary_details.source, crm_lead_primary_details.city, crm_lead_primary_details.locality, crm_lead_primary_details.sub_locality, crm_lead_status.color, crm_lead_req_details.clicked FROM crm_lead_req_details JOIN crm_lead_primary_details ON crm_lead_req_details.l_id = crm_lead_primary_details.l_id LEFT JOIN crm_lead_status ON crm_lead_req_details.status = crm_lead_status.status WHERE crm_lead_req_details.clicked = ? AND crm_lead_req_details.assignto_id = ? ORDER BY crm_lead_req_details.lreq_id DESC LIMIT ? OFFSET ?",
        [0, user_id, limit, offset],
        (err, result) => {
          if (err) {
            console.log(err);
            res.status(500).json({ error: "Database query error" });
          } else {
            res.json(result);
          }
          connection.release();
        }
      );
    });
  } else if (user_role === "Sales Manager") {
    pool.getConnection(function (error, connection) {
      if (error) throw error;
      connection.query(
        "SELECT crm_lead_req_details.lreq_id AS l_id, crm_lead_req_details.l_id AS assignlead_id, crm_lead_req_details.create_dt, crm_lead_primary_details.lname, crm_lead_primary_details.lead_priority,crm_lead_primary_details.p_ccode, crm_lead_primary_details.p_mob, crm_lead_primary_details.p_email, crm_lead_req_details.status, crm_lead_primary_details.pname, crm_lead_primary_details.followup, crm_lead_primary_details.followup_dt, crm_lead_primary_details.source, crm_lead_primary_details.city, crm_lead_primary_details.locality, crm_lead_primary_details.sub_locality, crm_lead_status.color, crm_lead_req_details.clicked FROM crm_lead_req_details JOIN crm_lead_primary_details ON crm_lead_req_details.l_id = crm_lead_primary_details.l_id LEFT JOIN crm_lead_status ON crm_lead_req_details.status = crm_lead_status.status WHERE crm_lead_req_details.clicked = ? AND crm_lead_req_details.assignto_id = ? ORDER BY crm_lead_req_details.lreq_id DESC LIMIT ? OFFSET ?",
        [0, user_id, limit, offset],
        (err, result) => {
          if (err) {
            console.log(err);
            res.status(500).json({ error: "Database query error" });
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
        "SELECT crm_lead_req_details.lreq_id AS l_id, crm_lead_req_details.l_id AS assignlead_id, crm_lead_req_details.create_dt, crm_lead_primary_details.lname, crm_lead_primary_details.p_ccode, crm_lead_primary_details.p_mob, crm_lead_primary_details.p_email, crm_lead_req_details.status, crm_lead_primary_details.pname, crm_lead_primary_details.followup, crm_lead_primary_details.followup_dt, crm_lead_primary_details.source, crm_lead_primary_details.city, crm_lead_primary_details.locality, crm_lead_primary_details.sub_locality, crm_lead_status.color, crm_lead_req_details.clicked FROM crm_lead_req_details JOIN crm_lead_primary_details ON crm_lead_req_details.l_id = crm_lead_primary_details.l_id LEFT JOIN crm_lead_status ON crm_lead_req_details.status = crm_lead_status.status WHERE crm_lead_req_details.clicked = ? AND crm_lead_req_details.assignto_id = ? ORDER BY crm_lead_req_details.lreq_id DESC LIMIT ? OFFSET ?",
        [0, user_id, limit, offset],
        (err, result) => {
          if (err) {
            console.log(err);
            res.status(500).json({ error: "Database query error" });
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
module.exports = FreshLeadRouter;