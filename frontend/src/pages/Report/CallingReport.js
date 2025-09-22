// Importing necessary dependencies and components from React and other files
import React from "react";
import CryptoJS from "crypto-js";
import Breadcrumb from "../../components/Breadcrumb/Breadcrumb";
import { useBootstrap, useMui, useSetting } from "../../hooks/Hooks";
import CustomDataTable from "../../components/CustomDataTable/CustomDataTable";
import { useQuery } from "react-query";
import { GetCallingReportTableData } from "../../hooks/Report/UseCallingReport";

// React functional component named CallingReport
const CallingReport = ({ dispatch }) => {
  // Destructuring utility functions and components from custom hooks and libraries
  const { Card } = useBootstrap();
  const { WifiCalling3OutlinedIcon, ArrowBackIosIcon } = useMui();

  // State variables for managing pagination, selected rows, and CryptoJS key
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);
  const [selectedRows, setSelectedRows] = React.useState([]);

  // Creating a CryptoJS key based on global data
  const { globalData } = useSetting();
  let CryptoJSKey = globalData.CompanyName + "@" + globalData.Version;

  // Decrypting stored user data and lead report search data
  const bytes = CryptoJS.AES.decrypt(
    localStorage.getItem("updateglobal_userdata"),
    CryptoJSKey
  );

  const Searchbytes = CryptoJS.AES.decrypt(
    localStorage.getItem("store_new_data"),
    CryptoJSKey
  );

  // Parsing decrypted user data and lead report search data
  var user_data = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  var LeadReportSearch = JSON.parse(Searchbytes.toString(CryptoJS.enc.Utf8));

  // Query for fetching calling report table data
  const CallingReportTableData = useQuery(
    ["CallingReportData", user_data, LeadReportSearch, page, pageSize],
    () => GetCallingReportTableData(user_data, LeadReportSearch, page, pageSize)
  );

  // Column configuration for the custom data table
  const columns = [
    {
      Header: "Date and Time",
      accessor: "create_dt",
    },
    {
      Header: "User Name",
      accessor: "username",
    },
    {
      Header: "Phone Number",
      accessor: "p_mob",
    },
    {
      Header: "Follow Up",
      accessor: "followup",
    },
    {
      Header: "Status",
      accessor: "status",
    },
    {
      Header: "Comments",
      accessor: "comments",
    },
  ];

  // Event handlers for page change, page size change, and selected rows
  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handlePageSizeChange = (newSize) => {
    setPageSize(newSize);
  };

  const handleSelectedRows = (rowId) => {
    if (rowId !== null) {
      setSelectedRows((prevSelectedRows) => {
        const isSelected = prevSelectedRows.includes(rowId);
        if (isSelected) {
          return prevSelectedRows.filter((id) => id !== rowId);
        } else {
          return [...prevSelectedRows, rowId];
        }
      });
    }
  };

  // Render component with the calling report table
  return (
    <>
      {/* Breadcrumb component for page navigation */}
      <Breadcrumb
        PageName="User Calling Report"
        BackButton={[
          true,
          "Back",
          <ArrowBackIosIcon />,
          () =>
            dispatch({
              event:
                localStorage.getItem("previousScreen") ===
                localStorage.getItem("currScreen")
                  ? "totalleads"
                  : localStorage.getItem("previousScreen"),
            }),
        ]}
      />
      {/* Card component for organizing content */}
      <Card className="mt-3">
        <Card.Body className="d-flex align-items-center justify-content-between">
          {/* Card title displaying information about the call history report */}
          <Card.Title className="mb-0" style={{ fontSize: "16px" }}>
            <WifiCalling3OutlinedIcon
              style={{ fontSize: "20px", marginRight: "5px", color: "green" }}
            />{" "}
            Call History Report of {user_data[0].username} on{" "}
            {user_data[0].status} {"Status"}
            <small style={{ color: "#888888" }}>
              {" "}
              ({user_data[0].status_count} updated)
            </small>
          </Card.Title>
        </Card.Body>
      </Card>
      {/* Card component for the calling report table */}
      <Card className="mt-3 calling-report-table-card">
        {/* Render custom data table with calling report data */}
        {!CallingReportTableData.isLoading && (
          <CustomDataTable
            columns={columns}
            data={CallingReportTableData.data?.data}
            page={page}
            pageSize={pageSize}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
            SetSelectedRows={handleSelectedRows}
            selectedRows={selectedRows}
            totalCount={user_data[0].status_count}
            showAction={false}
          />
        )}
      </Card>
    </>
  );
};

// Exporting the CallingReport component as the default export
export default CallingReport;
