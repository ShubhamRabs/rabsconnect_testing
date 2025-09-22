import React from "react";

// Importing necessary components and functions
import LeadHandler from "../../Handler/LeadHandler";
import {
  GetNonAssignLeadsTableData,
  NonAssignLeadTableDataCount,
} from "../../hooks/Leads/UseNonAssignLeadHook";

const NonAssignLead = ({ dispatch }) => {
  // Dynamic breadcrumb values for the page
  const breadcrumbValues = {
    pageName: "Non Assign Lead", // Displayed page name in the breadcrumb
    addButton: true, // Display an 'Add' button in the breadcrumb
    assignButton: false, // Do not display an 'Assign' button in the breadcrumb
  };

  // Return the LeadHandler component with necessary props
  return (
    <LeadHandler
      dispatch={dispatch} // Pass the dispatch function as a prop
      tableDataFunction={GetNonAssignLeadsTableData} // Function to fetch table data
      tableDataCountFunction={NonAssignLeadTableDataCount()} // Function to fetch table data count
      FetchCounting={true} // Enable fetching and displaying data count
      breadcrumbValues={breadcrumbValues} // Dynamic breadcrumb values
      useQueryKey={["NonAssignLeadTableData", "NonAssignLeadTableCount"]} // Unique keys for the useQuery hooks
    />
  );
};

export default NonAssignLead;
