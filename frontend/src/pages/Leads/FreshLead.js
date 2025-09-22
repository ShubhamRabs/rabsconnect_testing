import React from 'react';
import { FreshLeadCount, GetFreshLeadsTableData } from '../../hooks/Leads/useFreshLeadHook';
import LeadHandler from '../../Handler/LeadHandler';

const FreshLead = ({ dispatch, myglobalData }) => {
  const breadcrumbValues = {
    pageName: "Fresh Lead", // Displayed page name in the breadcrumb
    addButton: true, // Display an 'Add' button in the breadcrumb
    assignButton: false, // Do not display an 'Assign' button in the breadcrumb
  };

  return (
    <LeadHandler
      dispatch={dispatch} // Pass the dispatch function as a prop
      tableDataFunction={GetFreshLeadsTableData} // Function to fetch table data for assigned leads
      tableDataCountFunction={FreshLeadCount()} // Function to fetch data count for assigned leads
      breadcrumbValues={breadcrumbValues} // Dynamic breadcrumb values
      FetchCounting={true} // Enable fetching and displaying data count
      useQueryKey={["NewLeadTableData", "NewLeadTableCount"]} // Unique keys for the useQuery hooks
      myglobalData={myglobalData} // Additional global data passed as a prop
    />
  );
}

export default FreshLead;
