export const PayslipColumns = [
  {
    Header: "u id",
    accessor: "u_id",
  },
  {
    Header: "sal frm date",
    accessor: "sal_frm_date",
  },
  {
    Header: "sal to date",
    accessor: "sal_to_date",
  },
  {
    Header: "emp name",
    accessor: "emp_name",
  },
  {
    Header: "email",
    accessor: "email",
  },
  {
    Header: "ccode",
    accessor: "ccode",
  },
  {
    Header: "mob",
    accessor: "mob",
  },
  {
    Header: "location",
    accessor: "location",
  },
  {
    Header: "designation",
    accessor: "designation",
  },
  {
    Header: "department",
    accessor: "department",
  },
  {
    Header: "join date",
    accessor: "join_date",
  },
  {
    Header: "total days",
    accessor: "total_days",
  },
  {
    Header: "working days",
    accessor: "working_days",
  },
  {
    Header: "worked days",
    accessor: "worked_days",
  },
  {
    Header: "weekly off",
    accessor: "weekly_off",
  },
  {
    Header: "holidays",
    accessor: "holidays",
  },
  {
    Header: "full days",
    accessor: "full_days",
  },
  {
    Header: "half day",
    accessor: "half_day",
  },
  {
    Header: "forget to logout",
    accessor: "forget_to_logout",
  },
  {
    Header: "absent days",
    accessor: "absent_days",
  },
  {
    Header: "med leave",
    accessor: "med_leave",
  },
  {
    Header: "paid leave",
    accessor: "paid_leave",
  },
  {
    Header: "bank name",
    accessor: "bank_name",
  },
  {
    Header: "ac no",
    accessor: "ac_no",
  },
  {
    Header: "pf no",
    accessor: "pf_no",
  },
  {
    Header: "pan no",
    accessor: "pan_no",
  },
  {
    Header: "hra",
    accessor: "hra",
  },
  {
    Header: "medical allowance",
    accessor: "medical_allowance",
  },
  {
    Header: "travel allowance",
    accessor: "travel_allowance",
  },
  {
    Header: "special allowance",
    accessor: "special_allowance",
  },
  {
    Header: "incentive",
    accessor: "incentive",
  },
  {
    Header: "profession tax",
    accessor: "profession_tax",
  },
  {
    Header: "pf amount",
    accessor: "pf_amount",
  },
  {
    Header: "other deduction",
    accessor: "other_deduction",
  },
  {
    Header: "tds",
    accessor: "tds",
  },
  {
    Header: "ESIC",
    accessor: "ESIC",
  },
  {
    Header: "late mark",
    accessor: "late_mark",
  },
  {
    Header: "r email",
    accessor: "r_email",
  },
  {
    Header: "health issue",
    accessor: "health_issue",
  },
  {
    Header: "religion",
    accessor: "religion",
  },
  {
    Header: "gender",
    accessor: "gender",
  },
  {
    Header: "mstatus",
    accessor: "mstatus",
  },
  {
    Header: "dob",
    accessor: "dob",
  },
  {
    Header: "aadhar no",
    accessor: "aadhar_no",
  },
  {
    Header: "bank branch",
    accessor: "bank_branch",
  },
  {
    Header: "ac name",
    accessor: "ac_name",
  },
  {
    Header: "ifsc code",
    accessor: "ifsc_code",
  },
  {
    Header: "basic salary",
    accessor: "basic_salary",
  },
  {
    Header: "loss of pay",
    accessor: "loss_of_pay",
  },
  {
    Header: "gross earnings",
    accessor: "gross_earnings",
  },

  {
    Header: "total deductions",
    accessor: "total_deductions",
  },
  {
    Header: "net pay amount",
    accessor: "net_pay_amount",
  },
  {
    Header: "net pay words",
    accessor: "net_pay_words",
  },
];

export const PayslipActionPrevilege = {
  Delete: true,
  Edit: true,
  View: true,
};

export const daysInMonth = (month, year) => {
  return new Date(year, month, 0).getDate();
};
