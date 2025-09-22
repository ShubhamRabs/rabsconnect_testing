import dayjs from "dayjs";

export const LeadPriorityColumns = [
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
    Header: "Lead Priority",
    accessor: "lead_priority",
    canSort: true,
  },
];
