import React, { useState, useMemo, useCallback, useEffect } from "react";
import { useTable, usePagination, useSortBy } from "react-table";
import { useMui, useSetting } from "../../hooks/Hooks";
import "./CustomDataTable.css";
import ReactWhatsapp from "react-whatsapp";
import Cookies from "js-cookie";
import { CustomModal } from "../../components/CustomModal/CustomModal";
import { useConvertFreshLead } from "../../hooks/Leads/UseLeadsHook";
import PropTypes from "prop-types";
import Tooltip from "@mui/material/Tooltip";

// Utility function to check action privileges
const getActionPrivileges = (actionModulePrevilege, action) => {
  return actionModulePrevilege?.[action] ?? Cookies.get("role") === "Master";
};

// Utility function to check if any action is available
const hasAnyAction = (privileges) => Object.values(privileges).some(Boolean);

// Utility function to convert hex to RGBA
const hexToRGBA = (hex, opacity) => {
  const cleanHex = hex.replace("#", "");
  const r = parseInt(cleanHex.substring(0, 2), 16);
  const g = parseInt(cleanHex.substring(2, 4), 16);
  const b = parseInt(cleanHex.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

// Action Button Component
const ActionButton = ({ title, onClick, Icon, rowColor }) => {
  const { Tooltip, IconButton } = useMui();
  return (
    <Tooltip title={title}>
      <IconButton onClick={onClick} sx={{ padding: "5px 8px" }}>
        <Icon sx={{ fontSize: "18px", color: rowColor || "inherit" }} />
      </IconButton>
    </Tooltip>
  );
};

// Mobile Number Cell Component
const MobileNumberCell = ({
  row,
  mode,
  showCall,
  showWhatsapp,
  rowColor,
  handleRowClick,
}) => {
  const { Tooltip, IconButton, CallOutlinedIcon, WhatsAppIcon } = useMui();
  const [numberAction, setNumberAction] = useState(false);

  const phoneNumber = useMemo(() => {
    if (mode === "Candidates")
      return `+${row.original.c_ccode} ${row.original.c_mob}`;
    if (mode === "Loan") return `+${row.original.ccode}${row.original.mob}`;
    return `${row.original.p_ccode}${row.original.p_mob}`;
  }, [mode, row]);

  return (
    <td>
      <div
        style={{ display: "inline-block" }}
        onMouseEnter={() => setNumberAction(true)}
        onMouseLeave={() => setNumberAction(false)}
      >
        <div style={{ color: rowColor || "#000" }}>{phoneNumber}</div>
        {numberAction && (
          <div>
            {showCall && (
              <Tooltip title="Call" component="a" href={`tel:${phoneNumber}`}>
                <IconButton sx={{ padding: "5px 8px" }}>
                  <CallOutlinedIcon
                    sx={{ fontSize: "18px", color: rowColor || "inherit" }}
                  />
                </IconButton>
              </Tooltip>
            )}
            {showWhatsapp && (
              <ReactWhatsapp
                number={phoneNumber}
                message="Hello,"
                style={{
                  outline: "none",
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                }}
              >
                <Tooltip
                  title="WhatsApp"
                  onClick={() => {
                    showWhatsapp(row.original);
                    handleRowClick(row.original);
                  }}
                >
                  <IconButton component="span">
                    <WhatsAppIcon
                      sx={{ fontSize: "18px", color: rowColor || "inherit" }}
                    />
                  </IconButton>
                </Tooltip>
              </ReactWhatsapp>
            )}
          </div>
        )}
      </div>
    </td>
  );
};

// Cell Renderer Function
const renderCell = (
  cell,
  row,
  index,
  rowColor,
  rowBackground,
  mode,
  actionPrivileges,
  ShowCall,
  ShowWhatsapp,
  handleRowClick,
  hideToolTip
) => {
  const column = cell.column || {};
  if (column.visible === false) return null;

  const isLeadStatus = column.Header === "Lead Status" && row.cells[7]?.value;
  const isAdminLeadStatus = column.Header === "Admin Lead Status";

  if (isLeadStatus || isAdminLeadStatus) {
    return (
      <td
        key={index}
        {...cell.getCellProps()}
        style={{
          alignItems: "center",
          justifyContent: "center",
          color: rowColor,
        }}
      >
        <Tooltip title={cell.render("Cell")} sx={{ py: 0 }}>
          <span
            style={{
              backgroundColor: row.original.color || "#fff",
              padding: "5px 8px",
              color: "#ffffff",
              overflow: "hidden",
              overflowX: "scroll",
            }}
          >
            {cell.render("Cell")}
          </span>
        </Tooltip>
      </td>
    );
  }

  if (column.Header === "Email Id") {
    return (
      <td key={index} {...cell.getCellProps()}>
        <Tooltip
          title={
            row.original.p_email
              ? `Click to send mail to ${row.original.p_email}`
              : "No email available"
          }
          sx={{ py: 0 }}
        >
          <a
            href={row.original.p_email ? `mailto:${row.original.p_email}` : "#"}
            style={{
              textDecoration: "none",
              color: rowColor || "#000",
              cursor: row.original.p_email ? "pointer" : "default",
            }}
          >
            {row.original.p_email || "N/A"}
          </a>
        </Tooltip>
      </td>
    );
  }

  if (column.Header === "Mobile Number") {
    return (
      <MobileNumberCell
        key={index}
        row={row}
        mode={mode}
        showCall={actionPrivileges.Call && ShowCall}
        showWhatsapp={actionPrivileges.WhatsApp && ShowWhatsapp}
        rowColor={rowColor}
        handleRowClick={handleRowClick}
      />
    );
  }

  return (
    <td
      key={index}
      {...cell.getCellProps()}
      className={`table-cell ${
        column.Header === "Login Time" ? "td-width-auto" : ""
      }`}
      style={{
        backgroundColor: rowBackground,
        color: rowColor || "#000",
      }}
    >
      {hideToolTip ? (
        <span>{cell.render("Cell")}</span>
      ) : (
        <Tooltip title={cell.render("Cell")} sx={{ py: 0 }}>
          <span>{cell.render("Cell")}</span>
        </Tooltip>
      )}
    </td>
  );
};

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
  handleViewBrokerLead,
  handleView,
  handleViewCRM,
  handleEdit,
  showAction = true,
  showCheckBox = true,
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
  const { globalData } = useSetting();
  const { mutate: ConvertFreshLeadMutation } = useConvertFreshLead();

  const [showModal, setShowModal] = useState(false);
  const [modalValues, setModalValues] = useState(null);
  const [isAllSelected, setIsAllSelected] = useState(false);
  const [checked, setChecked] = useState([]);

  // Sync checked state with data and selectedRows
  useEffect(() => {
    const newChecked = data.map((row) =>
      selectedRows.some(
        (selectedRow) =>
          (selectedRow.id || selectedRow.l_id) === (row.id || row.l_id)
      )
    );
    setChecked(newChecked);
    setIsAllSelected(
      newChecked.length > 0 && newChecked.every((value) => value)
    );
  }, [selectedRows, data]);

  // Action privileges
  const actionPrivileges = useMemo(
    () => ({
      View: getActionPrivileges(actionModulePrevilege, "View"),
      Edit: getActionPrivileges(actionModulePrevilege, "Edit"),
      "Quick Edit": getActionPrivileges(actionModulePrevilege, "Quick Edit"),
      "View Broker Lead": getActionPrivileges(
        actionModulePrevilege,
        "View Broker Lead"
      ),
      Call: getActionPrivileges(actionModulePrevilege, "Call"),
      WhatsApp: getActionPrivileges(actionModulePrevilege, "WhatsApp"),
      Email: getActionPrivileges(actionModulePrevilege, "Email"),
      "View Crm": getActionPrivileges(actionModulePrevilege, "View Crm"),
    }),
    [actionModulePrevilege]
  );

  const checkBoxPrivileges = useMemo(
    () => ({
      Delete: getActionPrivileges(actionModulePrevilege, "Delete"),
      Assign: getActionPrivileges(actionModulePrevilege, "Assign"),
      Export: getActionPrivileges(actionModulePrevilege, "Export"),
    }),
    [actionModulePrevilege]
  );

  const tableActions = hasAnyAction(actionPrivileges);
  const tableCheckBoxActions = hasAnyAction(checkBoxPrivileges);

  // Table setup with react-table hooks
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page: tablePage,
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

  // Handle row checkbox change
  const handleChange = useCallback(
    (index, row) => (event) => {
      setChecked((prev) => {
        const newChecked = [...prev];
        newChecked[index] = event.target.checked;
        return newChecked;
      });
      SetSelectedRows((prevSelectedRows) => {
        const rowId = row.original.id || row.original.l_id;
        if (event.target.checked) {
          return [...prevSelectedRows, row.original];
        } else {
          return prevSelectedRows.filter(
            (selectedRow) => (selectedRow.id || selectedRow.l_id) !== rowId
          );
        }
      });
    },
    [SetSelectedRows]
  );

  // Toggle select all
  const toggleSelectAll = useCallback(() => {
    if (data.length === 0) return;
    const newIsAllSelected = !isAllSelected;
    setIsAllSelected(newIsAllSelected);
    const newChecked = new Array(data.length).fill(newIsAllSelected);
    setChecked(newChecked);
    SetSelectedRows(newIsAllSelected ? [...data] : []);
  }, [data, isAllSelected, SetSelectedRows]);

  const handlePageClick = useCallback(
    (pageIndex) => {
      gotoPage(pageIndex);
      onPageChange(pageIndex + 1);
    },
    [gotoPage, onPageChange]
  );

  const handlePageSizeChange = useCallback(
    (event) => {
      const newSize = parseInt(event.target.value);
      onPageSizeChange(newSize);
    },
    [onPageSizeChange]
  );

  const handleRowClick = useCallback(
    (data) => {
      if (data.clicked === 0) {
        ConvertFreshLeadMutation(data.l_id);
      } else if (data.identity === "imported") {
        ConvertFreshLeadMutation({ l_id: data.l_id, imported: "true" });
      }
    },
    [ConvertFreshLeadMutation]
  );

  const startRow = pageIndex * pageSize + 1;
  const generateSrNo = (rowIndex) => startRow + rowIndex;

  const getRowColor = (row) => {
    if (row.original.identity && row.original?.clicked === 1) return "#2A5EBF";
    if (row.original?.clicked === 0) return "rgb(212, 77, 140)";
    return "#0000008a";
  };

  const getRowBackground = (row) => {
    if (!row.values?.Day) return "";
    if (row.values.status === "Weekly OFF")
      return hexToRGBA(weeklyOffColor, 0.65);
    if (
      ![
        "Full Day",
        "Half Day",
        "Late Mark",
        "Failed to Logout",
        "Absent",
      ].includes(row.values.status)
    ) {
      return hexToRGBA(publicHolidaysColor, 0.65);
    }
    return "";
  };

  return (
    <>
      <div
        className="custom-data-table"
        style={{
          height: fullsize ? "auto" : tablePage.length > 10 ? "40vw" : "auto",
        }}
      >
        <table {...getTableProps()} className="table">
          <thead>
            <tr>
              {showCheckBox && tableCheckBoxActions && (
                <th>
                  <Checkbox
                    style={{ width: "10px", height: "10px" }}
                    checked={data.length > 0 && checked.every((value) => value)}
                    indeterminate={
                      data.length > 0 &&
                      checked.some((value) => value) &&
                      !checked.every((value) => value)
                    }
                    onChange={toggleSelectAll}
                    size="small"
                  />
                </th>
              )}
              {showAction && tableActions && <th>Action</th>}
              <th>Sr. No.</th>
              {headerGroups[0]?.headers.map((column) => (
                <th
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                  className={
                    column.Header === "Login Time" ? "th-width-auto" : ""
                  }
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
            {tablePage.length ? (
              tablePage.map((row, rowIndex) => {
                prepareRow(row);
                const isSelected = selectedRows.some(
                  (selectedRow) =>
                    (selectedRow.id || selectedRow.l_id) ===
                    (row.original.id || row.original.l_id)
                );
                const rowColor = getRowColor(row);
                const rowBackground = getRowBackground(row);

                return (
                  <tr
                    {...row.getRowProps()}
                    style={{ color: rowColor }}
                    className={`lead-row ${isSelected ? "selected" : ""}`}
                  >
                    {showCheckBox && tableCheckBoxActions && (
                      <td>
                        <Checkbox
                          style={{ width: "10px", height: "10px" }}
                          checked={checked[rowIndex] || false}
                          onChange={handleChange(rowIndex, row)}
                          size="small"
                        />
                      </td>
                    )}
                    {showAction && tableActions && (
                      <td>
                        {actionPrivileges["View Crm"] && handleViewCRM && (
                          <ActionButton
                            title="View CRM"
                            onClick={() => handleViewCRM(row.original)}
                            Icon={AccountBoxOutlinedIcon}
                            rowColor={rowColor}
                          />
                        )}
                        {actionPrivileges["Quick Edit"] && handleQuickEdit && (
                          <ActionButton
                            title="Quick Edit"
                            onClick={() => {
                              handleQuickEdit(row.original);
                              handleRowClick(row.original);
                            }}
                            Icon={AutoFixHighIcon}
                            rowColor={rowColor}
                          />
                        )}
                        {actionPrivileges["View Broker Lead"] &&
                          handleViewBrokerLead && (
                            <ActionButton
                              title="View Broker Lead"
                              onClick={() => {
                                handleViewBrokerLead(row.original);
                                handleRowClick(row.original);
                              }}
                              Icon={PreviewIcon}
                              rowColor={rowColor}
                            />
                          )}
                        {actionPrivileges["Edit"] && handleEdit && (
                          <ActionButton
                            title="Edit"
                            onClick={() => {
                              handleEdit(row.original);
                              handleRowClick(row.original);
                            }}
                            Icon={EditIcon}
                            rowColor={rowColor}
                          />
                        )}
                        {actionPrivileges["View"] && handleView && (
                          <ActionButton
                            title="View"
                            onClick={() => {
                              handleView(row.original);
                              handleRowClick(row.original);
                            }}
                            Icon={VisibilityOutlinedIcon}
                            rowColor={rowColor}
                          />
                        )}
                        {actionPrivileges["View"] &&
                          mode === "Candidates" &&
                          row.original.c_pdf && (
                            <ActionButton
                              title="View Candidate CV"
                              onClick={() => {
                                setModalValues(row.original.c_pdf);
                                setShowModal(true);
                              }}
                              Icon={PictureAsPdfIcon}
                              rowColor={rowColor}
                            />
                          )}
                        {handleDelete && (
                          <ActionButton
                            title="Delete"
                            onClick={() => handleDelete(row.original.id)}
                            Icon={DeleteOutlineRoundedIcon}
                            rowColor={rowColor}
                          />
                        )}
                      </td>
                    )}
                    <td
                      style={{
                        backgroundColor: rowBackground,
                        color: rowColor || "#000",
                      }}
                    >
                      {generateSrNo(rowIndex)}
                    </td>
                    {row.cells.map((cell, i) =>
                      renderCell(
                        cell,
                        row,
                        i,
                        rowColor,
                        rowBackground,
                        mode,
                        actionPrivileges,
                        ShowCall,
                        ShowWhatsapp,
                        handleRowClick,
                        hideToolTip
                      )
                    )}
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
          Displaying {tablePage.length} of {totalCount} records
        </div>
        <div className="pagination">
          <span className="icon-button-grp">
            <IconButton
              onClick={() => handlePageClick(0)}
              disabled={!canPreviousPage}
            >
              {"<<"}
            </IconButton>
            <IconButton
              onClick={() => handlePageClick(pageIndex - 1)}
              disabled={!canPreviousPage}
            >
              {"<"}
            </IconButton>
            <IconButton
              onClick={() => handlePageClick(pageIndex + 1)}
              disabled={!canNextPage}
            >
              {">"}
            </IconButton>
            <IconButton
              onClick={() => handlePageClick(pageCount - 1)}
              disabled={!canNextPage}
            >
              {">>"}
            </IconButton>
            <span>
              Page{" "}
              <strong>
                {pageIndex + 1} of {pageOptions.length}
              </strong>
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
        show={showModal}
        onHide={() => setShowModal(false)}
        ModalTitle="Preview Candidate CV"
        ModalBody={
          <iframe
            height="500px"
            width="100%"
            title="Candidate CV"
            src={`${globalData.API_URL}/Uploads/candidate_cv/${modalValues}`}
          >
            {modalValues}
          </iframe>
        }
      />
    </>
  );
}

CustomDataTable.propTypes = {
  columns: PropTypes.array.isRequired,
  data: PropTypes.array.isRequired,
  page: PropTypes.number.isRequired,
  pageSize: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  onPageSizeChange: PropTypes.func.isRequired,
  totalCount: PropTypes.number.isRequired,
  SetSelectedRows: PropTypes.func.isRequired,
  selectedRows: PropTypes.array.isRequired,
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

export default CustomDataTable;
