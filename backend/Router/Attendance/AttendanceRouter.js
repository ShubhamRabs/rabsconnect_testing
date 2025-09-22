// for ES5
const express = require("express");
const pool = require("../../Database.js");
const customParseFormat = require("dayjs/plugin/customParseFormat");
const fs = require("fs");

const dayjs = require("dayjs");
const utc = require("dayjs/plugin/utc");
const timezone = require("dayjs/plugin/timezone");

dayjs.extend(utc);
dayjs.extend(timezone);

const DubaiDateTime = new Date().toLocaleString("en-US", {
  timeZone: "Asia/Dubai",
});

const system_date = dayjs().format("YYYY-MM-DD");
const system_time = dayjs().format("HH:mm:ss");

dayjs.extend(customParseFormat);

const AttendanceRouter = express.Router();

function calculateTotalLoggedTime(logsArr) {
  let totalMilliseconds = 0;

  for (let i = 0; i < logsArr.length; i++) {
    const loginTime = logsArr[i].login_time;
    let logoutTime = logsArr[i].logout_time;

    if (logoutTime === "00:00:00") {
      const currentDubaiDateTime = dayjs().tz("Asia/Dubai").format("HH:mm:ss");
      logoutTime = currentDubaiDateTime;
    }

    // Parse login and logout times as dayjs objects
    const loginDateTime = dayjs(
      `2000-01-01T${loginTime}`,
      "YYYY-MM-DDTHH:mm:ss"
    );
    const logoutDateTime = dayjs(
      `2000-01-01T${logoutTime}`,
      "YYYY-MM-DDTHH:mm:ss"
    );

    // Calculate time difference in milliseconds
    const timeDifference = logoutDateTime.diff(loginDateTime);

    // Accumulate total time difference
    totalMilliseconds += timeDifference;
  }

  // Convert total milliseconds to minutes and seconds
  const totalMinutes = Math.floor(totalMilliseconds / (1000 * 60));
  const seconds = Math.floor((totalMilliseconds % (1000 * 60)) / 1000);

  // Convert total minutes and seconds to HH:MM:SS format
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  const formattedTime = `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

  return formattedTime;
}


AttendanceRouter.post("/attendance-status", (req, res) => {
  let logout_date = "0000-00-00";
  let logout_time = "00:00:00";

  const commentDt = new Date().toLocaleString("en-US", {
    timeZone: "Asia/Dubai",
  });

  pool.getConnection(function (error, connection) {
    if (error) throw error;
    connection.query(
      "SELECT * FROM `crm_users_attendance` WHERE ?? = ? AND ?? = ?",
      [
        "u_id",
        req.session.user[0].u_id,
        "login_date",
        dayjs(commentDt).format("YYYY-MM-DD"),
        // "logout_date",
        // logout_date,
        // "logout_time",
        // logout_time,
      ],
      (err, result) => {
        if (err) {
          res.send(err);
          console.log(err);
        } else {
          if (
            result.length > 0 &&
            result[result.length - 1].logout_time === logout_time
          ) {
            const totalTime = calculateTotalLoggedTime(result);
            console.log(totalTime,"totalTime")
            result[0].totalTime = totalTime.includes("-") ? "00:00:00" : totalTime;
            res.send(result);
          } else {
            res.send("Need to Add Do Intime");
          }
        }
        connection.release();
      }
    );
  });
});

AttendanceRouter.post("/fetch-all-users", (req, res) => {
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

  if (
    user_role === "Master" ||
    user_role === "Admin" ||
    user_role === "HR Head"
  ) {
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
  } else if (user_role === "HR" || user_role === "Tele Caller") {
    pool.getConnection(function (error, connection) {
      if (error) throw error;
      connection.query(
        "SELECT u_id as id, create_dt, update_dt, username, utype, urole, branch_id, ba_id, tl_id, sm_id, create_by, device_token, session_id, module_privilege FROM crm_users WHERE ?? = ?",
        ["u_id", user_id],
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
        "SELECT u_id as id, create_dt, update_dt, username, utype, urole, branch_id, ba_id, tl_id, sm_id, create_by, device_token, session_id, module_privilege FROM crm_users WHERE ?? = ? OR ?? = ?",
        [column, value, "u_id", value],
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

AttendanceRouter.post("/get-today-all-users-attendance", (req, res) => {
  const user_role = req.session.user[0].urole;

  if (user_role === "Master" || user_role === "Admin") {
    pool.getConnection(function (error, connection) {
      if (error) throw error;
      connection.query(
        "SELECT * FROM crm_users WHERE utype='Employee' ",
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
  } else {
    pool.getConnection(function (error, connection) {
      if (error) throw error;
      connection.query(
        "SELECT * FROM crm_users WHERE utype='Employee' ",
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
  }
});

AttendanceRouter.post("/upadte-user-attendance", (req, res) => {
  const ImgName = "" + dayjs().format("DD-MM-YYYY-hh-mm-ss") + ".png";

  const commentDt = new Date().toLocaleString("en-US", {
    timeZone: "Asia/Dubai",
  });

  let logout_date = "0000-00-00";
  let logout_time = "00:00:00";

  if (req.body.status !== "Need to Add Do Intime") {
    pool.getConnection(function (error, connection) {
      if (error) throw error;
      connection.query(
        "UPDATE crm_users_attendance SET ?? = ?, ?? = ?, ?? = ?, ?? = ? WHERE ?? = ? AND ?? = ? AND ?? = ? AND ?? = ?",
        [
          "logout_date",
          dayjs(commentDt).format("YYYY-MM-DD"),
          "logout_time",
          dayjs(commentDt).format("HH:mm:ss"),
          "desk_image_logout",
          ImgName,
          "logout_location",
          req.body.location,
          "u_id",
          req.session.user[0].u_id,
          "login_date",
          dayjs(commentDt).format("YYYY-MM-DD"),
          "logout_date",
          logout_date,
          "logout_time",
          logout_time,
        ],
        (err, result) => {
          if (err) {
            res.send(err);
            console.log(err);
          } else {
            let base64Image;
            if (req.body.UserImage.includes("base64")) {
              base64Image = req.body.UserImage.split(";base64,").pop();
            } else {
              base64Image = req.body.UserImage;
            }

            fs.writeFile(
              "./uploads/Attendance/" +
                req.session.user[0].u_id +
                "/" +
                ImgName,
              base64Image,
              { encoding: "base64" },
              function (err) {
                console.log(err);
              }
            );
            res.send("Need to Add Do Intime");
          }
          connection.release();
        }
      );
    });
  } else {
    pool.getConnection(function (error, connection) {
      if (error) throw error;
      connection.query(
        "INSERT INTO crm_users_attendance (??, ??, ??, ??, ??, ??) VALUES(?,?,?,?,?,?)",
        [
          "u_id",
          "system_ip",
          "login_date",
          "login_time",
          "desk_image_login",
          "login_location",
          req.session.user[0].u_id,
          req.body.system_ip,
          dayjs(commentDt).format("YYYY-MM-DD"),
          dayjs(commentDt).format("HH:mm:ss"),
          ImgName,
          req.body.location,
        ],
        (err, result) => {
          if (err) {
            res.send(err);
            console.log(err);
          } else {
            let base64Image;
            if (req.body.UserImage.includes("base64")) {
              base64Image = req.body.UserImage.split(";base64,").pop();
            } else {
              base64Image = req.body.UserImage;
            }
            fs.writeFile(
              "./uploads/Attendance/" +
                req.session.user[0].u_id +
                "/" +
                ImgName,
              base64Image,
              { encoding: "base64" },
              function (err) {
                console.log(err);
              }
            );
            pool.getConnection(function (error, connection) {
              if (error) throw error;
              connection.query(
                "SELECT * FROM `crm_users_attendance` WHERE ?? = ? AND ?? = ? AND ?? = ? And ?? = ?",
                [
                  "u_id",
                  req.session.user[0].u_id,
                  "login_date",
                  dayjs(commentDt).format("YYYY-MM-DD"),
                  "logout_date",
                  logout_date,
                  "logout_time",
                  logout_time,
                ],
                (err, result) => {
                  if (err) {
                    console.log(err);
                  } else {
                    if (result.length > 0) {
                      res.send(result);
                    } else {
                      res.send("Need to Add Do Intime");
                    }
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
});

AttendanceRouter.post("/add-edit-user-attendance", (req, res) => {
  const user_role = req.session.user[0].urole;
  if (user_role === "Master") {
    const logDate = dayjs(req.body.data.login_date, "DD-MM-YYYY").format(
      "YYYY-MM-DD"
    );
    if (req.body.data.type === "edit") {
      pool.getConnection(function (error, connection) {
        if (error) throw error;
        connection.query(
          "UPDATE crm_users_attendance SET ?? = ?, ?? = ?, ?? = ? WHERE ?? = ?",
          [
            "login_time",
            req.body.data.login_time,
            "logout_time",
            req.body.data.logout_time,
            "logout_date",
            logDate,
            "auid",
            req.body.data.auid,
          ],
          (err, result) => {
            if (err) {
              console.log(err);
            } else {
              // res.send("Need to Add Do Intime");
              res.send("Attendance updated successfully");
            }
            connection.release();
          }
        );
      });
    } else {
      pool.getConnection(function (error, connection) {
        if (error) throw error;
        connection.query(
          "INSERT INTO crm_users_attendance (??, ??, ??, ??, ??, ??) VALUES(?,?,?,?,?,?)",
          [
            "u_id",
            "system_ip",
            "login_date",
            "logout_date",
            "login_time",
            "logout_time",
            req.body.data.u_id,
            req.ip,
            logDate,
            logDate,
            req.body.data.login_time,
            req.body.data.logout_time,
          ],
          (err, result) => {
            if (err) {
              console.log(err);
            } else {
              // res.send("Need to Add Do Intime");
              res.send("Attendance Added successfully");
            }
            connection.release();
          }
        );
      });
    }
  } else {
    res.send("You do not have access to edit Attendance");
  }
});

AttendanceRouter.post("/delete-user-attendance", (req, res) => {
  const user_role = req.session.user[0].urole;
  // console.log("req.body.data.auid", req.body);
  if (user_role === "Master") {
    pool.getConnection(function (error, connection) {
      if (error) throw error;
      connection.query(
        "DELETE FROM crm_users_attendance WHERE ?? = ?",
        ["auid", req.body.data],
        (err, result) => {
          if (err) {
            console.log(err);
          } else {
            // res.send("Need to Add Do Intime");
            // console.log("Deleted Successfully");
            res.send("Attendance Deleted Successfully");
          }
          connection.release();
        }
      );
    });
  } else {
    res.send("You do not have access to Delete Attendance");
  }
});

// AttendanceRouter.post("/attendance-status", (req, res) => {
//   let logout_date = "0000-00-00";
//   let logout_time = "00:00:00";

//   pool.getConnection(function (error, connection) {
//     if (error) throw error;
//     connection.query(
//       "SELECT * FROM `crm_users_attendance` WHERE ?? = ? AND ?? = ? AND ?? = ? And ?? = ?",
//       [
//         "u_id",
//         req.session.user[0].u_id,
//         "login_date",
//         dayjs(commentDt).format("YYYY-MM-DD"),
//         "logout_date",
//         logout_date,
//         "logout_time",
//         logout_time,
//       ],
//       (err, result) => {
//         if (err) {
//           console.log(err);
//         } else {
//           if (result.length > 0) {
//             res.send(result);
//           } else {
//             res.send("Need to Add Do Intime");
//           }
//         }
//         connection.release();
//       }
//     );
//   });
// });

AttendanceRouter.post("/get-filter-user-attendance-data", (req, res) => {
  let logout_date = "0000-00-00";
  let logout_time = "00:00:00";

  console.log(req.body.data);

  pool.getConnection(function (error, connection) {
    if (error) throw error;
    connection.query(
      "SELECT * FROM `crm_users_attendance` WHERE ?? = ? AND (?? BETWEEN ? AND ? OR ?? BETWEEN ? AND ?)",
      [
        "u_id",
        req.body.data.user,
        "login_date",
        req.body.data.start_date,
        req.body.data.end_date,
        // req.body.data.start_date,
        "logout_date",
        req.body.data.start_date,
        req.body.data.end_date,
      ],
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
});

AttendanceRouter.post("/get-attendance-data-for-payslip", (req, res) => {
  const {
    data: userId,
    start_date: startDate,
    end_date: endDate,
  } = req.body.data;
  console.log(req.body.data, "result");
  console.log(userId, startDate, endDate, "result");

  // Check if the required fields are present and valid
  if (!userId || !startDate || !endDate) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  // Convert the start and end dates to the correct format if needed
  // Example: Convert ISO string to local date string
  const formattedStartDate = new Date(startDate)
    .toISOString()
    .slice(0, 19)
    .replace("T", " ");
  const formattedEndDate = new Date(endDate)
    .toISOString()
    .slice(0, 19)
    .replace("T", " ");

  pool.getConnection(function (error, connection) {
    if (error) {
      console.error("Database connection error:", error);
      return res.status(500).json({ error: "Database connection error" });
    }

    connection.query(
      "SELECT * FROM `crm_users_attendance` WHERE `u_id` = ? AND ((`login_date` BETWEEN ? AND ?) OR (`logout_date` BETWEEN ? AND ?))",
      [
        userId,
        formattedStartDate,
        formattedEndDate,
        formattedStartDate,
        formattedEndDate,
      ],
      (err, result) => {
        connection.release(); // Ensure connection is released even if there's an error

        if (err) {
          console.error("Query error:", err);
          return res.status(500).json({ error: "Query error" });
        }
        console.log(result, "result");
        res.json(result);
      }
    );
  });
});

// AttendanceRouter.post("/get-attendance-data-for-payslip", (req, res)=> {
//   let logout_date = "0000-00-00";
//   let logout_time = "00:00:00";

//   console.log(req.body.data)

//   pool.getConnection(function (error, connection) {
//     if (error) throw error;
//     connection.query(
//       "SELECT * FROM `crm_users_attendance` WHERE ?? = ? AND (?? BETWEEN ? AND ? OR ?? BETWEEN ? AND ?)",
//       [
//         "u_id",
//         req.body.data.user,
//         "login_date",
//         req.body.data.start_date,
//         req.body.data.end_date,
//         // req.body.data.start_date,
//         "logout_date",
//         req.body.data.start_date,
//         req.body.data.end_date,
//       ],
//       (err, result) => {
//         if (err) {
//           console.log(err);
//         } else {
//           res.send(result);

//         }
//         connection.release();
//       }
//     );
//   });
// })

AttendanceRouter.get("/get-attendance-policy", (req, res) => {
  pool.getConnection(function (error, connection) {
    if (error) throw error;
    connection.query(
      "SELECT * FROM `crm_users_attendance_policy`",
      (err, result) => {
        if (err) {
          console.log(err);
        } else {
          if (result.length > 0) {
            let policy = {};
            result.forEach((elem) => {
              policy[elem.title] = {
                policy: elem.policy,
                status: elem.status,
                color: elem.color,
              };
            });
            // console.log(policy);
            res.send(policy);
          } else {
            res.send("Attendance Policy not found");
          }
        }
        connection.release();
      }
    );
  });
});

// for ES5
module.exports = AttendanceRouter;
