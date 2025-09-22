import * as Yup from "yup";

export const SourceSchema = Yup.object({
  source: Yup.string()
    // .matches(
    //   "^^[a-zA-Z0-9 ]+$",
    //   "Source is Contained Only Alphabets, Number and Space"
    // )
    .required("Source is required"),
});
export const PlanSchema = Yup.object({
  payment_plan: Yup.string()
    // .matches(
    //   "^^[a-zA-Z0-9 ]+$",
    //   "Source is Contained Only Alphabets, Number and Space"
    // )
    .required("Plan is required"),
});
export const CandidatesSourceSchema = Yup.object({
  candidate_source: Yup.string()
    // .matches(
    //   "^^[a-zA-Z0-9 ]+$",
    //   "Candidates Source is Contained Only Alphabets, Number and Space"
    // )
    .required("Candidates Source is required"),
});

// Location validation schema
export const LocationFieldSchema = Yup.object({
  location_name: Yup.string().required("Location Name is required"),
});

export const HandoverYearSchema = Yup.object({
  handover_year: Yup.number()
    .required("Handover Year is required")
    .min(1000, "Year must be a valid 4-digit year")
    .max(9999, "Year must be a valid 4-digit year"),
});

export const LeadPrioritySchema = Yup.object().shape({
  lead_priority: Yup.string()
    .min(3, "Lead priority must be at least 3 characters")
    .required("Lead priority is required"),
});

export const LeadStatusSchema = Yup.object({
  lead_status: Yup.string()
    .matches(
      "^^[a-zA-Z0-9 ]+$",
      "Lead Status is Contained Only Alphabets, Number and Space"
    )
    .required("Lead Status is required"),
});

export const ProjectNameSchema = Yup.object({
  pname: Yup.string()
    // .matches(
    //   "^^[a-zA-Z ]+$",
    //   "Project Name is Contained Only Alphabets and Space"
    // )
    .required("Project Name is required"),
  bname: Yup.string()
    // .matches(
    //   "^^[a-zA-Z ]+$",
    //   "Project Name is Contained Only Alphabets and Space"
    // )
    .required("Builder Name is required"),
});

export const ConfigurationSchema = Yup.object({
  configuration_type: Yup.string().required("Property type is required"),
  configuration: Yup.string()
    .matches(
      /^[a-zA-Z0-9 .]+$/,
      "Configuration can contain only alphabets, numbers, spaces, and periods"
    )
    .required("Configuration is required"),
});

export const CandidatesStatusSchema = Yup.object({
  candidate_status: Yup.string()
    .matches(
      "^^[a-zA-Z0-9 ]+$",
      "Candidate Status is Contained Only Alphabets, Number and Space"
    )
    .required("Candidate Status is required"),
});

export const CandidatesPostSchema = Yup.object({
  candidate_post: Yup.string()
    .matches(
      "^^[a-zA-Z0-9 ]+$",
      "Candidate Post is Contained Only Alphabets, Number and Space"
    )
    .required("Candidate Post is required"),
});

export const LoanStatusSchema = Yup.object({
  loan_status: Yup.string()
    .matches(
      "^^[a-zA-Z0-9 ]+$",
      "Loan Status is Contained Only Alphabets, Number and Space"
    )
    .required("Loan Status is required"),
});

export const LoanSalesManagerSchema = Yup.object({
  bank_name: Yup.string()
    .matches(
      "^^[a-zA-Z0-9 ]+$",
      "Bank Name is Contained Only Alphabets, Number and Space"
    )
    .required("Bank Name is required"),
  sales_manager: Yup.string()
    .matches(
      "^^[a-zA-Z0-9 ]+$",
      "Sales Manager is Contained Only Alphabets, Number and Space"
    )
    .required("Sales Manager is required"),
});

export const AttendancePolicySchema = Yup.object().shape({
  status: Yup.string().required("Status is Required"),
  start_date: Yup.number()
    .required("Start Date is required")
    .max(31, "Date should be within 30 days")
    .min(1, "Date should be within 30 days"),
  policy: Yup.string().when("title", {
    is: (val) => ["Full Day", "Half Day", "Weekly OFF"].includes(val),
    then: (schema) => {
      return Yup.array().when("$title", (title, schema) => {
        return Array.isArray(title) && title[0] === "Weekly OFF"
          ? Yup.mixed()
              .test(
                "required",
                "Weekly OFF Policy is Required",
                function (value) {
                  const isString = typeof value === "string";
                  const isArray = Array.isArray(value);

                  if (
                    (isString && value.trim() !== "") ||
                    (isArray && value.length > 0)
                  ) {
                    return true;
                  } else {
                    return false; // Fail validation
                  }
                }
              )
              .test(
                "maxTwoValues",
                "Maximum 2 days are allowed",
                function (value) {
                  // Check if value is an array and its length is greater than 2
                  return !(Array.isArray(value) && value.length > 2);
                }
              )
          : Yup.number()
              .required("Hourly Policy is Required")
              .max(24, "Maximum Hourly Policy is 24");
      });
    },
  }),
  latemarkintime: Yup.string().when("title", {
    is: "Late Mark",
    then: (schema) =>
      Yup.number()
        .required("In Time Late Mark (in minutes) is Required")
        .typeError("Please enter a valid number of minutes"),
  }),
  latemarkouttime: Yup.string().when("title", {
    is: "Late Mark",
    then: (schema) =>
      Yup.number()
        .required("Out Time Late Mark (in minutes) is Required")
        .typeError("Please enter a valid number of minutes"),
  }),
});

const panRegExp = /^[A-Z]{5}[0-9]{4}[A-Z]$/;

const panSchema = Yup.string()
  .matches(panRegExp, "Invalid PAN card number")
  .test("isValidPan", "Invalid PAN card number", (value) => {
    if (!value) return false; // Return false if the value is empty
    const charValues = {
      A: 10,
      B: 11,
      C: 12,
      D: 13,
      E: 14,
      F: 15,
      G: 16,
      H: 17,
      I: 18,
      J: 19,
      K: 20,
      L: 21,
      M: 22,
      N: 23,
      O: 24,
      P: 25,
      Q: 26,
      R: 27,
      S: 28,
      T: 29,
      U: 30,
      V: 31,
      W: 32,
      X: 33,
      Y: 34,
      Z: 35,
    };
    const checkDigit = charValues[value[9]];
    console.log("checkDigit", value[9]);
    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += 26 ** (9 - i) * (value.charCodeAt(i) - "A".charCodeAt(0));
    }
    return !(sum % 11 === (11 - checkDigit) % 10);
  });

export const BanknameSchema = Yup.object({
  bank_name: Yup.string()
    // .matches(
    //   "^^[a-zA-Z0-9 ]+$",
    //   "Bank Name is Contained Only Alphabets, Number and Space"
    // )
    .required("Bank Name is required"),
  acc_num: Yup.string().required("Account Number is required"),
  branch_name: Yup.string().required("Branch Name is required"),
  ifsc_code: Yup.string().required("IFSC Code is required"),
  pan_num: panSchema.required("PAN card number is required"),
  gst_status: Yup.string().required("GST Status is required"),
  gst_code: Yup.string().when("gst_status", {
    is: "yes",
    then: (schema) => {
      console.log("hello");
      return Yup.string().required("GST Code is required");
    },
  }),
});
