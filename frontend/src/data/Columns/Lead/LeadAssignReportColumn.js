import dayjs from "dayjs";

export const LeadAssignReportColumn = [
  {
    Header: "Posted On",
    accessor: "create_dt", 
    Cell: ({ value }) =>
    value !== "0000-00-00 00:00:00"
      ? dayjs(value).format("D MMM YYYY - hh:mm A")
      : "",
      // Cell: ({ value }) => dayjs(value).format("D MMM YYYY - hh:mm A"),
  },
  // {
  //   Header: "Lead Assign Report Id",
  //   accessor: "lah_id",
  // },
  {
    Header: "Lead ID",
    accessor: "l_id",
  },
  {
    Header: "Lead Req ID",
    accessor: "lreq_id",
  },
  {
    Header: "Lead Scheduler Id",
    accessor: "lsche_id",
  },
  {
    Header: "Assign Type",
    accessor: "assign_type",
  },
  {
    Header: "Assign By",
    accessor: "assignby",
  },
  {
    Header: "Assign To",
    accessor: "assignto",
  },
];
