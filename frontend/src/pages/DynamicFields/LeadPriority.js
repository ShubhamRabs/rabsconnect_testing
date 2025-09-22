import React from "react";
import DynamicFieldsHandler from "../../Handler/DynamicFieldsHandler";
import { LeadPriorityColumns } from "../../data/Columns/DynamicFields/LeadPriorityColumns.js";
import {
  GetAllLeadPriority,
  useAddLeadPriority,
  useDeleteLeadPriority,
  useEditLeadPriority,
} from "../../hooks/DynamicFields/UseLeadPriorityHook.js";
import { LeadPrioritySchema } from "../../schema/DynamicFields";

// Define the LeadPriority component
const LeadPriority = () => {
  return (
    <>
      <DynamicFieldsHandler
        pageName="Lead Priority"
        AddButtonLabel="Add Lead Priority"
        columns={LeadPriorityColumns}
        ApiCallsArray={[
          GetAllLeadPriority,
          useAddLeadPriority,
          useEditLeadPriority,
          useDeleteLeadPriority,
        ]}
        ReactQueryKey="AllLeadPriorityTableData"
        validationSchema={LeadPrioritySchema}
        initialValuesArray={["lead_priority"]}
        InputField={[true, "Lead Priority", "lead_priority"]}
        modalTitle="Lead Priority"
      />
    </>
  );
};

export default LeadPriority;
