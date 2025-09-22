// for ES5
const express = require("express");
const pool = require("../../Database.js");
const dayjs = require('dayjs');

const LeadByStatusRouter = express.Router();

LeadByStatusRouter.get("/get-lead-by-status-table-data", (req, res) => {
  const user_role = req.session.user[0].urole;
  const user_id = req.session.user[0].u_id;
  const { page, pageSize, status, type } = req.query;
  const offset = (page - 1) * pageSize;
  const limit = parseInt(pageSize);

  if (type === "Self") {
    if (user_role === "Master" || user_role === "Admin") {
      if (status === "undefinedlead") {
        pool.getConnection(function (error, connection) {
          if (error) throw error;
          connection.query(
            `SELECT lpd.l_id AS l_id, lrd.lreq_id AS assignlead_id, GROUP_CONCAT(cu.username) AS assign_users, lpd.create_dt, lpd.lname, 
            CONCAT(lpd.p_ccode, ' ', lpd.p_mob) AS mobile, lpd.p_ccode, lpd.p_mob, lpd.s_ccode, lpd.s_mob, lpd.p_email, 
            lpd.status as admin_status, GROUP_CONCAT(lrd.status,' - ', cu.username) AS status, lpd.pname, lpd.followup, 
            lpd.followup_dt, lpd.source, lpd.city, lpd.locality, lpd.sub_locality, lpd.comments, ls.color, lpd.clicked, 
            lpd.source_type, lpd.service_type, lpd.ptype, lpd.pcategory, lpd.pconfiguration, lpd.min_area, lpd.max_area, 
            lpd.area_unit, lpd.min_price, lpd.max_price, lpd.price_unit, lpd.country, lpd.state, lpd.other_details, 
            lpd.assign_status,
            (SELECT clh.status FROM crm_lead_history AS clh WHERE clh.l_id = lpd.l_id ORDER BY clh.update_dt DESC LIMIT 1) AS latest_status,
            (SELECT cu.username FROM crm_lead_history AS clh LEFT JOIN crm_users AS cu ON clh.u_id = cu.u_id WHERE clh.l_id = lpd.l_id ORDER BY clh.update_dt DESC LIMIT 1) AS latest_username,
            (SELECT ls.color FROM crm_lead_history AS clh LEFT JOIN crm_lead_status AS ls ON clh.status = ls.status WHERE clh.l_id = lpd.l_id ORDER BY clh.update_dt DESC LIMIT 1) AS latest_status_color
            FROM crm_lead_primary_details AS lpd 
            LEFT JOIN crm_lead_req_details AS lrd ON lrd.l_id = lpd.l_id 
            LEFT JOIN crm_lead_status AS ls ON ls.status = lpd.status 
            LEFT JOIN crm_users AS cu ON cu.u_id = lrd.assignto_id 
            WHERE lpd.status = '' 
            GROUP BY lpd.l_id ORDER BY lpd.l_id DESC LIMIT ? OFFSET ?`,
            [limit, offset],
            (err, result) => {
              if (err) {
                console.log("error tester ");
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
            `SELECT lpd.l_id AS l_id, lrd.lreq_id AS assignlead_id, GROUP_CONCAT(cu.username) AS assign_users, lpd.create_dt, lpd.lname, 
            CONCAT(lpd.p_ccode, ' ', lpd.p_mob) AS mobile, lpd.p_ccode, lpd.p_mob, lpd.p_email, lpd.status as admin_status, 
            GROUP_CONCAT(lrd.status,' - ', cu.username) AS status, lpd.pname, lpd.followup, lpd.followup_dt, lpd.source, lpd.city, 
            lpd.locality, lpd.sub_locality, lpd.comments, ls.color, lpd.clicked, lpd.source_type, lpd.service_type, lpd.ptype, 
            lpd.pcategory, lpd.pconfiguration, lpd.min_area, lpd.max_area, lpd.area_unit, lpd.min_price, lpd.max_price, 
            lpd.price_unit, lpd.country, lpd.state, lpd.other_details, lpd.assign_status,
            (SELECT clh.status FROM crm_lead_history AS clh WHERE clh.l_id = lpd.l_id ORDER BY clh.update_dt DESC LIMIT 1) AS latest_status,
            (SELECT cu.username FROM crm_lead_history AS clh LEFT JOIN crm_users AS cu ON clh.u_id = cu.u_id WHERE clh.l_id = lpd.l_id ORDER BY clh.update_dt DESC LIMIT 1) AS latest_username,
            (SELECT ls.color FROM crm_lead_history AS clh LEFT JOIN crm_lead_status AS ls ON clh.status = ls.status WHERE clh.l_id = lpd.l_id ORDER BY clh.update_dt DESC LIMIT 1) AS latest_status_color
            FROM crm_lead_primary_details AS lpd 
            LEFT JOIN crm_lead_req_details AS lrd ON lrd.l_id = lpd.l_id 
            LEFT JOIN crm_lead_status AS ls ON ls.status = lpd.status 
            LEFT JOIN crm_users AS cu ON cu.u_id = lrd.assignto_id 
            WHERE ?? = ? 
            GROUP BY lpd.l_id ORDER BY lpd.l_id DESC LIMIT ? OFFSET ?`,
            ["lpd.status", status, limit, offset],
            (err, result) => {
              if (err) {
                console.log("error tester ser");
              } else {
                res.json(result);
              }
              connection.release();
            }
          );
        });
      }
    } else {
      if (status === "undefinedlead") {
        pool.getConnection(function (error, connection) {
          if (error) throw error;
          connection.query(
            `SELECT lrd.lreq_id AS l_id, lrd.l_id AS assignlead_id, lp.create_dt, lp.lname, lrd.status, lrd.pname, lp.source, 
            ls.color, lrd.clicked, GROUP_CONCAT(cu.username) AS assign_users, CONCAT(lp.p_ccode, ' ', lp.p_mob) AS mobile, 
            lp.p_ccode, lp.p_mob, lp.p_email, GROUP_CONCAT(lrd.status,' - ', cu.username) AS status, lp.pname, lp.followup, 
            lp.followup_dt, lp.city, lp.sub_locality, lp.comments, lp.source_type, lp.service_type, lp.ptype, lp.pcategory, 
            lp.pconfiguration, lp.min_area, lp.max_area, lp.area_unit, lp.min_price, lp.max_price, lp.price_unit, lp.country, 
            lp.state, lp.other_details, lp.assign_status,
            (SELECT clh.status FROM crm_lead_history AS clh WHERE clh.l_id = lp.l_id ORDER BY clh.update_dt DESC LIMIT 1) AS latest_status,
            (SELECT cu.username FROM crm_lead_history AS clh LEFT JOIN crm_users AS cu ON clh.u_id = cu.u_id WHERE clh.l_id = lp.l_id ORDER BY clh.update_dt DESC LIMIT 1) AS latest_username,
            (SELECT ls.color FROM crm_lead_history AS clh LEFT JOIN crm_lead_status AS ls ON clh.status = ls.status WHERE clh.l_id = lp.l_id ORDER BY clh.update_dt DESC LIMIT 1) AS latest_status_color
            FROM crm_lead_req_details AS lrd 
            JOIN crm_lead_primary_details AS lp ON lp.l_id = lrd.l_id 
            LEFT JOIN crm_lead_status AS ls ON lrd.status = ls.status 
            LEFT JOIN crm_users AS cu ON cu.u_id = lrd.assignto_id 
            WHERE lrd.assignto_id = ? AND lrd.status = ? 
            GROUP BY lrd.lreq_id ORDER BY lrd.lreq_id DESC LIMIT ? OFFSET ?`,
            [user_id, "", limit, offset],
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
            `SELECT lrd.lreq_id AS l_id, lrd.l_id AS assignlead_id, lrd.create_dt, lpd.lname, lrd.status, lrd.pname, lpd.source, 
            ls.color, lrd.clicked, CONCAT(lpd.p_ccode, ' ', lpd.p_mob) AS mobile, lpd.p_ccode, lpd.p_mob, lpd.p_email, 
            GROUP_CONCAT(lrd.status,' - ', cu.username) AS users_status, lpd.pname, lrd.followup, lrd.followup_dt, lpd.city, 
            lpd.sub_locality, lrd.comments, lpd.source_type, lpd.service_type, lpd.ptype, lpd.pcategory, lpd.pconfiguration, 
            lpd.min_area, lpd.max_area, lpd.area_unit, lpd.min_price, lpd.max_price, lpd.price_unit, lpd.country, lpd.state, 
            lpd.other_details, lpd.assign_status,
            (SELECT clh.status FROM crm_lead_history AS clh WHERE clh.l_id = lpd.l_id ORDER BY clh.update_dt DESC LIMIT 1) AS latest_status,
            (SELECT cu.username FROM crm_lead_history AS clh LEFT JOIN crm_users AS cu ON clh.u_id = cu.u_id WHERE clh.l_id = lpd.l_id ORDER BY clh.update_dt DESC LIMIT 1) AS latest_username,
            (SELECT ls.color FROM crm_lead_history AS clh LEFT JOIN crm_lead_status AS ls ON clh.status = ls.status WHERE clh.l_id = lpd.l_id ORDER BY clh.update_dt DESC LIMIT 1) AS latest_status_color
            FROM crm_lead_req_details AS lrd 
            JOIN crm_lead_primary_details AS lpd ON lpd.l_id = lrd.l_id 
            LEFT JOIN crm_lead_status AS ls ON lrd.status = ls.status 
            LEFT JOIN crm_users AS cu ON cu.u_id = lrd.assignto_id 
            WHERE lrd.assignto_id = ? AND lrd.status = ? 
            GROUP BY lrd.lreq_id ORDER BY lrd.lreq_id DESC LIMIT ? OFFSET ?`,
            [user_id, status, limit, offset],
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
    }
  } else {
    if (status === "undefinedlead") {
      if (user_role === "Master" || user_role === "Admin") {
        pool.getConnection(function (error, connection) {
          if (error) throw error;
          connection.query(
            `SELECT lpd.l_id AS l_id, lrd.lreq_id AS assignlead_id, GROUP_CONCAT(cu.username) AS assign_users, lpd.create_dt, lpd.lname, 
            CONCAT(lpd.p_ccode, ' ', lpd.p_mob) AS mobile, lpd.p_ccode, lpd.p_mob, lpd.s_ccode, lpd.s_mob, lpd.p_email, 
            lpd.status as admin_status, GROUP_CONCAT(lrd.status,' - ', cu.username) AS status, lpd.pname, lpd.followup, 
            lpd.followup_dt, lpd.source, lpd.city, lpd.locality, lpd.sub_locality, lpd.comments, ls.color, lpd.clicked, 
            lpd.source_type, lpd.service_type, lpd.ptype, lpd.pcategory, lpd.pconfiguration, lpd.min_area, lpd.max_area, 
            lpd.area_unit, lpd.min_price, lpd.max_price, lpd.price_unit, lpd.country, lpd.state, lpd.other_details, 
            lpd.assign_status,
            (SELECT clh.status FROM crm_lead_history AS clh WHERE clh.l_id = lpd.l_id ORDER BY clh.update_dt DESC LIMIT 1) AS latest_status,
            (SELECT cu.username FROM crm_lead_history AS clh LEFT JOIN crm_users AS cu ON clh.u_id = cu.u_id WHERE clh.l_id = lpd.l_id ORDER BY clh.update_dt DESC LIMIT 1) AS latest_username,
            (SELECT ls.color FROM crm_lead_history AS clh LEFT JOIN crm_lead_status AS ls ON clh.status = ls.status WHERE clh.l_id = lpd.l_id ORDER BY clh.update_dt DESC LIMIT 1) AS latest_status_color
            FROM crm_lead_primary_details AS lpd 
            LEFT JOIN crm_lead_req_details AS lrd ON lrd.l_id = lpd.l_id 
            LEFT JOIN crm_lead_status AS ls ON ls.status = lpd.status 
            LEFT JOIN crm_users AS cu ON cu.u_id = lrd.assignto_id 
            WHERE lrd.status = '' 
            GROUP BY lpd.l_id ORDER BY lpd.l_id DESC LIMIT ? OFFSET ?`,
            [limit, offset],
            (err, result) => {
              if (err) {
                console.log("error");
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
            `SELECT lrd.lreq_id AS l_id, lrd.l_id AS assignlead_id, lp.create_dt, lp.lname, lrd.status, lrd.pname, lp.source, 
            ls.color, lrd.clicked, GROUP_CONCAT(cu.username) AS assign_users, CONCAT(lp.p_ccode, ' ', lp.p_mob) AS mobile, 
            lp.p_ccode, lp.p_mob, lp.p_email, GROUP_CONCAT(lrd.status,' - ', cu.username) AS status, lp.pname, lp.followup, 
            lp.followup_dt, lp.city, lp.sub_locality, lp.comments, lp.source_type, lp.service_type, lp.ptype, lp.pcategory, 
            lp.pconfiguration, lp.min_area, lp.max_area, lp.area_unit, lp.min_price, lp.max_price, lp.price_unit, lp.country, 
            lp.state, lp.other_details, lp.assign_status,
            (SELECT clh.status FROM crm_lead_history AS clh WHERE clh.l_id = lp.l_id ORDER BY clh.update_dt DESC LIMit 1) AS latest_status,
            (SELECT cu.username FROM crm_lead_history AS clh LEFT JOIN crm_users AS cu ON clh.u_id = cu.u_id WHERE clh.l_id = lp.l_id ORDER BY clh.update_dt DESC LIMIT 1) AS latest_username,
            (SELECT ls.color FROM crm_lead_history AS clh LEFT JOIN crm_lead_status AS ls ON clh.status = ls.status WHERE clh.l_id = lp.l_id ORDER BY clh.update_dt DESC LIMIT 1) AS latest_status_color
            FROM crm_lead_req_details AS lrd 
            JOIN crm_lead_primary_details AS lp ON lp.l_id = lrd.l_id 
            LEFT JOIN crm_lead_status AS ls ON lrd.status = ls.status 
            LEFT JOIN crm_users AS cu ON cu.u_id = lrd.assignto_id 
            WHERE lrd.assignby_id = ? AND lrd.status = ? 
            GROUP BY lrd.lreq_id ORDER BY lrd.lreq_id DESC LIMIT ? OFFSET ?`,
            [user_id, "", limit, offset],
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
    } else {
      pool.getConnection(function (error, connection) {
        if (error) throw error;
        connection.query(
          `SELECT lrd.lreq_id AS l_id, lrd.l_id AS assignlead_id, lrd.create_dt, lpd.lname, lrd.status, lrd.pname, lpd.source, 
          ls.color, lrd.clicked, CONCAT(lpd.p_ccode, ' ', lpd.p_mob) AS mobile, lpd.p_ccode, lpd.p_mob, lpd.p_email, 
          GROUP_CONCAT(lrd.status,' - ', cu.username) AS users_status, lpd.pname, lrd.followup, lrd.followup_dt, lpd.city, 
          lpd.sub_locality, lrd.comments, lpd.source_type, lpd.service_type, lpd.ptype, lpd.pcategory, lpd.pconfiguration, 
          lpd.min_area, lpd.max_area, lpd.area_unit, lpd.min_price, lpd.max_price, lpd.price_unit, lpd.country, lpd.state, 
          lpd.other_details, lpd.assign_status,
          (SELECT clh.status FROM crm_lead_history AS clh WHERE clh.l_id = lpd.l_id ORDER BY clh.update_dt DESC LIMIT 1) AS latest_status,
          (SELECT cu.username FROM crm_lead_history AS clh LEFT JOIN crm_users AS cu ON clh.u_id = cu.u_id WHERE clh.l_id = lpd.l_id ORDER BY clh.update_dt DESC LIMIT 1) AS latest_username,
          (SELECT ls.color FROM crm_lead_history AS clh LEFT JOIN crm_lead_status AS ls ON clh.status = ls.status WHERE clh.l_id = lpd.l_id ORDER BY clh.update_dt DESC LIMIT 1) AS latest_status_color
          FROM crm_lead_req_details AS lrd 
          JOIN crm_lead_primary_details AS lpd ON lpd.l_id = lrd.l_id 
          LEFT JOIN crm_lead_status AS ls ON lrd.status = ls.status 
          LEFT JOIN crm_users AS cu ON cu.u_id = lrd.assignto_id 
          WHERE lrd.status = ? 
          GROUP BY lrd.lreq_id ORDER BY lrd.lreq_id DESC LIMIT ? OFFSET ?`,
          [status, limit, offset],
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
  }
});

LeadByStatusRouter.post("/get-mobile-status-wise-leads", (req, res) => {
  const user_role = req.session.user[0].urole;
  const user_id = req.session.user[0].u_id;
  const { page, pageSize, status } = req.body;
  
  const offset = (page - 1) * pageSize;
  const limit = parseInt(pageSize);
  
  if (user_role === "Master" || user_role === "Admin") {
    pool.getConnection(function (error, connection) {
      if (error) {
        throw error;
      }
      connection.query(
      `SELECT lead_id, l_id, assignlead_id, assign_users, create_dt, identity, lname, admin_status, users_status, pname, followup, followup_dt, source, color, clicked, source_type, ptype, pcategory, assign_status, latest_status, latest_username, latest_status_color, lead_from FROM (SELECT lpd.l_id AS lead_id, lpd.l_id AS l_id, NULL AS assignlead_id, NULL AS assign_users, lpd.create_dt, lpd.ref_email AS identity, lpd.lname, lpd.status AS admin_status, NULL AS users_status, lpd.pname, lpd.followup, lpd.followup_dt, NULL AS source, ls.color, lpd.clicked, lpd.source_type, lpd.ptype, NULL AS pcategory, lpd.assign_status, (SELECT clh.status FROM crm_lead_history AS clh WHERE clh.l_id = lpd.l_id ORDER BY clh.update_dt DESC LIMIT 1) AS latest_status, (SELECT cu.username FROM crm_lead_history AS clh LEFT JOIN crm_users AS cu ON clh.u_id = cu.u_id WHERE clh.l_id = lpd.l_id ORDER BY clh.update_dt DESC LIMIT 1) AS latest_username, (SELECT ls.color FROM crm_lead_history AS clh LEFT JOIN crm_lead_status AS ls ON clh.status = ls.status WHERE clh.l_id = lpd.l_id ORDER BY clh.update_dt DESC LIMIT 1) AS latest_status_color, 'Admin' AS lead_from FROM crm_lead_primary_details lpd LEFT JOIN crm_lead_status AS ls ON ls.status = lpd.status WHERE lpd.status = ? UNION ALL SELECT lrd.lreq_id AS lead_id, lrd.l_id AS l_id, lrd.lreq_id AS assignlead_id, GROUP_CONCAT(cu.username) AS assign_users, lrd.create_dt, lpd.identity, lpd.lname, lrd.status AS admin_status, GROUP_CONCAT(lrd.status, ' - ', cu.username) AS users_status, lpd.pname, lrd.followup, lrd.followup_dt, lpd.source, ls.color, lrd.clicked, lpd.source_type, lpd.ptype, lpd.pcategory, lpd.assign_status, (SELECT clh.status FROM crm_lead_history AS clh WHERE clh.l_id = lpd.l_id ORDER BY clh.update_dt DESC LIMIT 1) AS latest_status, (SELECT cu.username FROM crm_lead_history AS clh LEFT JOIN crm_users AS cu ON clh.u_id = cu.u_id WHERE clh.l_id = lpd.l_id ORDER BY clh.update_dt DESC LIMIT 1) AS latest_username, (SELECT ls.color FROM crm_lead_history AS clh LEFT JOIN crm_lead_status AS ls ON clh.status = ls.status WHERE clh.l_id = lpd.l_id ORDER BY clh.update_dt DESC LIMIT 1) AS latest_status_color, 'User' AS lead_from FROM crm_lead_req_details AS lrd JOIN crm_lead_primary_details AS lpd ON lpd.l_id= lrd.l_id LEFT JOIN crm_lead_status AS ls ON ls.status = lrd.status LEFT JOIN crm_users AS cu ON cu.u_id = lrd.assignto_id WHERE lrd.status = ? GROUP BY lrd.l_id) AS combined_results ORDER BY l_id DESC LIMIT ? OFFSET ?`,
        [status, status, limit, offset],
        (err, result) => {
          if (err) {
            console.log(err);
          } else {
              console.log(result,"result")
            res.send(result);
          }
          connection.release();
        }
      );
    });
  } else {
    pool.getConnection(function (error, connection) {
      if (error) {
        throw error;
      }
      connection.query(
        "SELECT crm_lead_req_details.lreq_id AS l_id, crm_lead_req_details.l_id AS assignlead_id, GROUP_CONCAT(CASE WHEN crm_users.u_id <> ? THEN crm_users.username END) AS assign_users, crm_lead_primary_details.create_dt, crm_lead_primary_details.lname, crm_lead_primary_details.pname, CONCAT(crm_lead_primary_details.p_ccode, ' ',crm_lead_primary_details.p_mob) AS mobile, crm_lead_primary_details.p_ccode, crm_lead_primary_details.p_mob, crm_lead_primary_details.p_email, crm_lead_primary_details.source, crm_lead_req_details.followup, crm_lead_req_details.followup_dt, crm_lead_req_details.city, crm_lead_req_details.locality, crm_lead_req_details.sub_locality, crm_lead_status.color, crm_lead_req_details.status FROM crm_lead_primary_details JOIN crm_lead_req_details ON crm_lead_primary_details.l_id = crm_lead_req_details.l_id LEFT JOIN crm_lead_status ON crm_lead_req_details.status = crm_lead_status.status LEFT JOIN crm_users ON crm_lead_req_details.assignto_id = crm_users.u_id WHERE ?? = ? AND ?? = ? GROUP BY crm_lead_req_details.l_id ORDER BY crm_lead_req_details.l_id DESC LIMIT ? OFFSET ?",
        [
          user_id,
          "crm_lead_req_details.assignto_id",
          user_id,
          "crm_lead_req_details.status",
          status,
          limit,
          offset,
        ],
        (err, result) => {
          if (err) {
            console.log(err);
          }
          if (result.length > 0) {
            res.send(result);
          } else {
            res.send("No Data Found");
          }
          connection.release();
        }
      );
    });
  }
//   if (type === "Self") {
//     if (user_role === "Master" || user_role === "Admin") {
//       if (status === "undefinedlead") {
//         pool.getConnection(function (error, connection) {
//           if (error) throw error;
//           connection.query(
//             "SELECT lpd.l_id AS l_id, lrd.lreq_id AS assignlead_id, GROUP_CONCAT(cu.username) AS assign_users, lpd.create_dt, lpd.lname, CONCAT(lpd.p_ccode, ' ', lpd.p_mob) AS mobile, lpd.p_ccode, lpd.p_mob, lpd.s_ccode, lpd.s_mob, lpd.p_email, lpd.status as admin_status, GROUP_CONCAT(lrd.status,' - ', cu.username) AS status, lpd.pname, lpd.followup, lpd.followup_dt, lpd.source, lpd.city, lpd.locality, lpd.sub_locality, lpd.comments, ls.color, lpd.clicked, lpd.source_type, lpd.service_type, lpd.ptype, lpd.pcategory, lpd.pconfiguration, lpd.min_area, lpd.max_area, lpd.area_unit, lpd.min_price, lpd.max_price, lpd.price_unit, lpd.country, lpd.state, lpd.other_details, lpd.assign_status FROM crm_lead_primary_details AS lpd LEFT JOIN crm_lead_req_details AS lrd ON lrd.l_id = lpd.l_id LEFT JOIN crm_lead_status AS ls ON ls.status = lpd.status LEFT JOIN crm_users AS cu ON cu.u_id = lrd.assignto_id WHERE lpd.status = '' GROUP BY lpd.l_id ORDER BY lpd.l_id DESC LIMIT ? OFFSET ?",
//             [limit, offset],
//             (err, result) => {
//               if (err) {
//                 console.log("error");
//               } else {
//                 res.json(result);
//               }
//               connection.release();
//             }
//           );
//         });
//       } else {
//         pool.getConnection(function (error, connection) {
//           if (error) throw error;
//           connection.query(
//             "SELECT lpd.l_id AS l_id, lrd.lreq_id AS assignlead_id, GROUP_CONCAT(cu.username) AS assign_users, lpd.create_dt, lpd.lname, CONCAT(lpd.p_ccode, ' ', lpd.p_mob) AS mobile, lpd.p_ccode, lpd.p_mob, lpd.p_email, lpd.status as admin_status, GROUP_CONCAT(lrd.status,' - ', cu.username) AS status, lpd.pname, lpd.followup, lpd.followup_dt, lpd.source, lpd.city, lpd.locality, lpd.sub_locality, lpd.comments, ls.color, lpd.clicked, lpd.source_type, lpd.service_type, lpd.ptype, lpd.pcategory, lpd.pconfiguration, lpd.min_area, lpd.max_area, lpd.area_unit, lpd.min_price, lpd.max_price, lpd.price_unit, lpd.country, lpd.state, lpd.other_details,  lpd.assign_status FROM crm_lead_primary_details AS lpd LEFT JOIN crm_lead_req_details AS lrd ON lrd.l_id = lpd.l_id LEFT JOIN crm_lead_status AS ls ON ls.status = lpd.status LEFT JOIN crm_users AS cu ON cu.u_id = lrd.assignto_id WHERE ?? = ? GROUP BY lpd.l_id ORDER BY lpd.l_id DESC LIMIT ? OFFSET ?",
//             ["lpd.status", status, limit, offset],
//             (err, result) => {
//               if (err) {
//                 console.log("error");
//               } else {
//                 res.json(result);
//               }
//               connection.release();
//             }
//           );
//         });
//       }
//     } else {
//       if (status === "undefinedlead") {
//         pool.getConnection(function (error, connection) {
//           if (error) throw error;
//           connection.query(
//             "SELECT lrd.lreq_id AS l_id, lrd.l_id AS assignlead_id, lp.create_dt, lp.lname, lrd.status, lrd.pname, lp.source, ls.color, lrd.clicked, GROUP_CONCAT(cu.username) AS assign_users, CONCAT(lp.p_ccode, ' ', lp.p_mob) AS mobile, lp.p_ccode,p_mob, lp.p_email, GROUP_CONCAT(lrd.status,' - ', cu.username) AS status, lp.pname, lp.followup, lp.followup_dt, lp.city, lp.sub_locality, lp.comments, lp.source_type, lp.service_type, lp.ptype, lp.pcategory, lp.pconfiguration, lp.min_area, lp.max_area, lp.area_unit, lp.min_price, lp.max_price, lp.price_unit, lp.country, lp.state, lp.other_details, lp.assign_status FROM crm_lead_req_details AS lrd JOIN crm_lead_primary_details AS lp ON lp.l_id = lrd.l_id LEFT JOIN crm_lead_status AS ls ON lrd.status = ls.status LEFT JOIN crm_users AS cu ON cu.u_id = lrd.assignto_id WHERE lrd.assignto_id = ? AND lrd.status = ? GROUP BY lrd.lreq_id ORDER BY lrd.lreq_id DESC LIMIT ? OFFSET ?",
//             [user_id, "", limit, offset],
//             (err, result) => {
//               if (err) {
//                 console.log(err);
//               } else {
//                 res.json(result);
//               }
//               connection.release();
//             }
//           );
//         });
//       } else {
//         pool.getConnection(function (error, connection) {
//           if (error) throw error;
//           connection.query(
//             "SELECT lrd.lreq_id AS l_id, lrd.l_id AS assignlead_id, lrd.create_dt, lpd.lname, lrd.status, lrd.pname, lpd.source, ls.color, lrd.clicked, CONCAT(lpd.p_ccode, ' ', lpd.p_mob) AS mobile, lpd.p_ccode,p_mob, lpd.p_email, GROUP_CONCAT(lrd.status,' - ', cu.username) AS users_status, lpd.pname, lrd.followup, lrd.followup_dt, lpd.city, lpd.sub_locality, lrd.comments, lpd.source_type, lpd.service_type, lpd.ptype, lpd.pcategory, lpd.pconfiguration, lpd.min_area, lpd.max_area, lpd.area_unit, lpd.min_price, lpd.max_price, lpd.price_unit, lpd.country, lpd.state, lpd.other_details, lpd.assign_status FROM crm_lead_req_details AS lrd JOIN crm_lead_primary_details AS lpd ON lpd.l_id = lrd.l_id LEFT JOIN crm_lead_status AS ls ON lrd.status = ls.status LEFT JOIN crm_users AS cu ON cu.u_id = lrd.assignto_id WHERE lrd.assignto_id = ? AND lrd.status = ? GROUP BY lrd.lreq_id ORDER BY lrd.lreq_id DESC LIMIT ? OFFSET ?",
//             [user_id, status, limit, offset],
//             (err, result) => {
//               if (err) {
//                 console.log(err);
//               } else {
//                 res.json(result);
//               }
//               connection.release();
//             }
//           );
//         });
//       }
//     }
//   } else {
//     if (status === "undefinedlead") {
//       if (user_role === "Master" || user_role === "Admin") {
//         pool.getConnection(function (error, connection) {
//           if (error) throw error;
//           connection.query(
//             "SELECT lpd.l_id AS l_id, lrd.lreq_id AS assignlead_id, GROUP_CONCAT(cu.username) AS assign_users, lpd.create_dt, lpd.lname, CONCAT(lpd.p_ccode, ' ', lpd.p_mob) AS mobile, lpd.p_ccode, lpd.p_mob, lpd.s_ccode, lpd.s_mob, lpd.p_email, lpd.status as admin_status, GROUP_CONCAT(lrd.status,' - ', cu.username) AS status, lpd.pname, lpd.followup, lpd.followup_dt, lpd.source, lpd.city, lpd.locality, lpd.sub_locality, lpd.comments, ls.color, lpd.clicked, lpd.source_type, lpd.service_type, lpd.ptype, lpd.pcategory, lpd.pconfiguration, lpd.min_area, lpd.max_area, lpd.area_unit, lpd.min_price, lpd.max_price, lpd.price_unit, lpd.country, lpd.state, lpd.other_details, lpd.assign_status FROM crm_lead_primary_details AS lpd LEFT JOIN crm_lead_req_details AS lrd ON lrd.l_id = lpd.l_id LEFT JOIN crm_lead_status AS ls ON ls.status = lpd.status LEFT JOIN crm_users AS cu ON cu.u_id = lrd.assignto_id WHERE lrd.status = '' GROUP BY lpd.l_id ORDER BY lpd.l_id DESC LIMIT ? OFFSET ?",
//             [limit, offset],
//             (err, result) => {
//               if (err) {
//                 console.log("error");
//               } else {
//                 res.json(result);
//               }
//               connection.release();
//             }
//           );
//         });
//       } else {
//         pool.getConnection(function (error, connection) {
//           if (error) throw error;
//           connection.query(
//             "SELECT lrd.lreq_id AS l_id, lrd.l_id AS assignlead_id, lp.create_dt, lp.lname, lrd.status, lrd.pname, lp.source, ls.color, lrd.clicked, GROUP_CONCAT(cu.username) AS assign_users, CONCAT(lp.p_ccode, ' ', lp.p_mob) AS mobile, lp.p_ccode,p_mob, lp.p_email, GROUP_CONCAT(lrd.status,' - ', cu.username) AS status, lp.pname, lp.followup, lp.followup_dt, lp.city, lp.sub_locality, lp.comments, lp.source_type, lp.service_type, lp.ptype, lp.pcategory, lp.pconfiguration, lp.min_area, lp.max_area, lp.area_unit, lp.min_price, lp.max_price, lp.price_unit, lp.country, lp.state, lp.other_details, lp.assign_status FROM crm_lead_req_details AS lrd JOIN crm_lead_primary_details AS lp ON lp.l_id = lrd.l_id LEFT JOIN crm_lead_status AS ls ON lrd.status = ls.status LEFT JOIN crm_users AS cu ON cu.u_id = lrd.assignto_id WHERE lrd.assignby_id = ? AND lrd.status = ? GROUP BY lrd.lreq_id ORDER BY lrd.lreq_id DESC LIMIT ? OFFSET ?",
//             [user_id, "", limit, offset],
//             (err, result) => {
//               if (err) {
//                 console.log(err);
//               } else {
//                 res.json(result);
//               }
//               connection.release();
//             }
//           );
//         });
//       }
//     } else {
//       pool.getConnection(function (error, connection) {
//         if (error) throw error;
//         connection.query(
//           "SELECT lrd.lreq_id AS l_id, lrd.l_id AS assignlead_id, lrd.create_dt, lpd.lname, lrd.status, lrd.pname, lpd.source, ls.color, lrd.clicked, CONCAT(lpd.p_ccode, ' ', lpd.p_mob) AS mobile, lpd.p_ccode,p_mob, lpd.p_email, GROUP_CONCAT(lrd.status,' - ', cu.username) AS users_status, lpd.pname, lrd.followup, lrd.followup_dt, lpd.city, lpd.sub_locality, lrd.comments, lpd.source_type, lpd.service_type, lpd.ptype, lpd.pcategory, lpd.pconfiguration, lpd.min_area, lpd.max_area, lpd.area_unit, lpd.min_price, lpd.max_price, lpd.price_unit, lpd.country, lpd.state, lpd.other_details, lpd.assign_status FROM crm_lead_req_details AS lrd JOIN crm_lead_primary_details AS lpd ON lpd.l_id = lrd.l_id LEFT JOIN crm_lead_status AS ls ON lrd.status = ls.status LEFT JOIN crm_users AS cu ON cu.u_id = lrd.assignto_id WHERE lrd.status = ? GROUP BY lrd.lreq_id ORDER BY lrd.lreq_id DESC LIMIT ? OFFSET ?",
//           [status, limit, offset],
//           (err, result) => {
//             if (err) {
//               console.log(err);
//             } else {
//               res.json(result);
//             }
//             connection.release();
//           }
//         );
//       });
//     }
//   }
});

///app
LeadByStatusRouter.post("/get-status-wise-leads", async (req, res) => {
  const user_id = req.session.user[0].u_id;
  const status = req.body.status;
  const limit = req.body.limit;
  const page = req.body.page;
  const user_role = req.session.user[0].urole;

  if (user_role === "Master" || user_role === "Admin") {
    pool.getConnection(function (error, connection) {
      if (error) {
        throw error;
      }
      connection.query(
        "SELECT crm_lead_primary_details.l_id AS l_id, crm_lead_req_details.lreq_id AS assignlead_id, GROUP_CONCAT(crm_users.username) AS assign_users, crm_lead_primary_details.create_dt, crm_lead_primary_details.lname, CONCAT(crm_lead_primary_details.p_ccode, ' ',crm_lead_primary_details.p_mob) AS mobile, crm_lead_primary_details.p_ccode, crm_lead_primary_details.p_mob, crm_lead_primary_details.p_email, crm_lead_primary_details.status, crm_lead_primary_details.pname, crm_lead_primary_details.followup, crm_lead_primary_details.followup_dt, crm_lead_primary_details.source, crm_lead_primary_details.city, crm_lead_primary_details.locality, crm_lead_primary_details.sub_locality, crm_lead_status.color, crm_lead_primary_details.clicked FROM crm_lead_primary_details LEFT JOIN crm_lead_req_details ON crm_lead_req_details.l_id = crm_lead_primary_details.l_id LEFT JOIN crm_lead_status ON crm_lead_primary_details.status = crm_lead_status.status LEFT JOIN crm_users ON crm_users.u_id = crm_lead_req_details.assignto_id WHERE ?? = ? GROUP BY crm_lead_primary_details.l_id ORDER BY crm_lead_primary_details.l_id DESC LIMIT ? OFFSET ?",
        ["crm_lead_primary_details.status", status, limit, page],
        (err, result) => {
          if (err) {
            console.log(err);
          }
          if (result.length > 0) {
            res.send(result);
          } else {
            res.send("No Data Found");
          }
          connection.release();
        }
      );
    });
  } else {
    pool.getConnection(function (error, connection) {
      if (error) {
        throw error;
      }
      connection.query(
        "SELECT crm_lead_req_details.lreq_id AS l_id, crm_lead_req_details.l_id AS assignlead_id, GROUP_CONCAT(CASE WHEN crm_users.u_id <> ? THEN crm_users.username END) AS assign_users, crm_lead_primary_details.create_dt, crm_lead_primary_details.lname, crm_lead_primary_details.pname, CONCAT(crm_lead_primary_details.p_ccode, ' ',crm_lead_primary_details.p_mob) AS mobile, crm_lead_primary_details.p_ccode, crm_lead_primary_details.p_mob, crm_lead_primary_details.p_email, crm_lead_primary_details.source, crm_lead_req_details.followup, crm_lead_req_details.followup_dt, crm_lead_req_details.city, crm_lead_req_details.locality, crm_lead_req_details.sub_locality, crm_lead_status.color, crm_lead_req_details.status FROM crm_lead_primary_details JOIN crm_lead_req_details ON crm_lead_primary_details.l_id = crm_lead_req_details.l_id LEFT JOIN crm_lead_status ON crm_lead_req_details.status = crm_lead_status.status LEFT JOIN crm_users ON crm_lead_req_details.assignto_id = crm_users.u_id WHERE ?? = ? AND ?? = ? GROUP BY crm_lead_req_details.l_id ORDER BY crm_lead_req_details.l_id DESC LIMIT ? OFFSET ?",
        [
          user_id,
          "crm_lead_req_details.assignto_id",
          user_id,
          "crm_lead_req_details.status",
          status,
          limit,
          page,
        ],
        (err, result) => {
          if (err) {
            console.log(err);
          }
          if (result.length > 0) {
            res.send(result);
          } else {
            res.send("No Data Found");
          }
          connection.release();
        }
      );
    });
  }
});

LeadByStatusRouter.post("/get-status-count", async (req, res) => {
  const user_id = req.session.user[0].u_id;
  const user_role = req.session.user[0].urole;

  if (user_role === "Master" || user_role === "Admin") {
    pool.getConnection(function (error, connection) {
      if (error) {
        throw error;
      }
      connection.query(
        "SELECT COUNT(l_id) AS statuslead_count FROM crm_lead_primary_details WHERE status = ?",
        [req.body.status],
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
      if (error) {
        throw error;
      }
      connection.query(
        "SELECT COUNT(lreq_id) AS statuslead_count FROM crm_lead_req_details WHERE ?? = ? AND status = ?",
        ["assignto_id", user_id, req.body.status],
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

LeadByStatusRouter.post("/get-Undefinedleads-Count", async (req, res) => {
  const user_id = req.session.user[0].u_id;
  const user_role = req.session.user[0].urole;

  if (user_role === "Master" || user_role === "Admin") {
    pool.getConnection(function (error, connection) {
      if (error) {
        throw error;
      }
      connection.query(
        "SELECT COUNT(l_id) AS statuslead_count FROM crm_lead_primary_details WHERE status = ? AND clicked = ?",
        ["", 1],
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
      if (error) {
        throw error;
      }
      connection.query(
        "SELECT COUNT(lreq_id) AS statuslead_count FROM crm_lead_req_details WHERE ?? = ? AND (status = ? AND clicked = ?)",
        ["assignto_id", user_id, "", 1],
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

LeadByStatusRouter.post("/get-Undefined-Leads", async (req, res) => {
  const user_id = req.session.user[0].u_id;
  const limit = req.body.limit;
  const page = req.body.page;
  const user_role = req.session.user[0].urole;

  if (user_role === "Master" || user_role === "Admin") {
    pool.getConnection(function (error, connection) {
      if (error) {
        throw error;
      }
      connection.query(
        "SELECT crm_lead_primary_details.l_id AS l_id, crm_lead_req_details.lreq_id AS assignlead_id, GROUP_CONCAT(crm_users.username) AS assign_users, crm_lead_primary_details.create_dt, crm_lead_primary_details.lname, CONCAT(crm_lead_primary_details.p_ccode, ' ',crm_lead_primary_details.p_mob) AS mobile, crm_lead_primary_details.p_ccode, crm_lead_primary_details.p_mob, crm_lead_primary_details.p_email, crm_lead_primary_details.status, crm_lead_primary_details.pname, crm_lead_primary_details.followup, crm_lead_primary_details.followup_dt, crm_lead_primary_details.source, crm_lead_primary_details.city, crm_lead_primary_details.locality, crm_lead_primary_details.sub_locality, crm_lead_status.color, crm_lead_primary_details.clicked FROM crm_lead_primary_details LEFT JOIN crm_lead_req_details ON crm_lead_req_details.l_id = crm_lead_primary_details.l_id LEFT JOIN crm_lead_status ON crm_lead_primary_details.status = crm_lead_status.status LEFT JOIN crm_users ON crm_users.u_id = crm_lead_req_details.assignto_id WHERE (?? = ? AND ?? = ?) GROUP BY crm_lead_primary_details.l_id ORDER BY crm_lead_primary_details.l_id DESC LIMIT ? OFFSET ?",
        [
          "crm_lead_primary_details.status",
          "",
          "crm_lead_primary_details.clicked",
          "1",
          limit,
          page,
        ],
        (err, result) => {
          if (err) {
            console.log(err);
          }
          if (result.length > 0) {
            res.send(result);
            //
          } else {
            res.send("No Data Found");
          }
          connection.release();
        }
      );
    });
  } else {
    pool.getConnection(function (error, connection) {
      if (error) {
        throw error;
      }
      connection.query(
        "SELECT crm_lead_req_details.lreq_id AS l_id, crm_lead_req_details.l_id AS assignlead_id, GROUP_CONCAT(CASE WHEN crm_users.u_id <> ? THEN crm_users.username END) AS assign_users, crm_lead_primary_details.create_dt, crm_lead_primary_details.lname, crm_lead_primary_details.pname, crm_lead_primary_details.p_ccode, crm_lead_primary_details.p_mob, crm_lead_primary_details.p_email, crm_lead_primary_details.source, crm_lead_req_details.followup, crm_lead_req_details.followup_dt, crm_lead_req_details.city, crm_lead_req_details.locality, crm_lead_req_details.sub_locality, crm_lead_status.color, crm_lead_req_details.status FROM crm_lead_primary_details LEFT JOIN crm_lead_req_details ON crm_lead_primary_details.l_id = crm_lead_req_details.l_id LEFT JOIN crm_lead_status ON crm_lead_req_details.status = crm_lead_status.status LEFT JOIN crm_users ON crm_lead_req_details.assignto_id = crm_users.u_id WHERE ?? = ? AND (?? = ? AND ?? = ?) GROUP BY crm_lead_req_details.l_id ORDER BY crm_lead_req_details.l_id DESC LIMIT ? OFFSET ?",
        [
          user_id,
          "crm_lead_req_details.assignto_id",
          user_id,
          "crm_lead_req_details.status",
          "",
          "crm_lead_req_details.clicked",
          "1",
          limit,
          page,
        ],
        (err, result) => {
          if (err) {
            console.log(err);
          }
          if (result.length > 0) {
            res.send(result);
            //
          } else {
            res.send("No Data Found");
          }
          connection.release();
        }
      );
    });
  }
});

LeadByStatusRouter.post("/get-New-Leads", async (req, res) => {
  const user_id = req.session.user[0].u_id;
  const limit = req.body.limit;
  const page = req.body.page;
  const user_role = req.session.user[0].urole;

  if (user_role === "Master" || user_role === "Admin") {
    pool.getConnection(function (error, connection) {
      if (error) {
        throw error;
      }
      connection.query(
        "SELECT crm_lead_primary_details.l_id AS l_id, crm_lead_req_details.lreq_id AS assignlead_id, crm_lead_primary_details.create_dt, crm_lead_primary_details.lname, crm_lead_primary_details.p_ccode, crm_lead_primary_details.p_mob, crm_lead_primary_details.p_email, crm_lead_primary_details.status, crm_lead_primary_details.pname, crm_lead_primary_details.followup, crm_lead_primary_details.followup_dt, crm_lead_primary_details.source, crm_lead_primary_details.city, crm_lead_primary_details.locality, crm_lead_primary_details.sub_locality, crm_lead_status.color, crm_lead_primary_details.clicked FROM crm_lead_primary_details LEFT JOIN crm_lead_status ON crm_lead_primary_details.status = crm_lead_status.status LEFT JOIN crm_lead_req_details ON crm_lead_primary_details.l_id = crm_lead_req_details.l_id WHERE ?? = ? OR ?? = ? ORDER BY l_id DESC LIMIT ? OFFSET ?",
        [
          "crm_lead_primary_details.status",
          "New Lead",
          "crm_lead_primary_details.clicked",
          0,
          limit,
          page,
        ],
        (err, result) => {
          if (err) {
            console.log(err);
          }
          if (result.length > 0) {
            res.send(result);
          } else {
            res.send("No Data Found");
          }
          connection.release();
        }
      );
    });
  } else {
    pool.getConnection(function (error, connection) {
      if (error) {
        throw error;
      }
      connection.query(
        "SELECT crm_lead_req_details.lreq_id AS l_id, crm_lead_req_details.l_id AS assignlead_id, crm_lead_primary_details.create_dt, crm_lead_primary_details.lname, crm_lead_primary_details.pname, crm_lead_primary_details.p_ccode, crm_lead_primary_details.p_mob, crm_lead_primary_details.p_email, crm_lead_primary_details.source, crm_lead_req_details.followup, crm_lead_req_details.followup_dt, crm_lead_req_details.city, crm_lead_req_details.locality, crm_lead_req_details.sub_locality, crm_lead_status.color, crm_lead_req_details.status, crm_lead_primary_details.clicked FROM crm_lead_primary_details JOIN crm_lead_req_details ON crm_lead_primary_details.l_id = crm_lead_req_details.l_id LEFT JOIN crm_lead_status ON crm_lead_req_details.status = crm_lead_status.status WHERE ?? = ? AND ?? = ? ORDER BY crm_lead_req_details.l_id DESC LIMIT ? OFFSET ?",
        // "SELECT crm_lead_req_details.lreq_id AS l_id, crm_lead_req_details.l_id AS assignlead_id, crm_lead_primary_details.create_dt, crm_lead_primary_details.lname, crm_lead_primary_details.pname, crm_lead_primary_details.p_ccode, crm_lead_primary_details.p_mob, crm_lead_primary_details.p_email, crm_lead_primary_details.source, crm_lead_req_details.followup, crm_lead_req_details.followup_dt, crm_lead_req_details.city, crm_lead_req_details.locality, crm_lead_req_details.sub_locality, crm_lead_status.color, crm_lead_req_details.status FROM crm_lead_primary_details JOIN crm_lead_req_details ON crm_lead_primary_details.l_id = crm_lead_req_details.l_id LEFT JOIN crm_lead_status ON crm_lead_req_details.status = crm_lead_status.status WHERE ?? = ? AND (?? = ? OR ?? = ?) ORDER BY crm_lead_req_details.l_id DESC LIMIT ? OFFSET ?",
        [
          "crm_lead_req_details.assignto_id",
          user_id,
        //   "crm_lead_req_details.status",
        //   "New Lead",
          "crm_lead_req_details.clicked",
          0,
          limit,
          page,
        ],
        (err, result) => {
          if (err) {
            console.log(err);
          }
          if (result.length > 0) {
            res.send(result);
          } else {
            res.send("No Data Found");
          }
          connection.release();
        }
      );
    });
  }
});

LeadByStatusRouter.post("/get-NewLead-Count", async (req, res) => {
  const user_id = req.session.user[0].u_id;
  const user_role = req.session.user[0].urole;

  if (user_role === "Master" || user_role === "Admin") {
    pool.getConnection(function (error, connection) {
      if (error) {
        throw error;
      }
      connection.query(
        "SELECT COUNT(l_id) AS newlead_count FROM crm_lead_primary_details WHERE clicked = ?",
        [0],
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
      if (error) {
        throw error;
      }
      connection.query(
        "SELECT COUNT(lreq_id) AS newlead_count FROM crm_lead_req_details WHERE ?? = ? AND (clicked = ?)",
        ["assignto_id", user_id, 0],
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


LeadByStatusRouter.post("/get-teammember-UnknownLead-Count", async (req, res) => {
  const user_id = req.body.u_id;
  const user_role = req.session.user[0].urole;
  console.log(req.body, user_id, "SHKJHDKSHKDHKD");

  if (user_role === "Master" || user_role === "Admin") {
    pool.getConnection(function (error, connection) {
      if (error) {
        throw error;
      }
      connection.query(
        "SELECT COUNT(lrd.lreq_id) AS status_count FROM crm_lead_req_details AS lrd JOIN crm_lead_primary_details AS lp ON lp.l_id = lrd.l_id WHERE lrd.assignto_id = ? AND lrd.status = ''",
        [user_id],
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
      if (error) {
        throw error;
      }
      connection.query(
        "SELECT COUNT(lreq_id) AS newlead_count FROM crm_lead_req_details WHERE ?? = ? AND status = ''",
        ["assignto_id", user_id],
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


LeadByStatusRouter.post("/get-teammember-NewLead-Count", async (req, res) => {
  const user_id = req.body.u_id;
  const user_role = req.session.user[0].urole;
  console.log(req.body,user_id,"SHKJHDKSHKDHKD")



  if (user_role === "Master" || user_role === "Admin") {
    pool.getConnection(function (error, connection) {
      if (error) {
        throw error;
      }
      connection.query(
        "SELECT COUNT(lrd.lreq_id) AS status_count FROM crm_lead_req_details AS lrd JOIN crm_lead_primary_details AS lp ON lp.l_id = lrd.l_id WHERE lrd.assignto_id = ?  AND lrd.clicked = ?",
        [user_id, 0],
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
      if (error) {
        throw error;
      }
      connection.query(
        "SELECT COUNT(lreq_id) AS newlead_count FROM crm_lead_req_details WHERE ?? = ? AND (clicked = ?)",
        ["assignto_id", user_id, 0],
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



LeadByStatusRouter.post("/get-teammember-status-user-wise-leads", (req, res) => {
  const user_role = req.session.user[0].urole;
  const user_id = req.session.user[0].u_id;
  const { page, pageSize, status,teamID } = req.body;

  const offset = (page - 1) * pageSize;
  const limit = parseInt(pageSize);
  
  

  let query = "SELECT lrd.lreq_id AS assignlead_id, lrd.l_id AS l_id, lp.create_dt, lp.lname, lrd.status, lrd.pname, lp.source, ls.color, lrd.clicked,GROUP_CONCAT(cu.username) AS assign_users, CONCAT(lp.p_ccode, ' ', lp.p_mob) AS mobile, lp.p_ccode, lp.p_mob, lp.p_email,GROUP_CONCAT(lrd.status, ' - ', cu.username) AS status, lp.pname, lp.followup, lp.followup_dt, lp.city, lp.sub_locality, lp.comments,lp.source_type, lp.service_type, lp.ptype, lp.pcategory, lp.pconfiguration, lp.min_area, lp.max_area, lp.area_unit, lp.min_price,lp.max_price, lp.price_unit, lp.country, lp.state, lp.other_details, lp.assign_status , (SELECT clh.status FROM crm_lead_history AS clh WHERE clh.l_id = lp.l_id ORDER BY clh.update_dt DESC LIMIT 1) AS latest_status, (SELECT cu.username FROM crm_lead_history AS clh LEFT JOIN crm_users AS cu ON clh.u_id = cu.u_id WHERE clh.l_id = lp.l_id ORDER BY clh.update_dt DESC LIMIT 1) AS latest_username, (SELECT ls.color FROM crm_lead_history AS clh LEFT JOIN crm_lead_status AS ls ON clh.status = ls.status WHERE clh.l_id = lp.l_id ORDER BY clh.update_dt DESC LIMIT 1) AS latest_status_color FROM crm_lead_req_details AS lrd JOIN crm_lead_primary_details AS lp ON lp.l_id = lrd.l_id LEFT JOIN crm_lead_status AS ls ON lrd.status = ls.status  LEFT JOIN crm_users AS cu ON cu.u_id = lrd.assignto_id WHERE ";
  let params = [];
  
  if(status === "all"){
      query += "lrd.assignto_id = ? GROUP BY lrd.lreq_id ORDER BY lrd.lreq_id DESC LIMIT ? OFFSET ?"
      params.push(teamID, limit, offset)
  } 
  else if(status === "Fresh"){
     query += "lrd.assignto_id = ? AND lrd.clicked = ? GROUP BY lrd.lreq_id ORDER BY lrd.lreq_id DESC LIMIT ? OFFSET ?"
      params.push(teamID,0 ,limit,offset)
  }
  else if(status === "Unknown"){
      query += "lrd.assignto_id = ? AND lrd.status = ? GROUP BY lrd.lreq_id ORDER BY lrd.lreq_id DESC LIMIT ? OFFSET ?"
      params.push(teamID, '' ,limit,offset)
  }
   else if(status === "Assigned"){
      query += "lrd.assignto_id = ? AND lrd.assign_status = ? GROUP BY lrd.lreq_id ORDER BY lrd.lreq_id DESC LIMIT ? OFFSET ?"
      params.push(teamID, 'YES' ,limit,offset)
  }
    else if(status === "Non Assigned"){
      query += "lrd.assignto_id = ? AND lrd.assign_status = ? GROUP BY lrd.lreq_id ORDER BY lrd.lreq_id DESC LIMIT ? OFFSET ?"
      params.push(teamID, '' ,limit,offset)
  }
  else {
      query += "lrd.assignto_id = ? AND lrd.status = ? GROUP BY lrd.lreq_id ORDER BY lrd.lreq_id DESC LIMIT ? OFFSET ?";
      params.push(teamID, status, limit, offset)
  }


  pool.getConnection(function (error, connection) {
    if (error) throw error;
    connection.query(query, params,
      (err, result) => {
        if (err) {
          ErrorEmailHandler(err);
          console.log(err);
        } else {
          res.json(result);
        }
        connection.release();
      }
    );
  });
});

// for ES5
module.exports = LeadByStatusRouter;
