import Axios from "../../setting/axios";

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
    // Send a POST request to the server to get lead source counting data
    const response = await Axios.get(
      `/broker/get-total-broker-table-data?page=${page}&pageSize=${pageSize}`
    );
    // Return the response from the server
    return response;
  } catch (err) {
    // Return an error object in case of failure
    return err;
  }
};
