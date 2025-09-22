import React from "react";

// Importing necessary components and functions
import LeadAssignReportHandler from "../../Handler/LeadAssignReportHandler";
import {
  GetLeadAssignReportTableData,
  LeadAssignReportTableDataCount,
} from "../../hooks/Leads/UseLeadAssignReportHook";

const LeadAssignReport = ({ dispatch, myglobalData }) => {
  // Dynamic breadcrumb values for the page
  const breadcrumbValues = {
    pageName: "Lead Assign Report", // Displayed page name in the breadcrumb
    addButton: true, // Display an 'Add' button in the breadcrumb
    assignButton: true, // Display an 'Assign' button in the breadcrumb
  };

  // Return the LeadAssignReportHandler component with necessary props
  return (
    <LeadAssignReportHandler
      dispatch={dispatch} // Pass the dispatch function as a prop
      tableDataFunction={GetLeadAssignReportTableData} // Function to fetch table data
      tableDataCountFunction={LeadAssignReportTableDataCount()} // Function to fetch table data count
      breadcrumbValues={breadcrumbValues} // Dynamic breadcrumb values
      FetchCounting={true} // Enable fetching and displaying data count
      useQueryKey={["LeadAssignReportTableData", "LeadAssignReportTableCount"]} // Unique keys for the useQuery hooks
      myglobalData={myglobalData} // Additional global data
    />
  );
};

export default LeadAssignReport;
