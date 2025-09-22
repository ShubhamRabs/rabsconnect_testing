import Axios from "../../setting/axios";

export const getAllUsers = async () => {
  try {
    // Send a POST request to the server to get lead source counting data
    const response = await Axios.post(`/users/get-all-users`);
    // Return the response from the server
    return response;
  } catch (err) {
    // Return an error object in case of failure
    return err;
  }
};

export const getAllRoleWiseUsers = async (role) => {
  try {
    // Send a POST request to the server to get lead source counting data
    const response = await Axios.post(`/users/get-all-role-wise-users`, {
      role,
    });
    // Return the response from the server
    return response;
  } catch (err) {
    // Return an error object in case of failure
    return err;
  }
};
