import React from "react";
import CryptoJS from "crypto-js";
import { useSetting } from "../../hooks/Hooks";
import LeadHandler from "../../Handler/LeadHandler";
import { GetLeadsBySourceTableData } from "../../hooks/Leads/UseLeadBySourceHook";

const LeadBySource = ({ dispatch, myglobalData }) => {
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

  // Dynamic breadcrumb values for the page
  const breadcrumbValues = {
    pageName: ParamData.source + " Leads", // Displayed page name in the breadcrumb
    addButton: true, // Display an 'Add' button in the breadcrumb
    assignButton: false, // Do not display an 'Assign' button in the breadcrumb
  };

  // Return the LeadHandler component with necessary props
  return (
    <LeadHandler
      dispatch={dispatch} // Pass the dispatch function as a prop
      breadcrumbValues={breadcrumbValues} // Dynamic breadcrumb values
      FetchCounting={false} // Disable fetching and displaying data count
      TotalDataCount={ParamData.lead_count} // Total data count based on user type
      myglobalData={myglobalData} // Additional global data passed as a prop
      useQueryKey={["LeadBySourceLeadTableData", "LeadBySourceLeadTableCount"]} // Unique keys for the useQuery hooks
      tableDataFunction={GetLeadsBySourceTableData} // Function to fetch table data
      tableDataFunctionParams={ParamData} // Additional parameters for fetching table data
    />
  );
};

export default LeadBySource;
