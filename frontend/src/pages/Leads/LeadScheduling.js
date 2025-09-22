import React from "react";

// Importing necessary components and functions
import LeadSchedulingHandler from "../../Handler/LeadSchedulingHandler";
import {
  GetLeadSchedulingTableData,
  LeadSchedulingTableDataCount,
} from "../../hooks/Leads/UseLeadSchedulingHook";

const LeadScheduling = ({ dispatch, myglobalData }) => {
  // Dynamic breadcrumb values for the page
  const breadcrumbValues = {
    pageName: "Lead Scheduling", // Displayed page name in the breadcrumb
    addButton: true, // Display an 'Add' button in the breadcrumb
    assignButton: true, // Display an 'Assign' button in the breadcrumb
  };

  // Return the LeadSchedulingHandler component with necessary props
  return (
    <LeadSchedulingHandler
      dispatch={dispatch} // Pass the dispatch function as a prop
      tableDataFunction={GetLeadSchedulingTableData} // Function to fetch table data
      tableDataCountFunction={LeadSchedulingTableDataCount()} // Function to fetch table data count
      breadcrumbValues={breadcrumbValues} // Dynamic breadcrumb values
      FetchCounting={true} // Enable fetching and displaying data count
      useQueryKey={["LeadSchedulingTableData", "LeadSchedulingTableCount"]} // Unique keys for the useQuery hooks
      myglobalData={myglobalData} // Additional global data
    />
  );
};

export default LeadScheduling;
