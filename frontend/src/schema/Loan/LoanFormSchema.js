import * as Yup from "yup";

export const LoanFormSchema = Yup.object().shape({
  l_client_name: Yup.string().required("Client Name is required"),
  // l_email: Yup.string().required("Email Id. is required"),
  l_mob: Yup.string().required("Mobile No. is required"),
  l_project_name: Yup.string().required("Project is required"),
  l_booking_date: Yup.string().required("Booking Date is required"),
  l_unit_details: Yup.string().required("Unit Details is required"),
  l_bank_name: Yup.string().required("Bank Name is required"),
  l_sales_manager: Yup.string().required("Sales Manager is required"),
  l_status: Yup.string().required("Status is required"),
  l_sanction_amount: Yup.string().required("Sanction Amount is required"),
});
