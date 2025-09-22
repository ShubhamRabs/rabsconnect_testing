// CommonComponent.js

import React, { useMemo, useState } from "react";
import { useQuery } from "react-query";
import { Formik, Form } from "formik";
import {
  CustomInputField,
  CustomSelectField,
} from "../components/FormUtility/FormUtility";
import SmallDataTable from "../components/SmallDataTable/SmallDataTable";
import Breadcrumb from "../components/Breadcrumb/Breadcrumb";
import {
  CustomModal,
  DeleteModal,
} from "../components/CustomModal/CustomModal";
import { useBootstrap, useMui } from "../hooks/Hooks";
import { getActionPrevilege } from "../setting/ActionModulePrevileges";
import Cookies from "js-cookie";

const DynamicFieldsHandler = ({
  // Props to configure the dynamic fields handler
  pageName,
  AddButtonLabel,
  columns,
  ApiCallsArray,
  validationSchema,
  modalTitle,
  initialValuesArray,
  SelectField,
  InputField,
  InputFieldTwo,
  ReactQueryKey,
  selectedDropdownValue,
}) => {
  // State and queries for managing modal and data
  const { Row, Col, Card } = useBootstrap();
  const { LoadingButton, Divider, Alert } = useMui();
  const [initialValues, setInitialValues] = useState({
    id: "",
    [initialValuesArray[0]]: "",
    [initialValuesArray[1]]: "",
  });
  const [showModal, setShowModal] = useState({
    type: "Add",
    show: false,
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(null);
  const [ID, setID] = useState(false);

  const allData = useQuery([ReactQueryKey], () => ApiCallsArray[0]());

    // Get Dynamic action previlege
    const memoizedDynamicFieldActionPrevilege = useMemo(
      () => getActionPrevilege("Dynamic Fields"),
      []
    );
  
    const DynamicActionPrevilege = memoizedDynamicFieldActionPrevilege;

  // Functions to handle CRUD operations
  const handleAdd = () => {
    // Logic for handling "Add" button click
    setInitialValues({
      id: "",
      [initialValuesArray[0]]:
        selectedDropdownValue === undefined ? "" : selectedDropdownValue,
      [initialValuesArray[1]]: "",
    });
    setShowModal({
      type: "Add",
      show: true,
    });
  };

  const handleEdit = (data) => {
    // Logic for handling "Edit" button click
    setShowModal({
      type: "Edit",
      show: true,
    });
    setInitialValues({
      id: data.id,
      [initialValuesArray[0]]: data[initialValuesArray[0]],
      [initialValuesArray[1]]: data[initialValuesArray[1]],
    });
  };

  const { mutate: AddMutate, isLoading: AddisLoading } = ApiCallsArray[1]();
  const { mutate: EditMutate, isLoading: EditisLoading } = ApiCallsArray[2]();
  const { mutate: DeleteMutate, isLoading: DeleteisLoading } =
    ApiCallsArray[3]();

  // Logic for handling "Add" form submission
  const handleAddSubmit = (values) => {
    AddMutate(values, {
      onSuccess: (data) => {
        allData.refetch();
        setShowModal({ type: "Add", show: false });
        setShowSuccessMessage(data);
        setTimeout(() => {
          setShowSuccessMessage(null);
        }, 3000);
      },
    });
  };

  // Logic for handling "Edit" form submission
  const handleEditSubmit = (values) => {
    EditMutate(values, {
      onSuccess: (data) => {
        allData.refetch();
        setShowModal({ type: "Edit", show: false });
        setShowSuccessMessage(data);
        setTimeout(() => {
          setShowSuccessMessage(null);
        }, 3000);
      },
    });
  };

  // Logic for handling "Delete" button click
  const handleDelete = (id) => {
    setShowDeleteModal(true);
    setID(id);
  };

  // Rendering and UI components
  return (
    <>
      {/* ... Breadcrumb component ... */}
      <Breadcrumb
        PageName={pageName}
        AddButton={Cookies.get("previous_user") !== undefined ? null:
          [DynamicActionPrevilege.Add, AddButtonLabel, null, handleAdd]
        }
        actionModulePrevilege={DynamicActionPrevilege}
      />
      {/* ... CustomModal component for Add/Edit ... */}
      <CustomModal
        show={showModal.show}
        onHide={() => setShowModal(false)}
        ModalTitle={
          showModal.type === "Edit" ? `Edit ${modalTitle}` : `Add ${modalTitle}`
        }
        ModalBody={
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={
              showModal.type === "Add" ? handleAddSubmit : handleEditSubmit
            }
          >
            {({ values, setFieldValue }) => (
              <Form>
                <Row>
                  {SelectField && SelectField[0] === true && (
                    <Col md={12}>
                      <h3 className="custom-form-label">
                        {SelectField[1]}
                        <span className="required-label">*</span>
                      </h3>
                      <CustomSelectField
                        name={SelectField[2]}
                        isLabelValue={true}
                        FieldValue={setFieldValue}
                        values={values}
                        placeholder={SelectField[3]}
                        options={SelectField[4]}
                        initialValue={{
                          label: initialValues[initialValuesArray[0]],
                          value: initialValues[initialValuesArray[0]],
                        }}
                      />
                    </Col>
                  )}
                  {InputField && InputField[0] === true && (
                    <Col
                      md={12}
                      className={
                        SelectField && SelectField[0] === true ? "mt-4" : "mt-0"
                      }
                    >
                      <h3 className="custom-form-label">
                        {InputField[1]}
                        <span className="required-label">*</span>
                      </h3>
                      <CustomInputField
                        type="text"
                        name={InputField[2]}
                        placeholder={InputField[1]}
                      />
                    </Col>
                  )}
                  {InputFieldTwo && InputFieldTwo[0] === true && (
                    <Col md={12} className="mt-4">
                      <h3 className="custom-form-label">
                        {InputFieldTwo[1]}
                        <span className="required-label">*</span>
                      </h3>
                      <CustomInputField
                        type="text"
                        name={InputFieldTwo[2]}
                        placeholder={InputFieldTwo[1]}
                      />
                    </Col>
                  )}
                </Row>
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
                      ? `Edit ${modalTitle}`
                      : `Add ${modalTitle}`}
                  </LoadingButton>
                </div>
              </Form>
            )}
          </Formik>
        }
      />
      {/* ... DeleteModal component ... */}
      <DeleteModal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        loading={DeleteisLoading}
        onclick={() =>
          DeleteMutate(ID, {
            onSuccess: (data) => {
              allData.refetch();
              setShowDeleteModal(false);
              setShowSuccessMessage(data);
              setTimeout(() => {
                setShowSuccessMessage(null);
              }, 3000);
            },
          })
        }
      />
      {/* ... Card component for displaying data ... */}
      <Card className="mt-3">
        <Card.Body>
          <Card.Title>{`${modalTitle}`}</Card.Title>
          <Divider />
          {showSuccessMessage && (
            <Alert severity="info">{showSuccessMessage}</Alert>
          )}
          {!allData.isLoading ? (
            <SmallDataTable
              columns={columns}
              data={allData.data}
              handleEdit={handleEdit}
              handleDelete={handleDelete}
              actionModulePrevilege={DynamicActionPrevilege}
            />
          ) : null}
        </Card.Body>
      </Card>
    </>
  );
};

export default DynamicFieldsHandler;
