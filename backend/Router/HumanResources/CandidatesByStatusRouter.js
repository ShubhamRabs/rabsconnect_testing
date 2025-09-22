// CandidatesByStatusRouter

const express = require("express");
const pool = require("../../Database.js");

const CandidatesByStatusRouter = express.Router();

CandidatesByStatusRouter.get(
  "/get-all-candidate-by-status",
  (req, res, next) => {
    let urole = req.session.user[0].urole;
    let u_id = req.session.user[0].u_id;
    let query =
      "SELECT COUNT(crm_candidate_details.c_id) AS counts,crm_candidate_details.c_status AS status FROM `crm_candidate_details` LEFT JOIN `crm_candidate_status` ON crm_candidate_details.c_status = crm_candidate_status.candidate_status GROUP BY crm_candidate_details.c_status;";
    if (urole != "Master" && urole != "HR Head") {
      // console.log("username",u_id);
      query =
        "SELECT COUNT(crm_candidate_details.c_id) AS counts,crm_candidate_details.c_status AS status FROM `crm_candidate_details` LEFT JOIN `crm_candidate_status` ON crm_candidate_details.c_status = crm_candidate_status.candidate_status WHERE assign_to = ? GROUP BY crm_candidate_details.c_status";
    }
    pool.getConnection((error, connection) => {
      if (error) {
        throw error;
      }
      connection.query(query, [u_id], (err, result) => {
        if (err) {
          console.log(err);
          res.status(400).json({
            error: error,
            message: "Some error occured",
          });
          // return;
        }
        res.status(200).json({
          message: "Data fetched successfully",
          data: result,
        });
        connection.release();
      });
    });
  }
);

CandidatesByStatusRouter.get(
  "/get-all-candidate-by-status-table-data",
  (req, res) => {
    const user_role = req.session.user[0].urole;
    const user_id = req.session.user[0].u_id;
    const { page, pageSize } = req.query;
    const offset = (page - 1) * pageSize;
    const limit = parseInt(pageSize);
    const candidateStatus = req.query.candidateStatus;
    const teamPage = req.query.teamPage;

    if (
      user_role === "HR Head" ||
      user_role === "Master" ||
      user_role === "Admin"
    ) {
      if (teamPage === "true") {
        pool.getConnection(function (error, connection) {
          if (error) throw error;
          connection.query(
            "SELECT crm_candidate_details.c_id,crm_candidate_details.create_dt,crm_candidate_details.update_dt,crm_candidate_details.c_ccode,crm_candidate_details.c_mob,crm_candidate_details.c_alt_ccode,crm_candidate_details.c_alt_mob,crm_candidate_details.c_email,crm_candidate_details.c_name,crm_candidate_details.c_source,crm_candidate_details.c_position,crm_candidate_details.c_status,crm_candidate_details.country,crm_candidate_details.state,crm_candidate_details.city,crm_candidate_details.locality,crm_candidate_details.followup,crm_candidate_details.followup_dt,crm_candidate_details.comments,crm_candidate_details.c_pdf,crm_users.username AS assign_to FROM crm_candidate_details LEFT JOIN crm_users ON crm_users.u_id = crm_candidate_details.assign_to WHERE crm_candidate_details.c_status = ? AND crm_candidate_details.assign_to <> 0 AND (crm_users.u_id IS NULL OR crm_users.urole NOT IN ('Master', 'HR Head')) ORDER BY crm_candidate_details.c_id DESC LIMIT ? OFFSET ?",
            [candidateStatus, limit, offset],
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
            "SELECT crm_candidate_details.`c_id`,crm_candidate_details.`create_dt`,crm_candidate_details.`update_dt`,crm_candidate_details.`c_ccode`,crm_candidate_details.`c_mob`,crm_candidate_details.`c_alt_ccode`,crm_candidate_details.`c_alt_mob`,crm_candidate_details.`c_email`,crm_candidate_details.`c_name`,crm_candidate_details.`c_source`,crm_candidate_details.`c_position`,crm_candidate_details.`c_status`,crm_candidate_details.`country`,crm_candidate_details.`state`,crm_candidate_details.`city`,crm_candidate_details.`locality`,crm_candidate_details.`followup`,crm_candidate_details.`followup_dt`,crm_candidate_details.`comments`,crm_candidate_details.`c_pdf`, crm_users.username as assign_to FROM `crm_candidate_details` LEFT JOIN crm_users ON crm_users.u_id = crm_candidate_details.assign_to WHERE crm_candidate_details.`c_status` = ? ORDER BY crm_candidate_details.c_id DESC LIMIT ? OFFSET ?",
            [candidateStatus, limit, offset],
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
    } else if (user_role === "HR") {
      pool.getConnection(function (error, connection) {
        if (error) throw error;
        connection.query(
          "SELECT `c_id`,`create_dt`,`update_dt`,`c_ccode`,`c_mob`,`c_email`,`c_name`,`c_source`,`c_position`,`c_status`,`country`,`state`,`city`,`locality`,`followup`,`followup_dt`,`comments`,`c_pdf` FROM `crm_candidate_details` WHERE ?? = ? OR ?? = ? AND c_status = ? LIMIT ? OFFSET ?",
          [
            "created_by",
            user_id,
            "assign_to",
            user_id,
            candidateStatus,
            limit,
            offset,
          ],
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
  }
);

CandidatesByStatusRouter.get(
  "/get-all-user-candidate-by-status",
  (req, res) => {
    let query =
      "SELECT COUNT(c_id) AS count, c_status FROM crm_candidate_details AS c LEFT JOIN crm_users AS u ON c.assign_to = u.u_id WHERE c.assign_to <> 0 AND (u.u_id IS NULL OR u.urole NOT IN ('Master', 'HR Head')) GROUP BY c_status";
    // "SELECT COUNT(c_id) AS count,c_status FROM crm_candidate_details WHERE assign_to NOT IN (SELECT u_id FROM crm_users WHERE urole = 'Master' OR urole = 'HR Head') GROUP BY c_status";
    pool.getConnection((error, connection) => {
      if (error) {
        throw error;
      }
      connection.query(query, (err, result) => {
        if (err) {
          console.log(err);
          res.status(400).json({
            error: error,
            message: "Some error occured",
          });
          // return;
        }
        res.status(200).json({
          message: "Data fetched successfully",
          data: result,
        });
        connection.release();
      });
    });
  }
);

// CandidatesByStatusRouter.post("/search-candidates-by-status", (req, res) => {
//   const user_role = req.session.user[0].urole;
//   const user_id = req.session.user[0].u_id;

//   const { page, pageSize, candidateStatus } = req.query;
//   const offset = (page - 1) * pageSize;
//   const limit = parseInt(pageSize);

//   const {
//     c_source,
//     c_position,
//     c_status,
//     country,
//     state,
//     city,
//     locality,
//     anytext,
//     pageName,
//     teamPage,
//   } = req.body.data;

//   pool.getConnection((error, connection) => {
//     if (error) {
//       console.error(error);
//       res.status(500).json({ error: "Internal Server Error" });
//       return;
//     }

//     let query;
//     let queryParams = [];
//     queryParams.push(candidateStatus);

//     // Base query
//     query =
//       "SELECT crm_candidate_details.`c_id`,crm_candidate_details.`create_dt`,crm_candidate_details.`update_dt`,crm_candidate_details.`c_ccode`,crm_candidate_details.`c_mob`,crm_candidate_details.`c_alt_ccode`,crm_candidate_details.`c_alt_mob`,crm_candidate_details.`c_email`,crm_candidate_details.`c_name`,crm_candidate_details.`c_source`,crm_candidate_details.`c_position`,crm_candidate_details.`c_status`,crm_candidate_details.`country`,crm_candidate_details.`state`,crm_candidate_details.`city`,crm_candidate_details.`locality`,crm_candidate_details.`followup`,crm_candidate_details.`followup_dt`,crm_candidate_details.`comments`,crm_candidate_details.`c_pdf`, crm_users.username as assign_to FROM `crm_candidate_details` LEFT JOIN crm_users ON crm_users.u_id = crm_candidate_details.assign_to WHERE c_id != '' AND c_status = ?";

//     if (
//       user_role == "Master" ||
//       user_role == "HR Head" ||
//       user_role == "Admin"
//     ) {
//       if (teamPage) {
//         query +=
//           " AND assign_to NOT IN (SELECT u_id FROM crm_users WHERE urole = 'Master' OR urole = 'HR Head')";
//       }
//     }

//     //  ======================= HR condition =======================
//     if (user_role === "HR") {
//       query += " AND (created_by = ? OR assign_to = ?) ";
//       queryParams.push(user_id, user_id);
//     }

//     //  ======================= Page search condition =======================
//     if (pageName === "Assign Candidates") {
//       query += " AND assign_by != '0' AND assign_to != '0' ";
//     } else if (pageName === "Non Assign Candidates") {
//       query += " AND assign_by = '0' AND assign_to = '0' ";
//     }

//     //  ======================= c_source =======================
//     if (Array.isArray(c_source) && c_source.length > 0) {
//       const whereConditions = c_source.map((param) => {
//         queryParams.push(`%${param}%`);
//         return "crm_candidate_details.c_source LIKE ?";
//       });
//       query += ` AND (${whereConditions.join(" OR ")})`;
//     }

//     // =======================  c_position  =======================
//     if (Array.isArray(c_position) && c_position.length > 0) {
//       const whereConditions = c_position.map((param) => {
//         queryParams.push(`%${param}%`);
//         return "crm_candidate_details.c_position LIKE ?";
//       });
//       query += ` AND (${whereConditions.join(" OR ")})`;
//     }
//     // =======================  c_status  =======================
//     if (Array.isArray(c_status) && c_status.length > 0) {
//       const whereConditions = c_status.map((param) => {
//         queryParams.push(`%${param}%`);
//         return "crm_candidate_details.c_status LIKE ?";
//       });
//       query += ` AND (${whereConditions.join(" OR ")})`;
//     }
//     // =======================  country  =======================
//     if (Array.isArray(country) && country.length > 0) {
//       if (branch_admin || team_leader || sales_manager || tele_caller) {
//         const whereConditions = country.map((param) => {
//           queryParams.push(`%${param}%`);
//           return "crm_candidate_details.country LIKE ?";
//         });
//         query += ` AND (${whereConditions.join(" OR ")})`;
//       } else {
//         const whereConditions = country.map((param) => {
//           queryParams.push(`%${param}%`);
//           return "crm_candidate_details.country LIKE ?";
//         });
//         query += ` AND (${whereConditions.join(" OR ")})`;
//       }
//     }

//     // =======================  state  =======================
//     if (Array.isArray(state) && state.length > 0) {
//       if (branch_admin || team_leader || sales_manager || tele_caller) {
//         const whereConditions = state.map((param) => {
//           queryParams.push(`%${param}%`);
//           return "crm_candidate_details.state LIKE ?";
//         });
//         query += ` AND (${whereConditions.join(" OR ")})`;
//       } else {
//         const whereConditions = state.map((param) => {
//           queryParams.push(`%${param}%`);
//           return "crm_candidate_details.state LIKE ?";
//         });
//         query += ` AND (${whereConditions.join(" OR ")})`;
//       }
//     }
//     // =======================  city  =======================
//     if (Array.isArray(city) && city.length > 0) {
//       if (branch_admin || team_leader || sales_manager || tele_caller) {
//         const whereConditions = city.map((param) => {
//           queryParams.push(`%${param}%`);
//           return "crm_candidate_details.city LIKE ?";
//         });
//         query += ` AND (${whereConditions.join(" OR ")})`;
//       } else {
//         const whereConditions = city.map((param) => {
//           queryParams.push(`%${param}%`);
//           return "crm_candidate_details.city LIKE ?";
//         });
//         query += ` AND (${whereConditions.join(" OR ")})`;
//       }
//     }
//     // =======================  locality  =======================
//     if (Array.isArray(locality) && locality.length > 0) {
//       if (branch_admin || team_leader || sales_manager || tele_caller) {
//         const whereConditions = locality.map((param) => {
//           queryParams.push(`%${param}%`);
//           return "crm_candidate_details.locality LIKE ?";
//         });
//         query += ` AND (${whereConditions.join(" OR ")})`;
//       } else {
//         const whereConditions = locality.map((param) => {
//           queryParams.push(`%${param}%`);
//           return "crm_candidate_details.locality LIKE ?";
//         });
//         query += ` AND (${whereConditions.join(" OR ")})`;
//       }
//     }
//     // =======================  anytext  =======================
//     if (typeof anytext === "string" && anytext.length > 0) {
//       // Construct the SQL query to search for anytext in multiple columns
//       const whereConditions = [
//         "crm_candidate_details.c_id LIKE ?",
//         "crm_candidate_details.c_name LIKE ?",
//         "crm_candidate_details.c_email LIKE ?",
//         "crm_candidate_details.c_ccode LIKE ?",
//         "crm_candidate_details.c_mob LIKE ?",
//         "crm_candidate_details.c_alt_ccode LIKE ?",
//         "crm_candidate_details.c_alt_mob LIKE ?",
//         "crm_candidate_details.comments LIKE ?",
//       ];

//       const likeParam = `%${anytext}%`;
//       queryParams.push(
//         likeParam,
//         likeParam,
//         likeParam,
//         likeParam,
//         likeParam,
//         likeParam,
//         likeParam,
//         likeParam
//       );
//       query += ` AND (${whereConditions.join(" OR ")})`;
//     }

//     query += ` ORDER BY crm_candidate_details.c_id DESC LIMIT ? OFFSET ?`;
//     queryParams.push(limit, offset);

//     connection.query(query, queryParams, (err, result) => {
//       if (err) {
//         console.error(err);
//         res.status(500).json({ error: "Internal Server Error" });
//       } else {
//         res.json(result);
//       }
//       connection.release();
//     });
//   });
// });

CandidatesByStatusRouter.post(
  "/get-all-candidate-by-status-table-data-count",
  (req, res) => {
    const user_role = req.session.user[0].urole;
    const user_id = req.session.user[0].u_id;
    const candidateStatus = req.body.status;
    const teamPage = req.body.teamPage;

    if (
      user_role === "HR Head" ||
      user_role === "Master" ||
      user_role === "Admin"
    ) {
      if (teamPage) {
        pool.getConnection(function (error, connection) {
          if (error) throw error;
          connection.query(
            "SELECT COUNT(`c_id`) AS totalCount FROM `crm_candidate_details` WHERE assign_to <> 0 AND assign_to NOT IN (SELECT u_id FROM crm_users WHERE urole = 'Master' OR urole = 'HR Head') AND c_status = ?",
            [candidateStatus],
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
        pool.getConnection(function (error, connection) {
          if (error) throw error;
          connection.query(
            "SELECT COUNT(`c_id`) AS totalCount FROM `crm_candidate_details` WHERE c_status = ?",
            [candidateStatus],
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
      }
    } else if (user_role === "HR") {
      pool.getConnection(function (error, connection) {
        if (error) throw error;
        connection.query(
          "SELECT COUNT(`c_id`) AS totalCount FROM `crm_candidate_details` WHERE ?? = ? AND c_status = ?",
          ["assign_to", user_id, candidateStatus],
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
  }
);

// for ES5
module.exports = CandidatesByStatusRouter;
