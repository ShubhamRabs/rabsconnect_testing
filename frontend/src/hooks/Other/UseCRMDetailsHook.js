import Axios from "../../setting/axios";

export const GetAllCRMDetails = async () => {
  try {
    // Send a POST request to the server to get lead source counting data
    const response = await Axios.post(`/crm-details/get-all-crm-details`);
    // Return the response from the server
    return response;
  } catch (err) {
    // Return an error object in case of failure
    return err;
  }
};
