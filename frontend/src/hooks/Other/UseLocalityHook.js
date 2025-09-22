import Axios from "../../setting/axios";

export const GetAllLocality = async () => {
  try {
    // Send a POST request to the server to get lead source counting data
    const response = await Axios.post(`/locality/get-all-locality`);
    // Return the response from the server
    return response.data;
  } catch (err) {
    // Return an error object in case of failure
    return err;
  }
};
