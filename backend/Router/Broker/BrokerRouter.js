// for ES5
const express = require("express");
const multer = require("multer");
const pool = require("../../Database.js");
const path = require("path");
const fs = require('fs');
const dayjs = require("dayjs");
const utc = require("dayjs/plugin/utc");
const timezone = require("dayjs/plugin/timezone");

dayjs.extend(utc);
dayjs.extend(timezone);

const DubaiDateTime = new Date().toLocaleString("en-US", {
  timeZone: "Asia/Dubai",
});

const BrokerRouter = express.Router();

// Set up multer for file storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/broker/"); // Specify the upload directory
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`); // Create a unique filename
  },
});

const upload = multer({ storage: storage });

function formatDate(dateString) {
  try {
    const parts = dateString.match(
      /(\d{1,2})[/-](\d{1,2})[/-](\d{2,4}) (\d{1,2}):(\d{1,2})/
    );

    if (!parts) {
      return "0000-00-00 00:00:00";
    }

    const [, day, month, year, hours, minutes] = parts;

    // Note: months are 0-indexed in JavaScript Date objects
    const date = new Date(Date.UTC(year, month - 1, day, hours, minutes));
    if (isNaN(date.getTime())) {
      throw new Error(
        `Invalid date components: ${year}, ${month}, ${day}, ${hours}, ${minutes}`
      );
    }

    return date.toISOString().slice(0, 19).replace("T", " ");
  } catch (error) {
    console.log("error occured", error);
    return "0000-00-00 00:00:00";
  }
}

BrokerRouter.post("/get-all-broker", (req, res) => {
  // Define an array to hold the columns to be selected
  let columns;

  // Check if the 'columns' parameter is provided in the request body
  if (req.body.columns === undefined) {
    // If not provided, use default columns
    columns = [
      "brk_id as id",
      "u_id",
      "create_dt",
      "update_dt",
      "name",
      "email",
      "ccode",
      "mob",
      "company",
      "rera_no",
      "country",
      "state",
      "city",
      "locality",
      "sublocality",
      "address",
      "remark",
    ];
  } else {
    // If provided, split the comma-separated string and trim each element
    columns = req.body.columns;
  }
  // Acquire a database connection
  pool.getConnection(function (error, connection) {
    if (error) throw error;
    // Use a template literal to dynamically create the SQL query
    const query = `SELECT ${columns.join(", ")} FROM crm_broker_details`;
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

BrokerRouter.post("/edit-broker", upload.single("document"), (req, res) => {
  const { data, DateTime } = req.body; // Extract DateTime and data fields from the request body
  const parsedData = JSON.parse(data); // Parse the JSON string to an object
  const file = req.file; // Access the uploaded file, if any

  // Database connection
  pool.getConnection(function (error, connection) {
    if (error) throw error;

    // First, fetch the current broker details to get the previous document path
    connection.query(
      "SELECT document FROM crm_broker_details WHERE brk_id = ?",
      [parsedData.b_brk_id],
      (err, result) => {
        if (err) {
          console.log(err);
          return res.status(500).send("Error fetching broker details");
        }

        let previousDocumentPath = ""; // Previous document path

        // Get the previous document path if it exists
        if (result.length > 0) {
          previousDocumentPath = result[0].document;
        }

        // If file is uploaded, delete the previous file
        if (file && previousDocumentPath) {
          const fullPath = path.join(
            __dirname,
            "uploads",
            "broker",
            previousDocumentPath
          );
          fs.unlink(fullPath, (err) => {
            if (err) {
              console.error("Failed to delete the previous file:", err);
              // Continue even if file deletion fails
            }
          });
        }

        // Prepare the SQL query and parameters
        let updateQuery =
          "UPDATE crm_broker_details SET update_dt = ?, name = ?, email = ?, ccode = ?, mob = ?, company = ?, rera_no = ?, brk_location = ?, address = ?, remark = ?";
        let queryParams = [
          DateTime,
          parsedData.b_name,
          parsedData.b_email,
          parsedData.b_ccode,
          parsedData.b_mob,
          parsedData.b_company,
          parsedData.b_rera_no,
          parsedData.brk_location,
          parsedData.b_address,
          parsedData.b_remark,
        ];

        // If a file is uploaded, include the document field in the update query
        if (file) {
          updateQuery += ", document = ?";
          queryParams.push(file.filename); // Add the filename to query params
        }

        updateQuery += " WHERE brk_id = ?"; // Add condition for broker ID
        queryParams.push(parsedData.b_brk_id); // Add broker ID to query params

        // Execute the update query
        connection.query(updateQuery, queryParams, (err, result) => {
          if (err) {
            console.log(err);
            res.status(500).send("Error updating broker details");
          } else {
            res.send("Broker Details Updated Successfully");
          }
          connection.release(); // Release the connection after query
        });
      }
    );
  });
});

BrokerRouter.post("/add-broker", upload.single("document"), (req, res) => {
  const userId = req.session.user[0].u_id;
  try {
    const { data, DateTime } = req.body; // Extract DateTime and data fields from the request body
    const parsedData = JSON.parse(data); // Parse the JSON string to an object

    // Access the uploaded file, if any
    const file = req.file;

    // If no file is uploaded, handle it gracefully
    const documentPath = file ? file.path : null;

    // Append the file path and timestamp to the broker data
    parsedData.documentPath = documentPath;
    parsedData.submissionDateTime = DateTime; // Add the submission timestamp

    pool.getConnection(function (error, connection) {
      if (error) throw error;

      const sql =
        "INSERT INTO crm_broker_details (u_id, create_dt, update_dt, name, email, ccode, mob, company, rera_no, brk_location, address, remark, document) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

      connection.query(
        sql,
        [
          userId,
          dayjs(DubaiDateTime).format("YYYY-MM-DD HH:mm:ss"),
          dayjs(DubaiDateTime).format("YYYY-MM-DD HH:mm:ss"),
          parsedData.b_name,
          parsedData.b_email,
          parsedData.b_ccode,
          parsedData.mob,
          parsedData.b_company,
          parsedData.b_rera_no,
          parsedData.brk_location,
          parsedData.address,
          parsedData.b_remark,
          file ? file.filename : "", // Store file name only if the file is present
        ],
        (err, result) => {
          if (err) {
            console.log(err);
            res.status(500).json({ error: "Failed to add broker details" });
          } else {
            res.json("Broker Details Added Successfully");
          }
          connection.release();
        }
      );
    });
  } catch (error) {
    console.error("Error adding broker:", error);
    res.status(500).send("Error adding broker details.");
  }
});

BrokerRouter.post("/get-broker-history", (req, res) => {
  pool.getConnection(function (error, connection) {
    if (error) {
      console.error("Error getting connection: ", error);
      return res.status(500).send("Error connecting to database");
    }

    const query = `
    SELECT 
    bh.bh_id, 
    bh.created_dt, 
    bh.created_by, 
    bh.brk_id, 
    bh.status, 
    bh.broker_meet_status,
    bh.comment, 
    u.username 
  FROM 
    crm_broker_history bh 
  JOIN 
    crm_users u ON bh.created_by = u.u_id 
  WHERE 
    bh.brk_id = ?
  ORDER BY 
    bh.created_dt DESC;
    `;

    connection.query(query, [req.body.brk_id], (err, result) => {
      connection.release();

      if (err) {
        console.error("Error executing query: ", err);
        return res.status(500).send("Error fetching broker history");
      }

      return res.send(result);
    });
  });
});

BrokerRouter.get("/get-broker-details-table-data", (req, res) => {
  const user_role = req.session.user[0].urole;
  const user_id = req.session.user[0].u_id;
  const { page, pageSize } = req.query;
  const offset = (page - 1) * pageSize;
  const limit = parseInt(pageSize);

  if (user_role === "Master" || user_role === "Admin") {
    pool.getConnection(function (error, connection) {
      if (error) throw error;
      connection.query(
        `SELECT 
        crm_broker_details.brk_id,
        crm_broker_details.u_id,
        crm_broker_details.brk_location,
        crm_broker_details.create_dt,
        crm_broker_details.update_dt,
        crm_broker_details.name,
        crm_broker_details.email,
        crm_broker_details.ccode,
        crm_broker_details.mob,
        CONCAT(crm_broker_details.ccode, ' ', crm_broker_details.mob) AS mobile,
        crm_broker_details.company,
        crm_broker_details.rera_no, 
        crm_broker_details.address,
        crm_broker_details.remark,
        crm_broker_details.document,
        crm_broker_details.status,
        crm_broker_details.broker_meet_status,
        crm_users.username AS createdby,
        (SELECT COUNT(lpd.l_id) 
         FROM crm_lead_primary_details AS lpd 
         WHERE lpd.brk_id = crm_broker_details.brk_id) AS totalCount
       FROM crm_broker_details
       LEFT JOIN crm_users ON crm_users.u_id = crm_broker_details.u_id
       ORDER BY crm_broker_details.brk_id DESC
       LIMIT ? OFFSET ?`,
        [limit, offset],
        (err, result) => {
          if (err) {
            console.log(err);
            res
              .status(500)
              .send("An error occurred while fetching broker details.");
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
        `SELECT 
        crm_broker_details.brk_id,
        crm_broker_details.u_id,
        crm_broker_details.brk_location,
        crm_broker_details.create_dt,
        crm_broker_details.update_dt,
        crm_broker_details.name,
        crm_broker_details.email,
        crm_broker_details.ccode,
        crm_broker_details.mob,
        CONCAT(crm_broker_details.ccode, ' ', crm_broker_details.mob) AS mobile,
        crm_broker_details.company,
        crm_broker_details.rera_no, 
        crm_broker_details.address,
        crm_broker_details.remark,
        crm_broker_details.document,
        crm_broker_details.status,
        crm_users.username AS createdby,
        (SELECT COUNT(lpd.l_id) 
         FROM crm_lead_primary_details AS lpd 
         WHERE lpd.brk_id = crm_broker_details.brk_id) AS totalCount
       FROM crm_broker_details
       LEFT JOIN crm_users ON crm_users.u_id = crm_broker_details.u_id
       WHERE crm_broker_details.u_id = ?
       ORDER BY crm_broker_details.brk_id DESC
       LIMIT ? OFFSET ?`,
        [user_id, limit, offset],
        (err, result) => {
          if (err) {
            console.log(err);
            res
              .status(500)
              .send("An error occurred while fetching broker details.");
          } else {
            res.json(result);
          }
          connection.release();
        }
      );
    });
  }

});

BrokerRouter.post("/get-broker-details-table-data-count", (req, res) => {
  const user_role = req.session.user[0].urole;
  const user_id = req.session.user[0].u_id;
  if (user_role !== "" || user_role === "Master" || user_role === "Admin") {
    pool.getConnection(function (error, connection) {
      if (error) throw error;
      connection.query(
        "SELECT COUNT(`brk_id`) AS totalCount FROM `crm_broker_details`",
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
  } else {
    pool.getConnection(function (error, connection) {
      if (error) throw error;
      connection.query(
        "SELECT COUNT(`brk_id`) AS totalCount FROM `crm_broker_details` WHERE ?? = ?",
        ["u_id", user_id],
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
  }
});

BrokerRouter.post("/delete-selected-broker", (req, res) => {
  const brkid = req.body.brk_id;
  const brk_id = brkid.map((entry) => entry.brk_id);
  pool.getConnection(function (error, connection) {
    if (error) throw error;
    connection.query(
      "DELETE FROM crm_broker_details WHERE ?? IN (?) ",
      ["brk_id", brk_id],
      (err, result) => {
        if (err) {
          console.log(err);
        } else {
          res.send("Broker Details Deleted Successfully");
        }
        connection.release();
      }
    );
  });
});


BrokerRouter.post("/get-broker-details", (req, res) => {
  pool.getConnection(function (error, connection) {
    if (error) {
      console.error("Error getting connection: ", error);
      return res.status(500).send("Error connecting to database");
    }

    const query = `SELECT  *  FROM crm_broker_details WHERE brk_id = ? `;

    connection.query(query, [req.body.brk_id], (err, result) => {
      connection.release();

      if (err) {
        console.error("Error executing query: ", err);
        return res.status(500).send("Error fetching broker history");
      }

      return res.send(result);
    });
  });
});



BrokerRouter.post("/edit-broker-mobile", (req, res) => {
    const base64Data = req.body.data.document;

    let fileName = ""; // Initialize fileName to an empty string
    let uploadedFilePath; // Declare uploadedFilePath

    if (base64Data) {
        // Ensure it's a string before splitting
        if (typeof base64Data === 'string') {
            const base64Image = base64Data.split(';base64,').pop();
            fileName = `${Date.now()}-uploadedFile.jpg`; // Change the extension based on the file type
            const filePath = path.join(__dirname, './../../uploads/broker/', fileName);

            // Write the file to the uploads directory
            fs.writeFile(filePath, base64Image, { encoding: 'base64' }, (err) => {
                if (err) {
                    console.error("File write error:", err);
                    return res.status(500).send("Error saving the document.");
                }
                uploadedFilePath = filePath; // Save the file path for database insertion
            });
        } else {
            console.error('Invalid Base64 data: not a string');
            return res.status(400).send("Invalid Base64 data");
        }
    }


    
    const DateTime = req.body.data.DateTime || new Date().toISOString();

    // Database connection
    pool.getConnection(function (error, connection) {
        if (error) {
            console.error("Error getting connection:", error);
            return res.status(500).send("Database connection error");
        }

       connection.query("SELECT document FROM crm_broker_details WHERE brk_id = ?", [req.body.data.b_brk_id], (err, result) => {
        if (err) {
          console.error(err);
          return res.status(500).send("Error retrieving the broker document.");
        }

        let existingFileName = result[0]?.document || ""; // Preserve old file name if no new file is uploaded

        // Delete the old file if it exists and is not empty
        if (fileName && existingFileName) {
          const oldFilePath = path.join(__dirname, './../../uploads/broker/', existingFileName);
          fs.unlink(oldFilePath, (err) => {
            if (err) {
              console.error("Error deleting old file:", err);
              return res.status(500).send("Error deleting old document.");
            }
            console.log("Old file deleted successfully.");
          });
        }

        // Update the database
        connection.query(
                          "UPDATE crm_broker_details  SET update_dt = ?, name = ?, email = ?, ccode = ?, mob = ?, company = ?, rera_no = ?, brk_location = ?, address = ?, remark = ?, document = ?     WHERE brk_id = ?",
          [
           
                DateTime,
                req.body.data.b_name,
                req.body.data.b_email,
                req.body.data.b_ccode,
                req.body.data.b_mob,
                req.body.data.b_company,
                req.body.data.b_rera_no,
                req.body.data.brk_location,
                req.body.data.b_address,
                req.body.data.b_remark, 
                fileName || existingFileName, 
                req.body.data.b_brk_id
          ],
          (err, result) => {
            if (err) {
              console.log(err);
              res.status(500).send("Error updating broker details");
            } else {
              console.log(result);
              res.send("Broker Details Updated Successfully");
            }
            connection.release();
          }
        );
      });
        
    });
});




BrokerRouter.post("/add-broker-mobile", (req, res) => {
    console.log(req.body,"HELLOWW WORLD BROEKRERRRRRR")
    const createDateTime = req.body.DateTime || new Date().toISOString();
       const base64Data = req.body.data.document; // Assuming this is where your Base64 string is
  let fileName = "";
  if (base64Data) {
    // Ensure it's a string before splitting
    if (typeof base64Data === 'string') {
      const base64Image = base64Data.split(';base64,').pop();
      fileName = `${Date.now()}-uploadedFile.jpg`; // Change the extension based on the file type
      const filePath = path.join(__dirname, './../../uploads/broker/', fileName);
  
      // Write the file to the uploads directory
      fs.writeFile(filePath, base64Image, { encoding: 'base64' }, (err) => {
        if (err) {
          console.error("File write error:", err);
          return res.status(500).send("Error saving the document.");
        }
        uploadedFilePath = filePath; // Save the file path for database insertion
      });
    } else {
      console.error('Invalid Base64 data: not a string');
      return res.status(400).send("Invalid Base64 data");
    }
  } 
  // else {
  //   console.error('No Base64 data provided');
  //   return res.status(400).send("No document provided");
  // }
  
  pool.getConnection(function (error, connection) {
    if (error) throw error;
    connection.query(
      "INSERT INTO crm_broker_details (u_id, create_dt, update_dt, name, email, ccode, mob, company, rera_no, brk_location,address ,remark,document) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)",
      [
        req.session.user[0].u_id,
        createDateTime,
        createDateTime,
        req.body.data.b_name,
        req.body.data.b_email,
        req.body.data.b_ccode || "91",
        req.body.data.b_mob,
        req.body.data.b_company,
        req.body.data.b_rera_no,
        req.body.data.b_locality,
        req.body.data.b_address,
        req.body.data.b_remark,
        fileName
      ],
      (err, result) => {
        if (err) {
          console.log(err);
          res.send(err);
        } else {
          res.send("Broker Details Added Successfully");
        }
        connection.release();
      }
    );
  });
});



// BrokerRouter.post("/edit-broker", (req, res) => {
//   console.log(req.body, "edit-broker-body");
//   pool.getConnection(function (error, connection) {
//     if (error) throw error;
//     connection.query(
//       "UPDATE `crm_broker_details` SET `update_dt` = ?, `name` = ?, `email` = ?, `ccode` = ?, `mob` = ?, `company` = ?, `rera_no` = ?, `brk_location` = ?, `address` = ?, `remark` = ? WHERE `brk_id` = ?",
//       [
//         req.body.DateTime,
//         req.body.data[0].b_name,
//         req.body.data[0].b_email,
//         req.body.data[1].b_ccode, // Note: Index 1 for ContactValidation
//         req.body.data[1].b_mob, // Note: Index 1 for ContactValidation
//         req.body.data[0].b_company,
//         req.body.data[0].b_rera_no,
//         req.body.data[0].brk_location,
//         req.body.data[0].b_address, // Ensure address is included
//         req.body.data[0].b_remark,
//         req.body.data[0].b_brk_id,
//       ],
//       (err, result) => {
//         if (err) {
//           console.log(err);
//           res.status(500).send("Error updating broker details");
//         } else {
//           res.send("Broker Details Updated Successfully");
//         }
//         connection.release();
//       }
//     );
//   });
// });

// BrokerRouter.post("/quick-edit-broker", (req, res) => {
//      const system_dt = req.headers['system-dt'];
//   pool.getConnection((error, connection) => {
//     if (error) {
//       console.error("Error getting connection: ", error);
//       return res.status(500).send("Error connecting to database");
//     }

//     connection.beginTransaction((err) => {
//       if (err) {
//         connection.release();
//         console.error("Error starting transaction: ", err);
//         return res.status(500).send("Error starting transaction");
//       }

//       const updateQuery =
//         "UPDATE `crm_broker_details` SET ?? = ?, ?? = ?, ?? = ? WHERE ?? = ?";
//       const updateValues = [
//         "update_dt",
//         system_dt,
//         "broker_meet_status",
//         req.body.broker_meet_status,
//         "status",
//         req.body.broker_status,
//         "brk_id",
//         req.body.brk_id,
//       ];

//       connection.query(updateQuery, updateValues, (err, result) => {
//         if (err) {
//           return connection.rollback(() => {
//             connection.release();
//             console.error("Error updating broker details: ", err);
//             return res.status(500).send("Error updating broker details");
//           });
//         }

//         const insertQuery =
//           "INSERT INTO crm_broker_history (brk_id, created_dt, created_by, broker_meet_status, status, comment) VALUES (?, ?, ?, ?, ?, ?)";
//         const insertValues = [
//           req.body.brk_id,
//           system_dt,
//           req.session.user[0].u_id,
//           req.body.broker_meet_status,
//           req.body.broker_status,
//           req.body.comment,
//         ];

//         connection.query(insertQuery, insertValues, (err, result) => {
//           if (err) {
//             return connection.rollback(() => {
//               connection.release();
//               console.error("Error inserting into broker history: ", err);
//               return res
//                 .status(500)
//                 .send("Error inserting into broker history");
//             });
//           }

//           connection.commit((err) => {
//             if (err) {
//               return connection.rollback(() => {
//                 connection.release();
//                 console.error("Error committing transaction: ", err);
//                 return res.status(500).send("Error committing transaction");
//               });
//             }

//             connection.release();
//             return res.send("Broker Details Updated Successfully");
//           });
//         });
//       });
//     });
//   });
// });


BrokerRouter.post("/quick-edit-broker", (req, res) => {
  pool.getConnection((error, connection) => {
    if (error) {
      console.error("Error getting connection: ", error);
      return res.status(500).send("Error connecting to database");
    }

    connection.beginTransaction((err) => {
      if (err) {
        connection.release();
        console.error("Error starting transaction: ", err);
        return res.status(500).send("Error starting transaction");
      }

      const updateQuery =
        "UPDATE `crm_broker_details` SET ?? = ?, ?? = ?, ?? = ? WHERE ?? = ?";
      const updateValues = [
        "update_dt",
        dayjs(DubaiDateTime).format("YYYY-MM-DD HH:mm:ss"),
        "broker_meet_status",
        req.body.broker_meet_status,
        "status",
        req.body.broker_status,
        "brk_id",
        req.body.brk_id,
      ];

      connection.query(updateQuery, updateValues, (err, result) => {
        if (err) {
          return connection.rollback(() => {
            connection.release();
            console.error("Error updating broker details: ", err);
            return res.status(500).send("Error updating broker details");
          });
        }

        const insertQuery =
          "INSERT INTO crm_broker_history (brk_id, created_dt, created_by, broker_meet_status, status, comment) VALUES (?, ?, ?, ?, ?, ?)";
        const insertValues = [
          req.body.brk_id,
          dayjs(DubaiDateTime).format("YYYY-MM-DD HH:mm:ss"),
          req.session.user[0].u_id,
          req.body.broker_meet_status,
          req.body.broker_status,
          req.body.comment,
        ];

        connection.query(insertQuery, insertValues, (err, result) => {
          if (err) {
            return connection.rollback(() => {
              connection.release();
              console.error("Error inserting into broker history: ", err);
              return res
                .status(500)
                .send("Error inserting into broker history");
            });
          }

          connection.commit((err) => {
            if (err) {
              return connection.rollback(() => {
                connection.release();
                console.error("Error committing transaction: ", err);
                return res.status(500).send("Error committing transaction");
              });
            }

            connection.release();
            return res.send("Broker Details Updated Successfully");
          });
        });
      });
    });
  });
});

// Import CSV
BrokerRouter.post("/import-broker", (req, res) => {
  const data = req.body.data;
  // const user_id = req.session.user[0].u_id;
  const values = [];

  // console.log(req.body.data)
  // return

  // Check if all columns exist in CSV
  const keysToCheck = [
    "create_dt",
    "update_dt",
    "name",
    "email",
    "ccode",
    "mob",
    "company",
    "rera_no",
    "country",
    "state",
    "city",
    "locality",
    "address",
    "remark",
  ];

  const allKeysExist = keysToCheck.every((key) => data[0].hasOwnProperty(key));

  if (
    allKeysExist === false ||
    keysToCheck.length !== Object.keys(data[0]).length
  ) {
    // console.log("Incorrect File Format");
    res.status(400).json({
      message: "Incorrect File, Please Download Fresh CSV File",
      error: "Incorrect File Format",
    });
    return;
  }

  pool.getConnection(function (error, connection) {
    if (error) throw error;
    let rowcount = 1;
    for (const {
      create_dt,
      update_dt,
      name,
      email,
      ccode,
      mob,
      company,
      rera_no,
      country,
      state,
      city,
      locality,
      address,
      remark,
    } of data) {
      let formattedCreateDt = formatDate(create_dt);
      let formattedUpdateDt = formatDate(update_dt);

      rowcount++;

      // check if all fields are empty
      if (
        create_dt === "" &&
        update_dt === "" &&
        name === "" &&
        email === "" &&
        ccode === "" &&
        mob === "" &&
        company === "" &&
        rera_no === "" &&
        country === "" &&
        state === "" &&
        city === "" &&
        locality === "" &&
        address === "" &&
        remark === ""
      ) {
        // console.log("No Data Found");
        continue;
      } else {
        values.push({
          create_dt: formattedCreateDt,
          update_dt: formattedUpdateDt,
          name,
          email,
          ccode,
          mob,
          company,
          rera_no,
          country,
          state,
          city,
          locality,
          address,
          remark,
        });
      }
    }

    if (values.length > 0) {
      const query =
        "INSERT INTO crm_broker_details (u_id, create_dt, update_dt, name, email, ccode, mob, company, rera_no,  locality, address, remark) VALUES ?";
      connection.query(
        query,
        [
          values.map((item) => [
            req.body.login_u_id,
            item.create_dt,
            item.update_dt,
            item.name,
            item.email,
            item.ccode,
            item.mob,
            item.company,
            item.rera_no,
            item.address,
            item.remark,
          ]),
        ],
        (error, result) => {
          if (error) {
            res.send(error);
          } else {
            res.send(result);
          }
        }
      );
      connection.release();
    } else {
      res
        .status(400)
        .json({ message: `No data found in csv file`, error: "No data Found" });
    }
  });
});

BrokerRouter.post("/get-leads-by-broker-id", (req, res) => {
  const { page, pageSize, brk_id } = req.query;
  const offset = (page - 1) * pageSize;
  const limit = parseInt(pageSize);

  console.log(req.query, "req.query");
  pool.getConnection(function (error, connection) {
    if (error) throw error;
    connection.query(
      "SELECT lpd.l_id AS l_id, lrd.lreq_id AS assignlead_id, GROUP_CONCAT(cu.username) AS assign_users, lpd.create_dt, lpd.brk_id, lpd.ref_name, lpd.ref_ccode, lpd.ref_mob, lpd.ref_email, lpd.identity, lpd.lname, CONCAT(lpd.p_ccode, ' ', lpd.p_mob) AS mobile, lpd.p_ccode, lpd.p_mob, lpd.s_ccode, lpd.s_mob, lpd.form_name, lpd.p_email, lpd.status as admin_status, GROUP_CONCAT(lrd.status,' - ', cu.username) AS users_status, lpd.pname, lpd.followup, lpd.followup_dt, lpd.source, lpd.city, lpd.locality, lpd.sub_locality, lpd.comments, ls.color, lpd.clicked, lpd.source_type, lpd.service_type, lpd.ptype, lpd.pcategory, lpd.pconfiguration, lpd.min_area, lpd.max_area, lpd.area_unit, lpd.min_price, lpd.max_price, lpd.price_unit, lpd.other_details, lpd.assign_status, (SELECT clh.status FROM crm_lead_history AS clh WHERE clh.l_id = lpd.l_id ORDER BY clh.update_dt DESC LIMIT 1) AS latest_status, (SELECT cu.username FROM crm_lead_history AS clh LEFT JOIN crm_users AS cu ON clh.u_id = cu.u_id WHERE clh.l_id = lpd.l_id ORDER BY clh.update_dt DESC LIMIT 1) AS latest_username, (SELECT ls.color FROM crm_lead_history AS clh LEFT JOIN crm_lead_status AS ls ON clh.status = ls.status WHERE clh.l_id = lpd.l_id ORDER BY clh.update_dt DESC LIMIT 1) AS latest_status_color FROM crm_lead_primary_details AS lpd LEFT JOIN crm_lead_req_details AS lrd ON lrd.l_id = lpd.l_id LEFT JOIN crm_lead_status AS ls ON ls.status = lpd.status LEFT JOIN crm_users AS cu ON cu.u_id = lrd.assignto_id WHERE lpd.brk_id = ? GROUP BY lpd.l_id ORDER BY lpd.l_id DESC LIMIT ? OFFSET ?",
      [brk_id, limit, offset],
      (err, result) => {
        if (err) {
          console.log(err);
          res.status(500).send("Error fetching broker leads by ID");
        } else {
          res.json(result);
        }
        connection.release();
      }
    );
  });
});

// Route to count broker leads by broker ID
BrokerRouter.post("/get-broker-lead-count-by-id", (req, res) => {
  const { brk_id } = req.query;
  console.log(req.query, "firstName");
  pool.getConnection(function (error, connection) {
    if (error) throw error;
    connection.query(
      `SELECT COUNT(lpd.l_id) AS totalCount 
       FROM crm_lead_primary_details AS lpd 
       WHERE lpd.brk_id = ?`,
      [brk_id],
      (err, result) => {
        if (err) {
          console.error("Error fetching broker lead count by ID:", err);
          res.status(500).send("Error fetching broker lead count by ID");
        } else {
          console.log(result[0].totalCount, "totalCount");
          res.json(result[0].totalCount);
        }
        connection.release();
      }
    );
  });
});

BrokerRouter.post("/get-all-broker-leads", (req, res) => {
  const user_role = req.session.user[0].urole;
  const user_id = req.session.user[0].u_id;
  const { page, pageSize } = req.query;
  const offset = (page - 1) * pageSize;
  const limit = parseInt(pageSize);

  if (user_role === "Master" || user_role === "Admin") {
    pool.getConnection(function (error, connection) {
      if (error) throw error;
      connection.query(
        `SELECT lpd.l_id AS l_id, lrd.lreq_id AS assignlead_id, GROUP_CONCAT(cu.username) AS assign_users, lpd.create_dt, lpd.brk_id, lpd.ref_name, lpd.ref_ccode, lpd.ref_mob, lpd.ref_email, lpd.identity, lpd.lname, CONCAT(lpd.p_ccode, ' ', lpd.p_mob) AS mobile, lpd.p_ccode, lpd.p_mob, lpd.s_ccode, lpd.s_mob, lpd.form_name, lpd.p_email, lpd.status as admin_status, GROUP_CONCAT(lrd.status,' - ', cu.username) AS users_status, lpd.pname, lpd.followup, lpd.followup_dt, lpd.source, lpd.city, lpd.locality, lpd.sub_locality, lpd.comments, ls.color, lpd.clicked, lpd.source_type, lpd.service_type, lpd.ptype, lpd.pcategory, lpd.pconfiguration, lpd.min_area, lpd.max_area, lpd.area_unit, lpd.min_price, lpd.max_price, lpd.price_unit, lpd.other_details, lpd.assign_status, (SELECT clh.status FROM crm_lead_history AS clh WHERE clh.l_id = lpd.l_id ORDER BY clh.update_dt DESC LIMIT 1) AS latest_status, (SELECT cu.username FROM crm_lead_history AS clh LEFT JOIN crm_users AS cu ON clh.u_id = cu.u_id WHERE clh.l_id = lpd.l_id ORDER BY clh.update_dt DESC LIMIT 1) AS latest_username, (SELECT ls.color FROM crm_lead_history AS clh LEFT JOIN crm_lead_status AS ls ON clh.status = ls.status WHERE clh.l_id = lpd.l_id ORDER BY clh.update_dt DESC LIMIT 1) AS latest_status_color FROM crm_lead_primary_details AS lpd LEFT JOIN crm_lead_req_details AS lrd ON lrd.l_id = lpd.l_id LEFT JOIN crm_lead_status AS ls ON ls.status = lpd.status LEFT JOIN crm_users AS cu ON cu.u_id = lrd.assignto_id WHERE lpd.brk_id != "" GROUP BY lpd.l_id ORDER BY lpd.l_id DESC LIMIT ? OFFSET ?`,
        [limit, offset],
        (err, result) => {
          if (err) {
            console.log(err);
            res.status(500).send("Error fetching broker leads");
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
        `SELECT lpd.l_id AS l_id, lrd.lreq_id AS assignlead_id, GROUP_CONCAT(cu.username) AS assign_users, lpd.create_dt, lpd.brk_id, lpd.ref_name, lpd.ref_ccode, lpd.ref_mob, lpd.ref_email, lpd.identity, lpd.lname, CONCAT(lpd.p_ccode, ' ', lpd.p_mob) AS mobile, lpd.p_ccode, lpd.p_mob, lpd.s_ccode, lpd.s_mob, lpd.form_name, lpd.p_email, lpd.status as admin_status, GROUP_CONCAT(lrd.status,' - ', cu.username) AS users_status, lpd.pname, lpd.followup, lpd.followup_dt, lpd.source, lpd.city, lpd.locality, lpd.sub_locality, lpd.comments, ls.color, lpd.clicked, lpd.source_type, lpd.service_type, lpd.ptype, lpd.pcategory, lpd.pconfiguration, lpd.min_area, lpd.max_area, lpd.area_unit, lpd.min_price, lpd.max_price, lpd.price_unit, lpd.other_details, lpd.assign_status, (SELECT clh.status FROM crm_lead_history AS clh WHERE clh.l_id = lpd.l_id ORDER BY clh.update_dt DESC LIMIT 1) AS latest_status, (SELECT cu.username FROM crm_lead_history AS clh LEFT JOIN crm_users AS cu ON clh.u_id = cu.u_id WHERE clh.l_id = lpd.l_id ORDER BY clh.update_dt DESC LIMIT 1) AS latest_username, (SELECT ls.color FROM crm_lead_history AS clh LEFT JOIN crm_lead_status AS ls ON clh.status = ls.status WHERE clh.l_id = lpd.l_id ORDER BY clh.update_dt DESC LIMIT 1) AS latest_status_color FROM crm_lead_primary_details AS lpd LEFT JOIN crm_lead_req_details AS lrd ON lrd.l_id = lpd.l_id LEFT JOIN crm_lead_status AS ls ON ls.status = lpd.status LEFT JOIN crm_users AS cu ON cu.u_id = lrd.assignto_id LEFT JOIN crm_broker_details AS br ON br.brk_id = lpd.brk_id WHERE lpd.brk_id != "" AND br.u_id != "" GROUP BY lpd.l_id ORDER BY lpd.l_id DESC LIMIT ? OFFSET ?`,
        [user_id, limit, offset],
        (err, result) => {
          if (err) {
            console.log(err);
            res.status(500).send("Error fetching broker leads");
          } else {
            res.json(result);
          }
          connection.release();
        }
      );
    });
  }
});

BrokerRouter.post("/get-broker-lead-count", (req, res) => {
  const user_role = req.session.user[0].urole;
  const user_id = req.session.user[0].u_id;
  if (user_role === "Master" || user_role === "Admin") {
    pool.getConnection(function (error, connection) {
      if (error) throw error;
      connection.query(
        `SELECT COUNT(lpd.l_id) AS totalCount 
       FROM crm_lead_primary_details AS lpd 
       WHERE lpd.brk_id != ''`,
        (err, result) => {
          if (err) {
            console.error("Error fetching broker lead count:", err);
            res.status(500).send("Error fetching broker lead count");
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
        `SELECT COUNT(lpd.l_id) AS totalCount FROM crm_lead_primary_details AS lpd LEFT JOIN crm_broker_details AS br ON br.brk_id = lpd.brk_id WHERE lpd.brk_id != '' AND br.u_id = ?`,
        [user_id],
        (err, result) => {
          if (err) {
            console.error("Error fetching broker lead count:", err);
            res.status(500).send("Error fetching broker lead count");
          } else {
            res.json(result[0].totalCount);
          }
          connection.release();
        }
      );
    });
  }
});

BrokerRouter.post("/get-broker-lead-count", (req, res) => {
  const user_role = req.session.user[0].urole;
  const user_id = req.session.user[0].u_id;
  if (user_role === "Master" || user_role === "Admin") {
    pool.getConnection(function (error, connection) {
      if (error) throw error;
      connection.query(
        `SELECT COUNT(lpd.l_id) AS totalCount 
       FROM crm_lead_primary_details AS lpd 
       WHERE lpd.brk_id != ''`,
        (err, result) => {
          if (err) {
            console.error("Error fetching broker lead count:", err);
            res.status(500).send("Error fetching broker lead count");
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
        `SELECT COUNT(lpd.l_id) AS totalCount FROM crm_lead_primary_details AS lpd LEFT JOIN crm_broker_details AS br ON br.brk_id = lpd.brk_id WHERE lpd.brk_id != '' AND br.u_id = ?`,
        [user_id],
        (err, result) => {
          if (err) {
            console.error("Error fetching broker lead count:", err);
            res.status(500).send("Error fetching broker lead count");
          } else {
            res.json(result[0].totalCount);
          }
          connection.release();
        }
      );
    });
  }
});

// for ES5
module.exports = BrokerRouter;
