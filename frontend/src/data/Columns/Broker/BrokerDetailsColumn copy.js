import dayjs from "dayjs";
// import Cookies from "js-cookie";

export let BrokerDetailsColumn = [];

if (Cookies.get("role") === "HR Head") {
  BrokerDetailsColumn = [
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
      Header: "Brk_Id",
      accessor: "brk_id",
    },
    {
      Header: "No. of leads",
      accessor: "totalCount",
    },
    {
      Header: "Broker Name",
      accessor: "name",
    },
    {
      Header: "Mobile Number",
      accessor: "mobile",
    },
    {
      Header: "Company Name",
      accessor: "company",
    },
    {
      Header: "RERA No.",
      accessor: "rera_no",
    },
    {
      Header: "Location",
      accessor: "brk_location",
    },
    // {
    //   Header: "Country",
    //   accessor: "country",
    // },
    // {
    //   Header: "State",
    //   accessor: "state",
    // },
    // {
    //   Header: "City",
    //   accessor: "city",
    // },
    // {
    //   Header: "Locality",
    //   accessor: "locality",
    // },
    {
      Header: "Address",
      accessor: "address",
    },
    {
      Header: "Remark",
      accessor: "remark",
    },
    {
      Header: "Status",
      accessor: "status",
    },
  ];

  // if (Cookies.get("role").includes("HR Head")) {
  //   BrokerDetailsColumn.push(...[]);
  // }
// } else {
  // BrokerDetailsColumn = [
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
   }
