import Axios from "../../setting/axios";

export const getPushAPIData = async (data) => {
  // console.log(data, "data");
  try {
    // Send a POST request to the server to get lead source counting data
    const response = await Axios.post(`/api-data/get-all-push-api-data`,data);
    // Return the response from the server
    return response;
  } catch (err) {
    // Return an error object in case of failure
    return err;
  }
};