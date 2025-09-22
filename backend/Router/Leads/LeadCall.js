const express = require("express");
const pool = require("../../Database.js");
const dayjs = require("dayjs");

const LeadCallRouter = express.Router();

LeadCallRouter.post("/add-call-lead-history", (req, res) => {
    console.log(req.body)
})

module.exports = LeadCallRouter;