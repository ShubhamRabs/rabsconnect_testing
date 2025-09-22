import dayjs from "dayjs";
// import Cookies from "js-cookie";

export let LoanDetailsColumn = [];

// if (Cookies.get("role") === "HR Head") {
  LoanDetailsColumn = [
    {
      Header: "Date",
      accessor: "create_dt",
      Cell: ({ value }) =>
        value !== "0000-00-00 00:00:00"
          ? dayjs(value).format("D MMM YYYY - hh:mm A")
          : "Imported Data",
      // Cell: ({ value }) => dayjs(value).format("D MMM YYYY - hh:mm A"),
    },
    {
      Header: "Posted By",
      accessor: "createdby",
    },
    {
      Header: "Client Name",
      accessor: "client_name",
    },
    {
      Header: "Mobile Number",
      accessor: "mobile",
    },
    {
      Header: "Project Name",
      accessor: "project_name",
    },
    {
      Header: "Booking Date",
      accessor: "booking_date",
      Cell: ({ value }) =>
      value !== "0000-00-00"
        ? dayjs(value).format("D MMM YYYY")
        : "",
    },
    {
      Header: "Unit Details",
      accessor: "unit_details",
    },
    {
      Header: "Bank Name",
      accessor: "bank_name",
    },
    {
      Header: "Sales Manager",
      accessor: "sales_manager",
    },
    {
      Header: "Status",
      accessor: "status",
    },
    {
      Header: "Sanction Amount",
      accessor: "sanction_amount",
    },
  ];

  // if (Cookies.get("role").includes("HR Head")) {
  //   LoanDetailsColumn.push(...[]);
  // }
// } else {
  // LoanDetailsColumn = [
  //   {
  //     Header: "Date",
  //     accessor: "create_dt",
  //     Cell: ({ value }) =>
  //       value !== "0000-00-00 00:00:00"
  //         ? dayjs(value).format("D MMM YYYY - hh:mm A")
  //         : "Imported Candidate",
  //   },
  //   {
  //     Header: "Candidate Name",
  //     accessor: "c_name",
  //   },
  //   {
  //     Header: "Mobile Number",
  //     accessor: "c_mob",
  //   },
  //   {
  //     Header: "Alt Mobile Number",
  //     accessor: "c_alt_mob",
  //   },
  //   {
  //     Header: "Email Id",
  //     accessor: "c_email",
  //   },
  //   {
  //     Header: "Source",
  //     accessor: "c_source",
  //   },
  //   {
  //     Header: "Position",
  //     accessor: "c_position",
  //   },
  //   {
  //     Header: "Candidate Status",
  //     accessor: "c_status",
  //   },
  //   {
  //     Header: "Follow Up Date",
  //     accessor: "followup_dt",
  //     Cell: ({ value }) =>
  //       value !== "0000-00-00 00:00:00"
  //         ? dayjs(value).format("D MMM YYYY - hh:mm A")
  //         : "",
  //   },
  //   {
  //     Header: "Comments",
  //     accessor: "comments",
  //   },
  //   {
  //     Header: "City",
  //     accessor: "city",
  //   },
  //   {
  //     Header: "Locality",
  //     accessor: "locality",
  //   },
  // ];
// }
