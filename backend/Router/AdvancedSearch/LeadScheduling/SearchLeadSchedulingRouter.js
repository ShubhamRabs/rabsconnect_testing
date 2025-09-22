const express = require("express");
const pool = require("../../../Database.js");
const dayjs = require("dayjs");

const SearchLeadSchedulerRouter = express.Router();

SearchLeadSchedulerRouter.get(
  "/get-search-lead-scheduler-details",
  async (req, res) => {
    const source = new Set();
    const service_type = new Set();
    const city = new Set();
    const pname = new Set();
    const form_name = new Set();
    const locality = new Set();
    const created_by_assign_to = new Set();
    pool.getConnection(function (error, connection) {
      if (error) throw error;
      connection.query(
        "SELECT GROUP_CONCAT(DISTINCT source) AS source_values, GROUP_CONCAT(DISTINCT service_type) AS service_type_values, GROUP_CONCAT(DISTINCT pname) AS pname_values, GROUP_CONCAT(DISTINCT form_name) AS form_name_values, GROUP_CONCAT(DISTINCT city) AS city_values, GROUP_CONCAT(DISTINCT locality) AS locality_values, GROUP_CONCAT(DISTINCT created_by) AS created_by_values,GROUP_CONCAT(DISTINCT assign_to) AS assign_to_values FROM crm_lead_scheduling",
        async (err, result) => {
          if (err) {
            console.log(err);
          } else {
            let sourceArray = [result[0].source_values];
            if (result[0].source_values && result[0].source_values.includes(",")) {
              sourceArray = result[0].source_values.split(",");
            }
            let serviceArray = [result[0].service_type_values];
            if (result[0].service_type_values && result[0].service_type_values.includes(",")) {
              serviceArray = result[0].service_type_values.split(",");
            }
            let projectArray = [result[0].pname_values];
            if (result[0].pname_values && result[0].pname_values.includes(",")) {
              projectArray = result[0].pname_values.split(",");
            }
            let formNameArray = [result[0].form_name_values];
            if (result[0].form_name_values && result[0].form_name_values.includes(",")) {
              formNameArray = result[0].form_name_values.split(",");
            }
            let cityArray = [result[0].city_values];
            if (result[0].city_values && result[0].city_values.includes(",")) {
              cityArray = result[0].city_values.split(",");
            }
            let localityArray = [result[0].locality_values];
            if (result[0].locality_values && result[0].locality_values.includes(",")) {
              localityArray = result[0].locality_values.split(",");
            }
            let created_by_assign_toArray = [result[0].created_by_values];
            if (result[0].created_by_values && result[0].created_by_values.includes(",")) {
              created_by_assign_toArray = result[0].created_by_values.split(",");
            }
            if (result[0].assign_to_values && result[0].assign_to_values.includes(",")) {
              created_by_assign_toArray = [...created_by_assign_toArray,...result[0].assign_to_values.split(",")];
            }else{
              created_by_assign_toArray = [...created_by_assign_toArray,result[0].assign_to_values];
            }
            // console.log("console crated_by_assign_toArray",created_by_assign_toArray);
            for (let i = 0; i < sourceArray.length; i++) {
              if (sourceArray[i]) {
                source.add(sourceArray[i].trim());
              }
            }
            for (let i = 0; i < serviceArray.length; i++) {
              if (serviceArray[i]) {
                service_type.add(serviceArray[i].trim());
              }
            }
            for (let i = 0; i < projectArray.length; i++) {
              if (projectArray[i]) {
                pname.add(projectArray[i].trim());
              }
            }
            for (let i = 0; i < formNameArray.length; i++) {
              if (formNameArray[i]) {
                form_name.add(formNameArray[i].trim());
              }
            }
            for (let i = 0; i < cityArray.length; i++) {
              if (cityArray[i]) {
                city.add(cityArray[i].trim());
              }
            }
            for (let i = 0; i < localityArray.length; i++) {
              if (localityArray[i]) {
                locality.add(localityArray[i].trim());
              }
            }
            for (let i = 0; i < created_by_assign_toArray.length; i++) {
              if (created_by_assign_toArray[i]) {
                created_by_assign_to.add(created_by_assign_toArray[i].trim());
              }
            }
            let SchedularDetails = {
              source: Array.from(source),
              service_type: Array.from(service_type),
              pname: Array.from(pname),
              form_name: Array.from(form_name),
              city: Array.from(city),
              locality: Array.from(locality),
              created_by_assign_to: Array.from(created_by_assign_to),
            };
            // console.log(SchedularDetails.created_by_assign_to);
            res.send(SchedularDetails);
          }
          connection.release();
        }
      );
    });
  }
);

SearchLeadSchedulerRouter.post("/search-lead-scheduler", (req, res) => {
  const current_date = dayjs().format("YYYY-MM-DD");
  const user_role = req.session.user[0].urole;
  const user_id = req.session.user[0].u_id;

  const { page, pageSize } = req.query;
  const offset = (page - 1) * pageSize;
  const limit = parseInt(pageSize);

  const requestData = req.body.data;
  const {
    schedule_type,
    source,
    service_type,
    pname,
    form_name,
    city,
    locality,
    schedule_status,
    user_master,
    user_admin,
    branch_admin,
    team_leader,
    sales_manager,
    tele_caller,
    createDate_from,
    createDate_to,
    ldate_from,
    ldate_to,
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
      query = `SELECT ls.lsche_id, ls.created_by, ls.create_dt, ls.update_dt, ls.assign_to, ls.ldate_from, ls.ldate_to, ls.source, ls.service_type, ls.pname, ls.form_name, ls.locality, ls.city, ls.schedule_type, ls.no_of_leads, ls.status, cu.username AS createdby, GROUP_CONCAT(au.username) AS assignto FROM crm_lead_scheduling AS ls LEFT JOIN crm_users AS cu ON cu.u_id = ls.created_by LEFT JOIN crm_users AS au ON FIND_IN_SET(au.u_id, ls.assign_to) WHERE ls.lsche_id != "" `;
    // } else {
      // Base query
      // query = `SELECT ls.lsche_id, ls.created_by, ls.create_dt, ls.update_dt, ls.assign_to, ls.ldate_from, ls.ldate_to, ls.source, ls.service_type, ls.pname, ls.locality, ls.city, ls.schedule_type, ls.no_of_leads, ls.status, cu.username AS createdby, GROUP_CONCAT(au.username) AS assignto FROM crm_lead_scheduling AS ls LEFT JOIN crm_users AS cu ON cu.u_id = ls.created_by LEFT JOIN crm_users AS au ON FIND_IN_SET(au.u_id, ls.assign_to) WHERE ls.created_by = ? `;
      // queryParams.push(user_id);
    // } 

    if (Array.isArray(schedule_type) && schedule_type.length > 0) {
      const whereConditions = schedule_type.map((param) => {
        queryParams.push(`%${param}%`);
        return "ls.schedule_type LIKE ?";
      });
      query += ` AND (${whereConditions.join(" OR ")})`;
    }

    if (Array.isArray(source) && source.length > 0) {
      const whereConditions = source.map((param) => {
        queryParams.push(`%${param}%`);
        return "ls.source LIKE ?";
      });
      query += ` AND (${whereConditions.join(" OR ")})`;
    }

    if (Array.isArray(service_type) && service_type.length > 0) {
      const whereConditions = service_type.map((param) => {
        queryParams.push(`%${param}%`);
        return "ls.service_type LIKE ?";
      });
      query += ` AND (${whereConditions.join(" OR ")})`;
    }

    if (Array.isArray(pname) && pname.length > 0) {
      const whereConditions = pname.map((param) => {
        queryParams.push(`%${param}%`);
        return "ls.pname LIKE ?";
      });
      query += ` AND (${whereConditions.join(" OR ")})`;
    }

    if (Array.isArray(form_name) && form_name.length > 0) {
      const whereConditions = form_name.map((param) => {
        queryParams.push(`%${param}%`);
        return "ls.form_name LIKE ?";
      });
      query += ` AND (${whereConditions.join(" OR ")})`;
    }

    if (Array.isArray(city) && city.length > 0) {
      const whereConditions = city.map((param) => {
        queryParams.push(`%${param}%`);
        return "ls.city LIKE ?";
      });
      query += ` AND (${whereConditions.join(" OR ")})`;
    }

    if (Array.isArray(locality) && locality.length > 0) {
      const whereConditions = locality.map((param) => {
        queryParams.push(`%${param}%`);
        return "ls.locality LIKE ?";
      });
      query += ` AND (${whereConditions.join(" OR ")})`;
    }

    if (Array.isArray(schedule_status) && schedule_status.length > 0) {
      const whereConditions = schedule_status.map((param) => {
        queryParams.push(`%${param}%`);
        return "ls.status LIKE ?";
      });
      query += ` AND (${whereConditions.join(" OR ")})`;
    }
    
    if (Array.isArray(user_master) && user_master.length > 0) {
      const whereConditions = user_master.map((param) => {
        queryParams.push(`%${param}%`);
        queryParams.push(`%${param}%`);
        return "ls.created_by LIKE ? OR ls.assign_to LIKE ?";
      });
      query += ` AND (${whereConditions.join(" OR ")})`;
    }
    if (Array.isArray(user_admin) && user_admin.length > 0) {
      const whereConditions = user_admin.map((param) => {
        queryParams.push(`%${param}%`);
        queryParams.push(`%${param}%`);
        return "ls.created_by LIKE ? OR ls.assign_to LIKE ?";
      });
      query += ` AND (${whereConditions.join(" OR ")})`;
    }
    if (Array.isArray(branch_admin) && branch_admin.length > 0) {
      const whereConditions = branch_admin.map((param) => {
        queryParams.push(`%${param}%`);
        queryParams.push(`%${param}%`);
        return "ls.created_by LIKE ? OR ls.assign_to LIKE ?";
      });
      query += ` AND (${whereConditions.join(" OR ")})`;
    }
    if (Array.isArray(team_leader) && team_leader.length > 0) {
      const whereConditions = team_leader.map((param) => {
        queryParams.push(`%${param}%`);
        queryParams.push(`%${param}%`);
        return "ls.created_by LIKE ? OR ls.assign_to LIKE ?";
      });
      query += ` AND (${whereConditions.join(" OR ")})`;
    }
    
    if (Array.isArray(sales_manager) && sales_manager.length > 0) {
      const whereConditions = sales_manager.map((param) => {
        queryParams.push(`%${param}%`);
        queryParams.push(`%${param}%`);
        return "ls.created_by LIKE ? OR ls.assign_to LIKE ?";
      });
      query += ` AND (${whereConditions.join(" OR ")})`;
    }

    if (Array.isArray(tele_caller) && tele_caller.length > 0) {
      const whereConditions = tele_caller.map((param) => {
        queryParams.push(`%${param}%`);
        queryParams.push(`%${param}%`);
        return "ls.created_by LIKE ? OR ls.assign_to LIKE ?";
      });
      query += ` AND (${whereConditions.join(" OR ")})`;
    }

    if (createDate_from !== "" && createDate_to !== "") {
      query += ` AND DATE(ls.create_dt) >= ? AND DATE(ls.create_dt) <= ?`;
      queryParams.push(createDate_from, createDate_to);
    }

    if (ldate_from !== "" && ldate_to !== "") {
      query += ` AND ls.ldate_from >= ? AND ls.ldate_to <= ?`;
      queryParams.push(ldate_from, ldate_to);
    }

    if (typeof anytext === "string" && anytext.length > 0) {
      // Construct the SQL query to search for anytext in multiple columns
      const whereConditions = [
        "cu.username LIKE ?",
        "ls.schedule_type LIKE ?",
        "ls.source LIKE ?",
        "ls.service_type LIKE ?",
        "ls.pname LIKE ?",
        "ls.form_name LIKE ?",
        "ls.city LIKE ?",
        "ls.locality LIKE ?",
        "ls.no_of_leads LIKE ?",
        "ls.status LIKE ?",
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
        likeParam,
      );
      query += ` AND (${whereConditions.join(" OR ")})`;
    }

    query += `GROUP BY ls.lsche_id, ls.created_by, ls.create_dt, ls.update_dt, ls.assign_to, ls.ldate_from, ls.ldate_to, ls.source, ls.service_type, ls.pname, ls.form_name, ls.locality, ls.city, ls.schedule_type, ls.no_of_leads, ls.status, cu.username ORDER BY ls.lsche_id DESC LIMIT ? OFFSET ?`;
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

SearchLeadSchedulerRouter.post("/search-lead-scheduler-count", (req, res) => {
  const current_date = dayjs().format("YYYY-MM-DD");
  const user_role = req.session.user[0].urole;
  const user_id = req.session.user[0].u_id;

  const requestData = req.body.data;
  const {
    schedule_type,
    source,
    service_type,
    pname,
    form_name,
    city,
    locality,
    schedule_status,
    user_master,
    user_admin,
    branch_admin,
    team_leader,
    sales_manager,
    tele_caller,
    createDate_from,
    createDate_to,
    ldate_from,
    ldate_to,
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
      query = `SELECT COUNT(ls.lsche_id) AS totalCount FROM crm_lead_scheduling AS ls LEFT JOIN crm_users AS cu ON cu.u_id = ls.created_by LEFT JOIN crm_users AS au ON FIND_IN_SET(au.u_id, ls.assign_to) WHERE ls.lsche_id != "" `;
    // } else {
      // Base query
      // query = `SELECT COUNT(ls.lsche_id) AS totalCount FROM crm_lead_scheduling AS ls LEFT JOIN crm_users AS cu ON cu.u_id = ls.created_by LEFT JOIN crm_users AS au ON FIND_IN_SET(au.u_id, ls.assign_to) WHERE ls.created_by = ?`;
      // queryParams.push(user_id);
    // }

    if (Array.isArray(schedule_type) && schedule_type.length > 0) {
      const whereConditions = schedule_type.map((param) => {
        queryParams.push(`%${param}%`);
        return "ls.schedule_type LIKE ?";
      });
      query += ` AND (${whereConditions.join(" OR ")})`;
    }

    if (Array.isArray(source) && source.length > 0) {
      const whereConditions = source.map((param) => {
        queryParams.push(`%${param}%`);
        return "ls.source LIKE ?";
      });
      query += ` AND (${whereConditions.join(" OR ")})`;
    }

    if (Array.isArray(service_type) && service_type.length > 0) {
      const whereConditions = service_type.map((param) => {
        queryParams.push(`%${param}%`);
        return "ls.service_type LIKE ?";
      });
      query += ` AND (${whereConditions.join(" OR ")})`;
    }

    if (Array.isArray(pname) && pname.length > 0) {
      const whereConditions = pname.map((param) => {
        queryParams.push(`%${param}%`);
        return "ls.pname LIKE ?";
      });
      query += ` AND (${whereConditions.join(" OR ")})`;
    }

    if (Array.isArray(form_name) && form_name.length > 0) {
      const whereConditions = form_name.map((param) => {
        queryParams.push(`%${param}%`);
        return "ls.form_name LIKE ?";
      });
      query += ` AND (${whereConditions.join(" OR ")})`;
    }

    if (Array.isArray(city) && city.length > 0) {
      const whereConditions = city.map((param) => {
        queryParams.push(`%${param}%`);
        return "ls.city LIKE ?";
      });
      query += ` AND (${whereConditions.join(" OR ")})`;
    }

    if (Array.isArray(locality) && locality.length > 0) {
      const whereConditions = locality.map((param) => {
        queryParams.push(`%${param}%`);
        return "ls.locality LIKE ?";
      });
      query += ` AND (${whereConditions.join(" OR ")})`;
    }

    if (Array.isArray(schedule_status) && schedule_status.length > 0) {
      const whereConditions = schedule_status.map((param) => {
        queryParams.push(`%${param}%`);
        return "ls.status LIKE ?";
      });
      query += ` AND (${whereConditions.join(" OR ")})`;
    }

    if (Array.isArray(user_master) && user_master.length > 0) {
      const whereConditions = user_master.map((param) => {
        queryParams.push(`%${param}%`);
        queryParams.push(`%${param}%`);
        return "ls.created_by LIKE ? OR ls.assign_to LIKE ?";
      });
      query += ` AND (${whereConditions.join(" OR ")})`;
    }
    if (Array.isArray(user_admin) && user_admin.length > 0) {
      const whereConditions = user_admin.map((param) => {
        queryParams.push(`%${param}%`);
        queryParams.push(`%${param}%`);
        return "ls.created_by LIKE ? OR ls.assign_to LIKE ?";
      });
      query += ` AND (${whereConditions.join(" OR ")})`;
    }
    if (Array.isArray(branch_admin) && branch_admin.length > 0) {
      const whereConditions = branch_admin.map((param) => {
        queryParams.push(`%${param}%`);
        queryParams.push(`%${param}%`);
        return "ls.created_by LIKE ? OR ls.assign_to LIKE ?";
      });
      query += ` AND (${whereConditions.join(" OR ")})`;
    }
    if (Array.isArray(team_leader) && team_leader.length > 0) {
      const whereConditions = team_leader.map((param) => {
        queryParams.push(`%${param}%`);
        queryParams.push(`%${param}%`);
        return "ls.created_by LIKE ? OR ls.assign_to LIKE ?";
      });
      query += ` AND (${whereConditions.join(" OR ")})`;
    }

    if (Array.isArray(sales_manager) && sales_manager.length > 0) {
      const whereConditions = sales_manager.map((param) => {
        queryParams.push(`%${param}%`);
        queryParams.push(`%${param}%`);
        return "ls.created_by LIKE ? OR ls.assign_to LIKE ?";
      });
      query += ` AND (${whereConditions.join(" OR ")})`;
    }

    if (Array.isArray(tele_caller) && tele_caller.length > 0) {
      const whereConditions = tele_caller.map((param) => {
        queryParams.push(`%${param}%`);
        queryParams.push(`%${param}%`);
        return "ls.created_by LIKE ? OR ls.assign_to LIKE ?";
      });
      query += ` AND (${whereConditions.join(" OR ")})`;
    }

    if (createDate_from !== "" && createDate_to !== "") {
      query += ` AND DATE(ls.create_dt) >= ? AND DATE(ls.create_dt) <= ?`;
      queryParams.push(createDate_from, createDate_to);
    }

    if (ldate_from !== "" && ldate_to !== "") {
      query += ` AND ls.ldate_from >= ? AND ls.ldate_to <= ?`;
      queryParams.push(ldate_from, ldate_to);
    }

    if (typeof anytext === "string" && anytext.length > 0) {
      // Construct the SQL query to search for anytext in multiple columns
      const whereConditions = [
        "cu.username LIKE ?",
        "ls.schedule_type LIKE ?",
        "ls.source LIKE ?",
        "ls.service_type LIKE ?",
        "ls.pname LIKE ?",
        "ls.form_name LIKE ?",
        "ls.city LIKE ?",
        "ls.locality LIKE ?",
        "ls.no_of_leads LIKE ?",
        "ls.status LIKE ?",
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
        likeParam,
      );
      query += ` AND (${whereConditions.join(" OR ")})`;
    }

    query += ` ORDER BY ls.lsche_id DESC`;
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

module.exports = SearchLeadSchedulerRouter;