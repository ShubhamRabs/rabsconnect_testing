// for ES5
const express = require("express");
const pool = require("../../Database.js");
const dayjs = require("dayjs");

const AssignLeadRouter = express.Router();

AssignLeadRouter.get("/get-assign-lead-table-data", (req, res) => {
  const user_role = req.session.user[0].urole;
  const user_id = req.session.user[0].u_id;
  const { page, pageSize } = req.query;
  const offset = (page - 1) * pageSize;
  const limit = parseInt(pageSize);

  if (user_role === "Master" || user_role === "Admin") {
    pool.getConnection(function (error, connection) {
      if (error) throw error;

      const query = `
        SELECT 
          lpd.l_id AS l_id, 
          lrd.lreq_id AS assignlead_id, 
          GROUP_CONCAT(DISTINCT cu.username ORDER BY cu.username) AS assign_users, 
          CONCAT(IFNULL(GROUP_CONCAT(lrd.comments SEPARATOR '~'), '~'), '~', IFNULL(lpd.comments, '~')) AS comments, 
          lpd.create_dt, lpd.lname, 
          CONCAT(lpd.p_ccode, ' ', lpd.p_mob) AS mobile, 
          lpd.p_ccode, lpd.p_mob, lpd.s_ccode, lpd.s_mob, lpd.p_email,
          lpd.lead_priority, lpd.status as admin_status, 
          GROUP_CONCAT(CONCAT(lrd.status, ' - ', cu.username) ORDER BY lrd.status) AS users_status,
          lpd.pname, lpd.followup, lpd.followup_dt, lpd.source, lpd.city, lpd.locality, 
          lpd.sub_locality, ls.color, lpd.clicked, lpd.source_type, lpd.service_type, 
          lpd.ptype, lpd.pcategory, lpd.pconfiguration, lpd.min_area, lpd.max_area, 
          lpd.area_unit, lpd.min_price, lpd.max_price, lpd.price_unit, lpd.country, 
          lpd.state, lpd.other_details, lpd.assign_status,
          clh_latest.status AS latest_status,
          cu_latest.username AS latest_username,
          ls_latest.color AS latest_status_color
        FROM crm_lead_primary_details AS lpd 
        LEFT JOIN crm_lead_req_details AS lrd ON lrd.l_id = lpd.l_id 
        LEFT JOIN crm_lead_status AS ls ON ls.status = lpd.status 
        LEFT JOIN crm_users AS cu ON cu.u_id = lrd.assignto_id
        LEFT JOIN (
          SELECT clh.l_id, clh.status, clh.u_id
          FROM crm_lead_history AS clh
          INNER JOIN (
            SELECT l_id, MAX(update_dt) AS max_update_dt
            FROM crm_lead_history
            GROUP BY l_id
          ) AS clh_max ON clh.l_id = clh_max.l_id AND clh.update_dt = clh_max.max_update_dt
        ) AS clh_latest ON clh_latest.l_id = lpd.l_id
        LEFT JOIN crm_users AS cu_latest ON cu_latest.u_id = clh_latest.u_id
        LEFT JOIN crm_lead_status AS ls_latest ON ls_latest.status = clh_latest.status
        WHERE lpd.assign_status = ? 
        GROUP BY lpd.l_id 
        ORDER BY CASE WHEN lpd.clicked = 0 THEN 0 ELSE 1 END, lpd.l_id DESC 
        LIMIT ? OFFSET ?
      `;

      connection.query(query, ["Yes", limit, offset], (err, result) => {
        if (err) {
          console.log(error);
        } else {
          res.json(result);
        }
        connection.release();
      });
    });
  } else {
    pool.getConnection(function (error, connection) {
      if (error) throw error;

      const query = `
        SELECT 
          lrd.lreq_id AS l_id, 
          lrd.l_id AS assignlead_id, 
          lp.create_dt, 
          lp.lname, 
          lrd.status, 
          lrd.pname, 
          lp.source, 
          ls.color, 
          lrd.clicked, 
          GROUP_CONCAT(DISTINCT cu.username ORDER BY cu.username) AS assign_users, 
          CONCAT(
            IFNULL(
              (SELECT GROUP_CONCAT(comments SEPARATOR '~') 
               FROM crm_lead_req_details 
               WHERE l_id = lp.l_id AND (assignto_id = ? OR assignby_id = ?)
              ), 
              '~'
            ),
            '~',
            IFNULL(lp.comments, '~')
          ) AS comments, 
          CONCAT(lp.p_ccode, ' ', lp.p_mob) AS mobile, 
          lp.p_ccode, 
          lp.p_mob, 
          lp.p_email, 
          GROUP_CONCAT(CONCAT(lrd.status, ' - ', cu.username) ORDER BY lrd.status) AS users_status, 
          lp.pname, 
          lrd.followup, 
          lrd.followup_dt, 
          lp.city, 
          lp.sub_locality, 
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
          clh_latest.status AS latest_status,
          cu_latest.username AS latest_username,
          ls_latest.color AS latest_status_color
        FROM crm_lead_req_details AS lrd 
        JOIN crm_lead_primary_details AS lp ON lp.l_id = lrd.l_id 
        LEFT JOIN crm_lead_status AS ls ON lrd.status = ls.status 
        LEFT JOIN crm_users AS cu ON cu.u_id = lrd.assignto_id
        LEFT JOIN (
          SELECT clh.l_id, clh.status, clh.u_id
          FROM crm_lead_history AS clh
          INNER JOIN (
            SELECT l_id, MAX(update_dt) AS max_update_dt
            FROM crm_lead_history
            GROUP BY l_id
          ) AS clh_max ON clh.l_id = clh_max.l_id AND clh.update_dt = clh_max.max_update_dt
        ) AS clh_latest ON clh_latest.l_id = lp.l_id
        LEFT JOIN crm_users AS cu_latest ON cu_latest.u_id = clh_latest.u_id
        LEFT JOIN crm_lead_status AS ls_latest ON ls_latest.status = clh_latest.status
        WHERE lrd.assignto_id = ? AND lrd.assign_status = ? 
        GROUP BY lrd.lreq_id 
        ORDER BY lrd.lreq_id DESC 
        LIMIT ? OFFSET ?
      `;

      connection.query(
        query,
        [user_id, user_id, user_id, "Yes", limit, offset],
        (err, result) => {
          if (err) {
            console.log("Query Error:", err);
            res.status(500).json({ error: "Database query failed" });
          } else {
            res.json(result);
          }
          connection.release();
        }
      );
    });
  }
});

AssignLeadRouter.post("/get-assign-lead-table-data-count", (req, res) => {
  const user_role = req.session.user[0].urole;
  const user_id = req.session.user[0].u_id;

  if (user_role === "Master" || user_role === "Admin") {
    pool.getConnection(function (error, connection) {
      if (error) throw error;
      connection.query(
        "SELECT COUNT(l_id) AS totalNonAssignCount FROM crm_lead_primary_details WHERE assign_status = ? AND crm_lead_primary_details.status != 'NI'",
        ["Yes"],
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
        "SELECT COUNT(crm_lead_primary_details.l_id) AS totalCount FROM crm_lead_req_details JOIN crm_lead_primary_details ON crm_lead_primary_details.l_id = crm_lead_req_details.l_id WHERE crm_lead_req_details.assignto_id = ? AND crm_lead_req_details.assign_status = ? AND crm_lead_primary_details.status != 'NI'",
        [user_id, "Yes"],
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

AssignLeadRouter.post("/get-teammember-assignlead-Count", async (req, res) => {
  const user_id = req.body.u_id;
  const user_role = req.session.user[0].urole;
  const assign_status = "Yes";

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
});

// for ES5
module.exports = AssignLeadRouter;
