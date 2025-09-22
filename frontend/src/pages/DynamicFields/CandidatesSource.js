// Import necessary dependencies and components
import React, { useMemo } from "react";
import Breadcrumb from "../../components/Breadcrumb/Breadcrumb";
import { useBootstrap, useMui } from "../../hooks/Hooks";
import SmallDataTable from "../../components/SmallDataTable/SmallDataTable";
import { useQuery } from "react-query";
import {
  GetAllCandidatesSource,
  useAddCandidatesSource,
  useDeleteCandidatesSource,
  useEditCandidatesSource,
} from "../../hooks/DynamicFields/UseCandidatesSourceHook";
import { CandidatesSourceColumns } from "../../data/Columns/DynamicFields/CandidatesSourceColumns";
import {
  CustomModal,
  DeleteModal,
} from "../../components/CustomModal/CustomModal";
import Cookies from "js-cookie";
import { Form, Formik } from "formik";
import { CustomInputField } from "../../components/FormUtility/FormUtility";
import { CandidatesSourceSchema } from "../../schema/DynamicFields";
import { getActionPrevilege } from "../../setting/ActionModulePrevileges";
// Define the CandidatesSource component
const CandidatesSource = () => {
  const { Card, Row, Col } = useBootstrap();
  const { Divider, LoadingButton, Alert } = useMui();

  const [showModal, setShowModal] = React.useState({
    type: "Add",
    show: false,
  });
  const [initialValues, setInitialValues] = React.useState({
    id: "",
    candidate_source: "",
  });
  const [showDeleteModal, setShowDeleteModal] = React.useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = React.useState(null); // New state for success message
  const [ID, setID] = React.useState(false);

  // Get Dynamic action previlege
  const memoizedDynamicFieldActionPrevilege = useMemo(
    () => getActionPrevilege("Dynamic Fields"),
    []
  );

  const DynamicActionPrevilege = memoizedDynamicFieldActionPrevilege;

  const { mutate: AddMutate, isLoading: AddisLoading } =
    useAddCandidatesSource();
  const { mutate: EditMutate, isLoading: EditisLoading } =
    useEditCandidatesSource();
  const { mutate: DeleteMutate, isLoading: DeleteisLoading } =
    useDeleteCandidatesSource();

  const AllCandidatesSource = useQuery("AllCandidatesSource", () => {
    return GetAllCandidatesSource();
  });

  const HandleAddFun = () => {
    setInitialValues({
      id: "",
      candidate_source: "",
    });
    setShowModal({
      type: "Add",
      show: true,
    });
  };

  const HandleAddSubmit = (values) => {
    AddMutate(values, {
      onSuccess: (data) => {
        AllCandidatesSource.refetch();
        setShowModal({ type: "Add", show: false });
        setShowSuccessMessage(data.data);
        setTimeout(() => {
          setShowSuccessMessage(null);
        }, 3000);
      },
    });
  };

  const HandleEditSubmit = (values) => {
    EditMutate(values, {
      onSuccess: (data) => {
        AllCandidatesSource.refetch();
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
      id: data.id, // Replace with the desired initial value
      candidate_source: data.candidate_source, // Replace with the desired initial value
    });
  };

  const handleDeleteFun = (id) => {
    setShowDeleteModal(true);
    setID(id);
  };

  return (
    <>
      <Breadcrumb
        PageName="Candidates Source"
        AddButton={Cookies.get("previous_user") !== undefined ? null:[DynamicActionPrevilege.Add, "Add Candidates Source", null, () => HandleAddFun()]}
      />
      <CustomModal
        show={showModal.show}
        onHide={() => setShowModal(false)}
        ModalTitle={
          showModal.type === "Edit"
            ? "Edit Candidates Source"
            : "Add Candidates Source"
        }
        ModalBody={
          <Formik
            initialValues={initialValues}
            validationSchema={CandidatesSourceSchema}
            onSubmit={
              showModal.type === "Add" ? HandleAddSubmit : HandleEditSubmit
            }
          >
            {({ values, setFieldValue }) => (
              <Form>
                <Row>
                  <Col md={12}>
                    <h3 className="custom-form-label">
                      Candidates Source
                      <span className="required-label">*</span>
                    </h3>
                    <CustomInputField
                      type="text"
                      name="candidate_source"
                      placeholder="Enter Candidates Source"
                    />
                  </Col>
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
                        ? "Edit Candidates Source"
                        : "Add Candidates Source"}
                    </LoadingButton>
                  </div>
                </Row>
              </Form>
            )}
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
              AllCandidatesSource.refetch();
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
          <Card.Title>All Candidates Source</Card.Title>
          <Divider />
          {showSuccessMessage && (
            <Alert severity="info">{showSuccessMessage}</Alert>
          )}
          {!AllCandidatesSource.isLoading ? (
            <SmallDataTable
              columns={CandidatesSourceColumns}
              data={AllCandidatesSource.data}
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

export default CandidatesSource;
