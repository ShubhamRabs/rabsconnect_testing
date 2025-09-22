// Import necessary dependencies and components
import React from "react";
import DynamicFieldsHandler from "../../Handler/DynamicFieldsHandler";
import { CandidatesPostColumns } from "../../data/Columns/DynamicFields/CandidatesPostColumns";
import {
  GetAllCandidatesPost,
  useAddCandidatesPost,
  useDeleteCandidatesPost,
  useEditCandidatesPost,
} from "../../hooks/DynamicFields/UseCandidatesPostHook";
import { CandidatesPostSchema } from "../../schema/DynamicFields";

// Define the CandidatePost component
const CandidatePost = () => {
  return (
    <>
      {/* DynamicFieldsHandler component for managing dynamic fields */}
      <DynamicFieldsHandler
        // Page-specific information
        pageName="Candidate Post"
        AddButtonLabel="Add Candidate Post"
        // Columns configuration for the table
        columns={CandidatesPostColumns}
        // Array of API calls for CRUD operations
        ApiCallsArray={[
          GetAllCandidatesPost,
          useAddCandidatesPost,
          useEditCandidatesPost,
          useDeleteCandidatesPost,
        ]}
        // React Query key for caching
        ReactQueryKey="AllCandidatePostTableData"
        // Validation schema for form inputs
        validationSchema={CandidatesPostSchema}
        // Initial values array for form fields
        initialValuesArray={["candidate_post"]}
        // Input field information
        InputField={[true, "Candidate Post", "candidate_post"]}
        // Modal title for the dynamic fields modal
        modalTitle="Candidate Post"
      />
    </>
  );
};

export default CandidatePost;
