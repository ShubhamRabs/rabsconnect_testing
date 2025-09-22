// for ES5
const express = require("express");
const pool = require("../../Database.js");
const dayjs = require("dayjs");

const NonAssignLeadRouter = express.Router();

NonAssignLeadRouter.get("/get-nonassign-lead-table-data", (req, res) => {
  const user_role = req.session.user[0].urole;
  const user_id = req.session.user[0].u_id;
  const { page, pageSize } = req.query;
  const offset = (page - 1) * pageSize;
  const limit = parseInt(pageSize);

  if (user_role === "Master" || user_role === "Admin") {
    pool.getConnection(function (error, connection) {
      if (error) throw error;
      connection.query(
        `SELECT 
          lpd.l_id AS l_id, 
          lrd.lreq_id AS assignlead_id, 
          GROUP_CONCAT(cu.username) AS assign_users,
          lpd.create_dt, 
          lpd.lname, 
          CONCAT(lpd.p_ccode, ' ', lpd.p_mob) AS mobile, 
          lpd.p_ccode, 
          lpd.p_mob, 
          lpd.s_ccode, 
          lpd.s_mob, 
          lpd.p_email, 
          lpd.status as admin_status, 
          GROUP_CONCAT(lrd.status,' - ', cu.username) AS users_status,
          lpd.pname, 
          lpd.followup, 
          lpd.followup_dt, 
          lpd.source, 
          lpd.city, 
          lpd.locality, 
          lpd.sub_locality, 
          lpd.comments, 
          ls.color, 
          lpd.clicked, 
          lpd.source_type, 
          lpd.service_type, 
          lpd.ptype, 
          lpd.pcategory, 
          lpd.pconfiguration, 
          lpd.min_area, 
          lpd.max_area, 
          lpd.area_unit, 
          lpd.min_price, 
          lpd.max_price, 
          lpd.price_unit, 
          lpd.country, 
          lpd.state, 
          lpd.other_details,  
          lpd.assign_status,
          latest_status.status AS latest_status,
          latest_status.color AS latest_status_color,
          latest_status.username AS latest_username
        FROM crm_lead_primary_details AS lpd 
        LEFT JOIN crm_lead_req_details AS lrd ON lrd.l_id = lpd.l_id 
        LEFT JOIN crm_lead_status AS ls ON ls.status = lpd.status 
        LEFT JOIN crm_users AS cu ON cu.u_id = lrd.assignto_id 
        LEFT JOIN (
          SELECT 
            lrd1.l_id,
            lrd1.status,
            ls1.color,
            cu1.username,
            lrd1.create_dt
          FROM crm_lead_req_details lrd1
          LEFT JOIN crm_lead_status ls1 ON ls1.status = lrd1.status
          LEFT JOIN crm_users cu1 ON cu1.u_id = lrd1.assignto_id
          WHERE lrd1.create_dt = (
            SELECT MAX(create_dt) 
            FROM crm_lead_req_details 
            WHERE l_id = lrd1.l_id
          )
        ) AS latest_status ON latest_status.l_id = lpd.l_id
        WHERE lpd.assign_status = ? 
        GROUP BY lpd.l_id 
        ORDER BY lpd.l_id DESC 
        LIMIT ? OFFSET ?`,
        [" ", limit, offset],
        (err, result) => {
          if (err) {
            console.log(error);
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
        `SELECT 
          lrd.lreq_id AS l_id, 
          lrd.l_id AS assignlead_id, 
          lp.create_dt, 
          lp.lname, 
          lrd.status, 
          lrd.pname, 
          lp.source, 
          ls.color, 
          lrd.clicked, 
          GROUP_CONCAT(cu.username) AS assign_users, 
          CONCAT(lp.p_ccode, ' ', lp.p_mob) AS mobile, 
          lp.p_ccode,
          lp.p_mob, 
          lp.p_email, 
          GROUP_CONCAT(lrd.status,' - ', cu.username) AS users_status, 
          lp.pname, 
          lrd.followup, 
          lrd.followup_dt, 
          lp.city, 
          lp.sub_locality, 
          lrd.comments, 
          lp.source_type, 
          lp.service_type, 
          lp.ptype, 
          lp.pcategory, 
          lp.pconfiguration, 
          lp.min_area, 
          lp.max_area, 
          lp.area_unit, 
          lp.min_price, 
          lp.max_price, 
          lp.price_unit, 
          lp.country, 
          lp.state, 
          lp.other_details, 
          lp.assign_status,
          latest_status.status AS latest_status,
          latest_status.color AS latest_status_color,
          latest_status.username AS latest_username
        FROM crm_lead_req_details AS lrd 
        JOIN crm_lead_primary_details AS lp ON lp.l_id = lrd.l_id 
        LEFT JOIN crm_lead_status AS ls ON lrd.status = ls.status 
        LEFT JOIN crm_users AS cu ON cu.u_id = lrd.assignto_id 
        LEFT JOIN (
          SELECT 
            lrd1.l_id,
            lrd1.status,
            ls1.color,
            cu1.username,
            lrd1.create_dt
          FROM crm_lead_req_details lrd1
          LEFT JOIN crm_lead_status ls1 ON ls1.status = lrd1.status
          LEFT JOIN crm_users cu1 ON cu1.u_id = lrd1.assignto_id
          WHERE lrd1.create_dt = (
            SELECT MAX(create_dt) 
            FROM crm_lead_req_details 
            WHERE l_id = lrd1.l_id AND assignto_id = ?
          )
        ) AS latest_status ON latest_status.l_id = lrd.l_id
        WHERE lrd.assignto_id = ? AND lrd.assign_status = ? 
        GROUP BY lrd.lreq_id 
        ORDER BY lrd.lreq_id DESC 
        LIMIT ? OFFSET ?`,
        [user_id, user_id, " ", limit, offset],
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

NonAssignLeadRouter.post("/get-nonassign-lead-table-data-count", (req, res) => {
  const user_role = req.session.user[0].urole;
  const user_id = req.session.user[0].u_id;
  if (user_role === "Master" || user_role === "Admin") {
    pool.getConnection(function (error, connection) {
      if (error) throw error;
      connection.query(
        "SELECT COUNT(l_id) AS totalNonAssignCount FROM crm_lead_primary_details WHERE assign_status = ?",
        [" "],
        (err, result) => {
          if (err) {
            console.log("error");
          } else {
            res.json(result[0].totalNonAssignCount);
          }
          connection.release();
        }
      );
    });
  } else {
    pool.getConnection(function (error, connection) {
      if (error) throw error;
      connection.query(
        "SELECT COUNT(crm_lead_primary_details.l_id) AS totalCount FROM crm_lead_req_details JOIN crm_lead_primary_details ON crm_lead_primary_details.l_id = crm_lead_req_details.l_id WHERE crm_lead_req_details.assignto_id = ? AND crm_lead_req_details.assign_status = ?",
        [user_id, " "],
        (err, result) => {
          if (err) {
            console.log(err);
          } else {
            res.json(result[0].totalCount);
          }
          connection.release();
        }
      );
    });
  }
});

NonAssignLeadRouter.post(
  "/get-teammember-nonassignlead-Count",
  async (req, res) => {
    const user_id = req.body.u_id;
    const user_role = req.session.user[0].urole;
    const assign_status = ""; // Non-assigned status value to filter on

    console.log(req.body, user_id, "Processing non-assigned lead count");

    if (user_role === "Master" || user_role === "Admin") {
      pool.getConnection(function (error, connection) {
        if (error) {
          console.log("Database connection error:", error);
          res.status(500).send({ error: "Database connection error" });
          return;
        }
        connection.query(
          "SELECT COUNT(lrd.lreq_id) AS status_count FROM crm_lead_req_details AS lrd JOIN crm_lead_primary_details AS lp ON lp.l_id = lrd.l_id WHERE lrd.assignto_id = ? AND lrd.assign_status = ?",
          [user_id, assign_status],
          (err, result) => {
            if (err) {
              console.log("Query error:", err);
              res.status(500).send({ error: "Database query error" });
              return;
            }
            res.send(result);
            connection.release();
          }
        );
      });
    } else {
      pool.getConnection(function (error, connection) {
        if (error) {
          console.log("Database connection error:", error);
          res.status(500).send({ error: "Database connection error" });
          return;
        }
        connection.query(
          "SELECT COUNT(lreq_id) AS status_count FROM crm_lead_req_details WHERE assignto_id = ? AND assign_status = ?",
          [user_id, assign_status],
          (err, result) => {
            if (err) {
              console.log("Query error:", err);
              res.status(500).send({ error: "Database query error" });
              return;
            }
            res.send(result);
            connection.release();
          }
        );
      });
    }
  }
);

// for ES5
module.exports = NonAssignLeadRouter;
