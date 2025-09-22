import dayjs from "dayjs";
import { createMutationHook, makeApiRequest } from "../../Handler/HooksHandler";

export const GetAllCandidatesPost = (fields) =>
  makeApiRequest(`/candidates-post/get-all-candidates-post`, { columns: fields });

export const SetCandidatesPost = (data) =>{
  const DateTime = dayjs().format("YYYY-MM-DD HH:mm:ss");
  return makeApiRequest(`/candidates-post/add-candidates-post`, { data, DateTime });
}

export const SetEditCandidatesPost = (data) =>{
  const DateTime = dayjs().format("YYYY-MM-DD HH:mm:ss");
  return makeApiRequest(`/candidates-post/edit-candidates-post`, { data, DateTime });
}

export const DeleteCandidatesPost = (CandidatesPostID) =>
  makeApiRequest(`/candidates-post/delete-candidates-post`, { c_post_id: CandidatesPostID });

export const useAddCandidatesPost = createMutationHook(SetCandidatesPost);
export const useEditCandidatesPost = createMutationHook(SetEditCandidatesPost);
export const useDeleteCandidatesPost = createMutationHook(DeleteCandidatesPost);
