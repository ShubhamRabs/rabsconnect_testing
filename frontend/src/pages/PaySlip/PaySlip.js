import React, { useState } from "react";
import { useMui, useSetting } from "../../hooks/Hooks";
import CustomDataTable from "../../components/CustomDataTable/CustomDataTable";
import {
  PayslipActionPrevilege,
  PayslipColumns,
} from "../../data/Columns/Payslip/PayslipColumns";
import { useQuery, useQueryClient } from "react-query";
import {
  useAllPayslip,
  useDeletePayslip,
} from "../../hooks/PaySlip/UsePaySlip";
import Breadcrumb from "../../components/Breadcrumb/Breadcrumb";
import { DeleteModal } from "../../components/CustomModal/CustomModal";
import Cookies from "js-cookie";

const PaySlip = ({ dispatch }) => {
  const { Card, DeleteOutlineRoundedIcon } = useMui();
  const [payslip, setPayslip] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(null);

  const { mutate, isLoading } = useDeletePayslip();

  const payslipData = useQuery("payslip", useAllPayslip, {
    onSuccess: (data) => {
      setPayslip(data.data);
      console.log(data.data);
    },
  });

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

  const handleView = (data) => {
    dispatch({
      event: "updateglobal_userdata",
      data: JSON.stringify(data),
    });
    setTimeout(() => {
      dispatch({ event: "viewpayslip" });
    }, 30);
    console.log(data);
  };

  const handleEdit = (data) => {
    dispatch({
      event: "updateglobal_userdata",
      data: JSON.stringify(data),
    });
    setTimeout(() => {
      dispatch({ event: "updatepayslip" });
    }, 30);
  };

  const queryClient = useQueryClient();

  return (
    <div>
      <Breadcrumb
        PageName={"Payslip"}
        DeleteAll={
          Cookies.get("previous_user") !== undefined
            ? null
            : [
                selectedRows.length > 0 && PayslipActionPrevilege.Delete
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
                selectedRows.length === 0,
                "Add Payslip",
                null,
                () => dispatch({ event: "addpayslip" }),
              ]
        }
      />
      <Card>
        {/* <CustomDataTable/> */}
        {!payslipData.isLoading ? (
          <CustomDataTable
            actionModulePrevilege={PayslipActionPrevilege}
            columns={PayslipColumns}
            data={payslip}
            page={1}
            pageSize={50}
            totalCount={payslip.length}
            onPageChange={() => {}}
            onPageSizeChange={() => {}}
            showAction={true}
            showCheckBox={true}
            hideToolTip={false}
            handleEdit={handleEdit}
            handleView={handleView}
            SetSelectedRows={handleSelectedRows}
            selectedRows={selectedRows}
          />
        ) : (
          <p>Loading</p>
        )}
      </Card>
      <DeleteModal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        loading={isLoading}
        onclick={() =>
          mutate(selectedRows, {
            onSuccess: (data) => {
              queryClient.invalidateQueries("payslip");
              // if (Array.isArray(selectedRows[0])) {
              //   alert(
              //     selectedRows[0].length +
              //       " Leads has been deleted successfully"
              //   );
              // } else {
              //   alert(
              //     selectedRows.length + " Leads has been deleted successfully"
              //   );
              // }
              payslipData.refetch();
              // leadCount.refetch();
              setSelectedRows([]);
              setShowDeleteModal(false);
              setTimeout(() => {
                setShowSuccessMessage(null);
              }, 3000);
            },
          })
        }
      />
    </div>
  );
};

export default PaySlip;
