import React from "react";
import CryptoJS from "crypto-js";
import { useSetting } from "../../hooks/Hooks";
import {
  GetBrokerLeadCountById,
  GetLeadsByBrokerId,
} from "../../hooks/Leads/useBrokerLeadHook";
import LeadHandler from "../../Handler/LeadHandler";

const ViewBrokerLead = ({ dispatch, myglobalData }) => {
  const { globalData } = useSetting();
  // Retrieve encryption key from global data
  let CryptoJSKey = globalData.CompanyName + "@" + globalData.Version;
  const data = JSON.parse(
    CryptoJS.AES.decrypt(
      localStorage.getItem("store_new_data"),
      CryptoJSKey
    ).toString(CryptoJS.enc.Utf8)
  );

  const breadcrumbValues = {
    pageName: "Broker's Lead", // Displayed page name in the breadcrumb
    addButton: true, // Display an 'Add' button in the breadcrumb
    assignButton: false, // Do not display an 'Assign' button in the breadcrumb
  };
  return (
    <LeadHandler
      tableDataFunctionParams={data.brk_id}
      dispatch={dispatch} // Pass the dispatch function as a prop
      tableDataFunction={GetLeadsByBrokerId} // Function to fetch table data for broker leads
      tableDataCountFunction={GetBrokerLeadCountById(data.brk_id)} // Function to fetch data count for broker leads
      breadcrumbValues={breadcrumbValues} // Dynamic breadcrumb values
      FetchCounting={true} // Enable fetching and displaying data count
      useQueryKey={["BrokerLeadTableData", "BrokerLeadTableCount"]} // Unique keys for the useQuery hooks
      myglobalData={myglobalData} // Additional global data passed as a prop
    />
  );
};

export default ViewBrokerLead;
