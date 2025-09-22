import React from "react";

// Importing necessary components and functions
import LeadHandler from "../../Handler/LeadHandler";
import {
  GetMissedLeadsTableData,
  MissedLeadTableDataCount,
} from "../../hooks/Leads/UseMissedLeadsHook";

const MissedLead = ({ dispatch, myglobalData }) => {
  // Dynamic breadcrumb values for the page
  const breadcrumbValues = {
    pageName: "Missed Followup", // Displayed page name in the breadcrumb
    addButton: true, // Display an 'Add' button in the breadcrumb
    assignButton: false, // Do not display an 'Assign' button in the breadcrumb
  };

  // Return the LeadHandler component with necessary props
  return (
    <LeadHandler
      dispatch={dispatch} // Pass the dispatch function as a prop
      tableDataFunction={GetMissedLeadsTableData} // Function to fetch table data
      tableDataCountFunction={MissedLeadTableDataCount()} // Function to fetch table data count
      FetchCounting={true} // Enable fetching and displaying data count
      breadcrumbValues={breadcrumbValues} // Dynamic breadcrumb values
      useQueryKey={["MissedLeadTableData", "MissedLeadTableCount"]} // Unique keys for the useQuery hooks
      myglobalData={myglobalData} // Additional global data passed as a prop
    />
  );
};

export default MissedLead;
