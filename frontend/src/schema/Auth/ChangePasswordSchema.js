import * as Yup from "yup";

const ChangePasswordSchema = Yup.object({
  current_password: Yup.string().required("Current Password is required"),
  new_password: Yup.string().required("New Password is required"),
  confirm_password: Yup.string()
    .oneOf([Yup.ref("new_password"), null], "New Password must match")
    .required("Confirm Password is required"),
});

export default ChangePasswordSchema;
