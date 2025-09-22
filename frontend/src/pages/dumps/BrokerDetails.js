import React from "react";
import BrokerHandler from "../../Handler/BrokerHandler";
import {
  GetTotalBrokerTableData,
  TotalBrokerTableDataCount,
} from "../../hooks/Broker/UseBrokerHook";

// Define the BrokerDetails functional component
const BrokerDetails = ({ dispatch, myglobalData }) => {
  // Breadcrumb values for dynamic breadcrumb display
  const breadcrumbValues = {
    pageName: "Broker Details", // Dynamic breadcrumb values
    addButton: true, // Display add button in breadcrumb
    assignButton: true, // Display assign button in breadcrumb
  };

  // Return the BrokerHandler component with specific configurations
  return (
    <BrokerHandler
      dispatch={dispatch} // Function for dispatching actions
      tableDataFunction={GetTotalBrokerTableData} // Function to fetch broker data
      tableDataCountFunction={TotalBrokerTableDataCount()} // Function to fetch total count of brokers
      breadcrumbValues={breadcrumbValues} // Breadcrumb configuration
      FetchCounting={true} // Flag indicating whether counting information should be fetched
      useQueryKey={["TotalBrokerTableData", "TotalBrokerTableCount"]} // Unique keys
      myglobalData={myglobalData} // Global data used within the component
    />
  );
};

// Export the BrokerDetails component
export default BrokerDetails;
