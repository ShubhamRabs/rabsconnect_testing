const express = require("express");
const pool = require("../../../Database.js");

const SearchLoanRouter = express.Router();

SearchLoanRouter.post("/search-loan", (req, res) => {
  const user_role = req.session.user[0].urole;
  const user_id = req.session.user[0].u_id;

  const { page, pageSize } = req.query;
  const offset = (page - 1) * pageSize;
  const limit = parseInt(pageSize);

  const {
    project_name,
    bank_name,
    sales_manager,
    status,
    loan_date_from,
    loan_date_to,
    booking_date_from,
    booking_date_to,
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
      "SELECT crm_loan_details.`loan_id`,crm_loan_details.`create_dt`,crm_loan_details.`update_dt`,crm_loan_details.`created_by`,crm_loan_details.`client_name`,crm_loan_details.`ccode`,crm_loan_details.`mob`,CONCAT(crm_loan_details.ccode, ' ', crm_loan_details.mob) AS mobile, crm_loan_details.`project_name`,crm_loan_details.`booking_date`,crm_loan_details.`unit_details`,crm_loan_details.`bank_name`,crm_loan_details.`sales_manager`,crm_loan_details.`status`,crm_loan_details.`sanction_amount`, crm_users.username as createdby FROM `crm_loan_details` LEFT JOIN crm_users ON crm_users.u_id = crm_loan_details.`created_by` WHERE loan_id != '' ";

    //  ======================= HR condition =======================
    // if (user_role === "HR") {
    //   query += " AND created_by = ? OR assign_to = ? ";
    //   queryParams.push(user_id, user_id);
    // }
    //  ======================= Page search condition =======================
    // if (pageName === "Assign Candidates") {
    //   query += " AND assign_by != '0' AND assign_to != '0' ";
    // } else if (pageName === "Non Assign Candidates") {
    //   query += " AND assign_by = '0' AND assign_to = '0' ";
    // }
    //  ======================= project_name =======================
    if (Array.isArray(project_name) && project_name.length > 0) {
      const whereConditions = project_name.map((param) => {
        queryParams.push(`%${param}%`);
        return "crm_loan_details.project_name LIKE ?";
      });
      query += ` AND (${whereConditions.join(" OR ")})`;
    }
    // =======================  bank_name  =======================
    if (Array.isArray(bank_name) && bank_name.length > 0) {
      const whereConditions = bank_name.map((param) => {
        queryParams.push(`%${param}%`);
        return "crm_loan_details.bank_name LIKE ?";
      });
      query += ` AND (${whereConditions.join(" OR ")})`;
    }
    //=======================  sales_manager  =======================
    if (Array.isArray(sales_manager) && sales_manager.length > 0) {
      const whereConditions = sales_manager.map((param) => {
        queryParams.push(`%${param}%`);
        return "crm_loan_details.sales_manager LIKE ?";
      });
      query += ` AND (${whereConditions.join(" OR ")})`;
    }
    // =======================  status  =======================
    if (Array.isArray(status) && status.length > 0) {
      const whereConditions = status.map((param) => {
        queryParams.push(`%${param}%`);
        return "crm_loan_details.status LIKE ?";
      });
      query += ` AND (${whereConditions.join(" OR ")})`;
    }
    // =======================  Loan Date  =======================
    if (loan_date_from !== "" && loan_date_to !== "") {
      query += ` AND DATE(crm_loan_details.create_dt) BETWEEN ? AND ?`;
      queryParams.push(loan_date_from, loan_date_to);
    }
    // =======================  Booking Date  =======================
    if (booking_date_from !== "" && booking_date_to !== "") {
      query += ` AND DATE(crm_loan_details.booking_date) BETWEEN ? AND ?`;
      queryParams.push(booking_date_from, booking_date_to);
    }
    // =======================  country  =======================
    // if (Array.isArray(country) && country.length > 0) {
    //   if (branch_admin || team_leader || sales_manager || tele_caller) {
    //     const whereConditions = country.map((param) => {
    //       queryParams.push(`%${param}%`);
    //       return "crm_loan_details.country LIKE ?";
    //     });
    //     query += ` AND (${whereConditions.join(" OR ")})`;
    //   } else {
    //     const whereConditions = country.map((param) => {
    //       queryParams.push(`%${param}%`);
    //       return "crm_loan_details.country LIKE ?";
    //     });
    //     query += ` AND (${whereConditions.join(" OR ")})`;
    //   }
    // }

    // =======================  state  =======================
    // if (Array.isArray(state) && state.length > 0) {
    //   if (branch_admin || team_leader || sales_manager || tele_caller) {
    //     const whereConditions = state.map((param) => {
    //       queryParams.push(`%${param}%`);
    //       return "crm_loan_details.state LIKE ?";
    //     });
    //     query += ` AND (${whereConditions.join(" OR ")})`;
    //   } else {
    //     const whereConditions = state.map((param) => {
    //       queryParams.push(`%${param}%`);
    //       return "crm_loan_details.state LIKE ?";
    //     });
    //     query += ` AND (${whereConditions.join(" OR ")})`;
    //   }
    // }
    // =======================  city  =======================
    // if (Array.isArray(city) && city.length > 0) {
    //   if (branch_admin || team_leader || sales_manager || tele_caller) {
    //     const whereConditions = city.map((param) => {
    //       queryParams.push(`%${param}%`);
    //       return "crm_loan_details.city LIKE ?";
    //     });
    //     query += ` AND (${whereConditions.join(" OR ")})`;
    //   } else {
    //     const whereConditions = city.map((param) => {
    //       queryParams.push(`%${param}%`);
    //       return "crm_loan_details.city LIKE ?";
    //     });
    //     query += ` AND (${whereConditions.join(" OR ")})`;
    //   }
    // }
    // =======================  locality  =======================
    // if (Array.isArray(locality) && locality.length > 0) {
    //   if (branch_admin || team_leader || sales_manager || tele_caller) {
    //     const whereConditions = locality.map((param) => {
    //       queryParams.push(`%${param}%`);
    //       return "crm_loan_details.locality LIKE ?";
    //     });
    //     query += ` AND (${whereConditions.join(" OR ")})`;
    //   } else {
    //     const whereConditions = locality.map((param) => {
    //       queryParams.push(`%${param}%`);
    //       return "crm_loan_details.locality LIKE ?";
    //     });
    //     query += ` AND (${whereConditions.join(" OR ")})`;
    //   }
    // }
    // =======================  anytext  =======================
    if (typeof anytext === "string" && anytext.length > 0) {
      // Construct the SQL query to search for anytext in multiple columns
      const whereConditions = [
        "crm_loan_details.loan_id LIKE ?",
        "crm_loan_details.client_name LIKE ?",
        "crm_loan_details.ccode LIKE ?",
        "crm_loan_details.mob LIKE ?",
        "crm_loan_details.unit_details LIKE ?",
      ];

      const likeParam = `%${anytext}%`;
      queryParams.push(
        likeParam,
        likeParam,
        likeParam,
        likeParam,
        likeParam,
      );
      query += ` AND (${whereConditions.join(" OR ")})`;
    }

    query += ` ORDER BY crm_loan_details.loan_id DESC LIMIT ? OFFSET ?`;
    queryParams.push(limit, offset);

    // console.log("SQL Query:", query, queryParams);
    connection.query(query, queryParams, (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
      } else {
        res.json(result);
        // console.log(result)
      }
      connection.release();
    });
  });
});

SearchLoanRouter.post("/search-loan-count", (req, res) => {
  const user_role = req.session.user[0].urole;
  const user_id = req.session.user[0].u_id;

  const {
    project_name,
    bank_name,
    sales_manager,
    status,
    loan_date_from,
    loan_date_to,
    booking_date_from,
    booking_date_to,
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
      "SELECT COUNT(`loan_id`) AS totalCount FROM `crm_loan_details` WHERE loan_id != '' ";

    //  ======================= HR condition =======================
    // if (user_role === "HR") {
    //   query += " AND created_by = ? OR assign_to = ? ";
    //   queryParams.push(user_id, user_id);
    // }

    //  ======================= Page search condition =======================
    // if (pageName === "Assign Candidates") {
    //   query += " AND assign_by != '0' AND assign_to != '0' ";
    // } else if (pageName === "Non Assign Candidates") {
    //   query += " AND assign_by = '0' AND assign_to = '0' ";
    // }

    //  ======================= project_name =======================
    if (Array.isArray(project_name) && project_name.length > 0) {
      const whereConditions = project_name.map((param) => {
        queryParams.push(`%${param}%`);
        return "crm_loan_details.project_name LIKE ?";
      });
      query += ` AND (${whereConditions.join(" OR ")})`;
    }
    //  ======================= bank_name =======================
    if (Array.isArray(bank_name) && bank_name.length > 0) {
      const whereConditions = bank_name.map((param) => {
        queryParams.push(`%${param}%`);
        return "crm_loan_details.bank_name LIKE ?";
      });
      query += ` AND (${whereConditions.join(" OR ")})`;
    }
    // =======================  sales_manager  =======================
    if (Array.isArray(sales_manager) && sales_manager.length > 0) {
      const whereConditions = sales_manager.map((param) => {
        queryParams.push(`%${param}%`);
        return "crm_loan_details.sales_manager LIKE ?";
      });
      query += ` AND (${whereConditions.join(" OR ")})`;
    }
    // =======================  status  =======================
    if (Array.isArray(status) && status.length > 0) {
      const whereConditions = status.map((param) => {
        queryParams.push(`%${param}%`);
        return "crm_loan_details.status LIKE ?";
      });
      query += ` AND (${whereConditions.join(" OR ")})`;
    }
    // =======================  Loan Date  =======================
    if (loan_date_from !== "" && loan_date_to !== "") {
      query += ` AND DATE(crm_loan_details.create_dt) BETWEEN ? AND ?`;
      queryParams.push(loan_date_from, loan_date_to);
    }
    // =======================  Booking Date  =======================
    if (booking_date_from !== "" && booking_date_to !== "") {
      query += ` AND DATE(crm_loan_details.booking_date) BETWEEN ? AND ?`;
      queryParams.push(booking_date_from, booking_date_to);
    }
    // =======================  country  =======================
    // if (Array.isArray(country) && country.length > 0) {
    //   if (branch_admin || team_leader || sales_manager || tele_caller) {
    //     const whereConditions = country.map((param) => {
    //       queryParams.push(`%${param}%`);
    //       return "crm_loan_details.country LIKE ?";
    //     });
    //     query += ` AND (${whereConditions.join(" OR ")})`;
    //   } else {
    //     const whereConditions = country.map((param) => {
    //       queryParams.push(`%${param}%`);
    //       return "crm_loan_details.country LIKE ?";
    //     });
    //     query += ` AND (${whereConditions.join(" OR ")})`;
    //   }
    // }
    // =======================  state  =======================
    // if (Array.isArray(state) && state.length > 0) {
    //   if (branch_admin || team_leader || sales_manager || tele_caller) {
    //     const whereConditions = state.map((param) => {
    //       queryParams.push(`%${param}%`);
    //       return "crm_loan_details.state LIKE ?";
    //     });
    //     query += ` AND (${whereConditions.join(" OR ")})`;
    //   } else {
    //     const whereConditions = state.map((param) => {
    //       queryParams.push(`%${param}%`);
    //       return "crm_loan_details.state LIKE ?";
    //     });
    //     query += ` AND (${whereConditions.join(" OR ")})`;
    //   }
    // }
    // =======================  city  =======================
    // if (Array.isArray(city) && city.length > 0) {
    //   if (branch_admin || team_leader || sales_manager || tele_caller) {
    //     const whereConditions = city.map((param) => {
    //       queryParams.push(`%${param}%`);
    //       return "crm_loan_details.city LIKE ?";
    //     });
    //     query += ` AND (${whereConditions.join(" OR ")})`;
    //   } else {
    //     const whereConditions = city.map((param) => {
    //       queryParams.push(`%${param}%`);
    //       return "crm_loan_details.city LIKE ?";
    //     });
    //     query += ` AND (${whereConditions.join(" OR ")})`;
    //   }
    // }
    // =======================  locality  =======================
    // if (Array.isArray(locality) && locality.length > 0) {
    //   if (branch_admin || team_leader || sales_manager || tele_caller) {
    //     const whereConditions = locality.map((param) => {
    //       queryParams.push(`%${param}%`);
    //       return "crm_loan_details.locality LIKE ?";
    //     });
    //     query += ` AND (${whereConditions.join(" OR ")})`;
    //   } else {
    //     const whereConditions = locality.map((param) => {
    //       queryParams.push(`%${param}%`);
    //       return "crm_loan_details.locality LIKE ?";
    //     });
    //     query += ` AND (${whereConditions.join(" OR ")})`;
    //   }
    // }
    //=======================  anytext  =======================
    if (typeof anytext === "string" && anytext.length > 0) {
      // Construct the SQL query to search for anytext in multiple columns
      const whereConditions = [
        "crm_loan_details.loan_id LIKE ?",
        "crm_loan_details.client_name LIKE ?",
        "crm_loan_details.ccode LIKE ?",
        "crm_loan_details.mob LIKE ?",
        "crm_loan_details.unit_details LIKE ?",
      ];

      const likeParam = `%${anytext}%`;
      queryParams.push(
        likeParam,
        likeParam,
        likeParam,
        likeParam,
        likeParam,
      );
      query += ` AND (${whereConditions.join(" OR ")})`;
    }

    query += ` ORDER BY crm_loan_details.loan_id DESC`;

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

module.exports = SearchLoanRouter;
