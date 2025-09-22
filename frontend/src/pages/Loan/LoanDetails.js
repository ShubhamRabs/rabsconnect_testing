import React from "react";
import LoanHandler from "../../Handler/LoanHandler";
import {
  GetTotalLoanTableData,
  TotalLoanTableDataCount,
} from "../../hooks/Loan/UseLoanHook";

// Define the LoanDetails functional component
const LoanDetails = ({ dispatch, myglobalData }) => {
  // Breadcrumb values for dynamic breadcrumb display
  const breadcrumbValues = {
    pageName: "Loan Details", // Dynamic breadcrumb values
    addButton: true, // Display add button in breadcrumb
    assignButton: true, // Display assign button in breadcrumb
  };
 
  // Return the LoanHandler component with specific configurations
  return (
    <LoanHandler
      dispatch={dispatch} // Function for dispatching actions
      tableDataFunction={GetTotalLoanTableData} // Function to fetch candidate data
      tableDataCountFunction={TotalLoanTableDataCount()} // Function to fetch total count of candidates
      breadcrumbValues={breadcrumbValues} // Breadcrumb configuration
      FetchCounting={true} // Flag indicating whether counting information should be fetched
      useQueryKey={["TotalLoanTableData", "TotalLoanTableCount"]} // Unique keys 
      myglobalData={myglobalData} // Global data used within the component
    />
  );
};

// Export the LoanDetails component
export default LoanDetails;
