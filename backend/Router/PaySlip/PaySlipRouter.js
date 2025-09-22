const express = require("express");
const pool = require("../../Database");

const PaySlipRouter = express.Router();

// PaySlipRouter.post("/add-payslip", (req, res) => {
//   const {
//     user,
//     start_date,
//     end_date,
//     emp_name,
//     email,
//     r_email,
//     ccode,
//     mob,
//     health_issue,
//     designation,
//     department,
//     location,
//     join_date,
//     total_days,
//     working_days,
//     workedDays,
//     weekly_off,
//     holidays,
//     full_days,
//     half_day,
//     forget_to_logout,
//     absent_days,
//     med_leave,
//     paid_leave,
//     bank_name,
//     account_no,
//     pf_no,
//     pan_no,
//     basic_salary,
//     hra,
//     medical_allowance,
//     travel_allowance,
//     special_allowance,
//     Incentive,
//     profession_tax,
//     pf_amount,
//     other_deduction,
//     gross_earnings,
//     total_deductions,
//     net_pay_amount,
//     amountInWords,
//     other_details,
//     tds,
//     ESIC,
//     late_mark,
//     religion,
//     gender,
//     mstatus,
//     dob,
//     aadhar_no,
//     bank_branch,
//     ac_name,
//     ifsc_code,
//     loss_of_pay,
//   } = req.body;

//   pool.getConnection((err, connection) => {
//     if (err) {
//       return res
//         .status(500)
//         .json({ message: "Internal server couldn't connect with database" });
//     }

//     // Step 1: Insert payslip into crm_payslip table
//     const insertPayslipQuery = `
//       INSERT INTO crm_payslip (
//         u_id, sal_frm_date, sal_to_date, emp_name, email, ccode, mob, location, designation, department,join_date, total_days, working_days, worked_days, weekly_off, holidays, full_days, half_day, forget_to_logout, absent_days, med_leave, paid_leave, bank_name, ac_no, pf_no, pan_no, basic_salary, hra, medical_allowance, travel_allowance, special_allowance, incentive, profession_tax, pf_amount, other_deduction, gross_earnings, total_deductions, net_pay_amount, net_pay_words, other_details, tds, ESIC, late_mark, r_email, health_issue, religion, gender, mstatus, dob, aadhar_no, bank_branch, ac_name, ifsc_code, loss_of_pay
//       ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
//     `;

//     connection.query(insertPayslipQuery,
//       [
//         user,
//         start_date,
//         end_date,
//         emp_name,
//         email,
//         ccode,
//         mob,
//         location,
//         designation,
//         department,
//         join_date,
//         total_days,
//         working_days,
//         workedDays,
//         weekly_off,
//         holidays,
//         full_days,
//         half_day,
//         forget_to_logout,
//         absent_days,
//         med_leave,
//         paid_leave,
//         bank_name,
//         account_no,
//         pf_no,
//         pan_no,
//         basic_salary,
//         hra,
//         medical_allowance,
//         travel_allowance,
//         special_allowance,
//         Incentive,
//         profession_tax,
//         pf_amount,
//         other_deduction,
//         gross_earnings,
//         total_deductions,
//         net_pay_amount,
//         amountInWords,
//         other_details,
//         tds,
//         ESIC,
//         late_mark,
//         r_email,
//         health_issue,
//         religion,
//         gender,
//         mstatus,
//         dob,
//         aadhar_no,
//         bank_branch,
//         ac_name,
//         ifsc_code,
//         loss_of_pay,
//       ], (err, result) => {
//       if (err) {
//         connection.release();
//         return res.status(500).json({ message: "Error inserting payslip", error: err });
//       }

//       // Step 2: Update crm_user_details with new designation, department, and basic_salary
//       const updateUserDetailsQuery = `
//         UPDATE crm_user_details
//         SET designation = ?, department = ?, basic_salary = ?, update_dt = NOW()
//         WHERE u_id = ?
//       `;

//       connection.query(updateUserDetailsQuery, [designation, department, basic_salary, user], (err, result) => {
//         connection.release();
//         if (err) {
//           console.log(err,"HELOOERREEEEE");
//           return res.status(500).json({ message: "Error updating user details", error: err });
//         }

//         // Respond with success
//         res.json({ message: "Payslip added and user details updated successfully" });
//       });
//     });
//   });
// });

// PaySlipRouter.post("/add-payslip", (req, res) => {
//   const {
//     user, // u_id
//     start_date,
//     end_date,
//     emp_name,
//     email,
//     r_email,
//     ccode,
//     mob,
//     health_issue,
//     designation, // from crm_payslip
//     department, // from crm_payslip
//     location,
//     join_date,
//     total_days,
//     working_days,
//     workedDays,
//     weekly_off,
//     holidays,
//     full_days,
//     half_day,
//     forget_to_logout,
//     absent_days,
//     med_leave,
//     paid_leave,
//     bank_name,
//     account_no,
//     pf_no,
//     pan_no,
//     basic_salary, // from crm_payslip
//     hra,
//     medical_allowance,
//     travel_allowance,
//     special_allowance,
//     Incentive,
//     profession_tax,
//     pf_amount,
//     other_deduction,
//     gross_earnings,
//     total_deductions,
//     net_pay_amount,
//     amountInWords,
//     other_details,
//     tds,
//     ESIC,
//     late_mark,
//     religion,
//     gender,
//     mstatus,
//     dob,
//     aadhar_no,
//     bank_branch,
//     ac_name,
//     ifsc_code,
//     loss_of_pay,
//   } = req.body;

//   console.log(req.body, "req.body");

//   pool.getConnection((err, connection) => {
//     if (err) {
//       return res
//         .status(500)
//         .json({ message: "Internal server couldn't connect with database" });
//     }

//     // Insert data into crm_payslip table
//     const insertPayslipQuery = `
//       INSERT INTO crm_payslip (
//         u_id, sal_frm_date, sal_to_date, emp_name, email, ccode, mob, location, designation, department,
//         join_date, total_days, working_days, worked_days, weekly_off, holidays,
//         full_days, half_day, forget_to_logout, absent_days, med_leave, paid_leave, bank_name, ac_no,
//         pf_no, pan_no, basic_salary, hra, medical_allowance, travel_allowance,
//         special_allowance, incentive, profession_tax, pf_amount, other_deduction,
//         gross_earnings, total_deductions, net_pay_amount, net_pay_words,
//         other_details, tds, ESIC, late_mark, r_email, health_issue, religion, gender,
//         mstatus, dob, aadhar_no, bank_branch, ac_name, ifsc_code, loss_of_pay
//       ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
//     `;

//     // Execute the payslip insert query
//     connection.query(
//       insertPayslipQuery,
//       [
//         user,
//         start_date,
//         end_date,
//         emp_name,
//         email,
//         ccode,
//         mob,
//         location,
//         designation,
//         department,
//         join_date,
//         total_days,
//         working_days,
//         workedDays,
//         weekly_off,
//         holidays,
//         full_days,
//         half_day,
//         forget_to_logout,
//         absent_days,
//         med_leave,
//         paid_leave,
//         bank_name,
//         account_no,
//         pf_no,
//         pan_no,
//         basic_salary,
//         hra,
//         medical_allowance,
//         travel_allowance,
//         special_allowance,
//         Incentive,
//         profession_tax,
//         pf_amount,
//         other_deduction,
//         gross_earnings,
//         total_deductions,
//         net_pay_amount,
//         amountInWords,
//         other_details,
//         tds,
//         ESIC,
//         late_mark,
//         r_email,
//         health_issue,
//         religion,
//         gender,
//         mstatus,
//         dob,
//         aadhar_no,
//         bank_branch,
//         ac_name,
//         ifsc_code,
//         loss_of_pay,
//       ],
//       (err, result) => {
//         if (err) {
//           console.log(err);
//           connection.release();
//           return res
//             .status(500)
//             .json({ message: "Error inserting payslip", error: err });
//         }

//         // After successful payslip insert, update crm_user_details with new designation, department, and basic_salary
//         const updateUserDetailsQuery = `
//           UPDATE crm_user_details
//           SET designation = ?, department = ?, basic_salary = ?, update_dt = NOW()
//           WHERE u_id = ?
//         `;

//         connection.query(
//           updateUserDetailsQuery,
//           [designation, department, basic_salary, user],
//           (updateErr, updateResult) => {
//             connection.release();
//             if (updateErr) {
//               console.log(updateErr);
//               return res
//                 .status(500)
//                 .json({
//                   message: "Error updating user details",
//                   error: updateErr,
//                 });
//             }

//             res.json({
//               message: "Payslip added and user details updated successfully",
//             });
//           }
//         );
//       }
//     );
//   });
// });

PaySlipRouter.post("/add-payslip", (req, res) => {
  // Destructure fields from request body
  const {
    user,
    start_date,
    end_date,
    emp_name,
    email,
    r_email,
    ccode,
    mob,
    health_issue,
    designation,
    department,
    location,
    join_date,
    total_days,
    working_days,
    workedDays,
    weekly_off,
    holidays,
    full_days,
    half_day,
    forget_to_logout,
    absent_days,
    med_leave,
    paid_leave,
    bank_name,
    account_no,
    pf_no,
    pan_no,
    basic_salary,
    hra,
    medical_allowance,
    travel_allowance,
    special_allowance,
    Incentive,
    profession_tax,
    pf_amount,
    other_deduction,
    gross_earnings,
    total_deductions,
    net_pay_amount,
    amountInWords,
    other_details,
    tds,
    ESIC,
    late_mark,
    religion,
    gender,
    mstatus,
    dob,
    aadhar_no,
    bank_branch,
    ac_name,
    ifsc_code,
    loss_of_pay,
  } = req.body;

  pool.getConnection((err, connection) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Internal server couldn't connect with database" });
    }

    // SQL query to insert data into crm_payslip table
    const query = `
          INSERT INTO crm_payslip (
            u_id, sal_frm_date, sal_to_date, emp_name, email, ccode, mob, location, designation, department,
            join_date, total_days, working_days, worked_days, weekly_off, holidays,
            full_days, half_day, forget_to_logout, absent_days, med_leave, paid_leave, bank_name, ac_no,
            pf_no, pan_no, basic_salary, hra, medical_allowance, travel_allowance,
            special_allowance, incentive, profession_tax, pf_amount, other_deduction,
            gross_earnings, total_deductions, net_pay_amount, net_pay_words,
            other_details, tds, ESIC,late_mark, r_email, health_issue, religion, gender,
            mstatus, dob, aadhar_no, bank_branch, ac_name, ifsc_code, loss_of_pay
          ) VALUES (
            ?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?
          )`;

    // Executing the query with the corresponding values
    connection.query(
      query,
      [
        user, // u_id
        start_date, // sal_frm_date
        end_date, // sal_to_date
        emp_name, // emp_name
        email, // email
        ccode, // ccode
        mob, // mob
        location, // location
        designation, // designation
        department, // department
        join_date, // join_date
        total_days, // total_days
        working_days, // working_days
        workedDays, // worked_days
        weekly_off, // weekly_off
        holidays, // holidays
        full_days, // full_days
        half_day, // half_day
        forget_to_logout, // forget_to_logout
        absent_days, // absent_days
        med_leave, // med_leave
        paid_leave, // paid_leave
        bank_name, // bank_name
        account_no, // ac_no
        pf_no, // pf_no
        pan_no, // pan_no
        basic_salary, // basic_salary
        hra, // hra
        medical_allowance, // medical_allowance
        travel_allowance, // travel_allowance
        special_allowance, // special_allowance
        Incentive, // incentive
        profession_tax, // profession_tax
        pf_amount, // pf_amount
        other_deduction, // other_deduction
        gross_earnings, // gross_earnings
        total_deductions, // total_deductions
        net_pay_amount, // net_pay_amount
        amountInWords, // net_pay_words
        other_details, // other_details
        tds, // tds
        ESIC, // ESIC
        late_mark, // late_mark
        r_email, // r_email
        health_issue, // health_issue
        religion, // religion
        gender, // gender
        mstatus, // mstatus
        dob, // dob
        aadhar_no, // aadhar_no
        bank_branch, // bank_branch
        ac_name, // ac_name
        ifsc_code, // ifsc_code
        loss_of_pay, // loss_of_pay
      ],
      (err, result) => {
        // Release the connection back to the pool
        connection.release();
        if (err) {
          console.log(err, "error");
          return res
            .status(500)
            .json({ message: "Error executing query", error: err });
        }
        res.json({ result });
      }
    );
  });
});

PaySlipRouter.post("/get-all-slips", (req, res) => {
  pool.getConnection((err, connection) => {
    if (err)
      res
        .json({ message: "Internal server could'nt connect with database" })
        .status(500);
    const query = "SELECT * from crm_payslip;";
    connection.query(query, (err, result) => {
      if (err) res.json({ message: "Could not Fetch Payslips" }).status(500);
      res.json(result);
      connection.release();
    });
  });
});

PaySlipRouter.post("/get-payslip-by-id/:id", (req, res) => {
  const { id } = req.params;
  console.log(id);
  pool.getConnection((err, connection) => {
    if (err)
      res
        .json({ message: "Internal server could'nt connect with database" })
        .status(500);
    const query = "SELECT * FROM crm_payslip WHERE ps_id = ?";
    connection.query(query, [id], (err, result) => {
      if (err) throw err;
      res.json({
        data: result,
      });
      connection.release();
    });
  });
});

PaySlipRouter.post("/update-pay-slip-by-id/:id", (req, res) => {
  const { id } = req.params;
  pool.getConnection((err, connection) => {
    if (err) {
      res
        .status(500)
        .json({ message: "Internal server couldn't connect with database" });
      console.log(err);
      return; // Add return statement to prevent further execution
    }

    const query =
      "UPDATE `crm_payslip` SET ?? = ?, ?? = ?,?? = ?, ?? = ?, ??= ? ,?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ? WHERE ps_id = ?";
    connection.query(
      query,
      [
        "sal_frm_date",
        req.body.values.sal_frm_date,
        "sal_to_date",
        req.body.values.sal_to_date,
        "emp_name",
        req.body.values.emp_name,
        "email",
        req.body.values.email,
        "ccode",
        req.body.values.ccode,
        "mob",
        req.body.values.mob,
        "location",
        req.body.values.location,
        "designation",
        req.body.values.designation,
        "department",
        req.body.values.department,
        "join_date",
        req.body.values.join_date,
        "total_days",
        req.body.values.total_days,
        "working_days",
        req.body.values.working_days,
        "worked_days",
        req.body.values.worked_days,
        "weekly_off",
        req.body.values.weekly_off,
        "holidays",
        req.body.values.holidays,
        "full_days",
        req.body.values.full_days,
        "half_day",
        req.body.values.half_day,
        "forget_to_logout",
        req.body.values.forget_to_logout,
        "absent_days",
        req.body.values.absent_days,
        "med_leave",
        req.body.values.med_leave,
        "paid_leave",
        req.body.values.paid_leave,
        "bank_name",
        req.body.values.bank_name,
        "ac_no",
        req.body.values.ac_no,
        "pf_no",
        req.body.values.pf_no,
        "pan_no",
        req.body.values.pan_no,
        "hra",
        req.body.values.hra,
        "medical_allowance",
        req.body.values.medical_allowance,
        "travel_allowance",
        req.body.values.travel_allowance,
        "special_allowance",
        req.body.values.special_allowance,
        "incentive",
        req.body.values.incentive,
        "profession_tax",
        req.body.values.profession_tax,
        "pf_amount",
        req.body.values.pf_amount,
        "other_deduction",
        req.body.values.other_deduction,
        "gross_earnings",
        req.body.values.gross_earnings,
        "total_deductions",
        req.body.values.total_deductions,
        "net_pay_amount",
        req.body.values.net_pay_amount,
        "net_pay_words",
        req.body.values.net_pay_words,
        "other_details",
        req.body.values.other_details,
        "tds",
        req.body.values.tds,
        "ESIC",
        req.body.values.ESIC,
        "late_mark",
        req.body.values.late_mark,
        "r_email",
        req.body.values.r_email,
        "health_issue",
        req.body.values.health_issue,
        "religion",
        req.body.values.religion,
        "gender",
        req.body.values.gender,
        "mstatus",
        req.body.values.mstatus,
        "dob",
        req.body.values.dob,
        "aadhar_no",
        req.body.values.aadhar_no,
        "bank_branch",
        req.body.values.bank_branch,
        "ac_name",
        req.body.values.ac_name,
        "ifsc_code",
        req.body.values.ifsc_code,
        "basic_salary",
        req.body.values.basic_salary,
        "loss_of_pay",
        req.body.values.loss_of_pay,
        id,
      ],
      (err, result) => {
        if (err) {
          res.status(500).json({ message: "Error updating payslip" });
          console.log(err);
          return; // Add return statement to prevent further execution
        }
        res.json({
          data: result,
        });
        connection.release();
      }
    );
  });
});

PaySlipRouter.post("/delete-pay-slip-by-id", (req, res) => {
  // const { id } = req.params;
  // console.log(id);
  pool.getConnection((err, connection) => {
    if (err) {
      res
        .status(500)
        .json({ message: "Internal server couldn't connect with database" });
      console.log(err);
      return; // Add return statement to prevent further execution
    }

    const query = "DELETE FROM crm_payslip WHERE ?? IN (?);";

    connection.query(query, ["ps_id", req.body.ps_id], (err, result) => {
      if (err) {
        res.status(500).json({ message: "Error Deleting payslip" });
        console.log(err);
        return; // Add return statement to prevent further execution
      }
      res.json({
        data: result,
      });
      connection.release();
    });
  });
});

module.exports = PaySlipRouter;
