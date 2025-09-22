import Axios from "../../setting/axios";

export const GetUpdatedLeadReport = async (userID) => {
  try {
    // Send a POST request to the server to get lead source counting data
    const response = await Axios.post(`/user-statistics/updated-lead-report`, {
      u_id: userID,
    });
    // Return the response from the server
    return response;
  } catch (err) {
    // Return an error object in case of failure
    return err;
  }
};

export const GetUserLeadCountReport = async (userID) => {
  try {
    // Send a POST request to the server to get lead source counting data
    const response = await Axios.post(`/user-statistics/get-user-lead-count`, {
      u_id: userID,
    });
    // Return the response from the server
    return response;
  } catch (err) {
    // Return an error object in case of failure
    return err;
  }
};

export const GetUserLeadSourceCountReport = async (userID, filterDetails) => {
  try {
    // Send a POST request to the server to get lead source counting data
    const response = await Axios.post(
      `/user-statistics/get-user-lead-source-count`,
      {
        u_id: userID,
        filterDetails: filterDetails,
      }
    );
    // Return the response from the server
    return response;
  } catch (err) {
    // Return an error object in case of failure
    return err;
  }
};
