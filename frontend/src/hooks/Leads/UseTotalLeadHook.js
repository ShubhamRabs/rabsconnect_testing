import Axios from "../../setting/axios";

export const GetTotalLeadsTableData = async (page, pageSize) => {
  try {
    // Send a POST request to the server to get lead source counting data
    const response = await Axios.get(
      `/total-lead/get-total-lead-table-data?page=${page}&pageSize=${pageSize}`
    );
    // console.log(response, "GetTotalLeadsTableData");
    // Return the response from the server\
    return response;
  } catch (err) {
    // Return an error object in case of failure
    return err;
  }
};

export const TotalLeadTableDataCount = async (page, pageSize) => {
  try {
    // Send a POST request to the server to get lead source counting data
    const response = await Axios.post(
      `/total-lead/get-total-lead-table-data-count`
    );
    // Return the response from the server
    return response;
  } catch (err) {
    // Return an error object in case of failure
    return err;
  }
};
