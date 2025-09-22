import dayjs from "dayjs";
import { createMutationHook, makeApiRequest } from "../../Handler/HooksHandler";

const DateTime = dayjs().format("YYYY-MM-DD HH:mm:ss");

export const GetAllHandoverYear = (fields) =>
  makeApiRequest("/handover-year/get-all-handover-year", { columns: fields });

export const SetHandoverYear = (data) => {
  const DateTime = dayjs().format("YYYY-MM-DD HH:mm:ss");
  return makeApiRequest("/handover-year/add-handover-year", { data, DateTime });
};

export const SetEditHandoverYear = (data) => {
  const DateTime = dayjs().format("YYYY-MM-DD HH:mm:ss");
  return makeApiRequest("/handover-year/edit-handover-year", {
    data,
    DateTime,
  });
};

export const DeleteHandoverYear = (HandoverYearID) =>
  makeApiRequest("/handover-year/delete-handover-year", {
    handover_year_sid: HandoverYearID,
  });

export const useAddHandoverYear = createMutationHook(SetHandoverYear);
export const useEditHandoverYear = createMutationHook(SetEditHandoverYear);
export const useDeleteHandoverYear = createMutationHook(DeleteHandoverYear);
