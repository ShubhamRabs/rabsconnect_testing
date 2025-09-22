import Axios from "../../setting/axios";

export const FreshLeadCount = async () => {
  try {
    // Send a POST request to the server to get fresh lead count data
    const response = await Axios.post(`/fresh-lead/get-fresh-lead-count`);
    console.log(response, "fresh lead count");
    // Return the response from the server
    return response;
  } catch (err) {
    // Return an error object in case of failure
    console.error("Error fetching fresh lead count", err);
    return err;
  }
};

export const GetFreshLeadsTableData = async (page, pageSize) => {
  try {
    // Send a GET request to the server to get fresh leads data
    const response = await Axios.get(
      `/fresh-lead/get-fresh-lead-table-data?page=${page}&pageSize=${pageSize}`
    );
    // Return the response from the server
    return response;
  } catch (err) {
    // Return an error object in case of failure
    console.error("Error fetching fresh leads data", err);
    return err;
  }
};