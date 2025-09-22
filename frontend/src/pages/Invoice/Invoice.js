import React, { useMemo } from "react";
import Breadcrumb from "../../components/Breadcrumb/Breadcrumb";
import {
  GetAllInvoiceDetails,
  TotalInvoiceTableDataCount,
  useDeleteSelectedInvoice,
} from "../../hooks/Invoice/UseInvoiceHook";
import { DeleteModal } from "../../components/CustomModal/CustomModal";
import { useQuery } from "react-query";
import CustomDataTable from "../../components/CustomDataTable/CustomDataTable";
import { InvoiceDetailsColumn } from "../../data/Columns/Invoice/InvoiceDetailsColumn";
import { useBootstrap, useMui } from "../../hooks/Hooks";
import { getActionPrevilege } from "../../setting/ActionModulePrevileges";
import { useQueryClient } from "react-query";
import Cookies from "js-cookie";

// import ProfilePic from "../../assets/Image/user.png";
import "./../../assets/css/Invoice.css";

const Invoice = ({ dispatch }) => {
  const { Card } = useBootstrap();
  const { Skeleton, DeleteOutlineRoundedIcon, Alert } = useMui();

  const [selectedRows, setSelectedRows] = React.useState([]);
  const [showDeleteModal, setShowDeleteModal] = React.useState(false);

  const queryClient = useQueryClient();
  const [showSuccessMessage, setShowSuccessMessage] = React.useState(null);
  const [DataMSg, setDataMSg] = React.useState(null);

  const memoizedInvoiceActionPrevilege = useMemo(
    () => getActionPrevilege("All Invoice"),
    []
  );

  const InvoiceActionPrevilege = memoizedInvoiceActionPrevilege;

  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);

  const invoiceTableData = useQuery(
    [GetAllInvoiceDetails, page, pageSize],
    () => GetAllInvoiceDetails(page, pageSize)
  );

  const totalInvoiceTableDataCount = useQuery(
    [TotalInvoiceTableDataCount],
    () => TotalInvoiceTableDataCount()
  );

  // const brokerCount = useQuery(
  //   useQueryKey[1],
  //   () => {
  //     return tableDataCountFunction;
  //   },
  //   { enabled: FetchCounting }
  // );

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handlePageSizeChange = (newSize) => {
    setPageSize(newSize);
  };

  const handleEditFun = (data) => {
    dispatch({
      event: "updateglobal_userdata",
      data: JSON.stringify(data),
    });
    setTimeout(() => {
      dispatch({ event: "editinvoice" });
    }, 30);
  };

  const handleViewFun = (data) => {
    console.log(data);
    dispatch({
      event: "updateglobal_userdata",
      data: JSON.stringify(data),
    });
    setTimeout(() => {
      dispatch({ event: "viewinvoice" });
    }, 30);
  };

  const handleDeleteFun = (data) => {
    // dispatch({
    //   event: "updateglobal_userdata",
    //   data: JSON.stringify(data),
    // });
    // setTimeout(() => {
    //   dispatch({ event: "deleteinvoice" });
    // }, 30);
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

  console.log(showSuccessMessage);

  React.useEffect(() => {
    if (showSuccessMessage) {
      // totalInvoiceTableDataCount.refetch();
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

  React.useEffect(() => {
    // Display success message from localStorage
    setShowSuccessMessage(localStorage.getItem("successMessage"));
    setTimeout(() => {
      setShowSuccessMessage(null);
      localStorage.removeItem("successMessage");
    }, 3000);
  }, []);

  const { mutate, isLoading } = useDeleteSelectedInvoice();

  return (
    <div>
      <Breadcrumb
        PageName="Invoice"
        AddButton={Cookies.get("previous_user") !== undefined ? null:[
          true,
          "Add Invoice",
          null,
          () => dispatch({ event: "addinvoice" }),
        ]}
        DeleteAll={Cookies.get("previous_user") !== undefined ? null:[
          selectedRows.length > 0 && InvoiceActionPrevilege.Delete
            ? true
            : false,
          "Delete",
          () => setShowDeleteModal(true),
          <DeleteOutlineRoundedIcon />,
          selectedRows.length > 0 ? false : true,
          console.log(selectedRows[0]),
        ]}
      />
      <Card className="mt-3">
        {showSuccessMessage && (
          <Alert severity="success" sx={{ my: 2 }}>
            {showSuccessMessage}
          </Alert>
        )}
        {/* Display the DataTable component with broker data */}
        {!invoiceTableData.isLoading && !invoiceTableData.isLoading ? (
          <>
            <CustomDataTable
              // actionModulePrevilege = {BrokerActionPrevilege}
              columns={InvoiceDetailsColumn}
              data={invoiceTableData.data?.data}
              page={page}
              pageSize={pageSize}
              totalCount={totalInvoiceTableDataCount.data.data}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
              SetSelectedRows={handleSelectedRows}
              selectedRows={selectedRows}
              // handleQuickEdit={handleQuickEditFun}
              handleEdit={handleEditFun}
              handleView={handleViewFun}
              ShowCall={false}
              ShowWhatsapp={false}
              ShowEmail={false}
              showAction={true}
              showCheckBox={true}
              mode="Loan"
            />
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
      <DeleteModal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        loading={isLoading}
        onclick={() =>
          mutate(selectedRows, {
            onSuccess: (data) => {
              // console.log("selected : ", selectedRows[0]);
              console.log("deleted data : ", data.data);
              if (data.data === "Invoice Details Deleted Successfully") {
                queryClient.invalidateQueries("SubMenuInvoiceCount");
                console.log("selected : ", Array.isArray(selectedRows.lengths));
                console.log("msg : ", selectedRows.length);
                console.log("sucess msg : ", setShowSuccessMessage);
                if (Array.isArray(selectedRows[0])) {
                  console.log("if confition");
                  // if (selectedRows.length) {
                  setShowSuccessMessage(
                    selectedRows[0].length +
                      " Invoice Details has been deleted successfully"
                  );
                } else {
                  console.log("Else confition");
                  setShowSuccessMessage(
                    selectedRows.length +
                      " Invoice Details has been deleted successfully"
                  );
                }
                invoiceTableData.refetch();
                // invoiceCount.refetch();
                setSelectedRows([]);
                setShowDeleteModal(false);
                setTimeout(() => {
                  setShowSuccessMessage(null);
                }, 3000);
                // console.log("show delete : ", setTimeout);
              }
            },
          })
        }
      />
    </div>
  );
};

export default Invoice;