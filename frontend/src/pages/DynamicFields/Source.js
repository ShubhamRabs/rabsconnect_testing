// Source.js

// Importing necessary dependencies and components from React and other files
import React from "react";
import { SourceSchema } from "../../schema/DynamicFields";
import {
  useAddSource,
  useDeleteSource,
  useEditSource,
  GetAllSource,
} from "../../hooks/DynamicFields/useSourceHook";
import { SourceColumns } from "../../data/Columns/DynamicFields/SourceColumns";
import DynamicFieldsHandler from "../../Handler/DynamicFieldsHandler";

// React functional component named Source
const Source = () => {
  return (
    // Using the DynamicFieldsHandler component with various props to manage dynamic fields for Source
    <DynamicFieldsHandler
      // Setting the page name for display purposes
      pageName="Sources"
      // Label for the button to add a new Source
      AddButtonLabel="Add Source"
      // Columns configuration for the table
      columns={SourceColumns}
      // Array of API call functions for various Source operations
      ApiCallsArray={[
        GetAllSource,
        useAddSource,
        useEditSource,
        useDeleteSource,
      ]}
      // React Query key for managing data caching and retrieval
      ReactQueryKey="AllSourceTableData"
      // Validation schema for the Source data
      validationSchema={SourceSchema}
      // Title for the modal that appears for adding/editing Sources
      modalTitle="Source"
      // Array of initial values for Source fields
      initialValuesArray={["source"]}
      // Input field configuration for Source name
      InputField={[true, "Source", "source"]}
    />
  );
};

// Exporting the Source component as the default export
export default Source;
