const express = require("express");
const pool = require("../../../Database.js");
const dayjs = require("dayjs");

const SearchLeadRouter = express.Router();

SearchLeadRouter.post("/search-leads", (req, res) => {
  const user_role = req.session.user[0].urole;
  const user_id = req.session.user[0].u_id;
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const pageSize = Math.max(1, parseInt(req.query.pageSize) || 10);
  const offset = (page - 1) * pageSize;
  const limit = pageSize;

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
    lead_priority,
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
  } = req.body.data;

  pool.getConnection((error, connection) => {
    if (error) {
      console.error(error);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    const queryParams = [];
    const whereClauses = [`1 = 1`];
    // const whereClauses = [`lpd.identity != 'imported'`];
    const hasRole = branch_admin || team_leader || sales_manager || tele_caller;
    const getColumn = (field) => {
      if (user_role === "Master" || user_role === "Admin") {
        return hasRole ? `lrd.${field} OR lpd.${field}` : `lpd.${field}`;
      } else {
        return `lrd.${field}`;
      }
    };

    if (user_role !== "Master" && user_role !== "Admin") {
      queryParams.push(user_id, user_id, user_id, user_id, user_id, user_id, user_id, user_id, user_id)
    }


    const addArrayFilter = (field, values) => {
      if (Array.isArray(values) && values.length > 0) {
        const clause = `(${values.map(() => `${field} = ?`).join(" OR ")})`;
        whereClauses.push(clause);
        queryParams.push(...values);
      }
    };

    // Dynamic Filters
    addArrayFilter("lpd.source", source);
    addArrayFilter(getColumn("pname"), pname);
    addArrayFilter(getColumn("ptype"), ptype);
    addArrayFilter(getColumn("service_type"), service_type);
    addArrayFilter(getColumn("pconfiguration"), pconfiguration);
    addArrayFilter(getColumn("pcategory"), pcategory);
    addArrayFilter(getColumn("lead_priority"), lead_priority);
    addArrayFilter(getColumn("city"), city);
    addArrayFilter(getColumn("country"), country);
    addArrayFilter(getColumn("state"), state);
    addArrayFilter(getColumn("locality"), locality);
    addArrayFilter("lpd.status", leadstatus);
    addArrayFilter("lrd.status", userstatus);
    addArrayFilter("lrd.assignto_id", branch_admin);
    addArrayFilter("lrd.assignto_id", sales_manager);
    addArrayFilter("lrd.assignto_id", tele_caller);
    addArrayFilter("lrd.assignto_id", team_leader);

    // Date filters
    if (ldate_from && ldate_to) {
      whereClauses.push("DATE(lpd.create_dt) BETWEEN ? AND ?");
      queryParams.push(ldate_from, ldate_to);
    }

    if (fdate_from && fdate_to) {
      whereClauses.push("DATE(lpd.followup_dt) BETWEEN ? AND ?");
      queryParams.push(fdate_from, fdate_to);
    }

    // Full-text search
    if (anytext) {
      const likeText = `%${anytext}%`;
      whereClauses.push(`
        (
          lpd.lname LIKE ? OR
          lpd.ref_name LIKE ? OR
          lpd.ref_mob LIKE ? OR
          lpd.ref_email LIKE ? OR
          lpd.p_mob LIKE ? OR
          lpd.p_email LIKE ? OR
          lpd.s_mob LIKE ?
        )
      `);
      queryParams.push(likeText, likeText, likeText, likeText, likeText, likeText, likeText);
    }

    let baseQuery = ``;

    if (user_role === "Master" || user_role === "Admin") {
      baseQuery = `
      SELECT 
        lpd.l_id AS l_id,
        lrd.lreq_id AS assignlead_id,
        GROUP_CONCAT(cu.username) AS assign_users,
        CONCAT(IFNULL(GROUP_CONCAT(lrd.comments SEPARATOR '~'), '~'), '~', IFNULL(lpd.comments, '~')) AS comments,
        lpd.create_dt,
        lpd.brk_id,
        lpd.ref_name,
        lpd.ref_ccode,
        lpd.ref_mob,
        lpd.ref_email,
        lpd.identity,
        lpd.lname,
        CONCAT(lpd.p_ccode, ' ', lpd.p_mob) AS mobile,
        lpd.p_ccode,
        lpd.p_mob,
        lpd.s_ccode,
        lpd.s_mob,
        lpd.form_name,
        lpd.p_email,
        lpd.status as admin_status,
        lpd.lead_priority,
        GROUP_CONCAT(lrd.status,' - ', cu.username) AS users_status,
        lpd.pname,
        lpd.followup,
        lpd.followup_dt,
        lpd.source,
        lpd.city,
        lpd.locality,
        lpd.sub_locality,
        ls.color,
        lpd.clicked,
        lpd.source_type,
        lpd.service_type,
        lpd.ptype,
        lpd.pcategory,
        lpd.pconfiguration,
        lpd.min_area,
        lpd.max_area,
        lpd.area_unit,
        lpd.min_price,
        lpd.max_price,
        lpd.price_unit,
        lpd.country,
        lpd.state,
        lpd.buyer_type,
        lpd.investment_type,
        lpd.post_handover,
        lpd.other_details,
        lpd.document,
        lpd.assign_status,
        (
          SELECT clh.status 
          FROM crm_lead_history AS clh 
          WHERE clh.l_id = lpd.l_id 
          ORDER BY clh.update_dt DESC 
          LIMIT 1
        ) AS latest_status,
        (
          SELECT cu.username 
          FROM crm_lead_history AS clh 
          LEFT JOIN crm_users AS cu ON clh.u_id = cu.u_id 
          WHERE clh.l_id = lpd.l_id 
          ORDER BY clh.update_dt DESC 
          LIMIT 1
        ) AS latest_username,
        (
          SELECT ls.color 
          FROM crm_lead_history AS clh 
          LEFT JOIN crm_lead_status AS ls ON clh.status = ls.status 
          WHERE clh.l_id = lpd.l_id 
          ORDER BY clh.update_dt DESC 
          LIMIT 1
        ) AS latest_status_color
      FROM crm_lead_primary_details AS lpd
      LEFT JOIN crm_lead_req_details AS lrd ON lrd.l_id = lpd.l_id
      LEFT JOIN crm_lead_status AS ls ON ls.status = lpd.status
      LEFT JOIN crm_users AS cu ON cu.u_id = lrd.assignto_id
      WHERE ${whereClauses.join(" AND ")}
      GROUP BY lpd.l_id
      ORDER BY CASE WHEN lpd.clicked = 0 THEN 0 ELSE 1 END, lpd.l_id DESC
      LIMIT ? OFFSET ?
    `;
    } else {
      baseQuery = `SELECT lrd.lreq_id AS l_id, lrd.l_id AS assignlead_id, lrd.create_dt, lpd.brk_id, lpd.ref_name, lpd.ref_ccode, lpd.ref_mob, lpd.ref_email, lpd.lname, lrd.status, lrd.pname, lpd.source, ls.color, lrd.clicked, GROUP_CONCAT(IF(cu.u_id != ?, cu.username, NULL) SEPARATOR '|') AS assign_users, CONCAT(IFNULL(GROUP_CONCAT((SELECT GROUP_CONCAT(lrd.comments SEPARATOR '~') FROM crm_lead_req_details AS lrd WHERE lrd.l_id = lpd.l_id AND (lrd.assignto_id = ? OR lrd.assignby_id = ?)) SEPARATOR '~'), '~'),'~',IFNULL(lpd.comments, '~')) AS comments, CONCAT(lpd.p_ccode, ' ', lpd.p_mob) AS mobile, lpd.p_ccode,p_mob, lpd.form_name, lpd.p_email, GROUP_CONCAT(lrd.status,' - ', cu.username) AS users_status, lpd.pname, lrd.l_lock, lrd.followup, lrd.followup_dt, lpd.city, lpd.sub_locality, lpd.source_type, lpd.service_type, lpd.ptype, lpd.pcategory, lpd.pconfiguration, lpd.min_area, lpd.max_area, lpd.area_unit, lpd.min_price, lpd.max_price, lpd.price_unit, lpd.country, lpd.state, lpd.buyer_type ,lpd.investment_type,lpd.post_handover, lpd.other_details, lpd.document, lpd.assign_status,(SELECT clh.status FROM crm_lead_history AS clh WHERE clh.l_id = lpd.l_id AND (clh.u_id = ? OR clh.u_id IN (SELECT crm_lead_req_details.assignto_id FROM crm_lead_req_details WHERE crm_lead_req_details.assignby_id = ? AND crm_lead_req_details.l_id = lpd.l_id) OR clh.u_id IN (SELECT u_id FROM crm_users WHERE utype = 'Admin')) ORDER BY clh.update_dt DESC LIMIT 1) AS latest_status,(SELECT ls.color FROM crm_lead_history AS clh  LEFT JOIN crm_lead_status AS ls ON clh.status = ls.status WHERE clh.l_id = lpd.l_id AND (clh.u_id = ? OR clh.u_id IN (SELECT crm_lead_req_details.assignto_id FROM crm_lead_req_details WHERE crm_lead_req_details.assignby_id = ? AND crm_lead_req_details.l_id = lpd.l_id) OR clh.u_id IN (SELECT u_id FROM crm_users WHERE utype = 'Admin')) ORDER BY clh.update_dt DESC LIMIT 1) AS latest_status_color,(SELECT cu.username FROM crm_lead_history AS clh LEFT JOIN crm_users AS cu ON clh.u_id = cu.u_id WHERE clh.l_id = lpd.l_id AND (clh.u_id = ? OR clh.u_id IN (SELECT crm_lead_req_details.assignto_id FROM crm_lead_req_details WHERE crm_lead_req_details.assignby_id = ? AND crm_lead_req_details.l_id = lpd.l_id) OR clh.u_id IN (SELECT u_id FROM crm_users WHERE utype = 'Admin')) ORDER BY clh.update_dt DESC LIMIT 1) AS latest_username FROM crm_lead_req_details AS lrd JOIN crm_lead_primary_details AS lpd ON lpd.l_id = lrd.l_id LEFT JOIN crm_lead_status AS ls ON lrd.status = ls.status LEFT JOIN crm_users AS cu ON cu.u_id = lrd.assignto_id WHERE ${whereClauses.join(" AND ")}  GROUP BY lrd.l_id ORDER BY lrd.l_id DESC LIMIT ? OFFSET ?`;
    }

    const countQuery = `
      SELECT COUNT(*) AS total FROM (
        SELECT lpd.l_id 
        FROM crm_lead_primary_details AS lpd
        LEFT JOIN crm_lead_req_details AS lrd ON lrd.l_id = lpd.l_id
        LEFT JOIN crm_lead_status AS ls ON ls.status = lpd.status
        LEFT JOIN crm_users AS cu ON cu.u_id = lrd.assignto_id
        WHERE ${whereClauses.join(" AND ")}
        GROUP BY lpd.l_id
      ) AS count_table
    `;

    const fullQueryParams = [...queryParams, limit, offset];

    connection.query(countQuery, queryParams, (countErr, countResult) => {
      if (countErr) {
        connection.release();
        console.error(countErr);
        return res.status(500).json({ error: "Error fetching count" });
      }
      connection.query(baseQuery, fullQueryParams, (dataErr, dataResult) => {
        connection.release();
        if (dataErr) {
          console.error(dataErr);
          return res.status(500).json({ error: "Error fetching data" });
        }
        res.json(dataResult);
      });
    });
  });
});
// SearchLeadRouter.post("/search-leads", (req, res) => {
//   const user_role = req.session.user[0].urole;
//   const user_id = req.session.user[0].u_id;
//   const page = Math.max(1, parseInt(req.query.page) || 1);
//   const pageSize = Math.max(1, parseInt(req.query.pageSize) || 10);
//   const offset = (page - 1) * pageSize;
//   const limit = pageSize;

//   const {
//     source,
//     service_type,
//     pname,
//     ptype,
//     country,
//     state,
//     city,
//     locality,
//     pcategory,
//     pconfiguration,
//     leadstatus,
//     lead_priority,
//     userstatus,
//     branch_admin,
//     team_leader,
//     sales_manager,
//     tele_caller,
//     ldate_from,
//     ldate_to,
//     fdate_from,
//     fdate_to,
//     anytext,
//     pageName,
//   } = req.body.data;

//   pool.getConnection((error, connection) => {
//     if (error) {
//       console.error(error);
//       return res.status(500).json({ error: "Internal Server Error" });
//     }

//     const queryParams = [];
//     const whereClauses = [`1 = 1`];
//     // const whereClauses = [`lpd.identity != 'imported'`];
//     const hasRole = branch_admin || team_leader || sales_manager || tele_caller;
//     const getColumn = (field) => {
//       if (user_role === "Master" || user_role === "Admin") {
//         return hasRole ? `lrd.${field} OR lpd.${field}` : `lpd.${field}`;
//       } else {
//         return `lrd.${field}`;
//       }
//     };

//     if (user_role !== "Master" && user_role !== "Admin") {
//       queryParams.push(user_id, user_id, user_id, user_id, user_id, user_id, user_id)
//     }


//     const addArrayFilter = (field, values) => {
//       if (Array.isArray(values) && values.length > 0) {
//         const clause = `(${values.map(() => `${field} = ?`).join(" OR ")})`;
//         whereClauses.push(clause);
//         queryParams.push(...values);
//       }
//     };

//     // Dynamic Filters
//     addArrayFilter("lpd.source", source);
//     addArrayFilter(getColumn("pname"), pname);
//     addArrayFilter(getColumn("ptype"), ptype);
//     addArrayFilter(getColumn("service_type"), service_type);
//     addArrayFilter(getColumn("pconfiguration"), pconfiguration);
//     addArrayFilter(getColumn("pcategory"), pcategory);
//     addArrayFilter(getColumn("lead_priority"), lead_priority);
//     addArrayFilter(getColumn("city"), city);
//     addArrayFilter(getColumn("country"), country);
//     addArrayFilter(getColumn("state"), state);
//     addArrayFilter(getColumn("locality"), locality);
//     addArrayFilter("lpd.status", leadstatus);
//     addArrayFilter("lrd.status", userstatus);
//     addArrayFilter("lrd.assignto_id", branch_admin);
//     addArrayFilter("lrd.assignto_id", sales_manager);
//     addArrayFilter("lrd.assignto_id", tele_caller);
//     addArrayFilter("lrd.assignto_id", team_leader);

//     // Date filters
//     if (ldate_from && ldate_to) {
//       whereClauses.push("DATE(lpd.create_dt) BETWEEN ? AND ?");
//       queryParams.push(ldate_from, ldate_to);
//     }

//     if (fdate_from && fdate_to) {
//       whereClauses.push("DATE(lpd.followup_dt) BETWEEN ? AND ?");
//       queryParams.push(fdate_from, fdate_to);
//     }

//     // Full-text search
//     if (anytext) {
//       const likeText = `%${anytext}%`;
//       whereClauses.push(`
//         (
//           lpd.lname LIKE ? OR
//           lpd.ref_name LIKE ? OR
//           lpd.ref_mob LIKE ? OR
//           lpd.ref_email LIKE ? OR
//           lpd.p_mob LIKE ? OR
//           lpd.p_email LIKE ? OR
//           lpd.s_mob LIKE ?
//         )
//       `);
//       queryParams.push(likeText, likeText, likeText, likeText, likeText, likeText, likeText);
//     }

//     let baseQuery = ``;

//     if (user_role === "Master" || user_role === "Admin") {
//       baseQuery = `
//       SELECT 
//         lpd.l_id AS l_id,
//         lrd.lreq_id AS assignlead_id,
//         GROUP_CONCAT(cu.username) AS assign_users,
//         CONCAT(IFNULL(GROUP_CONCAT(lrd.comments SEPARATOR '~'), '~'), '~', IFNULL(lpd.comments, '~')) AS comments,
//         lpd.create_dt,
//         lpd.brk_id,
//         lpd.ref_name,
//         lpd.ref_ccode,
//         lpd.ref_mob,
//         lpd.ref_email,
//         lpd.identity,
//         lpd.lname,
//         CONCAT(lpd.p_ccode, ' ', lpd.p_mob) AS mobile,
//         lpd.p_ccode,
//         lpd.p_mob,
//         lpd.s_ccode,
//         lpd.s_mob,
//         lpd.form_name,
//         lpd.p_email,
//         lpd.status as admin_status,
//         lpd.lead_priority,
//         GROUP_CONCAT(lrd.status,' - ', cu.username) AS users_status,
//         lpd.pname,
//         lpd.followup,
//         lpd.followup_dt,
//         lpd.source,
//         lpd.city,
//         lpd.locality,
//         lpd.sub_locality,
//         ls.color,
//         lpd.clicked,
//         lpd.source_type,
//         lpd.service_type,
//         lpd.ptype,
//         lpd.pcategory,
//         lpd.pconfiguration,
//         lpd.min_area,
//         lpd.max_area,
//         lpd.area_unit,
//         lpd.min_price,
//         lpd.max_price,
//         lpd.price_unit,
//         lpd.country,
//         lpd.state,
//         lpd.buyer_type,
//         lpd.investment_type,
//         lpd.post_handover,
//         lpd.other_details,
//         lpd.document,
//         lpd.assign_status,
//         (
//           SELECT clh.status 
//           FROM crm_lead_history AS clh 
//           WHERE clh.l_id = lpd.l_id 
//           ORDER BY clh.update_dt DESC 
//           LIMIT 1
//         ) AS latest_status,
//         (
//           SELECT cu.username 
//           FROM crm_lead_history AS clh 
//           LEFT JOIN crm_users AS cu ON clh.u_id = cu.u_id 
//           WHERE clh.l_id = lpd.l_id 
//           ORDER BY clh.update_dt DESC 
//           LIMIT 1
//         ) AS latest_username,
//         (
//           SELECT ls.color 
//           FROM crm_lead_history AS clh 
//           LEFT JOIN crm_lead_status AS ls ON clh.status = ls.status 
//           WHERE clh.l_id = lpd.l_id 
//           ORDER BY clh.update_dt DESC 
//           LIMIT 1
//         ) AS latest_status_color
//       FROM crm_lead_primary_details AS lpd
//       LEFT JOIN crm_lead_req_details AS lrd ON lrd.l_id = lpd.l_id
//       LEFT JOIN crm_lead_status AS ls ON ls.status = lpd.status
//       LEFT JOIN crm_users AS cu ON cu.u_id = lrd.assignto_id
//       WHERE ${whereClauses.join(" AND ")}
//       GROUP BY lpd.l_id
//       ORDER BY CASE WHEN lpd.clicked = 0 THEN 0 ELSE 1 END, lpd.l_id DESC
//       LIMIT ? OFFSET ?
//     `;
//     } else {
//       baseQuery = `SELECT lrd.lreq_id AS l_id, lrd.l_id AS assignlead_id, lrd.create_dt, lpd.brk_id, lpd.ref_name, lpd.ref_ccode, lpd.ref_mob, lpd.ref_email, lpd.lname, lrd.status, lrd.pname, lpd.source, ls.color, lrd.clicked, GROUP_CONCAT(IF(cu.u_id != ?, cu.username, NULL) SEPARATOR '|') AS assign_users, CONCAT(IFNULL(GROUP_CONCAT((SELECT GROUP_CONCAT(lrd.comments SEPARATOR '~') FROM lrd WHERE lrd.l_id = lpd.l_id AND (lrd.assignto_id = ? OR lrd.assignby_id = ?)) SEPARATOR '~'), '~'),'~',IFNULL(lpd.comments, '~')) AS comments, CONCAT(lpd.p_ccode, ' ', lpd.p_mob) AS mobile, lpd.p_ccode,p_mob, lpd.form_name, lpd.p_email, GROUP_CONCAT(lrd.status,' - ', cu.username) AS users_status, lpd.pname, lrd.l_lock, lrd.followup, lrd.followup_dt, lpd.city, lpd.sub_locality, lpd.source_type, lpd.service_type, lpd.ptype, lpd.pcategory, lpd.pconfiguration, lpd.min_area, lpd.max_area, lpd.area_unit, lpd.min_price, lpd.max_price, lpd.price_unit, lpd.country, lpd.state, lpd.buyer_type ,lpd.investment_type,lpd.post_handover, lpd.other_details, lpd.document, lpd.assign_status,(SELECT clh.status FROM crm_lead_history AS clh WHERE clh.l_id = lpd.l_id AND (clh.u_id = ? OR clh.u_id IN (SELECT crm_lead_req_details.assignto_id FROM crm_lead_req_details WHERE crm_lead_req_details.assignby_id = ? AND crm_lead_req_details.l_id = lpd.l_id) OR clh.u_id IN (SELECT u_id FROM crm_users WHERE utype = 'Admin')) ORDER BY clh.update_dt DESC LIMIT 1) AS latest_status,(SELECT ls.color FROM crm_lead_history AS clh  LEFT JOIN crm_lead_status AS ls ON clh.status = ls.status WHERE clh.l_id = lpd.l_id AND (clh.u_id = ? OR clh.u_id IN (SELECT crm_lead_req_details.assignto_id FROM crm_lead_req_details WHERE crm_lead_req_details.assignby_id = ? AND crm_lead_req_details.l_id = lpd.l_id) OR clh.u_id IN (SELECT u_id FROM crm_users WHERE utype = 'Admin')) ORDER BY clh.update_dt DESC LIMIT 1) AS latest_status_color,(SELECT cu.username FROM crm_lead_history AS clh LEFT JOIN crm_users AS cu ON clh.u_id = cu.u_id WHERE clh.l_id = lpd.l_id AND (clh.u_id = ? OR clh.u_id IN (SELECT crm_lead_req_details.assignto_id FROM crm_lead_req_details WHERE crm_lead_req_details.assignby_id = ? AND crm_lead_req_details.l_id = lpd.l_id) OR clh.u_id IN (SELECT u_id FROM crm_users WHERE utype = 'Admin')) ORDER BY clh.update_dt DESC LIMIT 1) AS latest_username FROM crm_lead_req_details AS lrd JOIN crm_lead_primary_details AS lpd ON lpd.l_id = lrd.l_id LEFT JOIN crm_lead_status AS ls ON lrd.status = ls.status LEFT JOIN crm_users AS cu ON cu.u_id = lrd.assignto_id WHERE ${whereClauses.join(" AND ")} GROUP BY lrd.l_id ORDER BY lrd.l_id DESC`;
//     }

//     const countQuery = `
//       SELECT COUNT(*) AS total FROM (
//         SELECT lpd.l_id 
//         FROM crm_lead_primary_details AS lpd
//         LEFT JOIN crm_lead_req_details AS lrd ON lrd.l_id = lpd.l_id
//         LEFT JOIN crm_lead_status AS ls ON ls.status = lpd.status
//         LEFT JOIN crm_users AS cu ON cu.u_id = lrd.assignto_id
//         WHERE ${whereClauses.join(" AND ")}
//         GROUP BY lpd.l_id
//       ) AS count_table
//     `;

//     const fullQueryParams = [...queryParams, limit, offset];

//     connection.query(countQuery, queryParams, (countErr, countResult) => {
//       if (countErr) {
//         connection.release();
//         console.error(countErr);
//         return res.status(500).json({ error: "Error fetching count" });
//       }
//       connection.query(baseQuery, fullQueryParams, (dataErr, dataResult) => {
//         connection.release();
//         if (dataErr) {
//           console.error(dataErr);
//           return res.status(500).json({ error: "Error fetching data" });
//         }
//         res.json(dataResult);
//       });
//     });
//   });
// });

SearchLeadRouter.post("/search-leads-count", (req, res) => {
  const user_role = req.session.user[0].urole;
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const pageSize = Math.max(1, parseInt(req.query.pageSize) || 10);
  const offset = (page - 1) * pageSize;
  const limit = pageSize;

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
    lead_priority,
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
  } = req.body.data;

  pool.getConnection((error, connection) => {
    if (error) {
      console.error(error);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    const queryParams = [];
    const whereClauses = [`1 = 1`];
    // const whereClauses = [`lpd.identity != 'imported'`];
    const hasRole = branch_admin || team_leader || sales_manager || tele_caller;
    const getColumn = (field) => {
      if (user_role === "Master" || user_role === "Admin") {
        return hasRole ? `lrd.${field} OR lpd.${field}` : `lpd.${field}`;
      } else {
        return `lrd.${field}`;
      }
    };

    if (user_role !== "Master" && user_role !== "Admin") {
      queryParams.push(req.session.user[0].u_id);
    }

    const addArrayFilter = (field, values) => {
      if (Array.isArray(values) && values.length > 0) {
        const clause = `(${values.map(() => `${field} = ?`).join(" OR ")})`;
        whereClauses.push(clause);
        queryParams.push(...values);
      }
    };

    // Dynamic Filters
    addArrayFilter("lpd.source", source);
    addArrayFilter(getColumn("pname"), pname);
    addArrayFilter(getColumn("ptype"), ptype);
    addArrayFilter(getColumn("service_type"), service_type);
    addArrayFilter(getColumn("pconfiguration"), pconfiguration);
    addArrayFilter(getColumn("pcategory"), pcategory);
    addArrayFilter(getColumn("lead_priority"), lead_priority);
    addArrayFilter(getColumn("city"), city);
    addArrayFilter(getColumn("country"), country);
    addArrayFilter(getColumn("state"), state);
    addArrayFilter(getColumn("locality"), locality);
    addArrayFilter("lpd.status", leadstatus);
    addArrayFilter("lrd.status", userstatus);
    addArrayFilter("lrd.assignto_id", branch_admin);
    addArrayFilter("lrd.assignto_id", sales_manager);
    addArrayFilter("lrd.assignto_id", tele_caller);
    addArrayFilter("lrd.assignto_id", team_leader);

    // Date filters
    if (ldate_from && ldate_to) {
      whereClauses.push("DATE(lpd.create_dt) BETWEEN ? AND ?");
      queryParams.push(ldate_from, ldate_to);
    }

    if (fdate_from && fdate_to) {
      whereClauses.push("DATE(lpd.followup_dt) BETWEEN ? AND ?");
      queryParams.push(fdate_from, fdate_to);
    }

    // Full-text search
    if (anytext) {
      const likeText = `%${anytext}%`;
      whereClauses.push(`
        (
          lpd.lname LIKE ? OR
          lpd.ref_name LIKE ? OR
          lpd.ref_mob LIKE ? OR
          lpd.ref_email LIKE ? OR
          lpd.p_mob LIKE ? OR
          lpd.p_email LIKE ? OR
          lpd.s_mob LIKE ?
        )
      `);
      queryParams.push(likeText, likeText, likeText, likeText, likeText, likeText, likeText);
    }

    let countQuery = ``;

    if (user_role === "Master" || user_role === "Admin") {
      countQuery = `
      SELECT COUNT(*) AS total FROM (
        SELECT lpd.l_id 
        FROM crm_lead_primary_details AS lpd
        LEFT JOIN crm_lead_req_details AS lrd ON lrd.l_id = lpd.l_id
        LEFT JOIN crm_lead_status AS ls ON ls.status = lpd.status
        LEFT JOIN crm_users AS cu ON cu.u_id = lrd.assignto_id
        WHERE ${whereClauses.join(" AND ")}
        GROUP BY lpd.l_id
      ) AS count_table
      `;
    } else {
      countQuery = `
      SELECT COUNT(*) AS total FROM (
        SELECT lrd.lreq_id 
        FROM crm_lead_primary_details AS lpd
        LEFT JOIN crm_lead_req_details AS lrd ON lrd.l_id = lpd.l_id
        LEFT JOIN crm_lead_status AS ls ON ls.status = lpd.status
        LEFT JOIN crm_users AS cu ON cu.u_id = lrd.assignto_id
        WHERE lrd.assignto_id = ? AND ${whereClauses.join(" AND ")}
        GROUP BY lpd.l_id
      ) AS count_table
      `;

    }


    connection.query(countQuery, queryParams, (countErr, countResult) => {
      if (countErr) {
        connection.release();
        console.error(countErr);
        return res.status(500).json({ error: "Error fetching count" });
      }
      res.json(countResult[0]?.total);
    });
  });
});
// SearchLeadRouter.post("/search-leads-count", (req, res) => {
//   const user_role = req.session.user[0].urole;
//   const page = Math.max(1, parseInt(req.query.page) || 1);
//   const pageSize = Math.max(1, parseInt(req.query.pageSize) || 10);
//   const offset = (page - 1) * pageSize;
//   const limit = pageSize;

//   const {
//     source,
//     service_type,
//     pname,
//     ptype,
//     country,
//     state,
//     city,
//     locality,
//     pcategory,
//     pconfiguration,
//     leadstatus,
//     lead_priority,
//     userstatus,
//     branch_admin,
//     team_leader,
//     sales_manager,
//     tele_caller,
//     ldate_from,
//     ldate_to,
//     fdate_from,
//     fdate_to,
//     anytext,
//     pageName,
//   } = req.body.data;

//   pool.getConnection((error, connection) => {
//     if (error) {
//       console.error(error);
//       return res.status(500).json({ error: "Internal Server Error" });
//     }

//     const queryParams = [];
//     const whereClauses = [`1 = 1`];
//     // const whereClauses = [`lpd.identity != 'imported'`];
//     const hasRole = branch_admin || team_leader || sales_manager || tele_caller;
//     const getColumn = (field) => {
//       if (user_role === "Master" || user_role === "Admin") {
//         return hasRole ? `lrd.${field} OR lpd.${field}` : `lpd.${field}`;
//       } else {
//         return `lrd.${field}`;
//       }
//     };

//     if (user_role !== "Master" && user_role !== "Admin") {
//       queryParams.push(req.session.user[0].u_id);
//     }

//     const addArrayFilter = (field, values) => {
//       if (Array.isArray(values) && values.length > 0) {
//         const clause = `(${values.map(() => `${field} = ?`).join(" OR ")})`;
//         whereClauses.push(clause);
//         queryParams.push(...values);
//       }
//     };

//     // Dynamic Filters
//     addArrayFilter("lpd.source", source);
//     addArrayFilter(getColumn("pname"), pname);
//     addArrayFilter(getColumn("ptype"), ptype);
//     addArrayFilter(getColumn("service_type"), service_type);
//     addArrayFilter(getColumn("pconfiguration"), pconfiguration);
//     addArrayFilter(getColumn("pcategory"), pcategory);
//     addArrayFilter(getColumn("lead_priority"), lead_priority);
//     addArrayFilter(getColumn("city"), city);
//     addArrayFilter(getColumn("country"), country);
//     addArrayFilter(getColumn("state"), state);
//     addArrayFilter(getColumn("locality"), locality);
//     addArrayFilter("lpd.status", leadstatus);
//     addArrayFilter("lrd.status", userstatus);
//     addArrayFilter("lrd.assignto_id", branch_admin);
//     addArrayFilter("lrd.assignto_id", sales_manager);
//     addArrayFilter("lrd.assignto_id", tele_caller);
//     addArrayFilter("lrd.assignto_id", team_leader);

//     // Date filters
//     if (ldate_from && ldate_to) {
//       whereClauses.push("DATE(lpd.create_dt) BETWEEN ? AND ?");
//       queryParams.push(ldate_from, ldate_to);
//     }

//     if (fdate_from && fdate_to) {
//       whereClauses.push("DATE(lpd.followup_dt) BETWEEN ? AND ?");
//       queryParams.push(fdate_from, fdate_to);
//     }

//     // Full-text search
//     if (anytext) {
//       const likeText = `%${anytext}%`;
//       whereClauses.push(`
//         (
//           lpd.lname LIKE ? OR
//           lpd.ref_name LIKE ? OR
//           lpd.ref_mob LIKE ? OR
//           lpd.ref_email LIKE ? OR
//           lpd.p_mob LIKE ? OR
//           lpd.p_email LIKE ? OR
//           lpd.s_mob LIKE ?
//         )
//       `);
//       queryParams.push(likeText, likeText, likeText, likeText, likeText, likeText, likeText);
//     }

//     let countQuery = ``;

//     if (user_role === "Master" || user_role === "Admin") {
//       countQuery = `
//       SELECT COUNT(*) AS total FROM (
//         SELECT lpd.l_id 
//         FROM crm_lead_primary_details AS lpd
//         LEFT JOIN crm_lead_req_details AS lrd ON lrd.l_id = lpd.l_id
//         LEFT JOIN crm_lead_status AS ls ON ls.status = lpd.status
//         LEFT JOIN crm_users AS cu ON cu.u_id = lrd.assignto_id
//         WHERE ${whereClauses.join(" AND ")}
//         GROUP BY lpd.l_id
//       ) AS count_table
//       `;
//     } else {
//       countQuery = `
//       SELECT COUNT(*) AS total FROM (
//         SELECT lrd.lreq_id 
//         FROM crm_lead_primary_details AS lpd
//         LEFT JOIN crm_lead_req_details AS lrd ON lrd.l_id = lpd.l_id
//         LEFT JOIN crm_lead_status AS ls ON ls.status = lpd.status
//         LEFT JOIN crm_users AS cu ON cu.u_id = lrd.assignto_id
//         WHERE lrd.assignto_id = ? AND ${whereClauses.join(" AND ")}
//         GROUP BY lpd.l_id
//       ) AS count_table
//       `;

//     }


//     connection.query(countQuery, queryParams, (countErr, countResult) => {
//       if (countErr) {
//         connection.release();
//         console.error(countErr);
//         return res.status(500).json({ error: "Error fetching count" });
//       }
//       res.json(countResult[0]?.total);
//     });
//   });
// });

module.exports = SearchLeadRouter;
