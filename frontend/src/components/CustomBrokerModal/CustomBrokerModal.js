import React from "react";
import { Formik, Form, ErrorMessage } from "formik";
import { useBootstrap, useMui, useSetting } from "../../hooks/Hooks";
import {
  CustomSelectField,
  CustomTextareaField,
} from "../FormUtility/FormUtility";
import CryptoJS from "crypto-js";
import { Col, Row } from "react-bootstrap";
import { Typography } from "@mui/material";
import CustomDescriptionWithViewMore, {
  CustomDescription,
  CustomHeading,
} from "../Common/Common";
import { useQuery } from "react-query";
import {
  getBrokerHistory,
  useQuickEditBroker,
} from "../../hooks/Broker/UseBrokerHook";
import dayjs from "dayjs";
import "./CustomBrokerModal.css";
import { MessageSquareText } from "lucide-react";
import { stringAvatar } from "../../hooks/Function";
import * as Yup from "yup";

const validationSchema = Yup.object().shape({
  broker_meet_status: Yup.string().required("Meet status is required"),
  broker_status: Yup.string().required("Status is required"),
});

const brokerMeetStatusOptions = [
  { label: "Fresh", value: "Fresh Meet" },
  { label: "Re-Meet", value: "Re-Meet" },
];
const brokerStatusOptions = [
  { label: "Interested", value: "Interested" },
  { label: "Not-interested", value: "Not-interested" },
  { label: "CP activated", value: "CP activated" },
  { label: "Walking Active", value: "Walking Active" },
];

export const CustomBrokerModal = (props) => {
  const { Modal } = useBootstrap();
  const {
    Button,
    Timeline,
    TimelineItem,
    TimelineSeparator,
    TimelineContent,
    TimelineConnector,
    AccessTimeOutlinedIcon,
    Avatar,
  } = useMui();

  const { globalData } = useSetting();

  // Retrieve encryption key from global data
  let CryptoJSKey = globalData.CompanyName + "@" + globalData.Version;

  // Decrypt user data stored in localStorage
  const bytes = CryptoJS.AES.decrypt(
    localStorage.getItem("updateglobal_userdata"),
    CryptoJSKey
  );

  // Convert decrypted data to a string
  var user_data = bytes.toString(CryptoJS.enc.Utf8);

  // Parse the user data as JSON
  const BrokerDetails = JSON.parse(user_data);

  const BrokerHistory = useQuery(
    ["brokerHistory-" + BrokerDetails.brk_id, BrokerDetails.brk_id],
    () => getBrokerHistory(BrokerDetails.brk_id)
  );

  const { mutate, isLoading } = useQuickEditBroker();

  const HandleBrokerQuickEdit = (values) => {
    mutate(values, {
      onSuccess: (response) => {
        if (response.data === "Broker Details Updated Successfully") {
          props.onHide();
          props.handleMessage("Broker Status Updated Successfully");
          BrokerHistory.refetch();
        }
      },
    });
  };

  console.log(BrokerHistory.data, "Broker History Data");

  return (
    <Modal
      show={props.show}
      size={props.ModalSize}
      onHide={props.onHide}
      centered
      className="broker-modal"
      backdrop={props.nobackdrop ? false : true}
    >
      <Modal.Header closeButton>
        <Modal.Title style={{ fontSize: 18 }}>{props.ModalTitle}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row>
          <Col md={4} lg={4} sm={12}>
            <Formik
              initialValues={{
                broker_meet_status: "",
                broker_status: "",
                comment: "",
                brk_id: BrokerDetails.brk_id,
              }}
              validate={(values) => {
                const errors = {};
                if (!values.broker_meet_status) {
                  errors.broker_meet_status = "Meet status is required";
                }
                if (!values.broker_status) {
                  errors.broker_status = "Status is required";
                }
                return errors;
              }}
              onSubmit={HandleBrokerQuickEdit}
            >
              {({ values, setFieldValue }) => (
                <Form>
                  <div className="mb-3">
                    <Typography variant="h6" className="custom-form-label">
                      Select Meet Status
                      <span className="required-label"></span>
                    </Typography>
                    <CustomSelectField
                      name="broker_meet_status"
                      placeholder="Select Broker Status"
                      options={brokerMeetStatusOptions}
                      isLabelValue={true}
                      FieldValue={setFieldValue}
                    />
                  </div>
                  <div className="mb-3">
                    <Typography variant="h6" className="custom-form-label">
                      Select Status <span className="required-label"></span>
                    </Typography>
                    <CustomSelectField
                      name="broker_status"
                      placeholder="Select Broker Status"
                      options={brokerStatusOptions}
                      isLabelValue={true}
                      FieldValue={setFieldValue}
                    />
                  </div>
                  <Row>
                    <Col md={6}>
                      <Typography variant="h6" className="custom-form-label">
                        Add Comment <span className="required-label"></span>
                      </Typography>
                    </Col>
                    <Col md={12}>
                      <CustomTextareaField
                        name="comment"
                        placeholder="Enter Other Details ...."
                      />
                    </Col>
                  </Row>
                  <div className="text-center d-flex justify-content-between pb-3">
                    <Button
                      variant="contained"
                      sx={{ bgcolor: "#484343" }}
                      onClick={props.onHide}
                    >
                      Close
                    </Button>
                    <Button type="submit" variant="contained" color="primary">
                      Submit
                    </Button>
                  </div>
                </Form>
              )}
            </Formik>
          </Col>
          <Col md={8} lg={8} sm={12}>
            <CustomHeading Heading="History" />
            <Timeline className="comment-timeline">
              <div style={{ height: "320px", overflowY: "scroll" }}>
                {BrokerHistory?.data?.map((row, index) => {
                  return (
                    <TimelineItem key={index}>
                      <TimelineSeparator>
                        <Avatar
                          {...stringAvatar(row.username)}
                          className="comment-avatar"
                        />
                        <TimelineConnector />
                      </TimelineSeparator>
                      <TimelineContent>
                        <h5 className="custom-heading text-capitalize">
                          {"By " + row.username + " updated status to "}
                          <span style={{ color: "#548adb" }}>
                            {row.status + " - " + row.broker_meet_status}
                          </span>
                        </h5>
                        <CustomDescription
                          style={{
                            fontWeight: "600",
                            margin: "2px 0px",
                          }}
                          startIcon={
                            <AccessTimeOutlinedIcon sx={{ fontSize: "16px" }} />
                          }
                          Description={dayjs(row.created_dt).format(
                            "DD MMM YYYY, hh:mm A"
                          )}
                        />
                        {row.comment && (
                          <CustomDescriptionWithViewMore
                            description={"Comment : " + row.comment}
                          />
                        )}
                      </TimelineContent>
                    </TimelineItem>
                  );
                })}
              </div>
            </Timeline>
          </Col>
        </Row>
      </Modal.Body>
    </Modal>
  );
};
