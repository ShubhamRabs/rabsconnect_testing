// for ES5
const express = require("express");
const pool = require("../../Database.js");

const LocalityRouter = express.Router();

LocalityRouter.post("/get-all-locality", (req, res) => {
  // Define an array to hold the columns to be selected

  let query = "";
    query = "SELECT DISTINCT locality FROM crm_lead_primary_details WHERE locality != '' UNION SELECT DISTINCT locality FROM crm_lead_req_details WHERE locality != ''";
  // Acquire a database connection
  pool.getConnection(function (error, connection) {
    if (error) throw error;
    // Execute the SQL query
    connection.query(query, (err, result) => {
      if (err) {
        console.log(err);
      } else {
        // Send the query result as a JSON response
        let locality = new Set();
        result.forEach(element => {
          if (element.locality.includes(",")) {
            elementArray = element.locality.split(",");
            elementArray.forEach(localityNames => {
              locality.add(localityNames);
            })
          }
          else {
            locality.add(element.locality);
          }
        });
        locality = Array.from(locality);
        let results = locality.map(elem => ({locality: elem}))
        // console.log("locality",results);
        res.json(results);
      }
      // Release the database connection
      connection.release();
    });
  });
});
// for ES5
module.exports = LocalityRouter;
