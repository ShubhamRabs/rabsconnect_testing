// Configuration.js

// Importing necessary dependencies and components from React and other files
import React from "react";
import { ConfigurationSchema } from "../../schema/DynamicFields";
import {
  useAddConfiguration,
  useDeleteConfiguration,
  useEditConfiguration,
  GetAllConfiguration,
} from "./../../hooks/DynamicFields/UseConfigurationHook";
import { ConfigurationColumns } from "./../../data/Columns/DynamicFields/ConfigurationColumns";
import { PropertyType } from "../../data/LeadData";
import DynamicFieldsHandler from "../../Handler/DynamicFieldsHandler";

// React functional component named Configuration
const Configuration = () => {
  return (
    // Using the DynamicFieldsHandler component with various props to manage dynamic fields
    <DynamicFieldsHandler
      // Setting the page name for display purposes
      pageName="Configuration"
      // Label for the button to add a new configuration
      AddButtonLabel="Add Configuration"
      // Columns configuration for the table
      columns={ConfigurationColumns}
      // Array of API call functions for various configuration operations
      ApiCallsArray={[
        GetAllConfiguration,
        useAddConfiguration,
        useEditConfiguration,
        useDeleteConfiguration,
      ]}
      // React Query key for managing data caching and retrieval
      ReactQueryKey="AllConfigurationTableData"
      // Validation schema for the configuration data
      validationSchema={ConfigurationSchema}
      // Title for the modal that appears for adding/editing configurations
      modalTitle="Configuration"
      // Array of initial values for configuration fields
      initialValuesArray={["configuration_type", "configuration"]}
      // Default selected value for a dropdown menu
      selectedDropdownValue={PropertyType[0].value}
      // Select field configuration with properties like label, name, placeholder, and options
      SelectField={[
        true,
        "Property Type",
        "configuration_type",
        "Select Type",
        PropertyType,
      ]}
      // Input field configuration with properties like label, name, and placeholder
      InputField={[true, "Configuration", "configuration"]}
    />
  );
};

// Exporting the Configuration component as the default export
export default Configuration;
