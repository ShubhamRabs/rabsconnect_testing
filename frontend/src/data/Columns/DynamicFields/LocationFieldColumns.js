import dayjs from "dayjs";

export const LocationFieldColumns = [
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
    Header: "Location Name",
    accessor: "location_name",
    canSort: true,
  },
];
