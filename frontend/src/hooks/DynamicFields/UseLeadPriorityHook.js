import dayjs from "dayjs";
import { createMutationHook, makeApiRequest } from "../../Handler/HooksHandler";

const DateTime = dayjs().format("YYYY-MM-DD HH:mm:ss");

export const GetAllLeadPriority = (fields) =>
  makeApiRequest("/lead-priority/get-all-lead-priority", { columns: fields });

export const SetLeadPriority = (data) => {
  const DateTime = dayjs().format("YYYY-MM-DD HH:mm:ss");
  return makeApiRequest("/lead-priority/add-lead-priority", { data, DateTime });
};

export const SetEditLeadPriority = (data) => {
  const DateTime = dayjs().format("YYYY-MM-DD HH:mm:ss");
  return makeApiRequest("/lead-priority/edit-lead-priority", {
    data,
    DateTime,
  });
};

export const DeleteLeadPriority = (LeadPriorityID) =>
  makeApiRequest("/lead-priority/delete-lead-priority", {
    lead_pid: LeadPriorityID,
  });

export const useAddLeadPriority = createMutationHook(SetLeadPriority);
export const useEditLeadPriority = createMutationHook(SetEditLeadPriority);
export const useDeleteLeadPriority = createMutationHook(DeleteLeadPriority);
