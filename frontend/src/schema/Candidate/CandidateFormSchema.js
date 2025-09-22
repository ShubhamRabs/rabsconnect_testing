import * as Yup from "yup";

export const CandidateFormSchema = Yup.object().shape({
  c_name: Yup.string().required("Candidate Name is required"),
  c_email: Yup.string().required("Email Id. is required"),
  c_mob: Yup.string().required("Mobile No. is required"),
  c_source: Yup.string().required("Candidate Source is required"),
  c_position: Yup.string().required("Candidate Position is required"),
  c_status: Yup.string().required("Candidate Status is required"),
});
