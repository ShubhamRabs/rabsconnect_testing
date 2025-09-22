import dayjs from "dayjs";
import { createMutationHook, makeApiRequest } from "../../Handler/HooksHandler";

// Get all location fields
export const GetAllLocationField = (fields) =>
  makeApiRequest(`/location-field/get-all-location-field`, { columns: fields });

// Add a new location field
export const SetLocationField = (data) => {
  const DateTime = dayjs().format("YYYY-MM-DD HH:mm:ss");
  return makeApiRequest(`/location-field/add-location-field`, { data, DateTime });
};

// Edit an existing location field
export const SetEditLocationField = (data) => {
  const DateTime = dayjs().format("YYYY-MM-DD HH:mm:ss");
  return makeApiRequest(`/location-field/edit-location-field`, { data, DateTime });
};

// Delete a location field
export const DeleteLocationField = (LocationFieldID) =>
  makeApiRequest(`/location-field/delete-location-field`, { location_sid: LocationFieldID });

// Create mutation hooks
export const useAddLocationField = createMutationHook(SetLocationField);
export const useEditLocationField = createMutationHook(SetEditLocationField);
export const useDeleteLocationField = createMutationHook(DeleteLocationField);
