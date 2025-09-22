// for ES5
const express = require("express");
const axios = require('axios');
const pool = require("../../Database.js");
const qs = require('qs'); 

const ApiDataRouter = express.Router();

ApiDataRouter.post("/get-all-push-api-data", async (req, res) => {
  const data = {...{'client_code': ''+req.session.user[0].client_code+''},...req.body};
  // console.log(data, "data"); 
  try {
    const response = await axios.post("https://rabsdigital.com/api/pull_client_data.php", data, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    // console.log('response',response.data);
    res.json({
      api_key: response.data,
    });
  } catch (error) { 
    console.error("Error while fetching : ", error);
    res.status(500).json({ message: "Failed to fetch data" });
  }
});

// for ES5
module.exports = ApiDataRouter;
