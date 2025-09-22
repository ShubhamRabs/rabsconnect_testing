import Axios from "../../setting/axios";

export const GetLeadsByStatusTableData = async (page, pageSize, data) => {
  try {
    // Send a POST request to the server to get lead source counting data
    const response = await Axios.get(
      `/lead-by-status/get-lead-by-status-table-data?status=${data[1].status}&type=${data[0]}&page=${page}&pageSize=${pageSize}`
    );
    // Return the response from the server
    return response;
  } catch (err) {
    // Return an error object in case of failure
    return err;
  }
};
