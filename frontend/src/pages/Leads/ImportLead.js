import React from "react";

// Importing necessary components and functions
import LeadHandler from "../../Handler/LeadHandler";
import {
} from "../../hooks/Leads/UseTotalLeadHook";
import { GetTotalLeadsImportTableData, TotalImportLeadTableDataCount } from "../../hooks/Leads/UseImportLeadHook";

const TotalLead = ({ dispatch, myglobalData }) => {
  // Dynamic breadcrumb values for the page
  const breadcrumbValues = {
    pageName: "Import Lead", // Displayed page name in the breadcrumb
    addButton: true, // Display an 'Add' button in the breadcrumb
    assignButton: true, // Display an 'Assign' button in the breadcrumb
  };

  // Return the LeadHandler component with necessary props
  return (
    <LeadHandler
      dispatch={dispatch} // Pass the dispatch function as a prop
      tableDataFunction={GetTotalLeadsImportTableData} // Function to fetch table data
      tableDataCountFunction={TotalImportLeadTableDataCount()} // Function to fetch table data count
      breadcrumbValues={breadcrumbValues} // Dynamic breadcrumb values
      FetchCounting={true} // Enable fetching and displaying data count
      useQueryKey={["TotalLeadImportTableData", "TotalLeadImportTableCount"]} // Unique keys for the useQuery hooks
      myglobalData={myglobalData} // Additional global data
    />
  );
};

export default TotalLead;
