import React from "react";
import { PlanSchema } from "../../schema/DynamicFields";
import {
    useAddPaymentPlan,
    useDeletePaymentPlan,
  useEditPaymentPlan,
  GetAllPaymentPlan
} from "../../hooks/DynamicFields/usePaymentPlanHook";
import { SourceColumns } from "../../data/Columns/DynamicFields/SourceColumns";
import  {PaymentPlanColumns} from "../../data/Columns/DynamicFields/PaymentPlanColumns";
import DynamicFieldsHandler from "../../Handler/DynamicFieldsHandler";

// React functional component named Source
const PaymentPlan = () => {
  return (
    // Using the DynamicFieldsHandler component with various props to manage dynamic fields for Source
    <DynamicFieldsHandler
      // Setting the page name for display purposes
      pageName="Payment Plan"
      // Label for the button to add a new Source
      AddButtonLabel="Add Payment Plan"
      // Columns configuration for the table
    //   columns={SourceColumns}
    columns={PaymentPlanColumns}
      // Array of API call functions for various Source operations
      ApiCallsArray={[
        GetAllPaymentPlan,
        useAddPaymentPlan,
        useEditPaymentPlan,
        useDeletePaymentPlan,
      ]}
      // React Query key for managing data caching and retrieval
      ReactQueryKey="AllSourceTableData"
      // Validation schema for the Source data
      validationSchema={PlanSchema}
      // Title for the modal that appears for adding/editing Sources
      modalTitle="Payment Plan"
      // Array of initial values for Source fields
      initialValuesArray={["payment_plan"]}
      // Input field configuration for Source name
      InputField={[true, "Payment Plan", "payment_plan"]}
    />
  );
};

// Exporting the Source component as the default export
export default PaymentPlan;
