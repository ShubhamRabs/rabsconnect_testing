import Axios from "../../setting/axios";
import { useMutation } from "react-query";
import dayjs from "dayjs"; 


export const GetTotalLoanTableData = async (page, pageSize) => {
  try {
    // Send a POST request to the server to get loan counting data
    const response = await Axios.get(
      `/loan/get-loan-details-table-data?page=${page}&pageSize=${pageSize}`
    );
    // Return the response from the server
    return response; 
  } catch (err) {
    // Return an error object in case of failure
    return err;
  }
};

export const TotalLoanTableDataCount = async () => {
  try {
    // Send a POST request to the server to get loan counting data
    const response = await Axios.post(
      `/loan/get-loan-details-table-data-count`
    );
    // Return the response from the server
    return response;
  } catch (err) {
    // Return an error object in case of failure
    return err;
  }
};

const SetLoan = async (data) => {
const DateTime = dayjs().format("YYYY-MM-DD HH:mm:ss");
  try {
    const response = await Axios.post(`/loan/add-loan`, { data, DateTime });
    // Return the response from the server
    return response.data;
  } catch (err) {
    // Return an error object in case of failure
    return err;
  }
};

const EditLoan = async (data) => {
const DateTime = dayjs().format("YYYY-MM-DD HH:mm:ss");
  try {
    // Send a POST request to the server to get lead source counting data
    const response = await Axios.post(`/loan/edit-loan`, {
      DateTime,
      data,
    });
    // Return the response from the server
    return response;
  } catch (err) {
    // Return an error object in case of failure
    return err;
  }
};

const QuickEditLoan = async (data) => {
const DateTime = dayjs().format("YYYY-MM-DD HH:mm:ss");
  try {
    // Send a POST request to the server to get lead source counting data
    const response = await Axios.post(`/loan/quick-edit-loan`, {
      DateTime,
      data,
    });
    // Return the response from the server
    return response;
  } catch (err) {
    // Return an error object in case of failure
    return err;
  }
};

const DeleteSelectedLoan = async (id) => {
  try {
    // Send a POST request to the server to get lead source counting data
    const response = await Axios.post(`/loan/delete-selected-loan`, {
      loan_id: id,
    });
    // Return the response from the server
    return response;
  } catch (err) {
    // Return an error object in case of failure
    return err;
  }
};

export const useAddLoan = () => {
  return useMutation(SetLoan);
};

export const useEditLoan = () => {
  return useMutation(EditLoan);
};

export const useQuickEditLoan = () => {
  return useMutation(QuickEditLoan);
};

export const useDeleteSelectedLoan = () => {
  return useMutation(DeleteSelectedLoan);
};