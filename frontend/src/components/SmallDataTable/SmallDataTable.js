import React, { useState } from "react";
import {
  useTable,
  usePagination,
  useGlobalFilter,
  useSortBy,
} from "react-table";
import "./SmallDataTable.css";
import { useMui } from "../../hooks/Hooks";
import Cookies from "js-cookie";

// SmallDataTable component for displaying a paginated and searchable table
function SmallDataTable({
  columns,
  data,
  handleView,
  handleViewCRM,
  handleLocationBtn,
  handleEdit,
  handleDelete,
  handleStatistics,
  actionModulePrevilege,
}) {
  const {
    Tooltip,
    IconButton,
    EditIcon,
    DeleteOutlineRoundedIcon,
    SwapVertIcon,
    VisibilityOutlinedIcon,
    AccountBoxOutlinedIcon,
    NotListedLocationOutlinedIcon,
    AnalyticsOutlinedIcon,
  } = useMui();

  // Use react-table hooks for table functionality
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    state: { pageIndex, pageSize, globalFilter },
    gotoPage,
    previousPage,
    nextPage,
    canPreviousPage,
    canNextPage,
    setPageSize,
    setGlobalFilter,
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0, pageSize: 5 },
    },
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  // State to track the selected row
  const [selectedRowId, setSelectedRowId] = useState(null);

  // Calculate start and end row numbers for the current page
  const pageCount = Math.ceil(data.length / pageSize);
  const startRow = pageIndex * pageSize + 1;
  const endRow = Math.min((pageIndex + 1) * pageSize, data.length);

  const TableActionPrevilege = {
    View: actionModulePrevilege?.hasOwnProperty("View")
      ? actionModulePrevilege["View"]
      : Cookies.get("role") === "Master",

    Edit: actionModulePrevilege?.hasOwnProperty("Edit")
      ? actionModulePrevilege["Edit"]
      : Cookies.get("role") === "Master",
    Delete: actionModulePrevilege?.hasOwnProperty("Delete")
      ? actionModulePrevilege["Delete"]
      : Cookies.get("role") === "Master",
    "View Crm": actionModulePrevilege?.hasOwnProperty("View Crm")
      ? actionModulePrevilege["View Crm"]
      : Cookies.get("role") === "Master",
    "View Statistics": actionModulePrevilege?.hasOwnProperty("View Statistics")
      ? actionModulePrevilege["View Statistics"]
      : Cookies.get("role") === "Master",
    "View Location": actionModulePrevilege?.hasOwnProperty("View Location")
      ? actionModulePrevilege["View Location"]
      : Cookies.get("role") === "Master",
  };

  let tableAction = false;

  for (let key in TableActionPrevilege) {
    if (key === "View") {
      continue;
    }
    if (TableActionPrevilege[key]) {
      tableAction = true;
      break;
    }
  }

  // Generate serial number for a given row index
  const generateSrNo = (rowIndex) => {
    return startRow + rowIndex;
  };

  return (
    <div className="table-container">
      {/* Table size and search controls */}
      <div className="d-md-flex d-sm-inline-flex align-items-center justify-content-between mb-4">
        <select
          value={pageSize}
          className="custom-select"
          onChange={(e) => {
            setPageSize(Number(e.target.value));
            gotoPage(0);
          }}
        >
          {[5, 10, 20].map((pageSizeOption) => (
            <option key={pageSizeOption} value={pageSizeOption}>
              Show {pageSizeOption}
            </option>
          ))}
        </select>
        <div className="search-container">
          <input
            type="text"
            placeholder="Search..."
            className="custom-input"
            value={globalFilter || ""}
            onChange={(e) => setGlobalFilter(e.target.value)}
          />
        </div>
      </div>
      {/* Table body */}
      {data.length === 0 ? (
        <div className="no-data-message">No data found.</div>
      ) : (
        <>
          <table {...getTableProps()} className="custom-table">
            <thead>
              {/* Table header */}
              {headerGroups.map((headerGroup) => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                  <th>Sr. No.</th>
                  {headerGroup.headers.map((column) => (
                    <th
                      {...column.getHeaderProps(column.getSortByToggleProps())}
                    >
                      {/* Header with sorting icon */}
                      <div className="d-flex align-items-center justify-content-between">
                        <span>{column.render("Header")}</span>
                        <SwapVertIcon />
                      </div>
                    </th>
                  ))}
                  {tableAction && <th>Action</th>}
                </tr>
              ))}
            </thead>
            {/* Table body */}
            <tbody {...getTableBodyProps()}>
              {page.length !== 0 ? (
                // Rows with data
                page.map((row, rowIndex) => {
                  prepareRow(row);
                  return (
                    <tr
                      {...row.getRowProps()}
                      className={row.id === selectedRowId ? "selected" : ""}
                    >
                      <td>{generateSrNo(rowIndex)}</td>
                      {/* Cells in a row */}
                      {row.cells.map((cell) => (
                        <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                      ))}
                      {/* Action column */}
                      {tableAction && (
                        <td>
                          {/* CRM view button */}
                          <div className="d-flex justify-content-center">
                            {TableActionPrevilege["View Crm"] &&
                              handleViewCRM &&
                              (Cookies.get("username") !==
                                row.original.username ? (
                                <Tooltip
                                  title="View CRM"
                                  onClick={() => handleViewCRM(row.original)}
                                >
                                  <IconButton>
                                    <AccountBoxOutlinedIcon />
                                  </IconButton>
                                </Tooltip>
                              ) : null)}
                            {/* Location button */}
                            {TableActionPrevilege["View Location"] &&
                              handleLocationBtn &&
                              (Cookies.get("username") !==
                                row.original.username ? (
                                <Tooltip
                                  title="User Location"
                                  onClick={() =>
                                    handleLocationBtn(row.original.u_id)
                                  }
                                >
                                  <IconButton>
                                    <NotListedLocationOutlinedIcon />
                                  </IconButton>
                                </Tooltip>
                              ) : null)}
                            {/* View button */}
                            {TableActionPrevilege.View && handleView && (
                              <Tooltip
                                title="View"
                                onClick={() => handleView(row.original)}
                              >
                                <IconButton>
                                  <VisibilityOutlinedIcon />
                                </IconButton>
                              </Tooltip>
                            )}
                            {/* Edit and delete buttons (Admin/Master/HR Head only) */}
                            {TableActionPrevilege.Edit && handleEdit && (
                              <Tooltip
                                title="Edit"
                                onClick={() => handleEdit(row.original)}
                              >
                                <IconButton>
                                  <EditIcon sx={{ fontSize: "18px" }} />
                                </IconButton>
                              </Tooltip>
                            )}
                            {TableActionPrevilege.Delete && handleDelete && (
                              <Tooltip
                                title="Delete"
                                onClick={() =>
                                  localStorage.getItem("currScreen") ===
                                    "leadstatus"
                                    ? handleDelete(row.original)
                                    : handleDelete(row.original.id)
                                }
                              >
                                <IconButton>
                                  <DeleteOutlineRoundedIcon
                                    sx={{ fontSize: "22px" }}
                                  />
                                </IconButton>
                              </Tooltip>
                            )}
                            {TableActionPrevilege["View Statistics"] &&
                              handleStatistics && (
                                <Tooltip
                                  title="View Statistics"
                                  onClick={() => handleStatistics(row.original)}
                                >
                                  <IconButton>
                                    <AnalyticsOutlinedIcon
                                      sx={{ fontSize: "22px" }}
                                    />
                                  </IconButton>
                                </Tooltip>
                              )}
                          </div>
                        </td>
                      )}
                    </tr>
                  );
                })
              ) : (
                // No data message
                <tr>
                  <td colSpan={columns.length + 2} className="no-data-message">
                    No Data Found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          {/* Pagination controls */}
          <div className="d-lg-flex d-sm-inline-flex align-items-center justify-content-between">
            <span>
              Showing {startRow} to {endRow} of {data.length} entries
            </span>
            <div className="pagination">
              <IconButton
                onClick={() => gotoPage(0)}
                disabled={!canPreviousPage}
              >
                {"<<"}
              </IconButton>
              <IconButton
                onClick={() => previousPage()}
                disabled={!canPreviousPage}
              >
                {"<"}
              </IconButton>
              <span className="mx-3">
                {" "}
                Page {pageIndex + 1} of {pageCount}
              </span>
              <IconButton onClick={() => nextPage()} disabled={!canNextPage}>
                {">"}
              </IconButton>
              <IconButton
                onClick={() => gotoPage(pageCount - 1)}
                disabled={!canNextPage}
              >
                {">>"}
              </IconButton>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default SmallDataTable;
