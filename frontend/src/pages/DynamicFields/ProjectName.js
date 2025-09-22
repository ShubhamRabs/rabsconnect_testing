// ProjectName.js

// Importing necessary dependencies and components from React and other files
import React from "react";
import { ProjectNameSchema } from "../../schema/DynamicFields";
import {
  useAddProjectName,
  useDeleteProjectName,
  useEditProjectName,
  GetAllProjectName,
} from "./../../hooks/DynamicFields/useProjectNameHook";
import { ProjectNameColumns } from "./../../data/Columns/DynamicFields/ProjectNameColumns";
import DynamicFieldsHandler from "../../Handler/DynamicFieldsHandler";

// React functional component named ProjectName
const ProjectName = () => {
  return (
    // Using the DynamicFieldsHandler component with various props to manage dynamic fields for ProjectName
    <DynamicFieldsHandler
      // Setting the page name for display purposes
      pageName="Project Name"
      // Label for the button to add a new ProjectName
      AddButtonLabel="Add Project Name"
      // Columns configuration for the table
      columns={ProjectNameColumns}
      // Array of API call functions for various ProjectName operations
      ApiCallsArray={[
        GetAllProjectName,
        useAddProjectName,
        useEditProjectName,
        useDeleteProjectName,
      ]}
      // React Query key for managing data caching and retrieval
      ReactQueryKey="AllProjectNameTableData"
      // Validation schema for the ProjectName data
      validationSchema={ProjectNameSchema}
      // Title for the modal that appears for adding/editing ProjectNames
      modalTitle="Project Name"
      // Array of initial values for ProjectName fields
      initialValuesArray={["pname", "bname"]}
      // Input field configuration for ProjectName name
      InputField={[true, "Project Name", "pname"]}
      // Input field configuration for Builder name
      InputFieldTwo={[true, "Builder Name", "bname"]}
    />
  );
};

// Exporting the ProjectName component as the default export
export default ProjectName;
