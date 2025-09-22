import * as Yup from "yup";

export const BrokerFormSchema = Yup.object().shape({
  b_name: Yup.string().required("Broker Name is required"),
  // b_email: Yup.string().required("Email Id. is required"),
  // b_mob: Yup.string().required("Mobile No. is required"),
  b_company: Yup.string().required("Company is required"),
  b_rera_no: Yup.string().required("RERA No. is required"),
  b_email: Yup.string()
    .email("Invalid email")
    .required("Email Id. is required")
    .test("contains-at", "Email must contain '@'", (value) =>
      value ? value.includes("@") : false
    ),
  // b_country: Yup.string().required("Country is required"),
  // b_state: Yup.string().required("State is required"),
  // b_city: Yup.string().required("City is required"),
  // b_locality: Yup.string().required("Locality is required"),
  brk_location: Yup.string().required("Location is required"),
  address: Yup.string().required("Address is required"),
});


export const EditBrokerFormSchema = Yup.object().shape({
  b_name: Yup.string().required("Broker Name is required"),
  b_company: Yup.string().required("Company is required"),
  b_rera_no: Yup.string().required("RERA No. is required"),
  b_email: Yup.string()
    .email("Invalid email")
    .required("Email Id. is required")
    .test("contains-at", "Email must contain '@'", (value) =>
      value ? value.includes("@") : false
    ),
  brk_location: Yup.string().required("Location is required"),
  address: Yup.string().required("Address is required"),
  b_remark: Yup.string(),
  document: Yup.mixed().nullable(), 
});