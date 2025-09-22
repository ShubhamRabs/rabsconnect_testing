import React from "react";
import HumanResourceHandler from "../../Handler/HumanResourceHandler";
import {
  GetNonAssignCandidatesTableData,
  NonAssignCandidatesTableDataCount,
} from "../../hooks/HumanResources/UseNonAssignCandidateHook";

// Define the NonAssignCandidate functional component
const NonAssignCandidate = ({ dispatch, myglobalData }) => {
  // Breadcrumb values for dynamic breadcrumb display
  const breadcrumbValues = {
    pageName: "Non Assign Candidates", // Dynamic breadcrumb values
    addButton: true, // Display add button in breadcrumb
    assignButton: true, // Display assign button in breadcrumb
  };

  // Return the HumanResourceHandler component with specific configurations
  return (
    <HumanResourceHandler
      tableDataFunction={GetNonAssignCandidatesTableData} // Function to fetch non-assigned candidate data
      tableDataCountFunction={NonAssignCandidatesTableDataCount()} // Function to fetch total count of non-assigned candidates
      dispatch={dispatch} // Function for dispatching actions
      myglobalData={myglobalData} // Global data used within the component
      breadcrumbValues={breadcrumbValues} // Breadcrumb configuration
      FetchCounting={true} // Flag indicating whether counting information should be fetched
    />
  );
};

// Export the NonAssignCandidate component
export default NonAssignCandidate;