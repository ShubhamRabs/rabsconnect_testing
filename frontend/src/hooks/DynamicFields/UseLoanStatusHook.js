import dayjs from "dayjs";
import { createMutationHook, makeApiRequest } from "../../Handler/HooksHandler";

const DateTime = dayjs().format("YYYY-MM-DD HH:mm:ss");

export const GetAllLoanStatus = (fields) =>
  makeApiRequest(`/loan-status/get-all-loan-status`, { columns: fields });

export const SetLoanStatus = (data) =>{
  const DateTime = dayjs().format("YYYY-MM-DD HH:mm:ss");
  return makeApiRequest(`/loan-status/add-loan-status`, { data, DateTime });
}

export const SetEditLoanStatus = (data) =>{
  const DateTime = dayjs().format("YYYY-MM-DD HH:mm:ss");
  return makeApiRequest(`/loan-status/edit-loan-status`, { data, DateTime });
}

export const DeleteLoanStatus = (LoanStatusID) =>
  makeApiRequest(`/loan-status/delete-loan-status`, { loan_sid: LoanStatusID });

export const useAddLoanStatus = createMutationHook(SetLoanStatus);
export const useEditLoanStatus = createMutationHook(SetEditLoanStatus);
export const useDeleteLoanStatus = createMutationHook(DeleteLoanStatus);
