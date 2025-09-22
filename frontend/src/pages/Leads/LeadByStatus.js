import React from "react";
import CryptoJS from "crypto-js";
import LeadHandler from "../../Handler/LeadHandler";
import { GetLeadsByStatusTableData } from "../../hooks/Leads/UseLeadByStatusHook";
import { useSetting } from "../../hooks/Hooks";

const LeadByStatus = ({ dispatch, myglobalData }) => {
  // Fetch globalData from useSetting hook
  const { globalData } = useSetting();

  // Generate CryptoJSKey using globalData
  let CryptoJSKey = globalData.CompanyName + "@" + globalData.Version;

  // Decrypt stored user data from localStorage
  const bytes = CryptoJS.AES.decrypt(
    localStorage.getItem("updateglobal_userdata"),
    CryptoJSKey
  );

  // Parse decrypted user data
  var ParamData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  console.log(ParamData, "ParamData");

  // Dynamic breadcrumb values for the page
  const breadcrumbValues = {
    pageName: "Lead By Status", // Displayed page name in the breadcrumb
    addButton: true, // Display an 'Add' button in the breadcrumb
    assignButton: false, // Do not display an 'Assign' button in the breadcrumb
  };

  // Return the LeadHandler component with necessary props
  return (
    <LeadHandler
      dispatch={dispatch} // Pass the dispatch function as a prop
      breadcrumbValues={breadcrumbValues} // Dynamic breadcrumb values
      FetchCounting={false} // Disable fetching and displaying data count
      TotalDataCount={
        ParamData[0] === "Self"
          ? ParamData[1]?.master_count
          : ParamData[1]?.user_count
      } // Total data count based on user type
      tableDataFunction={GetLeadsByStatusTableData} // Function to fetch table data
      tableDataFunctionParams={ParamData} // Additional parameters for fetching table data
      useQueryKey={["LeadByStatusLeadTableData", "LeadByStatusLeadTableCount"]} // Unique keys for the useQuery hooks
      myglobalData={myglobalData} // Additional global data passed as a prop
      showAction={ParamData[0] === "Team" ? false : true} // Conditionally show/hide action buttons
      showCheckBox={ParamData[0] === "Team" ? false : true} // Conditionally show/hide checkboxes
    />
  );
};

export default LeadByStatus;
