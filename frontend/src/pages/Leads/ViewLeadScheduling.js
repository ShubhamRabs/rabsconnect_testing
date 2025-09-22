import React from "react";
import Breadcrumb from "../../components/Breadcrumb/Breadcrumb";
import { useBootstrap, useMui, useSetting } from "../../hooks/Hooks";
import dayjs from "dayjs";
import CryptoJS from "crypto-js";
import "./../../assets/css/ViewLeadDetails.css";
import { useQuery } from "react-query";
import {
  getLeadAssignUserData,
  getLeadAssignUserList,
} from "../../hooks/Leads/UseLeadsHook";
// import {
//   CustomDescription,
//   CustomHeading,
//   CustomSubTitle,
// } from "../../components/Common/Common";
// import { stringAvatar } from "../../hooks/Function";

const ViewLeadDetails = ({ dispatch, myglobalData }) => {
  const { Card, Row, Col, Tab, Tabs } = useBootstrap();
  const { globalData } = useSetting();

  const {
    ArrowBackIosIcon,
    Divider,
    // Avatar,
    // Timeline,
    // TimelineItem,
    // TimelineSeparator,
    // TimelineConnector,
    // TimelineContent,
    // AccessTimeOutlinedIcon,
    // TimelineDot,
    // Alert,
    PersonIcon,
  } = useMui();

  // State to track the selected user for lead details
  const [SelectedUser, setSelectedUser] = React.useState("Master");

  // Encryption key
  let CryptoJSKey = globalData.CompanyName + "@" + globalData.Version;

  // Decrypting user data from local storage
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

  var user_data = bytes.toString(CryptoJS.enc.Utf8);

  // State to hold lead details
  const [LeadDetails, setLeadDetails] = React.useState(JSON.parse(user_data));

  // Query to get the list of assigned users for the lead
  const AssignUserList = useQuery(
    ["view-leads", LeadDetails.l_id, LeadDetails.assignlead_id],
    () => getLeadAssignUserList(LeadDetails.l_id, LeadDetails.assignlead_id)
  );

  // Query to get user data for the lead
  // const userLeadData = useQuery(["view-edit-leads", LeadDetails.l_id], () =>
  //   getLeadAssignUserData(LeadDetails.l_id)
  // );

  // If data is still loading, display a loading message
  if (AssignUserList.isLoading) return <div>Loading...</div>;

  // Splitting comments and storing them in an array
  //   const comments = LeadDetails.comments?.split("~");

  // Handle click on user button to switch between Master and assigned users
  // const HandleUserButton = (userID) => {
  //   setSelectedUser(userID);
  //   if (userID === "Master") {
  //     setLeadDetails(JSON.parse(user_data));
  //   } else {
  //     userLeadData.data?.data
  //       .filter((data) => data.assignto_id === Number(userID))
  //       .map((row) => setLeadDetails(row));
  //   }
  // };

  let assignto = "";
  if (LeadDetails.assignto) {
    if (LeadDetails.assignto.includes(",")) {
      assignto = (
        <div className="d-flex flex-wrap align-items-center">
          <PersonIcon fontSize="small" color="primary" />
          {LeadDetails.assignto.split(",").map((item, index) => (
            <React.Fragment key={index}>
              <span className="mx-1">{item},</span>
              {index !== LeadDetails.assignto.split(",").length - 1 && (
                <PersonIcon fontSize="small" color="primary" />
              )}
            </React.Fragment>
          ))}
        </div>
      );
    } else {
      assignto = (
        <div className="d-flex flex-wrap align-items-center">
          <PersonIcon /> {LeadDetails.assignto}
        </div>
      );
    }
  }

  // Details about the client's status
  const ScheduleLeadDetailsArr = [
    {
      label: "Posted On",
      desc: LeadDetails.create_dt,
    },
    // {
    //   label: "Update Date",
    //   desc: dayjs(LeadDetails.update_dt).format("YYYY-MM-DD"),
    // },
    // {
    //   label: "Update Time",
    //   desc: dayjs(LeadDetails.update_dt).format("hh:mm A"),
    // },
    { label: "Created By", desc: LeadDetails.createdby },
    { label: "Schedule Type", desc: LeadDetails.schedule_type },
    { label: "Source", desc: LeadDetails.source.includes(",") ? LeadDetails.source.replace(/,/g, ", ") : LeadDetails.source },
    
    {
      label: "Assign To",
      desc: assignto,
    },
    {
      label: "No of leads",
      desc: LeadDetails.no_of_leads,
    },
    {
      label: "Status",
      desc: LeadDetails.status,
    },
    {
      label: "Lead date",
      desc:
          LeadDetails.ldate_from === "0000-00-00"
          ? ""
          : "From " + dayjs(LeadDetails.ldate_from).format("YYYY-MM-DD") + " To " + dayjs(LeadDetails.ldate_to).format("YYYY-MM-DD"),
    },
    // {
    //   label: "Lead date To",
    //   desc:
    //     LeadDetails.ldate_to === "0000-00-00"
    //       ? ""
    //       : dayjs(LeadDetails.ldate_to).format("YYYY-MM-DD"),
    // },
    { label: "Service Type", desc: LeadDetails.service_type.includes(",") ? LeadDetails.service_type.replace(/,/g, ", ") : LeadDetails.service_type },
    { label: "City", desc: LeadDetails.city.includes(",") ? LeadDetails.city.replace(/,/g, ", ") : LeadDetails.city },
    { label: "Locality", desc: LeadDetails.locality.includes(",") ? LeadDetails.locality.replace(/,/g, ", ") : LeadDetails.locality },
    { label: "Project Name", desc: LeadDetails.pname.includes(",") ? LeadDetails.pname.replace(/,/g, ", ") : LeadDetails.pname },
  ];

  return (
    <>
      {/* Breadcrumb for navigation */}
      <Breadcrumb
        PageName="View Lead Scheduling"
        BackButton={[
          true,
          "Back",
          <ArrowBackIosIcon />,
          () =>
            dispatch({
              event:
                localStorage.getItem("previousScreen") ===
                localStorage.getItem("currScreen")
                  ? "leadscheduling"
                  : localStorage.getItem("previousScreen"),
            }),
        ]}
      />
      {/* Main card containing candidate details */}
      <Card className="mt-3">
        <Card.Header className="custom-card-head">
          View Lead Schedule Details :-
        </Card.Header>
        <Card.Body>
          <Row>
            {/* Display ScheduleLeadDetailsArr in two columns */}
            {ScheduleLeadDetailsArr.map((details, id) => {
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
        </Card.Body>
      </Card>
    </>
  );
};

export default ViewLeadDetails;
