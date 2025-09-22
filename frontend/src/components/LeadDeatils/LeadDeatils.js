import React from "react";
import { useBootstrap, useMui } from "../../hooks/Hooks";
import {
  CustomFormGroup,
  CustomInputField,
  CustomSelectField,
  CustomTextareaField,
} from "../FormUtility/FormUtility";
import { CreateLabelValueArray, stringAvatar } from "../../hooks/Function";
import { GetAllLeadStatus } from "../../hooks/DynamicFields/UseLeadStatusHook";
import { useQuery, useQueryClient } from "react-query";
import { Form, Formik } from "formik";
import {
  CustomDescription,
  CustomHeading,
  CustomSubTitle,
} from "../Common/Common";
import "./LeadDeatils.css";
import Cookies from "js-cookie";
import dayjs from "dayjs";
import { useQuickEditLead } from "../../hooks/Leads/UseLeadsHook";
import ReactWhatsapp from "react-whatsapp";

const LeadDeatils = ({ data, dispatch, handleClose }) => {
  const { Row, Col, Tab, Tabs } = useBootstrap();
  const {
    Typography,
    Timeline,
    TimelineItem,
    TimelineSeparator,
    TimelineConnector,
    TimelineContent,
    AccessTimeOutlinedIcon,
    TimelineDot,
    Avatar,
    LoadingButton,
    CallOutlinedIcon,
    EmailOutlinedIcon,
    WhatsAppIcon,
    EditIcon,
    IconButton,
    CloseIcon,
    Tooltip,
  } = useMui();
  // Set initial form values based on user data
  let initialValues = {
    status_type:
      Cookies.get("type") === "Admin"
        ? data?.admin_status
        : data?.latest_status,
    follow_up: data?.followup,
    followup_dt: data?.followup_dt,
    newComment: "",
    oldComment: data?.comments,
    leadId: Cookies.get("type") === "Admin" ? data?.l_id : data?.assignlead_id,
    lname: data?.lname,
    p_mob: data?.p_mob,
    pname: data?.pname,
  };

  // Custom hook for handling the submission and mutation of lead data
  const { mutate, isLoading } = useQuickEditLead();

  // React Query hook for managing cached queries
  const queryClient = useQueryClient();

  // Query to fetch all lead statuses
  const AllStatus = useQuery("AllStatus", () => {
    return GetAllLeadStatus(["status"]);
  });

  // Handle form submission
  const onSubmit = (values) => {
    mutate(values, {
      onSuccess: (data) => {
        // Invalidate and refetch related queries upon successful lead update
        if (data.data === "Lead Updated Successfully") {
          queryClient.invalidateQueries("SubMenuLeadCount");
          queryClient.invalidateQueries("PresentLeadTableData");
          queryClient.invalidateQueries("PresentLeadTableCount");
          // localStorage.setItem("successMessage", data.data);
        }
      },
    });
  };

  const FollowUp = [
    { value: "Yes", label: "Yes" },
    { value: "No", label: "No" },
  ];

  const LeadDetailsListItem = [
    {
      label: "Lead ID",
      value: data.l_id,
    },
    {
      label: "Create On",
      value:
        data.create_dt === "0000-00-00 00:00:00"
          ? "Import Lead"
          : data.create_dt,
    },
    {
      label: "Email",
      value: data.p_email,
    },
    {
      label: "Phone number",
      value: data.mobile,
    },
    {
      label: "Lead Type",
      value: data.source_type,
    },
    {
      label: "Source",
      value: data.source,
    },
    {
      label: "Follow Up",
      value: data.followup === "yes" ? data.followup_dt : "No",
    },
    {
      label: "Status",
      value:
        Cookies.get("type") === "Admin" ? data.admin_status : data.users_status,
    },
    {
      label: "Service Type",
      value: data.service_type ? data.admin_status : "N/A",
    },
    {
      label: "Configuration",
      value: data.pconfiguration ? data.pconfiguration : "N/A",
    },
    {
      label: "Project Category",
      value: data.pcategory ? data.pcategory : "N/A",
    },
    {
      label: "Address",
      value:
        data.sub_locality +
        ", " +
        data.locality +
        ", " +
        data.city +
        ", " +
        data.state +
        ", " +
        data.country,
    },
    {
      label: "Area",
      value:
        data.min_area && data.max_area
          ? data.min_area + " - " + data.max_area
          : "N/A",
    },
    {
      label: "Price",
      value:
        data.min_price && data.max_price
          ? data.min_price + " - " + data.max_price + " " + data.price_unit
          : "N/A",
    },
    {
      label: "other_details",
      value: data.other_details ? data.other_details : "N/A",
    },
  ];

  return (
    <>
      <Tabs
        defaultActiveKey="ClientDetails"
        id="uncontrolled-tab-example"
        className="mb-3 lead-details-tab"
      >
        <Tab eventKey="ClientDetails" title="Client Details">
          <div className="d-flex align-items-center mx-3">
            <Avatar
              {...stringAvatar(data.lname)}
              className="comment-avatar"
              sx={{ width: 50, height: 50 }}
            />
            <div className="ms-3">
              <CustomHeading Heading={data.lname} />
              <CustomDescription
                Description={"For " + data.pname + " project"}
              />
            </div>
          </div>

          <div className="d-flex align-items-center mx-3 mt-2">
            <Tooltip
              title="Call"
              component="a"
              href={"tel:+" + data.p_ccode + data.p_mob}
            >
              <IconButton type="button" className="lead-details-action-btn">
                <CallOutlinedIcon />
              </IconButton>
            </Tooltip>
            <Tooltip
              title="Email"
              target="_blank"
              href={"mailto:" + data.p_email}
            >
              <IconButton type="button" className="lead-details-action-btn">
                <EmailOutlinedIcon />
              </IconButton>
            </Tooltip>
            <Tooltip
              title="Edit"
              onClick={() => {
                dispatch({
                  event: "updateglobal_userdata",
                  data: JSON.stringify(data),
                });
                setTimeout(() => {
                  dispatch({ event: "editlead" });
                }, 30);
              }}
            >
              <IconButton type="button" className="lead-details-action-btn">
                <EditIcon />
              </IconButton>
            </Tooltip>
            <ReactWhatsapp
              number={"+" + data.p_ccode + data.p_mob}
              message="Hello,"
              style={{ padding: 0, background: "none", border: "none" }}
            >
              <Tooltip title="WhatsApp">
                <IconButton
                  component="span"
                  className="lead-details-action-btn"
                >
                  <WhatsAppIcon sx={{ fontSize: "18px" }} />
                </IconButton>
              </Tooltip>
            </ReactWhatsapp>
          </div>

          <div className="lead-details-list">
            {LeadDetailsListItem.map((item, i) => {
              return (
                <div
                  key={i}
                  className="d-flex align-items-center justify-content-between p-2"
                >
                  <CustomSubTitle SubTitle={item.label + " :"} />
                  <CustomDescription
                    Description={item.value}
                    style={{ marginLeft: "10px" }}
                  />
                </div>
              );
            })}
          </div>
        </Tab>
        <Tab eventKey="QuickEditLead" title="Quick Edit Lead">
          {/* <Formik
            initialValues={initialValues}
            // validationSchema={QuickLeadSchema}
            onSubmit={onSubmit}
          >
            {({ values, setFieldValue }) => (
              <Form>
                <Row>
                  <Col sm={12} md={7}>
                    <CustomFormGroup
                      xs={12}
                      md={12}
                      formlabel="Lead Status"
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
                    <Row>
                      <Col md={4}>
                        <Typography variant="h6" className="custom-form-label">
                          Add Comment <span className="required-label"></span>
                        </Typography>
                      </Col>
                      <Col md={8}>
                        <CustomTextareaField
                          name="newComment"
                          placeholder="Enter new comment ...."
                        />
                      </Col>
                    </Row>
                    <div className="text-center">
                      <LoadingButton
                        variant="contained"
                        type="submit"
                        loading={isLoading}
                      >
                        Quick Edit
                      </LoadingButton>
                    </div>
                  </Col>
                  <Col sm={12} md={5}>
                    <CustomHeading Heading="Previous Comments" />
                    <Timeline className="comment-timeline">
                      <div style={{ height: "320px", overflowY: "scroll" }}>
                        {data.comments?.split("~").map((comment, i) => {
                          var comment = comment.split(":-");
                          var commentTime = comment[0].split("At");
                          var username = commentTime[0].split("By");
                          return (
                            comment[1] && (
                              <TimelineItem key={i}>
                                <TimelineSeparator>
                                  {username[1] ? (
                                    <Avatar
                                      {...stringAvatar(username[1])}
                                      className="comment-avatar"
                                    />
                                  ) : (
                                    <TimelineDot />
                                  )}
                                  <TimelineConnector />
                                </TimelineSeparator>
                                <TimelineContent>
                                  <CustomSubTitle
                                    SubTitle={commentTime[0] + " at"}
                                  />
                                  <CustomDescription
                                    style={{
                                      fontWeight: "600",
                                      marginBottom: "5px",
                                    }}
                                    startIcon={
                                      <AccessTimeOutlinedIcon
                                        sx={{ fontSize: "16px" }}
                                      />
                                    }
                                    Description={dayjs(commentTime[1]).format(
                                      "DD MMM YYYY, hh:mm A"
                                    )}
                                  />
                                  <CustomDescription Description={comment[1]} />
                                </TimelineContent>
                              </TimelineItem>
                            )
                          );
                        })}
                      </div>
                    </Timeline>
                  </Col>
                </Row>
              </Form>
            )}
          </Formik> */}
        </Tab>
      </Tabs>
      <IconButton className="lead-details-close-button" onClick={handleClose}>
        <CloseIcon />
      </IconButton>
    </>
  );
};

export default LeadDeatils;
