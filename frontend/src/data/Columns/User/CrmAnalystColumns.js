import dayjs from "dayjs";

export const CRMAnalystColumns = [
  {
    Header: "User ID",
    accessor: "u_id",
  },
  {
    Header: "Created Date",
    accessor: "create_dt",
    Cell: ({ value }) => dayjs(value).format("D MMM YYYY - hh:mm A"),
  },
  {
    Header: "Username",
    accessor: "username",
  },
  {
    Header: "Type",
    accessor: "utype",
  },
  {
    Header: "Role",
    accessor: "urole",
  },
];
