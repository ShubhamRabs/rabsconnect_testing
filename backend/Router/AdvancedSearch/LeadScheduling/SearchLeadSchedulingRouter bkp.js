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
    const locality = new Set();
    pool.getConnection(function (error, connection) {
      if (error) throw error;
      connection.query(
        "SELECT GROUP_CONCAT(DISTINCT source) AS source_values, GROUP_CONCAT(DISTINCT service_type) AS service_type_values, GROUP_CONCAT(DISTINCT pname) AS pname_values, GROUP_CONCAT(DISTINCT city) AS city_values, GROUP_CONCAT(DISTINCT locality) AS locality_values FROM crm_lead_scheduling",
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
            let cityArray = [result[0].city_values];
            if (result[0].city_values && result[0].city_values.includes(",")) {
              cityArray = result[0].city_values.split(",");
            }
            let localityArray = [result[0].locality_values];
            if (result[0].locality_values && result[0].locality_values.includes(",")) {
              localityArray = result[0].locality_values.split(",");
            }
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
            let SchedularDetails = {
              source: Array.from(source),
              service_type: Array.from(service_type),
              pname: Array.from(pname),
              city: Array.from(city),
              locality: Array.from(locality),
            };
            res.send(SchedularDetails);
          }
          connection.release();
        }
      );
    });
  }
);

SearchLeadSchedulerRouter.post("/search-leads", (req, res) => {
  const current_date = dayjs().format("YYYY-MM-DD");
  const user_role = req.session.user[0].urole;
  const user_id = req.session.user[0].u_id;

  const { page, pageSize } = req.query;
  const offset = (page - 1) * pageSize;
  const limit = parseInt(pageSize);

  const requestData = req.body.data;
  const {
    source,
    service_type,
    pname,
    ptype,
    country,
    state,
    city,
    locality,
    pcategory,
    pconfiguration,
    leadstatus,
    userstatus,
    branch_admin,
    team_leader,
    sales_manager,
    tele_caller,
    ldate_from,
    ldate_to,
    fdate_from,
    fdate_to,
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

    console.log(pageName);

    if (pageName === "User Lead") {
      query = `SELECT lrd.lreq_id AS l_id, lrd.l_id AS assignlead_id, lrd.create_dt, lpd.brk_id, lpd.ref_name, lpd.ref_ccode, lpd.ref_mob, lpd.ref_email, lpd.lname, lrd.status, lrd.pname, lpd.source, ls.color, lrd.clicked, GROUP_CONCAT(cu.username) AS assign_users, CONCAT(lpd.p_ccode, ' ', lpd.p_mob) AS mobile, lpd.p_ccode,p_mob, lpd.p_email, GROUP_CONCAT(lrd.status,' - ', cu.username) AS users_status, lpd.pname, lrd.followup, lrd.followup_dt, lpd.city, lpd.sub_locality, lrd.comments, lpd.source_type, lpd.service_type, lpd.ptype, lpd.pcategory, lpd.pconfiguration, lpd.min_area, lpd.max_area, lpd.area_unit, lpd.min_price, lpd.max_price, lpd.price_unit, lpd.country, lpd.state, lpd.other_details, lpd.assign_status FROM crm_lead_req_details AS lrd JOIN crm_lead_primary_details AS lpd ON lpd.l_id = lrd.l_id LEFT JOIN crm_lead_status AS ls ON lrd.status = ls.status LEFT JOIN crm_users AS cu ON cu.u_id = lrd.assignto_id WHERE lrd.lreq_id != "" `;
    } else {
      if (user_role === "Master" || user_role === "Admin") {
        if (
          branch_admin ||
          team_leader ||
          sales_manager ||
          tele_caller ||
          (user_role !== "Master" && user_role !== "Admin")
        ) {
          query = `SELECT lpd.l_id AS l_id, lrd.lreq_id AS assignlead_id, GROUP_CONCAT(cu.username) AS assign_users, lpd.create_dt, lpd.brk_id, lpd.ref_name, lpd.ref_ccode, lpd.ref_mob, lpd.ref_email, lpd.lname, CONCAT(lpd.p_ccode, ' ', lpd.p_mob) AS mobile, lpd.p_ccode, lpd.p_mob, lpd.p_email, lpd.status as admin_status, GROUP_CONCAT(lrd.status,' - ', cu.username) AS users_status,lpd.pname, lrd.followup, lrd.followup_dt, lpd.source, lpd.city, lpd.locality, lpd.sub_locality, lrd.comments, ls.color, lpd.clicked, lpd.source_type, lpd.service_type, lpd.ptype, lpd.pcategory, lpd.pconfiguration, lpd.min_area, lpd.max_area, lpd.area_unit, lpd.min_price, lpd.max_price, lpd.price_unit, lpd.country, lpd.state, lpd.other_details,  lpd.assign_status FROM crm_lead_primary_details AS lpd LEFT JOIN crm_lead_req_details AS lrd ON lrd.l_id = lpd.l_id LEFT JOIN crm_lead_status AS ls ON ls.status = lpd.status LEFT JOIN crm_users AS cu ON cu.u_id = lrd.assignto_id WHERE lpd.l_id != "" `;
        } else {
          // Base query
          query = `SELECT lpd.l_id AS l_id, lrd.lreq_id AS assignlead_id, GROUP_CONCAT(cu.username) AS assign_users, lpd.create_dt, lpd.brk_id, lpd.ref_name, lpd.ref_ccode, lpd.ref_mob, lpd.ref_email, lpd.lname, CONCAT(lpd.p_ccode, ' ', lpd.p_mob) AS mobile, lpd.p_ccode, lpd.p_mob, lpd.p_email, lpd.status as admin_status, GROUP_CONCAT(lrd.status,' - ', cu.username) AS users_status,lpd.pname, lpd.followup, lpd.followup_dt, lpd.source, lpd.city, lpd.locality, lpd.sub_locality, lpd.comments, ls.color, lpd.clicked, lpd.source_type, lpd.service_type, lpd.ptype, lpd.pcategory, lpd.pconfiguration, lpd.min_area, lpd.max_area, lpd.area_unit, lpd.min_price, lpd.max_price, lpd.price_unit, lpd.country, lpd.state, lpd.other_details,  lpd.assign_status FROM crm_lead_primary_details AS lpd LEFT JOIN crm_lead_req_details AS lrd ON lrd.l_id = lpd.l_id LEFT JOIN crm_lead_status AS ls ON ls.status = lpd.status LEFT JOIN crm_users AS cu ON cu.u_id = lrd.assignto_id WHERE lpd.l_id != "" `;
        }
      } else {
        // Base query
        query = `SELECT lrd.lreq_id AS l_id, lrd.l_id AS assignlead_id, lpd.create_dt, lpd.brk_id, lpd.ref_name, lpd.ref_ccode, lpd.ref_mob, lpd.ref_email, lpd.lname, lrd.status, lrd.pname, lpd.source, ls.color, lrd.clicked, GROUP_CONCAT(cu.username) AS assign_users, CONCAT(lpd.p_ccode, ' ', lpd.p_mob) AS mobile, lpd.p_ccode,p_mob, lpd.p_email, GROUP_CONCAT(lrd.status,' - ', cu.username) AS users_status, lpd.pname, lrd.followup, lrd.followup_dt, lpd.city, lpd.sub_locality, lrd.comments, lpd.source_type, lpd.service_type, lpd.ptype, lpd.pcategory, lpd.pconfiguration, lpd.min_area, lpd.max_area, lpd.area_unit, lpd.min_price, lpd.max_price, lpd.price_unit, lpd.country, lpd.state, lpd.other_details, lpd.assign_status FROM crm_lead_req_details AS lrd JOIN crm_lead_primary_details AS lpd ON lpd.l_id = lrd.l_id LEFT JOIN crm_lead_status AS ls ON lrd.status = ls.status LEFT JOIN crm_users AS cu ON cu.u_id = lrd.assignto_id WHERE lrd.assignto_id = ?`;
        queryParams.push(user_id);
      }
    }

    if (typeof pageName === "string" && pageName === "Non Assign Lead") {
      if (
        branch_admin ||
        team_leader ||
        sales_manager ||
        tele_caller ||
        (user_role !== "Master" && user_role !== "Admin")
      ) {
        query += ` AND lrd.assign_status = ?`;
      } else {
        query += ` AND lpd.assign_status = ?`;
      }
      queryParams.push(" ");
    } else if (typeof pageName === "string" && pageName === "Assign Lead") {
      if (
        branch_admin ||
        team_leader ||
        sales_manager ||
        tele_caller ||
        (user_role !== "Master" && user_role !== "Admin")
      ) {
        query += ` AND lrd.assign_status = ?`;
        queryParams.push("Yes");
      } else {
        query += ` AND lpd.assign_status = ?`;
        queryParams.push("Yes");
      }
    } else if (
      typeof pageName === "string" &&
      pageName === "Today's Followup"
    ) {
      if (
        branch_admin ||
        team_leader ||
        sales_manager ||
        tele_caller ||
        (user_role !== "Master" && user_role !== "Admin")
      ) {
        query += ` AND DATE(lrd.followup_dt) = ? AND lrd.followup = ?`;
        queryParams.push(current_date, "Yes");
      } else {
        query += ` AND DATE(lpd.followup_dt) = ? AND lpd.followup = ?`;
        queryParams.push(current_date, "Yes");
      }
    } else if (typeof pageName === "string" && pageName === "Missed Followup") {
      if (
        branch_admin ||
        team_leader ||
        sales_manager ||
        tele_caller ||
        (user_role !== "Master" && user_role !== "Admin")
      ) {
        query += ` AND DATE(lrd.followup_dt) < ? AND lrd.followup = ?`;
        queryParams.push(current_date, "Yes");
      } else {
        query += ` AND DATE(lpd.followup_dt) < ? AND lpd.followup = ?`;
        queryParams.push(current_date, "Yes");
      }
    } else if (
      typeof pageName === "string" &&
      pageName === "Upcoming Followup"
    ) {
      if (
        branch_admin ||
        team_leader ||
        sales_manager ||
        tele_caller ||
        (user_role !== "Master" && user_role !== "Admin")
      ) {
        query += ` AND DATE(lrd.followup_dt) > ? AND lrd.followup = ?`;
        queryParams.push(current_date, "Yes");
      } else {
        query += ` AND DATE(lpd.followup_dt) > ? AND lpd.followup = ?`;
        queryParams.push(current_date, "Yes");
      }
    }
    // else if (typeof pageName === "string" && pageName === "Lead By Status") {
    //   if (branch_admin || team_leader || sales_manager || tele_caller || (user_role !== "Master" && user_role !== "Admin")) {
    //     query += ` AND DATE(lrd.followup_dt) < ? AND lrd.followup = ?`;
    //     queryParams.push(current_date, "Yes");
    //   } else {
    //     query += ` AND DATE(lpd.followup_dt) < ? AND lpd.followup = ?`;
    //     queryParams.push(current_date, "Yes");
    //   }
    // }

    if (Array.isArray(source) && source.length > 0) {
      const whereConditions = source.map((param) => {
        queryParams.push(`%${param}%`);
        return "lpd.source LIKE ?";
      });
      query += ` AND (${whereConditions.join(" OR ")})`;
    }

    if (Array.isArray(service_type) && service_type.length > 0) {
      if (
        branch_admin ||
        team_leader ||
        sales_manager ||
        tele_caller ||
        (user_role !== "Master" && user_role !== "Admin")
      ) {
        const whereConditions = service_type.map((param) => {
          queryParams.push(`%${param}%`);
          return "lrd.service_type LIKE ?";
        });
        query += ` AND (${whereConditions.join(" OR ")})`;
      } else {
        const whereConditions = service_type.map((param) => {
          queryParams.push(`%${param}%`);
          return "lpd.service_type LIKE ?";
        });
        query += ` AND (${whereConditions.join(" OR ")})`;
      }
    }
    if (Array.isArray(pname) && pname.length > 0) {
      if (
        branch_admin ||
        team_leader ||
        sales_manager ||
        tele_caller ||
        (user_role !== "Master" && user_role !== "Admin")
      ) {
        const whereConditions = pname.map((param) => {
          queryParams.push(`%${param}%`);
          return "lrd.pname LIKE ?";
        });
        query += ` AND (${whereConditions.join(" OR ")})`;
      } else {
        const whereConditions = pname.map((param) => {
          queryParams.push(`%${param}%`);
          return "lpd.pname LIKE ?";
        });
        query += ` AND (${whereConditions.join(" OR ")})`;
      }
    }
    if (Array.isArray(ptype) && ptype.length > 0) {
      if (
        branch_admin ||
        team_leader ||
        sales_manager ||
        tele_caller ||
        (user_role !== "Master" && user_role !== "Admin")
      ) {
        const whereConditions = ptype.map((param) => {
          queryParams.push(`%${param}%`);
          return "lrd.ptype LIKE ?";
        });
        query += ` AND (${whereConditions.join(" OR ")})`;
      } else {
        const whereConditions = ptype.map((param) => {
          queryParams.push(`%${param}%`);
          return "lpd.ptype LIKE ?";
        });
        query += ` AND (${whereConditions.join(" OR ")})`;
      }
    }
    if (Array.isArray(country) && country.length > 0) {
      if (
        branch_admin ||
        team_leader ||
        sales_manager ||
        tele_caller ||
        (user_role !== "Master" && user_role !== "Admin")
      ) {
        const whereConditions = country.map((param) => {
          queryParams.push(`%${param}%`);
          return "lrd.country LIKE ?";
        });
        query += ` AND (${whereConditions.join(" OR ")})`;
      } else {
        const whereConditions = country.map((param) => {
          queryParams.push(`%${param}%`);
          return "lpd.country LIKE ?";
        });
        query += ` AND (${whereConditions.join(" OR ")})`;
      }
    }
    if (Array.isArray(state) && state.length > 0) {
      if (
        branch_admin ||
        team_leader ||
        sales_manager ||
        tele_caller ||
        (user_role !== "Master" && user_role !== "Admin")
      ) {
        const whereConditions = state.map((param) => {
          queryParams.push(`%${param}%`);
          return "lrd.state LIKE ?";
        });
        query += ` AND (${whereConditions.join(" OR ")})`;
      } else {
        const whereConditions = state.map((param) => {
          queryParams.push(`%${param}%`);
          return "lpd.state LIKE ?";
        });
        query += ` AND (${whereConditions.join(" OR ")})`;
      }
    }
    if (Array.isArray(city) && city.length > 0) {
      if (
        branch_admin ||
        team_leader ||
        sales_manager ||
        tele_caller ||
        (user_role !== "Master" && user_role !== "Admin")
      ) {
        const whereConditions = city.map((param) => {
          queryParams.push(`%${param}%`);
          return "lrd.city LIKE ?";
        });
        query += ` AND (${whereConditions.join(" OR ")})`;
      } else {
        const whereConditions = city.map((param) => {
          queryParams.push(`%${param}%`);
          return "lpd.city LIKE ?";
        });
        query += ` AND (${whereConditions.join(" OR ")})`;
      }
    }
    if (Array.isArray(locality) && locality.length > 0) {
      if (
        branch_admin ||
        team_leader ||
        sales_manager ||
        tele_caller ||
        (user_role !== "Master" && user_role !== "Admin")
      ) {
        const whereConditions = locality.map((param) => {
          queryParams.push(`%${param}%`);
          return "lrd.locality LIKE ?";
        });
        query += ` AND (${whereConditions.join(" OR ")})`;
      } else {
        const whereConditions = locality.map((param) => {
          queryParams.push(`%${param}%`);
          return "lpd.locality LIKE ?";
        });
        query += ` AND (${whereConditions.join(" OR ")})`;
      }
    }
    if (Array.isArray(pcategory) && pcategory.length > 0) {
      if (
        branch_admin ||
        team_leader ||
        sales_manager ||
        tele_caller ||
        (user_role !== "Master" && user_role !== "Admin")
      ) {
        const whereConditions = pcategory.map((param) => {
          queryParams.push(`%${param}%`);
          return "lrd.pcategory LIKE ?";
        });
        query += ` AND (${whereConditions.join(" OR ")})`;
      } else {
        const whereConditions = pcategory.map((param) => {
          queryParams.push(`%${param}%`);
          return "lpd.pcategory LIKE ?";
        });
        query += ` AND (${whereConditions.join(" OR ")})`;
      }
    }
    if (Array.isArray(pconfiguration) && pconfiguration.length > 0) {
      if (
        branch_admin ||
        team_leader ||
        sales_manager ||
        tele_caller ||
        (user_role !== "Master" && user_role !== "Admin")
      ) {
        const whereConditions = pconfiguration.map((param) => {
          queryParams.push(`%${param}%`);
          return "lrd.pconfiguration LIKE ?";
        });
        query += ` AND (${whereConditions.join(" OR ")})`;
      } else {
        const whereConditions = pconfiguration.map((param) => {
          queryParams.push(`%${param}%`);
          return "lpd.pconfiguration LIKE ?";
        });
        query += ` AND (${whereConditions.join(" OR ")})`;
      }
    }
    if (Array.isArray(leadstatus) && leadstatus.length > 0) {
      if (
        branch_admin ||
        team_leader ||
        sales_manager ||
        tele_caller ||
        (user_role !== "Master" && user_role !== "Admin")
      ) {
        const whereConditions = leadstatus.map((param) => {
          queryParams.push(`%${param}%`);
          return "lrd.status LIKE ?";
        });
        query += ` AND (${whereConditions.join(" OR ")})`;
      } else {
        const whereConditions = leadstatus.map((param) => {
          queryParams.push(`%${param}%`);
          return "lpd.status LIKE ?";
        });
        query += ` AND (${whereConditions.join(" OR ")})`;
      }
    }
    if (Array.isArray(userstatus) && userstatus.length > 0) {
      const whereConditions = userstatus.map((param) => {
        queryParams.push(`%${param}%`);
        return "lrd.status LIKE ?";
      });
      query += ` AND (${whereConditions.join(" OR ")})`;
    }

    if (Array.isArray(branch_admin) && branch_admin.length > 0) {
      const whereConditions = branch_admin.map((param) => {
        queryParams.push(`%${param}%`);
        return "lrd.assignto_id LIKE ?";
      });
      query += ` AND (${whereConditions.join(" OR ")})`;
    }
    if (Array.isArray(team_leader) && team_leader.length > 0) {
      const whereConditions = team_leader.map((param) => {
        queryParams.push(`%${param}%`);
        return "lrd.assignto_id LIKE ?";
      });
      query += ` AND (${whereConditions.join(" OR ")})`;
    }
    if (Array.isArray(sales_manager) && sales_manager.length > 0) {
      const whereConditions = sales_manager.map((param) => {
        queryParams.push(`%${param}%`);
        return "lrd.assignto_id LIKE ?";
      });
      query += ` AND (${whereConditions.join(" OR ")})`;
    }
    if (Array.isArray(tele_caller) && tele_caller.length > 0) {
      const whereConditions = tele_caller.map((param) => {
        queryParams.push(`%${param}%`);
        return "lrd.assignto_id LIKE ?";
      });
      query += ` AND (${whereConditions.join(" OR ")})`;
    }
    if (ldate_from !== "" && ldate_to !== "") {
      if (
        branch_admin ||
        team_leader ||
        sales_manager ||
        tele_caller ||
        (user_role !== "Master" && user_role !== "Admin")
      ) {
        query += ` AND DATE(lrd.create_dt) BETWEEN ? AND ?`;
        queryParams.push(ldate_from, ldate_to);
      } else {
        query += ` AND DATE(lpd.create_dt) BETWEEN ? AND ?`;
        queryParams.push(ldate_from, ldate_to);
      }
    }
    if (fdate_from.length > 0 && fdate_to.length > 0) {
      if (
        branch_admin ||
        team_leader ||
        sales_manager ||
        tele_caller ||
        (user_role !== "Master" && user_role !== "Admin")
      ) {
        query += ` AND lrd.followup = 'Yes' AND DATE(lrd.followup_dt) BETWEEN ? AND ?`;
        queryParams.push(fdate_from, fdate_to);
      } else {
        query += ` AND lpd.followup = 'Yes' AND DATE(lpd.followup_dt) BETWEEN ? AND ?`;
        queryParams.push(fdate_from, fdate_to);
      }
    }
    if (typeof anytext === "string" && anytext.length > 0) {
      // Construct the SQL query to search for anytext in multiple columns
      const whereConditions = [
        "lpd.source LIKE ?",
        "lpd.ref_name LIKE ?",
        "lpd.ref_mob LIKE ?",
        "lpd.ref_email LIKE ?",
        "lpd.l_id LIKE ?",
        "lpd.lname LIKE ?",
        "lpd.p_mob LIKE ?",
        "lpd.p_email LIKE ?",
        "lrd.comments LIKE ?",
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
        likeParam
      );
      query += ` AND (${whereConditions.join(" OR ")})`;
    }

    if (pageName === "User Lead") {
      query += `GROUP BY lrd.lreq_id ORDER BY lrd.lreq_id DESC LIMIT ? OFFSET ?`;
      queryParams.push(limit, offset);
    } else {
      if (user_role === "Master" || user_role === "Admin") {
        query += `GROUP BY lpd.l_id ORDER BY lpd.l_id DESC LIMIT ? OFFSET ?`;
        queryParams.push(limit, offset);
      } else {
        query += `GROUP BY lrd.lreq_id ORDER BY lrd.lreq_id DESC LIMIT ? OFFSET ?`;
        queryParams.push(limit, offset);
      }
    }
    // console.log("SQL Query:", query);
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

SearchLeadSchedulerRouter.post("/search-leads-count", (req, res) => {
  const current_date = dayjs().format("YYYY-MM-DD");
  const user_role = req.session.user[0].urole;
  const user_id = req.session.user[0].u_id;

  const requestData = req.body.data;
  const {
    source,
    service_type,
    pname,
    ptype,
    country,
    state,
    city,
    locality,
    pcategory,
    pconfiguration,
    leadstatus,
    userstatus,
    branch_admin,
    team_leader,
    sales_manager,
    tele_caller,
    ldate_from,
    ldate_to,
    fdate_from,
    fdate_to,
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

    if (user_role === "Master" || user_role === "Admin") {
      // Base query
      query = `SELECT COUNT(lpd.l_id) AS totalCount FROM crm_lead_primary_details AS lpd LEFT JOIN crm_lead_req_details AS lrd ON lrd.l_id = lpd.l_id LEFT JOIN crm_lead_status AS ls ON ls.status = lpd.status LEFT JOIN crm_users AS cu ON cu.u_id = lrd.assignto_id WHERE lpd.l_id != "" `;
    } else {
      // Base query
      query = `SELECT COUNT(lrd.lreq_id) AS totalCount FROM crm_lead_req_details AS lrd JOIN crm_lead_primary_details AS lpd ON lpd.l_id = lrd.l_id LEFT JOIN crm_lead_status AS ls ON lrd.status = ls.status LEFT JOIN crm_users AS cu ON cu.u_id = lrd.assignto_id WHERE lrd.assignto_id = ?`;
      queryParams.push(user_id);
    }

    if (typeof pageName === "string" && pageName === "Non Assign Lead") {
      if (
        branch_admin ||
        team_leader ||
        sales_manager ||
        tele_caller ||
        (user_role !== "Master" && user_role !== "Admin")
      ) {
        query += ` AND lrd.assign_status = ?`;
      } else {
        query += ` AND lpd.assign_status = ?`;
      }
      queryParams.push(" ");
    } else if (typeof pageName === "string" && pageName === "Assign Lead") {
      if (
        branch_admin ||
        team_leader ||
        sales_manager ||
        tele_caller ||
        (user_role !== "Master" && user_role !== "Admin")
      ) {
        query += ` AND lrd.assign_status = ?`;
        queryParams.push("Yes");
      } else {
        query += ` AND lpd.assign_status = ?`;
        queryParams.push("Yes");
      }
    } else if (
      typeof pageName === "string" &&
      pageName === "Today's Followup"
    ) {
      if (
        branch_admin ||
        team_leader ||
        sales_manager ||
        tele_caller ||
        (user_role !== "Master" && user_role !== "Admin")
      ) {
        query += ` AND DATE(lrd.followup_dt) = ? AND lrd.followup = ?`;
        queryParams.push(current_date, "Yes");
      } else {
        query += ` AND DATE(lpd.followup_dt) = ? AND lpd.followup = ?`;
        queryParams.push(current_date, "Yes");
      }
    } else if (typeof pageName === "string" && pageName === "Missed Followup") {
      if (
        branch_admin ||
        team_leader ||
        sales_manager ||
        tele_caller ||
        (user_role !== "Master" && user_role !== "Admin")
      ) {
        query += ` AND DATE(lrd.followup_dt) < ? AND lrd.followup = ?`;
        queryParams.push(current_date, "Yes");
      } else {
        query += ` AND DATE(lpd.followup_dt) < ? AND lpd.followup = ?`;
        queryParams.push(current_date, "Yes");
      }
    } else if (
      typeof pageName === "string" &&
      pageName === "Upcoming Followup"
    ) {
      if (
        branch_admin ||
        team_leader ||
        sales_manager ||
        tele_caller ||
        (user_role !== "Master" && user_role !== "Admin")
      ) {
        query += ` AND DATE(lrd.followup_dt) > ? AND lrd.followup = ?`;
        queryParams.push(current_date, "Yes");
      } else {
        query += ` AND DATE(lpd.followup_dt) > ? AND lpd.followup = ?`;
        queryParams.push(current_date, "Yes");
      }
    }
    // else if (typeof pageName === "string" && pageName === "Lead By Status") {
    //   if (branch_admin || team_leader || sales_manager || tele_caller || (user_role !== "Master" && user_role !== "Admin")) {
    //     query += ` AND DATE(lrd.followup_dt) < ? AND lrd.followup = ?`;
    //     queryParams.push(current_date, "Yes");
    //   } else {
    //     query += ` AND DATE(lpd.followup_dt) < ? AND lpd.followup = ?`;
    //     queryParams.push(current_date, "Yes");
    //   }
    // }

    if (Array.isArray(source) && source.length > 0) {
      const whereConditions = source.map((param) => {
        queryParams.push(`%${param}%`);
        return "lpd.source LIKE ?";
      });
      query += ` AND (${whereConditions.join(" OR ")})`;
    }

    if (Array.isArray(service_type) && service_type.length > 0) {
      if (
        branch_admin ||
        team_leader ||
        sales_manager ||
        tele_caller ||
        (user_role !== "Master" && user_role !== "Admin")
      ) {
        const whereConditions = service_type.map((param) => {
          queryParams.push(`%${param}%`);
          return "lrd.service_type LIKE ?";
        });
        query += ` AND (${whereConditions.join(" OR ")})`;
      } else {
        const whereConditions = service_type.map((param) => {
          queryParams.push(`%${param}%`);
          return "lpd.service_type LIKE ?";
        });
        query += ` AND (${whereConditions.join(" OR ")})`;
      }
    }
    if (Array.isArray(pname) && pname.length > 0) {
      if (
        branch_admin ||
        team_leader ||
        sales_manager ||
        tele_caller ||
        (user_role !== "Master" && user_role !== "Admin")
      ) {
        const whereConditions = pname.map((param) => {
          queryParams.push(`%${param}%`);
          return "lrd.pname LIKE ?";
        });
        query += ` AND (${whereConditions.join(" OR ")})`;
      } else {
        const whereConditions = pname.map((param) => {
          queryParams.push(`%${param}%`);
          return "lpd.pname LIKE ?";
        });
        query += ` AND (${whereConditions.join(" OR ")})`;
      }
    }
    if (Array.isArray(ptype) && ptype.length > 0) {
      if (
        branch_admin ||
        team_leader ||
        sales_manager ||
        tele_caller ||
        (user_role !== "Master" && user_role !== "Admin")
      ) {
        const whereConditions = ptype.map((param) => {
          queryParams.push(`%${param}%`);
          return "lrd.ptype LIKE ?";
        });
        query += ` AND (${whereConditions.join(" OR ")})`;
      } else {
        const whereConditions = ptype.map((param) => {
          queryParams.push(`%${param}%`);
          return "lpd.ptype LIKE ?";
        });
        query += ` AND (${whereConditions.join(" OR ")})`;
      }
    }
    if (Array.isArray(country) && country.length > 0) {
      if (
        branch_admin ||
        team_leader ||
        sales_manager ||
        tele_caller ||
        (user_role !== "Master" && user_role !== "Admin")
      ) {
        const whereConditions = country.map((param) => {
          queryParams.push(`%${param}%`);
          return "lrd.country LIKE ?";
        });
        query += ` AND (${whereConditions.join(" OR ")})`;
      } else {
        const whereConditions = country.map((param) => {
          queryParams.push(`%${param}%`);
          return "lpd.country LIKE ?";
        });
        query += ` AND (${whereConditions.join(" OR ")})`;
      }
    }
    if (Array.isArray(state) && state.length > 0) {
      if (
        branch_admin ||
        team_leader ||
        sales_manager ||
        tele_caller ||
        (user_role !== "Master" && user_role !== "Admin")
      ) {
        const whereConditions = state.map((param) => {
          queryParams.push(`%${param}%`);
          return "lrd.state LIKE ?";
        });
        query += ` AND (${whereConditions.join(" OR ")})`;
      } else {
        const whereConditions = state.map((param) => {
          queryParams.push(`%${param}%`);
          return "lpd.state LIKE ?";
        });
        query += ` AND (${whereConditions.join(" OR ")})`;
      }
    }
    if (Array.isArray(city) && city.length > 0) {
      if (
        branch_admin ||
        team_leader ||
        sales_manager ||
        tele_caller ||
        (user_role !== "Master" && user_role !== "Admin")
      ) {
        const whereConditions = city.map((param) => {
          queryParams.push(`%${param}%`);
          return "lrd.city LIKE ?";
        });
        query += ` AND (${whereConditions.join(" OR ")})`;
      } else {
        const whereConditions = city.map((param) => {
          queryParams.push(`%${param}%`);
          return "lpd.city LIKE ?";
        });
        query += ` AND (${whereConditions.join(" OR ")})`;
      }
    }
    if (Array.isArray(locality) && locality.length > 0) {
      if (
        branch_admin ||
        team_leader ||
        sales_manager ||
        tele_caller ||
        (user_role !== "Master" && user_role !== "Admin")
      ) {
        const whereConditions = locality.map((param) => {
          queryParams.push(`%${param}%`);
          return "lrd.locality LIKE ?";
        });
        query += ` AND (${whereConditions.join(" OR ")})`;
      } else {
        const whereConditions = locality.map((param) => {
          queryParams.push(`%${param}%`);
          return "lpd.locality LIKE ?";
        });
        query += ` AND (${whereConditions.join(" OR ")})`;
      }
    }
    if (Array.isArray(pcategory) && pcategory.length > 0) {
      if (
        branch_admin ||
        team_leader ||
        sales_manager ||
        tele_caller ||
        (user_role !== "Master" && user_role !== "Admin")
      ) {
        const whereConditions = pcategory.map((param) => {
          queryParams.push(`%${param}%`);
          return "lrd.pcategory LIKE ?";
        });
        query += ` AND (${whereConditions.join(" OR ")})`;
      } else {
        const whereConditions = pcategory.map((param) => {
          queryParams.push(`%${param}%`);
          return "lpd.pcategory LIKE ?";
        });
        query += ` AND (${whereConditions.join(" OR ")})`;
      }
    }
    if (Array.isArray(pconfiguration) && pconfiguration.length > 0) {
      if (
        branch_admin ||
        team_leader ||
        sales_manager ||
        tele_caller ||
        (user_role !== "Master" && user_role !== "Admin")
      ) {
        const whereConditions = pconfiguration.map((param) => {
          queryParams.push(`%${param}%`);
          return "lrd.pconfiguration LIKE ?";
        });
        query += ` AND (${whereConditions.join(" OR ")})`;
      } else {
        const whereConditions = pconfiguration.map((param) => {
          queryParams.push(`%${param}%`);
          return "lpd.pconfiguration LIKE ?";
        });
        query += ` AND (${whereConditions.join(" OR ")})`;
      }
    }
    if (Array.isArray(leadstatus) && leadstatus.length > 0) {
      if (
        branch_admin ||
        team_leader ||
        sales_manager ||
        tele_caller ||
        (user_role !== "Master" && user_role !== "Admin")
      ) {
        const whereConditions = leadstatus.map((param) => {
          queryParams.push(`%${param}%`);
          return "lrd.status LIKE ?";
        });
        query += ` AND (${whereConditions.join(" OR ")})`;
      } else {
        const whereConditions = leadstatus.map((param) => {
          queryParams.push(`%${param}%`);
          return "lpd.status LIKE ?";
        });
        query += ` AND (${whereConditions.join(" OR ")})`;
      }
    }
    if (Array.isArray(userstatus) && userstatus.length > 0) {
      const whereConditions = userstatus.map((param) => {
        queryParams.push(`%${param}%`);
        return "lrd.status LIKE ?";
      });
      query += ` AND (${whereConditions.join(" OR ")})`;
    }
    if (Array.isArray(branch_admin) && branch_admin.length > 0) {
      const whereConditions = branch_admin.map((param) => {
        queryParams.push(`%${param}%`);
        return "lrd.assignto_id LIKE ?";
      });
      query += ` AND (${whereConditions.join(" OR ")})`;
    }
    if (Array.isArray(team_leader) && team_leader.length > 0) {
      const whereConditions = team_leader.map((param) => {
        queryParams.push(`%${param}%`);
        return "lrd.assignto_id LIKE ?";
      });
      query += ` AND (${whereConditions.join(" OR ")})`;
    }
    if (Array.isArray(sales_manager) && sales_manager.length > 0) {
      const whereConditions = sales_manager.map((param) => {
        queryParams.push(`%${param}%`);
        return "lrd.assignto_id LIKE ?";
      });
      query += ` AND (${whereConditions.join(" OR ")})`;
    }
    if (Array.isArray(tele_caller) && tele_caller.length > 0) {
      const whereConditions = tele_caller.map((param) => {
        queryParams.push(`%${param}%`);
        return "lrd.assignto_id LIKE ?";
      });
      query += ` AND (${whereConditions.join(" OR ")})`;
    }
    if (ldate_from.length > 0 && ldate_to.length > 0) {
      if (
        branch_admin ||
        team_leader ||
        sales_manager ||
        tele_caller ||
        (user_role !== "Master" && user_role !== "Admin")
      ) {
        query += ` AND DATE(lrd.create_dt) BETWEEN ? AND ?`;
        queryParams.push(ldate_from, ldate_to);
      } else {
        query += ` AND DATE(lpd.create_dt) BETWEEN ? AND ?`;
        queryParams.push(ldate_from, ldate_to);
      }
    }
    if (fdate_from.length > 0 && fdate_to.length > 0) {
      if (
        branch_admin ||
        team_leader ||
        sales_manager ||
        tele_caller ||
        (user_role !== "Master" && user_role !== "Admin")
      ) {
        query += ` AND lrd.followup = 'Yes' AND DATE(lrd.followup_dt) BETWEEN ? AND ?`;
        queryParams.push(fdate_from, fdate_to);
      } else {
        query += ` AND lpd.followup = 'Yes' AND DATE(lpd.followup_dt) BETWEEN ? AND ?`;
        queryParams.push(fdate_from, fdate_to);
      }
    }

    if (typeof anytext === "string" && anytext.length > 0) {
      // Construct the SQL query to search for anytext in multiple columns
      const whereConditions = [
        "lpd.source LIKE ?",
        "lpd.ref_name LIKE ?",
        "lpd.ref_mob LIKE ?",
        "lpd.ref_email LIKE ?",
        "lpd.l_id LIKE ?",
        "lpd.lname LIKE ?",
        "lpd.p_mob LIKE ?",
        "lpd.p_email LIKE ?",
        "lrd.comments LIKE ?",
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
        likeParam
      );
      query += ` AND (${whereConditions.join(" OR ")})`;
    }

    // if (user_role === "Master" || user_role === "Admin") {
    //   query += ` GROUP BY lpd.l_id ORDER BY lpd.l_id DESC`;
    // } else {
    //   query += ` GROUP BY lrd.lreq_id ORDER BY lrd.lreq_id DESC`;
    // }

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
