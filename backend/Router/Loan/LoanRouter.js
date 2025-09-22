// for ES5
const express = require("express");
const dayjs = require("dayjs");
const pool = require("../../Database.js");

const LoanRouter = express.Router();

function formatDate(dateString) {
  try {
    const parts = dateString.match(
      /(\d{1,2})[/-](\d{1,2})[/-](\d{2,4}) (\d{1,2}):(\d{1,2})/
    );

    if (!parts) {
      return "0000-00-00 00:00:00";
    }

    const [, day, month, year, hours, minutes] = parts;

    // Note: months are 0-indexed in JavaScript Date objects
    const date = new Date(Date.UTC(year, month - 1, day, hours, minutes));
    if (isNaN(date.getTime())) {
      throw new Error(
        `Invalid date components: ${year}, ${month}, ${day}, ${hours}, ${minutes}`
      );
    }

    return date.toISOString().slice(0, 19).replace("T", " ");
  } catch (error) {
    console.log("error occured", error);
    return "0000-00-00 00:00:00";
  }
}

LoanRouter.post("/add-loan", (req, res) => {
  
  // console.log(req.body.data[0].l_client_name)
  pool.getConnection(function (error, connection) {
    if (error) throw error;
    connection.query(
      "INSERT INTO crm_loan_details (??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        "create_dt",
        "update_dt",
        "created_by",
        "client_name",
        "ccode",
        "mob",
        "project_name",
        "booking_date",
        "unit_details",
        "bank_name",
        "sales_manager",
        "status",
        "sanction_amount",
        req.body.DateTime,
        req.body.DateTime,
        req.session.user[0].u_id,
        req.body.data[0].l_client_name,
        req.body.data[0].l_ccode,
        req.body.data[0].l_mob,
        req.body.data[0].l_project_name,
        req.body.data[0].l_booking_date,
        req.body.data[0].l_unit_details,
        req.body.data[0].l_bank_name,
        req.body.data[0].l_sales_manager,
        req.body.data[0].l_status,
        req.body.data[0].l_sanction_amount,
      ],
      (err, result) => {
        if (err) {
          console.log(err);
        } else {
          res.json("Loan Details Added Successfully");
        }
        connection.release();
      }
    );
  });
});

LoanRouter.get("/get-loan-details-table-data", (req, res) => {
  const user_role = req.session.user[0].urole;
  const user_id = req.session.user[0].u_id;
  const { page, pageSize } = req.query;
  const offset = (page - 1) * pageSize;
  const limit = parseInt(pageSize);

  // if (
  //   user_role === "Master" ||
  //   user_role === "Admin" ||
  //   user_role !== ""
  // ) {
    pool.getConnection(function (error, connection) {
      if (error) throw error;
      connection.query(
        "SELECT crm_loan_details.`loan_id`,crm_loan_details.`create_dt`,crm_loan_details.`update_dt`,crm_loan_details.`created_by`,crm_loan_details.`client_name`,crm_loan_details.`ccode`,crm_loan_details.`mob`, CONCAT(crm_loan_details.ccode, ' ', crm_loan_details.mob) AS mobile, crm_loan_details.`project_name`,crm_loan_details.`booking_date`,crm_loan_details.`unit_details`,crm_loan_details.`bank_name`,crm_loan_details.`sales_manager`,crm_loan_details.`status`,crm_loan_details.`sanction_amount`, crm_users.username as createdby FROM `crm_loan_details` LEFT JOIN crm_users ON crm_users.u_id = crm_loan_details.created_by ORDER BY crm_loan_details.loan_id DESC LIMIT ? OFFSET ?",
        [limit, offset],
        (err, result) => {
          if (err) {
            console.log(err);
          } else {
            res.json(result);
          }
          connection.release();
        }
      );
    });
  // } else {
  //   pool.getConnection(function (error, connection) {
  //     if (error) throw error;
  //     connection.query(
  //       "SELECT `c_id`,`create_dt`,`update_dt`,`c_ccode`,`c_mob`,`c_email`,`c_name`,`c_source`,`c_position`,`c_status`,`country`,`state`,`city`,`locality`,`followup`,`followup_dt`,`comments`,`c_pdf` FROM `crm_candidate_details` WHERE ?? = ? OR ?? = ? LIMIT ? OFFSET ?",
  //       ["created_by", user_id, "assign_to", user_id, limit, offset],
  //       (err, result) => {
  //         if (err) {
  //           console.log(err);
  //         } else {
  //           res.json(result);
  //         }
  //         connection.release();
  //       }
  //     );
  //   });
  // }
});
  
LoanRouter.post("/get-loan-details-table-data-count", (req, res) => {
  const user_role = req.session.user[0].urole;
  const user_id = req.session.user[0].u_id;
  if (
    user_role !== "" ||
    user_role === "Master" ||
    user_role === "Admin"
  ) {
    pool.getConnection(function (error, connection) {
      if (error) throw error;
      connection.query(
        "SELECT COUNT(`loan_id`) AS totalCount FROM `crm_loan_details`",
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
  } else {
  //   pool.getConnection(function (error, connection) {
  //     if (error) throw error;
  //     connection.query(
  //       "SELECT COUNT(`loan_id`) AS totalCount FROM `crm_loan_details` WHERE ?? = ?",
  //       ["assign_to", user_id],
  //       (err, result) => {
  //         if (err) {
  //           console.log(err);
  //         } else {
  //           res.json(result[0].totalCount);
  //         }
  //         connection.release();
  //       }
  //     );
  //   });
  }
});

LoanRouter.post("/delete-selected-loan", (req, res) => {
  const loanid = req.body.loan_id;
  const loan_id = loanid.map((entry) => entry.loan_id);
  pool.getConnection(function (error, connection) {
    if (error) throw error;
    connection.query(
      "DELETE FROM crm_loan_details WHERE ?? IN (?) ",
      ["loan_id", loan_id],
      (err, result) => {
        if (err) {
          console.log(err);
        } else {
          res.send("Loan Details Deleted Successfully");
        }
        connection.release();
      }
    );
  });
});

LoanRouter.post("/edit-loan", (req, res) => {
  console.log(req.body);
  pool.getConnection(function (error, connection) {
    if (error) throw error;
    connection.query(
      "UPDATE `crm_loan_details` SET ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ? WHERE ?? = ?",
      [
        `update_dt`,
        req.body.DateTime,
        `client_name`,
        req.body.data[0].l_client_name,
        `ccode`,
        req.body.data[1].l_ccode,
        `mob`,
        req.body.data[1].l_mob,
        `project_name`,
        req.body.data[0].l_project_name,
        `booking_date`,
        req.body.data[0].l_booking_date,
        `unit_details`,
        req.body.data[0].l_unit_details,
        `bank_name`,
        req.body.data[0].l_bank_name,
        `sales_manager`,
        req.body.data[0].l_sales_manager,
        `status`,
        req.body.data[0].l_status,
        `sanction_amount`,
        req.body.data[0].l_sanction_amount,
        "loan_id",
        req.body.data[0].l_loan_id,
      ],
      (err, result) => {
        if (err) {
          console.log(err);
        } else {
          res.send("Loan Details Updated Successfully");
        }
        connection.release();
      }
    );
  });
});

LoanRouter.post("/import-loan", (req, res) => {
  const data = req.body.data;
  // const user_id = req.session.user[0].u_id;
  const values = [];

    // Check if all columns exist in CSV
    const keysToCheck = [
      "create_dt",
      "update_dt",
      "client_name",
      "ccode",
      "mob",
      "project_name",
      "booking_date",
      "unit_details",
      "bank_name",
      "sales_manager",
      "status",
      "sanction_amount",
    ];
  
    const allKeysExist = keysToCheck.every((key) => data[0].hasOwnProperty(key));
  
    if (allKeysExist === false || keysToCheck.length !== Object.keys(data[0]).length) {
      // console.log("Incorrect File Format");
      res.status(400).json({ message: "Incorrect File, Please Download Fresh CSV File", error: "Incorrect File Format" });
      return;
    }
  
  pool.getConnection(function (error, connection) {
    if (error) throw error;
    let rowcount = 1;
    for (const {
      create_dt,
      update_dt,
      client_name,
      ccode,
      mob,
      project_name,
      booking_date,
      unit_details,
      bank_name,
      sales_manager,
      status,
      sanction_amount,
    } of data) {

      let formattedCreateDt = formatDate(create_dt);
      let formattedUpdateDt = formatDate(update_dt);

      rowcount++;

      // check if all fields are empty
      if(create_dt === "" && update_dt === "" && client_name === "" && ccode === "" && mob === "" && project_name ==="" && booking_date === "" && unit_details === "" && bank_name === "" && sales_manager === "" && status === "" && sanction_amount === ""){
        // console.log("No Data Found");
        continue;
      }else{ 

        values.push({
          create_dt:formattedCreateDt,
          update_dt:formattedUpdateDt,
          client_name,
          ccode,
          mob,
          project_name,
          booking_date,
          unit_details,
          bank_name,
          sales_manager,
          status,
          sanction_amount,
        });

      }
    }
    if(values.length > 0){
      const query =
        "INSERT INTO crm_loan_details ( create_dt, update_dt, created_by, client_name, ccode, mob, project_name, booking_date, unit_details, bank_name, sales_manager, status, sanction_amount) VALUES ?";
      connection.query(
        query,
        [
          values.map((item) => [
            item.create_dt,
            item.update_dt,
            req.body.login_u_id,
            item.client_name,
            item.ccode,
            item.mob,
            item.project_name,
            item.booking_date.split("/").reverse().join("-"),
            item.unit_details,
            item.bank_name,
            item.sales_manager,
            item.status,
            item.sanction_amount,
          ]),
        ],
        (error, result) => {
          if (error) {
            res.send(error);
          } else {
            res.send(result);
          }
        }
      );
      connection.release();
    }else{
      res.status(400).json({ message: `No data found in csv file` , error: "No data Found" });
    }
  });
});

// for ES5
module.exports = LoanRouter;
