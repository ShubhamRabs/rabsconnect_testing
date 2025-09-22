import Axios from "../../setting/axios";
import { useMutation } from "react-query";
import dayjs from "dayjs";

const DateTime = dayjs().format("YYYY-MM-DD HH:mm:ss");


export const GetAllBroker = async (fileds) => {
  try {
    // Send a POST request to the server to get lead source counting data
    const response = await Axios.post(`/broker/get-all-broker`, {
      columns: fileds,
    });
    // Return the response from the server
    return response.data;
  } catch (err) {
    // Return an error object in case of failure
    return err;
  }
};

export const GetTotalBrokerTableData = async (page, pageSize) => {
  try {
    // Send a POST request to the server to get broker counting data
    const response = await Axios.get(
      `/broker/get-broker-details-table-data?page=${page}&pageSize=${pageSize}`
    );
    // Return the response from the server
    return response;
  } catch (err) {
    // Return an error object in case of failure
    return err;
  }
};

export const TotalBrokerTableDataCount = async () => {
  try {
    // Send a POST request to the server to get broker counting data
    const response = await Axios.post(
      `/broker/get-broker-details-table-data-count`
    );
    // Return the response from the server
    return response;
  } catch (err) {
    // Return an error object in case of failure
    return err;
  }
};

export const getBrokerHistory = async (brk_id) => {
  try {
    const response = await Axios.post(`/broker/get-broker-history`, { brk_id });
    // Return the response from the server
    return response.data;
  } catch (err) {
    // Return an error object in case of failure
    return err;
  }
};

const SetBroker = async (data) => {
  try {
    const response = await Axios.post(`/broker/add-broker`, { data, DateTime });
    // Return the response from the server
    return response.data;
  } catch (err) {
    // Return an error object in case of failure
    return err;
  }
};

const EditBroker = async (data) => {
  const DateTime = dayjs().format("YYYY-MM-DD HH:mm:ss");
  try {
    // Send a POST request to the server to get lead source counting data
    const response = await Axios.post(`/broker/edit-broker`, {
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

const setQuickEditBroker = async (data) => {
  try {
    // Send a POST request to the server to get lead source counting data
    const response = await Axios.post(`/broker/quick-edit-broker`, {
      ...data,
      DateTime: DateTime,
    });
    // Return the response from the server
    return response;
  } catch (err) {
    // Return an error object in case of failure
    return err;
  }
};

const DeleteSelectedBroker = async (id) => {
  try {
    // Send a POST request to the server to get lead source counting data
    const response = await Axios.post(`/broker/delete-selected-broker`, {
      brk_id: id,
    });
    // Return the response from the server
    return response;
  } catch (err) {
    // Return an error object in case of failure
    return err;
  }
};

export const useAddBroker = () => {
  return useMutation(SetBroker);
};

export const useEditBroker = () => {
  return useMutation(EditBroker);
};

export const useQuickEditBroker = () => {
  return useMutation(setQuickEditBroker);
};

export const useDeleteSelectedBroker = () => {
  return useMutation(DeleteSelectedBroker);
};
