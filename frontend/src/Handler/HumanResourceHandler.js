import React, { useMemo } from "react";
import Breadcrumb from "../components/Breadcrumb/Breadcrumb";
import { useBootstrap, useMui, useSetting } from "../hooks/Hooks";
import CustomDataTable from "./../components/CustomDataTable/CustomDataTable";
import CandidateCSV from "./../csvfile/candidateCSV.csv";
import { useQuery } from "react-query";
import {
  CustomModal, 
  DeleteModal,
} from "./../components/CustomModal/CustomModal";
import { useQueryClient } from "react-query";
import  AllCandidateColumn  from "../data/Columns/HumanResource/AllCandidateColumn";
import { useDeleteSelectedCandidate } from "../hooks/HumanResources/UseCandidateHook";
import CandidateAdvancedSearch from "../components/CandidateAdvancedSearch/CandidateAdvancedSearch";
import ImportHandler from "./ImportHandler";
import { CustomDownload } from "../hooks/Function";
import { getActionPrevilege } from "../setting/ActionModulePrevileges";
import Cookies from "js-cookie";

const HumanResourceHandler = ({
  dispatch,
  tableDataFunction,
  tableDataCountFunction,
  tableDataFunctionParams,
  breadcrumbValues,
  useSearchCandidate,
  isCandidateByStatus = false,
  CandidateByStatus = "",
  isTeamPage = false,
}) => {
  const { Card } = useBootstrap();
  const {
    AssignmentIndOutlinedIcon,
    FileDownloadOutlinedIcon,
    Alert,
    DeleteOutlineRoundedIcon,
    Skeleton,
  } = useMui();
  const { globalData } = useSetting();
  const [showDeleteModal, setShowDeleteModal] = React.useState(false);
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);
  const [selectedRows, setSelectedRows] = React.useState([]);
  const [searchData, setSearchData] = React.useState([]);
  const [showModal, setShowModal] = React.useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = React.useState(null);
  const [DataMSg, setDataMSg] = React.useState(null);

  // Get HR action previlege
  const memoizedBrokerActionPrevilege = useMemo(
    () => getActionPrevilege("Human Resource"),
    []
  );

  const HRActionPrevilege = memoizedBrokerActionPrevilege;

  const queryClient = useQueryClient();

  const candidateTableData = useQuery(
    ["candidates", page, pageSize, tableDataFunctionParams],
    () => tableDataFunction(page, pageSize, tableDataFunctionParams)
  );

  const candidateCount = useQuery("LeadCount", () => {
    return tableDataCountFunction;
  });

  const { mutate, isLoading } = useDeleteSelectedCandidate();

  React.useEffect(() => {
    if (showSuccessMessage) {
      candidateCount.refetch();
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

  const handleAssign = () => {
    const candidateIds = selectedRows.map((entry) => entry.c_id);
    dispatch({
      event: "updateglobal_userdata",
      data: JSON.stringify(candidateIds),
    });
    setTimeout(() => {
      dispatch({ event: "assigncandidatefrom" });
    }, 30);
  };

  const HandleImportFun = (data) => {
    setShowModal(false);
    setShowSuccessMessage(data + " Leads has been imported");
  };

  const handleEditFun = (data) => {
    dispatch({
      event: "updateglobal_userdata",
      data: JSON.stringify(data),
    });
    setTimeout(() => {
      dispatch({ event: "editcandidate" });
    }, 30);
  };

  const handleQuickEditFun = (data) => {
    dispatch({
      event: "updateglobal_userdata",
      data: JSON.stringify(data),
    });
    setTimeout(() => {
      dispatch({ event: "quickeditcandidate" });
    }, 30);
  };

  const handleViewFun = (data) => {
    dispatch({
      event: "updateglobal_userdata",
      data: JSON.stringify(data),
    });
    setTimeout(() => {
      dispatch({ event: "viewcandidate" });
    }, 30);
  };

  React.useEffect(() => {
    setShowSuccessMessage(localStorage.getItem("successMessage"));
    setTimeout(() => {
      setShowSuccessMessage(null);
      localStorage.removeItem("successMessage");
    }, 3000);
  }, []);

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
const columns = AllCandidateColumn();
  return (
    <>
      <Breadcrumb
        PageName={breadcrumbValues.pageName}
        DeleteAll={Cookies.get("previous_user") !== undefined ? null:
          [
          selectedRows.length > 0 && HRActionPrevilege.Delete ? true : false,
          "Delete",
          () => setShowDeleteModal(true),
          <DeleteOutlineRoundedIcon />,
          selectedRows.length > 0 ? false : true,
        ]}
        AddButton={Cookies.get("previous_user") !== undefined ? null:[
          breadcrumbValues.addButton && HRActionPrevilege.Add,
          "Add Candidate",
          null,
          () => dispatch({ event: "addcandidate" }),
        ]}
        // {breadcrumbValues.assignButton && (
          AssignButton={Cookies.get("previous_user") !== undefined ? null:[
            selectedRows.length > 0 && HRActionPrevilege.Assign ? true : false,
            "Assign Candidate",
            () => handleAssign(),
            <AssignmentIndOutlinedIcon />,
            selectedRows.length > 0 ? false : true,
          ]}
        ImportLeads={Cookies.get("previous_user") !== undefined ? null:[
          HRActionPrevilege.Import,
          "Import",
          () => setShowModal(true),
          <FileDownloadOutlinedIcon />,
        ]}
        actionModulePrevilege={HRActionPrevilege}
      />
      {isCandidateByStatus ? (
        <CandidateAdvancedSearch
          PassSearchData={HandleSearchData}
          PassPageName={breadcrumbValues.pageName}
          page={page}
          pageSize={pageSize}
          dispatch={dispatch}
          isCandidateByStatus={isCandidateByStatus}
          CandidateByStatus={CandidateByStatus}
          useSearchCandidate={useSearchCandidate}
          isTeamPage={isTeamPage}
        />
      ) : (
        <CandidateAdvancedSearch
          actionModulePrevilege={HRActionPrevilege}
          PassSearchData={HandleSearchData}
          PassPageName={breadcrumbValues.pageName}
          page={page}
          pageSize={pageSize}
          dispatch={dispatch}
        />
      )}
      <Card className="mt-3">
        <Card.Body>
          {showSuccessMessage && (
            <Alert severity="success" sx={{ my: 2 }}>
              {showSuccessMessage}
            </Alert>
          )}
          {DataMSg && <Alert severity="warning">{DataMSg}</Alert>}
          {!candidateTableData.isLoading && !candidateCount.isLoading ? (
            <>
              {searchData === "No Data Found" || searchData.length === 0 ? (
                <CustomDataTable
                  actionModulePrevilege={HRActionPrevilege}
                  columns={columns}
                  data={candidateTableData.data?.data}
                  page={page}
                  pageSize={pageSize}
                  totalCount={candidateCount.data?.data}
                  onPageChange={handlePageChange}
                  onPageSizeChange={handlePageSizeChange}
                  SetSelectedRows={handleSelectedRows}
                  selectedRows={selectedRows}
                  handleQuickEdit={handleQuickEditFun}
                  handleEdit={handleEditFun}
                  handleView={handleViewFun}
                  ShowCall={true}
                  ShowWhatsapp={true}
                  ShowEmail={true}
                  mode="Candidates"
                />
              ) : (
                <CustomDataTable
                  actionModulePrevilege={HRActionPrevilege}
                  columns={columns}
                  data={searchData?.SearchData.data}
                  page={page}
                  pageSize={pageSize}
                  totalCount={searchData?.SearchCount.data}
                  onPageChange={handlePageChange}
                  onPageSizeChange={handlePageSizeChange}
                  SetSelectedRows={handleSelectedRows}
                  selectedRows={selectedRows}
                  handleQuickEdit={handleQuickEditFun}
                  handleEdit={handleEditFun}
                  handleView={handleViewFun}
                  ShowCall={true}
                  ShowWhatsapp={true}
                  ShowEmail={true}
                  mode="Candidates"
                />
              )}
            </>
          ) : (
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
        </Card.Body>
      </Card>
      <DeleteModal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        loading={isLoading}
        onclick={() =>
          mutate(selectedRows, {
            onSuccess: (data) => {
              if (data.data === "Candidate Deleted Successfully") {
                // queryClient.invalidateQueries("SubMenuLeadCount");
                setShowDeleteModal(false);
                setShowSuccessMessage(
                  selectedRows.length +
                    " Candidate has been deleted successfully"
                );
                candidateTableData.refetch();
                candidateCount.refetch();
                setSelectedRows([]);
                setTimeout(() => {
                  setShowSuccessMessage(null);
                }, 3000);
              }
            },
          })
        }
      />
      <CustomModal
        show={showModal}
        onHide={() => setShowModal(false)}
        ModalTitle="Import Candidates Details"
        ModalBody={
          <ImportHandler
            HandleImport={HandleImportFun}
            downloadCSV={() => CustomDownload(CandidateCSV, "CandidateCSV.csv")}
            ImportAPIUrl={`${globalData.API_URL}/import-candidate/import-hr-head-candidate`}
            SideBarInvalidateQueries="SubMenuCandidateCount"
            ImportMsg="Select a file from your computer,
                        accept's: ms-excel or .csv file
                        (working with approx 2,000 candidate CSV)"
          />
        }
        // ModalBody={<ImportCandidate HandleImport={HandleImportFun} />}
      />
    </>
  );
};

export default HumanResourceHandler;
