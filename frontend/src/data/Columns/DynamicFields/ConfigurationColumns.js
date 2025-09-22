import dayjs from "dayjs";

export const ConfigurationColumns = [
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
    Header: "Type",
    accessor: "configuration_type",
    canSort: true, // Allow sorting on this column
  },
  {
    Header: "Configuration",
    accessor: "configuration",
    canSort: true, // Allow sorting on this column
  },
];
