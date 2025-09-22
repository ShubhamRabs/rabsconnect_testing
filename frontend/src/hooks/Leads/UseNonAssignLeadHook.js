import Axios from "../../setting/axios";

export const GetNonAssignLeadsTableData = async (page, pageSize) => {
  try {
    // Send a POST request to the server to get lead source counting data
    const response = await Axios.get(
      `/nonassign-lead/get-nonassign-lead-table-data?page=${page}&pageSize=${pageSize}`
    );
    // Return the response from the server
    return response;
  } catch (err) {
    // Return an error object in case of failure
    return err;
  }
};

export const NonAssignLeadTableDataCount = async (page, pageSize) => {
  try {
    // Send a POST request to the server to get lead source counting data
    const response = await Axios.post(
      `/nonassign-lead/get-nonassign-lead-table-data-count`
    );
    // Return the response from the server
    return response;
  } catch (err) {
    // Return an error object in case of failure
    return err;
  }
};
