import React, { useMemo } from "react";
import Breadcrumb from "../components/Breadcrumb/Breadcrumb";
import { useBootstrap, useMui } from "../hooks/Hooks";
import CustomDataTable from "./../components/CustomDataTable/CustomDataTable";
//import { BrokerDetailsColumn } from "../data/Columns/Broker/BrokerDetailsColumn";
import BrokerDetailsColumn  from "../data/Columns/Broker/BrokerDetailsColumn";

import { useQuery } from "react-query";
import {
  CustomModal,
  DeleteModal,
} from "./../components/CustomModal/CustomModal";
import { useDeleteSelectedBroker } from "../hooks/Broker/UseBrokerHook";
import BrokerAdvancedSearch from "../components/BrokerAdvancedSearch/BrokerAdvancedSearch";
import { useQueryClient } from "react-query";
import brokerCSV from "./../csvfile/brokerCSV.csv";
import ImportHandler from "./ImportHandler";
import { CustomDownload } from "../hooks/Function";
import { getActionPrevilege } from "../setting/ActionModulePrevileges";
import Cookies from "js-cookie";
import { CustomBrokerModal } from "../components/CustomBrokerModal/CustomBrokerModal";

const BrokerHandler = ({
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
    FileDownloadOutlinedIcon,
    Alert,
    DeleteOutlineRoundedIcon,
    Skeleton,
    Button,
    Backdrop,
    CircularProgress,
  } = useMui();

  const [ShowBackdrop, setShowBackdrop] = React.useState(false);
  const [showDeleteModal, setShowDeleteModal] = React.useState(false);
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);
  const [selectedRows, setSelectedRows] = React.useState([]);
  const [searchData, setSearchData] = React.useState([]);
  const [showModal, setShowModal] = React.useState(false);
  const [showBrokerModal, setShowBrokerModal] = React.useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = React.useState(null);
  const [DataMSg, setDataMSg] = React.useState(null);

  // Get broker action previlege
  const memoizedBrokerActionPrevilege = useMemo(
    () => getActionPrevilege("All Broker"),
    []
  );

  const BrokerActionPrevilege = memoizedBrokerActionPrevilege;

  const queryClient = useQueryClient();

  // Fetch lead data and count using React Query
  const brokerTableData = useQuery(
    [useQueryKey[0], page, pageSize, tableDataFunctionParams],
    () => tableDataFunction(page, pageSize, tableDataFunctionParams)
  );

 

  const brokerCount = useQuery(
    useQueryKey[1],
    () => {
      return tableDataCountFunction;
    },
    { enabled: FetchCounting }
  );

  const { mutate, isLoading } = useDeleteSelectedBroker();

  React.useEffect(() => {
    if (showSuccessMessage) {
      brokerCount.refetch();
      setTimeout(() => {
        setShowSuccessMessage(null);
      }, 3000);
    }
    if (DataMSg) {
      setTimeout(() => {
        setDataMSg(null);
      }, 3000);
    }
  }, [showSuccessMessage, DataMSg]);

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
  const HandleImportFun = (data) => {
    brokerCount.refetch();
    setShowModal(false);
    setShowSuccessMessage(data + " Broker details has been imported");
    brokerTableData.refetch();
  };

  const handleEditFun = (data) => {
    dispatch({
      event: "updateglobal_userdata",
      data: JSON.stringify(data),
    });
    setTimeout(() => {
      dispatch({ event: "editbroker" });
    }, 30);
  };

  const handleViewBrokerLead = (data) => {
    dispatch({
      event: "store_new_data",
      data: JSON.stringify(data),
    });
    setTimeout(() => {
      dispatch({ event: "viewbrokerlead" });
    }, 30);
  };
  const handleQuickEditFun = (data) => {
    dispatch({
      event: "updateglobal_userdata",
      data: JSON.stringify(data),
    });
    setTimeout(() => {
      setShowBrokerModal(true); // Show the modal
    }, 30);
  };

  const handleHideModal = () => setShowBrokerModal(false);

  const handleViewFun = (data) => {
    dispatch({
      event: "updateglobal_userdata",
      data: JSON.stringify(data),
    });
    setTimeout(() => {
      dispatch({ event: "viewbroker" });
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
  const handleExport = () => {
    let data;

    // Show the Backdrop when exporting begins
    setShowBackdrop(true);
    if (
      (searchData === "No Data Found" || searchData.length === 0) &&
      selectedRows.length === 0
    ) {
      data = brokerTableData.data?.data;
    } else {
      data = selectedRows;
    }

    // Function to format date and time string
    const formatDateAndTime = (dateTimeString) => {
      if (dateTimeString === "0000-00-00 00:00:00") {
        return ""; // Handle empty date and time strings
      }
      const date = new Date(dateTimeString.replace(" ", "T")); // Convert to ISO format
      return date.toLocaleString(); // Adjust the formatting as needed
    };
    // Hide the Backdrop after exporting is done
    setTimeout(() => {
      // Create a CSV content string from the selectedRows
      const csvContent =
        "data:text/csv;charset=utf-8," +
        encodeURIComponent(
          // Create the header row
          Object.keys(data[0]).join(",") +
            "\n" +
            // Create data rows
            data
              .map((row) => {
                // Map each value, formatting date and time if it's a date and time field
                return Object.values(row)
                  .map((value) => {
                    return value instanceof Date
                      ? formatDateAndTime(value.toISOString())
                      : typeof value === "string" && value.includes(",")
                      ? `"${value}"`
                      : value;
                  })
                  .join(",");
              })
              .join("\n")
        );

      // Create a data URI and trigger download
      const link = document.createElement("a");
      link.setAttribute("href", csvContent);
      link.setAttribute("download", "brokerdetails.csv");
      document.body.appendChild(link);
      link.click();

      setShowBackdrop(false);
    }, 2000);
  };

  const handleMessage = (data) => {
    setShowSuccessMessage(data);
    setTimeout(() => {
      setShowSuccessMessage(null);
    }, 3000);
  };
  const columns = BrokerDetailsColumn();
  return (
    <>
      <Breadcrumb
        PageName={breadcrumbValues.pageName}
        DeleteAll={
          Cookies.get("previous_user") !== undefined
            ? null
            : [
                selectedRows.length > 0 && BrokerActionPrevilege.Delete
                  ? true
                  : false,
                "Delete",
                () => setShowDeleteModal(true),
                <DeleteOutlineRoundedIcon />,
                selectedRows.length > 0 ? false : true,
              ]
        }
        AddButton={
          Cookies.get("previous_user") !== undefined
            ? null
            : [
                breadcrumbValues.addButton && BrokerActionPrevilege.Add,
                "Add Broker",
                null,
                () => dispatch({ event: "addbroker" }),
              ]
        }
        // {breadcrumbValues.assignButton && (
        // AssignButton={[
        //   selectedRows.length > 0 ? true : false,
        //   "Assign Candidate",
        //   () => handleAssign(),
        //   <AssignmentIndOutlinedIcon />,
        //   selectedRows.length > 0 ? false : true,
        // ]}
        ImportLeads={
          Cookies.get("previous_user") !== undefined
            ? null
            : [
                BrokerActionPrevilege.Import,
                "Import",
                () => setShowModal(true),
                <FileDownloadOutlinedIcon />,
              ]
        }
        // Export button for selected or all data
        AddMoreBtn={
          Cookies.get("previous_user") !== undefined
            ? null
            : BrokerActionPrevilege.Export && (
                <Button
                  variant="contained"
                  className="mx-2"
                  startIcon={<FileDownloadOutlinedIcon />}
                  onClick={handleExport}
                >
                  {selectedRows.length > 0 ? "Export Selected" : "Export All"}
                </Button>
              )
        }
        // )}
        actionModulePrevilege={BrokerActionPrevilege}
      />

      <BrokerAdvancedSearch
        PassSearchData={HandleSearchData}
        PassPageName={breadcrumbValues.pageName}
        page={page}
        pageSize={pageSize}
        dispatch={dispatch}
      />

      {showBrokerModal && (
        <CustomBrokerModal
          show={showBrokerModal}
          ModalSize="xl"
          onHide={handleHideModal}
          ModalTitle="Quick Edit Broker"
          handleMessage={handleMessage}
        />
      )}

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
        {/* Display the DataTable component with broker data */}
        {!brokerTableData.isLoading && !brokerCount.isLoading && columns ? (
          <>
            {searchData === "No Data Found" || searchData.length === 0 ? (
              <CustomDataTable
                actionModulePrevilege={BrokerActionPrevilege}
                columns={columns}
                data={brokerTableData.data?.data}
                page={page}
                pageSize={pageSize}
                totalCount={
                  FetchCounting ? brokerCount.data.data : TotalDataCount
                }
                onPageChange={handlePageChange}
                onPageSizeChange={handlePageSizeChange}
                SetSelectedRows={handleSelectedRows}
                selectedRows={selectedRows}
                handleQuickEdit={handleQuickEditFun}
                handleViewBrokerLead={handleViewBrokerLead}
                handleEdit={handleEditFun}
                handleView={handleViewFun}
                ShowCall={true}
                ShowWhatsapp={true}
                ShowEmail={false}
                showAction={showAction}
                showCheckBox={showCheckBox}
                mode="Loan"
              />
            ) : (
              <CustomDataTable
                actionModulePrevilege={BrokerActionPrevilege}
                columns={columns}
                data={searchData?.SearchData.data}
                totalCount={searchData?.SearchCount.data}
                page={page}
                pageSize={pageSize}
                onPageChange={handlePageChange}
                onPageSizeChange={handlePageSizeChange}
                SetSelectedRows={handleSelectedRows}
                selectedRows={selectedRows}
                handleQuickEdit={handleQuickEditFun}
                handleViewBrokerLead={handleViewBrokerLead}
                handleEdit={handleEditFun}
                handleView={handleViewFun}
                ShowCall={true}
                ShowWhatsapp={true}
                ShowEmail={false}
                showAction={showAction}
                showCheckBox={showCheckBox}
                mode="Loan"
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
      {/* DeleteModal component for handling broker deletion */}
      <DeleteModal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        loading={isLoading}
        onclick={() =>
          mutate(selectedRows, {
            onSuccess: (data) => {
              if (data.data === "Broker Details Deleted Successfully") {
                queryClient.invalidateQueries("SubMenuBrokerCount");
                if (Array.isArray(selectedRows[0])) {
                  setShowSuccessMessage(
                    selectedRows[0].length +
                      " Broker Details has been deleted successfully"
                  );
                } else {
                  setShowSuccessMessage(
                    selectedRows.length +
                      " Broker Details has been deleted successfully"
                  );
                }

                brokerTableData.refetch();
                brokerCount.refetch();
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

      {/* CustomModal component for importing broker */}
      <CustomModal
        show={showModal}
        onHide={() => setShowModal(false)}
        ModalTitle="Import Broker Details"
        ModalBody={
          <ImportHandler
            HandleImport={HandleImportFun}
            downloadCSV={() => CustomDownload(brokerCSV, "brokerCSV.csv")}
            ImportAPIUrl={`${myglobalData.API_URL}/broker/import-broker`}
            SideBarInvalidateQueries="SubMenuBrokerCount"
            ImportMsg="Select a file from your computer,
                      accept's: ms-excel or .csv file
                      (working with approx 2,000 broker CSV)"
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

export default BrokerHandler;
