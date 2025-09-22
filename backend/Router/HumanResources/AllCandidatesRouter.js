// for ES5
const express = require("express");
const pool = require("../../Database.js");

const AllCandidatesRouter = express.Router();

// AllCandidatesRouter.get("/get-all-candidate-table-data", (req, res) => {
//   const user_role = req.session.user[0].urole;
//   const user_id = req.session.user[0].u_id;
//   const { page, pageSize } = req.query;
//   const offset = (page - 1) * pageSize;
//   const limit = parseInt(pageSize);

//   if (
//     user_role === "HR Head" ||
//     user_role === "Master" ||
//     user_role === "Admin"
//   ) {
//     pool.getConnection(function (error, connection) {
//       if (error) throw error;
//       connection.query(
//         "SELECT crm_candidate_details.`c_id`,crm_candidate_details.`create_dt`,crm_candidate_details.`update_dt`,crm_candidate_details.`c_ccode`,crm_candidate_details.`c_mob`,crm_candidate_details.`c_alt_ccode`,crm_candidate_details.`c_alt_mob`,crm_candidate_details.`c_email`,crm_candidate_details.`c_name`,crm_candidate_details.`c_source`,crm_candidate_details.`c_position`,crm_candidate_details.`c_status`,crm_candidate_details.`country`,crm_candidate_details.`state`,crm_candidate_details.`city`,crm_candidate_details.`locality`,crm_candidate_details.`followup`,crm_candidate_details.`followup_dt`,crm_candidate_details.`comments`,crm_candidate_details.`c_pdf`, crm_users.username as assign_to FROM `crm_candidate_details` LEFT JOIN crm_users ON crm_users.u_id = crm_candidate_details.assign_to ORDER BY crm_candidate_details.c_id DESC LIMIT ? OFFSET ?",
//         [limit, offset],
//         (err, result) => {
//           if (err) {
//             console.log(err);
//           } else {
//             res.json(result);
//           }
//           connection.release();
//         }
//       );
//     });
//   } else if (user_role === "HR") {
//     pool.getConnection(function (error, connection) {
//       if (error) throw error;
//       connection.query(
//         "SELECT `c_id`,`create_dt`,`update_dt`,`c_ccode`,`c_mob`,`c_email`,`c_name`,`c_source`,`c_position`,`c_status`,`country`,`state`,`city`,`locality`,`followup`,`followup_dt`,`comments`,`c_pdf` FROM `crm_candidate_details` WHERE ?? = ? OR ?? = ? LIMIT ? OFFSET ?",
//         ["created_by", user_id, "assign_to", user_id, limit, offset],
//         (err, result) => {
//           if (err) {
//             console.log(err);
//           } else {
//             res.json(result);
//           }
//           connection.release();
//         }
//       );
//     });
//   } else {
//     res.json([]);
//   }
// });


AllCandidatesRouter.get("/get-all-candidate-table-data", (req, res) => {
  const user_role = req.session.user[0].urole;
  const user_id = req.session.user[0].u_id;
  const { page, pageSize } = req.query;
  const offset = (page - 1) * pageSize;
  const limit = parseInt(pageSize);

  if (
    user_role === "HR Head" ||
    user_role === "Master" ||
    user_role === "Admin"
  ) {
    pool.getConnection(function (error, connection) {
      if (error) throw error;
      connection.query(
        "SELECT crm_candidate_details.`c_id`,crm_candidate_details.`create_dt`,crm_candidate_details.`update_dt`,crm_candidate_details.`c_ccode`,crm_candidate_details.`c_mob`,crm_candidate_details.`c_alt_ccode`,crm_candidate_details.`c_alt_mob`,crm_candidate_details.`c_email`,crm_candidate_details.`c_name`,crm_candidate_details.`c_source`,crm_candidate_details.`c_position`,crm_candidate_details.`c_status`, crm_candidate_details.`c_dob` ,crm_candidate_details.`country`,crm_candidate_details.`state`,crm_candidate_details.`city`,crm_candidate_details.`locality`,crm_candidate_details.`followup`,crm_candidate_details.`followup_dt`,crm_candidate_details.`comments`,crm_candidate_details.`c_pdf`, crm_users.username as assign_to FROM `crm_candidate_details` LEFT JOIN crm_users ON crm_users.u_id = crm_candidate_details.assign_to ORDER BY crm_candidate_details.c_id DESC LIMIT ? OFFSET ?",
        [limit, offset],
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
  } else if (user_role === "HR") {
    pool.getConnection(function (error, connection) {
      if (error) throw error;
      connection.query(
        "SELECT `c_id`,`create_dt`,`update_dt`,`c_ccode`,`c_mob`,`c_email`,`c_name`,`c_source`,`c_position`,`c_status`,`c_dob`,`country`,`state`,`city`,`locality`,`followup`,`followup_dt`,`comments`,`c_pdf` FROM `crm_candidate_details` WHERE ?? = ? OR ?? = ? LIMIT ? OFFSET ?",
        ["created_by", user_id, "assign_to", user_id, limit, offset],
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
    res.json([]);
  }
});


AllCandidatesRouter.post("/get-all-candidate-table-data-count", (req, res) => {
  const user_role = req.session.user[0].urole;
  const user_id = req.session.user[0].u_id;
  if (
    user_role === "HR Head" ||
    user_role === "Master" ||
    user_role === "Admin"
  ) {
    pool.getConnection(function (error, connection) {
      if (error) throw error;
      connection.query(
        "SELECT COUNT(`c_id`) AS totalCount FROM `crm_candidate_details`",
        (err, result) => {
          if (err) {
            console.log("error");
          } else {
            res.json(result[0].totalCount);
          }
          connection.release();
        }
      );
    });
  } else if (user_role === "HR") {
    pool.getConnection(function (error, connection) {
      if (error) throw error;
      connection.query(
        "SELECT COUNT(`c_id`) AS totalCount FROM `crm_candidate_details` WHERE ?? = ?",
        ["assign_to", user_id],
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
  } else {
    res.json(0);
  }
});

// for ES5
module.exports = AllCandidatesRouter;
