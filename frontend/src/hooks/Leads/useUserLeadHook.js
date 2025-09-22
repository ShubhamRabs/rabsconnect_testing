import Axios from "../../setting/axios";

export const GetUserLeadsTableData = async (page, pageSize) => {
  try {
    // Send a POST request to the server to get lead source counting data
    const response = await Axios.get(
      `/user-lead/get-user-lead-table-data?page=${page}&pageSize=${pageSize}`
    );
    return response;
  } catch (err) {
    return err;
  }
};

export const UserLeadTableDataCount = async () => {
  try {
    // Send a POST request to the server to get lead source counting data
    const response = await Axios.post(`/user-lead/get-user-lead-table-data-count`);
    return response;
  } catch (err) {
    return err;
  }
};
