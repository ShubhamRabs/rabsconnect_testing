import Axios from "../../setting/axios";
import { useMutation } from "react-query";
import dayjs from "dayjs";


export const GetAllBankName = async (fileds) => {
  try {
    const response = await Axios.post(`/bank-name/get-all-bank-name`, {
      columns: fileds,
    });
    return response.data;
  } catch (err) {
    return err;
  }
};

const DeleteBankName = async (BankID) => {
  try {
    const response = await Axios.post(`/bank-name/delete-bank-name`, {
      bank_id: BankID,
    });
    return response.data;
  } catch (err) {
    return err;
  }
};
export const useDeleteBankName = () => {
  return useMutation(DeleteBankName);
};

const SetEditBankName = async (data) => {
const DateTime = dayjs().format("YYYY-MM-DD HH:mm:ss");
  try {
    const response = await Axios.post(`/bank-name/edit-bank-name`, {
      data,
      DateTime,
    });
    return response.data;
  } catch (err) {
    return err;
  }
};

export const useEditBankName = () => {
  return useMutation(SetEditBankName);
};

const SetAddBankName = async (data) => {
const DateTime = dayjs().format("YYYY-MM-DD HH:mm:ss");
  try {
    const response = await Axios.post(`/bank-name/add-bank-name`, {
      data,
      DateTime,
    });
    return response.data;
  } catch (err) {
    return err;
  }
};

export const useAddBankName = () => {
  return useMutation(SetAddBankName);
};