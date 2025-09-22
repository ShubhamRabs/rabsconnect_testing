// for ES5
const express = require('express');
const pool = require('../../Database.js');
const dayjs = require('dayjs');

const LocationRouter = express.Router();

LocationRouter.post('/add-location', (req, res) => {
  console.log(req.body.data);
  const current_date = dayjs().format('YYYY-MM-DD HH:mm:ss');
  const user_id = req.session.user[0].u_id;
  const lat = req.body.data.latitude;
  const long = req.body.data.longitude;
  pool.getConnection(function (error, connection) {
    if (error) {
      throw error;
    }
    connection.query(
      'INSERT INTO `crm_users_location`(`u_id`, `latitude`, `longitude`, `datetime`) VALUES (?,?,?,?)',
      [user_id, lat, long, current_date],
      (err, result) => {
        if (err) {
          console.log(error);
        } else {
          // console.log(result);
          res.send('location Added');
        }
        connection.release();
      },
    );
  });
});

// for ES5
module.exports = LocationRouter;
