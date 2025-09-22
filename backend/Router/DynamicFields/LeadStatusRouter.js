// for ES5
const express = require("express");
const pool = require("../../Database.js");

const LeadStatusRouter = express.Router();

LeadStatusRouter.post("/get-all-lead-status", (req, res) => {
  // Define an array to hold the columns to be selected
  let columns;
  // Check if the 'columns' parameter is provided in the request body
  if (req.body.columns === undefined) {
    // If not provided, use default columns
    columns = ["ls_id as id", "create_dt", "update_dt", "status", "color"];
  } else {
    // If provided, split the comma-separated string and trim each element
    columns = req.body.columns;
  }
  // Acquire a database connection
  pool.getConnection(function (error, connection) {
    if (error) throw error;
    // Use a template literal to dynamically create the SQL query
    const query = `SELECT ${columns.join(", ")} FROM crm_lead_status`;
    // Execute the SQL query
    connection.query(query, (err, result) => {
      if (err) {
        console.log(err);
      } else {
        // Send the query result as a JSON response
        res.json(result);
      }
      // Release the database connection
      connection.release();
    });
  });
});

LeadStatusRouter.post('/updateBrokerStatus', (req, res) => {
  const { brk_id, broker_status, re_meet_status } = req.body;
  console.log(req.body, "req.body");

  let status = broker_status; // Start with the broker status
  if (broker_status === 'Re-Meet') {
    status += `, ${re_meet_status}`; // Append the re-meet status if applicable
  }

  // Acquire a database connection
  pool.getConnection(function (error, connection) {
    if (error) {
      console.error('Database connection error:', error);
      return res.status(500).json({ error: 'Database connection error' });
    }

    // Construct the SQL query to update the status
    const query = `UPDATE crm_broker_details SET status = ? WHERE brk_id = ?`;
    connection.query(query, [status, brk_id], (err, result) => {
      if (err) {
        console.error('Error executing query:', err);
        return res.status(500).json({ error: 'Error executing query' });
      }

      // Send a success response
      res.json({ message: 'Broker status updated successfully' });
      // Release the database connection
      connection.release();
    });
  });
});




LeadStatusRouter.post("/get-undefined-lead-status-count", async (req, res) => {
  if (
    req.session.user[0].urole === "Master" ||
    req.session.user[0].urole === "Admin"
  ) {
    pool.getConnection(function (error, connection) {
      if (error) throw error;
      connection.query(
        "SELECT COUNT(l_id) AS statuslead_count FROM crm_lead_primary_details WHERE status = ?",
        [""],
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
      if (error) throw error;
      connection.query(
        "SELECT COUNT(lreq_id) AS statuslead_count FROM crm_lead_req_details WHERE ?? = ? AND (status = ?)",
        ["assignto_id", req.session.user[0].u_id, ""],
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

LeadStatusRouter.post(
  "/get-user-undefined-lead-status-count",
  async (req, res) => {
    if (
      req.session.user[0].urole === "Master" ||
      req.session.user[0].urole === "Admin"
    ) {
      pool.getConnection(function (error, connection) {
        if (error) throw error;
        connection.query(
          "SELECT COUNT(DISTINCT l_id) AS statuslead_count FROM crm_lead_req_details WHERE status = ?",
          [""],
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
        if (error) throw error;
        connection.query(
          "SELECT COUNT(lreq_id) AS statuslead_count FROM crm_lead_req_details WHERE ?? = ? AND (status = ?)",
          ["assignto_id", req.session.user[0].u_id, ""],
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
  }
);

LeadStatusRouter.post("/update-lead-status", (req, res) => {
  pool.getConnection(function (error, connection) {
    if (error) throw error;
    connection.beginTransaction(function (err) {
      if (err) {
        throw err;
      }
      connection.query(
        "UPDATE crm_lead_status SET ?? = ?, ?? = ? WHERE ?? = ?",
        [
          "status",
          req.body.updated_lead_status,
          "color",
          req.body.color_code,
          "status",
          req.body.old_lead_status,
        ],
        (err, result1) => {
          if (err) {
            return connection.rollback(function () {
              res.send("Error updating lead status");
            });
          }
          connection.query(
            "UPDATE crm_lead_primary_details SET ?? = ? WHERE ?? = ?",
            [
              "status",
              req.body.updated_lead_status,
              "status",
              req.body.old_lead_status,
            ],
            (err, result2) => {
              if (err) {
                return connection.rollback(function () {
                  res.send("Error updating lead table.");
                });
              }

              connection.query(
                "UPDATE crm_lead_req_details SET ?? = ? WHERE ?? = ?",
                [
                  "status",
                  req.body.updated_lead_status,
                  "status",
                  req.body.old_lead_status,
                ],
                (err, result2) => {
                  if (err) {
                    return connection.rollback(function () {
                      res.send("Error updating user lead table.");
                    });
                  }

                  connection.commit(function (err) {
                    if (err) {
                      return connection.rollback(function () {
                        throw err;
                      });
                    }
                    res.send("Lead status has been update successfully");
                    connection.release();
                  });
                }
              );
            }
          );
        }
      );
    });
  });
});

LeadStatusRouter.post("/add-lead-status", (req, res) => {
  pool.getConnection(function (error, connection) {
    if (error) throw error;
    connection.query(
      "INSERT INTO crm_lead_status (??, ??, ??, ??) VALUES(?, ?, ?, ?)",
      [
        "create_dt",
        "update_dt",
        "status",
        "color",
        req.body.DateTime,
        req.body.DateTime,
        req.body.lead_status,
        req.body.color_code,
      ],
      (err, result) => {
        if (err) {
          res.send("Duplicate Status name can't be added");
          console.log(err);
        } else {
          res.send("Lead Status Added Successfully");
        }
        connection.release();
      }
    );
  });
});

LeadStatusRouter.post("/delete-lead-status", (req, res) => {
  pool.getConnection(function (error, connection) {
    if (error) throw error;
    connection.query(
      "DELETE FROM crm_lead_status WHERE ?? = ?",
      ["status", Array.isArray(req.body.data) ? req.body.data[0].status : req.body.data],
      (err, result) => {
        if (err) {
          console.log(err);
        } else {
          pool.getConnection(function (error, connection) {
            if (error) throw error;
            connection.query(
              "UPDATE crm_lead_primary_details SET ?? = ? WHERE ?? = ?",
              ["status", "", "status", req.body.data[0].status],
              (err, result) => {
                if (err) {
                  console.log(err);
                } else {
                  pool.getConnection(function (error, connection) {
                    if (error) throw error;
                    connection.query(
                      "UPDATE crm_lead_req_details SET ?? = ? WHERE ?? = ?",
                      ["status", "", "status", req.body.data[0].status],
                      (err, result) => {
                        if (err) {
                          console.log(err);
                        } else {
                          res.send("Lead Status Deleted Successfully");
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
        connection.release();
      }
    );
  });
});

// for ES5
module.exports = LeadStatusRouter;
