import React from "react";
import Breadcrumb from "../../components/Breadcrumb/Breadcrumb";
import { useBootstrap, useMui, useSetting } from "../../hooks/Hooks";
import CryptoJS from "crypto-js";
import "./ViewLoan.css";
import dayjs from "dayjs";

// Define the ViewLoan functional component
const ViewLoan = ({ dispatch }) => {
  const { Card, Col, Row } = useBootstrap();
  const {
    ArrowBackIosIcon,
    Divider,
    // Timeline,
    // TimelineItem,
    // timelineItemClasses,
    // TimelineSeparator,
    // TimelineConnector,
    // TimelineContent,
    // TimelineDot,
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
  const LoanDetails = JSON.parse(user_data);

  // Arrays containing loan details and status information
  const LoanDetailsArr = [
    { label: "Posted On", desc: LoanDetails.create_dt },
    { label: "Last Updated On", desc: LoanDetails.update_dt },
    { label: "Client Name", desc: LoanDetails.client_name },
    {
      label: "Mobile No.",
      desc: "+" + LoanDetails.ccode + " " + LoanDetails.mob,
    },
    { label: "Project Name", desc: LoanDetails.project_name },
    { label: "Booking Date", desc: LoanDetails.booking_date },
    { label: "Unit Details", desc: LoanDetails.unit_details },
    { label: "Bank Name", desc: LoanDetails.bank_name },
    { label: "Sales Manager", desc: LoanDetails.sales_manager },
    { label: "Status", desc: LoanDetails.status },
    { label: "Sanction Amount", desc: LoanDetails.sanction_amount },
  ];

  // Render the component
  return (
    <>
      {/* Breadcrumb for navigation */}
      <Breadcrumb
        PageName="View Loan Details"
        BackButton={[
          true,
          "Back",
          <ArrowBackIosIcon />,
          () =>
            dispatch({
              event:
                localStorage.getItem("previousScreen") ===
                localStorage.getItem("currScreen")
                  ? "loandetails"
                  : localStorage.getItem("previousScreen"),
            }),
        ]}
      />
      {/* Main card containing candidate details */}
      <Card className="mt-3">
        <Card.Header className="custom-card-head">
          View Loan Details :-
        </Card.Header>
        <Card.Body>
          <Row>
            {/* Display LoanDetailsArr in two columns */}
            {LoanDetailsArr.map((details, id) => {
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

// Export the ViewLoan component
export default ViewLoan;
