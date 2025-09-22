// import * as Yup from "yup";
// import Cookies from "js-cookie";

// import { GetAllUserProfileDetails } from "../../hooks/Other/UseProfileHook";

// export const LeadFormSchema = Yup.object().shape({
//   source_type: Yup.string().typeError().required(),
//   lemail: Yup.string().required("Lead Email Id is required"),
// });

// export const ProfileSchema = Yup.object({
//   fname: Yup.string()
//     .matches(
//       "^^[a-zA-Z0-9 ]+$",
//       "First Name is Contained Only Alphabets, Number and Space"
//     )
//     .required("First Name is required"),
//   // mname: Yup.string()
//   //   .matches(
//   //     "^^[a-zA-Z0-9 ]+$",
//   //     "Middle Name is Contained Only Alphabets, Number and Space"
//   //   )
//   //   .required("Middle Name is required"),
//   lname: Yup.string()
//     .matches(
//       "^^[a-zA-Z0-9 ]+$",
//       "Last Name is Contained Only Alphabets, Number and Space"
//     )
//     .required("Last Name is required"),
//   // r_email: Yup.string().email("Email is invalid").required("Email is required").test(
//   //   "email-exists",
//   //   "Email already exists please try another Email",
//   //   async function (value) {
//   //     try {
//   //       const AllProfiles = await GetAllUserProfileDetails();
//   //       if (AllProfiles.data?.length > 0) {
//   //         let profiles = AllProfiles?.data;
//   //         return !profiles.some(
//   //           (profile) => {
//   //             if (profile.u_id.toString() !== Cookies.get("u_id").toString()) {
//   //               return profile.r_email.toLowerCase() === value.toLowerCase()
//   //             }
//   //             return false;
//   //           }
//   //         );
//   //       }
//   //     } catch (error) {
//   //       console.error("Error checking username:", error);
//   //       return true; // Assume username exists if there's an error
//   //     }
//   //   }
//   // ),
//   p_email: Yup.string().email("Email is invalid").required("Email is required"),
//   r_email: Yup.string()
//     .email("Email is invalid")
//     .required("Company Email is required"),
// });


// import * as Yup from "yup";

// export const LeadFormSchema = Yup.object().shape({
//   source_type: Yup.string().typeError().required(),
//   lemail: Yup.string().required("Lead Email Id is required"),
// });


// export const ProfileSchema = Yup.object({
//   aadhar_no: Yup.string()
//     .matches(/^\d{12}$/, "Aadhar number must be 12 digits")
//     .required("Aadhar number is required"),
  
//   ac_name: Yup.string()
//     .matches(/^[a-zA-Z\s]+$/, "Account Name must contain only alphabets")
//     .required("Account Name is required"),

//   account_no: Yup.string()
//     .matches(/^\d+$/, "Account number must be numeric")
//     .required("Account number is required"),
  
//   bank_branch: Yup.string().required("Bank Branch is required"),

//   bank_name: Yup.string().required("Bank Name is required"),

//   dob: Yup.date().required("Date of Birth is required"),

//   fname: Yup.string()
//     .matches(/^[a-zA-Z0-9 ]+$/, "First Name must contain only alphabets, numbers, and spaces")
//     .required("First Name is required"),
  
//   gender: Yup.string().required("Gender is required"),

//   health: Yup.string().required("Health status is required"),

//   health_issue: Yup.string()
//     .nullable() // Optional field, so we use nullable
//     .matches(/^[a-zA-Z ]*$/, "Health Issue must contain only alphabets and spaces"),

//   ifsc_code: Yup.string().required("IFSC Code is required"),
  
//   lname: Yup.string()
//     .matches(/^[a-zA-Z0-9 ]+$/, "Last Name must contain only alphabets, numbers, and spaces")
//     .required("Last Name is required"),

//   location: Yup.string().required("Location is required"),

//   mname: Yup.string()
//     .matches(/^[a-zA-Z0-9 ]*$/, "Middle Name must contain only alphabets, numbers, and spaces"),

//   mstatus: Yup.string().required("Marital Status is required"),

//   join_date: Yup.date().required("Joining Date is required"),

//   p_ccode: Yup.string().required("Country Code is required"),

//   p_email: Yup.string()
//     .email("Personal Email is invalid")
//     .required("Personal Email is required"),

//   p_mob: Yup.string()
//     .matches(/^\d{10}$/, "Mobile number must be 10 digits")
//     .required("Mobile Number is required"),

//   pan_no: Yup.string()
//     .matches(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, "PAN number is invalid")
//     .required("PAN number is required"),

//   pf_no: Yup.string()
//     .nullable()
//     .matches(/^[A-Za-z0-9]*$/, "PF number must contain only alphanumeric characters"),

//   profile_image: Yup.string().nullable(),

//   r_email: Yup.string()
//     .email("Company Email is invalid")
//     .required("Company Email is required"),

//   religion: Yup.string().required("Religion is required"),

//   u_id: Yup.string().required("User ID is required"),
// });



import * as Yup from "yup";

export const ProfileSchema = Yup.object({
  aadhar_no: Yup.string()
    .matches(/^\d{12}$/, "Aadhar number must be 12 digits")
    .required("Aadhar number is required"),
  
  ac_name: Yup.string()
    .matches(/^[a-zA-Z\s]+$/, "Account Name must contain only alphabets")
    .required("Account Name is required"),

  account_no: Yup.string()
    .matches(/^\d+$/, "Account number must be numeric")
    .required("Account number is required"),
  
  bank_branch: Yup.string().required("Bank Branch is required"),

  bank_name: Yup.string().required("Bank Name is required"),

  dob: Yup.date().required("Date of Birth is required"),

  fname: Yup.string()
    .matches(/^[a-zA-Z0-9 ]+$/, "First Name must contain only alphabets, numbers, and spaces")
    .required("First Name is required"),
  
  gender: Yup.string().required("Gender is required"),

  health: Yup.string().required("Health status is required"),

  ifsc_code: Yup.string().required("IFSC Code is required"),
  
  lname: Yup.string().required("Last Name is required"),

  location: Yup.string().required("Location is required"),

  mstatus: Yup.string().required("Marital Status is required"),

  join_date: Yup.date().required("Joining Date is required"),

  p_ccode: Yup.string().required("Country Code is required"),

  p_email: Yup.string()
    .email("Personal Email is invalid")
    .required("Personal Email is required"),

  p_mob: Yup.string()
    .matches(/^\d{10}$/, "Mobile number must be 10 digits")
    .required("Mobile Number is required"),

  pan_no: Yup.string().required("PAN number is required"),

  r_email: Yup.string()
    .email("Company Email is invalid")
    .required("Company Email is required"),

  religion: Yup.string().required("Religion is required"),

  u_id: Yup.string().required("User ID is required"),
});
