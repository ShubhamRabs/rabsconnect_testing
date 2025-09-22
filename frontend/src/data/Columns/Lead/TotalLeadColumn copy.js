import dayjs from "dayjs";
import Cookies from "js-cookie";


const commonColumns = [
  {
    Header: "Lead Id",
    accessor: "l_id",
  },
  {
    Header: "Lead Date",
    accessor: "create_dt",
    Cell: ({ value }) =>
      value !== "0000-00-00 00:00:00"
        ? dayjs(value).format("D MMM YYYY - hh:mm A")
        : "Imported Data",
  },
  {
    Header: "Lead Name",
    accessor: "lname",
  },
  {
    Header: "Mobile Number",
    accessor: "mobile",
    Cell: ({ value }) =>
      value ? (value?.toString().includes("+") ? value : "+" + value) : "",
  },
  {
    Header: "Alternate Mobile",
    accessor: "s_mob",
    Cell: ({ value }) =>
      value ? (value?.toString().includes("+") ? value : "+" + value) : "",
  },
  {
    Header: "Email Id",
    accessor: "p_email",
  },
  {
    Header: "Project Name",
    accessor: "pname",
  },
  {
    Header: "FB Form Name",
    accessor: "form_name",
  },
  {
    Header: "Lead Status",
    accessor: "latest_status",
    Cell: ({ value, row }) =>
      value && (
        <>
          <span
            style={{
              backgroundColor: row.original.latest_status_color,
              color: "white",
              fontSize: "0.8rem",
              padding: "0.2rem 0.5rem",
            }}
          >
            {value}
          </span>
          {" by " + row.original.latest_username}
        </>
      ),
  },
  {
    Header: "Follow Up Date",
    accessor: "followup_dt",
    Cell: ({ value }) =>
      value !== "0000-00-00 00:00:00"
        ? dayjs(value).format("D MMM YYYY - hh:mm A")
        : "",
  },
  {
    Header: "Comments",
    accessor: "comments",
  },
  {
    Header: "Source",
    accessor: "source",
  },
  {
    Header: "Service Type",
    accessor: "service_type",
  },
  {
    Header: "City",
    accessor: "city",
  },
  {
    Header: "Locality",
    accessor: "locality",
  },
  {
    Header: "Assigned User",
    accessor: "assign_users",
  },
];

const additionalColumnsForAdminUserLead = [
  {
    Header: "Lead Status",
    accessor: "status",
  },
];

const additionalColumnsForTeleCaller = [
  {
    Header: "Lead Id",
    accessor: "assignlead_id",
  },
];

const role = Cookies.get("role");
const currentScreen = localStorage.getItem("currScreen");

let TotalLeadColumn = [...commonColumns];

if (role === "Master" || role === "Admin") {
  if (currentScreen === "userlead") {
    TotalLeadColumn = [...commonColumns, ...additionalColumnsForAdminUserLead];
  }
} else if (role === "Tele Caller") {
  TotalLeadColumn = [
    ...commonColumns.map((col) => ({
      ...col,
      // accessor: col.accessor.replace("l_id", "assignlead_id"), // Adjust for "Tele Caller"
    })),
    ...additionalColumnsForTeleCaller,
  ];
} else {
  TotalLeadColumn = [...commonColumns];
}



export { TotalLeadColumn };
