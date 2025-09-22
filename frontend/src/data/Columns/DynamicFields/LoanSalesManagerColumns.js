import dayjs from "dayjs";

export const LoanSalesManagerColumns = [
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
    canSort: true, // Allow sorting on this column
  },
  {
    Header: "Sales Manager",
    accessor: "sales_manager",
    canSort: true, // Allow sorting on this column
  },
];
