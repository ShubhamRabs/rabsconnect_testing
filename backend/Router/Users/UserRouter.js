// for ES5
const express = require("express");
const bcrypt = require("bcryptjs");
const fs = require("fs");
const path = require("path");
const pool = require("../../Database.js");

const UserRouter = express.Router();

UserRouter.post("/get-all-users", (req, res) => {
  const user_id = req.session.user[0].u_id;
  const user_role = req.session.user[0].urole;
  let column = "";
  let value = "";

  if (user_role === "Branch Admin") {
    column = "ba_id";
    value = user_id;
  }
  if (user_role === "Team Leader") {
    column = "tl_id";
    value = user_id;
  }
  if (user_role === "Sales Manager") {
    column = "sm_id";
    value = user_id;
  }

  if (user_role === "Master" || user_role === "Admin") {
    pool.getConnection(function (error, connection) {
      if (error) throw error;
      connection.query(
        "SELECT u_id as id, create_dt, update_dt, username, utype, urole, branch_id, ba_id, tl_id, sm_id, create_by, device_token, session_id, module_privilege FROM crm_users",
        (err, result) => {
          if (err) {
            console.log(err);
          } else {
            res.send(result);
          }
          connection.release();
        }
      );
    });
  } else if (user_role === "HR Head") {
    pool.getConnection(function (error, connection) {
      if (error) throw error;
      connection.query(
        "SELECT u_id as id, create_dt, update_dt, username, utype, urole, branch_id, ba_id, tl_id, sm_id, create_by, device_token, session_id, module_privilege FROM crm_users WHERE urole = ? ",
        ["HR"],
        (err, result) => {
          if (err) {
            console.log(err);
          } else {
            res.send(result);
          }
          connection.release();
        }
      );
    });
  } else if (user_role === "HR" || user_role === "Tele Caller") {
    res.send([]);
  } else {
    pool.getConnection(function (error, connection) {
      if (error) throw error;
      connection.query(
        "SELECT u_id as id, create_dt, update_dt, username, utype, urole, branch_id, ba_id, tl_id, sm_id, create_by, device_token, session_id, module_privilege FROM crm_users WHERE ?? = ? ",
        [column, value],
        (err, result) => {
          if (err) {
            console.log(err);
          } else {
            res.send(result);
          }
          connection.release();
        }
      );
    });
  }
});

UserRouter.post("/get-all-role-wise-users", (req, res) => {
  const user_id = req.session.user[0].u_id;
  const user_role = req.session.user[0].urole;
  let column = "";
  let value = "";

  if (user_role === "Branch Admin") {
    column = "ba_id";
    value = user_id;
  }
  if (user_role === "Team Leader") {
    column = "tl_id";
    value = user_id;
  }
  if (user_role === "Sales Manager") {
    column = "sm_id";
    value = user_id;
  }
  if (user_role === "Master" || user_role === "Admin") {
    pool.getConnection(function (error, connection) {
      if (error) throw error;
      connection.query(
        "SELECT u_id, create_dt, update_dt, username, password, utype, urole, branch_id, ba_id, tl_id, sm_id, create_by, module_privilege FROM crm_users WHERE ?? = ?",
        ["urole", req.body.role],
        (err, result) => {
          if (err) {
            console.log(err);
          } else {
            res.send(result);
          }
          connection.release();
        }
      );
    });
  } else if (user_role === "HR Head") {
    pool.getConnection(function (error, connection) {
      if (error) throw error;
      connection.query(
        "SELECT u_id, create_dt, update_dt, username, utype, urole, branch_id, ba_id, tl_id, sm_id, create_by, device_token, session_id, module_privilege FROM crm_users WHERE urole = ? ",
        ["HR"],
        (err, result) => {
          if (err) {
            console.log(err);
          } else {
            res.send(result);
          }
          connection.release();
        }
      );
    });
  } else if (user_role === "HR" || user_role === "Tele Caller") {
    res.send([]);
  } else {
    pool.getConnection(function (error, connection) {
      if (error) throw error;
      connection.query(
        "SELECT u_id, create_dt, update_dt, username, utype, urole, branch_id, ba_id, tl_id, sm_id, create_by, device_token, session_id, module_privilege FROM crm_users WHERE ?? = ? ",
        [column, value],
        (err, result) => {
          if (err) {
            console.log(err);
          } else {
            res.send(result);
          }
          connection.release();
        }
      );
    });
  }
});

// UserRouter.post("/update-user-data", (req, res) => {
//   const saltRounds = 10;
//   pool.getConnection(function (error, connection) {
//     if (error) throw error;
//     bcrypt.hash(req.body.data[0].password, saltRounds, (err, hash) => {
//       if (req.body.data[0].password === "") {
//         var pass = req.body.data[0].previous_pass;
//       } else {
//         var pass = hash;
//       }
//       connection.query(
//         "UPDATE `crm_users` SET ?? = ?, ?? = ?, ?? = ?, ?? = ? WHERE ?? = ?",
//         [
//           "update_dt",
//           req.body.DateTime,
//           "username",
//           req.body.data[0].username,
//           "password",
//           pass,
//           "module_privilege",
//           req.body.data[1].toString(),
//           "u_id",
//           req.body.data[0].id,
//         ],
//         (err, result) => {
//           if (err) {
//             console.log(err);
//           } else {
//             res.send("User Updated Successfully");
//           }
//           connection.release();
//         }
//       );
//     });
//   });
// });
UserRouter.post("/update-user-data", (req, res) => {
  const saltRounds = 10;
  pool.getConnection(function (error, connection) {
    if (error) throw error;
    bcrypt.hash(req.body.data[0].password, saltRounds, (err, hash) => {
      if (req.body.data[0].password === "") {
        var pass = req.body.data[0].previous_pass;
      } else {
        var pass = hash;
      }
      
      // Prepare SQL query with the new field `urole`
      connection.query(
        "UPDATE `crm_users` SET ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ? WHERE ?? = ?",
        [
          "update_dt",
          req.body.DateTime,
          "username",
          req.body.data[0].username,
          "password",
          pass,
          "urole",  // Adding `urole` field
          req.body.data[0].urole, // Passing the `urole` value
          "module_privilege",
          req.body.data[1].toString(),
          "u_id",
          req.body.data[0].id,
        ],
        (err, result) => {
          if (err) {
            console.log(err);
          } else {
            res.send("User Updated Successfully");
          }
          connection.release();
        }
      );
    });
  });
});

UserRouter.post("/set-user-dashboard", (req, res) => {
  const previous_user = req.session.user[0].u_id;
  res.clearCookie("user");
  req.session.user = [
    {
      u_id: req.body.data.u_id,
      username: req.body.data.username,
      utype: req.body.data.utype,
      urole: req.body.data.urole,
    },
  ];
  res.send({
    module_privilege: req.body.data.module_privilege,
    u_id: req.body.data.u_id,
    username: req.body.data.username,
    utype: req.body.data.utype,
    urole: req.body.data.urole,
    previous_user_id: previous_user,
  });
});

UserRouter.post("/get-user-last-location", (req, res) => {
  console.log(req.body.u_id);
  pool.getConnection(function (error, connection) {
    if (error) throw error;
    connection.query(
      "SELECT latitude as lat, longitude as lng FROM crm_users_location WHERE ?? = ? ORDER BY datetime DESC LIMIT 1",
      ["u_id", req.body.u_id],
      (err, result) => {
        if (err) {
          console.log(err);
        } else {
          const modifiedResult = result.map((row) => ({
            lat: parseFloat(row.lat), // Assuming latitude can have decimal values
            lng: parseFloat(row.lng), // Assuming longitude can have decimal values
          }));

          res.send(modifiedResult);
        }
        connection.release();
      }
    );
  });
});

UserRouter.post("/back-to-old-dashboard", (req, res) => {
  res.clearCookie("user");
  pool.getConnection(function (error, connection) {
    if (error) throw error;
    connection.query(
      "SELECT u_id,username,password,utype,urole,module_privilege FROM crm_users WHERE ?? = ?",
      ["u_id", req.body.previous_user_id],
      (err, result) => {
        if (err) {
          console.log(err);
        } else {
          req.session.user = [
            {
              u_id: result[0].u_id,
              username: result[0].username,
              utype: result[0].utype,
              urole: result[0].urole,
            },
          ];
          res.send({
            status: "Back to CRM Process Done",
            role: req.session.user[0].urole,
            username: req.session.user[0].username,
            utype: req.session.user[0].utype,
            module_privilege: result[0].module_privilege,
          });
        }
        connection.release();
      }
    );
  });
});

// UserRouter.post("/add-user", (req, res) => {
//   const saltRounds = 10;
//   const user_id = req.session.user[0].u_id;

//   pool.getConnection(function (error, connection) {
//     if (error) throw error;
//     bcrypt.hash(req.body.data[0].password, saltRounds, (err, hash) => {
//       connection.query(
//         "INSERT INTO crm_users (??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
//         [
//           "create_dt",
//           "update_dt",
//           "username",
//           "password",
//           "utype",
//           "urole",
//           "ba_id",
//           "tl_id",
//           "sm_id",
//           "create_by",
//           "module_privilege",
//           req.body.DateTime,
//           req.body.DateTime,
//           req.body.data[0].username,
//           hash,
//           req.body.data[0].user_type,
//           req.body.data[0].user_role,
//           req.body.data[0].branch_admin_id,
//           req.body.data[0].team_leader_id,
//           req.body.data[0].sales_manager_id,
//           user_id,
//           req.body.data[1].toString(),
//         ],
//         (err, result) => {
//           if (err) {
//             console.log(err);
//             res.send("User with same name already exist");
//           } else {
//             fs.mkdirSync("uploads/attendance/" + result.insertId, {
//               recursive: true,
//             });
//             console.log(result.insertId)
//             res.send("User Created Successfully");
//           }
//           connection.release();
//         }
//       );
//     });
//   });
// });

//noman
// UserRouter.post("/add-user", (req, res) => {
//   const saltRounds = 10;
//   const user_id = req.session.user[0].u_id;
//   const jsonFilePath = path.join(__dirname, '../../leads.json'); // Adjust path to your JSON file

//   pool.getConnection(function (error, connection) {
//     if (error) {
//       console.error('Error getting database connection:', error);
//       return res.status(500).send("Database connection error");
//     }

//     bcrypt.hash(req.body.data[0].password, saltRounds, (err, hash) => {
//       if (err) {
//         console.error('Error hashing password:', err);
//         connection.release();
//         return res.status(500).send("Error processing password");
//       }

//       connection.query(
//         "INSERT INTO crm_users (??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
//         [
//           "create_dt",
//           "update_dt",
//           "username",
//           "password",
//           "utype",
//           "urole",
//           "ba_id",
//           "tl_id",
//           "sm_id",
//           "create_by",
//           "module_privilege",
//           req.body.DateTime,
//           req.body.DateTime,
//           req.body.data[0].username,
//           hash,
//           req.body.data[0].user_type,
//           req.body.data[0].user_role,
//           req.body.data[0].branch_admin_id,
//           req.body.data[0].team_leader_id,
//           req.body.data[0].sales_manager_id,
//           user_id,
//           req.body.data[1].toString(),
//         ],
//         (err, result) => {
//           if (err) {
//             console.error('Error inserting user into database:', err);
//             connection.release();
//             return res.status(500).send("User with same name already exists");
//           }

//           const newUserId = result.insertId;
//           fs.mkdirSync(`uploads/attendance/${newUserId}`, { recursive: true });

//           // Read the existing JSON file
//           fs.readFile(jsonFilePath, 'utf8', (err, data) => {
//             if (err) {
//               console.error('Error reading JSON file:', err);
//               connection.release();
//               return res.status(500).send("Error reading JSON file");
//             }

//             let json;
//             try {
//               json = JSON.parse(data);
//             } catch (parseErr) {
//               console.error('Error parsing JSON file:', parseErr);
//               connection.release();
//               return res.status(500).send("Error parsing JSON file");
//             }

//             // Add new header structure for the new user ID
//             json[newUserId] = [
//               { "header": "Assign User", "accessor": "assign_users", "visible": true },
//               { "header": "Lead Id", "accessor": "l_id", "visible": true },
//               { "header": "Mobile Number", "accessor": "mobile", "visible": true },
//               { "header": "Lead Date", "accessor": "create_dt", "visible": true },
//               { "header": "Source", "accessor": "source", "visible": true },
//               { "header": "Lead Name", "accessor": "lname", "visible": true },
//               { "header": "Lead Status", "accessor": "latest_status", "visible": false },
//               { "header": "Alternate Mobile", "accessor": "s_mob", "visible": false },
//               { "header": "Locality", "accessor": "locality", "visible": false },
//               { "header": "FB Form Name", "accessor": "form_name", "visible": false },
//               { "header": "Email Id", "accessor": "p_email", "visible": false },
//               { "header": "City", "accessor": "city", "visible": false },
//               { "header": "Project Name", "accessor": "pname", "visible": false },
//               { "header": "Follow Up Date", "accessor": "followup_dt", "visible": false },
//               { "header": "Service Type", "accessor": "service_type", "visible": false },
//               { "header": "Comments", "accessor": "comments", "visible": false }
//             ];

//             // Write updated JSON back to the file
//             fs.writeFile(jsonFilePath, JSON.stringify(json, null, 2), (err) => {
//               if (err) {
//                 console.error('Error writing JSON file:', err);
//                 connection.release();
//                 return res.status(500).send("Error updating JSON file");
//               }

//               console.log("User Created Successfully with ID:", newUserId);
//               connection.release();
//               res.send("User Created Successfully");
//             });
//           });
//         }
//       );
//     });
//   });
// });


UserRouter.post("/add-user", (req, res) => {
  const saltRounds = 10;
  const user_id = req.session.user[0].u_id;
  const jsonFilePath = path.join(__dirname, '../../leads.json'); 

  pool.getConnection(function (error, connection) {
    if (error) {
      console.error('Error getting database connection:', error);
      return res.status(500).send("Database connection error");
    }

    bcrypt.hash(req.body.data[0].password, saltRounds, (err, hash) => {
      if (err) {
        console.error('Error hashing password:', err);
        connection.release();
        return res.status(500).send("Error processing password");
      }

      connection.query(
        "INSERT INTO crm_users (??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
          "create_dt",
          "update_dt",
          "username",
          "password",
          "utype",
          "urole",
          "ba_id",
          "tl_id",
          "sm_id",
          "create_by",
          "module_privilege",
          req.body.DateTime,
          req.body.DateTime,
          req.body.data[0].username,
          hash,
          req.body.data[0].user_type,
          req.body.data[0].user_role,
          req.body.data[0].branch_admin_id,
          req.body.data[0].team_leader_id,
          req.body.data[0].sales_manager_id,
          user_id,
          req.body.data[1].toString(),
        ],
        (err, result) => {
          if (err) {
            console.error('Error inserting user into database:', err);
            connection.release();
            return res.status(500).send("User with the same name already exists");
          }

          const newUserId = result.insertId;
          fs.mkdirSync(`uploads/attendance/${newUserId}`, { recursive: true });

          // Read the existing JSON file
          fs.readFile(jsonFilePath, 'utf8', (err, data) => {
            if (err) {
              console.error('Error reading JSON file:', err);
              connection.release();
              return res.status(500).send("Error reading JSON file");
            }

            let json;
            try {
              json = JSON.parse(data);
            } catch (parseErr) {
              console.error('Error parsing JSON file:', parseErr);
              connection.release();
              return res.status(500).send("Error parsing JSON file");
            }

            // Add new header structure for the new user ID
            json[newUserId] = {
               "visible": [
                  "lname",
                  "mobile",
                  "assign_users",
                  "pname",
                  "latest_status",
                  "create_dt",
                  "lead_priority",
                  "followup_dt",
                  "service_type",
                  "l_id",
                  "source",
                  "comments",
                  "city",
                  "s_mob",
                  "form_name",
                  "p_email",
                  "locality",
                  "post_handover",
                  "buyer_type",
                  "investment_type",
                  "handover_year"
                ],
                "hidden": []
              },

            // Write updated JSON back to the file
            fs.writeFile(jsonFilePath, JSON.stringify(json, null, 2), (err) => {
              if (err) {
                console.error('Error writing JSON file:', err);
                connection.release();
                return res.status(500).send("Error updating JSON file");
              }

              console.log("User Created Successfully with ID:", newUserId);
              connection.release();
              res.send("User Created Successfully");
            });
          });
        }
      );
    });
  });
});



UserRouter.post("/get-all-users-to-assign-lead", (req, res) => {
  const user_id = req.session.user[0].u_id;
  const user_role = req.session.user[0].urole;
  let column = "";
  let value = "";

  if (user_role === "Branch Admin") {
    column = "ba_id";
    value = user_id;
  }
  if (user_role === "Team Leader") {
    column = "tl_id";
    value = user_id;
  }
  if (user_role === "Sales Manager") {
    column = "sm_id";
    value = user_id;
  }

  if (user_role === "Master" || user_role === "Admin") {
    pool.getConnection(function (error, connection) {
      if (error) throw error;
      connection.query(
        "SELECT u_id as id, create_dt, update_dt, username, utype, urole, branch_id, ba_id, tl_id, sm_id, create_by, device_token, session_id, module_privilege FROM crm_users WHERE urole = 'Team Leader' OR urole = 'Sales Manager' OR urole = 'Branch Admin' OR urole = 'Tele Caller'",
        (err, result) => {
          if (err) {
            console.log(err);
          } else {
            res.send(result);
          }
          connection.release();
        }
      );
    });
  } else if (
    user_role === "HR" ||
    user_role === "Tele Caller" ||
    user_role === "HR Head"
  ) {
    res.send([]);
  } else {
    pool.getConnection(function (error, connection) {
      if (error) throw error;
      connection.query(
        "SELECT u_id as id, create_dt, update_dt, username, utype, urole, branch_id, ba_id, tl_id, sm_id, create_by, device_token, session_id, module_privilege FROM crm_users WHERE ?? = ? ",
        [column, value],
        (err, result) => {
          if (err) {
            console.log(err);
          } else {
            res.send(result);
          }
          connection.release();
        }
      );
    });
  }
});

UserRouter.post("/get-all-team-assign-leads", (req, res) => {
  const user_id = req.session.user[0].u_id;
  const user_role = req.session.user[0].urole;

  if (user_role === "Branch Admin") {
    column = "u.ba_id";
    value = user_id;
  }
  if (user_role === "Team Leader") {
    column = "u.tl_id";
    value = user_id;
  }
  if (user_role === "Sales Manager") {
    column = "u.sm_id";
    value = user_id;
  }

  if (user_role === "Master" || user_role === "Admin") {
    pool.getConnection(function (error, connection) {
      if (error) throw error;
      connection.query(
        "SELECT u.u_id,u.username,u.urole,u.utype,COUNT(l.lreq_id) AS lead_count FROM crm_users u LEFT JOIN crm_lead_req_details l ON u.u_id = l.assignto_id WHERE u.utype = 'Employee' AND u.urole IN ('Team Leader', 'Sales Manager', 'Tele Caller') GROUP BY u.u_id,u.username,u.urole,u.utype ORDER BY lead_count DESC",
        (err, result) => {
          if (err) {
            console.log(err);
          } else {
            res.send(result);
          }
          connection.release();
        }
      );
    });
  } else {
    pool.getConnection(function (error, connection) {
      if (error) throw error;
      connection.query(
        "SELECT u.u_id,u.username,u.urole,u.utype,COUNT(l.lreq_id) AS lead_count FROM crm_users u LEFT JOIN crm_lead_req_details l ON u.u_id = l.assignto_id WHERE u.utype = 'Employee' AND u.urole IN ('Team Leader', 'Sales Manager', 'Tele Caller') GROUP BY u.u_id,u.username,u.urole,u.utype WHERE ?? = ? ORDER BY lead_count DESC",
        [column, value],
        (err, result) => {
          if (err) {
            console.log(err);
          } else {
            res.send(result);
          }
          connection.release();
        }
      );
    });
  }
});

UserRouter.post("/id", (req, res) => {
  pool.getConnection(function (error, connection) {
    if (error) throw error;
    connection.query(
      "SELECT u_id, fname, mname, lname, r_email, p_email, p_ccode, p_mob, health, health_issue, religion, gender, mstatus, dob, aadhar_no, pan_no, join_date, designation, department, location, pf_no, bank_name, bank_branch, ac_name, account_no, ifsc_code, basic_salary,  profile_image FROM crm_user_details WHERE u_id = ? ",
      [req.body.u_id],
      (err, result) => {
        if (err) {
          console.log(err);
          throw err;
        } else {
          console.log(result);
          res.send(result);
        }
        connection.release();
      }
    );
  });
});

// for ES5
module.exports = UserRouter;
