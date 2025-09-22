import dayjs from "dayjs";

export const BankNameColumns = [
  {
    Header: "Create On.",
    accessor: "create_dt",
    Cell: ({ value }) => dayjs(value).format("D MMM YYYY - hh:mm A"),
    canSort: true,
  },
  {
    Header: "Updated On.",
    accessor: "update_dt",
    Cell: ({ value }) => dayjs(value).format("D MMM YYYY - hh:mm A"),
    canSort: true,
  },
  {
    Header: "Bank Name",
    accessor: "bank_name",
    canSort: true,
  },
  {
    Header: "Acoount Number",
    accessor: "acc_num",
    canSort: true,
  },
  {
    Header: "Branch Name",
    accessor: "branch_name",
    canSort: true,
  },
  {
    Header: "IFSC Code",
    accessor: "ifsc_code",
    canSort: true,
  },
  {
    Header: "PAN Number",
    accessor: "pan_num",
    canSort: true,
  },
  {
    Header: "GST Status",
    accessor: "gst_status",
    canSort: true,
  },
  {
    Header: "GST Number",
    accessor: "gst_code",
    canSort: true,
  },
];