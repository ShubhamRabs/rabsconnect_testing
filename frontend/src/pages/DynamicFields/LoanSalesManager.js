// LoanSalesManager.js

// Importing necessary dependencies and components from React and other files
import React from "react";
import { LoanSalesManagerSchema } from "../../schema/DynamicFields";
import {
  useAddLoanSalesManager,
  useDeleteLoanSalesManager,
  useEditLoanSalesManager,
  GetAllLoanSalesManager,
} from "./../../hooks/DynamicFields/useLoanSalesManagerHook";
import { LoanSalesManagerColumns } from "./../../data/Columns/DynamicFields/LoanSalesManagerColumns";
import DynamicFieldsHandler from "../../Handler/DynamicFieldsHandler";

// React functional component named LoanSalesManager
const LoanSalesManager = () => {
  return (
    // Using the DynamicFieldsHandler component with various props to manage dynamic fields for ProjectName
    <DynamicFieldsHandler
      // Setting the page name for display purposes
      pageName="Loan Sales Manager"
      // Label for the button to add a new ProjectName
      AddButtonLabel="Add Sales Manager"
      // Columns configuration for the table
      columns={LoanSalesManagerColumns}
      // Array of API call functions for various ProjectName operations
      ApiCallsArray={[
        GetAllLoanSalesManager,
        useAddLoanSalesManager,
        useEditLoanSalesManager,
        useDeleteLoanSalesManager,
      ]}
      // React Query key for managing data caching and retrieval
      ReactQueryKey="AllLoanSalesManagerTableData"
      // Validation schema for the ProjectName data
      validationSchema={LoanSalesManagerSchema}
      // Title for the modal that appears for adding/editing ProjectNames
      modalTitle="Loan Sales Manager"
      // Array of initial values for ProjectName fields
      initialValuesArray={["bank_name", "sales_manager"]}
      // Input field configuration for Bank Name name
      InputField={[true, "Bank Name", "bank_name"]}
      // Input field configuration for Sales Manager name
      InputFieldTwo={[true, "Sales Manager", "sales_manager"]}
    />
  );
};

// Exporting the ProjectName component as the default export
export default LoanSalesManager;
