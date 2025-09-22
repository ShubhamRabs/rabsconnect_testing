// for ES5
const express = require("express");
const pool = require("../../Database.js");
const dayjs = require('dayjs');

const UserLeadRouter = express.Router();

UserLeadRouter.get("/get-user-lead-table-data", (req, res) => {
  const user_role = req.session.user[0].urole;
  const user_id = req.session.user[0].u_id;
  const { page, pageSize } = req.query;
  const offset = (page - 1) * pageSize;
  const limit = parseInt(pageSize);

  if (user_role === "Master" || user_role === "Admin") {
    pool.getConnection(function (error, connection) {
      if (error) throw error;
      connection.query(
        "SELECT lrd.lreq_id AS l_id, lrd.l_id AS assignlead_id, lrd.create_dt, lpd.lname, lrd.status, lrd.pname, lpd.source, ls.color, lrd.clicked, GROUP_CONCAT(cu.username) AS assign_users, CONCAT(lpd.p_ccode, ' ', lpd.p_mob) AS mobile, lpd.p_ccode,p_mob, lpd.p_email, GROUP_CONCAT(lrd.status,' - ', cu.username) AS users_status, lpd.pname, lrd.followup, lrd.followup_dt, lpd.city, lpd.sub_locality, lrd.comments, lpd.source_type, lpd.service_type, lpd.ptype, lpd.pcategory, lpd.pconfiguration, lpd.min_area, lpd.max_area, lpd.area_unit, lpd.min_price, lpd.max_price, lpd.price_unit, lpd.country, lpd.state,lpd.buyer_type,lpd.investment_type,lpd.post_handover ,lpd.other_details, lpd.assign_status FROM crm_lead_req_details AS lrd JOIN crm_lead_primary_details AS lpd ON lpd.l_id = lrd.l_id LEFT JOIN crm_lead_status AS ls ON lrd.status = ls.status LEFT JOIN crm_users AS cu ON cu.u_id = lrd.assignto_id GROUP BY lrd.lreq_id ORDER BY lrd.lreq_id DESC LIMIT ? OFFSET ?",
        [limit, offset],
        (err, result) => {
          if (err) {
            console.log("error");
          } else {
            res.json(result);
          }
          connection.release();
        }
      );
    });
  }
});

UserLeadRouter.post("/get-user-lead-table-data-count", (req, res) => {
  const user_role = req.session.user[0].urole;
  const user_id = req.session.user[0].u_id;
  if (user_role === "Master" || user_role === "Admin") {
    pool.getConnection(function (error, connection) {
      if (error) throw error;
      connection.query(
        "SELECT COUNT(lp.l_id) AS totalCount FROM crm_lead_req_details AS lrd JOIN crm_lead_primary_details AS lp ON lp.l_id = lrd.l_id",
        (err, result) => {
          if (err) {
            console.log("error");
          } else {
            res.json(result[0].totalCount);
          }
          connection.release();
        }
      );
    });
  }
});

//app
UserLeadRouter.post("/get-user-undefined-leads", async (req, res) => {
  const user_id = req.session.user[0].u_id;
  const limit = req.body.limit;
  const page = req.body.page;
  const user_role = req.session.user[0].urole;

  if (user_role === "Master" || user_role === "Admin") {
    pool.getConnection(function (error, connection) {
      if (error) {
        throw error;
      }
      connection.query(
        "SELECT crm_lead_req_details.lreq_id AS l_id, crm_lead_req_details.l_id AS assignlead_id, crm_users.username AS assign_users, crm_lead_primary_details.create_dt, crm_lead_primary_details.lname, crm_lead_primary_details.p_ccode, crm_lead_primary_details.p_mob, crm_lead_primary_details.p_email, crm_lead_req_details.status, crm_lead_req_details.pname, crm_lead_req_details.followup, crm_lead_req_details.followup_dt, crm_lead_primary_details.source, crm_lead_req_details.city, crm_lead_req_details.locality, crm_lead_req_details.sub_locality, crm_lead_status.color, crm_lead_req_details.clicked FROM crm_lead_primary_details JOIN crm_lead_req_details ON crm_lead_primary_details.l_id = crm_lead_req_details.l_id LEFT JOIN crm_lead_status ON crm_lead_req_details.status = crm_lead_status.status LEFT JOIN crm_users ON crm_users.u_id = crm_lead_req_details.assignto_id WHERE ?? = ? AND ?? = ? ORDER BY crm_lead_req_details.lreq_id DESC LIMIT ? OFFSET ?",
        [
          "crm_lead_req_details.status",
          "",
          "crm_lead_req_details.clicked",
          1,
          limit,
          page,
        ],
        (err, result) => {
          if (err) {
            console.log(err);
          }
          if (result.length > 0) {
            res.send(result);
            //
          } else {
            res.send("No Data Found");
          }
          connection.release();
        }
      );
    });
  } else {
    res.send("Access Denied");
  }
});

UserLeadRouter.post("/get-user-undefined-count", async (req, res) => {
  const today = new Date();
  const user_role = req.session.user[0].urole;

  if (user_role === "Master" || user_role === "Admin") {
    pool.getConnection(function (error, connection) {
      if (error) {
        throw error;
      }
      connection.query(
        "SELECT COUNT(l_id) AS statuslead_count FROM crm_lead_req_details WHERE status = ? AND clicked = ?",
        ["", 1],
        (err, result) => {
          if (err) {
            console.log(err);
          }
          if (result.length > 0) {
            res.send(result);
          }
          connection.release();
        }
      );
    });
  } else {
    res.send("Access Denied");
  }
});

UserLeadRouter.post("/get-user-new-leads", (req, res) => {
  const limit = req.body.limit;
  const page = req.body.page;
  const user_role = req.session.user[0].urole;

  if (user_role === "Master" || user_role === "Admin") {
    pool.getConnection(function (error, connection) {
      if (error) {
        throw error;
      }
      connection.query(
        "SELECT crm_lead_req_details.lreq_id AS l_id, crm_lead_req_details.l_id AS assignlead_id, crm_users.username AS assign_users, crm_lead_primary_details.create_dt, crm_lead_primary_details.lname, crm_lead_primary_details.p_ccode, crm_lead_primary_details.p_mob, crm_lead_primary_details.p_email, crm_lead_req_details.status, crm_lead_req_details.pname, crm_lead_req_details.followup, crm_lead_req_details.followup_dt, crm_lead_primary_details.source, crm_lead_req_details.city, crm_lead_req_details.locality, crm_lead_req_details.sub_locality,crm_lead_req_details.buyer_type,crm_lead_req_details.investment_type ,crm_lead_req_details.post_handover , ,crm_lead_status.color, crm_lead_req_details.clicked FROM crm_lead_primary_details JOIN crm_lead_req_details ON crm_lead_primary_details.l_id = crm_lead_req_details.l_id LEFT JOIN crm_lead_status ON crm_lead_req_details.status = crm_lead_status.status LEFT JOIN crm_users ON crm_users.u_id = crm_lead_req_details.assignto_id WHERE ?? = ? OR ?? = ? ORDER BY crm_lead_req_details.lreq_id DESC LIMIT ? OFFSET ?",
        [
          "crm_lead_req_details.status",
          "New Lead",
          "crm_lead_req_details.clicked",
          0,
          limit,
          page,
        ],
        (err, result) => {
          if (err) {
            console.log(err);
          }
          if (result.length > 0) {
            res.send(result);
          } else {
            res.send("No Data Found");
          }
          connection.release();
        }
      );
    });
  } else {
    res.send("Access Denied");
  }
});

UserLeadRouter.post("/get-user-new-lead-count", async (req, res) => {
  const today = new Date();
  const user_role = req.session.user[0].urole;

  if (user_role === "Master" || user_role === "Admin") {
    pool.getConnection(function (error, connection) {
      if (error) {
        throw error;
      }
      connection.query(
        "SELECT COUNT(l_id) AS newlead_count FROM crm_lead_req_details WHERE status = ? OR clicked = ?",
        ["New Lead", 0],
        (err, result) => {
          if (err) {
            console.log(err);
          }
          if (result.length > 0) {
            res.send(result);
          }
          connection.release();
        }
      );
    });
  } else {
    res.send("Access Denied");
  }
});

UserLeadRouter.post("/get-user-missed-leads", (req, res) => {
  const current_date = dayjs().format("YYYY-MM-DD");
  const user_id = req.session.user[0].u_id;
  const limit = req.body.limit;
  const page = req.body.page;
  const user_role = req.session.user[0].urole;

  if (user_role === "Master" || user_role === "Admin") {
    pool.getConnection(function (error, connection) {
      if (error) {
        throw error;
      }
      connection.query(
        'SELECT crm_lead_req_details.lreq_id AS l_id, crm_lead_req_details.l_id AS assignlead_id, crm_users.username AS assign_users, crm_lead_primary_details.create_dt, crm_lead_primary_details.lname, crm_lead_primary_details.pname, CONCAT(crm_lead_primary_details.p_ccode, " ",crm_lead_primary_details.p_mob) AS mobile, crm_lead_primary_details.p_ccode, crm_lead_primary_details.p_mob, crm_lead_primary_details.p_email, crm_lead_primary_details.source, crm_lead_req_details.followup, crm_lead_req_details.followup_dt, crm_lead_req_details.city, crm_lead_req_details.locality, crm_lead_req_details.sub_locality, crm_lead_status.color, crm_lead_req_details.status FROM crm_lead_primary_details JOIN crm_lead_req_details ON crm_lead_primary_details.l_id = crm_lead_req_details.l_id LEFT JOIN crm_lead_status ON crm_lead_req_details.status = crm_lead_status.status LEFT JOIN crm_users ON crm_lead_req_details.assignto_id = crm_users.u_id WHERE DATE(crm_lead_req_details.followup_dt) < ? AND crm_lead_req_details.followup = ? AND crm_lead_req_details.status != "Broker" AND crm_lead_req_details.status != "Dead" AND crm_lead_req_details.status != "Booking Done" AND crm_lead_req_details.status != "Wrong Number" AND crm_lead_req_details.status != "Not Interested" AND crm_lead_req_details.status != "NI" ORDER BY crm_lead_req_details.lreq_id DESC LIMIT ? OFFSET ?',
        [current_date, "Yes", limit, page],
        (err, result) => {
          if (err) {
            console.log(err);
          }
          if (result.length > 0) {
            res.send(result);
          } else {
            res.send("No Data Found");
          }
          connection.release();
        }
      );
    });
  } else {
    res.send("Access Denied");
  }
});

UserLeadRouter.post("/get-user-missed-lead-count", (req, res) => {
  const current_date = dayjs().format("YYYY-MM-DD");
  const user_id = req.session.user[0].u_id;
  const user_role = req.session.user[0].urole;

  if (user_role === "Master" || user_role === "Admin") {
    pool.getConnection(function (error, connection) {
      if (error) {
        throw error;
      }
      connection.query(
        'SELECT COUNT(crm_lead_req_details.lreq_id) AS leadcount FROM crm_lead_req_details WHERE DATE(crm_lead_req_details.followup_dt) < ? AND crm_lead_req_details.followup = ? AND crm_lead_req_details.status != "Broker" AND crm_lead_req_details.status != "Dead" AND crm_lead_req_details.status != "Booking Done" AND crm_lead_req_details.status != "Wrong Number" AND crm_lead_req_details.status != "Not Interested" AND crm_lead_req_details.status != "NI" ORDER BY crm_lead_req_details.l_id DESC',
        [current_date, "Yes"],
        (err, result) => {
          if (err) {
            console.log(err);
          }
          if (result.length > 0) {
            res.send(result);
          } else {
            res.send("No Data Found");
          }
          connection.release();
        }
      );
    });
  } else {
    pool.getConnection(function (error, connection) {
      if (error) {
        throw error;
      }
      connection.query(
        'SELECT COUNT(crm_lead_req_details.lreq_id) AS leadcount FROM crm_lead_req_details WHERE DATE(crm_lead_req_details.followup_dt) < ? AND crm_lead_req_details.followup = ? AND crm_lead_req_details.status != "Broker" AND crm_lead_req_details.status != "Dead" AND crm_lead_req_details.status != "Booking Done" AND crm_lead_req_details.status != "Wrong Number" AND crm_lead_req_details.status != "Not Interested" AND crm_lead_req_details.status != "NI" AND crm_lead_req_details.assignto_id = ? ORDER BY crm_lead_req_details.l_id DESC',
        [current_date, "Yes",user_id],
        (err, result) => {
          if (err) {
            console.log(err);
          }
          if (result.length > 0) {
            res.send(result);
          } else {
            res.send("No Data Found");
          }
          connection.release();
        }
      );
    });
  }
});

UserLeadRouter.post("/get-user-upcoming-leads", (req, res) => {
  const current_date = dayjs().format("YYYY-MM-DD");
  const user_id = req.session.user[0].u_id;
  const limit = req.body.limit;
  const page = req.body.page;
  const user_role = req.session.user[0].urole;

  if (user_role === "Master" || user_role === "Admin") {
    pool.getConnection(function (error, connection) {
      if (error) {
        throw error;
      }
      connection.query(
        'SELECT crm_lead_req_details.lreq_id AS l_id, crm_lead_req_details.l_id AS assignlead_id, crm_users.username AS assign_users, crm_lead_primary_details.create_dt, crm_lead_primary_details.lname, crm_lead_primary_details.pname, CONCAT(crm_lead_primary_details.p_ccode, " ",crm_lead_primary_details.p_mob) AS mobile, crm_lead_primary_details.p_ccode, crm_lead_primary_details.p_mob, crm_lead_primary_details.p_email, crm_lead_primary_details.source, crm_lead_req_details.followup, crm_lead_req_details.followup_dt, crm_lead_req_details.city, crm_lead_req_details.locality, crm_lead_req_details.sub_locality, crm_lead_status.color, crm_lead_req_details.status FROM crm_lead_primary_details JOIN crm_lead_req_details ON crm_lead_primary_details.l_id = crm_lead_req_details.l_id LEFT JOIN crm_lead_status ON crm_lead_req_details.status = crm_lead_status.status LEFT JOIN crm_users ON crm_lead_req_details.assignto_id = crm_users.u_id WHERE DATE(crm_lead_req_details.followup_dt) > ? AND crm_lead_req_details.followup = ? AND crm_lead_req_details.status != "Broker" AND crm_lead_req_details.status != "Dead" AND crm_lead_req_details.status != "Booking Done" AND crm_lead_req_details.status != "Wrong Number" AND crm_lead_req_details.status != "Not Interested" AND crm_lead_req_details.status != "NI" GROUP BY crm_lead_req_details.l_id ORDER BY crm_lead_req_details.lreq_id DESC LIMIT ? OFFSET ?',
        [current_date, "Yes", limit, page],
        (err, result) => {
          if (err) {
            console.log(err);
          }
          if (result.length > 0) {
            res.send(result);
            //
          } else {
            res.send("No Data Found");
          }
          connection.release();
        }
      );
    });
  } else {
    res.send("Access Denied");
  }
});

UserLeadRouter.post("/get-user-upcoming-lead-count", (req, res) => {
  const current_date = dayjs().format("YYYY-MM-DD");
  const user_id = req.session.user[0].u_id;
  const user_role = req.session.user[0].urole;
  console.log(current_date);

  if (user_role === "Master" || user_role === "Admin") {
    pool.getConnection(function (error, connection) {
      if (error) {
        throw error;
      }
      connection.query(
        'SELECT COUNT(crm_lead_req_details.lreq_id) AS leadcount FROM crm_lead_req_details WHERE DATE(crm_lead_req_details.followup_dt) > ? AND crm_lead_req_details.followup = ? AND crm_lead_req_details.status != "Broker" AND crm_lead_req_details.status != "Dead" AND crm_lead_req_details.status != "Booking Done" AND crm_lead_req_details.status != "Wrong Number" AND crm_lead_req_details.status != "Not Interested" AND crm_lead_req_details.status != "NI" ORDER BY crm_lead_req_details.l_id DESC',
        [current_date, "Yes"],
        (err, result) => {
          if (err) {
            console.log(err);
          }
          if (result.length > 0) {
            res.send(result);
          } else {
            res.send("No Data Found");
          }
          connection.release();
        }
      );
    });
  } else {
    pool.getConnection(function (error, connection) {
      if (error) {
        throw error;
      }
      connection.query(
        'SELECT COUNT(crm_lead_req_details.lreq_id) AS leadcount FROM crm_lead_req_details WHERE DATE(crm_lead_req_details.followup_dt) > ? AND crm_lead_req_details.followup = ? AND crm_lead_req_details.status != "Broker" AND crm_lead_req_details.status != "Dead" AND crm_lead_req_details.status != "Booking Done" AND crm_lead_req_details.status != "Wrong Number" AND crm_lead_req_details.status != "Not Interested" AND crm_lead_req_details.status != "NI" AND crm_lead_req_details.assignto_id = ? ORDER BY crm_lead_req_details.l_id DESC',
        [current_date, "Yes",user_id],
        (err, result) => {
          if (err) {
            console.log(err);
          }
          if (result.length > 0) {
            res.send(result);
          } else {
            res.send("No Data Found");
          }
          connection.release();
        }
      );
    });
  }
});

UserLeadRouter.get("/get-user-today-leads", (req, res) => {
  const current_date = dayjs().format("YYYY-MM-DD");
  const user_role = req.session.user[0].urole;
  const user_id = req.session.user[0].u_id;
  const { page, pageSize } = req.query;
  const offset = (page - 1) * pageSize;
  const limit = parseInt(pageSize);

  if (user_role === "Master" || user_role === "Admin") {
    pool.getConnection(function (error, connection) {
      if (error) {
        throw error;
      }
      connection.query(
        'SELECT crm_lead_req_details.lreq_id AS l_id, crm_lead_req_details.l_id AS assignlead_id, crm_users.username AS assign_users, crm_lead_primary_details.create_dt, crm_lead_primary_details.lname, crm_lead_primary_details.pname, crm_lead_primary_details.p_ccode, crm_lead_primary_details.p_mob, crm_lead_primary_details.p_email, crm_lead_primary_details.source, crm_lead_req_details.followup, crm_lead_req_details.followup_dt, crm_lead_req_details.city, crm_lead_req_details.locality, crm_lead_req_details.sub_locality, crm_lead_status.color, crm_lead_req_details.status FROM crm_lead_primary_details JOIN crm_lead_req_details ON crm_lead_primary_details.l_id = crm_lead_req_details.l_id LEFT JOIN crm_lead_status ON crm_lead_req_details.status = crm_lead_status.status LEFT JOIN crm_users ON crm_lead_req_details.assignto_id = crm_users.u_id WHERE (DATE(crm_lead_req_details.followup_dt) = ? AND crm_lead_req_details.followup = ?) AND crm_lead_req_details.status != "Broker" AND crm_lead_req_details.status != "Dead" AND crm_lead_req_details.status != "Booking Done" AND crm_lead_req_details.status != "Wrong Number" AND crm_lead_req_details.status != "Not Interested" AND crm_lead_req_details.status != "NI" GROUP BY crm_lead_req_details.l_id ORDER BY crm_lead_req_details.lreq_id DESC LIMIT ? OFFSET ?',
        [current_date, "Yes", limit, offset],
        (err, result) => {
          if (err) {
            console.log(err);
          }
          if (result.length > 0) {
            res.send(result);
          } else {
            res.send("No Data Found");
          }
          connection.release();
        }
      );
    });
  } else {
    res.send("Access Denied");
  }
});

UserLeadRouter.post("/get-user-today-leads-count", (req, res) => {
  const current_date = dayjs().format("YYYY-MM-DD");
  const user_id = req.session.user[0].u_id;
  const user_role = req.session.user[0].urole;

  if (user_role === "Master" || user_role === "Admin") {
    pool.getConnection(function (error, connection) {
      if (error) {
        throw error;
      }
      connection.query(
        'SELECT COUNT(l_id) AS leadcount FROM crm_lead_req_details WHERE DATE(followup_dt) = ? AND followup = ? AND crm_lead_req_details.status != "Broker" AND crm_lead_req_details.status != "Dead" AND crm_lead_req_details.status != "Booking Done" AND crm_lead_req_details.status != "Wrong Number" AND crm_lead_req_details.status != "Not Interested" AND crm_lead_req_details.status != "NI"',
        [current_date, "Yes"],
        (err, result) => {
          if (err) {
            console.log(err);
          }
          if (result.length > 0) {
            res.send(result);
          } else {
            res.send("No Data Found");
          }
          connection.release();
        }
      );
    });
  } else {
    res.send("Access Denied");
  }
});

UserLeadRouter.post("/user-lead-detail", (req, res) => {
  //const user_id = req.session.user[0].u_id;
  const lead_id = req.body.lead_id;
  pool.getConnection(function (error, connection) {
    if (error) {
      throw error;
    }
    connection.query(
      "SELECT crm_lead_req_details.lreq_id AS l_id, crm_lead_primary_details.source_type, crm_lead_primary_details.create_dt, crm_lead_primary_details.lname,crm_lead_primary_details.source, crm_lead_primary_details.p_ccode, crm_lead_primary_details.p_mob, crm_lead_primary_details.p_email,crm_lead_primary_details.ref_name, crm_lead_primary_details.ref_ccode, crm_lead_primary_details.ref_mob, crm_lead_primary_details.ref_email, crm_lead_req_details.s_ccode, crm_lead_req_details.s_mob, crm_lead_req_details.s_email, crm_lead_req_details.pname, crm_lead_req_details.service_type, crm_lead_req_details.ptype, crm_lead_req_details.pcategory, crm_lead_req_details.pconfiguration, crm_lead_req_details.min_area, crm_lead_req_details.max_area, crm_lead_req_details.area_unit, crm_lead_req_details.min_price, crm_lead_req_details.max_price, crm_lead_req_details.price_unit, crm_lead_req_details.state, crm_lead_req_details.country, crm_lead_req_details.city, crm_lead_req_details.locality, crm_lead_req_details.sub_locality, crm_lead_req_details.status, crm_lead_req_details.other_details, crm_lead_req_details.quality, crm_lead_req_details.followup, crm_lead_req_details.followup_dt, crm_lead_req_details.comments, crm_lead_status.color FROM crm_lead_primary_details JOIN crm_lead_req_details ON crm_lead_primary_details.l_id = crm_lead_req_details.l_id LEFT JOIN crm_lead_status ON crm_lead_req_details.status = crm_lead_status.status WHERE ?? = ?",
      ["crm_lead_req_details.lreq_id", lead_id],
      (err, result) => {
        if (err) {
          console.log(err);
        }
        if (result.length > 0) {
          res.send(result);
        } else {
          res.send("No Data Found");
        }
        connection.release();
      }
    );
  });
});

UserLeadRouter.post("/get-user-status-wise-Leads", (req, res) => {
  const user_id = req.session.user[0].u_id;
  const status = req.body.status;
  const limit = req.body.limit;
  const page = req.body.page;
  const user_role = req.session.user[0].urole;

  if (user_role === "Master" || user_role === "Admin") {
    pool.getConnection(function (error, connection) {
      if (error) {
        throw error;
      }
      connection.query(
        "SELECT crm_lead_req_details.lreq_id AS l_id, crm_lead_req_details.l_id AS assignlead_id, crm_users.username AS assign_users, crm_lead_primary_details.create_dt, crm_lead_primary_details.lname, crm_lead_primary_details.p_ccode, crm_lead_primary_details.p_mob, crm_lead_primary_details.p_email, crm_lead_req_details.status, crm_lead_req_details.pname, crm_lead_req_details.followup, crm_lead_req_details.followup_dt, crm_lead_primary_details.source, crm_lead_req_details.city, crm_lead_req_details.locality, crm_lead_req_details.sub_locality, crm_lead_status.color, crm_lead_req_details.clicked FROM crm_lead_primary_details JOIN crm_lead_req_details ON crm_lead_primary_details.l_id = crm_lead_req_details.l_id LEFT JOIN crm_lead_status ON crm_lead_req_details.status = crm_lead_status.status LEFT JOIN crm_users ON crm_users.u_id = crm_lead_req_details.assignto_id WHERE ?? = ? ORDER BY crm_lead_req_details.l_id DESC LIMIT ? OFFSET ?",
        ["crm_lead_req_details.status", status, limit, page],
        (err, result) => {
          if (err) {
            console.log(err);
          }
          if (result.length > 0) {
            res.send(result);
          } else {
            res.send("No Data Found");
          }
          connection.release();
        }
      );
    });
  } else {
    res.send("Access Denied");
  }
});

UserLeadRouter.post("/get-user-satus-count", async (req, res) => {
  const today = new Date();

  pool.getConnection(function (error, connection) {
    if (error) {
      throw error;
    }
    connection.query(
      "SELECT COUNT(lreq_id) AS statuslead_count FROM crm_lead_req_details WHERE status = ?",
      [req.body.status],
      (err, result) => {
        if (err) {
          console.log(err);
        }
        if (result.length > 0) {
          res.send(result);
        }
        connection.release();
      }
    );
  });
});
// for ES5
module.exports = UserLeadRouter;
