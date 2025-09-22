// for ES5
const express = require("express");
const multer = require("multer");
const pool = require("../../Database.js");
const fs = require("fs");
const dayjs = require("dayjs");
const utc = require("dayjs/plugin/utc");
const timezone = require("dayjs/plugin/timezone");

dayjs.extend(utc);
dayjs.extend(timezone);

const DubaiDateTime = new Date().toLocaleString("en-US", {
  timeZone: "Asia/Dubai",
});

const CandidatesRouter = express.Router();

// Set up Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads/candidate_cv"); // Create an "uploads" directory in your project
  },
  filename: (req, file, cb) => {
    const fileName = Date.now() + "-" + file.originalname;
    cb(null, fileName);
  },
});
const upload = multer({ storage: storage });

CandidatesRouter.post("/add-candidate", upload.single("c_cv"), (req, res) => {
  let filename = "";
  if (req.file === undefined) {
    filename = "";
  } else {
    filename = req.file.filename;
  }

  pool.getConnection(function (error, connection) {
    if (error) throw error;
    connection.query(
      "INSERT INTO crm_candidate_details (??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        "create_dt",
        "update_dt",
        "created_by",
        "c_ccode",
        "c_mob",
        "c_alt_ccode",
        "c_alt_mob",
        "c_email",
        "c_name",
        "c_source",
        "c_position",
        "c_status",
        "country",
        "state",
        "city",
        "locality",
        "c_pdf",
        dayjs(DubaiDateTime).format("YYYY-MM-DD HH:mm:ss"),
        dayjs(DubaiDateTime).format("YYYY-MM-DD HH:mm:ss"),
        req.session.user[0].u_id,
        req.body.c_ccode,
        req.body.c_mob,
        req.body.c_alt_ccode,
        req.body.c_alt_mob,
        req.body.c_email,
        req.body.c_name,
        req.body.c_source,
        req.body.c_position,
        req.body.c_status,
        req.body.country,
        req.body.state,
        req.body.city,
        req.body.locality,
        filename,
      ],
      (err, result) => {
        if (err) {
          console.log(err);
        } else {
          res.json("Candidate Added Successfully");
        }
        connection.release();
      }
    );
  });
});

CandidatesRouter.post("/delete-selected-candidate", (req, res) => {
  const candidate_id = req.body.c_id;
  const c_id = candidate_id.map((entry) => entry.c_id);
  pool.getConnection(function (error, connection) {
    if (error) throw error;
    connection.query(
      "DELETE FROM crm_candidate_details WHERE ?? IN (?) ",
      ["c_id", c_id],
      (err, result) => {
        if (err) {
          console.log(err);
        } else {
          res.send("Candidate Deleted Successfully");
        }
        connection.release();
      }
    );
  });
});

CandidatesRouter.post("/assign-selected-candidate", (req, res) => {
  const candidate_id = req.body.c_id;
  const c_id = candidate_id.map((entry) => entry);
  pool.getConnection(function (error, connection) {
    if (error) throw error;
    connection.query(
      "UPDATE crm_candidate_details SET ?? = ?, ?? = ?, ?? = ? WHERE ?? IN (?)",
      [
        "assign_by",
        req.session.user[0].u_id,
        "assign_to",
        req.body.user,
        "c_status",
        req.body.c_status,
        "c_id",
        c_id,
      ],
      (err, result) => {
        if (err) {
          console.log(err);
        } else {
          res.send("Candidate Assign Successfully");
        }
        connection.release();
      }
    );
  });
});

CandidatesRouter.post("/quick-edit-candidate", (req, res) => {
  const user_id = req.session.user[0].u_id;
  const user_role = req.session.user[0].urole;

  let comment = [req.body.data.oldComment];
  let usercomments =
    "By " +
    req.session.user[0].username +
    ", " +
    dayjs(DubaiDateTime).format("MMM DD,YYYY h:mm A") + 
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

  pool.getConnection(function (error, connection) {
    if (error) throw error;
    connection.query(
      "UPDATE crm_candidate_details SET ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ? WHERE ?? = ?",
      [
        `update_dt`,
        dayjs(DubaiDateTime).format("YYYY-MM-DD HH:mm:ss"),
        `c_status`,
        req.body.data.status_type,
        `followup`,
        req.body.data.follow_up,
        `followup_dt`,
        followup_dt,
        `comments`,
        implode,
        "c_id",
        req.body.data.candidateId,
      ],
      (err, result) => {
        if (err) {
          console.log(err);
        } else {
          connection.query(
            "INSERT INTO `crm_candidate_history`(??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)",
            [
              "c_id",
              "u_id",
              "create_dt",
              "update_dt",
              "c_status",
              "c_name",
              "c_ccode",
              "c_mob",
              "c_position",
              "followup",
              "followup_dt",
              "comments",
              req.body.data.candidateId,
              user_id,
              dayjs(DubaiDateTime).format("YYYY-MM-DD HH:mm:ss"),
              dayjs(DubaiDateTime).format("YYYY-MM-DD HH:mm:ss"),
              req.body.data.status_type,
              req.body.data.c_name,
              req.body.data.c_ccode,
              req.body.data.c_mob,
              req.body.data.c_position,
              req.body.data.followup,
              followup_dt,
              req.body.data.newComment,
            ],
            (err, result) => {
              if (err) {
                console.log(err);
              }
            }
          );

          res.send("Candidate is updated");
        }
        connection.release();
      }
    );
  });
});


CandidatesRouter.post("/edit-candidate", upload.single("c_cv"), (req, res) => {
    console.log(req.body,"req.bodyjhvghjkhgfcvbnjhgyfc")
  pool.getConnection(function (error, connection) {
    if (error) {
      console.error("Error getting database connection:", error);
      return res.status(500).send("Database connection error");
    }

    const filename = req.file ? req.file.filename : "";
    const candidateId = parseInt(req.body.c_id); // Ensure it's handled correctly as a number

    connection.query(
      "SELECT c_pdf FROM crm_candidate_details WHERE c_id = ?",
      [candidateId],
      (err, result) => {
        if (err) {
          console.error("Error getting candidate PDF:", err);
          connection.release(); // Release connection on error
          return res.status(500).send("Error getting candidate PDF");
        }

        if (result.length === 0) {
          console.log(`No record found for c_id: ${candidateId}`);
          connection.release(); // Release connection if no record is found
          return res.status(404).send("Candidate not found");
        }

        const currentFilename = result[0]?.c_pdf;
        if (currentFilename) {
          if (currentFilename !== filename && filename) {
            const filePath = `./uploads/candidate_cv/${currentFilename}`;
            fs.unlink(filePath, (err) => {
              if (err) {
                console.error("Error deleting file:", err);
              }
            });
          }
        }

        const updateQuery = `
          UPDATE crm_candidate_details
          SET 
            update_dt = ?,
            c_ccode = ?,
            c_mob = ?,
            c_alt_ccode = ?,
            c_alt_mob = ?,
            c_email = ?,
            c_name = ?,
            c_dob = ?,
            c_source = ?,
            c_position = ?,
            country = ?,
            state = ?,
            city = ?,
            locality = ?,
            c_pdf = ?
          WHERE c_id = ?
        `;

        const values = [
          dayjs(DubaiDateTime).format("YYYY-MM-DD HH:mm:ss"),
          req.body.c_ccode,
          req.body.c_mob,
          req.body.c_alt_ccode,
          req.body.c_alt_mob,
          req.body.c_email,
          req.body.c_name,
          req.body.c_dob,
          req.body.c_source,
          req.body.c_position,
          req.body.country,
          req.body.state,
          req.body.city,
          req.body.locality,
          filename || currentFilename, // Use the new filename or retain the current
          candidateId,
        ];

        connection.query(updateQuery, values, (err, result) => {
          if (err) {
            console.error("Error executing query:", err);
            connection.release(); // Release connection on error
            return res.status(500).send("Failed to update candidate");
          }

          console.log("Update result:", result); // Debugging: Check the result
          res.send("Candidate is updated successfully");
          connection.release();
        });
      }
    );
  });
});


// CandidatesRouter.post("/edit-candidate", (req, res) => {
//   pool.getConnection(function (error, connection) {
//     if (error) throw error;
//     connection.query(
//       "UPDATE `crm_candidate_details` SET ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ? WHERE ?? = ?",
//       [
//         `update_dt`,
//         req.body.DateTime,
//         `c_ccode`,
//         req.body.data[1].c_ccode,
//         `c_mob`,
//         req.body.data[1].c_mob,
//         `c_alt_ccode`,
//         req.body.data[1].c_alt_ccode,
//         `c_alt_mob`,
//         req.body.data[1].c_alt_mob,
//         `c_email`,
//         req.body.data[0].c_email,
//         `c_name`,
//         req.body.data[0].c_name,
//         `c_source`,
//         req.body.data[0].c_source,
//         `c_position`,
//         req.body.data[0].c_position,
//         `country`,
//         req.body.data[0].country,
//         `state`,
//         req.body.data[0].state,
//         `city`,
//         req.body.data[0].city,
//         `locality`,
//         req.body.data[0].locality,
//         "c_id",
//         req.body.data[0].c_id,
//       ],
//       (err, result) => {
//         if (err) {
//           console.log(err);
//         } else {
//           res.send("Candidate is updated");
//         }
//         connection.release();
//       }
//     );
//   });
// });
// for ES5
module.exports = CandidatesRouter;
