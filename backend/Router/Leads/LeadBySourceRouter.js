// for ES5
const express = require("express");
const pool = require("../../Database.js");

const LeadBySourceRouter = express.Router();

const sanitizeQueryParams = (page, pageSize) => {
  const parsedPage = parseInt(page, 10);
  const parsedPageSize = parseInt(pageSize, 10);
  if (
    isNaN(parsedPage) ||
    isNaN(parsedPageSize) ||
    parsedPage < 1 ||
    parsedPageSize < 1
  ) {
    throw new Error("Invalid page or pageSize");
  }
  return { offset: (parsedPage - 1) * parsedPageSize, limit: parsedPageSize };
};

// Base query builder for different roles
function buildQuery(user_role, user_id) {
  // Determine the join type based on user role
  const joinType =
    user_role === "Master" || user_role === "Admin" ? "LEFT" : "INNER";

  let query = `
    SELECT `;

  if (user_role === "Master" || user_role === "Admin") {
    query += ` lpd.l_id AS l_id,
      lrd.lreq_id AS assignlead_id, `;
  } else {
    query += ` lrd.lreq_id AS l_id, lrd.l_id AS assignlead_id, `;
  }

  if (user_role === "Team Leader") {
    query += ` 
      GROUP_CONCAT(DISTINCT cu.username ORDER BY cu.username) AS assign_users,
      CONCAT(
        IFNULL((
          SELECT GROUP_CONCAT(lrd2.comments SEPARATOR '~') 
          FROM crm_lead_req_details lrd2 
          WHERE lrd2.l_id = lpd.l_id 
          AND (lrd2.assignto_id = ? OR lrd2.assignby_id = ?)
        ), '~'), 
        '~', 
        IFNULL(lpd.comments, '~')
      ) AS comments,`;
  }

  // Add the columns for the latest status and username
  query += ` 
      GROUP_CONCAT(DISTINCT cu.username ORDER BY cu.username) AS assign_users,
      CONCAT(IFNULL(GROUP_CONCAT(lrd.comments SEPARATOR '~'), '~'), '~', IFNULL(lpd.comments, '~')) AS comments,
      lpd.create_dt, lpd.brk_id, lpd.ref_name, lpd.ref_ccode, lpd.ref_mob, lpd.ref_email,
      lpd.identity, lpd.lname, CONCAT(lpd.p_ccode, ' ', lpd.p_mob) AS mobile,
      lpd.p_ccode, lpd.p_mob, lpd.s_ccode, lpd.s_mob, lpd.form_name, lpd.p_email,
      lpd.status AS admin_status, lpd.lead_priority,
      GROUP_CONCAT(CONCAT(lrd.status, ' - ', cu.username) ORDER BY lrd.status) AS users_status,
      lpd.pname, lpd.followup, lpd.followup_dt, lpd.source, lpd.city, lpd.locality,
      lpd.sub_locality, ls.color, lpd.clicked, lpd.source_type, lpd.service_type,
      lpd.ptype, lpd.pcategory, lpd.pconfiguration, lpd.min_area, lpd.max_area,
      lpd.area_unit, lpd.min_price, lpd.max_price, lpd.price_unit, lpd.country,
      lpd.state, lpd.buyer_type, lpd.investment_type, lpd.post_handover,
      lpd.other_details, lpd.document, lpd.assign_status,
      clh_latest.status AS latest_status,
      cu_latest.username AS latest_username,
      ls_latest.color AS latest_status_color
    FROM crm_lead_primary_details AS lpd
    ${joinType} JOIN crm_lead_req_details AS lrd ON lrd.l_id = lpd.l_id
    LEFT JOIN crm_lead_status AS ls ON ls.status = lpd.status
    LEFT JOIN crm_users AS cu ON cu.u_id = lrd.assignto_id
    LEFT JOIN (
      SELECT clh.l_id, clh.status, clh.u_id
      FROM crm_lead_history AS clh
      INNER JOIN (
        SELECT l_id, MAX(update_dt) AS max_update_dt
        FROM crm_lead_history
        GROUP BY l_id
      ) AS clh_max ON clh.l_id = clh_max.l_id AND clh.update_dt = clh_max.max_update_dt
    ) AS clh_latest ON clh_latest.l_id = lpd.l_id
    LEFT JOIN crm_users AS cu_latest ON cu_latest.u_id = clh_latest.u_id
    LEFT JOIN crm_lead_status AS ls_latest ON ls_latest.status = clh_latest.status
  `;

  let conditions = ` WHERE COALESCE(lpd.identity, '') != 'imported' `;
  let params = [];

  if (
    user_role === "Team Leader" ||
    user_role === "Sales Manager" ||
    user_role === "User" ||
    user_role === "Tele Caller"
  ) {
    query = query.replace("ls.status = lpd.status", "ls.status = lrd.status");
    conditions += ` AND lrd.assignto_id = ? `;
    params.push(user_id);

    if (user_role === "Team Leader") {
      // query = query.replace(
      //   "CONCAT(IFNULL(GROUP_CONCAT(lrd.comments SEPARATOR '~'), '~'), '~', IFNULL(lpd.comments, '~')) AS comments",
      //   `CONCAT(IFNULL(GROUP_CONCAT(lrd2.comments SEPARATOR '~') FROM crm_lead_req_details lrd2 WHERE lrd2.l_id = lpd.l_id AND (lrd2.assignto_id = ? OR lrd2.assignby_id = ?), '~'), '~', IFNULL(lpd.comments, '~')) AS comments`
      // );
      params.push(user_id, user_id);
      conditions += ` OR (clh_latest.u_id = ? OR clh_latest.u_id IN (SELECT assignto_id FROM crm_lead_req_details WHERE assignby_id = ? AND l_id = lpd.l_id) OR clh_latest.u_id IN (SELECT u_id FROM crm_users WHERE utype = 'Admin'))`;
      params.push(user_id, user_id);
    } else if (user_role === "Sales Manager") {
      conditions += ` OR (clh_latest.u_id = ? OR clh_latest.u_id IN (SELECT u_id FROM crm_users WHERE sm_id = ?) OR clh_latest.u_id IN (SELECT u_id FROM crm_users WHERE utype = 'Admin') OR clh_latest.u_id IN (SELECT tl_id FROM crm_users WHERE u_id = ? AND tl_id != 0))`;
      params.push(user_id, user_id, user_id);
    } else {
      // For User and Tele Caller roles
      conditions += ` AND (clh_latest.u_id = ? OR clh_latest.u_id IN (SELECT u_id FROM crm_users WHERE utype = 'Admin') OR clh_latest.u_id IN (SELECT tl_id FROM crm_users WHERE u_id = ? AND tl_id != 0) OR clh_latest.u_id IN (SELECT sm_id FROM crm_users WHERE u_id = ? AND sm_id != 0))`;
      params.push(user_id, user_id, user_id);
    }
  }

  if (user_role === "Master" || user_role === "Admin") {
    query += ` AND lpd.source = ? `;
  } else {
    query += ` AND lrd.source = ? `;
  }

  query +=
    conditions +
    ` GROUP BY lpd.l_id ORDER BY lpd.clicked ASC, lpd.l_id DESC LIMIT ? OFFSET ?`;
  return { source, query, params };
}

LeadBySourceRouter.get("/get-lead-by-source-table-data", (req, res) => {
  pool.getConnection((error, connection) => {
    if (error) {
      console.error("Connection Error:", error.message);
      return res.status(500).json({ error: "Database Connection Failed" });
    }

    try {
      // Validate session
      if (!req.session.user || !req.session.user[0]) {
        connection.release();
        return res
          .status(401)
          .json({ error: "Unauthorized: No user session found" });
      }

      const user_role = req.session.user[0].urole;
      const user_id = req.session.user[0].u_id;
      const { page, pageSize, source } = req.query;

      // Sanitize query params
      const { offset, limit } = sanitizeQueryParams(page, pageSize);

      // Build query based on role
      const { query, params } = buildQuery(user_role, user_id);
      params.push(source, limit, offset);

      // Execute query
      connection.query(query, params, (err, result) => {
        connection.release();
        if (err) {
          console.error("Query Error:", {
            message: err.message,
            stack: err.stack,
          });
          return res.status(500).json({ error: "Query Execution Failed" });
        }
        res.json(result);
      });
    } catch (err) {
      connection.release();
      console.error("Error in get-total-lead-table-data:", {
        message: err.message,
        stack: err.stack,
      });
      res.status(500).json({ error: "Internal Server Error" });
    }
  });
});

// for ES5
module.exports = LeadBySourceRouter;
