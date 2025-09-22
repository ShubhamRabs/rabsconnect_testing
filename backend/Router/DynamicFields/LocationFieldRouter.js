const express = require("express");
const pool = require("../../Database.js");

const LocationFieldRouter = express.Router();

// Get all location fields
LocationFieldRouter.post("/get-all-location-field", (req, res) => {
  let columns;
  if (req.body.columns === undefined) {
    columns = ["location_sid as id", "create_dt", "update_dt", "location_name"];
  } else {
    columns = req.body.columns;
  }
  pool.getConnection((error, connection) => {
    if (error) throw error;
    const query = `SELECT ${columns.join(", ")} FROM crm_location`;
    connection.query(query, (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.json(result);
      }
      connection.release();
    });
  });
});

// Add a new location field
LocationFieldRouter.post("/add-location-field", (req, res) => {
  pool.getConnection((error, connection) => {
    if (error) throw error;
    connection.query(
      "INSERT INTO crm_location (create_dt, update_dt, location_name) VALUES(?, ?, ?)",
      [
        req.body.DateTime,
        req.body.DateTime,
        req.body.data.location_name
      ],
      (err, result) => {
        if (err) {
          res.send("Location Field with the same name already exists");
        } else {
          res.send("Location Field Added Successfully");
        }
        connection.release();
      }
    );
  });
});

// Edit a location field
LocationFieldRouter.post("/edit-location-field", (req, res) => {
  pool.getConnection((error, connection) => {
    if (error) throw error;
    connection.query(
      "UPDATE crm_location SET update_dt = ?, location_name = ? WHERE location_sid = ?",
      [
        req.body.DateTime,
        req.body.data.location_name,
        req.body.data.id
      ],
      (err, result) => {
        if (err) {
          res.send("Error updating location field");
        } else {
          res.send("Location Field Updated Successfully");
        }
        connection.release();
      }
    );
  });
});

// Delete a location field
LocationFieldRouter.post("/delete-location-field", (req, res) => {
  pool.getConnection((error, connection) => {
    if (error) throw error;
    connection.query(
      "DELETE FROM crm_location WHERE location_sid = ?",
      [req.body.location_sid],
      (err, result) => {
        if (err) {
          console.log(err);
        } else {
          res.send("Location Field Deleted Successfully");
        }
        connection.release();
      }
    );
  });
});

module.exports = LocationFieldRouter;
