import React from 'react';
import LeadHandler from '../../Handler/LeadHandler';
import { GetUnknownLeadCount, GetUnknownLeadsTableData } from '../../hooks/Leads/UseUnknownLeadHook';

const UnknownLead = ({ dispatch, myglobalData }) => {
  const breadcrumbValues = {
    pageName: "Unknown Lead", // Displayed page name in the breadcrumb
    addButton: true, // Display an 'Add' button in the breadcrumb
    assignButton: false, // Do not display an 'Assign' button in the breadcrumb
  };
  console.log(GetUnknownLeadCount, "unknown count");

  return (
    <LeadHandler
      dispatch={dispatch} // Pass the dispatch function as a prop
      tableDataFunction={GetUnknownLeadsTableData} // Function to fetch table data for unknown leads
      tableDataCountFunction={GetUnknownLeadCount()} // Function to fetch data count for unknown leads
      breadcrumbValues={breadcrumbValues} // Dynamic breadcrumb values
      FetchCounting={true} // Enable fetching and displaying data count
      useQueryKey={["UnknownLeadTableData", "UnknownLeadTableCount"]} // Unique keys for the useQuery hooks
      myglobalData={myglobalData} // Additional global data passed as a prop
    />
  );
}

export default UnknownLead;