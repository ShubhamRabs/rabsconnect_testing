const express = require("express");
const pool = require("../../Database.js");
const dayjs = require("dayjs");
const customParseFormat = require('dayjs/plugin/customParseFormat');
dayjs.extend(customParseFormat);

const LeadCallRouter = express.Router();

LeadCallRouter.post("/add-call-lead-history", (req, res) => {
  // const user_id = req.session.user[0].u_id;
  let parsedDateTime = dayjs(req.body.data[0].dateTime, "DD-MMM-YYYY HH:mm:ss");
  let formattedDateTime;
  const dateStrings = [req.body.data[0].dateTime];

// Function to parse date with flexible formats
const parseDate = (dateString) => {
  // Commonly expected date formats (add more formats as needed)
  const commonFormats = [
  'DD-MMM-YYYY HH:mm:ss',         // 18-Jun-2024 18:57:35
  'MMM DD, YYYY h:mm:ss A',       // Jun 18, 2024 6:53:07 PM
  'YYYY-MM-DD HH:mm:ss',          // 2024-06-18 18:57:35
  'YYYY-MM-DDTHH:mm:ssZ',         // 2024-06-18T18:57:35Z
  'YYYY-MM-DDTHH:mm:ss.SSSZ',     // 2024-06-18T18:57:35.123Z
  'YYYY-MM-DD HH:mm:ss.SSS',      // 2024-06-18 18:57:35.123
  'YYYY-MM-DDTHH:mm:ss',          // 2024-06-18T18:57:35
  'YYYY-MM-DDTHH:mm:ss.SSSSSSZ',  // 2024-06-18T18:57:35.123456Z
  'DD/MM/YYYY HH:mm:ss',          // 18/06/2024 18:57:35
  'MM/DD/YYYY h:mm:ss A',         // 06/18/2024 6:53:07 PM
  'DD MMM YYYY HH:mm:ss',         // 18 Jun 2024 18:57:35
  'MMM DD YYYY h:mm:ss A',        // Jun 18 2024 6:53:07 PM
  'YYYY/MM/DD HH:mm:ss',          // 2024/06/18 18:57:35
  'YYYY.MM.DD HH:mm:ss',          // 2024.06.18 18:57:35
  'MMM DD, YYYY HH:mm:ss',
];

  // Try each format until one succeeds
  for (let format of commonFormats) {
    const parsedDate = dayjs(dateString, format);
    if (parsedDate.isValid()) {
      return parsedDate.format('YYYY-MM-DD HH:mm:ss');
    }
  }

  // If no format matches, return null or handle as needed
  return null;
};

// Process each date string from the call logs
dateStrings.forEach(dateString => {
  formattedDateTime = parseDate(dateString);
  console.log(`${dateString} -> ${formattedDateTime}`);
});
  pool.getConnection(function (error, connection) {
    if (error) throw error;
    connection.query(
      "SELECT * FROM crm_call_history WHERE phone_number = ? AND call_duration = ? AND u_id =? AND l_id = ? AND call_timestamp = ?",
      [
        req.body.data[0].phoneNumber,
        req.body.data[0].duration,
        req.session.user[0].u_id,
        req.body.data[0].l_id,
        req.body.data[0].timestamp,
      ],
      (err, result) => {
        if (err) {
            console.log("date error", err);
            res.send(err);
            }
        else {    
        if (result.length > 0) {
          res.send("Data Already Exists");
        } else {
          connection.query(
            "INSERT INTO crm_call_history(??, ??, ??, ??, ??,??) VALUES(?,?,?,?,?,?)",
            [
              "call_datetime",
              "phone_number",
              "call_duration",
              "u_id",
              "l_id",
              "call_timestamp",
              formattedDateTime || dayjs(req.body.data[0].dateTime).format('YYYY-MM-DD HH:mm:ss'),
              req.body.data[0].phoneNumber,
              req.body.data[0].duration,
              req.session.user[0].u_id,
              req.body.data[0].l_id,
              req.body.data[0].timestamp,
            ],
            (err1, result1) => {
              if (err1) {
                console.log("date", req.body);
                res.send(err);
              } else {
                res.send("Call is Added");
              }
              connection.release();
            }
          );
        }
        }
      }
    );
  });
});

LeadCallRouter.post("/get-call-lead-history", (req, res) => {
    const role = req.session.user[0].urole;
    // console.log("hello data",req.body.data);
    if (role === "Master" || role === "Admin") {
    pool.getConnection(function (error, connection) {
        console.log("hello")
      if (error) throw error;
      connection.query(
        "SELECT crm_call_history.*,cu.username FROM crm_call_history LEFT JOIN crm_users cu ON crm_call_history.u_id = cu.u_id WHERE l_id IN (SELECT lreq_id FROM crm_lead_req_details WHERE l_id = ? ) OR l_id = ? ORDER BY call_datetime DESC",
        [
          req.body.data.lid,
          req.body.data.lid,
        //   req.session.user[0].u_id,
          ],
        (err, result) => {
          if (err) {
            console.log("date",req.body);
            res.send(err);
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
        "SELECT *,cu.username FROM crm_call_history LEFT JOIN crm_users cu ON crm_call_history.u_id = cu.u_id WHERE l_id IN (SELECT crm_lead_req_details.l_id FROM crm_lead_req_details WHERE crm_lead_req_details.lreq_id = ?) AND (crm_call_history.u_id = ? OR crm_call_history.u_id IN (SELECT crm_lead_req_details.assignto_id FROM crm_lead_req_details WHERE crm_lead_req_details.assignby_id = ?)) ORDER BY call_datetime DESC",
        [
          req.body.data.lid,
          req.session.user[0].u_id,
          req.session.user[0].u_id,
          ],
        (err, result) => {
          if (err) {
            console.log("date",req.body);
            res.send(err);
          } else {
            res.send(result);
          }
          connection.release();
        }
      );
    });
    }
});

module.exports = LeadCallRouter;