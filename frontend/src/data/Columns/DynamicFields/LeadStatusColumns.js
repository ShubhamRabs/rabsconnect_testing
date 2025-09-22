import dayjs from "dayjs";

export const LeadStatusColumns = [
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
    Header: "Lead Status",
    accessor: "status",
    canSort: true, // Allow sorting on this column
  },
  {
    Header: "Color",
    accessor: "color",
    Cell: ({ row, value }) => (
      <div
        style={{
          background: value,
          color: value !== "yellow" ? "#fff" : "#000",
        }}
        className="px-2 py-1 rounded shadow-lg"
      >
        {value}
      </div>
    ),
    canSort: true, // Allow sorting on this column
  },
];
