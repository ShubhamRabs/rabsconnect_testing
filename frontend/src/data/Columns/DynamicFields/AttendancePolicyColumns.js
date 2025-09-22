import dayjs from "dayjs";

export const AttendancePolicyColumns = [
  {
    Header: "Create On.",
    accessor: "create_dt",
    Cell: ({ value }) => dayjs(value).format("D MMM YYYY - hh:mm"),
    canSort: true,
  },
  {
    Header: "Updated On.",
    accessor: "update_dt",
    Cell: ({ value }) => dayjs(value).format("D MMM YYYY - hh:mm"),
    canSort: true,
  },
  {
    Header: "Type",
    accessor: "title",
    // canSort: true,
  },
  {
    Header: "Policy",
    accessor: "policy",
    // canSort: true,
    Cell: ({ row, value }) => {
      const { original } = row;
      if (original.title === "Late Mark") {
        return value.includes(",") ? (
          <>
            <p
              className="d-flex justify-content-evenly align-items-center"
              style={{
                borderBottom: "ridge 1px #dddddd",
                marginBottom: "0.5rem",
              }}
            >
              <span>In Time: {value.split(",")[0]} Minutes</span>
            </p>
            <p
              className="d-flex justify-content-evenly align-items-center"
              style={{
                borderBottom: "ridge 1px #dddddd",
                marginBottom: "0.5rem",
              }}
            >
              <span>Out Time: {value.split(",")[1]} Minutes</span>
            </p>
          </>
        ) : (
          <span>{value}</span>
        );
      } else if (original.title === "Public Holidays") {
        return value.split(",").map((date, index) => {
          const dates = dayjs(date, "MM/DD/YYYY");
          const formattedDate = dates.format("DD MMM YYYY");
          const holidayTitle = date.split(":")[1];
          return (
            <p
              key={index}
              className="d-flex justify-content-evenly align-items-center"
              style={{
                borderBottom: "ridge 1px #dddddd",
                marginBottom: "0.5rem",
              }}
            >
              <span>{formattedDate} - {holidayTitle}</span>
            </p>
          );
        });
      } else if (original.title === "Absent") {
        return <span>If Total Time is less than Half Day or the user is Absent.</span>
      }
      else if(original.title === "Salary Month"){
        if(value === "1" || value ==="01"){
          return <span>{value}-30</span>
        }
        return <span>Start Date {value} - End Date{Number(value)-1}</span>
      }
      return <span>{value && !isNaN(value) ? `${value} hours` : value}</span>;
    },
  },
  {
    Header: "Status",
    accessor: "status",
  },
  {
    Header: "Color",
    accessor: "color",
    Cell: ({ row, value }) => (
      value ? <div
        style={{
          background: value,
          color: value !== "yellow" ? "#fff" : "#000",
        }}
        className="px-2 py-1 rounded shadow-lg"
      >
        {value}
      </div>: <span>Not Applicable</span>
    ),
    // canSort: true,
  },
];
