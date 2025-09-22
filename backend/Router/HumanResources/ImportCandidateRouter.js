// for ES5
const express = require("express");
const pool = require("../../Database.js");
const dayjs = require("dayjs");

const ImportCandidateRouter = express.Router();

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

ImportCandidateRouter.post("/import-hr-head-candidate", (req, res) => {
  const data = req.body.data;
  const values = [];

  // Check if all columns exist in CSV
  const keysToCheck = [
    "create_dt",
    "update_dt",
    "c_name",
    "c_email",
    "c_ccode",
    "c_mob",
    "c_source",
    "c_position",
    "c_status",
    "country",
    "state",
    "city",
    "locality",
    "followup",
    "followup_dt",
    "comments",
  ];

  const allKeysExist = keysToCheck.every((key) => data[0].hasOwnProperty(key));

  if (allKeysExist === false || keysToCheck.length !== Object.keys(data[0]).length) {
    // console.log("Incorrect File Format");
    res.status(400).json({ message: "Incorrect File, Please Download Fresh CSV File", error: "Incorrect File Format" });
    return;
  }

  pool.getConnection(function (error, connection) {
    if (error) throw error;
    let rowcount = 1;
    for (const {
      create_dt,
      update_dt,
      c_name,
      c_email,
      c_ccode,
      c_mob,
      c_source,
      c_position,
      c_status,
      country,
      state,
      city,
      locality,
      followup,
      followup_dt,
      comments,
    } of data) {

      let formattedCreateDt = formatDate(create_dt);
      let formattedUpdateDt = formatDate(update_dt);

      rowcount++;

      // check if all fields are empty
      if(create_dt === "" && update_dt === "" && c_name === "" && c_ccode === "" && c_mob === "" && c_source ==="" && c_position === "" && c_status === "" && country === "" && state === "" && city === "" && locality === "" && followup === "" && followup_dt === "" && comments === ""){
        // console.log("No Data Found");
        continue;
      }else if((followup === "Yes" && followup_dt === "")){
        res.status(400).json({ message: `followup_dt is missing at row no ${rowcount}` , error: "followup_dt Not Found" });
        return;
      }else if((followup === "" && followup_dt !== "")){
          res.status(400).json({ message: `followup is missing at row no ${rowcount}` , error: "followup Not Found" });
          return;   
      }else{  

        values.push({
          create_dt: formattedCreateDt,
          update_dt: formattedUpdateDt,
          c_name,
          c_email,
          c_ccode,
          c_mob,
          c_source,
          c_position,
          c_status,
          country,
          state,
          city,
          locality,
          followup,
          followup_dt,
          comments,
        });

      }  
    }
    if(values.length > 0){
      const query =
        "INSERT INTO crm_candidate_details ( create_dt, update_dt, created_by, c_name, c_email, c_ccode, c_mob, c_source, c_position, c_status, country, state, city, locality, followup, followup_dt, comments) VALUES ?";
      connection.query(
        query,
        [
          values.map((item) => [
            item.create_dt,
            item.update_dt,
            req.body.login_u_id,
            item.c_name,
            item.c_email,
            item.c_ccode,
            item.c_mob,
            item.c_source,
            item.c_position,
            item.c_status,
            item.country,
            item.state,
            item.city,
            item.locality,
            item.followup,
            item.followup_dt,
            item.comments,
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
    }else{
      res.status(400).json({ message: `No data found in csv file` , error: "No data Found" });
    }  
  });
});

// for ES5
module.exports = ImportCandidateRouter;
