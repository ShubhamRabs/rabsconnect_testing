import React from "react";

// Importing necessary components and functions
import LeadHandler from "../../Handler/LeadHandler";
import {
  GetUserLeadsTableData,
  UserLeadTableDataCount,
} from "../../hooks/Leads/useUserLeadHook";

const UserLead = ({ dispatch, myglobalData }) => { 
  // Dynamic breadcrumb values for the page
  const breadcrumbValues = {
    pageName: "User Lead", // Displayed page name in the breadcrumb
    addButton: true, // Display an 'Add' button in the breadcrumb
    assignButton: true, // Display an 'Assign' button in the breadcrumb
  };

  // Return the LeadHandler component with necessary props
  return (
    <LeadHandler
      dispatch={dispatch} // Pass the dispatch function as a prop
      tableDataFunction={GetUserLeadsTableData} // Function to fetch table data
      tableDataCountFunction={UserLeadTableDataCount()} // Function to fetch table data count
      breadcrumbValues={breadcrumbValues} // Dynamic breadcrumb values
      FetchCounting={true} // Enable fetching and displaying data count
      useQueryKey={["UserLeadTableData", "UserLeadTableCount"]} // Unique keys for the useQuery hooks
      myglobalData={myglobalData} // Additional global data
    />
  );
};

export default UserLead;
