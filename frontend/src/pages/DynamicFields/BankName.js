import React from "react";
import Breadcrumb from "../../components/Breadcrumb/Breadcrumb";
import SmallDataTable from "../../components/SmallDataTable/SmallDataTable";
import { BankNameColumns } from "../../data/Columns/DynamicFields/BankNameColumns";
import { useQuery } from "react-query";
import { useBootstrap, useMui } from "../../hooks/Hooks";
import { Form, Formik } from "formik";
import {
  CustomInputField,
  CustomFormGroup,
  CustomSelectIdNameField,
} from "../../components/FormUtility/FormUtility";
import { getActionPrevilege } from "../../setting/ActionModulePrevileges";
import {
  CustomModal,
  DeleteModal,
} from "../../components/CustomModal/CustomModal";
import {
  GetAllBankName,
  useDeleteBankName,
  useEditBankName,
  useAddBankName,
} from "../../hooks/DynamicFields/useBankNameHook";
import { BanknameSchema } from "../../schema/DynamicFields";
import { gstcode } from "./../../data/BankName";
import Cookies from "js-cookie";

const BankName = () => {
  const { Card, Row, Col } = useBootstrap();
  const { Divider, LoadingButton, Alert } = useMui();
  const [showModal, setShowModal] = React.useState({
    type: "Add",
    show: false,
  });
  const [initialValues, setInitialValues] = React.useState({
    bank_id: "",
    bank_name: "",
    acc_num: "",
    branch_name: "",
    ifsc_code: "",
    pan_num: "",
    gst_status: "",
    gst_code: "",
  });

  const [ID, setID] = React.useState(false);
  const [showDeleteModal, setShowDeleteModal] = React.useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = React.useState(null);

  // Get Dynamic action previlege
  const memoizedDynamicFieldActionPrevilege = React.useMemo(
    () => getActionPrevilege("Dynamic Fields"),
    []
  );

  const DynamicActionPrevilege = memoizedDynamicFieldActionPrevilege;

  const { mutate: DeleteMutate, isLoading: DeleteisLoading } =
    useDeleteBankName();
  const { mutate: EditMutate, isLoading: EditisLoading } = useEditBankName();
  const { mutate: AddMutate, isLoading: AddisLoading } = useAddBankName();

  const AllBankName = useQuery("AllBankName", () => {
    return GetAllBankName(undefined);
  });

  // console.log(AllBankName);

  const handleDeleteFun = (id) => {
    setShowDeleteModal(true);
    setID(id);
  };

  const HandleAddFun = () => {
    setInitialValues({
      id: "",
      bank_name: "",
      acc_num: "",
      branch_name: "",
      ifsc_code: "",
      pan_num: "",
      gst_status: "",
      gst_code: "",
    });
    setShowModal({
      type: "Add",
      show: true,
    });
  };
  const HandleAddSubmit = (values) => {
    AddMutate(values, {
      onSuccess: (data) => {
        console.log("add successful :.....", data);
        AllBankName.refetch();
        setShowModal({ type: "Add", show: false });
        setShowSuccessMessage(data);
        setTimeout(() => {
          setShowSuccessMessage(null);
        }, 3000);
      },
    });
  };

  const HandleEditSubmit = (values) => {
    if(values.gst_status == "no"){
      values.gst_code = ""
    }
    EditMutate(values, {
      onSuccess: (data) => {
        console.log("after editing", data);
        AllBankName.refetch();
        setShowModal({ type: "Edit", show: false });
        setShowSuccessMessage(data);
        setTimeout(() => {
          setShowSuccessMessage(null);
        }, 3000);
      },
    });
  };

  const HandleEditFun = (data) => {
    setShowModal({
      type: "Edit",
      show: true,
    });
    setInitialValues({
      bank_id: data.id,
      bank_name: data.bank_name,
      acc_num: data.acc_num,
      branch_name: data.branch_name,
      ifsc_code: data.ifsc_code,
      pan_num: data.pan_num,
      gst_status: data.gst_status,
      gst_code: data.gst_code,
    });
  };

  return (
    <>
      <Breadcrumb
        PageName="Bank Name"
        AddButton={Cookies.get("previous_user") !== undefined ? null:[
          DynamicActionPrevilege.Add,
          "Add Bank Name",
          null,
          () => HandleAddFun(),
        ]}
      />
      <CustomModal
        show={showModal.show}
        onHide={() => setShowModal(false)}
        ModalTitle={
          showModal.type === "Edit" ? "Edit Bank Name" : "Add Bank Name"
        }
        ModalBody={
          <Formik
            initialValues={initialValues}
            validationSchema={BanknameSchema}
            onSubmit={
              showModal.type === "Add" ? HandleAddSubmit : HandleEditSubmit
            }
          >
            {({ values, setFieldValue,errors }) => {
              console.log("errors", initialValues.gst_status);
              return (
              <Form>
                <Row>
                  <CustomFormGroup
                    md={12}
                    formlabel="Bank Name"
                    star="*"
                    FormField={
                      <CustomInputField
                        type="text"
                        name="bank_name"
                        placeholder="Enter Bank Name"
                      />
                    }
                  />
                  <CustomFormGroup
                    md={12}
                    formlabel="Account Number"
                    star="*"
                    FormField={
                      <CustomInputField
                        type="text"
                        name="acc_num"
                        placeholder="Enter Account Number"
                      />
                    }
                  />
                  <CustomFormGroup
                    md={12}
                    formlabel="Branch Name"
                    star="*"
                    FormField={
                      <CustomInputField
                        type="text"
                        name="branch_name"
                        placeholder="Enter Branch Name"
                      />
                    }
                  />
                  <CustomFormGroup
                    md={12}
                    formlabel="IFSC Code"
                    star="*"
                    FormField={
                      <CustomInputField
                        type="text"
                        name="ifsc_code"
                        placeholder="Enter IFSC Code"
                      />
                    }
                  />
                  <CustomFormGroup
                    md={12}
                    formlabel="PAN Number"
                    star="*"
                    FormField={
                      <CustomInputField
                        type="text"
                        name="pan_num"
                        placeholder="Enter PAN Number"
                        onChange={(e) => {
                          setFieldValue("pan_num", e.target.value.toUpperCase());
                        }}
                      />
                    }
                  />
                  <CustomFormGroup
                    md={12}
                    formlabel="GST Status"
                    star="*"
                    FormField={
                      <CustomSelectIdNameField
                        name="gst_status"
                        isLabelValue={true}
                        FieldValue={setFieldValue}
                        placeholder="Select GST Status"
                        options={gstcode}
                        initialValue={{value:initialValues.gst_status,label:initialValues.gst_status}}
                      />
                    }
                  />
                  {values.gst_status === "yes" ? (
                    <CustomFormGroup
                      md={12}
                      formlabel="GST Code"
                      star="*"
                      FormField={
                        <CustomInputField
                          type="text"
                          // FieldValue={setFieldValue}
                          placeholder="Enter GST Code"
                          name="gst_code"
                          InputWidth="100%"
                        />
                      }
                    />
                  ) : null}
                  <div className="text-center mt-3">
                    <LoadingButton
                      type="submit"
                      variant="contained"
                      loading={
                        showModal.type === "Add" ? AddisLoading : EditisLoading
                      }
                      disabled={
                        showModal.type === "Add" ? AddisLoading : EditisLoading
                      }
                    >
                      {showModal.type === "Edit"
                        ? "Edit Bank Name"
                        : "Add Bank Name"}
                    </LoadingButton>
                  </div>
                </Row>
              </Form>
            )}}
          </Formik>
        }
      />
      <DeleteModal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        loading={DeleteisLoading}
        onclick={() =>
          DeleteMutate(ID, {
            onSuccess: (data) => {
              AllBankName.refetch();
              setShowDeleteModal(false);
              setShowSuccessMessage(data);
              setTimeout(() => {
                setShowSuccessMessage(null);
              }, 3000);
            },
          })
        }
      />
      <Card>
        <Card.Body>
          <Card.Title>All Bank Name</Card.Title>
          <Divider />
          {showSuccessMessage && (
            <Alert severity="info">{showSuccessMessage}</Alert>
          )}
          {!AllBankName.isLoading ? (
            <SmallDataTable
              columns={BankNameColumns}
              data={Array.isArray(AllBankName.data) ? AllBankName.data : []}
              handleEdit={HandleEditFun}
              handleDelete={handleDeleteFun}
              actionModulePrevilege={DynamicActionPrevilege}
            />
          ) : null}
        </Card.Body>
      </Card>
    </>
  );
};

export default BankName;