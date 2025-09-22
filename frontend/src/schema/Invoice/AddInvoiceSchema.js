// schema/invoice

import * as Yup from "yup";

export const AddInvoiceSchema = Yup.object().shape({
  // invoice_id: Yup.string().required("Invoice id is required"),
  due_date: Yup.string().required("Invoice Due Date is required"),
  inv_to: Yup.string().required("Invoice To is required"),
  bank_name: Yup.string().required("Invoice Bank is required"),
  payment_status: Yup.string().required("Need to select Payment Status"),
});