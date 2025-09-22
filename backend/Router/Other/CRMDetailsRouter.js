// for ES5
const express = require("express");
const pool = require("../../Database.js");

const CRMDetailsRouter = express.Router();

CRMDetailsRouter.post("/get-all-crm-details", (req, res) => {
  pool.getConnection(function (error, connection) {
    if (error) throw error;
    connection.query(
      "SELECT crm_id as id, create_dt, update_dt, company_name,company_address, admin, no_of_admin, branch, no_of_branch, team_leader, no_of_tl, sales_manager, no_of_sm, tele_caller, no_of_tc ,no_of_tc, hr_head, no_of_hr_head, hr, no_of_hr, total_users FROM crm_details",
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
});

CRMDetailsRouter.get("/get-crm-app-version", (req, res) => {
//   pool.getConnection(function (error, connection) {
//     if (error) throw error;
//     connection.query(
//       "SELECT crm_id as id, create_dt, update_dt, company_name,company_address, admin, no_of_admin, branch, no_of_branch, team_leader, no_of_tl, sales_manager, no_of_sm, tele_caller, no_of_tc ,no_of_tc, hr_head, no_of_hr_head, hr, no_of_hr, total_users FROM crm_details",
//       (err, result) => {
//         if (err) {
//           console.log(err);
//         } else {
//           res.json(result);
//         }
//         connection.release();
//       }
//     );
//   });
     res.send("2.2");
});

// for ES5
module.exports = CRMDetailsRouter;
