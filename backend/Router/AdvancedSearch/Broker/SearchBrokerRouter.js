const express = require("express");
const pool = require("../../../Database.js");

const SearchBrokerRouter = express.Router();

SearchBrokerRouter.post("/search-broker", (req, res) => {
  const user_role = req.session.user[0].urole;
  const user_id = req.session.user[0].u_id;

  const { page, pageSize } = req.query;
  const offset = (page - 1) * pageSize;
  const limit = parseInt(pageSize);

  const {
    location, // Assuming this is the field for broker location
    anytext,
  } = req.body.data;

  pool.getConnection((error, connection) => {
    if (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }

    // Constructing the SQL query
    let query = `
      SELECT 
          crm_broker_details.brk_id,
          crm_broker_details.u_id,
          crm_broker_details.create_dt,
          crm_broker_details.update_dt,
          crm_broker_details.name,
          crm_broker_details.email,
          crm_broker_details.ccode,
          crm_broker_details.mob,
          CONCAT(crm_broker_details.ccode, ' ', crm_broker_details.mob) AS mobile,
          crm_broker_details.company,
          crm_broker_details.rera_no,
          crm_broker_details.brk_location,
          crm_broker_details.remark,
          crm_users.username AS createdby
      FROM 
          crm_broker_details 
      LEFT JOIN 
          crm_users ON crm_users.u_id = crm_broker_details.u_id 
      WHERE 
          brk_id != '' 
          AND LOWER(crm_broker_details.brk_location) LIKE ? 
          AND (
              LOWER(crm_broker_details.brk_id) LIKE ? OR
              LOWER(crm_broker_details.name) LIKE ? OR
              LOWER(crm_broker_details.email) LIKE ? OR
              LOWER(crm_broker_details.ccode) LIKE ? OR
              LOWER(crm_broker_details.mob) LIKE ? OR
              LOWER(crm_broker_details.company) LIKE ? OR
              LOWER(crm_broker_details.rera_no) LIKE ? OR
              LOWER(crm_broker_details.brk_location) LIKE ? OR
              LOWER(crm_broker_details.remark) LIKE ?
          )
      ORDER BY 
          crm_broker_details.brk_id
      LIMIT ? OFFSET ?`;

    // Preparing query parameters
    const queryParams = [
      `%${location.toLowerCase()}%`, // For brk_location
      `%${anytext.toLowerCase()}%`, // For brk_id
      `%${anytext.toLowerCase()}%`, // For name
      `%${anytext.toLowerCase()}%`, // For email
      `%${anytext.toLowerCase()}%`, // For ccode
      `%${anytext.toLowerCase()}%`, // For mob
      `%${anytext.toLowerCase()}%`, // For company
      `%${anytext.toLowerCase()}%`, // For rera_no
      `%${anytext.toLowerCase()}%`, // For brk_location
      `%${anytext.toLowerCase()}%`, // For remark
      limit, // Pagination limit
      offset, // Pagination offset
    ];

    // // Debugging: Log the query and parameters
    // console.log("SQL Query:", query);
    // console.log("Query Parameters:", queryParams);

    connection.query(query, queryParams, (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
      } else {
        res.json(result);
      }
      connection.release();
    });
  });
});

// SearchBrokerRouter.post("/search-broker", (req, res) => {
//   const user_role = req.session.user[0].urole;
//   const user_id = req.session.user[0].u_id;

//   const { page, pageSize } = req.query;
//   const offset = (page - 1) * pageSize;
//   const limit = parseInt(pageSize);

//   const {
//     country,
//     state,
//     city,
//     broker_date_from,
//     broker_date_to,
//     anytext,
//     pageName,
//   } = req.body.data;

//   pool.getConnection((error, connection) => {
//     if (error) {
//       console.error(error);
//       res.status(500).json({ error: "Internal Server Error" });
//       return;
//     }

//     let query;
//     let queryParams = [];

//     // Base query
//     query =
//       "SELECT crm_broker_details.`brk_id`,crm_broker_details.`u_id`,crm_broker_details.`create_dt`,crm_broker_details.`update_dt`,crm_broker_details.`name`,crm_broker_details.`email`,crm_broker_details.`ccode`,crm_broker_details.`mob`,CONCAT(crm_broker_details.ccode, ' ', crm_broker_details.mob) AS mobile, crm_broker_details.`company`,crm_broker_details.`rera_no`,crm_broker_details.`country`,crm_broker_details.`state`,crm_broker_details.`city`,crm_broker_details.`locality`,crm_broker_details.`address`,crm_broker_details.`remark`, crm_users.username as createdby FROM `crm_broker_details` LEFT JOIN crm_users ON crm_users.u_id = crm_broker_details.`u_id` WHERE brk_id != '' ";

//     //  ======================= HR condition =======================
//     // if (user_role === "HR") {
//     //   query += " AND created_by = ? OR assign_to = ? ";
//     //   queryParams.push(user_id, user_id);
//     // }
//     //  ======================= Page search condition =======================
//     // if (pageName === "Assign Candidates") {
//     //   query += " AND assign_by != '0' AND assign_to != '0' ";
//     // } else if (pageName === "Non Assign Candidates") {
//     //   query += " AND assign_by = '0' AND assign_to = '0' ";
//     // }
//     //  ======================= country =======================
//     if (Array.isArray(country) && country.length > 0) {
//       const whereConditions = country.map((param) => {
//         queryParams.push(`%${param}%`);
//         return "crm_broker_details.country LIKE ?";
//       });
//       query += ` AND (${whereConditions.join(" OR ")})`;
//     }
//     // =======================  state  =======================
//     if (Array.isArray(state) && state.length > 0) {
//       const whereConditions = state.map((param) => {
//         queryParams.push(`%${param}%`);
//         return "crm_broker_details.state LIKE ?";
//       });
//       query += ` AND (${whereConditions.join(" OR ")})`;
//     }
//     //=======================  city  =======================
//     if (Array.isArray(city) && city.length > 0) {
//       const whereConditions = city.map((param) => {
//         queryParams.push(`%${param}%`);
//         return "crm_broker_details.city LIKE ?";
//       });
//       query += ` AND (${whereConditions.join(" OR ")})`;
//     }
//     // =======================  Broker Date  =======================
//     if (broker_date_from !== "" && broker_date_to !== "") {
//       query += ` AND DATE(crm_broker_details.create_dt) BETWEEN ? AND ?`;
//       queryParams.push(broker_date_from, broker_date_to);
//     }

//     // =======================  anytext  =======================
//     if (typeof anytext === "string" && anytext.length > 0) {
//       // Construct the SQL query to search for anytext in multiple columns
//       const whereConditions = [
//         "crm_broker_details.brk_id LIKE ?",
//         "crm_broker_details.name LIKE ?",
//         "crm_broker_details.email LIKE ?",
//         "crm_broker_details.ccode LIKE ?",
//         "crm_broker_details.mob LIKE ?",
//         "crm_broker_details.company LIKE ?",
//         "crm_broker_details.rera_no LIKE ?",
//         "crm_broker_details.locality LIKE ?",
//         "crm_broker_details.address LIKE ?",
//         "crm_broker_details.remark LIKE ?",
//       ];

//       const likeParam = `%${anytext}%`;
//       queryParams.push(
//         likeParam,
//         likeParam,
//         likeParam,
//         likeParam,
//         likeParam,
//         likeParam,
//         likeParam,
//         likeParam,
//         likeParam,
//         likeParam,
//       );
//       query += ` AND (${whereConditions.join(" OR ")})`;
//     }

//     query += ` ORDER BY crm_broker_details.brk_id DESC LIMIT ? OFFSET ?`;
//     queryParams.push(limit, offset);

//     // console.log("SQL Query:", query, queryParams);
//     connection.query(query, queryParams, (err, result) => {
//       if (err) {
//         console.error(err);
//         res.status(500).json({ error: "Internal Server Error" });
//       } else {
//         res.json(result);
//         // console.log(result)
//       }
//       connection.release();
//     });
//   });
// });

SearchBrokerRouter.post("/search-broker-count", (req, res) => {
  const user_role = req.session.user[0].urole;
  const user_id = req.session.user[0].u_id;

  const {
    country,
    state,
    city,
    broker_date_from,
    broker_date_to,
    anytext,
    pageName,
  } = req.body.data;

  pool.getConnection((error, connection) => {
    if (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }

    let query;
    let queryParams = [];

    // Base query
    query =
      "SELECT COUNT(`brk_id`) AS totalCount FROM `crm_broker_details` WHERE brk_id != '' ";

    //  ======================= country =======================
    if (Array.isArray(country) && country.length > 0) {
      const whereConditions = country.map((param) => {
        queryParams.push(`%${param}%`);
        return "crm_broker_details.country LIKE ?";
      });
      query += ` AND (${whereConditions.join(" OR ")})`;
    }
    //  ======================= state =======================
    if (Array.isArray(state) && state.length > 0) {
      const whereConditions = state.map((param) => {
        queryParams.push(`%${param}%`);
        return "crm_broker_details.state LIKE ?";
      });
      query += ` AND (${whereConditions.join(" OR ")})`;
    }
    // =======================  city  =======================
    if (Array.isArray(city) && city.length > 0) {
      const whereConditions = city.map((param) => {
        queryParams.push(`%${param}%`);
        return "crm_broker_details.city LIKE ?";
      });
      query += ` AND (${whereConditions.join(" OR ")})`;
    }
    // =======================  Broker Date  =======================
    if (broker_date_from !== "" && broker_date_to !== "") {
      query += ` AND DATE(crm_broker_details.create_dt) BETWEEN ? AND ?`;
      queryParams.push(broker_date_from, broker_date_to);
    }
    //=======================  anytext  =======================
    if (typeof anytext === "string" && anytext.length > 0) {
      // Construct the SQL query to search for anytext in multiple columns
      const whereConditions = [
        "crm_broker_details.brk_id LIKE ?",
        "crm_broker_details.name LIKE ?",
        "crm_broker_details.email LIKE ?",
        "crm_broker_details.ccode LIKE ?",
        "crm_broker_details.mob LIKE ?",
        "crm_broker_details.company LIKE ?",
        "crm_broker_details.rera_no LIKE ?",
        "crm_broker_details.locality LIKE ?",
        "crm_broker_details.address LIKE ?",
        "crm_broker_details.remark LIKE ?",
      ];

      const likeParam = `%${anytext}%`;
      queryParams.push(
        likeParam,
        likeParam,
        likeParam,
        likeParam,
        likeParam,
        likeParam,
        likeParam,
        likeParam,
        likeParam,
        likeParam
      );
      query += ` AND (${whereConditions.join(" OR ")})`;
    }

    query += ` ORDER BY crm_broker_details.brk_id DESC`;

    // console.log("SQL Query:", query);
    connection.query(query, queryParams, (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
      } else {
        res.json(result[0].totalCount);
      }
      connection.release();
    });
  });
});



// SearchBrokerRouter.post("/search-broker", (req, res) => {
//   const user_role = req.session.user[0].urole;
//   const user_id = req.session.user[0].u_id;

//   const { page, pageSize } = req.query;
//   const offset = (page - 1) * pageSize;
//   const limit = parseInt(pageSize);

//   const {
//     location, // Broker location
//     anytext,  // Search term
//   } = req.body.data;

//   pool.getConnection((error, connection) => {
//     if (error) {
//       console.error(error);
//       res.status(500).json({ error: "Internal Server Error" });
//       return;
//     }

//     // Constructing the SQL query
//     let query = `
//       SELECT 
//           crm_broker_details.brk_id,
//           crm_broker_details.u_id,
//           crm_broker_details.create_dt,
//           crm_broker_details.update_dt,
//           crm_broker_details.name,
//           crm_broker_details.email,
//           crm_broker_details.ccode,
//           crm_broker_details.mob,
//           CONCAT(crm_broker_details.ccode, ' ', crm_broker_details.mob) AS mobile,
//           crm_broker_details.company,
//           crm_broker_details.rera_no,
//           crm_broker_details.brk_location,
//           crm_broker_details.remark,
//           crm_users.username AS createdby
//       FROM 
//           crm_broker_details 
//       LEFT JOIN 
//           crm_users ON crm_users.u_id = crm_broker_details.u_id 
//       WHERE 
//           brk_id != '' 
//           AND LOWER(crm_broker_details.brk_location) LIKE ? 
//           AND (
//               LOWER(crm_broker_details.brk_id) LIKE ? OR
//               LOWER(crm_broker_details.name) LIKE ? OR
//               LOWER(crm_broker_details.email) LIKE ? OR
//               LOWER(crm_broker_details.ccode) LIKE ? OR
//               LOWER(crm_broker_details.mob) LIKE ? OR
//               LOWER(crm_broker_details.company) LIKE ? OR
//               LOWER(crm_broker_details.rera_no) LIKE ? OR
//               LOWER(crm_broker_details.brk_location) LIKE ? OR
//               LOWER(crm_broker_details.remark) LIKE ?
//           )
//       ORDER BY 
//           crm_broker_details.brk_id
//       LIMIT ? OFFSET ?`;

//     // Preparing query parameters
//     const queryParams = [
//       `%${location.toLowerCase()}%`, // For brk_location
//       `%${anytext.toLowerCase()}%`,  // For brk_id
//       `%${anytext.toLowerCase()}%`,  // For name
//       `%${anytext.toLowerCase()}%`,  // For email
//       `%${anytext.toLowerCase()}%`,  // For ccode
//       `%${anytext.toLowerCase()}%`,  // For mob
//       `%${anytext.toLowerCase()}%`,  // For company
//       `%${anytext.toLowerCase()}%`,  // For rera_no
//       `%${anytext.toLowerCase()}%`,  // For brk_location
//       `%${anytext.toLowerCase()}%`,  // For remark
//       limit,                          // Pagination limit
//       offset                          // Pagination offset
//     ];

//     // Debugging: Log the query and parameters
//     console.log("SQL Query:", query);
//     console.log("Query Parameters:", queryParams);

//     connection.query(query, queryParams, (err, result) => {
//       if (err) {
//         console.error(err);
//         res.status(500).json({ error: "Internal Server Error" });
//       } else {
//         res.json(result);
//       }
//       connection.release();
//     });
//   });
// });

module.exports = SearchBrokerRouter;


module.exports = SearchBrokerRouter;
