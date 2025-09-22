import dayjs from "dayjs";
import { createMutationHook, makeApiRequest } from "../../Handler/HooksHandler";

const DateTime = dayjs().format("YYYY-MM-DD HH:mm:ss");

export const GetAllSource = (fields) =>
  makeApiRequest(`/source/get-all-source`, { columns: fields });

export const SetSource = (data) =>{
  const DateTime = dayjs().format("YYYY-MM-DD HH:mm:ss");
  return makeApiRequest(`/source/add-source`, { data, DateTime });
}

export const SetEditSource = (data) =>{
  const DateTime = dayjs().format("YYYY-MM-DD HH:mm:ss");
  return makeApiRequest(`/source/edit-source`, { data, DateTime });
}

export const DeleteSource = (sourceID) =>
  makeApiRequest(`/source/delete-source`, { source_id: sourceID });

export const useAddSource = createMutationHook(SetSource);
export const useEditSource = createMutationHook(SetEditSource);
export const useDeleteSource = createMutationHook(DeleteSource);
