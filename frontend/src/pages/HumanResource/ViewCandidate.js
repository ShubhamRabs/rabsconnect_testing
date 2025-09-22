import React from "react";
import Breadcrumb from "../../components/Breadcrumb/Breadcrumb";
import { useBootstrap, useMui, useSetting } from "../../hooks/Hooks";
import CryptoJS from "crypto-js";
import "./../../assets/css/ViewCandidate.css";
import dayjs from "dayjs";

// Define the ViewCandidate functional component
const ViewCandidate = ({ dispatch }) => {
  const { Card, Col, Row } = useBootstrap();
  const {
    ArrowBackIosIcon,
    Divider,
    Timeline,
    TimelineItem,
    timelineItemClasses,
    TimelineSeparator,
    TimelineConnector,
    TimelineContent,
    TimelineDot,
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
  const CandidateData = JSON.parse(user_data);

  console.log(CandidateData,"CandidateData");

  // Split comments into an array
  const comments = CandidateData.comments.split("~");

  // Arrays containing candidate details and status information
  const CandidateDetailsArr = [
    { label: "Posted On", desc: CandidateData.create_dt },
    { label: "Last Updated On", desc: CandidateData.update_dt },
    { label: "Candidate Name", desc: CandidateData.c_name },
    { label: "Source", desc: CandidateData.c_source },
    { label: "Email Id", desc: CandidateData.c_email },
    {
      label: "Mobile No.",
      desc: "+" + CandidateData.c_ccode + " " + CandidateData.c_mob,
    },
    {
      label: "Alt. Mobile No.",
      desc:
        CandidateData.c_alt_mob !== undefined &&
        "+" + CandidateData.c_alt_ccode + " " + CandidateData.c_alt_mob,
    },
    {
      label: "Address",
      desc:
        CandidateData.locality +
        ", " +
        CandidateData.city +
        ", " +
        CandidateData.state +
        ", " +
        CandidateData.country,
    },
  ];

  const CandidateStatus = [
    { label: "Position", desc: CandidateData.c_position },
    { label: "Candidate Status", desc: CandidateData.c_status },
    { label: "Date Of Birth", desc: CandidateData.c_dob },
    {
      label: "Followup Date",
      desc: dayjs(CandidateData.followup_dt).format("YYYY-MM-DD"),
    },
    {
      label: "Followup Time",
      desc: dayjs(CandidateData.followup_dt).format("hh:mm A"),
    },
  ];

  // Render the component
  return (
    <>
      {/* Breadcrumb for navigation */}
      <Breadcrumb
        PageName="View Candidate Details"
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
      {/* Main card containing candidate details */}
      <Card className="mt-3">
        <Card.Header className="custom-card-head">
          View Candidate Details :-
        </Card.Header>
        <Card.Body>
          <Row>
            {/* Display CandidateDetailsArr in two columns */}
            {CandidateDetailsArr.map((details, id) => {
              return details.desc !== "" && details.desc !== "null" ? (
                <Col md={6} sm={12} key={id} className="custom-view-section">
                  <Row>
                    <Col md={4} sm={4}>
                      <p className="custom-subhead custom-form-title">
                        {details.label}
                      </p>
                    </Col>
                    <Col md={1} sm={1}>
                      <p>-</p>
                    </Col>
                    <Col md={7} sm={7} className="custom-subhead">
                      <p className="custom-subhead">{details.desc}</p>
                    </Col>
                  </Row>
                </Col>
              ) : null;
            })}
          </Row>
          <Divider />
          <Row>
            {/* Display CandidateStatus in two columns */}
            <Col md={6} sm={12}>
              {CandidateStatus.map((details, id) => {
                return details.desc !== "" && details.desc !== "null" ? (
                  <Row md={12} sm={12} key={id} className="custom-view-section">
                    <Col
                      md={4}
                      sm={4}
                      className="custom-subhead custom-form-title"
                    >
                      {details.label}
                    </Col>
                    <Col md={1} sm={1}>
                      -
                    </Col>
                    <Col md={7} sm={7} className="custom-subhead">
                      {details.desc}
                    </Col>
                  </Row>
                ) : null;
              })}
            </Col>
            {/* Display comments in a scrollable timeline */}
            <Col md={6} sm={12}>
              <Row
                md={12}
                sm={12}
                style={{
                  height: "310px",
                  overflowY: "auto",
                }}
              >
                <Card.Text> Comments</Card.Text>
                <Timeline
                  sx={{
                    [`& .${timelineItemClasses.root}:before`]: {
                      flex: 0,
                      padding: 0,
                    },
                    margin: "0%",
                  }}
                >
                  {comments?.map((comment, i) => (
                    <TimelineItem key={i}>
                      <TimelineSeparator>
                        <TimelineDot />
                        <TimelineConnector />
                      </TimelineSeparator>
                      <TimelineContent
                        className="custom-subhead"
                        sx={{ fontSize: "14px" }}
                      >
                        {comment}
                      </TimelineContent>
                    </TimelineItem>
                  ))}
                </Timeline>
              </Row>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </>
  );
};

// Export the ViewCandidate component
export default ViewCandidate;