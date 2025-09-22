import React, { useState, useMemo } from "react";
import { useTable, usePagination, useSortBy } from "react-table";
import { useMui, useSetting } from "../../hooks/Hooks";
import "./CustomDataTable.css";
import ReactWhatsapp from "react-whatsapp";
import Cookies from "js-cookie";
import { CustomModal } from "../../components/CustomModal/CustomModal";

// Author: Shubham Sonkar
// Date: 20-09-2023
/**
 * @component CustomDataTable
 * @description A customizable data table component with features like pagination, row selection, and various actions.
 * @param {Object} props - Component props.
 * @param {Array} props.columns - An array of column configurations for the table.
 * @param {Array} props.data - The data to be displayed in the table.
 * @param {number} props.page - The current page number.
 * @param {number} props.pageSize - The number of rows to display per page.
 * @param {Function} props.onPageChange - Callback function when the page changes.
 * @param {Function} props.onPageSizeChange - Callback function when the page size changes.
 * @param {number} props.totalCount - The total number of records.
 * @param {Function} props.SetSelectedRows - Callback function to set selected rows.
 * @param {Array} props.selectedRows - An array of selected rows.
 * @param {Function} props.handleQuickEdit - Callback function for quick edit action.
 * @param {Function} props.handleView - Callback function for view action.
 * @param {Function} props.handleViewCRM - Callback function for view CRM action.
 * @param {Function} props.handleEdit - Callback function for edit action.
 * @param {boolean} props.ShowCall - Boolean to show/hide the call action.
 * @param {Function} props.handleDelete - Callback function for delete action.
 * @param {boolean} props.ShowWhatsapp - Boolean to show/hide the WhatsApp action.
 * @param {boolean} props.ShowEmail - Boolean to show/hide the email action.
 */
function CustomDataTable({
  columns,
  data,
  page,
  pageSize,
  onPageChange,
  onPageSizeChange,
  totalCount,
  SetSelectedRows,
  selectedRows,
  handleQuickEdit,
  handleView,
  handleViewCRM,
  handleEdit,
  showAction,
  showCheckBox,
  ShowCall,
  handleDelete,
  ShowWhatsapp,
  ShowEmail,
  mode,
}) {
  // Author: Shubham Sonkar
  // Date: 20-09-2023
  // Import various components and hooks from external sources
  const {
    Tooltip,
    IconButton,
    Checkbox,
    AutoFixHighIcon,
    EditIcon,
    WhatsAppIcon,
    VisibilityOutlinedIcon,
    DeleteOutlineRoundedIcon,
    EmailOutlinedIcon,
    AccountBoxOutlinedIcon,
    CallOutlinedIcon,
    PictureAsPdfIcon,
  } = useMui();

  const { globalData } = useSetting();

  const [ShowModal, setShowModal] = useState(false);
  const [ModalValues, setModalValues] = useState(null);

  // Author: Shubham Sonkar
  // Date: 20-09-2023
  // State to manage row selection

  const [isAllSelected, setisAllSelected] = useState(false);

  // Author: Shubham Sonkar
  // Date: 20-09-2023
  // Function to handle row selection
  const toggleRowSelection = (row) => {
    const rowId = row.original;
    SetSelectedRows(rowId);
  };
  // Author: Shubham Sonkar
  // Date: 20-09-2023
  // Function to toggle select all
  const toggleSelectAll = () => {
    setisAllSelected(!isAllSelected);
    // Select or deselect all rows based on the isAllSelected state
    if (!isAllSelected) {
      // Select all rows when the "Select All" checkbox is checked
      const allRowIds = data.map((row) => row); // Replace 'id' with the actual unique identifier for your rows
      SetSelectedRows(allRowIds);
    } else {
      // Deselect all rows when the "Select All" checkbox is unchecked
      SetSelectedRows([]);
    }
  };

  // Author: Shubham Sonkar
  // Date: 20-09-2023
  // Use react-table and usePagination hooks to create a paginated table
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page: tablePage,
    rows,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    state: { pageIndex, pageSize: currentPageSize },
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: page - 1, pageSize },
      manualPagination: true,
      pageCount: Math.ceil(totalCount / pageSize),
    },
    useSortBy, // Add useSortBy hook
    usePagination // Add usePagination hook
  );

  // Author: Shubham Sonkar
  // Date: 20-09-2023
  // Function to handle page changes
  const handlePageClick = (pageIndex) => {
    gotoPage(pageIndex);
    onPageChange(pageIndex + 1);
  };

  // Author: Shubham Sonkar
  // Date: 20-09-2023
  // Function to handle page size changes
  const handlePageSizeChange = (event) => {
    const newSize = parseInt(event.target.value);
    onPageSizeChange(newSize);
  };

  // Author: Shubham Sonkar
  // Date: 20-09-2023
  // Calculate the starting row number for the current page
  const startRow = pageIndex * pageSize + 1;

  // Author: Shubham Sonkar
  // Date: 20-09-2023
  // Function to generate serial numbers for rows
  const generateSrNo = (rowIndex) => {
    return startRow + rowIndex;
  };

  return (
    <>
      {/*
      Author: Shubham Sonkar
      Date: 20-09-2023
      Container for the data table */}
      <div
        className="custom-data-table"
        style={{ height: "auto" }}
        // style={{ height: rows.length > 10 ? "30.6vw" : "auto" }}
      >
        {/* 
      Author: Shubham Sonkar
      Date: 20-09-2023
      The HTML table element */}
        <table {...getTableProps()} className="table">
          {/* Table header */}
          <thead>
            <tr>
              {/*
              Author: Shubham Sonkar
              Date: 20-09-2023
              Checkbox for selecting all rows */}
              {showCheckBox !== false ? (
                <th>
                  <Checkbox
                    checked={isAllSelected}
                    onChange={toggleSelectAll}
                  />
                </th>
              ) : null}
              {/*
              Author: Shubham Sonkar
              Date: 20-09-2023
              Column for action buttons */}
              {Cookies.get("previous_user") === undefined ? (
                <>{showAction !== false ? <th>Action</th> : null}</>
              ) : null}
              {/*
              Author: Shubham Sonkar
              Date: 20-09-2023
              Column for serial numbers */}
              <th>Sr. No.</th>
              {/*
              Author: Shubham Sonkar
              Date: 20-09-2023
              Dynamic column headers */}
              {headerGroups[0].headers.map((column) => (
                <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                  {column.render("Header")}
                  <span>
                    {column.isSorted
                      ? column.isSortedDesc
                        ? " 🔽"
                        : " 🔼"
                      : ""}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          {/*
                      Author: Shubham Sonkar
                      Date: 20-09-2023
                      Table body */}
          <tbody {...getTableBodyProps()}>
            {/*
                      Author: Shubham Sonkar
                      Date: 20-09-2023
                      Render data rows */}
            {tablePage.length !== 0 ? (
              tablePage.map((row, rowIndex) => {
                prepareRow(row);
                const isSelected = row.original
                  ? selectedRows.includes(row.original)
                  : false;
                return (
                  <tr
                    {...row.getRowProps()}
                    className={isSelected ? "selected" : ""}
                  >
                    {showCheckBox !== false ? (
                      <td>
                        {/*
                      Author: Shubham Sonkar
                      Date: 20-09-2023
                      Checkbox for individual row selection */}
                        <Checkbox
                          checked={isAllSelected ? true : isSelected}
                          onChange={() => toggleRowSelection(row)}
                        />
                      </td>
                    ) : null}
                    {Cookies.get("previous_user") === undefined ? (
                      <>
                        {showAction !== false ? (
                          <td>
                            {/*
                      Author: Shubham Sonkar
                      Date: 20-09-2023
                      Conditional rendering of action buttons */}
                            {handleViewCRM && (
                              <Tooltip
                                title="View CRM"
                                onClick={() => handleViewCRM(row.original)}
                              >
                                <IconButton sx={{ padding: "5px 8px" }}>
                                  <AccountBoxOutlinedIcon
                                    sx={{ fontSize: "18px" }}
                                  />
                                </IconButton>
                              </Tooltip>
                            )}
                            {handleQuickEdit && (
                              <Tooltip
                                title="Quick Edit"
                                onClick={() => handleQuickEdit(row.original)}
                              >
                                <IconButton sx={{ padding: "5px 8px" }}>
                                  <AutoFixHighIcon sx={{ fontSize: "18px" }} />
                                </IconButton>
                              </Tooltip>
                            )}
                            {handleEdit && (
                              <Tooltip
                                title="Edit"
                                onClick={() => handleEdit(row.original)}
                              >
                                <IconButton sx={{ padding: "5px 8px" }}>
                                  <EditIcon sx={{ fontSize: "18px" }} />
                                </IconButton>
                              </Tooltip>
                            )}
                            {handleView && (
                              <Tooltip
                                title="View"
                                onClick={() => handleView(row.original)}
                              >
                                <IconButton sx={{ padding: "5px 8px" }}>
                                  <VisibilityOutlinedIcon
                                    sx={{ fontSize: "18px" }}
                                  />
                                </IconButton>
                              </Tooltip>
                            )}
                            {mode === "Candidates" && row.original.c_pdf && (
                              <Tooltip
                                title="View Candidate CV"
                                onClick={() => {
                                  setModalValues(row.original.c_pdf);
                                  setShowModal(true);
                                }}
                              >
                                <IconButton sx={{ padding: "5px 8px" }}>
                                  {}
                                  <PictureAsPdfIcon sx={{ fontSize: "18px" }} />
                                </IconButton>
                              </Tooltip>
                            )}
                            {localStorage.getItem("currScreen") ===
                            "userlead" ? null : (
                              <br></br>
                            )}
                            {/*
                      Author: Shubham Sonkar
                      Date: 20-09-2023
                      Conditional rendering of other action buttons */}
                            {ShowCall && (
                              <Tooltip
                                title="Call"
                                component="a"
                                href={
                                  mode === "Candidates"
                                    ? "tel:+" +
                                      row.original.c_ccode +
                                      row.original.c_mob
                                    : "tel:+" +
                                      row.original.p_ccode +
                                      row.original.p_mob
                                }
                              >
                                <IconButton sx={{ padding: "5px 8px" }}>
                                  <CallOutlinedIcon sx={{ fontSize: "18px" }} />
                                </IconButton>
                              </Tooltip>
                            )}
                            {ShowWhatsapp && (
                              <ReactWhatsapp
                                number={
                                  mode === "Candidates"
                                    ? "+" +
                                      row.original.c_ccode +
                                      row.original.c_mob
                                    : "+" +
                                      row.original.p_ccode +
                                      row.original.p_mob
                                }
                                message="Hello,"
                                style={{
                                  outline: "none",
                                  border: "none",
                                  background: "transparent",
                                  cursor: "pointer",
                                  color: "rgba(0, 0, 0, 0.54)",
                                  paddingLeft: "0px",
                                  paddingRight: "0px",
                                }}
                              >
                                <Tooltip
                                  title="WhatsApp"
                                  onClick={() => ShowWhatsapp(row.original)}
                                >
                                  <IconButton component="span">
                                    <WhatsAppIcon sx={{ fontSize: "18px" }} />
                                  </IconButton>
                                </Tooltip>
                              </ReactWhatsapp>
                            )}
                            {ShowEmail && (
                              <Tooltip
                                title="Email"
                                target="_blank"
                                href={"mailto:" + row.original.p_email}
                              >
                                <IconButton sx={{ padding: "5px 8px" }}>
                                  <EmailOutlinedIcon
                                    sx={{ fontSize: "18px" }}
                                  />
                                </IconButton>
                              </Tooltip>
                            )}

                            {handleDelete && (
                              <Tooltip
                                title="Delete"
                                onClick={() => handleDelete(row.original.id)}
                              >
                                <IconButton sx={{ padding: "5px 8px" }}>
                                  <DeleteOutlineRoundedIcon
                                    sx={{ fontSize: "22px" }}
                                  />
                                </IconButton>
                              </Tooltip>
                            )}
                          </td>
                        ) : null}
                      </>
                    ) : null}
                    {/*
                      Author: Shubham Sonkar
                      Date: 20-09-2023
                      Display the serial number for each row */}
                    <td>{generateSrNo(rowIndex)}</td>
                    {/*
              Author: Shubham Sonkar
              Date: 20-09-2023
              Render table cell data */}
                    {row.cells.map((cell, i) => {
                      return (
                        <React.Fragment key={i}>
                          {/*
              Author: Shubham Sonkar
              Date: 20-09-2023
              Special rendering for "Lead Status" column */}
                          {(cell.column.Header === "Lead Status" &&
                            row.cells[7].value) ||
                          cell.column.Header === "Admin Lead Status" ? (
                            <td
                              {...cell.getCellProps()}
                              style={{
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              <Tooltip
                                title={cell.render("Cell")}
                                sx={{ py: 0 }}
                              >
                                <span
                                  style={{
                                    backgroundColor: row.original.color,
                                    padding: "5px 8px",
                                    color: "#ffffff",
                                    overflowY: "hidden",
                                    overflowX: "scroll",
                                  }}
                                >
                                  {cell.render("Cell")}
                                </span>
                              </Tooltip>
                            </td>
                          ) : (
                            <td {...cell.getCellProps()} className="table-cell">
                              {/*
                              Author: Shubham Sonkar
                              Date: 20-09-2023
                              Regular rendering for other columns */}
                              {
                                <Tooltip
                                  title={cell.render("Cell")}
                                  sx={{ py: 0 }}
                                >
                                  <span>{cell.render("Cell")}</span>
                                </Tooltip>
                              }
                            </td>
                          )}
                        </React.Fragment>
                      );
                    })}
                  </tr>
                );
              })
            ) : (
              <tr>
                {/*
              Author: Shubham Sonkar
              Date: 20-09-2023
              Display a message if there is no data */}
                <td colSpan={columns.length + 2} className="no-data-message">
                  No Data Found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {/*
              Author: Shubham Sonkar
              Date: 20-09-2023
              Pagination and data count section */}
      <div className="table-footer">
        <div className="data-count">
          Displaying {tablePage.length} of {totalCount} records
        </div>
        {/*
              Author: Shubham Sonkar
              Date: 20-09-2023
              Pagination controls */}
        <div className="pagination">
          <span className="icon-button-grp">
            <IconButton
              onClick={() => handlePageClick(0)}
              disabled={!canPreviousPage}
            >
              {"<<"}
            </IconButton>{" "}
            <IconButton
              onClick={() => handlePageClick(pageIndex - 1)}
              disabled={!canPreviousPage}
            >
              {"<"}
            </IconButton>{" "}
            <IconButton
              onClick={() => handlePageClick(pageIndex + 1)}
              disabled={!canNextPage}
            >
              {">"}
            </IconButton>{" "}
            <IconButton
              onClick={() => handlePageClick(pageCount - 1)}
              disabled={!canNextPage}
            >
              {">>"}
            </IconButton>{" "}
            <span>
              Page{" "}
              <strong>
                {pageIndex + 1} of {pageOptions.length}
              </strong>{" "}
            </span>
          </span>
          <span>| Go to page: </span>
          {/*
              Author: Shubham Sonkar
              Date: 20-09-2023
              Dropdown to change the number of rows per page */}
          <select
            value={currentPageSize}
            onChange={handlePageSizeChange}
            className="page-select"
          >
            {[10, 20, 30, 40, 50, 100, 200, 300, 400, 500].map(
              (pageSizeOption) => (
                <option key={pageSizeOption} value={pageSizeOption}>
                  Show {pageSizeOption}
                </option>
              )
            )}
          </select>
        </div>
      </div>
      <CustomModal
        show={ShowModal}
        onHide={() => setShowModal(false)}
        ModalTitle="Preview Candidate CV"
        ModalBody={
          <iframe
            height="500px"
            width="100%"
            title="Candidate CV"
            src={globalData.API_URL + "/uploads/candidate_cv/" + ModalValues}
          >
            {ModalValues}
          </iframe>
        }
      />
    </>
  );
}

export default CustomDataTable;
