// Import necessary dependencies and styles
import React, { useMemo, useState } from "react";
import Breadcrumb from "../components/Breadcrumb/Breadcrumb";
import { useBootstrap, useMui } from "../hooks/Hooks";
import CustomDataTable from "../components/CustomDataTable/CustomDataTable";
import { LeadAssignReportColumn } from "../data/Columns/Lead/LeadAssignReportColumn";
import { useQuery } from "react-query";
import {
  CustomModal,
  DeleteModal,
} from "../components/CustomModal/CustomModal";
import ImportLead from "../components/ImportLead/ImportLead";
// import { useDeleteSelectedLead } from "../hooks/Leads/UseLeadsHook";
import LeadAssignReportAdvanceSearch from "../components/LeadAssignReportAdvanceSearch/LeadAssignReportAdvanceSearch";
import { useQueryClient } from "react-query";
import { getActionPrevilege } from "../setting/ActionModulePrevileges";
import { useDeleteSelectedLeadSchedule } from "../hooks/Leads/UseLeadSchedulingHook";

const LeadHandler = ({
  dispatch,
  tableDataFunction,
  tableDataCountFunction,
  FetchCounting,
  tableDataFunctionParams,
  TotalDataCount,
  useQueryKey,
  breadcrumbValues,
  myglobalData,
  showAction,
  showCheckBox,
}) => {
  // Import Bootstrap and MUI components
  const { Card } = useBootstrap();
  const {
    // AssignmentIndOutlinedIcon,
    // FileDownloadOutlinedIcon,
    Alert,
    DeleteOutlineRoundedIcon,
    Skeleton,
    // Button,
    Backdrop,
    CircularProgress,
  } = useMui();

  const [ShowBackdrop, setShowBackdrop] = React.useState(false);
  const [showDeleteModal, setShowDeleteModal] = React.useState(false);
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(50);
  const [selectedRows, setSelectedRows] = React.useState([]);
  const [searchData, setSearchData] = React.useState([]);
  const [showModal, setShowModal] = React.useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = React.useState(null);
  const [DataMSg, setDataMSg] = React.useState(null);


  // Memoize the result of getActionPrevilege()
  const memoizedLeadsActionPrevilege = useMemo(() => getActionPrevilege("Leads"), []);

  const LeadsActionPrevilege = memoizedLeadsActionPrevilege;

  const queryClient = useQueryClient();

  // Cleanup localStorage based on the current screen
  React.useEffect(() => {
    if (
      localStorage.getItem("currScreen") !== "leadbystatus" &&
      localStorage.getItem("currScreen") !== "leadbysource"
    ) {
      localStorage.removeItem("updateglobal_userdata");
    }
  }, []);

  // Fetch lead data and count using React Query
  const leadAssignReportTableData = useQuery(
    [useQueryKey[0], page, pageSize, tableDataFunctionParams],
    () => tableDataFunction(page, pageSize, tableDataFunctionParams)
  );

  const leadCount = useQuery(
    useQueryKey[1],
    () => {
      return tableDataCountFunction;
    },
    { enabled: FetchCounting }
  );

  const { mutate, isLoading } = useDeleteSelectedLeadSchedule();

  // State and data handling effects
  React.useEffect(() => {
    if (showSuccessMessage) {
      leadCount.refetch();
      setTimeout(() => {
        setShowSuccessMessage(null);
      }, 3000);
    }
    if (DataMSg) {
      setTimeout(() => {
        setDataMSg(null);
      }, 3000);
    }
  }, [showSuccessMessage, DataMSg, leadCount]);

  // Event Handlers
  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handlePageSizeChange = (newSize) => {
    setPageSize(newSize);
  };

  const handleSelectedRows = (rowId) => {
    if (rowId.length !== 0) {
      if (rowId !== null) {
        setSelectedRows((prevSelectedRows) => {
          const isSelected = prevSelectedRows.includes(rowId);
          if (isSelected) {
            return prevSelectedRows.filter((id) => id !== rowId);
          } else {
            if (rowId.length > 1) {
              return rowId;
            } else {
              return [...prevSelectedRows, rowId];
            }
          }
        });
      }
    } else {
      setSelectedRows([]);
    }
  };

  // const handleAssign = () => {
  //   let leadIds = [];
  //   if (Array.isArray(selectedRows[0])) {
  //     leadIds = selectedRows[0].map((entry) => entry.l_id);
  //   } else {
  //     leadIds = selectedRows.map((entry) => entry.l_id);
  //   }
  //   dispatch({
  //     event: "updateglobal_userdata",
  //     data: JSON.stringify(leadIds),
  //   });
  //   setTimeout(() => {
  //     dispatch({ event: "assignleadfrom" });
  //   }, 30);
  // };

  // Import success handling
  // const HandleImportFun = (data) => {
  //   setShowModal(false);
  //   setShowSuccessMessage(data + " Leads has been imported");
  //   leadAssignReportTableData.refetch();
  //   leadCount.refetch();
  // };

  // const handleEditFun = (data) => {
  //   if (localStorage.getItem("currScreen") === "leadbystatus") {
  //     dispatch({
  //       event: "store_new_data",
  //       data: JSON.stringify(data),
  //     });
  //   } else {
  //     dispatch({
  //       event: "updateglobal_userdata",
  //       data: JSON.stringify(data),
  //     });
  //   }
  //   setTimeout(() => {
  //     dispatch({ event: "editlead" });
  //   }, 30);
  // };

  // const handleQuickEditFun = (data) => {
  //   if (localStorage.getItem("currScreen") === "leadbystatus") {
  //     dispatch({
  //       event: "store_new_data",
  //       data: JSON.stringify(data),
  //     });
  //   } else {
  //     dispatch({
  //       event: "updateglobal_userdata",
  //       data: JSON.stringify(data),
  //     });
  //   }
  //   setTimeout(() => {
  //     dispatch({ event: "quickeditlead" });
  //   }, 30);
  // };

  const handleViewFun = (data) => {
    if (localStorage.getItem("currScreen") === "leadbystatus") {
      dispatch({
        event: "store_new_data",
        data: JSON.stringify(data),
      });
    } else {
      dispatch({
        event: "updateglobal_userdata",
        data: JSON.stringify(data),
      });
    }
    setTimeout(() => {
      dispatch({ event: "viewleadscheduling" });
    }, 30);
  };

  const HandleSearchData = (data) => {
    if (data?.SearchCount?.data > 0 || data.length !== 0) {
      setSearchData(data);
    } else {
      if (data.length === 0) {
        setDataMSg("Search has been reset");
        setSearchData("No Data Found");
      } else {
        setSearchData("No Data Found");
        setDataMSg("No Data Found");
      }
    }
  };

  React.useEffect(() => {
    // Display success message from localStorage
    setShowSuccessMessage(localStorage.getItem("successMessage"));
    setTimeout(() => {
      setShowSuccessMessage(null);
      localStorage.removeItem("successMessage");
    }, 3000);
  }, []);

  // Export selected or all data to CSV
  // const handleExport = () => {
  //   let data;

  //   // Show the Backdrop when exporting begins
  //   setShowBackdrop(true);
  //   if ((searchData === "No Data Found" || searchData.length === 0) && selectedRows.length === 0) {
  //     data = leadAssignReportTableData.data?.data;
  //   } else {
  //     data = selectedRows;
  //   }

  //   // Function to format date and time string
  //   const formatDateAndTime = (dateTimeString) => {
  //     if (dateTimeString === "0000-00-00 00:00:00") {
  //       return ""; // Handle empty date and time strings
  //     }
  //     const date = new Date(dateTimeString.replace(" ", "T")); // Convert to ISO format
  //     return date.toLocaleString(); // Adjust the formatting as needed
  //   };
  //   // Hide the Backdrop after exporting is done
  //   setTimeout(() => {
  //     // Create a CSV content string from the selectedRows
  //     const csvContent =
  //       "data:text/csv;charset=utf-8," +
  //       encodeURIComponent(
  //         // Create the header row
  //         Object.keys(data[0]).join(",") +
  //           "\n" +
  //           // Create data rows
  //           data
  //             .map((row) => {
  //               // Map each value, formatting date and time if it's a date and time field
  //               return Object.values(row)
  //                 .map((value) => {
  //                   return value instanceof Date
  //                     ? formatDateAndTime(value.toISOString())
  //                     : typeof value === "string" && value.includes(",") ? `"${value}"` : value;
  //                 })
  //                 .join(",");
  //             })
  //             .join("\n")
  //       );

  //     // Create a data URI and trigger download
  //     const link = document.createElement("a");
  //     link.setAttribute("href", csvContent);
  //     link.setAttribute("download", "data.csv");
  //     document.body.appendChild(link);
  //     link.click();

  //     setShowBackdrop(false);
  //   }, 2000);
  // };

  return (
    <>
      {/* Breadcrumb component for navigation */}
      <Breadcrumb
        PageName={breadcrumbValues.pageName}
        // DeleteAll={[
        //   selectedRows.length > 0 && LeadsActionPrevilege.Delete ? true : false,
        //   "Delete",
        //   () => setShowDeleteModal(true),
        //   <DeleteOutlineRoundedIcon />,
        //   selectedRows.length > 0 ? false : true,
        // ]}
        // AddButton={[
        //   breadcrumbValues.addButton && LeadsActionPrevilege.Add,
        //   "Add Scheduler",
        //   null,
        //   () => dispatch({ event: "addleadscheduling" }),
        // ]}
        // {breadcrumbValues.assignButton && (
        // AssignButton={[
        //   selectedRows.length > 0 && LeadsActionPrevilege.Assign ? true : false,
        //   "Assign Lead",
        //   () => handleAssign(),
        //   <AssignmentIndOutlinedIcon />,
        //   selectedRows.length > 0 ? false : true,
        // ]}
        // ImportLeads={[
        //   LeadsActionPrevilege.Import,
        //   "Import",
        //   () => setShowModal(true),
        //   <FileDownloadOutlinedIcon />,
        // ]}
        // Export button for selected or all data
        // AddMoreBtn={
        //   LeadsActionPrevilege.Export && (
        //     <Button
        //       variant="contained"
        //       className="mx-2"
        //       startIcon={<FileDownloadOutlinedIcon />}
        //       onClick={handleExport}
        //     >
        //       {selectedRows.length > 0 ? "Export Selected" : "Export All"}
        //     </Button>
        //   )
        // }
        actionModulePrevilege={LeadsActionPrevilege}
        // )}
      /> 
      {/* {Cookies.get("role") === "Admin" || Cookies.get("role") === "Master" ? ( */}
      {/* LeadAdvancedSearch component for advanced search functionality */}
      <LeadAssignReportAdvanceSearch
        PassSearchData={HandleSearchData}
        PassPageName={breadcrumbValues.pageName}
        page={page}
        pageSize={pageSize}
        dispatch={dispatch}
      />
      {/* ) : null} */}
      {/* Display lead data in a Card component */}
      <Card className="mt-3">
        {/* <Card.Body> */}
        {showSuccessMessage && (
          <Alert severity="success" sx={{ my: 2 }}>
            {showSuccessMessage}
          </Alert>
        )}
        {DataMSg && (
          <Alert
            severity={DataMSg === "Search has been reset" ? "info" : "warning"}
          >
            {DataMSg}
          </Alert>
        )}
        {/* Display the DataTable component with lead data */}
        {!leadAssignReportTableData.isLoading && !leadCount.isLoading ? (
          <>
            {searchData === "No Data Found" || searchData.length === 0 ? (
              <CustomDataTable
                actionModulePrevilege={LeadsActionPrevilege}
                columns={LeadAssignReportColumn}
                data={leadAssignReportTableData.data?.data}
                page={page}
                pageSize={pageSize}
                totalCount={
                  FetchCounting ? leadCount.data?.data : TotalDataCount
                }
                onPageChange={handlePageChange}
                onPageSizeChange={handlePageSizeChange}
                SetSelectedRows={handleSelectedRows}
                selectedRows={selectedRows}
                // handleQuickEdit={
                //   localStorage.getItem("currScreen") === "userlead"
                //     ? null
                //     : handleQuickEditFun
                // }
                // handleEdit={
                //   localStorage.getItem("currScreen") === "userlead"
                //     ? null
                //     : handleEditFun
                // }
                handleView={
                  localStorage.getItem("currScreen") === "userlead"
                    ? null
                    : handleViewFun
                }
                ShowCall={true}
                ShowWhatsapp={true}
                ShowEmail={true}
                showAction={false}
                showCheckBox={false}
              />
            ) : (
              <CustomDataTable
                actionModulePrevilege={LeadsActionPrevilege}
                columns={LeadAssignReportColumn}
                data={searchData?.SearchData.data}
                totalCount={searchData?.SearchCount.data}
                page={page}
                pageSize={pageSize}
                onPageChange={handlePageChange}
                onPageSizeChange={handlePageSizeChange}
                SetSelectedRows={handleSelectedRows}
                selectedRows={selectedRows}
                // handleQuickEdit={
                //   localStorage.getItem("currScreen") === "userlead"
                //     ? null
                //     : handleQuickEditFun
                // }
                // handleEdit={
                //   localStorage.getItem("currScreen") === "userlead"
                //     ? null
                //     : handleEditFun
                // }
                handleView={
                  localStorage.getItem("currScreen") === "userlead"
                    ? null
                    : handleViewFun
                }
                ShowCall={true}
                ShowWhatsapp={true}
                ShowEmail={true}
                showAction={false}
                showCheckBox={false}
              />
            )}
          </>
        ) : (
          // Display loading skeleton when data is still loading
          <div>
            <Skeleton variant="rectangular" width="100%" height={50} />
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13].map((id) => {
              return (
                <Skeleton
                  key={id}
                  variant="rectangular"
                  width="100%"
                  height={30}
                  sx={{ mt: 1 }}
                />
              );
            })}
          </div>
        )}
        {/* </Card.Body> */}
      </Card>
      {/* DeleteModal component for handling lead deletion */}
      <DeleteModal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        loading={isLoading}
        onclick={() =>
          mutate(selectedRows, {
            onSuccess: (data) => {
              if (data.data === "Lead Schedule deleted") {
                // queryClient.invalidateQueries("SubMenuLeadCount");
                if (Array.isArray(selectedRows[0])) {
                  setShowSuccessMessage(
                    selectedRows[0].length +
                      " Scheduler has been deleted successfully"
                  );
                } else {
                  setShowSuccessMessage(
                    selectedRows.length + " Schedulers has been deleted successfully"
                  );
                }

                leadAssignReportTableData.refetch();
                leadCount.refetch();
                setSelectedRows([]);
                setShowDeleteModal(false);
                setTimeout(() => {
                  setShowSuccessMessage(null);
                }, 3000);
              }
            },
          })
        }
      />
      {/* CustomModal component for importing leads */}
      <CustomModal
        show={showModal}
        onHide={() => setShowModal(false)}
        ModalTitle="Import Leads"
        ModalBody={
          <ImportLead
            // HandleImport={HandleImportFun}
            myglobalData={myglobalData}
          />
        }
      />
      {/* Backdrop and CircularProgress for displaying loading state during export */}
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={ShowBackdrop}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  );
};

export default LeadHandler;
