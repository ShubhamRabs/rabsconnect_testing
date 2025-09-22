import Axios from "../../setting/axios";
import { useMutation } from "react-query";
import dayjs from "dayjs";


const setUpdateUserDetails = async (data) => {
  const DateTime = dayjs().format("YYYY-MM-DD HH:mm:ss");
  try {
    // Send a POST request to the server to get lead source counting data
    const response = await Axios.post(`/users/update-user-data`, {
      data,
      DateTime,
    });
    // Return the response from the server
    return response;
  } catch (err) {
    // Return an error object in case of failure
    return err;
  }
};

export const useUpdateUserDetails = () => {
  return useMutation(setUpdateUserDetails);
};

const RedirectToUserCrm = async (data) => {
  try {
    // Send a POST request to the server to get lead source counting data
    const response = await Axios.post(`/users/set-user-dashboard`, { data });
    // Return the response from the server
    return response.data;
  } catch (err) {
    // Return an error object in case of failure
    return err;
  }
};

const setBackToOldCrm = async (previous_user_id) => {
  try {
    const response = await Axios.post(`/users/back-to-old-dashboard`, {
      previous_user_id,
    });
    // Return the response from the server
    return response.data;
  } catch (err) {
    // Return an error object in case of failure
    return err;
  }
};

const getUserLastLocation = async (u_id) => {
  try {
    const response = await Axios.post(`/users/get-user-last-location`, {
      u_id: u_id,
    });
    return response;
  } catch (err) {
    return err;
  }
};

export const UseGetUserLastLocation = () => {
  return useMutation(getUserLastLocation);
};

export const UseRedirectToUserCrm = () => {
  return useMutation(RedirectToUserCrm);
};

export const UseBackToOldCrm = () => {
  return useMutation(setBackToOldCrm);
};
