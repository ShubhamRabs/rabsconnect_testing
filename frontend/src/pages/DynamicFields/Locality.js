import React from "react";
import DynamicFieldsHandler from "../../Handler/DynamicFieldsHandler";
import { LocationFieldColumns } from "../../data/Columns/DynamicFields/LocationFieldColumns.js";
import {
  GetAllLocationField,
  useAddLocationField,
  useEditLocationField,
  useDeleteLocationField,
} from "../../hooks/DynamicFields/UseLocationHook";
import { LocationFieldSchema } from "../../schema/DynamicFields";

// Define the LocationField component
const LocationField = () => {
  return (
    <>
      <DynamicFieldsHandler
        pageName="Location Field"
        AddButtonLabel="Add Location Field"
        columns={LocationFieldColumns}
        ApiCallsArray={[
          GetAllLocationField,
          useAddLocationField,
          useEditLocationField,
          useDeleteLocationField,
        ]}
        ReactQueryKey="AllLocationFieldTableData"
        validationSchema={LocationFieldSchema}
        initialValuesArray={["location_name"]}
        InputField={[true, "Location Name", "location_name"]}
        modalTitle="Location Field"
      />
    </>
  );
};

export default LocationField;
