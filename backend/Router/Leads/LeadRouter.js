// for ES5
const express = require("express");
const dayjs = require("dayjs");
const multer = require("multer");
const pool = require("../../Database.js");
const path = require("path");
const fs = require("fs");
const { getMessaging } = require("firebase-admin/messaging");
const utc = require("dayjs/plugin/utc");
const timezone = require("dayjs/plugin/timezone");

dayjs.extend(utc);
dayjs.extend(timezone);

const DubaiDateTime = new Date().toLocaleString("en-US", {
  timeZone: "Asia/Dubai",
});

const LeadRouter = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/lead/"); // Specify the upload directory
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`); // Create a unique filename
  },
});

const upload = multer({ storage: storage });

// LeadRouter.post("/delete-selected-lead", (req, res) => {
//   let l_id = req.body.lid;
//   // const l_id = lead_id?.map((entry) => entry.l_id);
//   pool.getConnection(function (error, connection) {
//     if (error) throw error;
//     connection.query(
//       "DELETE FROM crm_lead_primary_details WHERE ?? IN (?) ",
//       ["l_id", l_id],
//       (err, result) => {
//         if (err) {
//           console.log(err);
//         }

//         else {
//           connection.query(
//             "DELETE FROM crm_lead_req_details WHERE ?? IN (?) ",
//             ["l_id", l_id],
//             (err, result) => {
//               if (err) {
//                 console.log(err);
//               } else {
//                 res.send("lead deleted");
//               }
//             }
//           );
//         }
//         connection.release();
//       }
//     );
//   });
// });
// LeadRouter.post("/delete-selected-lead", (req, res) => {
//   let l_id = req.body.lid;

//   pool.getConnection(function (error, connection) {
//     if (error) throw error;

//     // Step 1: Fetch the existing document filename
//     connection.query(
//       "SELECT document FROM crm_lead_primary_details WHERE l_id = ?",
//       [l_id],
//       (fetchErr, fetchResults) => {
//         if (fetchErr) {
//           connection.release();
//           return res.status(500).send("Error fetching document");
//         }

//         const existingDocument = fetchResults[0]?.document;

//         // Step 2: Delete the file from the server if it exists
//         if (existingDocument) {
//           const filePath = `uploads/lead/${existingDocument}`;
//           fs.unlink(filePath, (unlinkErr) => {
//             if (unlinkErr) {
//               console.error("Error deleting file:", unlinkErr);
//               // Handle the error if needed
//             } else {
//               console.log("Successfully deleted file:", existingDocument);
//             }
//           });
//         }

//         // Step 3: Delete the records from the primary details table
//         connection.query(
//           "DELETE FROM crm_lead_primary_details WHERE l_id = ?",
//           [l_id],
//           (err, result) => {
//             if (err) {
//               connection.release();
//               console.log(err);
//               return res.status(500).send("Error deleting leads");
//             }

//             // Step 4: Delete the records from the request details table
//             connection.query(
//               "DELETE FROM crm_lead_req_details WHERE l_id = ?",
//               [l_id],
//               (err, result) => {
//                 if (err) {
//                   connection.release();
//                   console.log(err);
//                   return res.status(500).send("Error deleting lead requests");
//                 }

//                 res.send("lead deleted");
//                 connection.release();
//               }
//             );
//           }
//         );
//       }
//     );
//   });
// });

LeadRouter.post("/delete-selected-lead", (req, res) => {
  const user_role = req.session.user[0].urole;
  let l_id = req.body.lid;

  console.log(l_id, "lead ids");

  if (user_role === "Master" || user_role === "Admin") {
    pool.getConnection(function (error, connection) {
      if (error) {
        console.error("Error getting connection:", error);
        return res.status(500).send("Error connecting to the database");
      }

      // Step 1: Fetch the existing document filename
      connection.query(
        "SELECT document FROM crm_lead_primary_details WHERE l_id IN (?)",
        [l_id],
        (fetchErr, fetchResults) => {
          if (fetchErr) {
            console.error("Error fetching document:", fetchErr);
            connection.release();
            return res.status(500).send("Error fetching document");
          }

          const existingDocument = fetchResults[0]?.document;

          // Step 2: Delete the file from the server if it exists
          if (existingDocument) {
            // Use path.join() to resolve the correct file path
            const filePath = path.join(
              __dirname,
              "../../uploads/lead",
              existingDocument
            );

            console.log("Resolved file path:", filePath); // Log the file path to verify

            // Check if file exists before deleting
            fs.stat(filePath, (statErr, stats) => {
              if (statErr) {
                console.error("File does not exist:", filePath);
                // Continue with the rest of the logic if the file doesn't exist
              } else {
                // File exists, attempt to delete it
                fs.unlink(filePath, (unlinkErr) => {
                  if (unlinkErr) {
                    console.error("Error deleting file:", unlinkErr);
                  } else {
                    console.log("Successfully deleted file:", existingDocument);
                  }
                });
              }
            });
          }

          // Step 3: Delete the records from the primary details table
          connection.query(
            "DELETE FROM crm_lead_primary_details WHERE l_id IN (?)",
            [l_id],
            (err, result) => {
              if (err) {
                console.error("Error deleting lead primary details:", err);
                connection.release();
                return res
                  .status(500)
                  .send("Error deleting lead primary details");
              }

              // Step 4: Delete the records from the request details table
              connection.query(
                "DELETE FROM crm_lead_req_details WHERE l_id IN (?)",
                [l_id],
                (err, result) => {
                  connection.release(); // Always release the connection after the final operation

                  if (err) {
                    console.error("Error deleting lead request details:", err);
                    return res
                      .status(500)
                      .send("Error deleting lead request details");
                  }

                  res.send("Lead deleted successfully");
                }
              );
            }
          );
        }
      );
    });
  } else {
    pool.getConnection(function (error, connection) {
      if (error) {
        console.error("Error getting connection:", error);
        return res.status(500).send("Error connecting to the database");
      }

      connection.query(
        "DELETE FROM crm_lead_req_details WHERE assignto_id = ? AND lreq_id IN (?)",
        [req.session.user[0].u_id, l_id],
        (err, result) => {
          connection.release(); // Always release the connection after the final operation

          if (err) {
            console.error("Error deleting lead request details:", err);
            return res.status(500).send("Error deleting lead request details");
          }

          res.send("Lead deleted successfully");
        }
      );
    });
  }
});

LeadRouter.post("/lock-selected-lead", (req, res) => {
  const user_role = req.session.user[0].urole;
  const user_id = req.session.user[0].u_id;

  console.log("true", req.body.lead_id, req.body.users, user_id);

  if (user_role === "Master" || user_role === "Admin") {
    pool.getConnection(function (error, connection) {
      if (error) throw error;
      connection.query(
        "UPDATE `crm_lead_req_details` SET `l_lock` = CASE WHEN `l_lock` = 1 THEN 0 ELSE 1 END WHERE `l_id` = ? AND `assignto_id` IN (?)",
        [req.body.lead_id, req.body.users],
        (err, result) => {
          if (err) {
            console.log(err);
          } else {
            res.send("Lead has been lock for selected user!");
          }
          connection.release();
        }
      );
    });
  } else {
    pool.getConnection(function (error, connection) {
      if (error) throw error;
      connection.query(
        "UPDATE `crm_lead_req_details` SET `l_lock`= CASE WHEN `l_lock` = 1 THEN 0 ELSE 1 END WHERE `l_id` = ? AND `assignto_id` IN (?) AND `assignby_id` = ?",
        [req.body.lead_id, req.body.users, user_id],
        (err, result) => {
          if (err) {
            console.log(err);
          } else {
            res.send("Lead has been lock for selected user!");
          }
          connection.release();
        }
      );
    });
  }
});

// LeadRouter.post("/unassign-selected-lead", (req, res) => {
//   let data = req.body.leadIds;
//   // console.log(data);
//   // const l_id = lead_id?.map((entry) => entry.l_id);
//   for (let i = 0; i < data.length; i++) {
//     let lreq_id = data[i].lreq_id;
//     let l_id = data[i].l_id;
//     // console.log(lreq_id, l_id);
//     pool.getConnection(function (error, connection) {
//       if (error) throw error;
//       connection.query(
//         "SELECT count(*) FROM crm_lead_req_details WHERE ?? IN (?) ",
//         ["l_id", l_id],
//         (err, result) => {
//           if (err) {
//             console.log(err);
//           } else {
//             // res.send("lead deleted");
//             // console.log(result[0]['count(*)'], data.length);
//             if (result[0]["count(*)"] === data.length) {
//               // console.log('lead updated');
//               connection.query(
//                 "UPDATE crm_lead_primary_details SET ?? = ? WHERE ?? IN (?) ",
//                 ["assign_status", " ", "l_id", l_id],
//                 (err, result) => {
//                   if (err) {
//                     console.log(err);
//                   } else {
//                     // console.log("lead assign status updated to blank");
//                     // res.send("lead unassigned");
//                   }
//                 }
//               );
//             }

//             connection.query(
//               "DELETE FROM crm_lead_req_details WHERE ?? IN (?) ",
//               ["lreq_id", lreq_id],
//               (err, result) => {
//                 if (err) {
//                   console.log(err);
//                 } else {
//                   // console.log("lead deleted");
//                   // res.send("lead unassigned");
//                 }
//               }
//             );
//           }
//         }
//       );
//       connection.release();
//     });
//   }
//   res.send("lead unassigned");
// });

LeadRouter.post("/unassign-selected-lead", (req, res) => {
  let { lreq_id, l_id } = req.body.leadIds[0];

  pool.getConnection(function (error, connection) {
    if (error) {
      console.error("Error getting database connection:", error);
      return res.status(500).send("Database connection error");
    }

    connection.beginTransaction((err) => {
      if (err) {
        console.error("Error starting transaction:", err);
        connection.release();
        return res.status(500).send("Transaction start error");
      }

      connection.query(
        "DELETE FROM crm_lead_req_details WHERE ?? IN (?)",
        ["l_id", l_id],
        (err, result) => {
          if (err) {
            console.error("Error deleting from crm_lead_req_details:", err);
            return connection.rollback(() => {
              connection.release();
              res.status(500).send("Error deleting lead request details");
            });
          }

          connection.query(
            "UPDATE crm_lead_primary_details SET ?? = ? WHERE ?? IN (?)",
            ["assign_status", "", "l_id", l_id],
            (err, result) => {
              if (err) {
                console.error("Error updating crm_lead_primary_details:", err);
                return connection.rollback(() => {
                  connection.release();
                  res.status(500).send("Error updating lead primary details");
                });
              }

              connection.commit((err) => {
                if (err) {
                  console.error("Error committing transaction:", err);
                  return connection.rollback(() => {
                    connection.release();
                    res.status(500).send("Transaction commit error");
                  });
                }

                connection.release();
                res.send("Lead unassigned successfully");
              });
            }
          );
        }
      );
    });
  });
  res.send("lead unassigned");
});

LeadRouter.post("/get-lead-assign-user-list", (req, res) => {
  const user_role = req.session.user[0].urole;
  const user_id = req.session.user[0].u_id;

  if (user_role === "Master" || user_role === "Admin") {
    pool.getConnection(function (error, connection) {
      if (error) throw error;
      connection.query(
        "SELECT crm_lead_req_details.assignto_id, crm_lead_req_details.l_id, crm_users.username, crm_users.urole FROM `crm_lead_req_details` JOIN `crm_users` ON crm_lead_req_details.assignto_id = crm_users.u_id WHERE ?? = ?",
        ["crm_lead_req_details.l_id", req.body.lead_id],
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
        "SELECT crm_lead_req_details.assignto_id, crm_lead_req_details.l_id, crm_users.username, crm_users.urole FROM `crm_lead_req_details` JOIN `crm_users` ON crm_lead_req_details.assignto_id = crm_users.u_id WHERE ?? = ? AND ?? = ?",
        [
          "crm_lead_req_details.l_id",
          req.body.lead_id,
          "crm_lead_req_details.assignby_id",
          user_id,
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
  }
});

LeadRouter.post("/assigned-users-list", (req, res) => {
  pool.getConnection(function (error, connection) {
    if (error) throw error;
    connection.query(
      "SELECT crm_lead_req_details.assignto_id, crm_lead_req_details.l_id, crm_users.username, crm_users.urole FROM `crm_lead_req_details` JOIN `crm_users` ON crm_lead_req_details.assignby_id = crm_users.u_id WHERE ?? = ?",
      ["crm_lead_req_details.l_id", req.body.lid],
      (err, result) => {
        if (err) {
          console.log(err);
        } else {
          if (result.length > 0) {
            res.json(result);
          } else {
            res.json(null);
          }
        }
        connection.release();
      }
    );
  });
});

LeadRouter.post("/get-lead-assign-user-data", (req, res) => {
  pool.getConnection(function (error, connection) {
    if (error) throw error;
    connection.query(
      "SELECT crm_lead_req_details.l_id, crm_lead_req_details.assignto_id, crm_lead_primary_details.source_type, crm_lead_primary_details.create_dt, crm_lead_primary_details.lname,crm_lead_primary_details.source, crm_lead_primary_details.p_ccode, crm_lead_primary_details.p_mob, crm_lead_primary_details.p_email, crm_lead_req_details.s_ccode, crm_lead_req_details.s_mob, crm_lead_req_details.s_email, crm_lead_req_details.pname, crm_lead_req_details.service_type, crm_lead_req_details.ptype, crm_lead_req_details.pcategory, crm_lead_req_details.pconfiguration, crm_lead_req_details.min_area, crm_lead_req_details.max_area, crm_lead_req_details.area_unit, crm_lead_req_details.min_price, crm_lead_req_details.max_price, crm_lead_req_details.price_unit, crm_lead_req_details.state, crm_lead_req_details.country, crm_lead_req_details.city, crm_lead_req_details.locality, crm_lead_req_details.sub_locality, crm_lead_req_details.status, crm_lead_req_details.other_details, crm_lead_req_details.quality, crm_lead_req_details.followup, crm_lead_req_details.followup_dt, crm_lead_req_details.comments, crm_lead_status.color FROM crm_lead_primary_details JOIN crm_lead_req_details ON crm_lead_primary_details.l_id = crm_lead_req_details.l_id LEFT JOIN crm_lead_status ON crm_lead_req_details.status = crm_lead_status.status WHERE ?? = ?",
      ["crm_lead_req_details.l_id", req.body.lid],
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
});

LeadRouter.post("/update-quick-lead", (req, res) => {
  const user_id = req.session.user[0].u_id;
  const user_role = req.session.user[0].urole;

  let comment = [req.body.data.oldComment];
  let usercomments =
    "By " +
    req.session.user[0].username +
    ", " +
    dayjs().format("MMM DD,YYYY h:mm A") +
    "= " +
    req.body.data.newComment;
  comment.push(usercomments);
  let implode = "";
  if (comment !== null) {
    implode = comment?.map((item) => item).join("~");
  } else {
    implode = comment;
  }

  let followup_dt;
  if (req.body.data.follow_up === "Yes") {
    followup_dt = req.body.data.followup_dt;
  } else {
    followup_dt = "0000-00-00 00:00:00";
  }
  if (user_role === "Master" || user_role === "Admin") {
    pool.getConnection(function (error, connection) {
      if (error) throw error;
      connection.query(
        "UPDATE crm_lead_primary_details SET ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ?  WHERE ?? = ?",
        [
          "status",
          req.body.data.status_type,
          "lead_priority",
          req.body.data.lead_priority,
          "followup",
          req.body.data.follow_up,
          "followup_dt",
          followup_dt,
          "comments",
          implode,
          "l_id",
          req.body.data.leadId,
        ],
        (err, result) => {
          if (err) {
            console.log(err);
          } else {
            // Lead History start
            connection.query(
              "INSERT INTO `crm_lead_history`(??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)",
              [
                "l_id",
                "u_id",
                "create_dt",
                "update_dt",
                "status",
                "lead_priority",
                "lname",
                "p_mob",
                "pname",
                "comments",
                "followup",
                "followup_dt",
                req.body.data.leadId,
                user_id,
                req.body.DateTime,
                req.body.DateTime,
                req.body.data.status_type,
                req.body.data.lead_priority,
                req.body.data.lname,
                req.body.data.p_mob,
                req.body.data.pname,
                req.body.data.newComment,
                req.body.data.follow_up,
                followup_dt,
              ],
              (err, result) => {
                if (err) {
                  console.log(err);
                }
              }
            );
            if (req.body.data.identity === "imported") {
              connection.query(
                "UPDATE crm_lead_primary_details SET ?? = ?, ?? = ? WHERE ?? = ?",
                ["clicked", 1, "identity", "", "l_id", req.body.data.leadId],
                (err, result) => {
                  if (err) {
                    console.log(
                      "Error updating crm_lead_primary_details:",
                      err
                    );
                    return connection.rollback(() => {
                      throw err;
                    });
                  }
                }
              );
            }
            // Lead History start
            res.send("Lead Updated Successfully");
          }
          connection.release();
        }
      );
    });
  } else {
    pool.getConnection(function (error, connection) {
      if (error) throw error;
      connection.query(
        "UPDATE crm_lead_req_details SET ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ? WHERE ?? = ? AND ?? = ?",
        [
          "status",
          req.body.data.status_type,
          "lead_priority",
          req.body.data.lead_priority,
          "followup",
          req.body.data.follow_up,
          "followup_dt",
          followup_dt,
          "comments",
          implode,
          "l_id",
          req.body.data.leadId,
          "assignto_id",
          user_id,
        ],
        (err, result) => {
          if (err) {
            console.log(err);
          } else {
            // Lead History start
            connection.query(
              "INSERT INTO `crm_lead_history`(??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)",
              [
                "l_id",
                "u_id",
                "create_dt",
                "update_dt",
                "status",
                "lead_priority",
                "lname",
                "p_mob",
                "pname",
                "comments",
                "followup",
                "followup_dt",
                req.body.data.leadId,
                user_id,
                req.body.DateTime,
                req.body.DateTime,
                req.body.data.status_type,
                req.body.data.lead_priority,
                req.body.data.lname,
                req.body.data.p_mob,
                req.body.data.pname,
                req.body.data.newComment,
                req.body.data.follow_up,
                followup_dt,
              ],
              (err, result) => {
                if (err) {
                  console.log(err);
                } else {
                  if (req.body.data.identity === "imported") {
                    connection.query(
                      "UPDATE crm_lead_primary_details SET ?? = ?, ?? = ? WHERE ?? = ?",
                      [
                        "clicked",
                        1,
                        "identity",
                        "",
                        "l_id",
                        req.body.data.leadId,
                      ],
                      (err, result) => {
                        if (err) {
                          console.log(
                            "Error updating crm_lead_primary_details:",
                            err
                          );
                          return connection.rollback(() => {
                            throw err;
                          });
                        }
                      }
                    );
                  }
                }
              }
            );

            // Lead History start
            res.send("Lead Updated Successfully");
          }
          connection.release();
        }
      );
    });
  }
});

LeadRouter.post("/delete-and-assign-lead", (req, res) => {
  const user_id = req.session.user[0].u_id;
  const assign_uid = req.body.data.users; // Array of user IDs
  const lead_ids = req.body.data.lid; // Array of lead IDs
  const user_role = req.session.user[0].urole;
  const status = req.body.data.lstatus || null;
  const client_code = req.session.user[0].client_code;

  if (user_role === "Master" || user_role === "Admin") {
    pool.getConnection((error, connection) => {
      if (error) throw error;

      connection.beginTransaction((err) => {
        if (err) {
          connection.release();
          res.status(500).send("Transaction Error");
          return;
        }

        // Step 1: Remove existing assignments for users not in `assign_uid` for each lead
        connection.query(
          "DELETE FROM crm_lead_req_details WHERE l_id IN (?) AND assignto_id NOT IN (?)",
          [lead_ids, assign_uid],
          (err, result) => {
            if (err) {
              connection.rollback(() => connection.release());
              console.error(err);
              res.status(500).send("Error deleting old assignments");
              return;
            }

            // Step 2: Insert new assignments for each lead
            const insertValues = [];
            lead_ids.forEach((lead_id) => {
              assign_uid.forEach((uid) => {
                insertValues.push([
                  lead_id,
                  uid,
                  user_id,
                  new Date(), // create_dt
                  new Date(), // update_dt
                  status || "Pending", // Default status
                  0, // Default clicked
                ]);
              });
            });

            connection.query(
              `INSERT INTO crm_lead_req_details (
                l_id, assignto_id, assignby_id, create_dt, update_dt, status, clicked
              ) VALUES ?`,
              [insertValues],
              (err, result) => {
                if (err) {
                  connection.rollback(() => connection.release());
                  console.error(err);
                  res.status(500).send("Error inserting new assignments");
                  return;
                }

                // Step 3: Update assign_status in primary table for each lead
                const updateQueries = lead_ids.map((lead_id) => {
                  return new Promise((resolve, reject) => {
                    connection.query(
                      "UPDATE crm_lead_primary_details SET assign_status = 'Yes' WHERE l_id = ?",
                      [lead_id],
                      (err) => {
                        if (err) {
                          reject(err);
                        } else {
                          resolve();
                        }
                      }
                    );
                  });
                });

                // Wait for all update queries to complete
                Promise.all(updateQueries)
                  .then(() => {
                    // Commit transaction
                    connection.commit((err) => {
                      if (err) {
                        connection.rollback(() => connection.release());
                        console.error(err);
                        res.status(500).send("Transaction Commit Error");
                        return;
                      }

                      connection.release();

                      // Send notifications for new assignments
                      assign_uid.forEach((uid) => {
                        lead_ids.forEach((lead_id) => {
                          getMessaging()
                            .send({
                              notification: {
                                body: `New lead assigned: Lead ID ${lead_id}`,
                                title: "New Lead Assignment",
                              },
                              data: {
                                leadId: lead_id.toString(),
                                assignTo: uid.toString(),
                              },
                              topic: `/topics/${uid}${client_code}`,
                            })
                            .then(() =>
                              console.log(
                                `Notification sent to ${uid} for Lead ID ${lead_id}`
                              )
                            )
                            .catch((err) =>
                              console.error("Notification Error:", err)
                            );
                        });
                      });

                      res.status(200).send({
                        data: `Leads reassigned to: ${JSON.stringify(
                          assign_uid
                        )} for Lead IDs: ${JSON.stringify(lead_ids)}`,
                      });
                    });
                  })
                  .catch((err) => {
                    connection.rollback(() => connection.release());
                    console.error(err);
                    res.status(500).send("Error updating lead status");
                  });
              }
            );
          }
        );
      });
    });
  } else {
    res.status(403).send("Unauthorized");
  }
});

// LeadRouter.post("/delete-and-assign-lead", (req, res) => {
//   console.log(req.body, "hjvhhkhfjgkuhkhku");
//   const s_ccode = req.session.user[0].s_ccode;
//   const user_id = req.session.user[0].u_id;
//   const assign_uid = req.body.data.users; // New users to assign
//   const lead_id = req.body.data.lid; // Lead ID
//   const user_role = req.session.user[0].urole;
//   const status = req.body.data.lstatus || null;
//   const client_code = req.session.user[0].client_code;

//   if (user_role === "Master" || user_role === "Admin") {
//     pool.getConnection((error, connection) => {
//       if (error) throw error;

//       connection.beginTransaction((err) => {
//         if (err) {
//           connection.release();
//           res.status(500).send("Transaction Error");
//           return;
//         }

//         // Step 1: Remove existing assignments for users not in `assign_uid`
//         connection.query(
//           "DELETE FROM crm_lead_req_details WHERE l_id = ? AND assignto_id NOT IN (?)",
//           [lead_id, assign_uid],
//           (err, result) => {
//             if (err) {
//               connection.rollback(() => connection.release());
//               console.error(err);
//               res.status(500).send("Error deleting old assignments");
//               return;
//             }

//             // Step 2: Insert new assignments
//             const insertValues = assign_uid.map((uid) => [
//               lead_id,
//               uid,
//               user_id,
//               new Date(), // create_dt
//               new Date(), // update_dt
//               s_ccode || null,
//               status || "Pending", // Default status
//               0, // Default clicked
//             ]);

//             connection.query(
//               `INSERT INTO crm_lead_req_details (
//                 l_id, assignto_id, assignby_id, create_dt, update_dt, s_ccode, status, clicked
//               ) VALUES ?`,
//               [insertValues],
//               (err, result) => {
//                 if (err) {
//                   connection.rollback(() => connection.release());
//                   console.error(err);
//                   res.status(500).send("Error inserting new assignments");
//                   return;
//                 }

//                 // Step 3: Update assign_status in primary table
//                 connection.query(
//                   "UPDATE crm_lead_primary_details SET assign_status = 'Yes' WHERE l_id = ?",
//                   [lead_id],
//                   (err) => {
//                     if (err) {
//                       connection.rollback(() => connection.release());
//                       console.error(err);
//                       res.status(500).send("Error updating lead status");
//                       return;
//                     }

//                     // Commit transaction
//                     connection.commit((err) => {
//                       if (err) {
//                         connection.rollback(() => connection.release());
//                         console.error(err);
//                         res.status(500).send("Transaction Commit Error");
//                         return;
//                       }

//                       connection.release();

//                       // Send notifications for new assignments
//                       assign_uid.forEach((uid) => {
//                         getMessaging()
//                           .send({
//                             notification: {
//                               body: `New lead assigned: Lead ID ${lead_id}`,
//                               title: "New Lead Assignment",
//                             },
//                             data: {
//                               leadId: lead_id.toString(),
//                               assignTo: uid.toString(),
//                             },
//                             topic: `/topics/${uid}${client_code}`,
//                           })
//                           .then(() =>
//                             console.log(`Notification sent to ${uid}`)
//                           )
//                           .catch((err) =>
//                             console.error("Notification Error:", err)
//                           );
//                       });

//                       res.status(200).send({
//                         data: `Leads reassigned to: ${JSON.stringify(
//                           assign_uid
//                         )} for Lead ID: ${lead_id}`,
//                       });
//                     });
//                   }
//                 );
//               }
//             );
//           }
//         );
//       });
//     });
//   } else {
//     res.status(403).send("Unauthorized");
//   }
// });

// LeadRouter.post("/keep-and-assign-lead", (req, res) => {
//   const user_role = req.session.user[0].urole;
//   const status = req.body.data.lstatus;
//   const user_id = req.session.user[0].u_id;
//   const lead_id = req.body.data.lid;
//   const assign_uid = req.body.data.users;
//   const client_code = req.session.user[0].client_code;
//   var latest_lead_id = "";

//   const commentDt = new Date().toLocaleString("en-US", {
//     timeZone: "Asia/Dubai",
//   });

//   if (user_role === "Master" || user_role === "Admin") {
//     pool.getConnection(function (error, connection) {
//       if (error) throw error;
//       connection.query(
//         "SELECT * FROM ?? WHERE ?? IN (?)",
//         [
//           req.body.condition === "direct"
//             ? "crm_lead_primary_details"
//             : "crm_lead_req_details",
//           req.body.condition === "direct" ? "l_id" : "lreq_id",
//           lead_id,
//         ],
//         (err, result) => {
//           if (err) {
//             console.log(err);
//           } else {
//             let duplicateCount = 0;
//             let operationsCompleted = 0;
//             const totalOperations = assign_uid.length * result.length;

//             const checkCompletion = () => {
//               if (operationsCompleted === totalOperations) {
//                 //   res.json({message:"Success"}, {duplicateCount});
//                 res.send("success");
//                 connection.release();
//               }
//             };
//             for (let i = 0; i < assign_uid.length; i++) {
//               for (let j = 0; j < result.length; j++) {
//                 connection.query(
//                   "INSERT INTO crm_lead_req_details(??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
//                   [
//                     "l_id",
//                     "assignto_id",
//                     "assignby_id",
//                     "create_dt",
//                     "update_dt",
//                     "s_ccode",
//                     "s_mob",
//                     "s_email",
//                     "pname",
//                     "service_type",
//                     "ptype",
//                     "pcategory",
//                     "pconfiguration",
//                     "min_area",
//                     "max_area",
//                     "area_unit",
//                     "min_price",
//                     "max_price",
//                     "price_unit",
//                     "other_details",
//                     "country",
//                     "state",
//                     "city",
//                     "locality",
//                     "sub_locality",
//                     "status",
//                     "followup_dt",
//                     // "comments",
//                     "clicked",
//                     result[j].l_id,
//                     assign_uid[i],
//                     user_id,
//                     dayjs(commentDt).format("YYYY-MM-DD HH:mm:ss"),
//                     dayjs(commentDt).format("YYYY-MM-DD HH:mm:ss"),
//                     result[j].s_ccode,
//                     result[j].s_mob,
//                     result[j].s_email,
//                     result[j].pname,
//                     result[j].service_type,
//                     result[j].ptype,
//                     result[j].pcategory,
//                     result[j].pconfiguration,
//                     result[j].min_area,
//                     result[j].max_area,
//                     result[j].area_unit,
//                     result[j].min_price,
//                     result[j].max_price,
//                     result[j].price_unit,
//                     result[j].other_details,
//                     result[j].country,
//                     result[j].state,
//                     result[j].city,
//                     result[j].locality,
//                     result[j].sub_locality,
//                     status ? status : result[j].status,
//                     result[j].followup_dt,
//                     // result[j].comments,
//                     0,
//                   ],
//                   (err, result1) => {
//                     if (err) {
//                       if (err.code === "ER_DUP_ENTRY") {
//                         duplicateCount++;
//                       } else {
//                         console.log(err);
//                       }
//                     } else {
//                       connection.query(
//                         "UPDATE `crm_lead_primary_details` SET ??= ? WHERE ?? IN (?)",
//                         ["assign_status", "Yes", "l_id", lead_id],
//                         (err, result2) => {
//                           if (err) {
//                             // res.send(err);
//                             console.log(err);
//                           }
//                         }
//                       );
//                       getMessaging()
//                         .send({
//                           notification: {
//                             body: result[j].pname,
//                             title: "New lead is assigned to you for project",
//                           },
//                           data: {
//                             body: "" + result1.insertId,
//                             title: "Hello data title testing",
//                           },
//                           webpush: {
//                             fcmOptions: {
//                               link: "/todaysleads",
//                             },
//                           },
//                           topic: `/topics/${assign_uid[i] + "" + client_code}`,
//                         })
//                         .then((response) => {
//                           console.log("Notification Send cicd master");
//                         });
//                     }
//                     operationsCompleted++;
//                     checkCompletion();
//                   }
//                 );
//                 // console.log(client_code);
//                 // console.log(`/topics/${assign_uid[i] + "" + client_code}`);
//               }
//             }
//             // res.send("success");
//           }
//         }
//       );
//     });
//   } else {
//     pool.getConnection(function (error, connection) {
//       if (error) throw error;

//       connection.query(
//         "SELECT * FROM crm_lead_req_details WHERE ?? IN (?) AND ?? = ?",
//         ["lreq_id", lead_id, "assignto_id", user_id],
//         (err, result) => {
//           if (err) {
//             console.log(err);
//             res.status(500).send("Error occurred");
//             connection.release();
//             return;
//           }

//           let duplicateCount = 0;
//           let operationsCompleted = 0;
//           const totalOperations = assign_uid.length * result.length;

//           const checkCompletion = () => {
//             if (operationsCompleted === totalOperations) {
//               //   res.json({message:"Success"}, {duplicateCount});
//               res.send("success");
//               connection.release();
//             }
//           };

//           for (let i = 0; i < assign_uid.length; i++) {
//             for (let j = 0; j < result.length; j++) {
//               connection.query(
//                 "INSERT INTO crm_lead_req_details(??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
//                 [
//                   "l_id",
//                   "assignto_id",
//                   "assignby_id",
//                   "create_dt",
//                   "update_dt",
//                   "s_ccode",
//                   "s_mob",
//                   "s_email",
//                   "pname",
//                   "service_type",
//                   "ptype",
//                   "pcategory",
//                   "pconfiguration",
//                   "min_area",
//                   "max_area",
//                   "area_unit",
//                   "min_price",
//                   "max_price",
//                   "price_unit",
//                   "other_details",
//                   "country",
//                   "state",
//                   "city",
//                   "locality",
//                   "sub_locality",
//                   "status",
//                   "followup_dt",
//                   "comments",
//                   "clicked",
//                   result[j].l_id,
//                   assign_uid[i],
//                   user_id,
//                   dayjs(commentDt).format("YYYY-MM-DD HH:mm:ss"),
//                   dayjs(commentDt).format("YYYY-MM-DD HH:mm:ss"),
//                   result[j].create_dt,
//                   result[j].update_dt,
//                   result[j].s_ccode,
//                   result[j].s_mob,
//                   result[j].s_email,
//                   result[j].pname,
//                   result[j].service_type,
//                   result[j].ptype,
//                   result[j].pcategory,
//                   result[j].pconfiguration,
//                   result[j].min_area,
//                   result[j].max_area,
//                   result[j].area_unit,
//                   result[j].min_price,
//                   result[j].max_price,
//                   result[j].price_unit,
//                   result[j].other_details,
//                   result[j].country,
//                   result[j].state,
//                   result[j].city,
//                   result[j].locality,
//                   result[j].sub_locality,
//                   result[j].status,
//                   result[j].followup_dt,
//                   result[j].comments,
//                   0,
//                 ],
//                 (err, result1) => {
//                   if (err) {
//                     if (err.code === "ER_DUP_ENTRY") {
//                       duplicateCount++;
//                     } else {
//                       console.log(err);
//                     }
//                   } else {
//                     connection.query(
//                       "UPDATE `crm_lead_req_details` SET ??= ? WHERE ?? IN (?) AND ?? = ?",
//                       [
//                         "assign_status",
//                         "Yes",
//                         "lreq_id",
//                         lead_id,
//                         "assignto_id",
//                         user_id,
//                       ],
//                       (err, result2) => {
//                         if (err) {
//                           console.log(err);
//                         } else {
//                           // Send notification after successful assignment
//                           getMessaging()
//                             .send({
//                               notification: {
//                                 body: result[j].pname,
//                                 title:
//                                   "New lead is assigned to you for project",
//                               },
//                               webpush: {
//                                 fcmOptions: {
//                                   link: "/todaysleads",
//                                 },
//                               },
//                               topic: `/topics/${
//                                 assign_uid[i] + "" + client_code
//                               }`,
//                             })
//                             .then(() => {
//                               console.log("Notification Sent");
//                             })
//                             .catch((err) => {
//                               console.log("Notification Error:", err);
//                             });
//                         }
//                       }
//                     );
//                   }

//                   operationsCompleted++;
//                   checkCompletion();
//                 }
//               );
//             }
//           }
//         }
//       );
//     });
//     // pool.getConnection(function (error, connection) {
//     //   if (error) throw error;
//     //   connection.query(
//     //     "SELECT * FROM crm_lead_req_details WHERE ?? IN (?) AND ?? = ?",
//     //     ["lreq_id", lead_id, "assignto_id", user_id],
//     //     (err, result) => {
//     //       if (err) {
//     //         console.log(err);
//     //       } else {
//     //         let duplicateCount = 0;
//     //         for (let i = 0; i < assign_uid.length; i++) {
//     //           for (let j = 0; j < result.length; j++) {
//     //             connection.query(
//     //               "INSERT INTO crm_lead_req_details(??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
//     //               [
//     //                 "l_id",
//     //                 "assignto_id",
//     //                 "assignby_id",
//     //                 "create_dt",
//     //                 "update_dt",
//     //                 "s_ccode",
//     //                 "s_mob",
//     //                 "s_email",
//     //                 "pname",
//     //                 "service_type",
//     //                 "ptype",
//     //                 "pcategory",
//     //                 "pconfiguration",
//     //                 "min_area",
//     //                 "max_area",
//     //                 "area_unit",
//     //                 "min_price",
//     //                 "max_price",
//     //                 "price_unit",
//     //                 "other_details",
//     //                 "country",
//     //                 "state",
//     //                 "city",
//     //                 "locality",
//     //                 "sub_locality",
//     //                 "status",
//     //                 "followup_dt",
//     //                 "comments",
//     //                 "clicked",
//     //                 result[j].l_id,
//     //                 assign_uid[i],
//     //                 user_id,
//     //                 result[j].create_dt,
//     //                 result[j].update_dt,
//     //                 result[j].s_ccode,
//     //                 result[j].s_mob,
//     //                 result[j].s_email,
//     //                 result[j].pname,
//     //                 result[j].service_type,
//     //                 result[j].ptype,
//     //                 result[j].pcategory,
//     //                 result[j].pconfiguration,
//     //                 result[j].min_area,
//     //                 result[j].max_area,
//     //                 result[j].area_unit,
//     //                 result[j].min_price,
//     //                 result[j].max_price,
//     //                 result[j].price_unit,
//     //                 result[j].other_details,
//     //                 result[j].country,
//     //                 result[j].state,
//     //                 result[j].city,
//     //                 result[j].locality,
//     //                 result[j].sub_locality,
//     //                 result[j].status,
//     //                 result[j].followup_dt,
//     //                 result[j].comments,
//     //                 0,
//     //               ],
//     //               (err, result1) => {
//     //                 if (err) {
//     //                   if (err.code === 'ER_DUP_ENTRY') {
//     //                       duplicateCount++;
//     //                     } else {
//     //                       console.log(err);
//     //                     }
//     //                 } else {
//     //                   connection.query(
//     //                     "UPDATE `crm_lead_req_details` SET ??= ? WHERE ?? IN (?) AND ?? = ?",
//     //                     [
//     //                       "assign_status",
//     //                       "Yes",
//     //                       "lreq_id",
//     //                       lead_id,
//     //                       "assignto_id",
//     //                       user_id,
//     //                     ],
//     //                     (err, result2) => {
//     //                       if (err) {
//     //                         console.log(err);
//     //                       }
//     //                     //   else {
//     //                     //     res.send("success");
//     //                     //   }
//     //                     }
//     //                   );
//     //                 }
//     //               }
//     //             );
//     //             getMessaging()
//     //               .send({
//     //                 notification: {
//     //                   body: result[j].pname,
//     //                   title: "New lead is assigned to you for project",
//     //                 },
//     //                 webpush: {
//     //                   fcmOptions: {
//     //                     link: "/todaysleads",
//     //                   },
//     //                 },
//     //                 topic: `/topics/${assign_uid[i] + "" + client_code}`,
//     //               })
//     //               .then((response) => {
//     //                 console.log("Notification Send");
//     //               });
//     //           }
//     //         }
//     //       }
//     //       res.send(`Success with ${duplicateCount} duplicate entries`);
//     //       connection.release();
//     //     }
//     //   );
//     // });
//   }
// });

// LeadRouter.post("/keep-and-assign-lead", (req, res) => {
//   const user_role = req.session.user[0].urole;
//   const status = req.body.data.lstatus;
//   const user_id = req.session.user[0].u_id;
//   const lead_id = req.body.data.lid;
//   const assign_uid = req.body.data.users;
//   const client_code = req.session.user[0].client_code;
//   var latest_lead_id = "";

//   const commentDt = new Date().toLocaleString("en-US", {
//     timeZone: "Asia/Dubai",
//   });

//   if (user_role === "Master" || user_role === "Admin") {
//     pool.getConnection(function (error, connection) {
//       if (error) throw error;
//       connection.query(
//         "SELECT * FROM ?? WHERE ?? IN (?)",
//         [
//           req.body.condition === "direct"
//             ? "crm_lead_primary_details"
//             : "crm_lead_req_details",
//           req.body.condition === "direct" ? "l_id" : "lreq_id",
//           lead_id,
//         ],
//         (err, result) => {
//           if (err) {
//             console.log(err);
//           } else {
//             let duplicateCount = 0;
//             let operationsCompleted = 0;
//             const totalOperations = assign_uid.length * result.length;

//             const checkCompletion = () => {
//               if (operationsCompleted === totalOperations) {
//                 //   res.json({message:"Success"}, {duplicateCount});
//                 res.send("success");
//                 connection.release();
//               }
//             };
//             for (let i = 0; i < assign_uid.length; i++) {
//               for (let j = 0; j < result.length; j++) {
//                 connection.query(
//                   "INSERT INTO crm_lead_req_details(??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
//                   [
//                     "l_id",
//                     "assignto_id",
//                     "assignby_id",
//                     "create_dt",
//                     "update_dt",
//                     "s_ccode",
//                     "s_mob",
//                     "s_email",
//                     "pname",
//                     "service_type",
//                     "ptype",
//                     "pcategory",
//                     "pconfiguration",
//                     "min_area",
//                     "max_area",
//                     "area_unit",
//                     "min_price",
//                     "max_price",
//                     "price_unit",
//                     "other_details",
//                     "country",
//                     "state",
//                     "city",
//                     "locality",
//                     "sub_locality",
//                     "status",
//                     "followup_dt",
//                     // "comments",
//                     "clicked",
//                     result[j].l_id,
//                     assign_uid[i],
//                     user_id,
//                     dayjs(commentDt).format("YYYY-MM-DD HH:mm:ss"),
//                     dayjs(commentDt).format("YYYY-MM-DD HH:mm:ss"),
//                     result[j].s_ccode,
//                     result[j].s_mob,
//                     result[j].s_email || "",
//                     result[j].pname,
//                     result[j].service_type,
//                     result[j].ptype,
//                     result[j].pcategory,
//                     result[j].pconfiguration,
//                     result[j].min_area,
//                     result[j].max_area,
//                     result[j].area_unit,
//                     result[j].min_price,
//                     result[j].max_price,
//                     result[j].price_unit,
//                     result[j].other_details,
//                     result[j].country,
//                     result[j].state,
//                     result[j].city,
//                     result[j].locality,
//                     result[j].sub_locality,
//                     status ? status : result[j].status,
//                     result[j].followup_dt,
//                     // result[j].comments,
//                     0,
//                   ],
//                   (err, result1) => {
//                     if (err) {
//                       if (err.code === "ER_DUP_ENTRY") {
//                         duplicateCount++;
//                       } else {
//                         console.log(err);
//                       }
//                     } else {
//                       connection.query(
//                         "UPDATE `crm_lead_primary_details` SET ??= ? WHERE ?? IN (?)",
//                         ["assign_status", "Yes", "l_id", lead_id],
//                         (err, result2) => {
//                           if (err) {
//                             // res.send(err);
//                             console.log(err);
//                           }
//                         }
//                       );
//                       getMessaging()
//                         .send({
//                           notification: {
//                             body: result[j].pname,
//                             title: "New lead is assigned to you for project",
//                           },
//                           data: {
//                             body: "" + result1.insertId,
//                             title: "Hello data title testing",
//                           },
//                           webpush: {
//                             fcmOptions: {
//                               link: "/todaysleads",
//                             },
//                           },
//                           topic: `/topics/${assign_uid[i] + "" + client_code}`,
//                         })
//                         .then((response) => {
//                           console.log("Notification Send cicd master");
//                         });
//                     }
//                     operationsCompleted++;
//                     checkCompletion();
//                   }
//                 );
//                 // console.log(client_code);
//                 // console.log(`/topics/${assign_uid[i] + "" + client_code}`);
//               }
//             }
//             // res.send("success");
//           }
//         }
//       );
//     });
//   } else {
//     pool.getConnection(function (error, connection) {
//       if (error) throw error;

//       connection.query(
//         "SELECT * FROM crm_lead_req_details WHERE ?? IN (?) AND ?? = ?",
//         ["lreq_id", lead_id, "assignto_id", user_id],
//         (err, result) => {
//           if (err) {
//             console.log(err);
//             res.status(500).send("Error occurred");
//             connection.release();
//             return;
//           }

//           let duplicateCount = 0;
//           let operationsCompleted = 0;
//           const totalOperations = assign_uid.length * result.length;

//           const checkCompletion = () => {
//             if (operationsCompleted === totalOperations) {
//               //   res.json({message:"Success"}, {duplicateCount});
//               res.send("success");
//               connection.release();
//             }
//           };

//           for (let i = 0; i < assign_uid.length; i++) {
//             for (let j = 0; j < result.length; j++) {
//               connection.query(
//                 "INSERT INTO crm_lead_req_details(??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
//                 [
//                   "l_id",
//                   "assignto_id",
//                   "assignby_id",
//                   "create_dt",
//                   "update_dt",
//                   "s_ccode",
//                   "s_mob",
//                   "s_email",
//                   "pname",
//                   "service_type",
//                   "ptype",
//                   "pcategory",
//                   "pconfiguration",
//                   "min_area",
//                   "max_area",
//                   "area_unit",
//                   "min_price",
//                   "max_price",
//                   "price_unit",
//                   "other_details",
//                   "country",
//                   "state",
//                   "city",
//                   "locality",
//                   "sub_locality",
//                   "status",
//                   "followup_dt",
//                   "comments",
//                   "clicked",
//                   result[j].l_id,
//                   assign_uid[i],
//                   user_id,
//                   dayjs(commentDt).format("YYYY-MM-DD HH:mm:ss"),
//                   dayjs(commentDt).format("YYYY-MM-DD HH:mm:ss"),
//                   result[j].create_dt,
//                   result[j].update_dt,
//                   result[j].s_ccode,
//                   result[j].s_mob,
//                   result[j].s_email,
//                   result[j].pname,
//                   result[j].service_type,
//                   result[j].ptype,
//                   result[j].pcategory,
//                   result[j].pconfiguration,
//                   result[j].min_area,
//                   result[j].max_area,
//                   result[j].area_unit,
//                   result[j].min_price,
//                   result[j].max_price,
//                   result[j].price_unit,
//                   result[j].other_details,
//                   result[j].country,
//                   result[j].state,
//                   result[j].city,
//                   result[j].locality,
//                   result[j].sub_locality,
//                   result[j].status,
//                   result[j].followup_dt,
//                   result[j].comments,
//                   0,
//                 ],
//                 (err, result1) => {
//                   if (err) {
//                     if (err.code === "ER_DUP_ENTRY") {
//                       duplicateCount++;
//                     } else {
//                       console.log(err);
//                     }
//                   } else {
//                     connection.query(
//                       "UPDATE `crm_lead_req_details` SET ??= ? WHERE ?? IN (?) AND ?? = ?",
//                       [
//                         "assign_status",
//                         "Yes",
//                         "lreq_id",
//                         lead_id,
//                         "assignto_id",
//                         user_id,
//                       ],
//                       (err, result2) => {
//                         if (err) {
//                           console.log(err);
//                         } else {
//                           // Send notification after successful assignment
//                           getMessaging()
//                             .send({
//                               notification: {
//                                 body: result[j].pname,
//                                 title:
//                                   "New lead is assigned to you for project",
//                               },
//                               webpush: {
//                                 fcmOptions: {
//                                   link: "/todaysleads",
//                                 },
//                               },
//                               topic: `/topics/${
//                                 assign_uid[i] + "" + client_code
//                               }`,
//                             })
//                             .then(() => {
//                               console.log("Notification Sent");
//                             })
//                             .catch((err) => {
//                               console.log("Notification Error:", err);
//                             });
//                         }
//                       }
//                     );
//                   }

//                   operationsCompleted++;
//                   checkCompletion();
//                 }
//               );
//             }
//           }
//         }
//       );
//     });
//     // pool.getConnection(function (error, connection) {
//     //   if (error) throw error;
//     //   connection.query(
//     //     "SELECT * FROM crm_lead_req_details WHERE ?? IN (?) AND ?? = ?",
//     //     ["lreq_id", lead_id, "assignto_id", user_id],
//     //     (err, result) => {
//     //       if (err) {
//     //         console.log(err);
//     //       } else {
//     //         let duplicateCount = 0;
//     //         for (let i = 0; i < assign_uid.length; i++) {
//     //           for (let j = 0; j < result.length; j++) {
//     //             connection.query(
//     //               "INSERT INTO crm_lead_req_details(??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
//     //               [
//     //                 "l_id",
//     //                 "assignto_id",
//     //                 "assignby_id",
//     //                 "create_dt",
//     //                 "update_dt",
//     //                 "s_ccode",
//     //                 "s_mob",
//     //                 "s_email",
//     //                 "pname",
//     //                 "service_type",
//     //                 "ptype",
//     //                 "pcategory",
//     //                 "pconfiguration",
//     //                 "min_area",
//     //                 "max_area",
//     //                 "area_unit",
//     //                 "min_price",
//     //                 "max_price",
//     //                 "price_unit",
//     //                 "other_details",
//     //                 "country",
//     //                 "state",
//     //                 "city",
//     //                 "locality",
//     //                 "sub_locality",
//     //                 "status",
//     //                 "followup_dt",
//     //                 "comments",
//     //                 "clicked",
//     //                 result[j].l_id,
//     //                 assign_uid[i],
//     //                 user_id,
//     //                 result[j].create_dt,
//     //                 result[j].update_dt,
//     //                 result[j].s_ccode,
//     //                 result[j].s_mob,
//     //                 result[j].s_email,
//     //                 result[j].pname,
//     //                 result[j].service_type,
//     //                 result[j].ptype,
//     //                 result[j].pcategory,
//     //                 result[j].pconfiguration,
//     //                 result[j].min_area,
//     //                 result[j].max_area,
//     //                 result[j].area_unit,
//     //                 result[j].min_price,
//     //                 result[j].max_price,
//     //                 result[j].price_unit,
//     //                 result[j].other_details,
//     //                 result[j].country,
//     //                 result[j].state,
//     //                 result[j].city,
//     //                 result[j].locality,
//     //                 result[j].sub_locality,
//     //                 result[j].status,
//     //                 result[j].followup_dt,
//     //                 result[j].comments,
//     //                 0,
//     //               ],
//     //               (err, result1) => {
//     //                 if (err) {
//     //                   if (err.code === 'ER_DUP_ENTRY') {
//     //                       duplicateCount++;
//     //                     } else {
//     //                       console.log(err);
//     //                     }
//     //                 } else {
//     //                   connection.query(
//     //                     "UPDATE `crm_lead_req_details` SET ??= ? WHERE ?? IN (?) AND ?? = ?",
//     //                     [
//     //                       "assign_status",
//     //                       "Yes",
//     //                       "lreq_id",
//     //                       lead_id,
//     //                       "assignto_id",
//     //                       user_id,
//     //                     ],
//     //                     (err, result2) => {
//     //                       if (err) {
//     //                         console.log(err);
//     //                       }
//     //                     //   else {
//     //                     //     res.send("success");
//     //                     //   }
//     //                     }
//     //                   );
//     //                 }
//     //               }
//     //             );
//     //             getMessaging()
//     //               .send({
//     //                 notification: {
//     //                   body: result[j].pname,
//     //                   title: "New lead is assigned to you for project",
//     //                 },
//     //                 webpush: {
//     //                   fcmOptions: {
//     //                     link: "/todaysleads",
//     //                   },
//     //                 },
//     //                 topic: `/topics/${assign_uid[i] + "" + client_code}`,
//     //               })
//     //               .then((response) => {
//     //                 console.log("Notification Send");
//     //               });
//     //           }
//     //         }
//     //       }
//     //       res.send(`Success with ${duplicateCount} duplicate entries`);
//     //       connection.release();
//     //     }
//     //   );
//     // });
//   }
// });

LeadRouter.post("/keep-and-assign-lead", (req, res) => {
  const user_role = req.session.user[0].urole;
  const status = req.body.data.lstatus;
  const user_id = req.session.user[0].u_id;
  const lead_id = req.body.data.lid;
  const assign_uid = req.body.data.users;
  const client_code = req.session.user[0].client_code;
  const commentDt = new Date().toLocaleString("en-US", {
    timeZone: "Asia/Dubai",
  });

  // Function to get lead data from primary table
  const getLeadDataFromPrimary = (connection, leadId, callback) => {
    connection.query(
      "SELECT * FROM crm_lead_primary_details WHERE l_id = ?",
      [leadId],
      (err, result) => {
        if (err) {
          console.log(err);
          callback(err, null);
        } else {
          callback(null, result[0]);
        }
      }
    );
  };

  // Function to insert lead assignment
  const insertLeadAssignment = (connection, leadData, assignToId, callback) => {
    const insertQuery = `
      INSERT INTO crm_lead_req_details(
        l_id, assignto_id, assignby_id, create_dt, update_dt, 
        s_ccode, s_mob, s_email, pname, service_type, 
        ptype, pcategory, pconfiguration, min_area, max_area, 
        area_unit, min_price, max_price, price_unit, other_details, 
        country, state, city, locality, sub_locality, 
        status, followup_dt, clicked
      ) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const insertValues = [
      leadData.l_id,
      assignToId,
      user_id,
      dayjs(commentDt).format("YYYY-MM-DD HH:mm:ss"),
      dayjs(commentDt).format("YYYY-MM-DD HH:mm:ss"),
      leadData.s_ccode,
      leadData.s_mob,
      leadData.s_email || "",
      leadData.pname,
      leadData.service_type,
      leadData.ptype,
      leadData.pcategory,
      leadData.pconfiguration,
      leadData.min_area,
      leadData.max_area,
      leadData.area_unit,
      leadData.min_price,
      leadData.max_price,
      leadData.price_unit,
      leadData.other_details,
      leadData.country,
      leadData.state,
      leadData.city,
      leadData.locality,
      leadData.sub_locality,
      status || leadData.status,
      leadData.followup_dt,
      0,
    ];

    connection.query(insertQuery, insertValues, (err, result) => {
      callback(err, result);
    });
  };

  // Function to send notification
  const sendNotification = (leadData, assignToId) => {
    getMessaging()
      .send({
        notification: {
          body: leadData.pname,
          title: "New lead is assigned to you for project",
        },
        data: {
          body: "" + leadData.l_id,
          title: "New Lead Assignment",
        },
        webpush: {
          fcmOptions: {
            link: "/todaysleads",
          },
        },
        topic: `/topics/${assignToId + "" + client_code}`,
      })
      .then((response) => {
        console.log("Notification sent successfully");
      })
      .catch((error) => {
        console.log("Notification error:", error);
      });
  };

  pool.getConnection(function (error, connection) {
    if (error) {
      console.error("Connection error:", error);
      return res.status(500).json({ error: "Database connection failed" });
    }

    // For all users, get data from primary table first
    getLeadDataFromPrimary(connection, lead_id, (err, leadData) => {
      if (err) {
        connection.release();
        return res.status(500).json({ error: "Failed to fetch lead data" });
      }

      if (!leadData) {
        connection.release();
        return res.status(404).json({ error: "Lead not found" });
      }

      let duplicateCount = 0;
      let operationsCompleted = 0;
      const totalOperations = assign_uid.length;

      const checkCompletion = () => {
        operationsCompleted++;
        if (operationsCompleted === totalOperations) {
          // Update assign status for admin users
          if (user_role === "Master" || user_role === "Admin") {
            connection.query(
              "UPDATE crm_lead_primary_details SET assign_status = ? WHERE l_id = ?",
              ["Yes", lead_id],
              (err) => {
                if (err) console.log("Update error:", err);
                connection.release();
                res.json({ message: "Success", duplicateCount });
              }
            );
          } else {
            // For non-admin users, update their specific assignment record
            connection.query(
              "UPDATE crm_lead_req_details SET assign_status = ? WHERE lreq_id = ? AND assignto_id = ?",
              ["Yes", lead_id, user_id],
              (err) => {
                if (err) console.log("Update error:", err);
                connection.release();
                res.json({ message: "Success", duplicateCount });
              }
            );
          }
        }
      };

      // Assign to each user
      for (let i = 0; i < assign_uid.length; i++) {
        insertLeadAssignment(
          connection,
          leadData,
          assign_uid[i],
          (err, result) => {
            if (err) {
              if (err.code === "ER_DUP_ENTRY") {
                duplicateCount++;
                console.log("Duplicate entry for user:", assign_uid[i]);
              } else {
                console.log("Insert error:", err);
              }
            } else {
              // Send notification for successful assignment
              sendNotification(leadData, assign_uid[i]);
            }
            checkCompletion();
          }
        );
      }
    });
  });
});

LeadRouter.post("/add-lead", upload.single("document"), (req, res) => {
  const user_role = req.session.user[0].urole;

  if (req.body.platform === "desktop") {
    let source_type = req.body.source_type;
    let source = req.body.source;
    let brk_id = req.body.brk_id;
    let ref_name = req.body.ref_name;
    let ref_ccode = req.body.ref_ccode;
    let ref_mob_no = req.body.ref_mob_no;
    let ref_email = req.body.ref_email;

    if (source_type === "Direct") {
      source = req.body.source;
      brk_id = "";
      ref_name = "";
      ref_ccode = "";
      ref_mob_no = "";
      ref_email = "";
    } else if (source_type === "Broker") {
      source = "";
      brk_id = req.body.brk_id;
      ref_name = "";
      ref_ccode = "";
      ref_mob_no = "";
      ref_email = "";
    } else if (source_type === "Reference") {
      source = "";
      brk_id = "";
      ref_name = req.body.ref_name;
      ref_ccode = req.body.ref_ccode;
      ref_mob_no = req.body.ref_mob_no;
      ref_email = req.body.ref_email;
    }

    if (user_role === "Master" || user_role === "Admin") {
      pool.getConnection(function (error, connection) {
        if (error) throw error;
        connection.query(
          "INSERT INTO crm_lead_primary_details(`u_id`, `create_dt`, `update_dt`, `source_type`, `brk_id`, `ref_name`, `ref_ccode`, `ref_mob`, `ref_email`, `source`,`buyer_type`,`investment_type`,`post_handover`,`handover_year`,`service_type`, `lname`, `p_ccode`, `p_mob`, `s_ccode`, `s_mob`, `p_email`, `pname`, `ptype`, `pcategory`, `pconfiguration`, `country`, `state`, `city`, `locality`, `min_area`, `max_area`, `area_unit`, `min_price`, `max_price`, `price_unit`, `other_details`,`document`) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
          [
            req.session.user[0].u_id,
            req.body.DateTime,
            req.body.DateTime,
            req.body.source_type,
            req.body.brk_id,
            req.body.ref_name,
            req.body.ref_ccode[1], // Assuming you want the second code '91' from ref_ccode
            req.body.ref_mob_no,
            req.body.ref_email,
            req.body.source,
            req.body.buyer_type,
            req.body.investment_type,
            req.body.post_handover,
            req.body.handover_year,
            req.body.service_type,
            req.body.lname,
            req.body.lccode,
            req.body.lmobile,
            req.body.s_ccode,
            req.body.s_mob ? req.body.s_mob : "",
            req.body.lemail,
            req.body.pname,
            req.body.ptype,
            req.body.pcategory,
            req.body.pconfiguration,
            req.body.country,
            req.body.state,
            req.body.city,
            req.body.locality,
            req.body.min_area,
            req.body.max_area,
            req.body.area_unit,
            req.body.min_price,
            req.body.max_price,
            req.body.price_unit,
            req.body.other_details,
            req.file ? req.file.filename : "",
          ],
          (err, result) => {
            if (err) {
              console.log("date", err);
              // res.send(err);
            } else {
              res.send("lead is Added");
            }
            connection.release();
          }
        );
      });
    } else {
      pool.getConnection(function (error, connection) {
        if (error) throw error;
        connection.query(
          "INSERT INTO crm_lead_primary_details( `u_id`, `create_dt`,`update_dt`,`source_type`,`brk_id`, `ref_name`, `ref_ccode`, `ref_mob`, `ref_email`, `source`,`buyer_type`,`investment_type`,`post_handover`,`handover_year` ,`service_type`, `lname`, `p_ccode`, `p_mob`, `p_email`, `pname`, `ptype`, `pcategory`, `pconfiguration`, `country`,  `state`, `city`, `locality`, `min_area`, `max_area`, `area_unit`, `min_price`,  `max_price`, `price_unit`, `other_details`, `assign_status`, `document`) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
          [
            req.session.user[0].u_id,
            req.body.DateTime,
            req.body.DateTime,
            req.body.source_type,
            req.body.brk_id,
            req.body.ref_name,
            req.body.ref_ccode[1],
            req.body.ref_mob_no,
            req.body.ref_email,
            req.body.source,
            req.body.buyer_type,
            req.body.investment_type,
            req.body.post_handover,
            req.body.handover_year,
            req.body.service_type,
            req.body.lname,
            req.body.lccode,
            req.body.lmobile,
            req.body.lemail,
            req.body.pname,
            req.body.ptype,
            req.body.pcategory,
            req.body.pconfiguration,
            req.body.country,
            req.body.state,
            req.body.city,
            req.body.locality,
            req.body.min_area,
            req.body.max_area,
            req.body.area_unit,
            req.body.min_price,
            req.body.max_price,
            encodeURIComponent(req.body.price_unit),
            req.body.other_details,
            "Yes",
            req.file ? req.file.filename : "",
          ],
          (err, result) => {
            if (err) {
              console.log(err);
            } else {
              pool.getConnection(function (error, connection) {
                if (error) throw error;
                connection.query(
                  "INSERT INTO crm_lead_req_details(??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
                  [
                    "l_id",
                    "assignto_id",
                    "assignby_id",
                    "create_dt",
                    "update_dt",
                    "service_type",
                    "pname",
                    "ptype",
                    "pcategory",
                    "pconfiguration",
                    "country",
                    "state",
                    "city",
                    "locality",
                    "min_area",
                    "max_area",
                    "area_unit",
                    "min_price",
                    "max_price",
                    "price_unit",
                    "other_details",
                    result.insertId,
                    req.session.user[0].u_id,
                    req.session.user[0].u_id,
                    req.body.DateTime,
                    req.body.DateTime,
                    req.body.service_type,
                    req.body.pname,
                    req.body.ptype,
                    req.body.pcategory,
                    req.body.pconfiguration,
                    req.body.country,
                    req.body.state,
                    req.body.city,
                    req.body.locality,
                    req.body.min_area,
                    req.body.max_area,
                    req.body.area_unit,
                    req.body.min_price,
                    req.body.max_price,
                    encodeURIComponent(req.body.price_unit),
                    req.body.other_details,
                  ],
                  (err, result) => {
                    if (err) {
                      console.log(err);
                    } else {
                      res.send("lead is Added");
                    }
                    connection.release();
                  }
                );
              });
            }
            connection.release();
          }
        );
      });
    }
  } else {
    let source_type = req.body.data.source_type;
    const base64Data = req.body.data.document; // Assuming this is where your
    let fileName = "";
    if (base64Data) {
      // Ensure it's a string before splitting
      if (typeof base64Data === "string") {
        const base64Image = base64Data.split(";base64,").pop();
        fileName = `${Date.now()}-uploadedFile.jpg`; // Change the extension based on the file type
        const filePath = path.join(
          __dirname,
          "./../../uploads/lead/",
          fileName
        );

        // Write the file to the uploads directory
        fs.writeFile(filePath, base64Image, { encoding: "base64" }, (err) => {
          if (err) {
            console.error("File write error:", err);
            return res.status(500).send("Error saving the document.");
          }
          uploadedFilePath = filePath; // Save the file path for database insertion
        });
      } else {
        console.error("Invalid Base64 data: not a string");
        return res.status(400).send("Invalid Base64 data");
      }
    }
    let source = req.body.data.source;
    let brk_id = req.body.data.brk_id;
    let ref_name = req.body.data.ref_name;
    let ref_ccode = req.body.data.ref_ccode;
    let ref_mob_no = req.body.data.ref_mob_no;
    let ref_email = req.body.data.ref_email;

    if (source_type === "Direct") {
      source = req.body.data.source;
      brk_id = "";
      ref_name = "";
      ref_ccode = "";
      ref_mob_no = "";
      ref_email = "";
    } else if (source_type === "Broker") {
      source = "";
      brk_id = req.body.data.brk_id;
      ref_name = "";
      ref_ccode = "";
      ref_mob_no = "";
      ref_email = "";
    } else if (source_type === "Reference") {
      source = "";
      brk_id = "";
      ref_name = req.body.data.ref_name;
      ref_ccode = req.body.data.ref_ccode;
      ref_mob_no = req.body.data.ref_mob_no;
      ref_email = req.body.data.ref_email;
    }

    let service_type = req.body.data.service_type;

    if (service_type !== "") {
      service_type = req.body.data.service_type.join(", ");
    } else {
      service_type = req.body.data.service_type;
    }

    let pname = req.body.data.pname;

    if (pname !== "") {
      if (Array.isArray(req.body.data.pname)) {
        pname = req.body.data.pname.join(", ");
      } else {
        pname = req.body.data.pname;
      }
    } else {
      pname = req.body.data.pname;
    }

    let ptype = req.body.data.ptype;

    if (ptype !== "") {
      ptype = req.body.data.ptype.join(", ");
    } else {
      ptype = req.body.data.ptype;
    }

    let pcategory = req.body.data.pcategory;

    if (pcategory !== "") {
      pcategory = req.body.data.pcategory.join(", ");
    } else {
      pcategory = req.body.data.pcategory;
    }

    let pconfiguration = req.body.data.pconfiguration;

    if (pconfiguration !== "") {
      pconfiguration = req.body.data.pconfiguration.join(", ");
    } else {
      pconfiguration = req.body.data.pconfiguration;
    }

    let country = req.body.data.country;

    if (country !== "") {
      country = req.body.data.country.join(", ");
    } else {
      country = req.body.data.country;
    }

    let state = req.body.data.state;

    if (state !== "") {
      state = req.body.data.state.join(", ");
    } else {
      state = req.body.data.state;
    }

    let city = req.body.data.city;

    if (city !== "") {
      city = req.body.data.city.join(", ");
    } else {
      city = req.body.data.city;
    }

    if (user_role === "Master" || user_role === "Admin") {
      pool.getConnection(function (error, connection) {
        if (error) throw error;
        connection.query(
          "INSERT INTO crm_lead_primary_details(??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??,??,??,??,??) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
          [
            "u_id",
            "create_dt",
            "update_dt",
            "source_type",
            "brk_id",
            "ref_name",
            "ref_ccode",
            "ref_mob",
            "ref_email",
            "source",
            "service_type",
            "lname",
            "p_ccode",
            "p_mob",
            "s_ccode",
            "s_mob",
            "p_email",
            "pname",
            "ptype",
            "pcategory",
            "pconfiguration",
            "country",
            "state",
            "city",
            "locality",
            "min_area",
            "max_area",
            "area_unit",
            "min_price",
            "max_price",
            "price_unit",
            "buyer_type",
            "investment_type",
            "post_handover",
            "other_details",
            "document",
            req.session.user[0].u_id,
            dayjs(DubaiDateTime).format("YYYY-MM-DD HH:mm:ss"),
            dayjs(DubaiDateTime).format("YYYY-MM-DD HH:mm:ss"),
            source_type,
            brk_id,
            ref_name,
            ref_ccode,
            ref_mob_no,
            ref_email,
            source,
            service_type,
            req.body.data.lname,
            req.body.data.lccode || "",
            req.body.data.lmobile,
            req.body.data.s_ccode || "",
            req.body.data.s_mob ? req.body.data.s_mob : "",
            req.body.data.lemail,
            pname,
            ptype,
            pcategory,
            pconfiguration,
            country,
            state,
            city,
            req.body.data.locality,
            req.body.data.min_area,
            req.body.data.max_area,
            req.body.data.area_unit,
            req.body.data.min_price,
            req.body.data.max_price,
            req.body.data.price_unit,
            req.body.data.buyer_type,
            req.body.data.investment_type,
            req.body.data.post_handover,
            req.body.data.other_details,
            fileName,
          ],
          (err, result) => {
            if (err) {
              console.log("data", err);
              res.send(err);
            } else {
              res.send("lead is Added");
            }
            connection.release();
          }
        );
      });
    } else {
      pool.getConnection(function (error, connection) {
        if (error) throw error;
        connection.query(
          "INSERT INTO crm_lead_primary_details(??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??,??,??,??,??) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
          [
            "u_id",
            "create_dt",
            "update_dt",
            "source_type",
            "brk_id",
            "ref_name",
            "ref_ccode",
            "ref_mob",
            "ref_email",
            "source",
            "service_type",
            "lname",
            "p_ccode",
            "p_mob",
            "p_email",
            "pname",
            "ptype",
            "pcategory",
            "pconfiguration",
            "country",
            "state",
            "city",
            "locality",
            "min_area",
            "max_area",
            "area_unit",
            "min_price",
            "max_price",
            "price_unit",
            "buyer_type",
            "investment_type",
            "post_handover",
            "other_details",
            "document",
            "assign_status",
            req.session.user[0].u_id,
            dayjs(DubaiDateTime).format("YYYY-MM-DD HH:mm:ss"),
            dayjs(DubaiDateTime).format("YYYY-MM-DD HH:mm:ss"),
            source_type,
            brk_id,
            ref_name,
            ref_ccode || "",
            ref_mob_no,
            ref_email,
            source,
            service_type,
            req.body.data.lname,
            req.body.data.lccode || "",
            req.body.data.lmobile,
            req.body.data.lemail,
            pname,
            ptype,
            pcategory,
            pconfiguration,
            country,
            state,
            city,
            req.body.data.locality,
            req.body.data.min_area,
            req.body.data.max_area,
            req.body.data.area_unit,
            req.body.data.min_price,
            req.body.data.max_price,
            encodeURIComponent(req.body.data.price_unit),
            req.body.data.buyer_type,
            req.body.data.investment_type,
            req.body.data.post_handover,
            req.body.data.other_details,
            fileName,
            "Yes",
          ],
          (err, result) => {
            if (err) {
              console.log(err);
            } else {
              pool.getConnection(function (error, connection) {
                if (error) throw error;
                connection.query(
                  "INSERT INTO crm_lead_req_details(??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
                  [
                    "l_id",
                    "assignto_id",
                    "assignby_id",
                    "create_dt",
                    "update_dt",
                    "service_type",
                    "pname",
                    "ptype",
                    "pcategory",
                    "pconfiguration",
                    "country",
                    "state",
                    "city",
                    "locality",
                    "min_area",
                    "max_area",
                    "area_unit",
                    "min_price",
                    "max_price",
                    "price_unit",
                    "other_details",
                    result.insertId,
                    req.session.user[0].u_id,
                    req.session.user[0].u_id,
                    dayjs(DubaiDateTime).format("YYYY-MM-DD HH:mm:ss"),
                    dayjs(DubaiDateTime).format("YYYY-MM-DD HH:mm:ss"),
                    service_type,
                    pname,
                    ptype,
                    pcategory,
                    pconfiguration,
                    country,
                    state,
                    city,
                    req.body.data.locality,
                    req.body.data.min_area,
                    req.body.data.max_area,
                    req.body.data.area_unit,
                    req.body.data.min_price,
                    req.body.data.max_price,
                    encodeURIComponent(req.body.data.price_unit),
                    req.body.data.other_details,
                  ],
                  (err, result) => {
                    if (err) {
                      console.log(err);
                    } else {
                      res.send("lead is Added");
                    }
                    connection.release();
                  }
                );
              });
            }
            connection.release();
          }
        );
      });
    }
  }
});

LeadRouter.post("/edit-lead", upload.single("document"), (req, res) => {
  if (req.body.platform === "desktop") {
    const user_id = req.session.user[0].u_id;
    const user_role = req.session.user[0].urole;
    const lead_id = req.body.l_id;
    const assignlead_id = req.body.assignlead_id;

    let source_type = req.body.source_type;
    let source = req.body.source;
    let brk_id = req.body.brk_id;
    let ref_name = req.body.ref_name;
    let ref_ccode = req.body.ref_ccode;
    let ref_mob_no = req.body.ref_mob_no;
    let ref_email = req.body.ref_email;

    if (source_type === "Direct") {
      source = req.body.source;
      brk_id = "";
      ref_name = "";
      ref_ccode = "";
      ref_mob_no = "";
      ref_email = "";
    } else if (source_type === "Broker") {
      source = "";
      brk_id = req.body.brk_id;
      ref_name = "";
      ref_ccode = "";
      ref_mob_no = "";
      ref_email = "";
    } else if (source_type === "Reference") {
      source = "";
      brk_id = "";
      ref_name = req.body.ref_name;
      ref_ccode = req.body.ref_ccode;
      ref_mob_no = req.body.ref_number;
      ref_email = req.body.ref_email;
    }

    if (user_role === "Master" || user_role === "Admin") {
      pool.getConnection(function (error, connection) {
        if (error) throw error;

        // Step 1: Fetch existing document filename
        const fetchQuery =
          "SELECT document FROM crm_lead_primary_details WHERE l_id = ?";
        connection.query(fetchQuery, [lead_id], (fetchErr, fetchResults) => {
          if (fetchErr) {
            connection.release();
            return res.status(500).send("Error fetching existing document");
          }

          const existingDocument = fetchResults[0]?.document;

          // Step 2: Delete the existing file if a new one is uploaded
          if (req.file && existingDocument) {
            const filePath = `uploads/lead/${existingDocument}`;
            fs.unlink(filePath, (unlinkErr) => {
              if (unlinkErr) {
                console.error("Error deleting file:", unlinkErr);
                // Handle the error or decide whether to continue with the update
              } else {
              }
              // Proceed with the update after attempting to delete the old file
              proceedWithUpdate();
            });
          } else {
            // No file deletion needed; proceed with the update
            proceedWithUpdate();
          }

          function proceedWithUpdate() {
            connection.query(
              "UPDATE crm_lead_primary_details SET ?? = ?,?? = ?,?? = ?,?? = ?,?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ? WHERE ?? = ?",
              [
                "update_dt",
                req.body.DateTime,
                "source_type",
                source_type,
                "brk_id",
                brk_id,
                "ref_name",
                ref_name,
                "ref_ccode",
                ref_ccode,
                "ref_mob",
                ref_mob_no,
                "ref_email",
                ref_email,
                "source",
                source,
                "service_type",
                req.body.service_type,
                "lname",
                req.body.lname,
                "p_ccode",
                req.body.lccode || "",
                "p_mob",
                req.body.lmobile,
                "p_email",
                req.body.lemail,
                "s_ccode",
                req.body.s_ccode || "",
                "s_mob",
                req.body.s_mob,
                "s_email",
                req.body.alt_lemail,
                "pname",
                req.body.pname,
                "ptype",
                req.body.ptype,
                "pcategory",
                req.body.pcategory,
                "pconfiguration",
                req.body.pconfiguration,
                "country",
                req.body.country,
                "state",
                req.body.state,
                "city",
                req.body.city,
                "locality",
                req.body.locality,
                "min_area",
                req.body.min_area,
                "max_area",
                req.body.max_area,
                "area_unit",
                req.body.area_unit,
                "min_price",
                req.body.min_price,
                "max_price",
                req.body.max_price,
                "price_unit",
                encodeURIComponent(req.body.price_unit),
                "other_details",
                req.body.other_details,
                "buyer_type",
                req.body.buyer_type,
                "investment_type",
                req.body.investment_type,
                "post_handover",
                req.body.post_handover,
                "handover_year",
                req.body.handover_year,
                "document",
                req.file ? req.file.filename : existingDocument, // Use new filename if uploaded
                "l_id",
                lead_id,
              ],
              (updateErr, result) => {
                if (updateErr) {
                  console.log(updateErr);
                  res.status(500).send("Error updating lead");
                } else {
                  res.send("Lead is updated");
                }
                connection.release();
              }
            );
          }
        });
      });
    } else {
      pool.getConnection(function (error, connection) {
        if (error) throw error;

        const updateLnameQuery = `
    UPDATE  crm_lead_primary_details
    SET lname = ?
    WHERE l_id = ?  
  `;

        connection.query(
          updateLnameQuery,
          [req.body.lname, assignlead_id],
          (lnameErr, lnameResult) => {
            if (lnameErr) {
              res
                .status(500)
                .send("Error updating lname in crm_lead_req_details");
            } else {

              // Proceed with the rest of the update logic for crm_lead_req_details
              connection.query(
                "UPDATE crm_lead_req_details SET ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ? WHERE ?? = ? AND ?? = ?",
                [
                  "update_dt",
                  req.body.DateTime,
                  "service_type",
                  req.body.service_type,
                  "s_ccode",
                  req.body.s_ccode || "",
                  "s_mob",
                  req.body.s_mob,
                  "s_email",
                  req.body.alt_lemail,
                  "pname",
                  req.body.pname,
                  "ptype",
                  req.body.ptype,
                  "pcategory",
                  req.body.pcategory,
                  "pconfiguration",
                  req.body.pconfiguration,
                  "country",
                  req.body.country,
                  "state",
                  req.body.state,
                  "city",
                  req.body.city,
                  "locality",
                  req.body.locality,
                  "min_area",
                  req.body.min_area,
                  "max_area",
                  req.body.max_area,
                  "area_unit",
                  req.body.area_unit,
                  "min_price",
                  req.body.min_price,
                  "max_price",
                  req.body.max_price,
                  "price_unit",
                  encodeURIComponent(req.body.price_unit),
                  "other_details",
                  req.body.other_details,
                  "lreq_id",
                  lead_id,
                  "assignto_id",
                  user_id,
                ],
                (err, result) => {
                  if (err) {
                    console.log(err);
                  } else {
                    res.send("Lead is updated");
                  }
                  connection.release();
                }
              );
            }
          }
        );
      });
    }
  } else {
    const user_id = req.session.user[0].u_id;
    const user_role = req.session.user[0].urole;
    const base64Data = req.body.data[0].document;

    let fileName = ""; // Initialize fileName to an empty string
    let uploadedFilePath; // Declare uploadedFilePath

    if (base64Data) {
      // Ensure it's a string before splitting
      if (typeof base64Data === "string") {
        const base64Image = base64Data.split(";base64,").pop();
        fileName = `${Date.now()}-uploadedFile.jpg`; // Change the extension based on the file type
        const filePath = path.join(
          __dirname,
          "./../../uploads/lead/",
          fileName
        );

        // Write the file to the uploads directory
        fs.writeFile(filePath, base64Image, { encoding: "base64" }, (err) => {
          if (err) {
            console.error("File write error:", err);
            return res.status(500).send("Error saving the document.");
          }
          uploadedFilePath = filePath; // Save the file path for database insertion
        });
      } else {
        console.error("Invalid Base64 data: not a string");
        return res.status(400).send("Invalid Base64 data");
      }
    }

    const lead_id = req.body.data[0].l_id;

    let source_type = req.body.data[0].source_type;
    let source = req.body.data[0].source;
    let brk_id = req.body.data[0].brk_id;
    let ref_name = req.body.data[0].ref_name;
    let ref_ccode = req.body.data[0].ref_ccode;
    let ref_mob_no = req.body.data[0].ref_mob_no;
    let ref_email = req.body.data[0].ref_email;

    if (source_type === "Direct") {
      source = req.body.data[0].source;
      brk_id = "";
      ref_name = "";
      ref_ccode = "";
      ref_mob_no = "";
      ref_email = "";
    } else if (source_type === "Broker") {
      source = "";
      brk_id = req.body.data[0].brk_id;
      ref_name = "";
      ref_ccode = "";
      ref_mob_no = "";
      ref_email = "";
    } else if (source_type === "Reference") {
      source = "";
      brk_id = "";
      ref_name = req.body.data[0].ref_name;
      ref_ccode = req.body.data[1].ref_ccode;
      ref_mob_no = req.body.data[1].ref_number;
      ref_email = req.body.data[0].ref_email;
    }

    let service_type = req.body.data[0].service_type;

    if (Array.isArray(service_type)) {
      service_type = req.body.data[0].service_type.join(", ");
    } else {
      service_type = req.body.data[0].service_type;
    }

    let pname = req.body.data[0].pname;

    if (Array.isArray(pname)) {
      pname = req.body.data[0].pname.join(", ");
    } else {
      pname = req.body.data[0].pname;
    }

    let ptype = req.body.data[0].ptype;

    if (Array.isArray(ptype)) {
      ptype = req.body.data[0].ptype.join(", ");
    } else {
      ptype = req.body.data[0].ptype;
    }

    let pcategory = req.body.data[0].pcategory;

    if (Array.isArray(pcategory)) {
      pcategory = req.body.data[0].pcategory.join(", ");
    } else {
      pcategory = req.body.data[0].pcategory;
    }

    let pconfiguration = req.body.data[0].pconfiguration;

    if (Array.isArray(pconfiguration)) {
      pconfiguration = req.body.data[0].pconfiguration.join(", ");
    } else {
      pconfiguration = req.body.data[0].pconfiguration;
    }

    let country = req.body.data[0].country;

    if (Array.isArray(country)) {
      country = req.body.data[0].country.join(", ");
    } else {
      country = req.body.data[0].country;
    }

    let state = req.body.data[0].state;

    if (Array.isArray(state)) {
      state = req.body.data[0].state.join(", ");
    } else {
      state = req.body.data[0].state;
    }

    let city = req.body.data[0].city;

    if (Array.isArray(city)) {
      city = req.body.data[0].city.join(", ");
    } else {
      city = req.body.data[0].city;
    }

    if (user_role === "Master" || user_role === "Admin") {
      pool.getConnection(function (error, connection) {
        if (error) throw error;

        // Get the current lead_document from the database if it exists
        connection.query(
          "SELECT document FROM crm_lead_primary_details WHERE l_id = ?",
          [lead_id],
          (err, result) => {
            if (err) {
              console.error(err);
              return res
                .status(500)
                .send("Error retrieving the lead document.");
            }

            let existingFileName = result[0]?.document || ""; // Preserve old file name if no new file is uploaded

            // Delete the old file if it exists and is not empty
            if (fileName && existingFileName) {
              const oldFilePath = path.join(
                __dirname,
                "./../../uploads/lead/",
                existingFileName
              );
              fs.unlink(oldFilePath, (err) => {
                if (err) {
                  console.error("Error deleting old file:", err);
                  return res.status(500).send("Error deleting old document.");
                }
              });
            }

            // Update the database
            connection.query(
              "UPDATE crm_lead_primary_details SET ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ?,?? = ?,?? = ?,?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ? , ?? = ? WHERE ?? = ?",
              [
                "update_dt",
                dayjs(DubaiDateTime).format("YYYY-MM-DD HH:mm:ss"),
                "source_type",
                source_type,
                "brk_id",
                brk_id,
                "ref_name",
                ref_name,
                "ref_ccode",
                ref_ccode,
                "ref_mob",
                ref_mob_no,
                "ref_email",
                ref_email,
                "source",
                source,
                "service_type",
                service_type,
                "lname",
                req.body.data[0].lname,
                "p_ccode",
                req.body.data[1].lccode,
                "p_mob",
                req.body.data[1].lmobile,
                "p_email",
                req.body.data[0].lemail,
                "s_ccode",
                req.body.data[1].s_ccode,
                "s_mob",
                req.body.data[1].s_mob,
                "s_email",
                req.body.data[0].alt_lemail,
                "pname",
                pname,
                "ptype",
                ptype,
                "pcategory",
                pcategory,
                "pconfiguration",
                pconfiguration,
                "country",
                country,
                "state",
                state,
                "city",
                city,
                "locality",
                req.body.data[0].locality,
                "min_area",
                req.body.data[0].min_area,
                "max_area",
                req.body.data[0].max_area,
                "area_unit",
                req.body.data[0].area_unit,
                "min_price",
                req.body.data[0].min_price,
                "max_price",
                req.body.data[0].max_price,
                "price_unit",
                encodeURIComponent(req.body.data[0].price_unit),
                "other_details",
                req.body.data[0].other_details,
                "buyer_type",
                req.body.data[0].buyer_type,
                "investment_type",
                req.body.data[0].investment_type,
                "post_handover",
                req.body.data[0].post_handover,
                // Use the new fileName if a file was uploaded, otherwise use the existing file name
                "document",
                fileName || existingFileName,
                "l_id",
                lead_id,
              ],
              (err, result) => {
                if (err) {
                  console.log(err, "edit lead error");
                  res.status(500).send("Error updating the lead.");
                } else {
                  res.send("Lead is Updated");
                }
                connection.release();
              }
            );
          }
        );
      });
    } else {
      pool.getConnection(function (error, connection) {
        if (error) throw error;
        connection.query(
          "UPDATE crm_lead_req_details SET ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ? WHERE ?? = ? AND ?? = ?",
          [
            "update_dt",
            dayjs(DubaiDateTime).format("YYYY-MM-DD HH:mm:ss"),
            "service_type",
            service_type,
            "s_ccode",
            req.body.data[1].s_ccode,
            "s_mob",
            req.body.data[1].s_mob,
            "s_email",
            req.body.data[0].alt_lemail,
            "pname",
            pname,
            "ptype",
            ptype,
            "pcategory",
            pcategory,
            "pconfiguration",
            pconfiguration,
            "country",
            country,
            "state",
            state,
            "city",
            city,
            "locality",
            req.body.data[0].locality,
            "min_area",
            req.body.data[0].min_area,
            "max_area",
            req.body.data[0].max_area,
            "area_unit",
            req.body.data[0].area_unit,
            "min_price",
            req.body.data[0].min_price,
            "max_price",
            req.body.data[0].max_price,
            "price_unit",
            encodeURIComponent(req.body.data[0].price_unit),
            "other_details",
            req.body.data[0].other_details,
            "lreq_id",
            lead_id,
            "assignto_id",
            user_id,
          ],
          (err, result) => {
            if (err) {
              console.log(err, "edit lead");
            } else {
              res.send("lead is Updated");
            }
            connection.release();
          }
        );
      });
    }
  }
});

//app
LeadRouter.post("/leadDetail", (req, res) => {
  //const user_id = req.session.user[0].u_id;
  const user_id = req.session.user[0].u_id;
  const user_role = req.session.user[0].urole;
  const lead_id = req.body.lead_id;

  if (user_role === "Master" || user_role === "Admin") {
    pool.getConnection(function (error, connection) {
      if (error) {
        throw error;
      }

      let query = `SELECT 
    clpd.l_id,
    GROUP_CONCAT(cu.username) AS assign_users,
    GROUP_CONCAT(clr.status) AS user_status,
    GROUP_CONCAT(cls.color) AS user_color,
    CONCAT(IFNULL(GROUP_CONCAT(clr.comments SEPARATOR '~'), '~'), '~', IFNULL(clpd.comments, '~')) AS all_comments,
    clpd.comments,
    clpd.create_dt,
    clpd.source_type,
    clpd.source,
    clpd.service_type,
    clpd.lname,
    clpd.p_ccode,
    REPLACE(clpd.p_mob, ' ', '') AS p_mob,
    clpd.p_email,
    clpd.s_ccode,
    clpd.s_mob,
    clpd.s_email,
    clpd.ref_name,
    clpd.ref_ccode,
    clpd.ref_mob,
    clpd.ref_email,
    clpd.pname,
    clpd.service_type,
    clpd.ptype,
    clpd.pcategory,
    clpd.pconfiguration,
    clpd.min_area,
    clpd.max_area,
    clpd.area_unit,
    clpd.min_price,
    clpd.max_price,
    clpd.price_unit,
    clpd.status,
    clpd.lead_priority,
    cls_admin.color AS admin_status_color,
    clpd.followup,
    clpd.followup_dt,
    clpd.other_details,
    clpd.country,
    clpd.state,
    clpd.city,
    clpd.document,
    clpd.locality,
    clpd.sub_locality,
    clpd.brk_id,
    clpd.buyer_type,
    clpd.investment_type,
    clpd.post_handover,
    clpd.handover_year,
    clpd.clicked,
    (SELECT GROUP_CONCAT(CONCAT('Status:', status, '|', 'Comment:', IFNULL(comments, ''), '|', 'Date:', update_dt)) 
     FROM crm_lead_history 
     WHERE l_id = clpd.l_id AND status != '') AS leads_history,
    (SELECT GROUP_CONCAT(cu2.username) 
     FROM crm_lead_history clh  
     JOIN crm_users cu2 ON cu2.u_id = clh.u_id 
     WHERE clh.l_id = clpd.l_id AND clh.status != '') AS leads_history_users,
    (SELECT GROUP_CONCAT(cls2.color) 
     FROM crm_lead_history clh 
     JOIN crm_lead_status cls2 ON cls2.status = clh.status 
     WHERE clh.l_id = clpd.l_id) AS leads_history_color 
FROM 
    crm_lead_primary_details clpd 
LEFT JOIN 
    crm_lead_req_details clr ON clr.l_id = clpd.l_id 
LEFT JOIN 
    crm_users cu ON cu.u_id = clr.assignto_id 
LEFT JOIN 
    crm_lead_status cls ON cls.status = clr.status 
LEFT JOIN 
    crm_lead_status cls_admin ON cls_admin.status = clpd.status 
WHERE 
    clpd.l_id = ? 
GROUP BY 
    clpd.l_id;

`;
      connection.query(query, [lead_id], (err, result) => {
        if (err) {
          res.send(err);
          console.log(err);
        }
        if (result.length > 0) {
          res.send(result);
        } else {
          res.send("No Data Found");
        }
        connection.release();
      });
    });
  } else {
    pool.getConnection(function (error, connection) {
      if (error) {
        throw error;
      }
      connection.query(
        `SELECT crm_lead_req_details.lreq_id AS l_id,crm_lead_req_details.l_id AS lreq_id, crm_lead_primary_details.source_type,(SELECT GROUP_CONCAT(cu.username) FROM crm_users cu WHERE cu.u_id IN (SELECT crm_lead_req_details.assignto_id FROM crm_lead_req_details WHERE crm_lead_req_details.assignby_id = ? AND crm_lead_req_details.l_id = crm_lead_primary_details.l_id)) AS assign_users, crm_lead_primary_details.create_dt, crm_lead_primary_details.lname,crm_lead_primary_details.source,crm_lead_primary_details.brk_id,crm_lead_primary_details.document,crm_lead_primary_details.buyer_type,crm_lead_primary_details.investment_type,crm_lead_primary_details.post_handover,crm_lead_primary_details.handover_year,crm_lead_primary_details.p_ccode,CONCAT(IFNULL(GROUP_CONCAT((SELECT GROUP_CONCAT(crm_lead_req_details.comments SEPARATOR '~') FROM crm_lead_req_details WHERE crm_lead_req_details.l_id = crm_lead_primary_details.l_id AND (crm_lead_req_details.assignto_id = ? OR crm_lead_req_details.assignby_id = ?)) SEPARATOR '~'), '~'),'~',IFNULL(crm_lead_primary_details.comments, '~')) AS all_comments, crm_lead_primary_details.p_mob, crm_lead_primary_details.p_email,crm_lead_primary_details.s_mob,crm_lead_primary_details.ref_name, crm_lead_primary_details.ref_ccode, crm_lead_primary_details.ref_mob,(SELECT GROUP_CONCAT(CONCAT(status,'|',update_dt)) FROM crm_lead_history WHERE l_id = crm_lead_req_details.l_id AND status !='' AND (crm_lead_history.u_id IN (SELECT crm_users.u_id FROM crm_users WHERE crm_users.utype = 'Admin') OR crm_lead_history.u_id = ? OR crm_lead_history.u_id IN (SELECT crm_lead_req_details.assignto_id FROM crm_lead_req_details WHERE crm_lead_req_details.assignby_id = ? AND crm_lead_req_details.l_id IN (SELECT crm_lead_req_details.l_id FROM crm_lead_req_details WHERE crm_lead_req_details.lreq_id = ?)))) AS leads_history,(SELECT GROUP_CONCAT(crm_users.username) FROM crm_lead_history  JOIN crm_users ON crm_users.u_id = crm_lead_history.u_id WHERE crm_lead_history.l_id = crm_lead_req_details.l_id AND crm_lead_history.status != '' AND (crm_lead_history.u_id IN (SELECT crm_users.u_id FROM crm_users WHERE crm_users.utype = 'Admin') OR crm_lead_history.u_id = ? OR crm_lead_history.u_id IN (SELECT crm_lead_req_details.assignto_id FROM crm_lead_req_details WHERE crm_lead_req_details.assignby_id = ? AND crm_lead_req_details.l_id IN (SELECT crm_lead_req_details.l_id FROM crm_lead_req_details WHERE crm_lead_req_details.lreq_id = ?)))) AS leads_history_users,(SELECT GROUP_CONCAT(cls2.color) FROM crm_lead_history JOIN crm_lead_status cls2 ON cls2.status = crm_lead_history.status WHERE crm_lead_history.l_id = crm_lead_req_details.l_id AND (crm_lead_history.u_id IN (SELECT crm_users.u_id FROM crm_users WHERE crm_users.utype = 'Admin') OR crm_lead_history.u_id = ? OR crm_lead_history.u_id IN (SELECT crm_lead_req_details.assignto_id FROM crm_lead_req_details WHERE crm_lead_req_details.assignby_id = ? AND crm_lead_req_details.l_id IN (SELECT crm_lead_req_details.l_id FROM crm_lead_req_details WHERE crm_lead_req_details.lreq_id = ?)))) AS leads_history_color, crm_lead_primary_details.ref_email, crm_lead_req_details.s_ccode, crm_lead_req_details.s_email, crm_lead_req_details.pname, crm_lead_req_details.service_type, crm_lead_req_details.ptype, crm_lead_req_details.pcategory, crm_lead_req_details.pconfiguration, crm_lead_req_details.min_area, crm_lead_req_details.max_area, crm_lead_req_details.area_unit, crm_lead_req_details.min_price, crm_lead_req_details.max_price, crm_lead_req_details.price_unit, crm_lead_req_details.state, crm_lead_req_details.country, crm_lead_req_details.city, crm_lead_req_details.locality, crm_lead_req_details.sub_locality, crm_lead_req_details.status, crm_lead_req_details.other_details, crm_lead_req_details.quality, crm_lead_req_details.followup, crm_lead_req_details.followup_dt, crm_lead_req_details.comments, crm_lead_status.color AS admin_status_color FROM crm_lead_primary_details JOIN crm_lead_req_details ON crm_lead_primary_details.l_id = crm_lead_req_details.l_id LEFT JOIN crm_lead_status ON crm_lead_req_details.status = crm_lead_status.status WHERE ?? = ? AND ?? = ?`,
        [
          user_id,
          user_id,
          user_id,
          user_id,
          user_id,
          lead_id,
          user_id,
          user_id,
          lead_id,
          user_id,
          user_id,
          lead_id,
          "crm_lead_req_details.assignto_id",
          user_id,
          "crm_lead_req_details.lreq_id",
          lead_id,
        ],
        (err, result) => {
          if (err) {
            console.log(err);
          }
          if (result.length > 0) {
            res.send(result);
            // ;
          } else {
            res.send("No Data Found");
          }
          connection.release();
        }
      );
    });
  }
});

LeadRouter.post("/updateStatus", (req, res) => {
  const status = req.body.status;
  const lid = req.body.lid;
  const user_id = req.session.user[0].u_id;
  const user_role = req.session.user[0].urole;
  const update_dt = dayjs().format("YYYY-MM-DD HH:mm:ss");

  if (user_role === "Master" || user_role === "Admin") {
    pool.getConnection(function (error, connection) {
      if (error) {
        throw error;
      }
      connection.query(
        "UPDATE crm_lead_primary_details SET status = ? WHERE l_id = ?",
        [status, lid],
        (err, result) => {
          if (err) {
            console.log(err);
          } else {
            connection.query(
              "INSERT INTO `crm_lead_history`(??, ??, ??, ??, ??) VALUES (?,?,?,?,?)",
              [
                "l_id",
                "u_id",
                "create_dt",
                "update_dt",
                "status",
                // "lname",
                // "p_mob",
                // "pname",
                // "comments",
                // "followup",
                // "followup_dt",
                lid,
                user_id,
                update_dt,
                update_dt,
                status,
                // req.body.data.lname,
                // req.body.data.p_mob,
                // req.body.data.pname,
                // req.body.data.newComment,
                // req.body.data.follow_up,
                // followup_dt,
              ],
              (err2, result2) => {
                if (err2) {
                  console.log(err2);
                } else {
                  res.send("success");
                }
              }
            );
            // res.send("success");
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
        "UPDATE crm_lead_req_details SET ?? = ? WHERE ?? = ? AND ?? = ?",
        ["status", status, "lreq_id", lid, "assignto_id", user_id],
        (err, result) => {
          if (err) {
            console.log(err);
          } else {
            connection.query(
              "INSERT INTO `crm_lead_history`(??, ??, ??, ??, ??) VALUES (?,?,?,?,?)",
              [
                "l_id",
                "u_id",
                "create_dt",
                "update_dt",
                "status",
                // "lname",
                // "p_mob",
                // "pname",
                // "comments",
                // "followup",
                // "followup_dt",
                req.body.lreq_id,
                user_id,
                update_dt,
                update_dt,
                status,
                // req.body.data.lname,
                // req.body.data.p_mob,
                // req.body.data.pname,
                // req.body.data.newComment,
                // req.body.data.follow_up,
                // followup_dt,
              ],
              (err2, result2) => {
                if (err2) {
                  console.log(err2);
                } else {
                  res.send("success");
                }
              }
            );
            // res.send("success");
          }
          connection.release();
        }
      );
    });
  }
});

LeadRouter.post("/editcomment", (req, res) => {
  const comments = req.body.comments;
  const user_id = req.session.user[0].u_id;
  const lead_id = req.body.lid;
  const user_role = req.session.user[0].urole;

  if (user_role === "Master" || user_role === "Admin") {
    pool.getConnection(function (error, connection) {
      if (error) {
        throw error;
      }
      connection.query(
        "UPDATE crm_lead_primary_details SET ?? = ? WHERE ?? = ?",
        ["comments", comments, "l_id", lead_id],
        (err, result) => {
          if (err) {
            console.log(err);
          } else {
            res.send("comment edited");
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
        "UPDATE crm_lead_req_details SET ?? = ? WHERE ?? = ? AND ?? = ?",
        ["comments", comments, "assignto_id", user_id, "lreq_id", lead_id],
        (err, result) => {
          if (err) {
            console.log(err);
          } else {
            res.send("comment edited");
          }
          connection.release();
        }
      );
    });
  }
});

LeadRouter.post("/editotherdetails", (req, res) => {
  const other_details = req.body.other_details;
  const user_id = req.session.user[0].u_id;
  const lead_id = req.body.lid;
  const user_role = req.session.user[0].urole;

  if (user_role === "Master" || user_role === "Admin") {
    pool.getConnection(function (error, connection) {
      if (error) {
        throw error;
      }
      connection.query(
        "UPDATE crm_lead_primary_details SET ?? = ? WHERE ?? = ?",
        ["other_details", other_details, "l_id", lead_id],
        (err, result) => {
          if (err) {
            console.log(err);
          } else {
            res.send("other details updated");
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
        "UPDATE crm_lead_req_details SET ?? = ? WHERE ?? = ? AND ?? = ?",
        [
          "other_details",
          other_details,
          "assignto_id",
          user_id,
          "lreq_id",
          lead_id,
        ],
        (err, result) => {
          if (err) {
            console.log(err);
          } else {
            res.send("other details updated");
          }
          connection.release();
        }
      );
    });
  }
});

LeadRouter.post("/editfollowupno", (req, res) => {
  const followup_dt = "0000-00-00 00:00:00";
  const user_id = req.session.user[0].u_id;
  const lead_id = req.body.lid;
  const user_role = req.session.user[0].urole;
  const followup = req.body.followup;

  if (user_role === "Master" || user_role === "Admin") {
    pool.getConnection(function (error, connection) {
      if (error) {
        throw error;
      }
      connection.query(
        "UPDATE crm_lead_primary_details SET ?? = ?, ?? = ? WHERE ?? = ?",
        ["followup", followup, "followup_dt", followup_dt, "l_id", lead_id],
        (err, result) => {
          if (err) {
            console.log(err);
          } else {
            res.send("lead followup date updated");
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
        "UPDATE crm_lead_req_details SET ?? = ?, ?? = ? WHERE ?? = ? AND ?? = ?",
        [
          "followup",
          followup,
          "followup_dt",
          followup_dt,
          "assignto_id",
          user_id,
          "lreq_id",
          lead_id,
        ],
        (err, result) => {
          if (err) {
            console.log(err);
          } else {
            res.send("lead followup date updated");
          }
          connection.release();
        }
      );
    });
  }
});

LeadRouter.post("/editleaddate", (req, res) => {
  const followup_dt = req.body.followup_dt;
  const user_id = req.session.user[0].u_id;
  const lead_id = req.body.lid;
  const user_role = req.session.user[0].urole;
  const followup = req.body.followup;

  if (user_role === "Master" || user_role === "Admin") {
    pool.getConnection(function (error, connection) {
      if (error) {
        throw error;
      }
      connection.query(
        "UPDATE crm_lead_primary_details SET ?? = ?, ?? = ? WHERE ?? = ?",
        ["followup", followup, "followup_dt", followup_dt, "l_id", lead_id],
        (err, result) => {
          if (err) {
            console.log(err);
          } else {
            res.send("lead followup date updated");
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
        "UPDATE crm_lead_req_details SET ?? = ?, ?? = ? WHERE ?? = ? AND ?? = ?",
        [
          "followup",
          followup,
          "followup_dt",
          followup_dt,
          "assignto_id",
          user_id,
          "lreq_id",
          lead_id,
        ],
        (err, result) => {
          if (err) {
            console.log(err);
          } else {
            res.send("lead followup date updated");
          }
          connection.release();
        }
      );
    });
  }
});

// LeadRouter.post("/setclick", (req, res) => {
//   const user_id = req.session.user[0].u_id;
//   const lead_id = req.body.lid;
//   const user_role = req.session.user[0].urole;

//   pool.getConnection(function (error, connection) {
//     if (error) {
//       throw error;
//     }
//     if (req.body.lid.imported) {
//       if (user_role === "Master" || user_role === "Admin") {
//         connection.query(
//           "UPDATE crm_lead_primary_details SET ?? = ? WHERE ?? = ?",
//           ["clicked", 2, "l_id", req.body.lid.l_id],
//           (err, result) => {
//             if (err) {
//               console.log("Error updating crm_lead_primary_details:", err);
//               return connection.rollback(() => {
//                 throw err;
//               });
//             }

//             connection.commit((err) => {
//               if (err) {
//                 console.log("Error committing transaction:", err);
//                 return connection.rollback(() => {
//                   throw err;
//                 });
//               }
//               res.send("click edited");
//               connection.release();
//             });
//           }
//         );
//       } else {
//         connection.query(
//           "Select l_id from crm_lead_req_details where lreq_id = ?",
//           [req.body.lid.l_id],
//           (err, result) => {
//             if (err) {
//               console.log("Error updating crm_lead_req_details:", err);
//               return connection.rollback(() => {
//                 throw err;
//               });
//             }
//             const l_id = result[0].l_id;

//             connection.query(
//               "UPDATE crm_lead_req_details SET ?? = ? WHERE ?? = ? AND ?? = ?",
//               [
//                 "clicked",
//                 2,
//                 "lreq_id",
//                 req.body.lid.l_id,
//                 "assignto_id",
//                 user_id,
//               ],
//               (err, result) => {
//                 if (err) {
//                   console.log("Error updating crm_lead_req_details:", err);
//                   return connection.rollback(() => {
//                     throw err;
//                   });
//                 }

//                 // Update crm_lead_primary_details for the master/admin
//                 connection.query(
//                   "UPDATE crm_lead_primary_details SET ?? = ? WHERE ?? = ?",
//                   ["clicked", 2, "l_id", l_id],
//                   (err, result) => {
//                     if (err) {
//                       console.log(
//                         "Error updating crm_lead_primary_details:",
//                         err
//                       );
//                       return connection.rollback(() => {
//                         throw err;
//                       });
//                     }

//                     connection.commit((err) => {
//                       if (err) {
//                         console.log("Error committing transaction:", err);
//                         return connection.rollback(() => {
//                           throw err;
//                         });
//                       } else {

//                       }
//                       res.send("click edited");
//                       connection.release();
//                     });
//                   }
//                 );
//               }
//             );
//           }
//         );
//       }
//     } else {
//       connection.beginTransaction((err) => {
//         if (err) throw err;

//         if (user_role === "Master" || user_role === "Admin") {
//           connection.query(
//             "UPDATE crm_lead_primary_details SET ?? = ? WHERE ?? = ?",
//             ["clicked", 1, "l_id", lead_id],
//             (err, result) => {
//               if (err) {
//                 console.log("Error updating crm_lead_primary_details:", err);
//                 return connection.rollback(() => {
//                   throw err;
//                 });
//               }

//               connection.commit((err) => {
//                 if (err) {
//                   console.log("Error committing transaction:", err);
//                   return connection.rollback(() => {
//                     throw err;
//                   });
//                 }
//                 res.send("click edited");
//                 connection.release();
//               });
//             }
//           );
//         } else {
//           // Update crm_lead_req_details for the user
//           connection.query(
//             "Select * from crm_lead_req_details where lreq_id = ?",
//             [lead_id],
//             (err, result) => {
//               if (err) {
//                 console.log("Error updating crm_lead_req_details:", err);
//                 return connection.rollback(() => {
//                   throw err;
//                 });
//               }
//               const l_id = result[0].l_id;

//               connection.query(
//                 "UPDATE crm_lead_req_details SET ?? = ? WHERE ?? = ? AND ?? = ?",
//                 ["clicked", 1, "lreq_id", lead_id, "assignto_id", user_id],
//                 (err, result) => {
//                   if (err) {
//                     console.log("Error updating crm_lead_req_details:", err);
//                     return connection.rollback(() => {
//                       throw err;
//                     });
//                   }

//                   console.log(
//                     "crm_lead_req_details updated successfully:",
//                     result
//                   );

//                   // Update crm_lead_primary_details for the master/admin
//                   connection.query(
//                     "UPDATE crm_lead_primary_details SET ?? = ? WHERE ?? = ?",
//                     ["clicked", 1, "l_id", l_id],
//                     (err, result) => {
//                       if (err) {
//                         console.log(
//                           "Error updating crm_lead_primary_details:",
//                           err
//                         );
//                         return connection.rollback(() => {
//                           throw err;
//                         });
//                       }

//                       console.log(
//                         "crm_lead_primary_details updated successfully:",
//                         result
//                       );

//                       connection.commit((err) => {
//                         if (err) {
//                           console.log("Error committing transaction:", err);
//                           return connection.rollback(() => {
//                             throw err;
//                           });
//                         }
//                         res.send("click edited");
//                         connection.release();
//                       });
//                     }
//                   );
//                 }
//               );
//             }
//           );
//         }
//       });
//     }
//   });
// });

LeadRouter.post("/setclick", (req, res) => {
  const user_id = req.session.user[0].u_id;
  const lead_id = req.body.lid;
  const user_role = req.session.user[0].urole;
  const isMasterOrAdmin = user_role === "Master" || user_role === "Admin";

  pool.getConnection((error, connection) => {
    if (error) throw error;

    const updatePrimaryDetails = (clickedValue, leadId, callback) => {
      connection.query(
        "UPDATE crm_lead_primary_details SET clicked = ? WHERE l_id = ?",
        [clickedValue, leadId],
        callback
      );
    };

    const updateReqDetails = (clickedValue, leadReqId, userId, callback) => {
      connection.query(
        "UPDATE crm_lead_req_details SET clicked = ? WHERE lreq_id = ? AND assignto_id = ?",
        [clickedValue, leadReqId, userId],
        callback
      );
    };

    const handleTransactionError = (err) => {
      console.log("Transaction error:", err);
      connection.rollback(() => {
        throw err; // The correct placement of the throw statement
      });
    };

    const commitTransaction = () => {
      connection.commit((err) => {
        if (err) {
          handleTransactionError(err);
        } else {
          res.send("Click updated successfully");
          connection.release();
        }
      });
    };

    const handleImportedLead = () => {
      if (isMasterOrAdmin) {
        updatePrimaryDetails(2, lead_id.l_id, (err) => {
          if (err) return handleTransactionError(err);
          commitTransaction();
        });
      } else {
        connection.query(
          "SELECT l_id FROM crm_lead_req_details WHERE lreq_id = ?",
          [lead_id.l_id],
          (err, result) => {
            if (err) return handleTransactionError(err);

            const l_id = result[0].l_id;

            updateReqDetails(2, lead_id.l_id, user_id, (err) => {
              if (err) return handleTransactionError(err);

              updatePrimaryDetails(2, l_id, (err) => {
                if (err) return handleTransactionError(err);
                commitTransaction();
              });
            });
          }
        );
      }
    };

    const handleNonImportedLead = () => {
      connection.beginTransaction((err) => {
        if (err) throw err;

        if (isMasterOrAdmin) {
          updatePrimaryDetails(1, lead_id, (err) => {
            if (err) return handleTransactionError(err);
            commitTransaction();
          });
        } else {
          connection.query(
            "SELECT l_id FROM crm_lead_req_details WHERE lreq_id = ?",
            [lead_id],
            (err, result) => {
              if (err) return handleTransactionError(err);

              const l_id = result[0].l_id;

              updateReqDetails(1, lead_id, user_id, (err) => {
                if (err) return handleTransactionError(err);

                updatePrimaryDetails(1, l_id, (err) => {
                  if (err) return handleTransactionError(err);
                  commitTransaction();
                });
              });
            }
          );
        }
      });
    };

    req.body.lid.imported ? handleImportedLead() : handleNonImportedLead();
  });
});

LeadRouter.post("/createLeadHistory", (req, res) => {
  const user_id = req.session.user[0].u_id;
  const current_date = dayjs().format("YYYY-MM-DD");

  pool.getConnection(function (error, connection) {
    if (error) {
      throw error;
    }
    connection.query(
      "INSERT INTO `crm_lead_history`(??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??) VALUES (?,?,?,?,?,?,?,?,?,?,?)",
      [
        "l_id",
        "u_id",
        "create_dt",
        "update_dt",
        "status",
        "lname",
        "p_mob",
        "pname",
        "comments",
        "followup",
        "followup_dt",
        req.body.lid,
        user_id,
        current_date,
        current_date,
        req.body.status,
        req.body.name,
        req.body.number,
        req.body.pname,
        req.body.comments,
        req.body.followup,
        req.body.followupdt,
      ],
      (err, result) => {
        if (err) {
          res.send(err);
          console.log(err);
        } else {
          res.send("success");
        }
      }
    );

    connection.release();
  });
});

// LeadRouter.post('/getSearch', (req, res) => {
//   const user_id = req.session.user[0].u_id;
//   const limit = req.body.limit;
//   const page = req.body.page;
//   const user_role = req.session.user[0].urole;

//   pool.getConnection(function (error, connection) {
//     if (error) {
//       throw error;
//     }
//     if (user_role === 'Master' || user_role === 'Admin') {
//       connection.query(
//         "SELECT crm_lead_primary_details.l_id ,crm_lead_primary_details.create_dt, crm_lead_primary_details.lname, crm_lead_primary_details.status, crm_lead_primary_details.pname, crm_lead_primary_details.source, crm_lead_status.color FROM crm_lead_primary_details LEFT JOIN crm_lead_status ON crm_lead_primary_details.status = crm_lead_status.status WHERE (crm_lead_primary_details.lname LIKE ?)  AND (crm_lead_primary_details.status != 'Broker') AND (crm_lead_primary_details.status != 'Dead') AND (crm_lead_primary_details.status != 'Booking Done') AND (crm_lead_primary_details.status != 'Wrong Number')  ORDER BY crm_lead_primary_details.l_id DESC LIMIT ? ",
//         ['%' + req.body.search + '%', limit],
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
//     } else {
//       connection.query(
//         "SELECT crm_lead_req_details.lreq_id AS l_id, crm_lead_req_details.l_id AS assignlead_id,crm_lead_primary_details.create_dt, crm_lead_primary_details.lname, crm_lead_req_details.status, crm_lead_primary_details.pname, crm_lead_primary_details.source, crm_lead_status.color FROM crm_lead_req_details JOIN crm_lead_primary_details ON crm_lead_primary_details.l_id = crm_lead_req_details.l_id LEFT JOIN crm_lead_status ON crm_lead_req_details.status = crm_lead_status.status WHERE (crm_lead_req_details.assignto_id = ?) AND (crm_lead_primary_details.lname LIKE ?)  AND (crm_lead_req_details.status != 'Broker') AND (crm_lead_req_details.status != 'Dead') AND (crm_lead_req_details.status != 'Booking Done') AND (crm_lead_req_details.status != 'Wrong Number')  ORDER BY crm_lead_req_details.lreq_id DESC LIMIT ? ",
//         [user_id, '%' + req.body.search + '%', limit],
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
//     }
//   });
// });

LeadRouter.post("/getSearchTest", (req, res) => {
  const user_id = req.session.user[0].u_id;
  const limit = req.body.limit;
  const page = req.body.page * limit;
  const user_role = req.session.user[0].urole;

  pool.getConnection(function (error, connection) {
    if (error) {
      throw error;
    }
    if (user_role === "Master" || user_role === "Admin") {
      connection.query(
        "SELECT lpd.l_id,lpd.create_dt,lpd.lname, lpd.status, lpd.pname, lpd.source, ls.color,(SELECT clh.status FROM crm_lead_history AS clh WHERE clh.l_id = lpd.l_id ORDER BY clh.update_dt DESC LIMIT 1) AS latest_status,(SELECT ls.color FROM crm_lead_history AS clh  LEFT JOIN crm_lead_status AS ls ON clh.status = ls.status WHERE clh.l_id = lpd.l_id ORDER BY clh.update_dt DESC LIMIT 1) AS latest_status_color,(SELECT cu.username FROM crm_lead_history AS clh LEFT JOIN crm_users AS cu ON clh.u_id = cu.u_id WHERE clh.l_id = lpd.l_id ORDER BY clh.update_dt DESC LIMIT 1) AS latest_username,lpd.followup_dt,lpd.followup, lpd.identity FROM crm_lead_primary_details AS lpd LEFT JOIN crm_lead_status AS ls ON lpd.status = ls.status WHERE lpd.lname LIKE ? ORDER BY lpd.l_id DESC LIMIT ? OFFSET ?",
        ["%" + req.body.search + "%", limit, page],
        (err, result) => {
          if (err) {
            console.log("error", err);
          }
          if (result.length > 0) {
            res.send(result);
          } else {
            res.send("No Data Found");
          }
          connection.release();
        }
      );
    } else {
      connection.query(
        "SELECT crm_lead_req_details.lreq_id AS l_id, crm_lead_req_details.l_id AS assignlead_id,crm_lead_primary_details.create_dt, crm_lead_primary_details.lname, crm_lead_req_details.status, crm_lead_primary_details.pname, crm_lead_primary_details.source, crm_lead_status.color FROM crm_lead_req_details JOIN crm_lead_primary_details ON crm_lead_primary_details.l_id = crm_lead_req_details.l_id LEFT JOIN crm_lead_status ON crm_lead_req_details.status = crm_lead_status.status WHERE (crm_lead_req_details.assignto_id = ?) AND (crm_lead_primary_details.lname LIKE ?)  AND (crm_lead_req_details.status != 'Broker') AND (crm_lead_req_details.status != 'Dead') AND (crm_lead_req_details.status != 'Booking Done') AND (crm_lead_req_details.status != 'Wrong Number')  ORDER BY crm_lead_req_details.lreq_id DESC LIMIT ? ",
        [user_id, "%" + req.body.search + "%", limit],
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
    }
  });
});

LeadRouter.post("/getSearchCount", (req, res) => {
  const user_id = req.session.user[0].u_id;
  const user_role = req.session.user[0].urole;

  pool.getConnection(function (error, connection) {
    if (error) {
      throw error;
    }
    if (user_role === "Master" || user_role === "Admin") {
      connection.query(
        "SELECT COUNT(crm_lead_primary_details.l_id) AS searchcount FROM crm_lead_primary_details WHERE (crm_lead_primary_details.lname LIKE ?)  AND (crm_lead_primary_details.status != 'Broker') AND (crm_lead_primary_details.status != 'Dead') AND (crm_lead_primary_details.status != 'Booking Done') AND (crm_lead_primary_details.status != 'Wrong Number') ",
        ["%" + req.body.search + "%"],
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
    } else {
      connection.query(
        "SELECT COUNT(crm_lead_req_details.lreq_id) AS searchcount FROM crm_lead_req_details JOIN crm_lead_primary_details ON crm_lead_primary_details.l_id = crm_lead_req_details.l_id WHERE (crm_lead_req_details.assignto_id = ?) AND (crm_lead_primary_details.lname LIKE ?)  AND (crm_lead_req_details.status != 'Broker') AND (crm_lead_req_details.status != 'Dead') AND (crm_lead_req_details.status != 'Booking Done') AND (crm_lead_req_details.status != 'Wrong Number') ",
        [user_id, "%" + req.body.search + "%"],
        (err, result) => {
          if (err) {
            console.log(err);
          }
          if (result.length > 0) {
            res.json(result);
          } else {
            res.json({ message: "No Data Found" });
          }
          connection.release();
        }
      );
    }
  });
});

LeadRouter.post("/get-team-wise-lead-table-data", (req, res) => {
  //const user_id = req.session.user[0].u_id;
  const user_id = req.session.user[0].u_id;
  const user_role = req.session.user[0].urole;
  const lead_id = req.body.lid;
  const lead_status = req.body.status;

  if (user_role === "Master" || user_role === "Admin") {
    pool.getConnection(function (error, connection) {
      if (error) {
        throw error;
      }
      connection.query(
        "SELECT lpd.l_id AS l_id, lrd.lreq_id AS assignlead_id, GROUP_CONCAT(cu.username) AS assign_users, lpd.create_dt, lpd.lname, CONCAT(lpd.p_ccode, ' ', lpd.p_mob) AS mobile, lpd.p_ccode, lpd.p_mob, lpd.p_email, lpd.status as admin_status, GROUP_CONCAT(lrd.status,' - ', cu.username) AS users_status,lrd.pname, lrd.followup, lrd.followup_dt, lpd.source, lrd.city, lrd.locality, lrd.sub_locality, lrd.comments, ls.color, lrd.clicked, lpd.source_type, lrd.service_type, lrd.ptype, lrd.pcategory, lrd.pconfiguration, lrd.min_area, lrd.max_area, lrd.area_unit, lrd.min_price, lrd.max_price, lrd.price_unit, lrd.country, lrd.state, lrd.other_details,  lrd.assign_status FROM crm_lead_primary_details AS lpd LEFT JOIN crm_lead_req_details AS lrd ON lrd.l_id = lpd.l_id LEFT JOIN crm_lead_status AS ls ON ls.status = lrd.status LEFT JOIN crm_users AS cu ON cu.u_id = lrd.assignto_id WHERE lpd.l_id != '' AND lrd.assignto_id = ? AND lrd.status = ? GROUP BY lrd.lreq_id ORDER BY lrd.lreq_id DESC",
        [lead_id, lead_status],
        (err, result) => {
          if (err) {
            res.send(err);
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

// for ES5
module.exports = LeadRouter;
