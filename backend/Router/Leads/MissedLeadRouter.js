// for ES5
const express = require("express");
const pool = require("../../Database.js");
const dayjs = require("dayjs");

const MissedLeadRouter = express.Router();

/* Date :- 10-10-2023
Author name :- krishna gupta
Fetch All Missed Leads data from database table and filter rows based on assign_status and status conditions also applying LIMIT and OFFSET for pagination
*/

MissedLeadRouter.get("/get-missed-lead-table-data", (req, res) => {
  const current_date = dayjs().format("YYYY-MM-DD");
  const user_role = req.session.user[0].urole;
  const user_id = req.session.user[0].u_id;
  const { page, pageSize } = req.query;
  const offset = (page - 1) * pageSize;
  const limit = parseInt(pageSize);

  if (user_role === "Master" || user_role === "Admin") {
    pool.getConnection(function (error, connection) {
      if (error) throw error;
      connection.query(
        "SELECT lpd.l_id AS l_id, lrd.lreq_id AS assignlead_id, GROUP_CONCAT(cu.username) AS assign_users, lpd.create_dt, lpd.lname, CONCAT(lpd.p_ccode, ' ', lpd.p_mob) AS mobile, lpd.p_ccode, lpd.p_mob, lpd.s_ccode, lpd.s_mob, lpd.p_email, lpd.status as admin_status, GROUP_CONCAT(lrd.status,' - ', cu.username) AS users_status,lpd.pname, lpd.followup, lpd.followup_dt, lpd.source, lpd.city, lpd.locality, lpd.sub_locality, lpd.comments, ls.color, lpd.clicked, lpd.source_type, lpd.service_type, lpd.ptype, lpd.lead_priority, lpd.pcategory, lpd.pconfiguration, lpd.min_area, lpd.max_area, lpd.area_unit, lpd.min_price, lpd.max_price, lpd.price_unit, lpd.country, lpd.state, lpd.other_details,  lpd.assign_status FROM crm_lead_primary_details AS lpd LEFT JOIN crm_lead_req_details AS lrd ON lrd.l_id = lpd.l_id LEFT JOIN crm_lead_status AS ls ON ls.status = lpd.status LEFT JOIN crm_users AS cu ON cu.u_id = lrd.assignto_id WHERE DATE(lpd.followup_dt) < ? AND lpd.followup = ? AND lpd.status != 'Broker' AND lpd.status != 'Dead' AND lpd.status != 'Booking Done' AND lpd.status != 'Wrong Number' AND lpd.status != 'Not Interested' AND lpd.status != 'NI' GROUP BY lpd.l_id ORDER BY lpd.l_id DESC LIMIT ? OFFSET ?;",
        [current_date, "Yes", limit, offset],
        (err, result) => {
          if (err) {
            console.log(error);
          } else {
            // console.log(result);
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
        "SELECT lrd.lreq_id AS l_id, lrd.l_id AS assignlead_id, lp.create_dt, lp.lname, lrd.status, lrd.pname, lp.source, ls.color, lrd.clicked, GROUP_CONCAT(cu.username) AS assign_users, CONCAT(lp.p_ccode, ' ', lp.p_mob) AS mobile, lp.p_ccode,p_mob, lp.p_email, GROUP_CONCAT(lrd.status,' - ', cu.username) AS users_status, lp.pname, lrd.followup, lrd.followup_dt, lp.city, lp.sub_locality, lrd.comments, lp.source_type, lp.service_type, lp.ptype, lp.pcategory, lp.pconfiguration, lp.min_area, lp.max_area, lp.area_unit, lp.min_price, lp.max_price, lp.price_unit, lp.lead_priority, lp.country, lp.state, lp.other_details, lp.assign_status FROM crm_lead_req_details AS lrd JOIN crm_lead_primary_details AS lp ON lp.l_id = lrd.l_id LEFT JOIN crm_lead_status AS ls ON lrd.status = ls.status LEFT JOIN crm_users AS cu ON cu.u_id = lrd.assignto_id WHERE lrd.assignto_id = ? AND DATE(lrd.followup_dt) < ? AND lrd.followup = ? AND lrd.status NOT IN ('Broker', 'Dead', 'Booking Done', 'Wrong Number','Interested', 'NI') GROUP BY lrd.lreq_id ORDER BY lrd.lreq_id DESC LIMIT ? OFFSET ?",
        [user_id, current_date, "Yes", limit, offset],
        (err, result) => {
          if (err) {
            console.log(error);
          } else {
            // console.log(result);
            res.json(result);
          }
          connection.release();
        }
      );
    });
  }
});

MissedLeadRouter.get("/get-mobile-missed-lead-table-data", (req, res) => {
  const current_date = dayjs().format("YYYY-MM-DD");
  const user_role = req.session.user[0].urole;
  const user_id = req.session.user[0].u_id;
  const { page, pageSize } = req.query;
  const offset = (page - 1) * pageSize;
  const limit = parseInt(pageSize);

  if (user_role === "Master" || user_role === "Admin") {
    pool.getConnection(function (error, connection) {
      if (error) throw error;
      connection.query(
        "SELECT * FROM (SELECT lrd.l_id,lrd.lreq_id AS assignlead_id,NULL AS assign_users, lrd.create_dt,lpd.lname, lpd.lead_priority, CONCAT(lpd.p_ccode, ' ', lpd.p_mob) AS mobile, lpd.p_ccode, lpd.p_mob,lpd.p_email, lrd.s_ccode, lrd.s_mob,NULL as admin_status, lrd.status as users_status,lrd.pname,lrd.followup,lrd.followup_dt,(SELECT cu.username FROM crm_users AS cu WHERE cu.u_id = lrd.assignto_id) AS followup_user,'User' AS lead_from,lpd.source, lrd.city, lrd.locality, lrd.sub_locality, lrd.comments, lrd.clicked,lpd.source_type,(SELECT color FROM crm_lead_status WHERE status = lrd.status) AS color, lrd.service_type, lrd.ptype, lrd.pcategory, lrd.pconfiguration, lrd.min_area, lrd.max_area, lrd.area_unit, lrd.min_price, lrd.max_price, lrd.price_unit, lrd.country, lrd.state, lrd.other_details,  lrd.assign_status FROM crm_lead_req_details AS lrd LEFT JOIN crm_lead_primary_details AS lpd ON lrd.l_id = lpd.l_id WHERE DATE(lrd.followup_dt) < ? AND lrd.followup = ? AND DATE(lrd.followup_dt) != '0000-00-00 00:00:00' UNION SELECT lpd.l_id, NULL AS assignlead_id,GROUP_CONCAT(cu.username) AS assign_users, lpd.create_dt,lpd.lname, CONCAT(lpd.p_ccode, ' ', lpd.p_mob) AS mobile, lpd.p_ccode, lpd.p_mob,lpd.p_email,lpd.s_ccode, lpd.s_mob, lpd.status as admin_status,NULL AS user_status,lpd.pname, lpd.followup,lpd.followup_dt,(SELECT cu.username FROM crm_users AS cu WHERE cu.urole = 'Master') AS followup_user,'Admin' AS lead_from,lpd.source,lpd.city, lpd.locality, lpd.sub_locality, lpd.comments, lpd.clicked,lpd.source_type,(SELECT color FROM crm_lead_status WHERE status = lpd.status) AS color, lpd.service_type, lpd.ptype, lpd.pcategory, lpd.pconfiguration, lpd.min_area, lpd.max_area, lpd.area_unit, lpd.min_price, lpd.max_price, lpd.price_unit, lpd.country, lpd.state, lpd.other_details,lpd.assign_status FROM crm_lead_primary_details AS lpd LEFT JOIN crm_lead_req_details AS lrd ON lpd.l_id = lrd.l_id LEFT JOIN crm_users AS cu ON cu.u_id = lrd.assignto_id WHERE DATE(lpd.followup_dt) < ? AND lpd.followup = ? AND DATE(lpd.followup_dt) != '0000-00-00 00:00:00' GROUP BY lpd.l_id) AS combine_result WHERE l_id IS NOT NULL ORDER BY followup_dt DESC LIMIT ? OFFSET ?",
        [current_date, "Yes",current_date, "Yes", limit, offset],
        (err, result) => {
          if (err) {
            console.log("error in missed follow up",err);
          } else {
            // console.log(result);
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
        "SELECT lrd.lreq_id AS l_id, lrd.l_id AS assignlead_id, lp.create_dt, lp.lname, lrd.status, lrd.pname, lp.source, lp.lead_priority, ls.color, lrd.clicked, GROUP_CONCAT(cu.username) AS assign_users, CONCAT(lp.p_ccode, ' ', lp.p_mob) AS mobile, lp.p_ccode,p_mob, lp.p_email, GROUP_CONCAT(lrd.status,' - ', cu.username) AS users_status, lp.pname, lrd.followup, lrd.followup_dt, lp.city, lp.sub_locality, lrd.comments, lp.source_type, lp.service_type, lp.ptype, lp.pcategory, lp.pconfiguration, lp.min_area, lp.max_area, lp.area_unit, lp.min_price, lp.max_price, lp.price_unit, lp.country, lp.state, lp.other_details, lp.assign_status FROM crm_lead_req_details AS lrd JOIN crm_lead_primary_details AS lp ON lp.l_id = lrd.l_id LEFT JOIN crm_lead_status AS ls ON lrd.status = ls.status LEFT JOIN crm_users AS cu ON cu.u_id = lrd.assignto_id WHERE lrd.assignto_id = ? AND DATE(lrd.followup_dt) < ? AND lrd.followup = ? AND lrd.status NOT IN ('Broker', 'Dead', 'Booking Done', 'Wrong Number','Interested', 'NI') GROUP BY lrd.lreq_id ORDER BY lrd.lreq_id DESC LIMIT ? OFFSET ?",
        [user_id, current_date, "Yes", limit, offset],
        (err, result) => {
          if (err) {
            console.log(error);
          } else {
            // console.log(result);
            res.json(result);
          }
          connection.release();
        }
      );
    });
  }
});

MissedLeadRouter.post("/get-mobile-missed-lead-table-data-count", (req, res) => {
  const user_role = req.session.user[0].urole;
  const user_id = req.session.user[0].u_id;
  const today = new Date();
  const current_date = dayjs().format("YYYY-MM-DD");
  if (user_role === "Master" || user_role === "Admin") {
    pool.getConnection(function (error, connection) {
      if (error) throw error;
      connection.query(
        "SELECT COUNT(*) AS missedleadcount FROM (SELECT crm_lead_primary_details.followup_dt,crm_lead_primary_details.followup,crm_lead_primary_details.l_id FROM crm_lead_primary_details WHERE DATE(crm_lead_primary_details.followup_dt) < ? AND crm_lead_primary_details.followup = ? AND DATE(crm_lead_primary_details.followup_dt) != '0000-00-00 00:00:00' GROUP BY crm_lead_primary_details.l_id UNION SELECT lrd.followup_dt,lrd.followup,lrd.lreq_id AS l_id FROM crm_lead_req_details AS lrd WHERE DATE(lrd.followup_dt) < ? AND lrd.followup = ? AND DATE(lrd.followup_dt) != '0000-00-00 00:00:00') AS combined_results WHERE l_id IS NOT NULL",
        [current_date, "Yes", current_date, "Yes"],
        (err, result) => {
          if (err) {
            console.log("error");
          } else {
            res.json(result[0].missedleadcount);
          }
          connection.release();
        }
      );
    });
  } else {
    pool.getConnection(function (error, connection) {
      if (error) throw error;
      connection.query(
        "SELECT COUNT(lp.l_id) AS missedleadcount FROM crm_lead_req_details AS lrd JOIN crm_lead_primary_details AS lp ON lp.l_id = lrd.l_id WHERE DATE(lp.followup_dt) < ? AND lp.followup = ? AND lrd.assignto_id = ? AND lrd.status NOT IN ('Broker', 'Dead', 'Booking Done', 'Wrong Number', 'Not Interested', 'NI')",
        [current_date, "Yes", user_id],
        (err, result) => {
          if (err) {
            console.log(err);
          } else {
            res.json(result[0].missedleadcount);
          }
          connection.release();
        }
      );
    });
  }
});

/* Date :- 10-10-2023
Author name :- krishna gupta
Fetch All Missed Leads Count from database table 
*/

MissedLeadRouter.post("/get-missed-lead-table-data-count", (req, res) => {
  const user_role = req.session.user[0].urole;
  const user_id = req.session.user[0].u_id;
  const today = new Date();
  const current_date = dayjs().format("YYYY-MM-DD");
  if (user_role === "Master" || user_role === "Admin") {
    pool.getConnection(function (error, connection) {
      if (error) throw error;
      connection.query(
        "SELECT COUNT(crm_lead_primary_details.l_id) AS missedleadcount FROM crm_lead_primary_details WHERE DATE(crm_lead_primary_details.followup_dt) < ? AND crm_lead_primary_details.followup = ? AND crm_lead_primary_details.status != 'Broker' AND crm_lead_primary_details.status != 'Dead' AND crm_lead_primary_details.status != 'Booking Done' AND crm_lead_primary_details.status != 'Wrong Number' AND crm_lead_primary_details.status != 'Not Interested' AND crm_lead_primary_details.status != 'NI' ORDER BY crm_lead_primary_details.l_id DESC",
        [current_date, "Yes"],
        (err, result) => {
          if (err) {
            console.log("error");
          } else {
            res.json(result[0].missedleadcount);
          }
          connection.release();
        }
      );
    });
  } else {
    pool.getConnection(function (error, connection) {
      if (error) throw error;
      connection.query(
        "SELECT COUNT(lp.l_id) AS missedleadcount FROM crm_lead_req_details AS lrd JOIN crm_lead_primary_details AS lp ON lp.l_id = lrd.l_id WHERE DATE(lp.followup_dt) < ? AND lp.followup = ? AND lrd.assignto_id = ? AND lrd.status NOT IN ('Broker', 'Dead', 'Booking Done', 'Wrong Number', 'Not Interested', 'NI')",
        [current_date, "Yes", user_id],
        (err, result) => {
          if (err) {
            console.log(err);
          } else {
            res.json(result[0].missedleadcount);
          }
          connection.release();
        }
      );
    });
  }
});


// for ES5
module.exports = MissedLeadRouter;
