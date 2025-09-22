import React from "react";
import Breadcrumb from "../../components/Breadcrumb/Breadcrumb";
import { Formik, Form } from "formik";
import { useBootstrap, useMui, useSetting } from "../../hooks/Hooks";
import { CreateLabelValueArray, stringAvatar } from "../../hooks/Function";
import { useQuery, useQueryClient } from "react-query";
import Cookies from "js-cookie";
import CryptoJS from "crypto-js";
import { useQuickEditLead } from "../../hooks/Leads/UseLeadsHook";
import { GetAllLeadStatus } from "../../hooks/DynamicFields/UseLeadStatusHook";
import "./../../assets/css/ViewLeadDetails.css";
import { QuickLeadSchema } from "../../schema/Leads/QuickLeadSchema";
import {
  CustomFormGroup,
  CustomInputField,
  CustomSelectField,
  CustomTextareaField,
} from "../../components/FormUtility/FormUtility";

import LeadTimelineHandler from "../../Handler/LeadTimelineHandler";

const QuickEditLead = ({ dispatch }) => {
  const { Card, Row, Col } = useBootstrap();

  const {
    ArrowBackIosIcon,
    Avatar,
    Typography,
    LoadingButton,
    CallOutlinedIcon,
    BusinessOutlinedIcon,
    Box,
  } = useMui();

  const { globalData } = useSetting();

  // Extract encrypted user data from localStorage
  let CryptoJSKey = globalData.CompanyName + "@" + globalData.Version;
  let bytes;

  if (localStorage.getItem("previousScreen") === "leadbystatus") {
    bytes = CryptoJS.AES.decrypt(
      localStorage.getItem("store_new_data"),
      CryptoJSKey
    );
  } else {
    bytes = CryptoJS.AES.decrypt(
      localStorage.getItem("updateglobal_userdata"),
      CryptoJSKey
    );
  }

  // Convert decrypted data to string and parse as JSON
  var user_data = bytes.toString(CryptoJS.enc.Utf8);
  let LeadsData = JSON.parse(user_data);

  // Query to fetch all lead statuses
  const AllStatus = useQuery("AllStatus", () => {
    return GetAllLeadStatus(["status"]);
  });

  // Set initial form values based on user data
  let initialValues = {
    status_type:
      Cookies.get("type") === "Admin"
        ? LeadsData.admin_status
        : LeadsData.status,
    follow_up: LeadsData.followup,
    followup_dt: LeadsData.followup_dt,
    newComment: "",
    oldComment: LeadsData.comments,
    leadId:
      Cookies.get("type") === "Admin"
        ? LeadsData.l_id
        : LeadsData.assignlead_id,
    lname: LeadsData.lname,
    p_mob: LeadsData.p_mob,
    pname: LeadsData.pname,
    identity: LeadsData.identity,
  };

  // Custom hook for handling the submission and mutation of lead data
  const { mutate, isLoading } = useQuickEditLead();

  // React Query hook for managing cached queries
  const queryClient = useQueryClient();

  // Handle form submission
  const onSubmit = (values) => {
    mutate(values, {
      onSuccess: (data) => {
        // Invalidate and refetch related queries upon successful lead update
        if (data.data === "Lead Updated Successfully") {
          queryClient.invalidateQueries("SubMenuLeadCount");
          localStorage.setItem("successMessage", data.data);

          // Dispatch an event based on the previous screen
          // dispatch({
          //   event:
          //     localStorage.getItem("previousScreen") ===
          //     localStorage.getItem("currScreen")
          //       ? "totalleads"
          //       : localStorage.getItem("previousScreen"),
          // });
          if (localStorage.getItem("previousScreen") === "leadbystatus") {
            setTimeout(() => {
              dispatch({
                event:
                  localStorage.getItem("previousScreen") ===
                  localStorage.getItem("currScreen")
                    ? "totalleads"
                    : localStorage.getItem("previousScreen"),
              });
            }, 10);
          } else {
            dispatch({
              event:
                localStorage.getItem("previousScreen") ===
                localStorage.getItem("currScreen")
                  ? "totalleads"
                  : localStorage.getItem("previousScreen"),
            });
          }
        }
      },
    });
  };

  // Array for follow-up options
  const FollowUp = [
    { value: "Yes", label: "Yes" },
    { value: "No", label: "No" },
  ];

  // Splitting comments and storing them in an array
  const comments = LeadsData.comments?.split("~");

  return (
    <>
      <Breadcrumb
        PageName="Quick Edit"
        BackButton={[
          true,
          "Back",
          <ArrowBackIosIcon />,
          () =>
            dispatch({
              event:
                localStorage.getItem("previousScreen") ===
                localStorage.getItem("currScreen")
                  ? "totalleads"
                  : localStorage.getItem("previousScreen"),
            }),
        ]}
      />
      <Card className="mt-3 card-advance border-0">
        <div className="view-details-banner"></div>
        <Card.Body>
          <div className="d-flex align-items-center">
            <div className="d-flex align-items-center mb-5">
              <div className="avatar-img-container">
                <Avatar
                  {...stringAvatar(initialValues.lname)}
                  className="comment-avatar"
                  sx={{
                    width: 80,
                    height: 80,
                    borderRadius: "10px",
                    background: "#433456",
                  }}
                />
              </div>
            </div>
            <div className="banner-content" style={{ marginLeft: "7rem" }}>
              <h4>{initialValues.lname}</h4>
              <div className="mt-3 quick-edit-banner-btn-grp">
                <Box
                  component="a"
                  href={`tel:${initialValues.p_mob}`}
                  className="d-flex align-items-center"
                >
                  <CallOutlinedIcon className="deatil-icon" />
                  <p className="ms-2">{initialValues.p_mob}</p>
                </Box>
                <div className="d-flex align-items-center">
                  <BusinessOutlinedIcon className="deatil-icon" />
                  <p className="ms-2">{initialValues.pname}</p>
                </div>
              </div>
            </div>
          </div>
        </Card.Body>
      </Card>
      <Row className="mt-3">
        <Col>
          <Card className="card-advance border-0">
            <Card.Body>
              <Formik
                initialValues={initialValues}
                validationSchema={QuickLeadSchema}
                onSubmit={onSubmit}
              >
                {({ values, setFieldValue }) => (
                  // Form component for handling form submissions
                  <Form>
                    {/* Form group for lead status selection */}
                    <CustomFormGroup
                      xs={12}
                      md={12}
                      formlabel="Lead Statusss"
                      star="*"
                      FormField={
                        <CustomSelectField
                          name="status_type"
                          placeholder="Select a Lead Status"
                          options={CreateLabelValueArray(
                            AllStatus?.data,
                            "status"
                          )}
                          isLabelValue={true}
                          FieldValue={setFieldValue}
                          initialValue={{
                            label: initialValues.status_type,
                            value: initialValues.status_type,
                          }}
                        />
                      }
                    />
                    {/* Form group for follow-up selection */}
                    <CustomFormGroup
                      xs={12}
                      md={12}
                      formlabel="Follow Up"
                      star="*"
                      FormField={
                        <CustomSelectField
                          name="follow_up"
                          placeholder="Select a Follow Up"
                          options={FollowUp}
                          isLabelValue={true}
                          FieldValue={setFieldValue}
                          initialValue={{
                            label: initialValues.follow_up,
                            value: initialValues.follow_up,
                          }}
                        />
                      }
                    />
                    {/* Conditional rendering for follow-up date input */}
                    {values.follow_up === "Yes" ? (
                      <Col>
                        <CustomFormGroup
                          xs={12}
                          md={12}
                          formlabel="Follow Up Date"
                          star="*"
                          FormField={
                            <CustomInputField
                              type="datetime-local"
                              name="followup_dt"
                              required={true}
                              initialValue={{
                                label: initialValues.followup_dt,
                                value: initialValues.followup_dt,
                              }}
                              min={new Date().toISOString().slice(0, 16)}
                            />
                          }
                        />
                      </Col>
                    ) : null}
                    {/* Comment input field */}
                    <Row>
                      <Col md={4}>
                        <Typography variant="h6" className="custom-form-label">
                          Add Comment <span className="required-label"></span>
                        </Typography>
                      </Col>
                      <Col md={8}>
                        <CustomTextareaField
                          name="newComment"
                          placeholder="Enter Other Details ...."
                        />
                      </Col>
                    </Row>
                    <div className="text-center">
                      <LoadingButton
                        variant="contained"
                        type="submit"
                        loading={isLoading}
                      >
                        Update Lead
                      </LoadingButton>
                    </div>
                  </Form>
                )}
              </Formik>
            </Card.Body>
          </Card>
        </Col>
        <Col>
          <Card
            className="card-advance border-0"
            style={{ height: "310px", overflowY: "scroll" }}
          >
            <Card.Body>
              <LeadTimelineHandler LeadDetails={LeadsData} />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default QuickEditLead;
