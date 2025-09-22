const express = require("express");
const pool = require("../../Database.js");

const CredentialsRouter = express.Router();

CredentialsRouter.get("/get-all-crm-credentials", async (req, res) => {
    pool.getConnection(function (error, connection) {
        if (error) throw error;
        connection.query(
            "SELECT * FROM crm_credentials",
            (err, result) => {
                if (err) {
                    console.log(err);
                } else {
                    console.log("result", result);
                    res.json(result);
                }
                connection.release();
            }
        );
    });
});

module.exports = CredentialsRouter;