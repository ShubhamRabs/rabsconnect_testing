// for ES5
const express = require("express");
const pool = require("../../Database.js");
const fs = require("fs");
const fsPromise = require("fs").promises;
const dayjs = require("dayjs");

const multer = require('multer');
const path = require('path');

// Set up multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/profile'); // Save the image to this folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Add timestamp to filename
  },
});

const upload = multer({ storage });

const ProfileRouter = express.Router();

const writeImageFile = async (filePath, base64Image, imageFileName) => {
  try {
    if (imageFileName && imageFileName.includes("png")) {
      await fsPromise.rename(imageFileName, filePath);
      // console.log('File renamed successfully.');
    }

    await fsPromise.writeFile(filePath, base64Image, "base64");
    // console.log('Content written to file successfully.');
    return true;
  } catch (error) {
    console.error("Error in file operation:", error);
    return false;
  }
};

ProfileRouter.post("/update-profile-details", async (req, res) => {
    console.log(req.body.data[0],"PROFILEEEEE TESTTTT")
  pool.getConnection(function (error, connection) {
    if (error) throw error;
    connection.query(
      "SELECT ud_id FROM crm_user_details WHERE ?? = ?",
      ["u_id", req.session.user[0].u_id],
      async (err, result) => {
        if (err) {
          console.log(err, "First");
          res.send("Something went wrong");
        }
        if (result.length === 0) {
          // Insert new profile details (without image)
          pool.getConnection(function (error, connection) {
            if (error) throw error;
            connection.query(
              "INSERT INTO crm_user_details ( ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??) VALUES( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
              [
                "u_id",
                "create_dt",
                "update_dt",
                "fname",
                "mname",
                "lname",
                "r_email",
                "p_email",
                "p_ccode",
                "p_mob",
                "health",
                "health_issue",
                "religion",
                "gender",
                "mstatus",
                "dob",
                "aadhar_no",
                "pan_no",
                "join_date",
                // "designation",
                // "department",
                "location",
                "pf_no",
                "bank_name",
                "bank_branch",
                "ac_name",
                "account_no",
                "ifsc_code",
                // "basic_salary",
                req.session.user[0].u_id,
                req.body.DateTime,
                req.body.DateTime,
                req.body.data[0].fname,
                req.body.data[0].mname,
                req.body.data[0].lname,
                req.body.data[0].r_email,
                req.body.data[0].p_email,
                req.body.data[0].p_ccode,
                req.body.data[0].p_mob === null ? "" : req.body.data[0].p_mob,
                req.body.data[0].health,
                req.body.data[0].health_issue,
                req.body.data[0].religion,
                req.body.data[0].gender,
                req.body.data[0].mstatus,
                req.body.data[0].dob,
                req.body.data[0].aadhar_no,
                req.body.data[0].pan_no,
                req.body.data[0].join_date,
                // req.body.data[0].designation,
                // req.body.data[0].department,
                req.body.data[0].location,
                req.body.data[0].pf_no,
                req.body.data[0].bank_name,
                req.body.data[0].bank_branch,
                req.body.data[0].ac_name,
                req.body.data[0].account_no,
                req.body.data[0].ifsc_code,
                // req.body.data[0].basic_salary,
              ],
              (err, result) => {
                if (err) {
                  console.log(err, "err");
                  res.send("Something went wrong, please try again later");
                } else {
                  res.send("Profile has been Updated Successfully");
                }
                connection.release();
              }
            );
          });
        } else {
          // Update existing profile details (without image)
          pool.getConnection(function (error, connection) {
            if (error) throw error;
            connection.query(
              "UPDATE crm_user_details SET ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ? WHERE ?? = ?",
              [
                "update_dt",
                req.body.DateTime,
                "fname",
                req.body.data[0].fname,
                "mname",
                req.body.data[0].mname,
                "lname",
                req.body.data[0].lname,
                "r_email",
                req.body.data[0].r_email,
                "p_email",
                req.body.data[0].p_email,
                "p_ccode",
                req.body.data[0].p_ccode,
                "p_mob",
                req.body.data[0].p_mob === null ? "" : req.body.data[0].p_mob,
                "health",
                req.body.data[0].health,
                "health_issue",
                req.body.data[0].health_issue,
                "religion",
                req.body.data[0].religion,
                "gender",
                req.body.data[0].gender,
                "mstatus",
                req.body.data[0].mstatus,
                "dob",
                req.body.data[0].dob,
                "aadhar_no",
                req.body.data[0].aadhar_no,
                "pan_no",
                req.body.data[0].pan_no,
                "join_date",
                req.body.data[0].join_date,
                // "designation",
                // req.body.data[0].designation,
                // "department",
                // req.body.data[0].department,
                "location",
                req.body.data[0].location,
                "pf_no",
                req.body.data[0].pf_no,
                "bank_name",
                req.body.data[0].bank_name,
                "bank_branch",
                req.body.data[0].bank_branch,
                "ac_name",
                req.body.data[0].ac_name,
                "account_no",
                req.body.data[0].account_no,
                "ifsc_code",
                req.body.data[0].ifsc_code,
                // "basic_salary",
                // req.body.data[0].basic_salary,
                "u_id",
                req.session.user[0].u_id,
              ],
              (err, result) => {
                if (err) {
                  console.log(err, "errlast");
                  res.send("Something went wrong");
                } else {
                  res.send("Profile has been Updated Successfully");
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



ProfileRouter.post("/update-profile-mobile-details", upload.single("profile_image"), (req, res) => {
  const {
    fname,
    mname,
    lname,
    p_email,
    r_email,
    p_ccode,
    p_mob,
    health,
    health_issue,
    religion,
    gender,
    mstatus,
    dob,
    aadhar_no,
    pan_no,
    join_date,
    location,
    pf_no,
    bank_name,
    bank_branch,
    ac_name,
    account_no,
    ifsc_code,
    profile_image, 
    pre_profile_image
  } = req.body;

  const u_id = req.session.user[0].u_id; // Assuming user ID is stored in the session

  console.log(u_id, "hello test ID");

  pool.getConnection((error, connection) => {
    if (error) {
      console.error("Database connection error:", error);
      return res.status(500).send("Database connection error");
    }

    // Use the current image filename unless a new one is provided
    let imageFilename = pre_profile_image || null;

    // Step 2: Handle new image upload
    if (profile_image) {
      // If profile image is provided as base64
      const base64Data = profile_image.replace(/^data:image\/\w+;base64,/, "");
      const buffer = Buffer.from(base64Data, "base64");

      const userFolder = path.join(__dirname, "./../../uploads/profile/", u_id.toString());

      // Check if the folder exists, create it if not
      if (!fs.existsSync(userFolder)) {
        fs.mkdirSync(userFolder, { recursive: true });
      }

      // Generate a unique image file name (timestamp)
      imageFilename = Date.now() + ".jpg";
      const imagePath = path.join(userFolder, imageFilename);

      // Write the image file to the server
      fs.writeFileSync(imagePath, buffer, (err) => {
        if (err) {
          console.error("File write error:", err);
          connection.release();
          return res.status(500).send("Error saving the profile image");
        }
      });
    } 
    else if (req.file) {
      // If profile image was uploaded via multer
      const userFolder = path.join(__dirname, "./../../uploads/profile/", u_id.toString());

      if (!fs.existsSync(userFolder)) {
        fs.mkdirSync(userFolder, { recursive: true });
      }

      // The filename will be the one saved by multer
      imageFilename = req.file.filename;
    } else {
      // If no new image was provided, keep the current one
      imageFilename = pre_profile_image || null;
    }

    // Step 3: Check if the user already exists in crm_user_details table
    const checkQuery = "SELECT * FROM crm_user_details WHERE u_id = ?";
    connection.query(checkQuery, [u_id], (err, results) => {
      if (err) {
        console.error("Error checking user existence:", err);
        connection.release();
        return res.status(500).send("Error checking user existence");
      }

      if (results.length === 0) {
        // If user doesn't exist, insert the data
        const insertQuery = `
          INSERT INTO crm_user_details (
            u_id, fname, mname, lname, p_email, r_email, p_ccode, p_mob, 
            health, health_issue, religion, gender, mstatus, dob, 
            aadhar_no, pan_no, join_date, location, pf_no, bank_name, 
            bank_branch, ac_name, account_no, ifsc_code, profile_image
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

        const insertValues = [
          u_id, fname, mname, lname, p_email, r_email, p_ccode, p_mob,
          health, health_issue, religion, gender, mstatus, dob, aadhar_no, 
          pan_no, join_date, location, pf_no, bank_name, bank_branch, 
          ac_name, account_no, ifsc_code, imageFilename || ""
        ];

        connection.query(insertQuery, insertValues, (err, result) => {
          if (err) {
            console.error("Error inserting profile:", err);
            connection.release();
            return res.status(500).send("Error inserting profile");
          }
          res.status(200).send("Profile inserted successfully");
          connection.release();
        });
      } else {
        // If user exists, update the profile
        const updateQuery = `
          UPDATE crm_user_details 
          SET 
            fname = ?, mname = ?, lname = ?, p_email = ?, r_email = ?, p_ccode = ?, p_mob = ?, 
            health = ?, health_issue = ?, religion = ?, gender = ?, mstatus = ?, dob = ?, 
            aadhar_no = ?, pan_no = ?, join_date = ?, location = ?, pf_no = ?, 
            bank_name = ?, bank_branch = ?, ac_name = ?, account_no = ?, ifsc_code = ?, 
            profile_image = ?
          WHERE u_id = ?
        `;

        const updateValues = [
          fname, mname, lname, p_email, r_email, p_ccode, p_mob, health, health_issue, 
          religion, gender, mstatus, dob, aadhar_no, pan_no, join_date, location, pf_no, 
          bank_name, bank_branch, ac_name, account_no, ifsc_code, 
          imageFilename, u_id
        ];

        connection.query(updateQuery, updateValues, (err, result) => {
          if (err) {
            console.error("Error updating profile:", err);
            connection.release();
            return res.status(500).send("Error updating profile");
          }
          res.status(200).send("Profile updated successfully");
          connection.release();
        });
      }
    });
  });
});



// ProfileRouter.post("/update-profile-mobile-details", upload.single("profile_image"), (req, res) => {
//   const {
//     fname,
//     mname,
//     lname,
//     p_email,
//     r_email,
//     p_ccode,
//     p_mob,
//     health,
//     health_issue,
//     religion,
//     gender,
//     mstatus,
//     dob,
//     aadhar_no,
//     pan_no,
//     join_date,
//     location,
//     pf_no,
//     bank_name,
//     bank_branch,
//     ac_name,
//     account_no,
//     ifsc_code,
//     profile_image, 
//     pre_profile_image
//   } = req.body;

//   const u_id = req.session.user[0].u_id; // Assuming user ID is stored in the session
  
//   console.log(u_id,"hello test ID")

//   pool.getConnection((error, connection) => {
//     if (error) {
//       console.error("Database connection error:", error);
//       return res.status(500).send("Database connection error");
//     }

//       // Use the current image filename unless a new one is provided
//       let imageFilename = pre_profile_image || null;

//       // Step 2: Handle new image upload
//       if (profile_image) {
//         // If profile image is provided as base64
//         const base64Data = profile_image.replace(/^data:image\/\w+;base64,/, "");
//         const buffer = Buffer.from(base64Data, "base64");

//         const userFolder = path.join(__dirname, "./../../uploads/profile/", u_id.toString());

//         // Check if the folder exists, create it if not
//         if (!fs.existsSync(userFolder)) {
//           fs.mkdirSync(userFolder, { recursive: true });
//         }

//         // Generate a unique image file name (timestamp)
//         imageFilename = Date.now() + ".jpg";
//         const imagePath = path.join(userFolder, imageFilename);

//         // Write the image file to the server
//         fs.writeFileSync(imagePath, buffer, (err) => {
//           if (err) {
//             console.error("File write error:", err);
//             connection.release();
//             return res.status(500).send("Error saving the profile image");
//           }
//         });
//       } 
//       else if (req.file) {
//         // If profile image was uploaded via multer
//         const userFolder = path.join(__dirname, "./../../uploads/profile/", u_id.toString());

//         if (!fs.existsSync(userFolder)) {
//           fs.mkdirSync(userFolder, { recursive: true });
//         }

//         // The filename will be the one saved by multer
//         imageFilename = req.file.filename;
//       }
//       else {
//         // If no new image was provided, keep the current one
//         imageFilename = null;
//       }

//       // Step 3: Update the profile
//       const updateQuery = `
//         UPDATE crm_user_details 
//         SET 
//           fname = ?, mname = ?, lname = ?, p_email = ?, r_email = ?, p_ccode = ?, p_mob = ?, 
//           health = ?, health_issue = ?, religion = ?, gender = ?, mstatus = ?, dob = ?, 
//           aadhar_no = ?, pan_no = ?, join_date = ?, location = ?, pf_no = ?, 
//           bank_name = ?, bank_branch = ?, ac_name = ?, account_no = ?, ifsc_code = ?, 
//           profile_image = ?
//         WHERE u_id = ?
//       `;

//       const values = [
//         fname,
//         mname,
//         lname,
//         p_email,
//         r_email,
//         p_ccode,
//         p_mob,
//         health,
//         health_issue,
//         religion,
//         gender,
//         mstatus,
//         dob,
//         aadhar_no,
//         pan_no,
//         join_date,
//         location,
//         pf_no,
//         bank_name,
//         bank_branch,
//         ac_name,
//         account_no,
//         ifsc_code,
//         profile_image ? imageFilename : pre_profile_image, // Only update if new image is provided
//         u_id,
//       ];

//       connection.query(updateQuery, values, (err, result) => {
//         if (err) {
//           console.error("Error updating profile:", err);
//           res.status(500).send("Error updating profile");
//         } else {
//           res.status(200).send("Profile updated successfully");
//         }
//         connection.release();
//       });
//   });
// });


// ProfileRouter.post("/update-profile-details", async (req, res) => {
// console.log(req.body,"updated profile data mobile")
//   pool.getConnection(function (error, connection) {
//     console.log(error, "First");
//     if (error) throw error;
//     connection.query(
//       "SELECT ud_id FROM crm_user_details WHERE ?? = ?",
//       ["u_id", req.session.user[0].u_id],
//       async (err, result) => {
//         if (err) {
//           console.log(err, "First");
//           res.send("Something went wrong");
//         }
//         if (result.length === 0) {
//           // Insert new profile details (without image)
//           pool.getConnection(function (error, connection) {
//             if (error) throw error;
//             connection.query(
//               "INSERT INTO crm_user_details ( ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??) VALUES( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
//               [
//                 "u_id",
//                 "create_dt",
//                 "update_dt",
//                 "fname",
//                 "mname",
//                 "lname",
//                 "r_email",
//                 "p_email",
//                 "p_ccode",
//                 "p_mob",
//                 "health",
//                 "health_issue",
//                 "religion",
//                 "gender",
//                 "mstatus",
//                 "dob",
//                 "aadhar_no",
//                 "pan_no",
//                 "join_date",
//                 "location",
//                 "pf_no",
//                 "bank_name",
//                 "bank_branch",
//                 "ac_name",
//                 "account_no",
//                 "ifsc_code",
//                 req.session.user[0].u_id,
//                 req.body.DateTime,
//                 req.body.DateTime,
//                 req.body.data[0].fname,
//                 req.body.data[0].mname,
//                 req.body.data[0].lname,
//                 req.body.data[0].r_email,
//                 req.body.data[0].p_email,
//                 req.body.data[0].p_ccode,
//                 req.body.data[0].p_mob === null ? "" : req.body.data[0].p_mob,
//                 req.body.data[0].health,
//                 req.body.data[0].health_issue,
//                 req.body.data[0].religion,
//                 req.body.data[0].gender,
//                 req.body.data[0].mstatus,
//                 req.body.data[0].dob,
//                 req.body.data[0].aadhar_no,
//                 req.body.data[0].pan_no,
//                 req.body.data[0].join_date,
//                 req.body.data[0].location,
//                 req.body.data[0].pf_no,
//                 req.body.data[0].bank_name,
//                 req.body.data[0].bank_branch,
//                 req.body.data[0].ac_name,
//                 req.body.data[0].account_no,
//                 req.body.data[0].ifsc_code,
//               ],
//               (err, result) => {
//                 if (err) {
//                   console.log(err, "err");
//                   res.send("Something went wrong, please try again later");
//                 } else {
//                   res.send("Profile has been Updated Successfully");
//                 }
//                 connection.release();
//               }
//             );
//           });
//         } else {
//           // Update existing profile details (without image)
//           pool.getConnection(function (error, connection) {
//             if (error) throw error;
//             connection.query(
//               "UPDATE crm_user_details SET ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ? WHERE ?? = ?",
//               [
//                 "update_dt",
//                 req.body.DateTime,
//                 "fname",
//                 req.body.data[0].fname,
//                 "mname",
//                 req.body.data[0].mname,
//                 "lname",
//                 req.body.data[0].lname,
//                 "r_email",
//                 req.body.data[0].r_email,
//                 "p_email",
//                 req.body.data[0].p_email,
//                 "p_ccode",
//                 req.body.data[0].p_ccode,
//                 "p_mob",
//                 req.body.data[0].p_mob === null ? "" : req.body.data[0].p_mob,
//                 "health",
//                 req.body.data[0].health,
//                 "health_issue",
//                 req.body.data[0].health_issue,
//                 "religion",
//                 req.body.data[0].religion,
//                 "gender",
//                 req.body.data[0].gender,
//                 "mstatus",
//                 req.body.data[0].mstatus,
//                 "dob",
//                 req.body.data[0].dob,
//                 "aadhar_no",
//                 req.body.data[0].aadhar_no,
//                 "pan_no",
//                 req.body.data[0].pan_no,
//                 "join_date",
//                 req.body.data[0].join_date,
//                 "location",
//                 req.body.data[0].location,
//                 "pf_no",
//                 req.body.data[0].pf_no,
//                 "bank_name",
//                 req.body.data[0].bank_name,
//                 "bank_branch",
//                 req.body.data[0].bank_branch,
//                 "ac_name",
//                 req.body.data[0].ac_name,
//                 "account_no",
//                 req.body.data[0].account_no,
//                 "ifsc_code",
//                 req.body.data[0].ifsc_code,
//                 "u_id",
//                 req.session.user[0].u_id,
//               ],
//               (err, result) => {
//                 if (err) {
//                   console.log(err, "errlast");
//                   res.send("Something went wrong");
//                 } else {
//                   res.send("Profile has been Updated Successfully");
//                 }
//                 connection.release();
//               }
//             );
//           });
//         }
//         connection.release();
//       }
//     );
//   });
// });

ProfileRouter.post("/get-profile-details", (req, res) => {
  pool.getConnection(function (error, connection) {
    if (error) throw error;
    connection.query(
      "SELECT u_id, fname, mname, lname, r_email, p_email, p_ccode, p_mob,health, health_issue, religion, gender, mstatus, dob, aadhar_no, pan_no, join_date, location, pf_no, bank_name, bank_branch, ac_name, account_no, ifsc_code,  profile_image FROM crm_user_details WHERE ?? = ?",
      ["u_id", req.session.user[0].u_id],
      (err, result) => {
        if (err) {
          res.send("Something went wrong");
        } else {
          res.send(result);
        }
        connection.release();
      }
    );
  });
});

ProfileRouter.post("/get-all-profile-details", (req, res) => {
  pool.getConnection(function (error, connection) {
    if (error) throw error;
    connection.query(
      "SELECT u_id, fname, mname, lname, r_email, p_email, p_ccode, p_mob,profile_image,u_id FROM crm_user_details",
      (err, result) => {
        if (err) {
          res.send("Something went wrong");
        } else {
          res.send(result);
        }
        connection.release();
      }
    );
  });
});

ProfileRouter.post("/profile-by-id", (req, res) => {
  pool.getConnection(function (error, connection) {
    if (error) throw error;
    console.log(req.body.u_id);
    connection.query(
      "SELECT u_id, fname, mname, lname, r_email, p_email, p_ccode, p_mob, health, health_issue, religion, gender, mstatus, dob, aadhar_no, pan_no, join_date,  location, pf_no, bank_name, bank_branch, ac_name, account_no, ifsc_code,   profile_image FROM crm_user_details WHERE u_id = ? ",
      [req.body.u_id],
      (err, result) => {
        if (err) {
          console.log(err);
          throw err;
        } else {
          res.send(result);
        }
        connection.release();
      }
    );
  });
});


// for ES5
module.exports = ProfileRouter;
