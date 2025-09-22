import dayjs from "dayjs";
import { createMutationHook, makeApiRequest } from "../../Handler/HooksHandler";

const DateTime = dayjs().format("YYYY-MM-DD HH:mm:ss");

export const GetAllConfiguration = (fields) =>
  makeApiRequest(`/configuration/get-all-configuration`, { columns: fields });

export const SetConfiguration = (data) =>{
  const DateTime = dayjs().format("YYYY-MM-DD HH:mm:ss");
  return makeApiRequest(`/configuration/add-configuration`, { data, DateTime });
}

export const SetEditConfiguration = (data) =>{
  const DateTime = dayjs().format("YYYY-MM-DD HH:mm:ss");
  return makeApiRequest(`/configuration/edit-configuration`, { data, DateTime });
}

export const DeleteConfiguration = (confiID) =>
  makeApiRequest(`/configuration/delete-configuration`, { confi_id: confiID });

export const useAddConfiguration = createMutationHook(SetConfiguration);
export const useEditConfiguration = createMutationHook(SetEditConfiguration);
export const useDeleteConfiguration = createMutationHook(DeleteConfiguration);