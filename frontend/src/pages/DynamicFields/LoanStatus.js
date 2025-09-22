// Import necessary dependencies and components
import React from "react";
import DynamicFieldsHandler from "../../Handler/DynamicFieldsHandler";
import { LoanStatusColumns } from "../../data/Columns/DynamicFields/LoanStatusColumns";
import {
  GetAllLoanStatus,
  useAddLoanStatus,
  useDeleteLoanStatus,
  useEditLoanStatus,
} from "../../hooks/DynamicFields/UseLoanStatusHook";
import { LoanStatusSchema } from "../../schema/DynamicFields";

// Define the LoanStatus component
const LoanStatus = () => {
  return (
    <>
      {/* DynamicFieldsHandler component for managing dynamic fields */}
      <DynamicFieldsHandler
        // Page-specific information
        pageName="Loan Status"
        AddButtonLabel="Add Loan Status"
        // Columns configuration for the table
        columns={LoanStatusColumns}
        // Array of API calls for CRUD operations
        ApiCallsArray={[
          GetAllLoanStatus,
          useAddLoanStatus,
          useEditLoanStatus,
          useDeleteLoanStatus,
        ]}
        // React Query key for caching
        ReactQueryKey="AllLoanStatusTableData"
        // Validation schema for form inputs
        validationSchema={LoanStatusSchema}
        // Initial values array for form fields
        initialValuesArray={["loan_status"]}
        // Input field information
        InputField={[true, "Loan Status", "loan_status"]}
        // Modal title for the dynamic fields modal
        modalTitle="Loan Status"
      />
    </>
  );
};

export default LoanStatus;
