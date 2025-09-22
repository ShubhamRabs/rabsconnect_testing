import * as Yup from "yup";

const isValidPAN = (panNumber) => {
  const panRegex = /[A-Z]{5}[0-9]{4}[A-Z]{1}/;
  return panRegex.test(panNumber);
};

export const PaySlipFormSchema = Yup.object().shape({
  sal_year: Yup.string().required("Year is required"),
  sal_month: Yup.string().required("Month is required"),
  emp_name: Yup.string().required("EMP name is required"),
  worked_days: Yup.string().required("Days Worked is required"),
  join_date: Yup.string().required("Join Days is required"),
  designation: Yup.string().required("Designation is required"),
  location: Yup.string().required("Locality is required"),
  // p_mob: Yup.string().required("Mobile No is required"),
  // email: Yup.string().required("Email is required"),
  p_name: Yup.string().required("Name is required"),
  // ccode: Yup.string().required("Mobile no is required"),
  bank_name: Yup.string().required("Bank name is required"),
  pf_no: Yup.string().required("PF no is required"),
  pan_no: Yup.string().required("PAN Number is required").test('pan-validation', 'Invalid PAN Number', (value) => isValidPAN(value)),
  ac_no: Yup.string().required("Account no is required"),
  basic_pay: Yup.string().required("Bacic pay is required"),
  hra: Yup.string().required("h r a is required"),
  medical_allowance: Yup.string().required(" Medical allowance is required"),
  travel_allowance: Yup.string().required("Travel is required"),
  special_allowance: Yup.string().required("Special is required"),
  profession_tax: Yup.string().required("Professional tax is required"),
  pf_amount: Yup.string().required("Provident fund is required"),
  other_deduction: Yup.string().required("Other deduction is required"),
  gross_earnings: Yup.string().required("Gross earnings is required"),
  net_pay_amount: Yup.string().required("Net pay is required"),
  total_deductions: Yup.string().required("Total deductions is required"),
  net_pay_words: Yup.string().required("Net pay in word is required"),
  tds: Yup.string().required("TDS is required"),
  incentive: Yup.string().required("Net pay in word is required")
});
