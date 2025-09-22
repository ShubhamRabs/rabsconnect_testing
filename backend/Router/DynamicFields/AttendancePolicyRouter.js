const express = require("express");
const dayjs = require("dayjs");
const customParseFormat = require('dayjs/plugin/customParseFormat');

const pool = require("../../Database.js");

const AttendancePolicyRouter = express.Router();

dayjs.extend(customParseFormat);

AttendancePolicyRouter.post("/get-all-attendance-policy", (req, res) => {
  // Define an array to hold the columns to be selected
  let columns;
  // Check if the 'columns' parameter is provided in the request body
  if (req.body.columns === undefined) {
    // If not provided, use default columns
    columns = [
      "ap_id as id",
      "create_dt",
      "update_dt",
      "title",
      "policy",
      "status",
      "color",
    ];
  } else {
    // If provided, split the comma-separated string and trim each element
    columns = req.body.columns;
  }
  // Acquire a database connection
  pool.getConnection(function (error, connection) {
    if (error) throw error;
    // Use a template literal to dynamically create the SQL query
    const query = `SELECT ${columns.join(
      ", "
    )} FROM crm_users_attendance_policy`;
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

AttendancePolicyRouter.post("/edit-attendance-policy", (req, res) => {
  let { title, policy, status,start_date,color} = req.body.data;
  let updatedPolicy = policy;
  if (title === 'Public Holidays') {
    if (Array.isArray(policy)) {
      let holidaypolicy = policy.map(date => {
        let splitDate = date.includes(':') ? date.split(':')[0] : "";
        let holidayTitle = date.includes(':') ? date.split(':')[1] : "Holiday";  
        const timeStampdate = new Date(splitDate);
        const formattedDate = dayjs(timeStampdate).format('MM/DD/YYYY');
        return `${formattedDate}:${holidayTitle}`
      });
      holidaypolicy = holidaypolicy.join(',');
      updatedPolicy = holidaypolicy;
    }
  }
  else if (title === "Weekly OFF") {
    if (Array.isArray(policy)) {
      updatedPolicy = policy.join(',');
    }
  }
  else if (title === "Late Mark") {
    const { latemarkintime, latemarkouttime } = req.body.data;
    updatedPolicy = `${latemarkintime},${latemarkouttime}`;
  }
  else if (title === "Forgot to Logout") {
    updatedPolicy = '';
  }
  else if (title === "Intime" || title === "Outtime") {
    updatedPolicy = dayjs(`1970-01-01 ${policy}`).format('hh:mm A');
  }
   else if (title === "Salary Month") {
    console.log("body", req.body.data);
    updatedPolicy = start_date;
    color ='';
    status ='';
  }
  pool.getConnection(function (error, connection) {
    if (error) throw error;
    connection.query(
      "UPDATE crm_users_attendance_policy SET ?? = ?, ?? = ?, ?? = ?,?? = ?  WHERE ?? = ?",
      [
        "update_dt",
        req.body.DateTime,
        "policy",
        updatedPolicy,
        "color",
        color,
        "status",
        status,
        "ap_id",
        req.body.data.id,
      ],
      (err, result) => {
        if (err) {
          res.send("Some Error Occured While Updating Attendance Policy");
        } else {
          res.send("Attendance Policy Updated Successfully");
        }
        connection.release();
      }
    );
  });
});

// for ES5
module.exports = AttendancePolicyRouter;
