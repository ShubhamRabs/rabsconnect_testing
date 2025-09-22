import React, { useMemo, useEffect, useState } from "react";
import Axios from "../../../setting/axios";
import dayjs from "dayjs";
import Cookies from "js-cookie";

// Static column configuration
const staticLeadColumn = [
  { Header: "Lead Name", accessor: "lname", visible: true },
  { Header: "Lead Date", accessor: "l_date", visible: true },
  { Header: "Follow Up Date", accessor: "followup_dt", visible: true },
  { Header: "Project Name", accessor: "pname", visible: true },
  { Header: "Service Type", accessor: "service_type", visible: true },
  { Header: "Mobile Number", accessor: "mobile", visible: true },
  { Header: "Lead Id", accessor: "l_id", visible: true },
  { Header: "Source", accessor: "source", visible: true },
  { Header: "Comments", accessor: "comments", visible: true },
  { Header: "City", accessor: "city", visible: true },
  { Header: "Alternate Mobile", accessor: "s_mob", visible: true },
  { Header: "FB Form Name", accessor: "form_name", visible: true },
  { Header: "Email Id", accessor: "p_email", visible: true },
  { Header: "Locality", accessor: "locality", visible: true },
  { Header: "Assing User", accessor: "assign_users", visible: true },
  { Header: "Lead Status", accessor: "latest_status", visible: true },
  { Header: "Lead Priority", accessor: "lead_priority", visible: true },
  { Header: "Buyer Type", accessor: "buyer_type", visible: true },
  { Header: "Investment Type", accessor: "investment_type", visible: true },
  { Header: "Post Handover", accessor: "post_handover", visible: true },
  { Header: "Handover Year", accessor: "handover_year", visible: true },
];

// Custom cell renderers
const createDateCell = ({ value }) =>
  value && value !== "0000-00-00 00:00:00"
    ? dayjs(value).format("D MMM YYYY - hh:mm A")
    : "Imported Data";

const phoneCell = ({ value }) =>
  value ? (value.toString().includes("+") ? value : "+" + value) : "";

const statusCell = ({ value, row }) =>
  value && row.original ? (
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
      {" by " + (row.original.latest_username || "")}
    </>
  ) : (
    ""
  );

const followupDateCell = ({ value }) =>
  value && value !== "0000-00-00 00:00:00"
    ? dayjs(value).format("D MMM YYYY - hh:mm A")
    : "";

// Cell renderer mapping
const cellRenderers = {
  create_dt: createDateCell,
  mobile: phoneCell,
  s_mob: phoneCell,
  latest_status: statusCell,
  followup_dt: followupDateCell,
};

const useTotalLeadColumn = () => {
  const [fetchedColumns, setFetchedColumns] = useState(null);
  const role = Cookies.get("role");
  const currentScreen = localStorage.getItem("currScreen");

  // Fetch column configuration once
  useEffect(() => {
    const fetchColumnConfig = async () => {
      try {
        const userId = Cookies.get("u_id");
        const response = await Axios.get("/lead" + userId);

        if (response.data && response.data[userId] && response.data.master) {
          const visibleHeaders = response.data[userId].visible;
          const masterHeaders = response.data.master;

          const sortedVisibleColumns = visibleHeaders
            .map((accessor) => {
              const header = masterHeaders.find((h) => h.accessor === accessor);
              if (!header) return null;

              return {
                Header: header.header,
                accessor: header.accessor,
                visible: true,
                Cell: cellRenderers[header.accessor] || (({ value }) => value),
              };
            })
            .filter(Boolean);

          setFetchedColumns(sortedVisibleColumns);
        } else {
          setFetchedColumns(staticLeadColumn);
        }
      } catch (error) {
        console.error("Error fetching column config:", error);
        setFetchedColumns(staticLeadColumn);
      }
    };

    fetchColumnConfig();
  }, []);

  // Memoize the final column configuration
  const columns = useMemo(() => {
    const baseColumns = fetchedColumns || staticLeadColumn;

    if (!Array.isArray(baseColumns)) {
      console.warn("Columns is not an array. Using static columns.");
      return staticLeadColumn;
    }

    // Filter visible columns
    const visibleColumns = baseColumns.filter((col) => col.visible);

    // Role-based adjustments
    if (role === "Tele Caller") {
      return visibleColumns.map((col) => ({
        ...col,
        accessor: col.accessor === "l_id" ? "assignlead_id" : col.accessor,
      }));
    }

    return visibleColumns;
  }, [fetchedColumns, role, currentScreen]);

  return columns;
};

export default useTotalLeadColumn;
