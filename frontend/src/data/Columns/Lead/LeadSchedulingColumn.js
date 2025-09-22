import dayjs from "dayjs";

export const LeadSchedulingColumn = [
  {
    Header: "Posted On",
    accessor: "create_dt",
    Cell: ({ value }) =>
      value !== "0000-00-00 00:00:00"
        ? dayjs(value).format("D MMM YYYY - hh:mm A")
        : "",
    // Cell: ({ value }) => dayjs(value).format("D MMM YYYY - hh:mm A"),
  },
  {
    Header: "Created By",
    accessor: "createdby",
  },
  {
    Header: "Schedule Type",
    accessor: "schedule_type",
  },
  {
    Header: "Assign To",
    accessor: "assignto",
  },
  {
    Header: "Lead Date From",
    accessor: "ldate_from",
    Cell: ({ value }) =>
      value !== "0000-00-00"
        ? dayjs(value).format("D MMM YYYY")
        : "",
    // Cell: ({ value }) => dayjs(value).format("D MMM YYYY - hh:mm A"),
  },
  {
    Header: "Lead Date To",
    accessor: "ldate_to",
    Cell: ({ value }) =>
      value !== "0000-00-00"
        ? dayjs(value).format("D MMM YYYY")
        : "",
    // Cell: ({ value }) => dayjs(value).format("D MMM YYYY - hh:mm A"),
  },
  {
    Header: "Source",
    accessor: "source",
  },
  {
    Header: "Service_Type",
    accessor: "service_type",
  },
  {
    Header: "Project Name",
    accessor: "pname",
  },
  {
    Header: "Form Name",
    accessor: "form_name",
  },
  {
    Header: "city",
    accessor: "city",
  },
  {
    Header: "locality",
    accessor: "locality",
  },
  // {
  //   Header: "No. Of. Leads",
  //   accessor: "no_of_leads",
  // },
  {
    Header: "Status",
    accessor: "status",
  },
];
