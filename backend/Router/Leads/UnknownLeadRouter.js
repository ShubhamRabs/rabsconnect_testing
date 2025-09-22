// for ES5
const express = require("express");
const pool = require("../../Database.js");
const dayjs = require("dayjs");
const { json } = require("body-parser");

const UnknownLeadRouter = express.Router();

UnknownLeadRouter.post("/get-unknown-leads", (req, res) => {
  const user_role = req.session.user[0].urole;
  const user_id = req.session.user[0].u_id;
  const { page, pageSize } = req.query;
  const offset = (page - 1) * pageSize;
  const limit = parseInt(pageSize);

  if (user_role === "Master" || user_role === "Admin") {
    pool.getConnection(function (error, connection) {
      if (error) throw error;
      connection.query(
        "SELECT crm_lead_primary_details.l_id AS l_id, crm_lead_req_details.lreq_id AS assignlead_id, GROUP_CONCAT(crm_users.username) AS assign_users, crm_lead_primary_details.create_dt, crm_lead_primary_details.lname, CONCAT(crm_lead_primary_details.p_ccode, ' ', crm_lead_primary_details.p_mob) AS mobile, crm_lead_primary_details.p_ccode, crm_lead_primary_details.p_mob, crm_lead_primary_details.p_email, crm_lead_primary_details.status, crm_lead_primary_details.pname, crm_lead_primary_details.followup, crm_lead_primary_details.followup_dt, crm_lead_primary_details.source, crm_lead_primary_details.city, crm_lead_primary_details.locality, crm_lead_primary_details.sub_locality,crm_lead_primary_details.buyer_type, crm_lead_primary_details.investment_type ,crm_lead_primary_details.post_handover,crm_lead_primary_details.document,crm_lead_status.color, crm_lead_primary_details.clicked FROM crm_lead_primary_details LEFT JOIN crm_lead_req_details ON crm_lead_req_details.l_id = crm_lead_primary_details.l_id LEFT JOIN crm_lead_status ON crm_lead_primary_details.status = crm_lead_status.status LEFT JOIN crm_users ON crm_users.u_id = crm_lead_req_details.assignto_id WHERE (?? = ? AND ?? = ?) GROUP BY crm_lead_primary_details.l_id ORDER BY crm_lead_primary_details.l_id DESC LIMIT ? OFFSET ?",
        [
          "crm_lead_primary_details.status",
          "",
          "crm_lead_primary_details.clicked",
          "1",
          limit,
          offset,
        ],
        (err, result) => {
          if (err) {
            console.log(err);
            res.status(500).send("Error fetching unknown leads");
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
        "SELECT crm_lead_req_details.lreq_id AS l_id, crm_lead_req_details.l_id AS assignlead_id, GROUP_CONCAT(CASE WHEN crm_users.u_id <> ? THEN crm_users.username END) AS assign_users, crm_lead_primary_details.create_dt, crm_lead_primary_details.lname, crm_lead_primary_details.pname, crm_lead_primary_details.p_ccode, crm_lead_primary_details.p_mob, crm_lead_primary_details.p_email, crm_lead_primary_details.source, crm_lead_req_details.followup, crm_lead_req_details.followup_dt, crm_lead_req_details.city, crm_lead_req_details.locality, crm_lead_req_details.sub_locality, crm_lead_primary_details.buyer_type, crm_lead_primary_details.investment_type ,crm_lead_primary_details.post_handover,crm_lead_primary_details.document,crm_lead_status.color, crm_lead_req_details.status FROM crm_lead_primary_details LEFT JOIN crm_lead_req_details ON crm_lead_primary_details.l_id = crm_lead_req_details.l_id LEFT JOIN crm_lead_status ON crm_lead_req_details.status = crm_lead_status.status LEFT JOIN crm_users ON crm_lead_req_details.assignto_id = crm_users.u_id WHERE ?? = ? AND (?? = ? AND ?? = ?) GROUP BY crm_lead_req_details.l_id ORDER BY crm_lead_req_details.l_id DESC LIMIT ? OFFSET ?",
        [
          user_id,
          "crm_lead_req_details.assignto_id",
          user_id,
          "crm_lead_req_details.status",
          "",
          "crm_lead_req_details.clicked",
          "1",
          limit,
          offset,
        ],
        (err, result) => {
          if (err) {
            console.log(err);
            res.status(500).send("Error fetching unknown leads");
          } else {
            res.json(result);
          }
          connection.release();
        }
      );
    });
  }
});

UnknownLeadRouter.post("/get-unknown-lead-count", (req, res) => {
  const user_role = req.session.user[0].urole;
  const { user_id } = req.session.user[0];

  if (user_role === "Master" || user_role === "Admin") {
    pool.getConnection(function (error, connection) {
      if (error) throw error;
      connection.query(
        "SELECT COUNT(l_id) AS statuslead_count FROM crm_lead_req_details WHERE status = ? AND clicked = ?",
        ["", 1],
        (err, result) => {
          if (err) {
            console.log(err);
            res.status(500).send("Error fetching unknown lead count");
          } else {
            res.json(result[0].statuslead_count);
          }
          connection.release();
        }
      );
    });
  } else {
    pool.getConnection(function (error, connection) {
      if (error) throw error;
      connection.query(
        "SELECT COUNT(l_id) AS statuslead_count FROM crm_lead_req_details WHERE status = ? AND clicked = ?",
        ["", 1],
        (err, result) => {
          if (err) {
            console.log(err);
            res.status(500).send("Error fetching unknown lead count");
          } else {
            res.json(result[0].statuslead_count);
          }
          connection.release();
        }
      );
    });
  }
});


// for ES5
module.exports = UnknownLeadRouter;