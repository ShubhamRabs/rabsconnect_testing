import React from "react";
import Breadcrumb from "../../components/Breadcrumb/Breadcrumb";
import { useBootstrap, useMui, useSetting } from "../../hooks/Hooks";
import dayjs from "dayjs";
import CryptoJS from "crypto-js";
import "../../assets/css/ViewLeadDetails.css";
import { useQuery } from "react-query";
import {
  getLeadAssignUserData,
  getLeadAssignUserList,
} from "../../hooks/Leads/UseLeadsHook";
import {
  CustomDescription,
  CustomHeading,
  CustomSubTitle,
} from "../../components/Common/Common";
import { stringAvatar } from "../../hooks/Function";
import { Box, Grid } from "@mui/material";
// import { getLeadCallData, getLeadData } from "../../hooks/Leads/useCallLogHook";
import { MessageSquareMore, Flame, Phone } from "lucide-react";
import LeadTimelineHandler from "../../Handler/LeadTimelineHandler";

const ViewLeadDetails = () => {
  const { Card, Row, Col, Alert } = useBootstrap();
  const { globalData } = useSetting();

  const { Avatar } = useMui();

  const [SelectedUser, setSelectedUser] = React.useState("Master");
  let CryptoJSKey = globalData.CompanyName + "@" + globalData.Version;

  let bytes;
  const userDataKey =
    localStorage.getItem("previousScreen") === "leadbystatus"
      ? "store_new_data"
      : "updateglobal_userdata";

  bytes = CryptoJS.AES.decrypt(localStorage.getItem(userDataKey), CryptoJSKey);

  const user_data = bytes.toString(CryptoJS.enc.Utf8);
  const [LeadDetails, setLeadDetails] = React.useState(JSON.parse(user_data));

  const AssignUserList = useQuery(
    ["view-leads", LeadDetails.l_id, LeadDetails.assignlead_id],
    () => getLeadAssignUserList(LeadDetails.l_id, LeadDetails.assignlead_id)
  );

  if (AssignUserList.isLoading) return <div>Loading...</div>;

  // const comments = LeadDetails.comments?.split("~");

  const ClientPersonalDetails = [
    { label: "Posted On", desc: LeadDetails.create_dt },
    { label: "Lead Type", desc: LeadDetails.source_type },
    { label: "Source", desc: LeadDetails.source },
    { label: "Lead Name", desc: LeadDetails.lname },
    { label: "Assigned Users", desc: LeadDetails.assign_users },
    {
      label: "Mobile No.",
      desc: "+" + LeadDetails.p_ccode + " " + LeadDetails.p_mob,
    },
    {
      label: "Alt. Mobile No.",
      desc:
        "+" + LeadDetails.p_ccode ||
        LeadDetails.s_ccode + " " + LeadDetails.s_mob,
    },
    { label: "Email Id.", desc: LeadDetails.p_email },
  ];

  const Document = [
    {
      label: "Document",
      desc: LeadDetails.document || "No Document",
    },
  ];
  const ClientStatus = [
    {
      label: "Lead Status",
      desc: LeadDetails.admin_status || LeadDetails.status,
    },

    {
      label: "Followup Date",
      desc:
        LeadDetails.followup_dt === "0000-00-00 00:00:00"
          ? ""
          : dayjs(LeadDetails.followup_dt).format("YYYY-MM-DD"),
    },
    {
      label: "Followup Time",
      desc:
        LeadDetails.followup_dt === "0000-00-00 00:00:00"
          ? ""
          : dayjs(LeadDetails.followup_dt).format("hh:mm A"),
    },
    { label: "Project Name", desc: LeadDetails.pname },
  ];

  const ClientRequirementDetails = [
    { label: "Service Type", desc: LeadDetails.service_type },
    { label: "Property Type", desc: LeadDetails.ptype },
    { label: "Property Category", desc: LeadDetails.pcategory },
    { label: "Configuration", desc: LeadDetails.pconfiguration },
    { label: "Selected Buyer", desc: LeadDetails.buyer_type },
    { label: "Selected Investor", desc: LeadDetails.investment_type },
    { label: "Post Handover", desc: LeadDetails.post_handover },
    { label: "Handover Year", desc: LeadDetails.handover_year },
    { label: "Lead Priority", desc: LeadDetails.lead_priority },
    {
      label: "Property Area",
      desc:
        LeadDetails.min_area +
        " - " +
        LeadDetails.max_area +
        " " +
        LeadDetails.area_unit,
    },
    {
      label: "Property Price",
      desc:
        LeadDetails.min_price +
        " - " +
        LeadDetails.max_price +
        " " +
        decodeURIComponent(LeadDetails.price_unit),
    },
    { label: "Country", desc: LeadDetails.country },
    { label: "State", desc: LeadDetails.state },
    { label: "City", desc: LeadDetails.city },
    { label: "Locality", desc: LeadDetails.locality },
    { label: "Sub Locality", desc: LeadDetails.sub_locality },
    { label: "Other Details", desc: LeadDetails.other_details },
  ];

  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={8}>
          <Card className="mt-3 view-lead-details" style={styles.card}>
            <Card.Body>
              {AssignUserList.data.data === null && (
                <Alert sx={{ mb: 2 }}>No assigned users found.</Alert>
              )}
              <Row>
                <Col md={6} className="w-50">
                  <div className="p-2">
                    <CustomHeading
                      Heading="Client Personal Details"
                      style={styles.sectionHeading}
                    />
                    <div style={styles.viewLeadDetailsList}>
                      {ClientPersonalDetails.map((item, i) => (
                        <Card key={i} style={styles.detailsItem}>
                          <div style={styles.flexRow}>
                            <CustomSubTitle SubTitle={`${item.label}:`} />
                            <CustomDescription
                              startIcon={item.icon}
                              Description={item.desc}
                            />
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                </Col>
                <Col md={6} className="w-50">
                  <div className="p-2">
                    <CustomHeading
                      Heading="Client Requirement Details"
                      style={styles.sectionHeading}
                    />
                    <div style={styles.viewLeadDetailsList}>
                      {ClientRequirementDetails.map(
                        (details, id) =>
                          details.desc !== "" &&
                          details.desc !== "null" && (
                            <Card key={id} style={styles.detailsItem}>
                              <div style={styles.flexRow}>
                                <CustomSubTitle
                                  SubTitle={details.label + ":"}
                                />
                                <CustomDescription Description={details.desc} />
                              </div>
                            </Card>
                          )
                      )}
                    </div>
                  </div>
                </Col>
              </Row>
              <Row>
                <Col md={6} className="w-50">
                  <div className="p-2">
                    <CustomHeading
                      Heading="Client Status"
                      style={styles.sectionHeading}
                    />
                    <div style={styles.viewLeadDetailsList}>
                      {ClientStatus.map(
                        (details, id) =>
                          details.desc !== "" &&
                          details.desc !== "null" && (
                            <Card key={id} style={styles.detailsItem}>
                              <div style={styles.flexRow}>
                                <CustomSubTitle
                                  SubTitle={details.label + ":"}
                                />
                                <CustomDescription Description={details.desc} />
                              </div>
                            </Card>
                          )
                      )}
                    </div>
                  </div>
                </Col>
                <Col md={6} className="w-50">
                  <div className="p-2">
                    <CustomHeading
                      Heading="Document"
                      style={styles.sectionHeading}
                    />
                    {/* <div style={styles.viewLeadDetailsList}>
                      {Document.map(
                        (details, id) =>
                          details.desc !== "" &&
                          details.desc !== "null" && (
                            <Card key={id} style={styles.detailsItem}>
                              <div style={styles.flexRow}>
                                <CustomSubTitle
                                  SubTitle={details.label + ":"}
                                />
                                <CustomDescription Description={details.desc} />
                              </div>
                            </Card>
                          )
                      )}
                    </div> */}
                    <div style={styles.viewLeadDetailsList}>
                      {Document.map(
                        (details, id) =>
                          details.desc !== "" &&
                          details.desc !== "null" && (
                            <Card key={id} style={styles.detailsItem}>
                              <div>
                                <CustomSubTitle
                                  SubTitle={details.label + ":"}
                                />

                                {/* Determine how to render the document based on its type */}
                                {details.desc.match(
                                  /\.(jpg|jpeg|png|gif)$/i
                                ) ? (
                                  // Render an image if desc contains an image file name
                                  <img
                                    src={
                                      globalData.API_URL +
                                      "/uploads/lead/" +
                                      details.desc
                                    }
                                    className="img-fluid"
                                    alt={details.label}
                                    style={styles.image}
                                  />
                                ) : details.desc.match(/\.(pdf)$/i) ? (
                                  // Render a PDF viewer if desc is a PDF file
                                  <img
                                    src={
                                      globalData.API_URL +
                                      "/uploads/lead/" +
                                      details.desc
                                    }
                                    title={details.label}
                                    height="100px"
                                    width="100%"
                                    style={styles.iframe}
                                  />
                                ) : (
                                  // Render a downloadable link for other document types
                                  <p>No document is attached</p>
                                )}
                              </div>
                            </Card>
                          )
                      )}
                    </div>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Grid>
        <Grid item xs={4}>
          <Box sx={{ p: 2 }}>
            <div style={styles.profileCard}>
              <div
                className="d-flex align-items-center"
                style={styles.avatarContainer}
              >
                <div style={styles.avatarImg}>
                  <Avatar
                    {...stringAvatar(LeadDetails.lname)}
                    className="comment-avatar"
                    sx={{ width: 60, height: 60, borderRadius: "10px" }}
                  />
                </div>
                <div style={styles.bannerContent}>
                  <h4 style={styles.name}>{LeadDetails.lname}</h4>
                  <p style={styles.description}>
                    {"Lead for " + LeadDetails.pname + " Project"}
                  </p>
                </div>
              </div>
            </div>
            <Card
              className="mt-3"
              style={{
                height: "450px",
                overflowY: "scroll",
                overflowX: "hidden",
                border: "none",
              }}
            >
              <LeadTimelineHandler LeadDetails={LeadDetails} />
            </Card>
          </Box>
        </Grid>
      </Grid>
    </>
  );
};

const styles = {
  card: {
    marginBottom: "16px",
  },
  sectionHeading: {
    fontSize: "1.25rem",
    fontWeight: "bold",
  },
  viewLeadDetailsList: {
    marginTop: "8px",
  },
  detailsItem: {
    marginBottom: "8px",
  },
  flexRow: {
    display: "flex",
    flexWrap: "wrap", // Allows wrapping of content
    gap: "1rem", // Adjusted gap for responsiveness
    padding: "10px 15px",
    alignItems: "flex-start", // Aligns items at the start
    justifyContent: "space-between",
    width: "100%",
  },
  commentsContainer: {
    display: "flex",
    flexDirection: "column",
  },
  profileCard: {
    padding: "1rem",
    border: "1px solid #ddd",
    borderRadius: "10px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    backgroundColor: "#fff",
    maxWidth: "400px",
    margin: "0 auto",
  },
  avatarContainer: {
    display: "flex",
    alignItems: "center",
    gap: "1rem",
  },
  avatarImg: {
    flexShrink: 0,
    padding: "5px",
    boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px",
    borderRadius: "10px",
    border: "1px solid #ddd",
    position: "absolute",
    backgroundColor: "#fff",
  },
  bannerContent: {
    flexGrow: 1,
    marginLeft: "6rem",
  },
  name: {
    margin: 0,
    fontSize: "1.30rem",
    fontWeight: "bold",
  },
  description: {
    margin: 0,
    color: "#777",
  },
};
export default ViewLeadDetails;
