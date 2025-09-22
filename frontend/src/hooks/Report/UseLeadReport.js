import { useMutation } from "react-query";
import Axios from "../../setting/axios";

const AddFilterCallingReport = async (data) => {
  console.log(data, "data");
  const {page,pageSize} = data
  try {
    // Send a POST request to the server to get lead source counting data
    const response = await Axios.post(
      `/lead-report/get-lead-report-table-data?page=${page}&pageSize=${pageSize}`,
      data
    );
    // Return the response from the server
    return response;
  } catch (err) {
    // Return an error object in case of failure
    return err;
  }
};

const getDetailLeadReport = async (data) => {
  try {
    const response = await Axios.post(
      `/lead-report/get-lead-report-table-data`,
      data
    );
    // Return the response from the server
    return response;
  } catch (err) {
    return err;
  }
}

export const AddFilterCallingReport1 = async (data) => {
  try {
    // Send a POST request to the server to get lead source counting data
    const response = await Axios.post(
      `/lead-report/get-lead-report-table-data`,
      data
    );
    // Return the response from the server
    return response;
  } catch (err) {
    // Return an error object in case of failure
    return err;
  }
};

export const getStatusCount = async () => {
  try {
    // Send a POST request to the server to get lead source counting data
    const response = await Axios.post(`/lead-report/get-all-status`);
    // Return the response from the server
    return response;
  } catch (err) {
    // Return an error object in case of failure
    return err;
  }
};

export const useFilterCallingReport = () => {
  return useMutation(AddFilterCallingReport);
};

export const useGetDetailLeadReport = ()=>{
  return useMutation(getDetailLeadReport)
}