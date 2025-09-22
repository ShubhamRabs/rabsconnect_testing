// for ES5
const express = require('express');
const pool = require('../../Database.js');
const dayjs = require('dayjs');

const UpcomingLeadRouter = express.Router();

UpcomingLeadRouter.get("/get-upcoming-lead-table-data", (req, res) => {
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
        "SELECT lpd.l_id AS l_id, lrd.lreq_id AS assignlead_id, GROUP_CONCAT(cu.username) AS assign_users, lpd.create_dt, lpd.brk_id, lpd.ref_name, lpd.ref_ccode, lpd.ref_mob, lpd.ref_email, lpd.lname, CONCAT(lpd.p_ccode, ' ', lpd.p_mob) AS mobile, lpd.p_ccode, lpd.p_mob, lpd.s_ccode, lpd.s_mob, lpd.p_email, lpd.status as admin_status, GROUP_CONCAT(lrd.status,' - ', cu.username) AS users_status,lpd.pname, lpd.followup, lpd.followup_dt, lpd.source, lpd.city, lpd.locality, lpd.sub_locality, lpd.comments, ls.color, lpd.clicked, lpd.source_type, lpd.service_type, lpd.ptype, lpd.pcategory, lpd.pconfiguration, lpd.min_area, lpd.max_area, lpd.area_unit, lpd.min_price, lpd.max_price, lpd.price_unit, lpd.country, lpd.state, lpd.other_details,  lpd.assign_status FROM crm_lead_primary_details AS lpd LEFT JOIN crm_lead_req_details AS lrd ON lrd.l_id = lpd.l_id LEFT JOIN crm_lead_status AS ls ON ls.status = lpd.status LEFT JOIN crm_users AS cu ON cu.u_id = lrd.assignto_id WHERE DATE(lpd.followup_dt) > ? AND lpd.followup = ? GROUP BY lpd.l_id ORDER BY lpd.l_id DESC LIMIT ? OFFSET ?;",
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
        "SELECT lrd.lreq_id AS l_id, lrd.l_id AS assignlead_id, lpd.create_dt, lpd.brk_id, lpd.ref_name, lpd.ref_ccode, lpd.ref_mob, lpd.ref_email, lpd.lname, lrd.status, lrd.pname, lpd.source, ls.color, lrd.clicked, GROUP_CONCAT(cu.username) AS assign_users, CONCAT(lpd.p_ccode, ' ', lpd.p_mob) AS mobile, lpd.p_ccode,p_mob, lpd.p_email, GROUP_CONCAT(lrd.status,' - ', cu.username) AS users_status, lpd.pname, lrd.followup, lrd.followup_dt, lpd.city, lpd.sub_locality, lrd.comments, lpd.source_type, lpd.service_type, lpd.ptype, lpd.pcategory, lpd.pconfiguration, lpd.min_area, lpd.max_area, lpd.area_unit, lpd.min_price, lpd.max_price, lpd.price_unit, lpd.country, lpd.state, lpd.other_details, lpd.assign_status FROM crm_lead_req_details AS lrd JOIN crm_lead_primary_details AS lpd ON lpd.l_id = lrd.l_id LEFT JOIN crm_lead_status AS ls ON lrd.status = ls.status LEFT JOIN crm_users AS cu ON cu.u_id = lrd.assignto_id WHERE lrd.assignto_id = ? AND DATE(lrd.followup_dt) > ? AND lrd.followup = ? GROUP BY lrd.lreq_id ORDER BY lrd.lreq_id DESC LIMIT ? OFFSET ?",
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

UpcomingLeadRouter.get("/get-mobile-upcoming-lead-table-data", (req, res) => {
  const current_date = dayjs().format("YYYY-MM-DD");
  const user_role = req.session.user[0].urole;
  const user_id = req.session.user[0].u_id;
  const { page, pageSize } = req.query;
  const offset = (page - 1) * pageSize;
  const limit = parseInt(pageSize);
  console.log("Hello upcoming");

  if (user_role === "Master" || user_role === "Admin") {
    pool.getConnection(function (error, connection) {
      if (error) throw error;
      connection.query(
        "SELECT * FROM (SELECT lrd.l_id,lrd.lreq_id AS assignlead_id,NULL AS assign_users, lrd.create_dt,lpd.lname, CONCAT(lpd.p_ccode, ' ', lpd.p_mob) AS mobile, lpd.p_ccode, lpd.p_mob,lpd.p_email, lrd.s_ccode, lrd.s_mob,NULL as admin_status, lrd.status as users_status,lrd.pname,lrd.followup,lrd.followup_dt,(SELECT cu.username FROM crm_users AS cu WHERE cu.u_id = lrd.assignto_id) AS followup_user,'User' AS lead_from,lpd.source, lrd.city, lrd.locality, lrd.sub_locality, lrd.comments, lrd.clicked,lpd.source_type,(SELECT color FROM crm_lead_status WHERE status = lrd.status) AS color, lrd.service_type, lrd.ptype, lrd.pcategory, lrd.pconfiguration, lrd.min_area, lrd.max_area, lrd.area_unit, lrd.min_price, lrd.max_price, lrd.price_unit, lrd.country, lrd.state, lrd.other_details,  lrd.assign_status FROM crm_lead_req_details AS lrd LEFT JOIN crm_lead_primary_details AS lpd ON lrd.l_id = lpd.l_id WHERE DATE(lrd.followup_dt) > ? AND lrd.followup = ? AND DATE(lrd.followup_dt) != '0000-00-00 00:00:00' UNION SELECT lpd.l_id, NULL AS assignlead_id,GROUP_CONCAT(cu.username) AS assign_users, lpd.create_dt,lpd.lname, CONCAT(lpd.p_ccode, ' ', lpd.p_mob) AS mobile, lpd.p_ccode, lpd.p_mob,lpd.p_email,lpd.s_ccode, lpd.s_mob, lpd.status as admin_status,NULL AS user_status,lpd.pname, lpd.followup,lpd.followup_dt,(SELECT cu.username FROM crm_users AS cu WHERE cu.urole = 'Master') AS followup_user,'Admin' AS lead_from,lpd.source,lpd.city, lpd.locality, lpd.sub_locality, lpd.comments, lpd.clicked,lpd.source_type,(SELECT color FROM crm_lead_status WHERE status = lpd.status) AS color, lpd.service_type, lpd.ptype, lpd.pcategory, lpd.pconfiguration, lpd.min_area, lpd.max_area, lpd.area_unit, lpd.min_price, lpd.max_price, lpd.price_unit, lpd.country, lpd.state, lpd.other_details,lpd.assign_status FROM crm_lead_primary_details AS lpd LEFT JOIN crm_lead_req_details AS lrd ON lpd.l_id = lrd.l_id LEFT JOIN crm_users AS cu ON cu.u_id = lrd.assignto_id WHERE DATE(lpd.followup_dt) > ? AND lpd.followup = ? AND DATE(lpd.followup_dt) != '0000-00-00 00:00:00' GROUP BY lpd.l_id) AS combine_result WHERE l_id IS NOT NULL ORDER BY followup_dt LIMIT ? OFFSET ?",
        [current_date, "Yes",current_date, "Yes", limit, offset],
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
        "SELECT lrd.lreq_id AS l_id, lrd.l_id AS assignlead_id, lpd.create_dt, lpd.brk_id, lpd.ref_name, lpd.ref_ccode, lpd.ref_mob, lpd.ref_email, lpd.lname, lrd.status, lrd.pname, lpd.source, ls.color, lrd.clicked, GROUP_CONCAT(cu.username) AS assign_users, CONCAT(lpd.p_ccode, ' ', lpd.p_mob) AS mobile, lpd.p_ccode,p_mob, lpd.p_email, GROUP_CONCAT(lrd.status,' - ', cu.username) AS users_status, lpd.pname, lrd.followup, lrd.followup_dt, lpd.city, lpd.sub_locality, lrd.comments, lpd.source_type, lpd.service_type, lpd.ptype, lpd.pcategory, lpd.pconfiguration, lpd.min_area, lpd.max_area, lpd.area_unit, lpd.min_price, lpd.max_price, lpd.price_unit, lpd.country, lpd.state, lpd.other_details, lpd.assign_status FROM crm_lead_req_details AS lrd JOIN crm_lead_primary_details AS lpd ON lpd.l_id = lrd.l_id LEFT JOIN crm_lead_status AS ls ON lrd.status = ls.status LEFT JOIN crm_users AS cu ON cu.u_id = lrd.assignto_id WHERE lrd.assignto_id = ? AND DATE(lrd.followup_dt) > ? AND lrd.followup = ? GROUP BY lrd.lreq_id ORDER BY lrd.lreq_id DESC LIMIT ? OFFSET ?",
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

UpcomingLeadRouter.post("/get-mobile-upcoming-lead-table-data-count", (req, res) => {
  const user_role = req.session.user[0].urole;
  const user_id = req.session.user[0].u_id;
  const today = new Date();
  const current_date = dayjs().format("YYYY-MM-DD");
  
  if (user_role === "Master" || user_role === "Admin") {
    pool.getConnection(function (error, connection) {
      if (error) throw error;
      connection.query(
        "SELECT COUNT(*) AS upcomingleadcount FROM (SELECT crm_lead_primary_details.followup_dt,crm_lead_primary_details.followup,crm_lead_primary_details.l_id FROM crm_lead_primary_details WHERE DATE(crm_lead_primary_details.followup_dt) > ? AND crm_lead_primary_details.followup = ? AND DATE(crm_lead_primary_details.followup_dt) != '0000-00-00 00:00:00' GROUP BY crm_lead_primary_details.l_id UNION SELECT lrd.followup_dt,lrd.followup,lrd.lreq_id AS l_id FROM crm_lead_req_details AS lrd WHERE DATE(lrd.followup_dt) > ? AND lrd.followup = ? AND DATE(lrd.followup_dt) != '0000-00-00 00:00:00') AS combined_results WHERE l_id IS NOT NULL",
        [current_date, "Yes", current_date, "Yes"],
        (err, result) => {
          if (err) {
            console.log("error");
          } else {
            res.json(result[0].upcomingleadcount);
          }
          connection.release();
        }
      );
    });
  } else {
    pool.getConnection(function (error, connection) {
      if (error) throw error;
      connection.query(
        "SELECT COUNT(lrd.l_id) AS upcomingleadcount FROM crm_lead_req_details AS lrd JOIN crm_lead_primary_details AS lp ON lp.l_id = lrd.l_id WHERE DATE(lrd.followup_dt) > ? AND lrd.followup = ? AND lrd.assignto_id = ?",
        [current_date, "Yes", user_id],
        (err, result) => {
          if (err) {
            console.log(err);
          } else {
            res.json(result[0].upcomingleadcount);
          }
          connection.release();
        }
      );
    });
  }
});

UpcomingLeadRouter.post("/get-upcoming-lead-table-data-count", (req, res) => {
  const user_role = req.session.user[0].urole;
  const user_id = req.session.user[0].u_id;
  const today = new Date();
  const current_date = dayjs().format("YYYY-MM-DD");
  if (user_role === "Master" || user_role === "Admin") {
    pool.getConnection(function (error, connection) {
      if (error) throw error;
      connection.query(
        "SELECT COUNT(crm_lead_primary_details.l_id) AS upcomingleadcount FROM crm_lead_primary_details WHERE DATE(crm_lead_primary_details.followup_dt) > ? AND crm_lead_primary_details.followup = ? ORDER BY crm_lead_primary_details.l_id DESC",
        [current_date, "Yes"],
        (err, result) => {
          if (err) {
            console.log("error");
          } else {
            res.json(result[0].upcomingleadcount);
          }
          connection.release();
        }
      );
    });
  } else {
    pool.getConnection(function (error, connection) {
      if (error) throw error;
      connection.query(
        "SELECT COUNT(lrd.l_id) AS upcomingleadcount FROM crm_lead_req_details AS lrd JOIN crm_lead_primary_details AS lp ON lp.l_id = lrd.l_id WHERE DATE(lrd.followup_dt) > ? AND lrd.followup = ? AND lrd.assignto_id = ?",
        [current_date, "Yes", user_id],
        (err, result) => {
          if (err) {
            console.log(err);
          } else {
            res.json(result[0].upcomingleadcount);
          }
          connection.release();
        }
      );
    });
  }
});

// app router
// UpcomingLeadRouter.post('/get-upcoming-lead-table-data', (req, res) => {
//   const current_date = dayjs().format('YYYY-MM-DD');
//   const user_id = req.session.user[0].u_id;
//   const limit = req.body.limit;
//   const page = req.body.page;
//   const user_role = req.session.user[0].urole;

//   if (user_role === 'Master' || user_role === 'Admin') {
//     pool.getConnection(function (error, connection) {
//       if (error) {
//         throw error;
//       }
//       connection.query(
//         'SELECT crm_lead_primary_details.l_id AS l_id, crm_lead_req_details.lreq_id AS assignlead_id, GROUP_CONCAT(crm_users.username) AS assign_users, crm_lead_primary_details.create_dt, crm_lead_primary_details.lname, CONCAT(crm_lead_primary_details.p_ccode, " ",crm_lead_primary_details.p_mob) AS mobile, crm_lead_primary_details.p_ccode, crm_lead_primary_details.p_mob, crm_lead_primary_details.p_email, crm_lead_primary_details.pname, crm_lead_primary_details.followup, crm_lead_primary_details.followup_dt, crm_lead_primary_details.source, crm_lead_primary_details.city, crm_lead_primary_details.locality, crm_lead_primary_details.sub_locality, crm_lead_primary_details.status, crm_lead_status.color, crm_lead_primary_details.clicked FROM crm_lead_primary_details LEFT JOIN crm_lead_req_details ON crm_lead_req_details.l_id = crm_lead_primary_details.l_id LEFT JOIN crm_lead_status ON crm_lead_primary_details.status = crm_lead_status.status LEFT JOIN crm_users ON crm_users.u_id = crm_lead_req_details.assignto_id WHERE DATE(crm_lead_primary_details.followup_dt) > ? AND crm_lead_primary_details.followup = ? AND crm_lead_primary_details.status != "Broker" AND crm_lead_primary_details.status != "Dead" AND crm_lead_primary_details.status != "Booking Done" AND crm_lead_primary_details.status != "Wrong Number" AND crm_lead_primary_details.status != "Not Interested" AND crm_lead_primary_details.status != "NI" GROUP BY crm_lead_primary_details.l_id ORDER BY crm_lead_primary_details.l_id DESC LIMIT ? OFFSET ?',
//         [current_date, 'Yes', limit, page],
//         (err, result) => {
//           if (err) {
//             console.log(err);
//           }
//           if (result.length > 0) {
//             res.send(result);
//             //
//           } else {
//             res.send('No Data Found');
//           }
//           connection.release();
//         },
//       );
//     });
//   } else {
//     pool.getConnection(function (error, connection) {
//       if (error) {
//         throw error;
//       }
//       connection.query(
//         'SELECT crm_lead_req_details.lreq_id AS l_id, crm_lead_req_details.l_id AS assignlead_id, GROUP_CONCAT(CASE WHEN crm_users.u_id <> ? THEN crm_users.username END) AS assign_users, crm_lead_primary_details.create_dt, crm_lead_primary_details.lname, crm_lead_primary_details.pname, CONCAT(crm_lead_primary_details.p_ccode, " ",crm_lead_primary_details.p_mob) AS mobile, crm_lead_primary_details.p_ccode, crm_lead_primary_details.p_mob, crm_lead_primary_details.p_email, crm_lead_primary_details.source, crm_lead_req_details.followup, crm_lead_req_details.followup_dt, crm_lead_req_details.city, crm_lead_req_details.locality, crm_lead_req_details.sub_locality, crm_lead_status.color, crm_lead_req_details.status FROM crm_lead_primary_details JOIN crm_lead_req_details ON crm_lead_primary_details.l_id = crm_lead_req_details.l_id LEFT JOIN crm_lead_status ON crm_lead_req_details.status = crm_lead_status.status LEFT JOIN crm_users ON crm_lead_req_details.assignto_id = crm_users.u_id WHERE ?? = ? AND DATE(crm_lead_req_details.followup_dt) > ? AND crm_lead_req_details.followup = ? AND crm_lead_req_details.status != "Broker" AND crm_lead_req_details.status != "Dead" AND crm_lead_req_details.status != "Booking Done" AND crm_lead_req_details.status != "Wrong Number" AND crm_lead_req_details.status != "Not Interested" AND crm_lead_req_details.status != "NI" GROUP BY crm_lead_req_details.l_id ORDER BY crm_lead_req_details.lreq_id DESC LIMIT ? OFFSET ?',
//         [
//           user_id,
//           'crm_lead_req_details.assignto_id',
//           user_id,
//           current_date,
//           'Yes',
//           limit,
//           page,
//         ],
//         (err, result) => {
//           if (err) {
//             console.log(err);
//           }
//           if (result.length > 0) {
//             res.send(result);
//             //
//           } else {
//             res.send('No Data Found');
//           }
//           connection.release();
//         },
//       );
//     });
//   }
// });

// UpcomingLeadRouter.post('/get-upcoming-lead-table-data-count', (req, res) => {
//   const current_date = dayjs().format('YYYY-MM-DD');
//   const user_id = req.session.user[0].u_id;
//   const user_role = req.session.user[0].urole;

//   if (user_role === 'Master' || user_role === 'Admin') {
//     pool.getConnection(function (error, connection) {
//       if (error) {
//         throw error;
//       }
//       connection.query(
//         'SELECT COUNT(crm_lead_primary_details.l_id) AS leadcount FROM crm_lead_primary_details WHERE DATE(crm_lead_primary_details.followup_dt) > ? AND crm_lead_primary_details.followup = ? AND crm_lead_primary_details.status != "Broker" AND crm_lead_primary_details.status != "Dead" AND crm_lead_primary_details.status != "Booking Done" AND crm_lead_primary_details.status != "Wrong Number" AND crm_lead_primary_details.status != "Not Interested" AND crm_lead_primary_details.status != "NI" ORDER BY crm_lead_primary_details.l_id DESC',
//         [current_date, 'Yes'],
//         (err, result) => {
//           if (err) {
//             console.log(err);
//           }
//           if (result.length > 0) {
//             res.send(result);
//           } else {
//             res.send('No Data Found');
//           }
//           connection.release();
//         },
//       );
//     });
//   } else {
//     pool.getConnection(function (error, connection) {
//       if (error) {
//         throw error;
//       }
//       connection.query(
//         'SELECT COUNT(crm_lead_primary_details.l_id) AS leadcount FROM crm_lead_primary_details JOIN crm_lead_req_details ON crm_lead_primary_details.l_id = crm_lead_req_details.l_id WHERE ?? = ? AND DATE(crm_lead_req_details.followup_dt) > ? AND crm_lead_req_details.followup = ? AND crm_lead_req_details.status != "Broker" AND crm_lead_req_details.status != "Dead" AND crm_lead_req_details.status != "Booking Done" AND crm_lead_req_details.status != "Wrong Number" AND crm_lead_req_details.status != "Not Interested" AND crm_lead_req_details.status != "NI" ORDER BY crm_lead_req_details.l_id DESC',
//         ['crm_lead_req_details.assignto_id', user_id, current_date, 'Yes'],
//         (err, result) => {
//           if (err) {
//             console.log(err);
//           }
//           if (result.length > 0) {
//             res.send(result);
//           } else {
//             res.send('No Data Found');
//           }
//           connection.release();
//         },
//       );
//     });
//   }
// });

// for ES5
module.exports = UpcomingLeadRouter;
