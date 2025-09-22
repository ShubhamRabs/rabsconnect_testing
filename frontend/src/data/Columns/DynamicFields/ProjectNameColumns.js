import dayjs from "dayjs";

export const ProjectNameColumns = [
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
    Header: "Project Name",
    accessor: "pname",
    canSort: true, // Allow sorting on this column
  },
  {
    Header: "Builder Name",
    accessor: "bname",
    canSort: true, // Allow sorting on this column
  },
];
