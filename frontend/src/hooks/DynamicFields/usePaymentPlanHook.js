import dayjs from "dayjs";
import { createMutationHook, makeApiRequest } from "../../Handler/HooksHandler";

const DateTime = dayjs().format("YYYY-MM-DD HH:mm:ss");

export const GetAllPaymentPlan = (fields) =>
  makeApiRequest(`/payment-plan/get-all-payment-plan`, { columns: fields });

export const SetPaymentPlan = (data) =>{
  const DateTime = dayjs().format("YYYY-MM-DD HH:mm:ss");
  return makeApiRequest(`/payment-plan/add-payment-plan`, { data, DateTime });
}

export const SetEditPaymentPlan = (data) =>{
  const DateTime = dayjs().format("YYYY-MM-DD HH:mm:ss");
  return makeApiRequest(`/payment-plan/edit-payment-plan`, { data, DateTime });
}

export const DeletePaymentPlan = (sourceID) =>
  makeApiRequest(`/payment-plan/delete-payment-plan`, { plan_id: sourceID });

export const useAddPaymentPlan = createMutationHook(SetPaymentPlan);
export const useEditPaymentPlan = createMutationHook(SetEditPaymentPlan);
export const useDeletePaymentPlan = createMutationHook(DeletePaymentPlan);
