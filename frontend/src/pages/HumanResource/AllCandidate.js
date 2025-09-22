import React from "react";
import HumanResourceHandler from "../../Handler/HumanResourceHandler";
import {
  GetTotalCandidatesTableData,
  TotalCandidatesTableDataCount,
} from "../../hooks/HumanResources/UseAllCandidateHook";

// Define the AllCandidate functional component
const AllCandidate = ({ dispatch, myglobalData }) => {
  // Breadcrumb values for dynamic breadcrumb display
  const breadcrumbValues = {
    pageName: "All Candidates", // Dynamic breadcrumb values
    addButton: true, // Display add button in breadcrumb
    assignButton: true, // Display assign button in breadcrumb
  };

  // Return the HumanResourceHandler component with specific configurations
  return (
    <HumanResourceHandler
      tableDataFunction={GetTotalCandidatesTableData} // Function to fetch candidate data
      tableDataCountFunction={TotalCandidatesTableDataCount()} // Function to fetch total count of candidates
      dispatch={dispatch} // Function for dispatching actions
      myglobalData={myglobalData} // Global data used within the component
      breadcrumbValues={breadcrumbValues} // Breadcrumb configuration
      FetchCounting={true} // Flag indicating whether counting information should be fetched
    />
  );
};

// Export the AllCandidate component
export default AllCandidate;