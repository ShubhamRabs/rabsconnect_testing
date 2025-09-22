const express = require("express");
const pool = require("../../../Database.js");
const dayjs = require("dayjs");

const SearchLeadAssignReportRouter = express.Router();
 
SearchLeadAssignReportRouter.get(
  "/get-search-lead-assign-report-details",
  async (req, res) => {
    const assign_type = new Set();
    const assign_by_to = new Set();
    pool.getConnection(function (error, connection) {
      if (error) throw error;
      connection.query(
        "SELECT GROUP_CONCAT(DISTINCT assign_type) AS assign_type_values, GROUP_CONCAT(DISTINCT assign_by) AS assign_by_values, GROUP_CONCAT(DISTINCT assign_to) AS assign_to_values FROM crm_lead_assign_history",
        async (err, result) => {
          if (err) {
            console.log(err);
          } else {
            let assign_typeArray = [result[0].assign_type_values];
            if (result[0].assign_type_values && result[0].assign_type_values.includes(",")) {
              assign_typeArray = result[0].assign_type_values.split(",");
            }

            let assign_by_toArray = [result[0].assign_by_values];
            if (result[0].assign_by_values && result[0].assign_by_values.includes(",")) {
              assign_by_toArray = result[0].assign_by_values.split(",");
            }
            if (result[0].assign_to_values && result[0].assign_to_values.includes(",")) {
              assign_by_toArray = [...assign_by_toArray,...result[0].assign_to_values.split(",")];
            }else{
              assign_by_toArray = [...assign_by_toArray,result[0].assign_to_values];
            }

            // console.log("console assign_by_toArray",assign_by_toArray);
            
            for (let i = 0; i < assign_typeArray.length; i++) {
              if (assign_typeArray[i]) {
                assign_type.add(assign_typeArray[i].trim());
              }
            }
            for (let i = 0; i < assign_by_toArray.length; i++) {
              if (assign_by_toArray[i]) {
                assign_by_to.add(assign_by_toArray[i].trim());
              }
            }
            let LeadAssignReportSearchDetails = {
              assign_type: Array.from(assign_type),
              assign_by_to: Array.from(assign_by_to),
            };
            // console.log(LeadAssignReportSearchDetails.assign_by_to);
            res.send(LeadAssignReportSearchDetails);
          }
          connection.release();
        }
      );
    });
  }
);

SearchLeadAssignReportRouter.post("/search-lead-assign-report", (req, res) => {
  const current_date = dayjs().format("YYYY-MM-DD");
  const user_role = req.session.user[0].urole;
  const user_id = req.session.user[0].u_id;

  const { page, pageSize } = req.query;
  const offset = (page - 1) * pageSize;
  const limit = parseInt(pageSize);

  const requestData = req.body.data;
  const {
    assign_type,
    user_master,
    user_admin,
    branch_admin,
    team_leader,
    sales_manager,
    tele_caller,
    ladate_from,
    ladate_to,
    anytext,
    pageName,
  } = requestData;

  pool.getConnection((error, connection) => {
    if (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }

    let query;
    let queryParams = [];

    // if (user_role === "Master" || user_role === "Admin") {
      query = `SELECT lah.lah_id, lah.create_dt, lah.update_dt, lah.l_id, lah.lreq_id, lah.lsche_id, lah.assign_type, lah.assign_by, lah.assign_to, cu.username AS assignby, GROUP_CONCAT(au.username) AS assignto FROM crm_lead_assign_history AS lah LEFT JOIN crm_users AS cu ON cu.u_id = lah.assign_by LEFT JOIN crm_users AS au ON FIND_IN_SET(au.u_id, lah.assign_to) WHERE lah.lah_id != ""`;
    // } 
    // else {
      // Base query
      // query = ``;
      // queryParams.push(user_id);
    // }

    if (Array.isArray(assign_type) && assign_type.length > 0) {
      const whereConditions = assign_type.map((param) => {
        queryParams.push(`%${param}%`);
        return "lah.assign_type LIKE ?";
      });
      query += ` AND (${whereConditions.join(" OR ")})`;
    }
    
    if (Array.isArray(user_master) && user_master.length > 0) {
      const whereConditions = user_master.map((param) => {
        queryParams.push(`%${param}%`);
        queryParams.push(`%${param}%`);
        return "lah.assign_by LIKE ? OR lah.assign_to LIKE ?";
      });
      query += ` AND (${whereConditions.join(" OR ")})`;
    }

    if (Array.isArray(user_admin) && user_admin.length > 0) {
      const whereConditions = user_admin.map((param) => {
        queryParams.push(`%${param}%`);
        queryParams.push(`%${param}%`);
        return "lah.assign_by LIKE ? OR lah.assign_to LIKE ?";
      });
      query += ` AND (${whereConditions.join(" OR ")})`;
    }

    if (Array.isArray(branch_admin) && branch_admin.length > 0) {
      const whereConditions = branch_admin.map((param) => {
        queryParams.push(`%${param}%`);
        queryParams.push(`%${param}%`);
        return "lah.assign_by LIKE ? OR lah.assign_to LIKE ?";
      });
      query += ` AND (${whereConditions.join(" OR ")})`;
    }
   
    if (Array.isArray(team_leader) && team_leader.length > 0) {
      const whereConditions = team_leader.map((param) => {
        queryParams.push(`%${param}%`);
        queryParams.push(`%${param}%`);
        return "lah.assign_by LIKE ? OR lah.assign_to LIKE ?";
      });
      query += ` AND (${whereConditions.join(" OR ")})`;
    }
    
    if (Array.isArray(sales_manager) && sales_manager.length > 0) {
      const whereConditions = sales_manager.map((param) => {
        queryParams.push(`%${param}%`);
        queryParams.push(`%${param}%`);
        return "lah.assign_by LIKE ? OR lah.assign_to LIKE ?";
      });
      query += ` AND (${whereConditions.join(" OR ")})`;
    }

    if (Array.isArray(tele_caller) && tele_caller.length > 0) {
      const whereConditions = tele_caller.map((param) => {
        queryParams.push(`%${param}%`);
        queryParams.push(`%${param}%`);
        return "lah.assign_by LIKE ? OR lah.assign_to LIKE ?";
      });
      query += ` AND (${whereConditions.join(" OR ")})`;
    }

    if (ladate_from !== "" && ladate_to !== "") {
      query += ` AND lah.DATE(create_dt) >= ? AND lah.DATE(create_dt) <= ?`;
      queryParams.push(ladate_from, ladate_to);
    }

    if (typeof anytext === "string" && anytext.length > 0) {
      // Construct the SQL query to search for anytext in multiple columns
      const whereConditions = [
        "cu.username LIKE ?",
        "lah.create_dt LIKE ?",
        "lah.l_id LIKE ?",
        "lah.lsche_id LIKE ?",
        "lah.assign_type LIKE ?",
        "lah.assign_by LIKE ?",
        "lah.assign_to LIKE ?",
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
      );
      query += ` AND (${whereConditions.join(" OR ")})`;
    }

    query += `GROUP BY lah.lah_id, lah.create_dt, lah.update_dt, lah.l_id, lah.lreq_id, lah.lsche_id, lah.assign_type, lah.assign_by, lah.assign_to, cu.username ORDER BY lah.lah_id DESC LIMIT ? OFFSET ?`;
    queryParams.push(limit, offset);
    
    // console.log("SQL Query:", query, "Query Parameters:", queryParams);

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

SearchLeadAssignReportRouter.post("/search-lead-assign-report-count", (req, res) => {
  const current_date = dayjs().format("YYYY-MM-DD");
  const user_role = req.session.user[0].urole;
  const user_id = req.session.user[0].u_id;

  const requestData = req.body.data;
  const {
    assign_type,
    user_master,
    user_admin,
    branch_admin,
    team_leader,
    sales_manager,
    tele_caller,
    ladate_from,
    ladate_to,
    anytext,
    pageName,
  } = requestData;

  pool.getConnection((error, connection) => {
    if (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }

    let query;
    let queryParams = [];

    // if (user_role === "Master" || user_role === "Admin") {
      // Base query
      query = `SELECT COUNT(lah_id) AS totalCount FROM crm_lead_assign_history AS lah LEFT JOIN crm_users AS cu ON cu.u_id = lah.assign_by LEFT JOIN crm_users AS au ON FIND_IN_SET(au.u_id, lah.assign_to) WHERE lah.lah_id != ""`;
    // } 
    // else {
      // // Base query
      // query = ``;
      // queryParams.push(user_id);
    // }

    if (Array.isArray(assign_type) && assign_type.length > 0) {
      const whereConditions = assign_type.map((param) => {
        queryParams.push(`%${param}%`);
        return "lah.assign_type LIKE ?";
      });
      query += ` AND (${whereConditions.join(" OR ")})`;
    }

    if (Array.isArray(user_master) && user_master.length > 0) {
      const whereConditions = user_master.map((param) => {
        queryParams.push(`%${param}%`);
        queryParams.push(`%${param}%`);
        return "lah.assign_by LIKE ? OR lah.assign_to LIKE ?";
      });
      query += ` AND (${whereConditions.join(" OR ")})`;
    }
    
    if (Array.isArray(user_admin) && user_admin.length > 0) {
      const whereConditions = user_admin.map((param) => {
        queryParams.push(`%${param}%`);
        queryParams.push(`%${param}%`);
        return "lah.assign_by LIKE ? OR lah.assign_to LIKE ?";
      });
      query += ` AND (${whereConditions.join(" OR ")})`;
    }

    if (Array.isArray(branch_admin) && branch_admin.length > 0) {
      const whereConditions = branch_admin.map((param) => {
        queryParams.push(`%${param}%`);
        queryParams.push(`%${param}%`);
        return "lah.assign_by LIKE ? OR lah.assign_to LIKE ?";
      });
      query += ` AND (${whereConditions.join(" OR ")})`;
    }

    if (Array.isArray(team_leader) && team_leader.length > 0) {
      const whereConditions = team_leader.map((param) => {
        queryParams.push(`%${param}%`);
        queryParams.push(`%${param}%`);
        return "lah.assign_by LIKE ? OR lah.assign_to LIKE ?";
      });
      query += ` AND (${whereConditions.join(" OR ")})`;
    }

    if (Array.isArray(sales_manager) && sales_manager.length > 0) {
      const whereConditions = sales_manager.map((param) => {
        queryParams.push(`%${param}%`);
        queryParams.push(`%${param}%`);
        return "lah.assign_by LIKE ? OR lah.assign_to LIKE ?";
      });
      query += ` AND (${whereConditions.join(" OR ")})`;
    }

    if (Array.isArray(tele_caller) && tele_caller.length > 0) {
      const whereConditions = tele_caller.map((param) => {
        queryParams.push(`%${param}%`);
        queryParams.push(`%${param}%`);
        return "lah.assign_by LIKE ? OR lah.assign_to LIKE ?";
      });
      query += ` AND (${whereConditions.join(" OR ")})`;
    }

    if (ladate_from !== "" && ladate_to !== "") {
      query += ` AND lah.DATE(create_dt) >= ? AND lah.DATE(create_dt) <= ?`;
      queryParams.push(ladate_from, ladate_to);
    }

    if (typeof anytext === "string" && anytext.length > 0) {
      // Construct the SQL query to search for anytext in multiple columns
      const whereConditions = [
        "cu.username LIKE ?",
        "lah.create_dt LIKE ?",
        "lah.l_id LIKE ?",
        "lah.lsche_id LIKE ?",
        "lah.assign_type LIKE ?",
        "lah.assign_by LIKE ?",
        "lah.assign_to LIKE ?",
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
      );
      query += ` AND (${whereConditions.join(" OR ")})`;
    }

    query += ` ORDER BY lah.lah_id DESC `;
    // queryParams.push(limit, offset);
    // console.log("SQL Query:", query);

    connection.query(query, queryParams, (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
      } else {
        console.log(result);
        res.json(result[0].totalCount);
      }
      connection.release();
    });
  });
});

module.exports = SearchLeadAssignReportRouter;
