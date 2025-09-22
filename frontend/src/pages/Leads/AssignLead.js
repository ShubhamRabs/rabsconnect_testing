import React from "react";
import {
  GetAssignLeadsTableData,
  AssignLeadTableDataCount,
} from "../../hooks/Leads/UseAssignLeadHook";
import LeadHandler from "../../Handler/LeadHandler";

const AssignLead = ({ dispatch, myglobalData }) => {
  // Dynamic breadcrumb values for the page
  const breadcrumbValues = {
    pageName: "Assign Lead", // Displayed page name in the breadcrumb
    addButton: true, // Display an 'Add' button in the breadcrumb
    assignButton: false, // Do not display an 'Assign' button in the breadcrumb
  };

  // Return the LeadHandler component with necessary props
  return (
    <LeadHandler
      dispatch={dispatch} // Pass the dispatch function as a prop
      tableDataFunction={GetAssignLeadsTableData} // Function to fetch table data for assigned leads
      tableDataCountFunction={AssignLeadTableDataCount()} // Function to fetch data count for assigned leads
      breadcrumbValues={breadcrumbValues} // Dynamic breadcrumb values
      FetchCounting={true} // Enable fetching and displaying data count
      useQueryKey={["AssignLeadTableData", "AssignLeadTableCount"]} // Unique keys for the useQuery hooks
      myglobalData={myglobalData} // Additional global data passed as a prop
    />
  );
};

export default AssignLead;