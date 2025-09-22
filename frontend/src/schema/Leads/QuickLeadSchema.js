import * as Yup from "yup";

export const QuickLeadSchema = Yup.object({
  status_type: Yup.string().required("Leads Status is required"),
  follow_up: Yup.string().required("Follow Up is required"),
  followup_dt: Yup.string().when("follow_up", {
    is: "Yes",
    then: (schema) => schema.required("Follow Up Date is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  comments: Yup.string(),
});
