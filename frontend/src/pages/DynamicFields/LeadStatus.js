import React, { useMemo } from "react";
import Breadcrumb from "../../components/Breadcrumb/Breadcrumb";
import { useQuery } from "react-query";
import { useBootstrap, useMui } from "../../hooks/Hooks";
import SmallDataTable from "../../components/SmallDataTable/SmallDataTable";
import {
  GetAllLeadStatus,
  useAddLeadStatus,
  useDeleteLeadStatus,
  useEditLeadStatus,
} from "../../hooks/DynamicFields/UseLeadStatusHook";
import { LeadStatusColumns } from "../../data/Columns/DynamicFields/LeadStatusColumns";
import {
  CustomModal,
  DeleteModal,
} from "../../components/CustomModal/CustomModal";
import { Formik, Form } from "formik";
import StatusColor from "../../components/StatusColor/StatusColor";
import { CustomInputField } from "../../components/FormUtility/FormUtility";
import { LeadStatusSchema } from "../../schema/DynamicFields";
import { getActionPrevilege } from "../../setting/ActionModulePrevileges";
import { ColorPicker, useColor } from "react-color-palette";
import "react-color-palette/css";
import Cookies from "js-cookie";

const LeadStatus = () => {
  const { Row, Col, Card } = useBootstrap();
  const { LoadingButton, Divider, Alert, Button } = useMui();

  const [ID, setID] = React.useState();
  const [SelectedStatus, setSelectedStatus] = React.useState(undefined);
  const [showDeleteModal, setShowDeleteModal] = React.useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = React.useState(null); // New state for success message
  const [color, setColor] = React.useState(null);
  const [isColorVisible, setIsColorVisible] = React.useState(true);
  const [colorPicker, setColorPicker] = useColor("hex", "#00FF00");
  const [initialValues, setInitialValues] = React.useState({
    id: "",
    lead_status: "",
  });

  const [showModal, setShowModal] = React.useState({
    type: "Add",
    show: false,
  });

  // Get Dynamic action previlege
  const memoizedDynamicFieldActionPrevilege = useMemo(
    () => getActionPrevilege("Dynamic Fields"),
    []
  );

  const DynamicActionPrevilege = memoizedDynamicFieldActionPrevilege;

  const AllLeadStatus = useQuery("AllLeadStatus", () => {
    return GetAllLeadStatus();
  });

  const HandleAddFun = () => {
    setShowModal({
      type: "Add",
      show: true,
    });
    setInitialValues({
      id: "",
      lead_status: "",
    });
    setColor(null);
  };

  const handleCallback = (childData) => {
    setColor(childData.color_code);
  };

  const { mutate: AddMutate, isLoading: AddisLoading } = useAddLeadStatus();
  const { mutate: EditMutate, isLoading: EditisLoading } = useEditLeadStatus();
  const { mutate: DeleteMutate, isLoading: DeleteisLoading } =
    useDeleteLeadStatus();

  const HandleSubmit = (values) => {
    let params = [];
    if (!isColorVisible) {
      params = [values, colorPicker.hex];
    } else {
      params = [values, color];
    }
    if (color !== undefined) {
      if (showModal.type === "Add") {
        AddMutate(params, {
          onSuccess: (data) => {
            AllLeadStatus.refetch();
            setColor(undefined);
            setShowModal({ type: "Add", show: false });
            setShowSuccessMessage(data.data);
            setTimeout(() => {
              setShowSuccessMessage(null);
            }, 3000);
          },
        });
      } else if (showModal.type === "Edit") {
        EditMutate(params, {
          onSuccess: (data) => {
            AllLeadStatus.refetch();
            setColor(undefined);
            setShowModal({ type: "Add", show: false });
            setShowSuccessMessage(data.data);
            setTimeout(() => {
              setShowSuccessMessage(null);
            }, 3000);
          },
        });
      }
    } else {
    }
  };

  const handleDeleteFun = (data) => {
    setShowDeleteModal(true);
    setSelectedStatus(data.status);
    setID(data);
  };

  const HandleEditFun = (data) => {
    setInitialValues({
      id: data.id,
      lead_status: data.status,
      old_lead_status: data.status,
    });
    setColor(data.color);
    setShowModal({
      type: "Edit",
      show: true,
    });
  };

  return (
    <>
      <Breadcrumb
        PageName="Lead Status"
        AddButton={Cookies.get("previous_user") !== undefined ? null:[
          DynamicActionPrevilege.Add,
          "Add Lead Status",
          null,
          () => HandleAddFun(),
        ]}
      />
      <Card>
        <Card.Body>
          <Card.Title>All Lead Status</Card.Title>
          <Divider />
          {showSuccessMessage && (
            <Alert severity="info">{showSuccessMessage}</Alert>
          )}
          {!AllLeadStatus.isLoading ? (
            <SmallDataTable
              columns={LeadStatusColumns}
              data={AllLeadStatus.data}
              handleEdit={HandleEditFun}
              handleDelete={handleDeleteFun}
              actionModulePrevilege={DynamicActionPrevilege}
            />
          ) : null}
        </Card.Body>
      </Card>
      <CustomModal
        show={showModal.show}
        onHide={() => setShowModal(false)}
        ModalTitle={
          showModal.type === "Edit" ? "Edit Lead Status" : "Add Lead Status"
        }
        ModalBody={
          <Formik
            initialValues={initialValues}
            validationSchema={LeadStatusSchema}
            onSubmit={HandleSubmit}
          >
            <Form>
              <Row>
                <Col md={12}>
                  <h3 className="custom-form-label">
                    Lead Status <span className="required-label">*</span>
                  </h3>
                  <CustomInputField
                    type="text"
                    name="lead_status"
                    placeholder="Enter Lead Status"
                  />
                </Col>
                <Col md={12} className="mt-3">
                  <h3 className="custom-form-label">
                    Status Colour <span className="required-label">*</span>
                  </h3>
                  {/* {showModal.type === "Edit" && (
                    <div
                      style={{
                        background: color,
                        color: color !== "yellow" ? "#fff" : "#000",
                      }}
                      className="px-2 py-1 rounded shadow-lg w-25 text-center"
                    >
                      {color}
                    </div>
                  )} */}
                  {isColorVisible ? (
                    <div className="status-color-row">
                      <StatusColor
                        sendDataToParent={handleCallback}
                        defaultColor={color}
                      />
                      {color === undefined ? (
                        <p className="error">Please select the color</p>
                      ) : null}
                    </div>
                  ) : (
                    <>
                      <ColorPicker
                        widht="100%"
                        height={100}
                        color={colorPicker}
                        onChange={setColorPicker}
                        hideInput={["rgb", "hsv"]}
                      />
                      <div
                        className="status-color-card"
                        style={{
                          background: colorPicker.hex,
                          marginTop: "10px",
                        }}
                      ></div>
                    </>
                  )}
                  <Button
                    size="small"
                    style={{ marginTop: "10px" }}
                    onClick={() => setIsColorVisible(!isColorVisible)}
                  >
                    {isColorVisible
                      ? "Select other color"
                      : "Select for default color"}
                  </Button>
                </Col>
              </Row>
              <div className="text-center mt-3">
                <LoadingButton
                  type="submit"
                  variant="contained"
                  loading={
                    showModal.type === "Edit" ? EditisLoading : AddisLoading
                  }
                >
                  {showModal.type === "Edit"
                    ? "Edit Lead Status"
                    : "Add Lead Status"}
                </LoadingButton>
              </div>
            </Form>
          </Formik>
        }
      />
      <DeleteModal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        loading={DeleteisLoading}
        onclick={() => {
          let data = [ID, SelectedStatus];
          DeleteMutate(data, {
            onSuccess: (data) => {
              AllLeadStatus.refetch();
              setShowDeleteModal(false);
              setShowSuccessMessage(data);
              setID("");
              setTimeout(() => {
                setShowSuccessMessage(null);
              }, 3000);
            },
          });
        }}
      />
    </>
  );
};

export default LeadStatus;
