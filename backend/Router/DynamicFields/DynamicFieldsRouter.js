const express = require('express');
const pool = require('../../Database.js');
const dayjs = require('dayjs');
// import express from "express";
// import pool from "../Database.js";

const DynamicFieldsRouter = express.Router();

DynamicFieldsRouter.post('/getSource', (req, res) => {
  pool.getConnection(function (error, connection) {
    if (error) {
      throw error;
    }
    connection.query(
      'SELECT source,src_icon FROM crm_source ORDER BY source_id DESC',
      (err, result) => {
        if (err) {
          console.log(err);
        }
        if (result.length > 0) {
          res.send(result);
        } else {
          res.send('No Data Found');
        }
        connection.release();
      },
    );
  });
});

DynamicFieldsRouter.post("/getLeadPriority", (req, res) => {
  let columns = req.body.columns;

  // Validate columns input to prevent SQL errors
  if (!Array.isArray(columns) || columns.length === 0) {
    columns = ["lead_pid AS id", "create_dt", "update_dt", "lead_priority"];
  }

  pool.getConnection((error, connection) => {
    if (error) {
      console.error("Database connection error:", error);
      return res.status(500).json([]);
    }

    const query = `SELECT ${columns.join(", ")} FROM crm_lead_priority`;

    connection.query(query, (err, result) => {
      connection.release(); // Always release the connection

      if (err) {
        console.error("Error executing query:", err);
        return res.status(500).json([]);
      }

      res.json(result); // Return the array directly
    });
  });
});

DynamicFieldsRouter.post('/getConfiguration', (req, res) => {
  pool.getConnection(function (error, connection) {
    if (error) {
      throw error;
    }
    connection.query(
      'SELECT configuration, configuration_type FROM crm_configuration ORDER BY confi_id DESC',
      (err, result) => {
        if (err) {
          console.log(err);
        }
        if (result.length > 0) {
          res.send(result);
        } else {
          res.send('No Data Found');
        }
        connection.release();
      },
    );
  });
});

DynamicFieldsRouter.post('/getProject', (req, res) => {
  pool.getConnection(function (error, connection) {
    if (error) {
      throw error;
    }
    connection.query(
      'SELECT pname FROM crm_pname ORDER BY prj_id DESC',
      (err, result) => {
        if (err) {
          console.log(err);
        }
        if (result.length > 0) {
          res.send(result);
        } else {
          res.send('No Data Found');
        }
        connection.release();
      },
    );
  });
});

DynamicFieldsRouter.post('/getLocality', (req, res) => {
  pool.getConnection(function (error, connection) {
    if (error) {
      throw error;
    }
    connection.query(
      'SELECT locality FROM crm_locality ORDER BY locality_id DESC',
      (err, result) => {
        if (err) {
          console.log(err);
        }
        if (result.length > 0) {
          res.send(result);
        } else {
          res.send('No Data Found');
        }
        connection.release();
      },
    );
  });
});

DynamicFieldsRouter.post('/getSubLocality', (req, res) => {
  pool.getConnection(function (error, connection) {
    if (error) {
      throw error;
    }
    connection.query(
      'SELECT sublocality FROM crm_sublocality ORDER BY sublocality_id DESC',
      (err, result) => {
        if (err) {
          console.log(err);
        }
        if (result.length > 0) {
          res.send(result);
        } else {
          res.send('No Data Found');
        }
        connection.release();
      },
    );
  });
});

DynamicFieldsRouter.post('/getLeadStatus', (req, res) => {
  pool.getConnection(function (error, connection) {
    if (error) {
      throw error;
    }
    connection.query(
      'SELECT status,color FROM crm_lead_status ORDER BY ls_id DESC',
      (err, result) => {
        if (err) {
          console.log(err);
        }
        if (result.length > 0) {
          res.send(result);
        } else {
          res.send('No Data Found');
        }
        connection.release();
      },
    );
  });
});

DynamicFieldsRouter.post('/getBroker', (req, res) => {
  pool.getConnection(function (error, connection) {
    if (error) {
      throw error;
    }
    connection.query(
      'SELECT name, brk_id, company FROM crm_broker_details ORDER BY brk_id DESC',
      (err, result) => {
        if (err) {
          console.log(err);
        }
        if (result.length > 0) {
          res.send(result);
        } else {
          res.send('No Data Found');
        }
        connection.release();
      },
    );
  });
});

//-------------------------------------------------- Need Form here ------------------------

DynamicFieldsRouter.post('/searchLeads', (req, res) => {
  console.log('Hii');
  const current_date = dayjs().format('YYYY-MM-DD');
  const user_role = req.session.user[0].urole;
  const user_id = req.session.user[0].u_id;
  const limit = req.body.limit;
  const page = req.body.page;
  const source = req.body.source;
  const service_type = req.body.service_type;
  const pname = req.body.pname;
  const ptype = req.body.ptype;
  const pcategory = req.body.pcategory;
  const pconfiguration = req.body.pconfiguration;
  const leadstatus = req.body.leadstatus;
  const userstatus = req.body.userstatus;
  const pageName = '';
  const branch_admin = req.body.branch_admin;
  const team_leader = req.body.team_leader;
  const sales_manager = req.body.sales_manager;
  const tele_caller = req.body.tele_caller;
  const ldate_from = req.body.ldate_from;
  const ldate_to = req.body.ldate_to;
  const fdate_from = req.body.fdate_from;
  const fdate_to = req.body.fdate_to;

  pool.getConnection((error, connection) => {
    if (error) {
      console.error(error);
      res.status(500).json({error: 'Internal Server Error'});
      return;
    }
    let query;
    let queryParams = [];

    if (pageName === 'User Lead') {
      query =
        "SELECT lrd.lreq_id AS l_id, lrd.l_id AS assignlead_id, lrd.create_dt, lpd.lname, lrd.status, lrd.pname, lpd.source, ls.color, lrd.clicked, GROUP_CONCAT(cu.username) AS assign_users, CONCAT(lpd.p_ccode, ' ', lpd.p_mob) AS mobile, lpd.p_ccode,p_mob, lpd.p_email, GROUP_CONCAT(lrd.status,' - ', cu.username) AS users_status, lpd.pname, lrd.followup, lrd.followup_dt, lpd.city, lpd.sub_locality, lrd.comments, lpd.source_type, lpd.service_type, lpd.ptype, lpd.pcategory, lpd.pconfiguration, lpd.min_area, lpd.max_area, lpd.area_unit, lpd.min_price, lpd.max_price, lpd.price_unit, lpd.country, lpd.state, lpd.other_details, lpd.assign_status FROM crm_lead_req_details AS lrd JOIN crm_lead_primary_details AS lpd ON lpd.l_id = lrd.l_id LEFT JOIN crm_lead_status AS ls ON lrd.status = ls.status LEFT JOIN crm_users AS cu ON cu.u_id = lrd.assignto_id WHERE lrd.lreq_id != \"\" ";
    } else {
      if (user_role === 'Master' || user_role === 'Admin') {
        if (
          (branch_admin && branch_admin.length > 0) ||
          (team_leader && team_leader.length > 0) ||
          (sales_manager && sales_manager.length > 0) ||
          (tele_caller && team_leader.length > 0)
        ) {
          query =
            "SELECT lpd.l_id AS l_id, lrd.lreq_id AS assignlead_id, GROUP_CONCAT(cu.username) AS assign_users, lpd.create_dt, lpd.lname, CONCAT(lpd.p_ccode, ' ', lpd.p_mob) AS mobile, lpd.p_ccode, lpd.p_mob, lpd.p_email, lpd.status as admin_status, GROUP_CONCAT(lrd.status,' - ', cu.username) AS users_status,lrd.pname, lrd.followup, lrd.followup_dt, lpd.source, lrd.city, lrd.locality, lrd.sub_locality, lrd.comments, ls.color, lrd.clicked, lpd.source_type, lrd.service_type, lrd.ptype, lrd.pcategory, lrd.pconfiguration, lrd.min_area, lrd.max_area, lrd.area_unit, lrd.min_price, lrd.max_price, lrd.price_unit, lrd.country, lrd.state, lrd.other_details,  lrd.assign_status FROM crm_lead_primary_details AS lpd LEFT JOIN crm_lead_req_details AS lrd ON lrd.l_id = lpd.l_id LEFT JOIN crm_lead_status AS ls ON ls.status = lrd.status LEFT JOIN crm_users AS cu ON cu.u_id = lrd.assignto_id WHERE lpd.l_id != \"\" ";
        } else {
          // Base query
          query =
            "SELECT lpd.l_id AS l_id, lrd.lreq_id AS assignlead_id, GROUP_CONCAT(cu.username) AS assign_users, lpd.create_dt, lpd.lname, CONCAT(lpd.p_ccode, ' ', lpd.p_mob) AS mobile, lpd.p_ccode, lpd.p_mob, lpd.p_email, lpd.status as admin_status, GROUP_CONCAT(lrd.status,' - ', cu.username) AS users_status,lpd.pname, lpd.followup, lpd.followup_dt, lpd.source, lpd.city, lpd.locality, lpd.sub_locality, lpd.comments, ls.color, lpd.clicked, lpd.source_type, lpd.service_type, lpd.ptype, lpd.pcategory, lpd.pconfiguration, lpd.min_area, lpd.max_area, lpd.area_unit, lpd.min_price, lpd.max_price, lpd.price_unit, lpd.country, lpd.state, lpd.other_details,  lpd.assign_status FROM crm_lead_primary_details AS lpd LEFT JOIN crm_lead_req_details AS lrd ON lrd.l_id = lpd.l_id LEFT JOIN crm_lead_status AS ls ON ls.status = lpd.status LEFT JOIN crm_users AS cu ON cu.u_id = lrd.assignto_id WHERE lpd.l_id != \"\" ";
        }
      } else {
        // Base query
        query =
          "SELECT lrd.lreq_id AS l_id, lrd.l_id AS assignlead_id, lpd.create_dt, lpd.lname, lrd.status, lrd.pname, lpd.source, ls.color, lrd.clicked, GROUP_CONCAT(cu.username) AS assign_users, CONCAT(lpd.p_ccode, ' ', lpd.p_mob) AS mobile, lpd.p_ccode,p_mob, lpd.p_email, GROUP_CONCAT(lrd.status,' - ', cu.username) AS users_status, lpd.pname, lrd.followup, lrd.followup_dt, lpd.city, lpd.sub_locality, lrd.comments, lpd.source_type, lpd.service_type, lpd.ptype, lpd.pcategory, lpd.pconfiguration, lpd.min_area, lpd.max_area, lpd.area_unit, lpd.min_price, lpd.max_price, lpd.price_unit, lpd.country, lpd.state, lpd.other_details, lpd.assign_status FROM crm_lead_req_details AS lrd JOIN crm_lead_primary_details AS lpd ON lpd.l_id = lrd.l_id LEFT JOIN crm_lead_status AS ls ON lrd.status = ls.status LEFT JOIN crm_users AS cu ON cu.u_id = lrd.assignto_id WHERE lrd.assignto_id = ? ";
        queryParams.push(user_id);
      }
    }
    if (Array.isArray(source) && source.length > 0) {
      const whereConditions = source.map(param => {
        queryParams.push(`%${param}%`);
        return 'lpd.source LIKE ?';
      });

      query += ` AND (${whereConditions.join(' OR ')})`;
    }

    if (Array.isArray(service_type) && service_type.length > 0) {
      if (
        (branch_admin && branch_admin.length > 0) ||
        (team_leader && team_leader.length > 0) ||
        (sales_manager && sales_manager.length > 0) ||
        (tele_caller && team_leader.length > 0)
      ) {
        const whereConditions = service_type.map(param => {
          queryParams.push(`%${param}%`);
          return 'lrd.service_type LIKE ?';
        });
        query += ` AND (${whereConditions.join(' OR ')})`;
      } else {
        const whereConditions = service_type.map(param => {
          queryParams.push(`%${param}%`);
          return 'lpd.service_type LIKE ?';
        });
        query += ` AND (${whereConditions.join(' OR ')})`;
      }
    }
    if (Array.isArray(pname) && pname.length > 0) {
      if (
        (branch_admin && branch_admin.length > 0) ||
        (team_leader && team_leader.length > 0) ||
        (sales_manager && sales_manager.length > 0) ||
        (tele_caller && team_leader.length > 0)
      ) {
        const whereConditions = pname.map(param => {
          queryParams.push(`%${param}%`);
          return 'lrd.pname LIKE ?';
        });
        query += ` AND (${whereConditions.join(' OR ')})`;
      } else {
        const whereConditions = pname.map(param => {
          queryParams.push(`%${param}%`);
          return 'lpd.pname LIKE ?';
        });
        query += ` AND (${whereConditions.join(' OR ')})`;
      }
    }
    if (Array.isArray(ptype) && ptype.length > 0) {
      if (
        (branch_admin && branch_admin.length > 0) ||
        (team_leader && team_leader.length > 0) ||
        (sales_manager && sales_manager.length > 0) ||
        (tele_caller && team_leader.length > 0)
      ) {
        const whereConditions = ptype.map(param => {
          queryParams.push(`%${param}%`);
          return 'lrd.ptype LIKE ?';
        });
        query += ` AND (${whereConditions.join(' OR ')})`;
      } else {
        const whereConditions = ptype.map(param => {
          queryParams.push(`%${param}%`);
          return 'lpd.ptype LIKE ?';
        });
        query += ` AND (${whereConditions.join(' OR ')})`;
      }
    }

    if (Array.isArray(pcategory) && pcategory.length > 0) {
      if (
        (branch_admin && branch_admin.length > 0) ||
        (team_leader && team_leader.length > 0) ||
        (sales_manager && sales_manager.length > 0) ||
        (tele_caller && team_leader.length > 0)
      ) {
        const whereConditions = pcategory.map(param => {
          queryParams.push(`%${param}%`);
          return 'lrd.pcategory LIKE ?';
        });
        query += ` AND (${whereConditions.join(' OR ')})`;
      } else {
        const whereConditions = pcategory.map(param => {
          queryParams.push(`%${param}%`);
          return 'lpd.pcategory LIKE ?';
        });
        query += ` AND (${whereConditions.join(' OR ')})`;
      }
    }

    if (Array.isArray(pconfiguration) && pconfiguration.length > 0) {
      if (
        (branch_admin && branch_admin.length > 0) ||
        (team_leader && team_leader.length > 0) ||
        (sales_manager && sales_manager.length > 0) ||
        (tele_caller && team_leader.length > 0)
      ) {
        const whereConditions = pconfiguration.map(param => {
          queryParams.push(`%${param}%`);
          return 'lrd.pconfiguration LIKE ?';
        });
        query += ` AND (${whereConditions.join(' OR ')})`;
      } else {
        const whereConditions = pconfiguration.map(param => {
          queryParams.push(`%${param}%`);
          return 'lpd.pconfiguration LIKE ?';
        });
        query += ` AND (${whereConditions.join(' OR ')})`;
      }
    }
    if (Array.isArray(leadstatus) && leadstatus.length > 0) {
      if (
        (branch_admin && branch_admin.length > 0) ||
        (team_leader && team_leader.length > 0) ||
        (sales_manager && sales_manager.length > 0) ||
        (tele_caller && team_leader.length > 0)
      ) {
        const whereConditions = leadstatus.map(param => {
          queryParams.push(param);
          return 'lpd.status = ?';
        });
        query += ` AND (${whereConditions.join(' OR ')})`;
      } else {
        const whereConditions = leadstatus.map(param => {
          queryParams.push(param);
          return 'lpd.status = ?';
        });
        query += ` AND (${whereConditions.join(' OR ')})`;
      }
    }

    if (Array.isArray(userstatus) && userstatus.length > 0) {
      const whereConditions = userstatus.map(param => {
        queryParams.push(param);
        return 'lrd.status = ?';
      });
      query += ` AND (${whereConditions.join(' OR ')})`;
    }
    
    let otherFields = (Array.isArray(service_type) && service_type.length > 0) || (Array.isArray(pname) && pname.length > 0) || (Array.isArray(ptype) && ptype.length > 0) ||
     (Array.isArray(pcategory) && pcategory.length > 0) || (Array.isArray(pconfiguration) && pconfiguration.length > 0) ||(Array.isArray(leadstatus) && leadstatus.length > 0) ||(Array.isArray(userstatus) && userstatus.length > 0);

    if (Array.isArray(branch_admin) && branch_admin.length > 0) {
      const whereConditions = branch_admin.map(param => {
        queryParams.push(`%${param}%`);
        return 'lrd.assignto_id LIKE ?';
      });
      query += ` AND (${whereConditions.join(' OR ')})`;
    }
    if (Array.isArray(team_leader) && team_leader.length > 0) {
      const whereConditions = team_leader.map(param => {
        queryParams.push(`%${param}%`);
        return 'lrd.assignto_id LIKE ?';
      });
      if ((Array.isArray(branch_admin) && branch_admin.length > 0) || otherFields) {
          query += ` OR (${whereConditions.join(' OR ')})`;
      }
      else {
          query += ` AND (${whereConditions.join(' OR ')})`;
      }
    }
    if (Array.isArray(sales_manager) && sales_manager.length > 0) {
      const whereConditions = sales_manager.map(param => {
        queryParams.push(`%${param}%`);
        return 'lrd.assignto_id LIKE ?';
      });
      if ((Array.isArray(branch_admin) && branch_admin.length > 0) || (Array.isArray(team_leader) && team_leader.length > 0) || otherFields) {
          query += ` OR (${whereConditions.join(' OR ')})`;
      }
      else {
          query += ` AND (${whereConditions.join(' OR ')})`;
      }
    }
    if (Array.isArray(tele_caller) && tele_caller.length > 0) {
      const whereConditions = tele_caller.map(param => {
        queryParams.push(`%${param}%`);
        return 'lrd.assignto_id LIKE ?';
      });
      if ((Array.isArray(branch_admin) && branch_admin.length > 0) || (Array.isArray(team_leader) && team_leader.length > 0) || (Array.isArray(sales_manager) && sales_manager.length > 0) || otherFields) {
          query += ` OR (${whereConditions.join(' OR ')})`;
      }
      else {
          query += ` AND (${whereConditions.join(' OR ')})`;
      }
    }
    if (ldate_from !== null && ldate_to !== null) {
      if (
        (branch_admin && branch_admin.length > 0) ||
        (team_leader && team_leader.length > 0) ||
        (sales_manager && sales_manager.length > 0) ||
        (tele_caller && team_leader.length > 0)
      ) {
        query += ' AND DATE(lrd.create_dt) BETWEEN ? AND ?';
        queryParams.push(ldate_from, ldate_to);
      } else {
        query += ' AND DATE(lpd.create_dt) BETWEEN ? AND ? ';
        queryParams.push(ldate_from, ldate_to);
      }
    }

    if (fdate_from !== null && fdate_to !== null) {
      if (
        (branch_admin && branch_admin.length > 0) ||
        (team_leader && team_leader.length > 0) ||
        (sales_manager && sales_manager.length > 0) ||
        (tele_caller && team_leader.length > 0)
      ) {
        query +=
          " AND lrd.followup = 'Yes' AND DATE(lrd.followup_dt) BETWEEN ? AND ?";
        queryParams.push(fdate_from, fdate_to);
      } else {
        query +=
          " AND lpd.followup = 'Yes' AND DATE(lpd.followup_dt) BETWEEN ? AND ?";
        queryParams.push(fdate_from, fdate_to);
      }
    } 
    // else {
    //   ('');
    // }

    if (pageName === 'User Lead') {
      query +=
        'GROUP BY lrd.lreq_id ORDER BY lrd.lreq_id DESC LIMIT ? OFFSET ?';
      queryParams.push(limit, page);
    } else {
      if (user_role === 'Master' || user_role === 'Admin') {
        query += 'GROUP BY lpd.l_id ORDER BY lpd.l_id DESC LIMIT ? OFFSET ?';
        queryParams.push(limit, page);
      } else {
        query +=
          'GROUP BY lrd.lreq_id ORDER BY lrd.lreq_id DESC  LIMIT ? OFFSET ?';
        queryParams.push(limit, page);
      }
    }
    connection.query(query, queryParams, (err, result) => {
      if (err) {
        console.error(err);
        res.status(200).json({data: `Internal Server Error ${user_id} ${err}`});
      } else {
        if (result != -[]) {
          res.json(result);
          console.log(result);
        } else {
          res.json(['No Data Found']);
        }
      }
      connection.release();
    });
  });
});

DynamicFieldsRouter.post('/searchLeads-count', (req, res) => {
  const current_date = dayjs().format('YYYY-MM-DD');
  const user_role = req.session.user[0].urole;
  const user_id = req.session.user[0].u_id;
  const source = req.body.source;
  const service_type = req.body.service_type;
  const pname = req.body.pname;
  const ptype = req.body.ptype;
  const pcategory = req.body.pcategory;
  const pconfiguration = req.body.pconfiguration;
  const leadstatus = req.body.leadstatus;
  const userstatus = req.body.userstatus;
  const pageName = '';
  const branch_admin = req.body.branch_admin;
  const team_leader = req.body.team_leader;
  const sales_manager = req.body.sales_manager;
  const tele_caller = req.body.tele_caller;
  const ldate_from = req.body.ldate_from;
  const ldate_to = req.body.ldate_to;
  const fdate_from = req.body.fdate_from;
  const fdate_to = req.body.fdate_to;

  pool.getConnection((error, connection) => {
    if (error) {
      console.error(error);
      res.status(500).json({error: 'Internal Server Error'});
      return;
    }

    let query;
    let queryParams = [];

    if (user_role === 'Master' || user_role === 'Admin') {
      // Base query
      query =
        "SELECT COUNT(lpd.l_id) AS totalCount FROM crm_lead_primary_details AS lpd LEFT JOIN crm_lead_req_details AS lrd ON lrd.l_id = lpd.l_id LEFT JOIN crm_lead_status AS ls ON ls.status = lpd.status LEFT JOIN crm_users AS cu ON cu.u_id = lrd.assignto_id WHERE lpd.l_id != '' ";
    } else {
      // Base query
      query =
        "SELECT COUNT(lrd.lreq_id) AS totalCount FROM crm_lead_req_details AS lrd JOIN crm_lead_primary_details AS lpd ON lpd.l_id = lrd.l_id LEFT JOIN crm_lead_status AS ls ON lrd.status = ls.status LEFT JOIN crm_users AS cu ON cu.u_id = lrd.assignto_id WHERE lrd.status NOT IN ('Broker', 'Dead', 'Booking Done', 'Wrong Number','Interested', 'NI') AND lrd.assignto_id = ?";
      queryParams.push(user_id);
    }

    if (typeof pageName === 'string' && pageName === 'Non Assign Lead') {
      if (
        (branch_admin && branch_admin.length > 0) ||
        (team_leader && team_leader.length > 0) ||
        (sales_manager && sales_manager.length > 0) ||
        (tele_caller && team_leader.length > 0)
      ) {
        query += ' AND lrd.assign_status = ?';
      } else {
        query += ' AND lpd.assign_status = ?';
      }
      queryParams.push(' ');
    } else if (typeof pageName === 'string' && pageName === 'Assign Lead') {
      if (
        (branch_admin && branch_admin.length > 0) ||
        (team_leader && team_leader.length > 0) ||
        (sales_manager && sales_manager.length > 0) ||
        (tele_caller && team_leader.length > 0)
      ) {
        query += ' AND lrd.assign_status = ?';
        queryParams.push('Yes');
      } else {
        query += ' AND lpd.assign_status = ?';
        queryParams.push('Yes');
      }
    } else if (typeof pageName === 'string' && pageName === 'Present Leads') {
      if (
        (branch_admin && branch_admin.length > 0) ||
        (team_leader && team_leader.length > 0) ||
        (sales_manager && sales_manager.length > 0) ||
        (tele_caller && team_leader.length > 0)
      ) {
        query += ' AND DATE(lrd.followup_dt) = ? AND lrd.followup = ?';
        queryParams.push(current_date, 'Yes');
      } else {
        query += ' AND DATE(lpd.followup_dt) = ? AND lpd.followup = ?';
        queryParams.push(current_date, 'Yes');
      }
    } else if (typeof pageName === 'string' && pageName === 'Missed Leads') {
      if (
        (branch_admin && branch_admin.length > 0) ||
        (team_leader && team_leader.length > 0) ||
        (sales_manager && sales_manager.length > 0) ||
        (tele_caller && team_leader.length > 0)
      ) {
        query += ' AND DATE(lrd.followup_dt) < ? AND lrd.followup = ?';
        queryParams.push(current_date, 'Yes');
      } else {
        query += ' AND DATE(lpd.followup_dt) < ? AND lpd.followup = ?';
        queryParams.push(current_date, 'Yes');
      }
    }

    if (Array.isArray(source) && source.length > 0) {
      const whereConditions = source.map(param => {
        queryParams.push(`%${param}%`);
        return 'lpd.source LIKE ?';
      });

      query += ` AND (${whereConditions.join(' OR ')})`;
    }

    if (Array.isArray(service_type) && service_type.length > 0) {
      if (
        (branch_admin && branch_admin.length > 0) ||
        (team_leader && team_leader.length > 0) ||
        (sales_manager && sales_manager.length > 0) ||
        (tele_caller && team_leader.length > 0)
      ) {
        const whereConditions = service_type.map(param => {
          queryParams.push(`%${param}%`);
          return 'lrd.service_type LIKE ?';
        });
        query += ` AND (${whereConditions.join(' OR ')})`;
      } else {
        const whereConditions = service_type.map(param => {
          queryParams.push(`%${param}%`);
          return 'lpd.service_type LIKE ?';
        });
        query += ` AND (${whereConditions.join(' OR ')})`;
      }
    }
    if (Array.isArray(pname) && pname.length > 0) {
      if (
        (branch_admin && branch_admin.length > 0) ||
        (team_leader && team_leader.length > 0) ||
        (sales_manager && sales_manager.length > 0) ||
        (tele_caller && team_leader.length > 0)
      ) {
        const whereConditions = pname.map(param => {
          queryParams.push(`%${param}%`);
          return 'lrd.pname LIKE ?';
        });
        query += ` AND (${whereConditions.join(' OR ')})`;
      } else {
        const whereConditions = pname.map(param => {
          queryParams.push(`%${param}%`);
          return 'lpd.pname LIKE ?';
        });
        query += ` AND (${whereConditions.join(' OR ')})`;
      }
    }
    if (Array.isArray(ptype) && ptype.length > 0) {
      if (
        (branch_admin && branch_admin.length > 0) ||
        (team_leader && team_leader.length > 0) ||
        (sales_manager && sales_manager.length > 0) ||
        (tele_caller && team_leader.length > 0)
      ) {
        const whereConditions = ptype.map(param => {
          queryParams.push(`%${param}%`);
          return 'lrd.ptype LIKE ?';
        });
        query += ` AND (${whereConditions.join(' OR ')})`;
      } else {
        const whereConditions = ptype.map(param => {
          queryParams.push(`%${param}%`);
          return 'lpd.ptype LIKE ?';
        });
        query += ` AND (${whereConditions.join(' OR ')})`;
      }
    }

    if (Array.isArray(pcategory) && pcategory.length > 0) {
      if (
        (branch_admin && branch_admin.length > 0) ||
        (team_leader && team_leader.length > 0) ||
        (sales_manager && sales_manager.length > 0) ||
        (tele_caller && team_leader.length > 0)
      ) {
        const whereConditions = pcategory.map(param => {
          queryParams.push(`%${param}%`);
          return 'lrd.pcategory LIKE ?';
        });
        query += ` AND (${whereConditions.join(' OR ')})`;
      } else {
        const whereConditions = pcategory.map(param => {
          queryParams.push(`%${param}%`);
          return 'lpd.pcategory LIKE ?';
        });
        query += ` AND (${whereConditions.join(' OR ')})`;
      }
    }

    if (Array.isArray(pconfiguration) && pconfiguration.length > 0) {
      if (
        (branch_admin && branch_admin.length > 0) ||
        (team_leader && team_leader.length > 0) ||
        (sales_manager && sales_manager.length > 0) ||
        (tele_caller && team_leader.length > 0)
      ) {
        const whereConditions = pconfiguration.map(param => {
          queryParams.push(`%${param}%`);
          return 'lrd.pconfiguration LIKE ?';
        });
        query += ` AND (${whereConditions.join(' OR ')})`;
      } else {
        const whereConditions = pconfiguration.map(param => {
          queryParams.push(`%${param}%`);
          return 'lpd.pconfiguration LIKE ?';
        });
        query += ` AND (${whereConditions.join(' OR ')})`;
      }
    }
    if (Array.isArray(leadstatus) && leadstatus.length > 0) {
      if (
        (branch_admin && branch_admin.length > 0) ||
        (team_leader && team_leader.length > 0) ||
        (sales_manager && sales_manager.length > 0) ||
        (tele_caller && team_leader.length > 0)
      ) {
        const whereConditions = leadstatus.map(param => {
          queryParams.push(`%${param}%`);
          return 'lrd.status LIKE ?';
        });
        query += ` AND (${whereConditions.join(' OR ')})`;
      } else {
        const whereConditions = leadstatus.map(param => {
          queryParams.push(`%${param}%`);
          return 'lpd.status LIKE ?';
        });
        query += ` AND (${whereConditions.join(' OR ')})`;
      }
    }

    if (Array.isArray(userstatus) && userstatus.length > 0) {
      const whereConditions = userstatus.map(param => {
        queryParams.push(`%${param}%`);
        return 'lrd.status LIKE ?';
      });
      query += ` AND (${whereConditions.join(' OR ')})`;
    }

    if (Array.isArray(branch_admin) && branch_admin.length > 0) {
      const whereConditions = branch_admin.map(param => {
        queryParams.push(`%${param}%`);
        return 'lrd.assignto_id LIKE ?';
      });
      query += ` AND (${whereConditions.join(' OR ')})`;
    }
    if (Array.isArray(team_leader) && team_leader.length > 0) {
      const whereConditions = team_leader.map(param => {
        queryParams.push(`%${param}%`);
        return 'lrd.assignto_id LIKE ?';
      });
      query += ` AND (${whereConditions.join(' OR ')})`;
    }
    if (Array.isArray(sales_manager) && sales_manager.length > 0) {
      const whereConditions = sales_manager.map(param => {
        queryParams.push(`%${param}%`);
        return 'lrd.assignto_id LIKE ?';
      });
      query += ` AND (${whereConditions.join(' OR ')})`;
    }
    if (Array.isArray(tele_caller) && tele_caller.length > 0) {
      const whereConditions = tele_caller.map(param => {
        queryParams.push(`%${param}%`);
        return 'lrd.assignto_id LIKE ?';
      });
      query += ` AND (${whereConditions.join(' OR ')})`;
    }

    if (ldate_from !== null && ldate_to !== null) {
      if (
        (branch_admin && branch_admin.length > 0) ||
        (team_leader && team_leader.length > 0) ||
        (sales_manager && sales_manager.length > 0) ||
        (tele_caller && team_leader.length > 0)
      ) {
        query += ' AND DATE(lrd.create_dt) BETWEEN ? AND ?';
        queryParams.push(ldate_from, ldate_to);
      } else {
        query += ' AND DATE(lpd.create_dt) BETWEEN ? AND ?';
        queryParams.push(ldate_from, ldate_to);
      }
    }

    if (fdate_from !== null && fdate_to !== null) {
      if (
        (branch_admin && branch_admin.length > 0) ||
        (team_leader && team_leader.length > 0) ||
        (sales_manager && sales_manager.length > 0) ||
        (tele_caller && team_leader.length > 0)
      ) {
        query +=
          " AND lrd.followup = 'Yes' AND DATE(lrd.followup_dt) BETWEEN ? AND ?";
        queryParams.push(fdate_from, fdate_to);
      } else {
        query +=
          " AND lpd.followup = 'Yes' AND DATE(lpd.followup_dt) BETWEEN ? AND ?";
        queryParams.push(fdate_from, fdate_to);
      }
    }

    connection.query(query, queryParams, (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).json({error: 'Internal Server Error'});
      } else {
        res.json(result[0].totalCount);
      }
      connection.release();
    });
  });
});
DynamicFieldsRouter.post('/getUsers', (req, res) => {
  // console.log("HIiii");
  const user_id = req.session.user[0].u_id;
  const user_role = req.session.user[0].urole;
  let column = '';
  let value = '';

  if (user_role === 'Branch Admin') {
    column = 'ba_id';
    value = user_id;
  }
  if (user_role === 'Team Leader') {
    column = 'tl_id';
    value = user_id;
  }
  if (user_role === 'Sales Manager') {
    column = 'sm_id';
    value = user_id;
  }

  if (user_role === 'Master' || user_role === 'Admin') {
    pool.getConnection(function (error, connection) {
      if (error) {
        throw error;
      }
      connection.query(
        'SELECT u_id as id, create_dt, update_dt, username, utype, urole, branch_id, ba_id, tl_id, sm_id, create_by, device_token, session_id, module_privilege FROM crm_users',
        (err, result) => {
          if (err) {
            console.log(err);
          } else {
            res.send(result);
            // console.log(result);
          }
          connection.release();
        },
      );
    });
  } else if (user_role === 'HR Head') {
    pool.getConnection(function (error, connection) {
      if (error) {
        throw error;
      }
      connection.query(
        'SELECT u_id as id, create_dt, update_dt, username, utype, urole, branch_id, ba_id, tl_id, sm_id, create_by, device_token, session_id, module_privilege FROM crm_users WHERE urole = ? ',
        ['HR'],
        (err, result) => {
          if (err) {
            console.log(err);
          } else {
            res.send(result);
          }
          connection.release();
        },
      );
    });
  } else if (user_role === 'HR' || user_role === 'Tele Caller') {
    res.send([]);
  } else {
    pool.getConnection(function (error, connection) {
      if (error) {
        throw error;
      }
      connection.query(
        'SELECT u_id as id, create_dt, update_dt, username, utype, urole, branch_id, ba_id, tl_id, sm_id, create_by, device_token, session_id, module_privilege FROM crm_users WHERE ?? = ? ',
        [column, value],
        (err, result) => {
          if (err) {
            console.log(err);
          } else {
            res.send(result);
            // console.log(result);
          }
          connection.release();
        },
      );
    });
  }
});

// export default DynamicFieldsRouter;
module.exports = DynamicFieldsRouter;
