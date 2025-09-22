import React from "react";
import Breadcrumb from "../../components/Breadcrumb/Breadcrumb";
import { Formik, Form } from "formik";
import { useBootstrap, useMui, useSetting } from "../../hooks/Hooks";
import { QuickLeadSchema } from "./../../schema/Leads/QuickLeadSchema";
import {
  CustomFormGroup,
  CustomInputField,
  CustomSelectField,
  CustomTextareaField,
} from "../../components/FormUtility/FormUtility";
import { CreateLabelValueArray } from "./../../hooks/Function";
import { useQuery } from "react-query";
import CryptoJS from "crypto-js";
import { useQueryClient } from "react-query";
import { GetAllCandidatesStatus } from "../../hooks/DynamicFields/UseCandidatesStatusHook";
import { useQuickEditCandidate } from "../../hooks/HumanResources/UseCandidateHook";

// Define the QuickEditCandidate functional component
const QuickEditCandidate = ({ dispatch }) => {
  const { Card, Row, Col } = useBootstrap();
  const {
    ArrowBackIosIcon,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    SendOutlinedIcon,
    Typography,
    Timeline,
    TimelineItem,
    TimelineSeparator,
    TimelineConnector,
    TimelineDot,
    TimelineContent,
    timelineItemClasses,
    LoadingButton,
    Box,
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
  let CandidateData = JSON.parse(user_data);

  // Fetch all candidate status options using React Query
  const AllCandidatesStatus = useQuery("AllCandidatesStatus", () => {
    return GetAllCandidatesStatus(["candidate_status"]);
  });

  // Define initial form values based on candidate data
  let initialValues = {
    c_name: CandidateData.c_name,
    c_ccode: CandidateData.c_ccode,
    c_mob: CandidateData.c_mob,
    c_position: CandidateData.c_position,
    followup: CandidateData.followup,
    followup_dt: CandidateData.followup_dt,
    status_type: CandidateData.c_status,
    follow_up: CandidateData.followup,
    followup_dt: CandidateData.followup_dt,
    newComment: "",
    oldComment: CandidateData.comments,
    candidateId: CandidateData.c_id,
  };

  // Use the useQuickEditCandidate hook for mutation
  const { mutate, isLoading } = useQuickEditCandidate();

  // Use React Query client for invalidating queries after mutation
  const queryClient = useQueryClient();

  // Define the onSubmit function for form submission
  const onSubmit = (values) => {
    mutate(values, {
      onSuccess: (data) => {
        if (data.data === "Candidate is updated") {
          queryClient.invalidateQueries("SubMenuCandidateCount");
          localStorage.setItem("successMessage", data.data);
          dispatch({
            event:
              localStorage.getItem("previousScreen") ===
              localStorage.getItem("currScreen")
                ? "allcandidate"
                : localStorage.getItem("previousScreen"),
          });
        }
      },
    });
  };

  // Options for Follow Up select field
  const FollowUp = [
    { value: "Yes", label: "Yes" },
    { value: "No", label: "No" },
  ];

  // Render the component
  return (
    <>
      {/* Breadcrumb for navigation */}
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
                  ? "allcandidate"
                  : localStorage.getItem("previousScreen"),
            }),
        ]}
      />
      {/* Formik wrapper for form handling */}
      <Formik
        initialValues={initialValues}
        validationSchema={QuickLeadSchema}
        onSubmit={onSubmit}
      >
        {({ values, setFieldValue }) => (
          <Form>
            {/* Main card containing client details and status */}
            <Card className="my-3">
              {/* Client Details section */}
              <Card.Header className="custom-card-head">
                Client Details :-
              </Card.Header>
              <Card.Body>
                <Row>
                  {/* Display client details in List components */}
                  <Col md={3} sm={12}>
                    <List>
                      <ListItem>
                        <ListItemIcon>
                          <SendOutlinedIcon sx={{ fontSize: "25px" }} />
                        </ListItemIcon>
                        <ListItemText
                          className="client-details-info"
                          primary="Name"
                          secondary={CandidateData.c_name}
                        />
                      </ListItem>
                    </List>
                  </Col>
                  <Col md={4} sm={12}>
                    <List>
                      <ListItem>
                        <ListItemIcon>
                          <SendOutlinedIcon sx={{ fontSize: "25px" }} />
                        </ListItemIcon>
                        <ListItemText
                          className="client-details-info"
                          primary="Number"
                          secondary={
                            "+ " +
                            CandidateData.c_ccode +
                            " " +
                            CandidateData.c_alt_mob
                          }
                        />
                      </ListItem>
                    </List>
                  </Col>
                  <Col md={5} sm={12}>
                    <List>
                      <ListItem>
                        <ListItemIcon>
                          <SendOutlinedIcon sx={{ fontSize: "25px" }} />
                        </ListItemIcon>
                        <ListItemText
                          className="client-details-info"
                          primary="Position"
                          secondary={CandidateData.c_position}
                        />
                      </ListItem>
                    </List>
                  </Col>
                </Row>
              </Card.Body>
              {/* Client Status section */}
              <Card.Header className="custom-card-head">
                Client Status :-
              </Card.Header>
              <Card.Body>
                <Row>
                  {/* Form fields for Lead Status, Follow Up, Follow Up Date, and Add Comment */}
                  <Col md={5} sm={12}>
                    {/* Lead Status select field */}
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
                            AllCandidatesStatus?.data,
                            "candidate_status"
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
                    {/* Follow Up select field */}
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
                    {/* Follow Up Date input field (conditionally displayed based on Follow Up selection) */}
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
                            />
                          }
                        />
                      </Col>
                    ) : null}
                    {/* Add Comment input field */}
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
                  </Col>
                  {/* Display Previous Comments in a Timeline */}
                  <Col md={1} sm={12}></Col>
                  <Col md={5} sm={12} style={{ position: "relative" }}>
                    <Box
                      sx={{
                        height: values.follow_up === "Yes" ? "265px" : "235px",
                        overflowY: "auto",
                        top: values.follow_up === "Yes" ? "-8.8rem" : "-5.3rem",
                      }}
                    >
                      <Typography variant="h6" className="custom-form-label">
                        Previous Comments
                      </Typography>
                      <Timeline
                        sx={{
                          [`& .${timelineItemClasses.root}:before`]: {
                            flex: 0,
                            padding: 0,
                          },
                          margin: "0%",
                        }}
                      >
                        {CandidateData.comments
                          ?.split("~")
                          .map((comment, i) => (
                            <TimelineItem key={i}>
                              <TimelineSeparator>
                                <TimelineDot />
                                <TimelineConnector />
                              </TimelineSeparator>
                              <TimelineContent sx={{ fontSize: "14px" }}>
                                {comment}
                              </TimelineContent>
                            </TimelineItem>
                          ))}
                      </Timeline>
                    </Box>
                  </Col>
                  {/* Submit button */}
                  <Col md={6} sm={12} className="text-center">
                    <LoadingButton
                      variant="contained"
                      type="submit"
                      loading={isLoading}
                    >
                      Save Lead
                    </LoadingButton>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Form>
        )}
      </Formik>
    </>
  );
};

// Export the QuickEditCandidate component
export default QuickEditCandidate;