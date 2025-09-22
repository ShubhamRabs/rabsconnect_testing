import React from "react";
import { useBootstrap, useMui } from "../../hooks/Hooks";
import { CreateLabelValueArray, stringAvatar } from "../../hooks/Function";

import Timeline from "@mui/lab/Timeline";
import TimelineItem, { timelineItemClasses } from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineDot from "@mui/lab/TimelineDot";

import "./LeadDeatils.css";
import { Form, Formik, Field, ErrorMessage } from "formik";
import {
  CustomFormGroup,
  CustomInputField,
  CustomMobileFiled,
  CustomMultipleSelectField,
  CustomSelectField,
  CustomTextareaField,
} from "../FormUtility/FormUtility";
import { GetAllSource } from "../../hooks/DynamicFields/useSourceHook";
import { GetAllBroker } from "../../hooks/Broker/UseBrokerHook";
import { GetAllProjectName } from "../../hooks/DynamicFields/useProjectNameHook";
import { GetAllConfiguration } from "../../hooks/DynamicFields/UseConfigurationHook";
import { useQuery } from "react-query";
import {
  Ccode,
  PropertyArea,
  PropertyCategory,
  PropertyPrice,
  PropertyType,
  ServiceType,
} from "../../data/LeadData";
import { City, Country, State } from "../../data/CountryStateCity";
import { GetAllLeadStatus } from "../../hooks/DynamicFields/UseLeadStatusHook";

const LeadDeatils = () => {
  const { Row, Col, Card, Tab, Tabs } = useBootstrap();
  const {
    RadioGroup,
    Avatar,
    IconButton,
    WhatsAppIcon,
    CallOutlinedIcon,
    EmailOutlinedIcon,
    VisibilityOutlinedIcon,
    FormControlLabel,
    Radio,
    Typography,
    LoadingButton,
    Box,
  } = useMui();

  const [ContactValidation, setContactValidation] = React.useState({
    lccode: "",
    lmobile: null,
    ref_ccode: "",
    ref_number: null,
    s_ccode: "",
    s_mob: "",
  });

  const initialValues = {
    source_type: "Direct",
    source: "",
    brk_id: "",
    ref_name: "",
    ref_ccode: "",
    ref_mob_no: "",
    ref_email: "",
    lname: "",
    lemail: "",
    pname: "",
    service_type: "",
    ptype: "",
    pcategory: "",
    pconfiguration: "",
    min_area: "",
    max_area: "",
    area_unit: "",
    min_price: "",
    max_price: "",
    price_unit: "",
    country: "",
    state: "",
    city: "",
    locality: "",
    other_details: "",
  };

  const sourceData = useQuery("AllSource", () => {
    return GetAllSource(["source"]);
  });

  const brokerData = useQuery("AllBroker", () => {
    return GetAllBroker(["name", "brk_id"]);
  });

  const projectNameData = useQuery("AllProjectName", () => {
    return GetAllProjectName(["pname"]);
  });

  const configurationData = useQuery("AllConfiguration", () => {
    return GetAllConfiguration(["configuration", "configuration_type"]);
  });

  // Query to fetch all lead statuses
  const AllStatus = useQuery("AllStatus", () => {
    return GetAllLeadStatus(["status"]);
  });
  // Array for follow-up options
  const FollowUp = [
    { value: "Yes", label: "Yes" },
    { value: "No", label: "No" },
  ];
  return (
    <>
      <Row>
        <Col md={3} lg={3} sm={12}>
          <div className="d-flex align-items-center">
            <Avatar {...stringAvatar("Anna Adame")} className="me-2" />
            <div className="user-details-wrapper">
              <h3 className="text-black mb-1">Anna Adame</h3>
              <p className="text-black text-opacity-75">+91 99999 99999</p>
            </div>
          </div>
          <div className="action-btn-group">
            <IconButton type="button" className="lead-detail-icon-btn">
              <WhatsAppIcon />
            </IconButton>
            <IconButton type="button" className="lead-detail-icon-btn">
              <CallOutlinedIcon />
            </IconButton>
            <IconButton type="button" className="lead-detail-icon-btn">
              <EmailOutlinedIcon />
            </IconButton>
            <IconButton type="button" className="lead-detail-icon-btn">
              <VisibilityOutlinedIcon />
            </IconButton>
          </div>
          <Card className="mt-3">
            <Card.Body>
              <Card.Title className="lead-detail-heading">
                Previous Comments :-
              </Card.Title>
              <Timeline
                className="comments-timeline"
                sx={{
                  [`& .${timelineItemClasses.root}:before`]: {
                    flex: 0,
                    padding: 0,
                  },
                }}
              >
                <TimelineItem>
                  <TimelineSeparator>
                    <TimelineDot />
                    <TimelineConnector />
                  </TimelineSeparator>
                  <TimelineContent>Eat</TimelineContent>
                </TimelineItem>
                <TimelineItem>
                  <TimelineSeparator>
                    <TimelineDot />
                  </TimelineSeparator>
                  <TimelineContent>Code</TimelineContent>
                </TimelineItem>
              </Timeline>
            </Card.Body>
          </Card>
        </Col>
        <Col md={9} lg={9} sm={12}>
          <Formik
            initialValues={initialValues}
            // validationSchema={LeadFormSchema}
            // onSubmit={HandleSubmit}
          >
            {({ values, setFieldValue }) => (
              <Form>
                <Card>
                  <Card.Body>
                    <Tabs
                      defaultActiveKey="ClientStatus"
                      className="mb-3 lead-details-tabs"
                    >
                      <Tab
                        eventKey="ClientStatus"
                        className="tab-list"
                        title="Client Status"
                      >
                        <Row>
                          <Col md={12} sm={12}>
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
                                      min={new Date()
                                        .toISOString()
                                        .slice(0, 16)}
                                    />
                                  }
                                />
                              </Col>
                            ) : null}
                            <Row>
                              <Col md={4}>
                                <Typography
                                  variant="h6"
                                  className="custom-form-label"
                                >
                                  Add Comment{" "}
                                  <span className="required-label"></span>
                                </Typography>
                              </Col>
                              <Col md={8}>
                                <CustomTextareaField
                                  name="newComment"
                                  placeholder="Enter Other Details ...."
                                />
                              </Col>
                            </Row>
                          </Col>
                        </Row>
                      </Tab>
                      <Tab
                        eventKey="PersonalDetails"
                        className="tab-list"
                        title="Personal Details"
                      >
                        <Row className="my-3 align-items-center">
                          <Col xs={6} md={2}>
                            <h3 className="custom-form-label">
                              Lead Type{" "}
                              <span className="required-label">*</span>
                            </h3>
                          </Col>
                          <Col xs={6} md={10}>
                            <Field
                              name="source_type"
                              as={RadioGroup}
                              className="d-flex flex-row"
                            >
                              <FormControlLabel
                                value="Direct"
                                control={<Radio />}
                                label="Direct"
                              />
                              <FormControlLabel
                                value="Broker"
                                control={<Radio />}
                                label="Broker"
                              />
                              <FormControlLabel
                                value="Reference"
                                control={<Radio />}
                                label="Reference"
                              />
                            </Field>
                            <ErrorMessage
                              name="source_type"
                              component="div"
                              className="error"
                            />
                          </Col>
                        </Row>

                        <Row>
                          {values.source_type === "Direct" && (
                            <CustomFormGroup
                              formlabel="Source"
                              star="*"
                              FormField={
                                <CustomSelectField
                                  name="source"
                                  FieldValue={setFieldValue}
                                  placeholder="Select Source"
                                  options={CreateLabelValueArray(
                                    sourceData?.data,
                                    "source"
                                  )}
                                  isLabelValue={true}
                                  required
                                />
                              }
                            />
                          )}
                          {values.source_type === "Broker" && (
                            <CustomFormGroup
                              formlabel="Broker Name"
                              star="*"
                              FormField={
                                <CustomSelectField
                                  name="brk_id"
                                  isLabelValue={true}
                                  FieldValue={setFieldValue}
                                  placeholder="Select Broker"
                                  options={CreateLabelValueArray(
                                    brokerData.data,
                                    "name",
                                    "brk_id"
                                  )}
                                />
                              }
                            />
                          )}

                          {values.source_type === "Reference" && (
                            <>
                              <CustomFormGroup
                                formlabel="Reference Name"
                                star="*"
                                FormField={
                                  <CustomInputField
                                    type="text"
                                    name="ref_name"
                                    placeholder="Enter Reference Name"
                                  />
                                }
                              />
                              <CustomMobileFiled
                                formlabel="Reference Mobile No."
                                star="*"
                                type="text"
                                placeholder="Reference Mobile No."
                                onChange={(value, data) =>
                                  setContactValidation({
                                    ...ContactValidation,
                                    ref_ccode: data.dialCode,
                                    ref_number: value.slice(
                                      data.dialCode.length
                                    ),
                                  })
                                }
                                options={Ccode}
                                defaultvalue={Ccode[0]}
                              />
                              <CustomFormGroup
                                formlabel="Reference Email"
                                star="*"
                                FormField={
                                  <CustomInputField
                                    type="email"
                                    name="ref_email"
                                    placeholder="Enter Reference Email"
                                  />
                                }
                              />
                            </>
                          )}
                          <CustomFormGroup
                            formlabel="Lead Name"
                            star="*"
                            FormField={
                              <CustomInputField
                                type="text"
                                name="lname"
                                placeholder="Enter Lead Name"
                              />
                            }
                          />

                          <CustomMobileFiled
                            formlabel="Mobile No."
                            star="*"
                            type="text"
                            placeholder="Mobile No."
                            onChange={(value, data) =>
                              setContactValidation({
                                ...ContactValidation,
                                lccode: data.dialCode,
                                lmobile: value.slice(data.dialCode.length),
                              })
                            }
                            options={Ccode}
                            defaultvalue={Ccode[0]}
                            error={ContactValidation.lmobile}
                          />

                          <CustomMobileFiled
                            formlabel="Alt. Mobile No."
                            type="text"
                            placeholder="Alt. Mobile No."
                            onChange={(value, data) =>
                              setContactValidation({
                                ...ContactValidation,
                                s_ccode: data.dialCode,
                                s_mob: value.slice(data.dialCode.length),
                              })
                            }
                            options={Ccode}
                            defaultvalue={Ccode[0]}
                          />

                          <CustomFormGroup
                            style={{ marginTop: "20px" }}
                            formlabel="Email Id."
                            star="*"
                            FormField={
                              <CustomInputField
                                type="email"
                                name="lemail"
                                placeholder="Enter Email Id."
                              />
                            }
                          />
                        </Row>
                      </Tab>
                      <Tab
                        eventKey="RequirementDetails"
                        className="tab-list"
                        title="Requirement Details"
                      >
                        <Row className="mt-3 align-items-center">
                          <CustomFormGroup
                            formlabel="Project Name"
                            FormField={
                              <CustomMultipleSelectField
                                name="pname"
                                placeholder="Select Project Name"
                                options={CreateLabelValueArray(
                                  projectNameData.data,
                                  "pname"
                                )}
                                isLabelValue={true}
                                FieldValue={setFieldValue}
                                values={values}
                              />
                            }
                          />
                          <CustomFormGroup
                            formlabel="Service Type"
                            FormField={
                              <CustomMultipleSelectField
                                name="service_type"
                                placeholder="Select Service Type"
                                options={ServiceType}
                                isLabelValue={true}
                                FieldValue={setFieldValue}
                                values={values}
                              />
                            }
                          />
                          <CustomFormGroup
                            formlabel="Property Type"
                            FormField={
                              <CustomMultipleSelectField
                                name="ptype"
                                placeholder="Select Property Type"
                                options={PropertyType}
                                isLabelValue={true}
                                FieldValue={setFieldValue}
                                values={values}
                              />
                            }
                          />
                          <CustomFormGroup
                            formlabel="Property Category"
                            FormField={
                              <CustomMultipleSelectField
                                name="pcategory"
                                placeholder="Select Property Category"
                                options={CreateLabelValueArray(
                                  PropertyCategory.filter(
                                    (row) =>
                                      values.ptype.indexOf(row.type) !== -1
                                  ),
                                  "label",
                                  "value"
                                )}
                                isLabelValue={true}
                                FieldValue={setFieldValue}
                                values={values}
                              />
                            }
                          />
                          <CustomFormGroup
                            formlabel="Configuration"
                            FormField={
                              <CustomMultipleSelectField
                                name="pconfiguration"
                                placeholder="Select Configuration"
                                options={CreateLabelValueArray(
                                  configurationData.data?.filter(
                                    (row) =>
                                      values.ptype.indexOf(
                                        row.configuration_type
                                      ) !== -1
                                  ),
                                  "configuration"
                                )}
                                isLabelValue={true}
                                FieldValue={setFieldValue}
                                values={values}
                              />
                            }
                          />
                        </Row>
                        <Row className="align-items-center">
                          <Col xs={12} md={2}>
                            <h3 className="custom-form-label">Property Area</h3>
                          </Col>
                          <Col xs={6} md={3}>
                            <CustomInputField
                              type="number"
                              name="min_area"
                              placeholder="Enter Minimum Area"
                            />
                          </Col>
                          <Col xs={6} md={3}>
                            <CustomInputField
                              type="number"
                              name="max_area"
                              placeholder="Enter Maximum Area"
                            />
                          </Col>
                          <Col xs={12} md={4}>
                            <CustomSelectField
                              name="area_unit"
                              FieldValue={setFieldValue}
                              isLabelValue={true}
                              placeholder="Select Unit"
                              options={PropertyArea}
                            />
                          </Col>
                        </Row>
                        <Row className="mt-3 align-items-center">
                          <Col xs={12} md={2}>
                            <h3 className="custom-form-label">
                              Property Price
                            </h3>
                          </Col>
                          <Col xs={6} md={3}>
                            <CustomInputField
                              type="number"
                              name="min_price"
                              placeholder="Enter Minimum Price"
                            />
                          </Col>
                          <Col xs={6} md={3}>
                            <CustomInputField
                              type="number"
                              name="max_price"
                              placeholder="Enter Maximum Price"
                            />
                          </Col>
                          <Col xs={12} md={4}>
                            <CustomSelectField
                              name="price_unit"
                              FieldValue={setFieldValue}
                              isLabelValue={true}
                              placeholder="Select Currency"
                              options={PropertyPrice}
                            />
                          </Col>
                        </Row>
                        <Row className="mt-3 align-items-center">
                          <CustomFormGroup
                            formlabel="Country"
                            FormField={
                              <CustomMultipleSelectField
                                name="country"
                                placeholder="Select Country"
                                options={CreateLabelValueArray(
                                  Country,
                                  "name",
                                  "isoCode"
                                )}
                                isLabelValue={true}
                                FieldValue={setFieldValue}
                                values={values}
                              />
                            }
                          />
                          <CustomFormGroup
                            formlabel="State"
                            FormField={
                              <CustomMultipleSelectField
                                name="state"
                                placeholder="Select State"
                                options={CreateLabelValueArray(
                                  State.filter(
                                    (row) =>
                                      values.country.indexOf(
                                        row.countryCode
                                      ) !== -1
                                  ),
                                  "name",
                                  "isoCode"
                                )}
                                isLabelValue={true}
                                FieldValue={setFieldValue}
                                values={values}
                              />
                            }
                          />
                          <CustomFormGroup
                            formlabel="City"
                            FormField={
                              <CustomMultipleSelectField
                                name="city"
                                placeholder="Select City"
                                options={CreateLabelValueArray(
                                  City.filter(
                                    (row) =>
                                      values.state.indexOf(row.stateCode) !== -1
                                  ),
                                  "name"
                                )}
                                isLabelValue={true}
                                FieldValue={setFieldValue}
                                values={values}
                              />
                            }
                          />
                          <CustomFormGroup
                            formlabel="Locality"
                            FormField={
                              <CustomInputField
                                type="text"
                                name="locality"
                                placeholder="Enter Locality"
                              />
                            }
                          />
                        </Row>
                        <Row className="my-3 align-items-center">
                          <Col xs={12} md={2}>
                            <h3 className="custom-form-label">Other Details</h3>
                          </Col>
                          <Col xs={12} md={10}>
                            <CustomTextareaField
                              name="other_details"
                              placeholder="Enter Other Details ...."
                            />
                          </Col>
                        </Row>
                      </Tab>
                    </Tabs>
                  </Card.Body>
                </Card>
              </Form>
            )}
          </Formik>
        </Col>
      </Row>
    </>
  );
};

export default LeadDeatils;
