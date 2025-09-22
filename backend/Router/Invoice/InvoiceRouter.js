const express = require("express");
const pool = require("../../Database.js");
const dayjs = require("dayjs");

const InvoiceRouter = express.Router();

const DateTime = dayjs().format("YYYY-MM-DD HH:mm:ss");

InvoiceRouter.post("/add-invoice", (req, res) => {
  console.log(req.body.data[0]);

  pool.getConnection(function (error, connection) {
    if (error) {
      console.error("Error getting database connection:", error);
      return res.status(500).send("Error getting database connection");
    }

    // Insert data into MySQL using a single insert
    connection.query(
      "INSERT INTO crm_invoice_details (create_dt, inv_date, due_date, inv_to, total_due, payment_status, partially_amount, bank_name, base_value, brok, description,billto_companyname,billto_companyaddress,billto_companypan,billto_companygstnum,supplier_companypannum,supplier_companygstnum,supplier_companyreranum,buildingnum,flatnum) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ? , ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        DateTime,
        req.body.data[0].inv_date,
        req.body.data[0].due_date,
        req.body.data[0].inv_to,
        req.body.data[2],
        req.body.data[0].payment_status,
        req.body.data[0].partially_amount,
        req.body.data[0].bank_name,
        req.body.data[1][0].cost,
        req.body.data[1][0].quantity,
        req.body.data[0].note,
        req.body.data[0].billto_companyname,
        req.body.data[0].billto_companyaddress,
        req.body.data[0].billto_companypan,
        req.body.data[0].billto_companygstnum,
        req.body.data[0].supplier_companypannum,
        req.body.data[0].supplier_companygstnum,
        req.body.data[0].supplier_companyreranum,
        req.body.data[0].buildingnum,
        req.body.data[0].flatnum,
      ],
      (err, result) => {
        connection.release();
        if (err) {
          console.log(err);
        }
        console.log("Invoice data added successfully");
        res.send("Invoice data added successfully");
      }
    );
  });
});

InvoiceRouter.post("/get-all-booking-done", (req, res) => {
  // Extracting data from the request body

  pool.getConnection(function (error, connection) {
    if (error) {
      throw error;
    }
    connection.query(
      "SELECT l_id, status, lname,pname,p_email,p_mob,p_ccode,locality  FROM `crm_lead_primary_details` WHERE `status`='Booking Done' ",
      (err, result) => {
        if (err) {
          console.log(err);
        }
        if (result.length > 0) {
          res.send(result);
          // console.log(result);
        } else {
          res.send("No Data Found");
        }
        connection.release();
      }
    );
  });
});

InvoiceRouter.get("/get-all-invoice-details-table-data", (req, res) => {
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
      "SELECT `inv_id`, `create_dt`, `update_dt`, `created_by`, `inv_date`, `due_date`, `inv_to`, `total_due`, `payment_status`, `bank_name`, `partially_amount`, `configuration`, `base_value`, `brok`, `description`, `discount` ,`billto_companyname` ,`billto_companyaddress`, `billto_companypan` ,`billto_companygstnum` ,`supplier_companypannum` ,`supplier_companygstnum` , `supplier_companyreranum`, `buildingnum` , `flatnum` FROM `crm_invoice_details` ORDER BY crm_invoice_details.inv_id DESC LIMIT ? OFFSET ?",
      [limit, offset],
      (err, result) => {
        if (err) {
          console.log(err);
        } else {
          res.json(result);
          console.log(result);
        }
        connection.release();
      }
    );
  });
  // } else {
  //   pool.getConnection(function (error, connection) {
  //     if (error) throw error;
  //     connection.query(
  //       "SELECT `c_id`,`create_dt`,`update_dt`,`c_ccode`,`c_mob`,`c_email`,`c_name`,`c_source`,`c_position`,`c_status`,`country`,`state`,`city`,`locality`,`followup`,`followup_dt`,`comments`,`c_pdf` FROM `crm_broker_details` WHERE ?? = ? OR ?? = ? LIMIT ? OFFSET ?",
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

InvoiceRouter.post("/get-invoice-details-table-data-count", (req, res) => {
  const user_role = req.session.user[0].urole;
  const user_id = req.session.user[0].u_id;
  if (user_role !== "" || user_role === "Master" || user_role === "Admin") {
    pool.getConnection(function (error, connection) {
      if (error) throw error;
      connection.query(
        "SELECT COUNT(`inv_id`) AS totalCount FROM `crm_invoice_details`",
        (err, result) => {
          if (err) {
            console.log("error");
          } else {
            res.json(result[0].totalCount);
            // console.log(result[0].totalCount);
          }
          connection.release();
        }
      );
    });
  } else {
    //   pool.getConnection(function (error, connection) {
    //     if (error) throw error;
    //     connection.query(
    //       "SELECT COUNT(`brk_id`) AS totalCount FROM `crm_broker_details` WHERE ?? = ?",
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

InvoiceRouter.post("/edit-invoice", (req, res) => {
  console.log(req.body.data);
  pool.getConnection(function (error, connection) {
    if (error) throw error;
    connection.query(
      "UPDATE crm_invoice_details SET ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ?,?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ? WHERE ?? = ?",
      [
        "update_dt",
        DateTime,
        "due_date",
        req.body.data[0].due_date,
        "inv_to",
        req.body.data[0].inv_to,
        "total_due",
        req.body.data[2],
        "payment_status",
        req.body.data[0].payment_status,
        "partially_amount",
        req.body.data[0].partially_amount,
        "bank_name",
        req.body.data[0].bank_name,
        "configuration",
        req.body.data[0].items[0].configuration,
        "base_value",
        req.body.data[1][0].cost,
        "brok",
        req.body.data[1][0].quantity,
        "description",
        req.body.data[0].note,
        "billto_companyname",
        req.body.data[0].billto_companyname,
        "billto_companyaddress",
        req.body.data[0].billto_companyaddress,
        "billto_companypan",
        req.body.data[0].billto_companypan,
        "billto_companygstnum",
        req.body.data[0].billto_companygstnum,
        "supplier_companypannum",
        req.body.data[0].supplier_companypannum,
        "supplier_companygstnum",
        req.body.data[0].supplier_companygstnum,
        "supplier_companyreranum",
        req.body.data[0].supplier_companyreranum,
        "inv_id",
        req.body.data[0].inv_id,
      ],
      (err, result) => {
        if (err) {
          console.log(err);
          console.log("Invoice Details Not Updated Successfully");
          res.send("Invoice Details Not Updated Successfully");
        } else {
          console.log("Invoice Details Updated Successfully");
          res.send("Invoice Details Updated Successfully");
        }
        connection.release();
      }
    );
  });
});

InvoiceRouter.post("/get-all-bankname", (req, res) => {
  // Extracting data from the request body

  pool.getConnection(function (error, connection) {
    if (error) {
      throw error;
    }
    connection.query(
      "SELECT `bank_id`, `bank_name`, `acc_num`, `branch_name`, `ifsc_code` , `pan_num` , `gst_code` FROM `crm_bankname` ",
      (err, result) => {
        if (err) {
          console.log(err);
        }
        if (result.length > 0) {
          res.send(result);
          // console.log(result);
        } else {
          res.send("No Data Found");
        }
        connection.release();
      }
    );
  });
});

InvoiceRouter.post("/delete-selected-invoice", (req, res) => {
  const invid = req.body.inv_id;
  // console.log("id : ", req.body.inv_id);
  const inv_id = invid.map((entry) => entry.inv_id);
  pool.getConnection(function (error, connection) {
    if (error) throw error;
    connection.query(
      "DELETE FROM crm_invoice_details WHERE ?? IN (?) ",
      ["inv_id", inv_id],
      (err, result) => {
        if (err) {
          console.log(err);
        } else {
          res.send("Invoice Details Deleted Successfully");
        }
        connection.release();
      }
    );
  });
});

module.exports = InvoiceRouter;