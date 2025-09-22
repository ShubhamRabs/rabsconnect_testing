import React from "react";
import Breadcrumb from "../../components/Breadcrumb/Breadcrumb";
import { useMui, useSetting } from "../../hooks/Hooks";
import CryptoJS from "crypto-js";
import "./ViewBroker.css";

// Define the ViewBroker functional component
const ViewBroker = ({ dispatch, myglobalData }) => {
  const { ArrowBackIosIcon } = useMui();
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

  // Arrays containing broker details and status information
  const BrokerDetailsArr = [
    { label: "Posted On", desc: BrokerDetails.create_dt },
    { label: "Last Updated On", desc: BrokerDetails.update_dt },
    { label: "Broker Name", desc: BrokerDetails.name },
    { label: "Email", desc: BrokerDetails.email },
    {
      label: "Mobile No.",
      desc: "+" + BrokerDetails.ccode + " " + BrokerDetails.mob,
    },
    { label: "Company", desc: BrokerDetails.company },
    { label: "RERA No.", desc: BrokerDetails.rera_no },
    { label: "Location", desc: BrokerDetails.brk_location },
    { label: "Address", desc: BrokerDetails.address },
    { label: "Remark", desc: BrokerDetails.remark },
  ];

  // Render the component
  return (
    <>
      <Breadcrumb
        PageName="View Broker Details"
        BackButton={[
          true,
          "Back",
          <ArrowBackIosIcon />,
          () =>
            dispatch({
              event:
                localStorage.getItem("previousScreen") ===
                localStorage.getItem("currScreen")
                  ? "brokerdetails"
                  : localStorage.getItem("previousScreen"),
            }),
        ]}
      />
      <div className="view-broker">
        <div className="details-container">
          {BrokerDetailsArr.map((details, id) => {
            return details.desc !== "" && details.desc !== "null" ? (
              <div key={id} className="details-item">
                <span className="label">{details.label}:</span>
                <span className="description">{details.desc}</span>
              </div>
            ) : null;
          })}
        </div>
      </div>
      {BrokerDetails.document && (
        <div className="details-item">
          <span className="label me-3"> Document :</span>
          <div
            style={{
              width: "300px",
              height: "300px",
              padding:'10px',
              overflow: "auto", 
              border: "1px solid #ccc",
              display: "flex", 
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <img
              style={{
                maxWidth: "100%", 
                maxHeight: "100%", 
                display: "block", 
              }}
              src={`${myglobalData.API_URL}/uploads/broker/${BrokerDetails.document}`}
              alt="Broker Document"
            />
          </div>
        </div>
      )}
    </>
  );
};

// Export the ViewBroker component
export default ViewBroker;
