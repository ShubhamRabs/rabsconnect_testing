import React from "react";
import DynamicFieldsHandler from "../../Handler/DynamicFieldsHandler";
import { HandoverYearColumns } from "../../data/Columns/DynamicFields/HandoverYearColumns";
import {
  GetAllHandoverYear,
  useAddHandoverYear,
  useDeleteHandoverYear,
  useEditHandoverYear,
} from "../../hooks/DynamicFields/UseHandoverYearHook";
import { HandoverYearSchema } from "../../schema/DynamicFields";

const HandoverYear = () => {
  return (
    <>
      <DynamicFieldsHandler
        pageName="Handover Year"
        AddButtonLabel="Add Handover Year"
        columns={HandoverYearColumns}
        ApiCallsArray={[
          GetAllHandoverYear,
          useAddHandoverYear,
          useEditHandoverYear,
          useDeleteHandoverYear,
        ]}
        ReactQueryKey="AllHandoverYearTableData"
        validationSchema={HandoverYearSchema}
        initialValuesArray={["handover_year"]}
        InputField={[true, "Handover Year", "handover_year"]}
        modalTitle="Handover Year"
      />
    </>
  );
};

export default HandoverYear;
