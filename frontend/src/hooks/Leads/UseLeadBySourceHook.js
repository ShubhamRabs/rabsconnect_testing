import Axios from "../../setting/axios";

export const GetLeadsBySourceTableData = async (page, pageSize, data) => {
  try {
    // Send a POST request to the server to get lead source counting data
    const response = await Axios.get(
      `/lead-by-source/get-lead-by-source-table-data?source=${data.source}&page=${page}&pageSize=${pageSize}`
    );
    // Return the response from the server
    return response;
  } catch (err) {
    // Return an error object in case of failure
    return err;
  }
};
