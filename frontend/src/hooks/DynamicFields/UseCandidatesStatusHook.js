import dayjs from "dayjs";
import { createMutationHook, makeApiRequest } from "../../Handler/HooksHandler";

const DateTime = dayjs().format("YYYY-MM-DD HH:mm:ss");

export const GetAllCandidatesStatus = (fields) =>
  makeApiRequest(`/candidates-status/get-all-candidates-status`, { columns: fields });

export const SetCandidatesStatus = (data) =>{
  const DateTime = dayjs().format("YYYY-MM-DD HH:mm:ss");
  return makeApiRequest(`/candidates-status/add-candidates-status`, { data, DateTime });
}

export const SetEditCandidatesStatus = (data) =>{
  const DateTime = dayjs().format("YYYY-MM-DD HH:mm:ss");
  return makeApiRequest(`/candidates-status/edit-candidates-status`, { data, DateTime });
}
export const DeleteCandidatesStatus = (CandidatesStatusID) =>
  makeApiRequest(`/candidates-status/delete-candidates-status`, { c_status_id: CandidatesStatusID });

export const useAddCandidatesStatus = createMutationHook(SetCandidatesStatus);
export const useEditCandidatesStatus = createMutationHook(SetEditCandidatesStatus);
export const useDeleteCandidatesStatus = createMutationHook(DeleteCandidatesStatus);
