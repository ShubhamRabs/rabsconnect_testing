// Import necessary dependencies and components
import React from "react";
import DynamicFieldsHandler from "../../Handler/DynamicFieldsHandler";
import { CandidatesStatusColumns } from "../../data/Columns/DynamicFields/CandidatesStatusColumns";
import {
  GetAllCandidatesStatus,
  useAddCandidatesStatus,
  useDeleteCandidatesStatus,
  useEditCandidatesStatus,
} from "../../hooks/DynamicFields/UseCandidatesStatusHook";
import { CandidatesStatusSchema } from "../../schema/DynamicFields";

// Define the CandidateStatus component
const CandidateStatus = () => {
  return (
    <>
      {/* DynamicFieldsHandler component for managing dynamic fields */}
      <DynamicFieldsHandler
        // Page-specific information
        pageName="Candidate Status"
        AddButtonLabel="Add Candidate Status"
        // Columns configuration for the table
        columns={CandidatesStatusColumns}
        // Array of API calls for CRUD operations
        ApiCallsArray={[
          GetAllCandidatesStatus,
          useAddCandidatesStatus,
          useEditCandidatesStatus,
          useDeleteCandidatesStatus,
        ]}
        // React Query key for caching
        ReactQueryKey="AllCandidateStatusTableData"
        // Validation schema for form inputs
        validationSchema={CandidatesStatusSchema}
        // Initial values array for form fields
        initialValuesArray={["candidate_status"]}
        // Input field information
        InputField={[true, "Candidate Status", "candidate_status"]}
        // Modal title for the dynamic fields modal
        modalTitle="Candidate Status"
      />
    </>
  );
};

export default CandidateStatus;
