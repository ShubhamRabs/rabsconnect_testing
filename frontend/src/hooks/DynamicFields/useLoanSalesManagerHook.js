import dayjs from "dayjs";
import { createMutationHook, makeApiRequest } from "../../Handler/HooksHandler";
import Axios from "../../setting/axios";

// const DateTime = dayjs().format("YYYY-MM-DD HH:mm:ss");

export const GetAllLoanSalesManager = (fields) =>
  makeApiRequest(`/loan-sales-manager/get-all-loan-sales-manager`, { columns: fields });

export const SetLoanSalesManager = (data) =>{
  const DateTime = dayjs().format("YYYY-MM-DD HH:mm:ss");
  return makeApiRequest(`/loan-sales-manager/add-loan-sales-manager`, { data, DateTime });
}

export const SetEditLoanSalesManager = (data, loansalesmanagerID) =>{
  const DateTime = dayjs().format("YYYY-MM-DD HH:mm:ss");
  return makeApiRequest(`/loan-sales-manager/edit-loan-sales-manager`, { data, DateTime, lsm_id: loansalesmanagerID });
}

export const DeleteLoanSalesManager = (loansalesmanagerID) =>
  makeApiRequest(`/loan-sales-manager/delete-loan-sales-manager`, { lsm_id: loansalesmanagerID });

export const useAddLoanSalesManager = createMutationHook(SetLoanSalesManager);
export const useEditLoanSalesManager = createMutationHook(SetEditLoanSalesManager);
export const useDeleteLoanSalesManager = createMutationHook(DeleteLoanSalesManager);
