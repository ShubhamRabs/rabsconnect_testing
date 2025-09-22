import * as Yup from "yup";

export const AssignLeadFormSchema = Yup.object({
  urole: Yup.string().required("User Role is required"),
  // lstatus: Yup.string().required("Lead status is required"),
  users: Yup.array().of(Yup.string()).min(1, "At least one username is required"),
});