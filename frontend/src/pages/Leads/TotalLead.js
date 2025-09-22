import React from "react";

// Importing necessary components and functions
import LeadHandler from "../../Handler/LeadHandler";
import {
  GetTotalLeadsTableData,
  TotalLeadTableDataCount,
} from "../../hooks/Leads/UseTotalLeadHook";

const TotalLead = ({ dispatch, myglobalData }) => {
  // Dynamic breadcrumb values for the page
  const breadcrumbValues = {
    pageName: "Total Lead", // Displayed page name in the breadcrumb
    addButton: true, // Display an 'Add' button in the breadcrumb
    assignButton: true, // Display an 'Assign' button in the breadcrumb
  };
  
  // Return the LeadHandler component with necessary props
  return (
    <LeadHandler
      dispatch={dispatch} // Pass the dispatch function as a prop
      tableDataFunction={GetTotalLeadsTableData} // Function to fetch table data
      tableDataCountFunction={TotalLeadTableDataCount()} // Function to fetch table data count
      breadcrumbValues={breadcrumbValues} // Dynamic breadcrumb values
      FetchCounting={true} // Enable fetching and displaying data count
      useQueryKey={["TotalLeadTableData", "TotalLeadTableCount"]} // Unique keys for the useQuery hooks
      myglobalData={myglobalData} // Additional global data
    />
  );
};

export default TotalLead;
