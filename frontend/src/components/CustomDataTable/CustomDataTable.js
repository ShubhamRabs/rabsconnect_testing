import React, { useState, useMemo } from "react";
import { useTable, usePagination, useSortBy } from "react-table";
import PropTypes from "prop-types";
import { useMui, useSetting } from "../../hooks/Hooks";
import "./CustomDataTable.css";
import ReactWhatsapp from "react-whatsapp";
import Cookies from "js-cookie";
import { CustomModal } from "../../components/CustomModal/CustomModal";
import { useConvertFreshLead } from "../../hooks/Leads/UseLeadsHook";

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
 * @param {Function} props.handleViewBrokerLead - Callback function for view broker lead action.
 * @param {Function} props.handleView - Callback function for view action.
 * @param {Function} props.handleViewCRM - Callback function for view CRM action.
 * @param {Function} props.handleEdit - Callback function for edit action.
 * @param {boolean} props.ShowCall - Boolean to show/hide the call action.
 * @param {Function} props.handleDelete - Callback function for delete action.
 * @param {boolean} props.ShowWhatsapp - Boolean to show/hide the WhatsApp action.
 * @param {boolean} props.ShowEmail - Boolean to show/hide the email action.
 * @param {Array} props.actionModulePrevilege - Boolean to show/hide the action module privilege.
 * @param {boolean} props.hideToolTip - Boolean to show/hide the tooltip.
 * @param {string} props.weeklyOffColor - String for backgroundColor of the Table Row.
 * @param {string} props.publicHolidaysColor - String for backgroundColor of the Table Row.
 * @param {boolean} props.fullsize - Boolean to control table height.
 */
function CustomDataTable({
  columns,
  data = [], // Default to empty array to prevent undefined
  page,
  pageSize,
  onPageChange,
  onPageSizeChange,
  totalCount,
  SetSelectedRows,
  selectedRows,
  handleQuickEdit,
  handleViewBrokerLead,
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
  actionModulePrevilege,
  hideToolTip = false,
  weeklyOffColor = "",
  publicHolidaysColor = "",
  fullsize,
}) {
  const {
    Tooltip,
    IconButton,
    Checkbox,
    AutoFixHighIcon,
    PreviewIcon,
    EditIcon,
    WhatsAppIcon,
    VisibilityOutlinedIcon,
    DeleteOutlineRoundedIcon,
    EmailOutlinedIcon,
    AccountBoxOutlinedIcon,
    CallOutlinedIcon,
    PictureAsPdfIcon,
  } = useMui();
  const TableActionPrevilege = {
    View: actionModulePrevilege?.hasOwnProperty("View")
      ? actionModulePrevilege["View"]
      : Cookies.get("role") === "Master",
    Edit: actionModulePrevilege?.hasOwnProperty("Edit")
      ? actionModulePrevilege["Edit"]
      : Cookies.get("role") === "Master",
    "Quick Edit": actionModulePrevilege?.hasOwnProperty("Quick Edit")
      ? actionModulePrevilege["Quick Edit"]
      : Cookies.get("role") === "Master",
    "View Broker Lead": actionModulePrevilege?.hasOwnProperty(
      "View Broker Lead"
    )
      ? actionModulePrevilege["View Broker Lead"]
      : Cookies.get("role") === "Master",
    Call: actionModulePrevilege?.hasOwnProperty("Call")
      ? actionModulePrevilege["Call"]
      : Cookies.get("role") === "Master",
    WhatsApp: actionModulePrevilege?.hasOwnProperty("WhatsApp")
      ? actionModulePrevilege["WhatsApp"]
      : Cookies.get("role") === "Master",
    Email: actionModulePrevilege?.hasOwnProperty("Email")
      ? actionModulePrevilege["Email"]
      : Cookies.get("role") === "Master",
    "View Crm": actionModulePrevilege?.hasOwnProperty("View Crm")
      ? actionModulePrevilege["View Crm"]
      : Cookies.get("role") === "Master",
  };

  const TableCheckBoxActionPrevilege = {
    Delete: actionModulePrevilege?.hasOwnProperty("Delete")
      ? actionModulePrevilege["Delete"]
      : Cookies.get("role") === "Master",
    Assign: actionModulePrevilege?.hasOwnProperty("Assign")
      ? actionModulePrevilege["Assign"]
      : Cookies.get("role") === "Master",
    Export: actionModulePrevilege?.hasOwnProperty("Export")
      ? actionModulePrevilege["Export"]
      : Cookies.get("role") === "Master",
  };

  const getTableActionsValue = (obj) => {
    for (let key in obj) {
      if (obj[key]) {
        return true;
      }
    }
    return false;
  };

  let TableActions = getTableActionsValue(TableActionPrevilege);
  let TableCheckBoxActions = getTableActionsValue(TableCheckBoxActionPrevilege);

  const { globalData } = useSetting();

  const [ShowModal, setShowModal] = useState(false);
  const [ModalValues, setModalValues] = useState(null);
  const [isAllSelected, setisAllSelected] = useState(false);

  const [checked, setChecked] = React.useState(
    new Array(data.length).fill(false)
  );

  const handleChange = (index, row) => (event) => {
    const newChecked = [...checked];
    newChecked[index] = event.target.checked;
    setChecked(newChecked);
    const rowId = row.original;
    SetSelectedRows(rowId);
  };

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
    useSortBy,
    usePagination
  );

  const toggleSelectAll = () => {
    setisAllSelected(!isAllSelected);
    if (!isAllSelected) {
      const allRowIds = data.map((row) => row);
      SetSelectedRows(allRowIds);
      setChecked((prev) => prev.map(() => !prev[0]));
    } else {
      setChecked(new Array(data.length).fill(false));
      SetSelectedRows([]);
    }
  };

  const handlePageClick = (pageIndex) => {
    gotoPage(pageIndex);
    onPageChange(pageIndex + 1);
  };

  const handlePageSizeChange = (event) => {
    const newSize = parseInt(event.target.value);
    onPageSizeChange(newSize);
  };

  const startRow = pageIndex * pageSize + 1;

  const generateSrNo = (rowIndex) => {
    return startRow + rowIndex;
  };

  React.useEffect(() => {
    if (selectedRows.length === 0) {
      setChecked(new Array(data.length).fill(false));
    }
  }, [selectedRows, data]);

  const { mutate: ConvertFreshLeadMutation, isLoading } = useConvertFreshLead();

  const handleRowClick = (data) => {
    if (data.clicked === 0) {
      ConvertFreshLeadMutation(data.l_id);
    } else if (data.identity === "imported") {
      ConvertFreshLeadMutation({ l_id: data.l_id, imported: "true" });
    }
  };

  function hexToRGBA(hex, opacity) {
    hex = hex.replace("#", "");
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  }

  return (
    <>
      <div
        className="custom-data-table"
        style={
          fullsize
            ? { height: "auto" }
            : { height: rows.length > 10 ? "40vw" : "auto" }
        }
      >
        <table {...getTableProps()} className="table">
          <thead>
            <tr>
              {showCheckBox !== false && TableCheckBoxActions ? (
                <th>
                  <Checkbox
                    checked={
                      data.length === 0
                        ? false
                        : checked.every((value) => value)
                    }
                    indeterminate={checked.some((value) => value)}
                    onChange={toggleSelectAll}
                  />
                </th>
              ) : null}
              {showAction !== false && TableActions ? <th>Action</th> : null}
              <th>Sr. No.</th>
              {headerGroups[0].headers.map((column) => (
                <th
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                  className={`${
                    column.Header === "Login Time" ? "th-width-auto" : ""
                  }`}
                >
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
          <tbody {...getTableBodyProps()}>
            {tablePage && tablePage.length !== 0 ? (
              tablePage.map((row, rowIndex) => {
                prepareRow(row);
                const isSelected = row.original
                  ? selectedRows.includes(row.original)
                  : false;
                let rowColor = null;

                if (row.original.identity && row.original?.clicked === 1) {
                  rowColor = "#2A5EBF";
                } else if (row.original?.clicked === 0) {
                  rowColor = "rgb(212, 77, 140)";
                } else {
                  rowColor = "#0000008a";
                }

                return (
                  <tr
                    {...row.getRowProps()}
                    style={{ color: rowColor ? rowColor : "#0000008a" }}
                    className={(isSelected ? "selected" : "") + " lead-row"}
                  >
                    {showCheckBox !== false && TableCheckBoxActions ? (
                      <td>
                        <Checkbox
                          checked={checked[rowIndex]}
                          onChange={handleChange(rowIndex, row)}
                        />
                      </td>
                    ) : null}
                    {Cookies.get("previous_user") === undefined ? (
                      <>
                        {showAction !== false && TableActions ? (
                          <td>
                            {TableActionPrevilege["View Crm"] &&
                              handleViewCRM && (
                                <Tooltip
                                  title="View CRM"
                                  onClick={() => handleViewCRM(row.original)}
                                >
                                  <IconButton sx={{ padding: "5px 8px" }}>
                                    <AccountBoxOutlinedIcon
                                      sx={{ fontSize: "18px", color: rowColor }}
                                    />
                                  </IconButton>
                                </Tooltip>
                              )}
                            {TableActionPrevilege["Quick Edit"] &&
                              handleQuickEdit && (
                                <Tooltip
                                  title="Quick Edit"
                                  onClick={() => {
                                    handleQuickEdit(row.original);
                                    handleRowClick(row.original);
                                  }}
                                >
                                  <IconButton sx={{ padding: "5px 8px" }}>
                                    <AutoFixHighIcon
                                      sx={{ fontSize: "18px", color: rowColor }}
                                    />
                                  </IconButton>
                                </Tooltip>
                              )}
                            {TableActionPrevilege["View Broker Lead"] &&
                              handleViewBrokerLead && (
                                <Tooltip
                                  title="View Broker Lead"
                                  onClick={() => {
                                    handleViewBrokerLead(row.original);
                                    handleRowClick(row.original);
                                  }}
                                >
                                  <IconButton sx={{ padding: "5px 8px" }}>
                                    <PreviewIcon
                                      sx={{ fontSize: "18px", color: rowColor }}
                                    />
                                  </IconButton>
                                </Tooltip>
                              )}
                            {TableActionPrevilege["Edit"] && handleEdit && (
                              <Tooltip
                                title="Edit"
                                onClick={() => {
                                  handleEdit(row.original);
                                  handleRowClick(row.original);
                                }}
                              >
                                <IconButton sx={{ padding: "5px 8px" }}>
                                  <EditIcon
                                    sx={{ fontSize: "18px", color: rowColor }}
                                  />
                                </IconButton>
                              </Tooltip>
                            )}
                            {TableActionPrevilege["View"] && handleView && (
                              <Tooltip
                                title="View"
                                onClick={() => {
                                  handleView(row.original);
                                  handleRowClick(row.original);
                                }}
                              >
                                <IconButton sx={{ padding: "5px 8px" }}>
                                  <VisibilityOutlinedIcon
                                    sx={{ fontSize: "18px", color: rowColor }}
                                  />
                                </IconButton>
                              </Tooltip>
                            )}
                            {TableActionPrevilege["View"] &&
                              mode === "Candidates" &&
                              row.original.c_pdf && (
                                <Tooltip
                                  title="View Candidate CV"
                                  onClick={() => {
                                    setModalValues(row.original.c_pdf);
                                    setShowModal(true);
                                  }}
                                >
                                  <IconButton sx={{ padding: "5px 8px" }}>
                                    <PictureAsPdfIcon
                                      sx={{ fontSize: "18px", color: rowColor }}
                                    />
                                  </IconButton>
                                </Tooltip>
                              )}
                            {localStorage.getItem("currScreen") ===
                            "userlead" ? null : (
                              <br />
                            )}
                            {TableActionPrevilege["Call"] && ShowCall && (
                              <Tooltip
                                title="Call"
                                component="a"
                                href={
                                  mode === "Candidates"
                                    ? "tel:+" +
                                      row.original.c_ccode +
                                      row.original.c_mob
                                    : mode === "Loan"
                                    ? "tel:+" +
                                      row.original.ccode +
                                      row.original.mob
                                    : "tel:+" +
                                      row.original.p_ccode +
                                      row.original.p_mob
                                }
                              >
                                <IconButton sx={{ padding: "5px 8px" }}>
                                  <CallOutlinedIcon
                                    sx={{ fontSize: "18px", color: rowColor }}
                                  />
                                </IconButton>
                              </Tooltip>
                            )}
                            {TableActionPrevilege["WhatsApp"] &&
                              ShowWhatsapp && (
                                <ReactWhatsapp
                                  number={
                                    mode === "Candidates"
                                      ? "+" +
                                        row.original.c_ccode +
                                        row.original.c_mob
                                      : mode === "Loan"
                                      ? "+" +
                                        row.original.ccode +
                                        row.original.mob
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
                                    onClick={() => {
                                      ShowWhatsapp(row.original);
                                      handleRowClick(row.original);
                                    }}
                                  >
                                    <IconButton component="span">
                                      <WhatsAppIcon
                                        sx={{
                                          fontSize: "18px",
                                          color: rowColor,
                                        }}
                                      />
                                    </IconButton>
                                  </Tooltip>
                                </ReactWhatsapp>
                              )}
                            {TableActionPrevilege["Email"] && ShowEmail && (
                              <Tooltip
                                title="Email"
                                target="_blank"
                                href={"mailto:" + row.original.p_email}
                              >
                                <IconButton sx={{ padding: "5px 8px" }}>
                                  <EmailOutlinedIcon
                                    sx={{ fontSize: "18px", color: rowColor }}
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
                                    sx={{ fontSize: "18px", color: rowColor }}
                                  />
                                </IconButton>
                              </Tooltip>
                            )}
                          </td>
                        ) : null}
                      </>
                    ) : (
                      <td>
                        {TableActionPrevilege["View"] && handleView && (
                          <Tooltip
                            title="View"
                            onClick={() => handleView(row.original)}
                          >
                            <IconButton sx={{ padding: "5px 8px" }}>
                              <VisibilityOutlinedIcon
                                sx={{ fontSize: "18px", color: rowColor }}
                              />
                            </IconButton>
                          </Tooltip>
                        )}
                      </td>
                    )}
                    <td
                      style={{
                        backgroundColor: row.values?.Day
                          ? row.values.status === "Weekly OFF"
                            ? hexToRGBA(weeklyOffColor, 0.65)
                            : row.values.status !== "Full Day" &&
                              row.values.status !== "Half Day" &&
                              row.values.status !== "Late Mark" &&
                              row.values.status !== "Failed to Logout" &&
                              row.values.status !== "Absent"
                            ? hexToRGBA(publicHolidaysColor, 0.65)
                            : ""
                          : "",
                        color: rowColor ? rowColor : "#000",
                      }}
                    >
                      {generateSrNo(rowIndex)}
                    </td>
                    {row.cells.map((cell, i) => (
                      <React.Fragment key={i}>
                        {(cell.column.Header === "Lead Status" &&
                          row.cells[7].value) ||
                        cell.column.Header === "Admin Lead Status" ? (
                          <td
                            {...cell.getCellProps()}
                            style={{
                              alignItems: "center",
                              justifyContent: "center",
                              color: rowColor ? rowColor : "#000",
                            }}
                          >
                            <Tooltip title={cell.render("Cell")} sx={{ py: 0 }}>
                              <span
                                style={{
                                  backgroundColor: row.original.color
                                    ? row.original.color
                                    : "#fff",
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
                          <td
                            {...cell.getCellProps()}
                            className={`table-cell ${
                              cell.column.Header === "Login Time"
                                ? "td-width-auto"
                                : ""
                            }`}
                            style={{
                              backgroundColor: row.values?.Day
                                ? row.values.status === "Weekly OFF"
                                  ? hexToRGBA(weeklyOffColor, 0.65)
                                  : row.values.status !== "Full Day" &&
                                    row.values.status !== "Half Day" &&
                                    row.values.status !== "Late Mark" &&
                                    row.values.status !== "Failed to Logout" &&
                                    row.values.status !== "Absent"
                                  ? hexToRGBA(publicHolidaysColor, 0.65)
                                  : ""
                                : "",
                              color: rowColor ? rowColor : "#000",
                            }}
                          >
                            {hideToolTip ? (
                              <span>{cell.render("Cell")}</span>
                            ) : (
                              <Tooltip
                                title={cell.render("Cell")}
                                sx={{ py: 0 }}
                              >
                                <span>{cell.render("Cell")}</span>
                              </Tooltip>
                            )}
                          </td>
                        )}
                      </React.Fragment>
                    ))}
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={columns.length + 2} className="no-data-message">
                  No Data Found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="table-footer">
        <div className="data-count">
          Displaying {(tablePage && tablePage.length) || 0} of {totalCount}{" "}
          records
        </div>
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
            src={globalData.API_URL + "/Uploads/candidate_cv/" + ModalValues}
          >
            {ModalValues}
          </iframe>
        }
      />
    </>
  );
}

CustomDataTable.propTypes = {
  columns: PropTypes.array.isRequired,
  data: PropTypes.array.isRequired,
  page: PropTypes.number,
  pageSize: PropTypes.number,
  onPageChange: PropTypes.func,
  onPageSizeChange: PropTypes.func,
  totalCount: PropTypes.number,
  SetSelectedRows: PropTypes.func,
  selectedRows: PropTypes.array,
  handleQuickEdit: PropTypes.func,
  handleViewBrokerLead: PropTypes.func,
  handleView: PropTypes.func,
  handleViewCRM: PropTypes.func,
  handleEdit: PropTypes.func,
  showAction: PropTypes.bool,
  showCheckBox: PropTypes.bool,
  ShowCall: PropTypes.bool,
  handleDelete: PropTypes.func,
  ShowWhatsapp: PropTypes.bool,
  ShowEmail: PropTypes.bool,
  mode: PropTypes.string,
  actionModulePrevilege: PropTypes.object,
  hideToolTip: PropTypes.bool,
  weeklyOffColor: PropTypes.string,
  publicHolidaysColor: PropTypes.string,
  fullsize: PropTypes.bool,
};

CustomDataTable.defaultProps = {
  data: [],
  selectedRows: [],
  hideToolTip: false,
  weeklyOffColor: "",
  publicHolidaysColor: "",
  showAction: true,
  showCheckBox: true,
  ShowCall: false,
  ShowWhatsapp: false,
  ShowEmail: false,
  fullsize: false,
};

export default CustomDataTable;
