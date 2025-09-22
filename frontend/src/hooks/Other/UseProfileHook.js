import { useMutation } from "react-query";
import Axios from "../../setting/axios";
import dayjs from "dayjs";

const DateTime = dayjs().format("YYYY-MM-DD HH:mm:ss");

export const GetUserDetails = async () => {
  try {
    // Send a POST request to the server to get lead source counting data
    const response = await Axios.post(`/profile/get-profile-details`);
    // Return the response from the server
    console.log(response,"proflie details response")
    return response;
  } catch (err) {
    // Return an error object in case of failure
    return err;
  }
};

export const GetAllUserProfileDetails = async () => {
  try {
    // Send a POST request to the server to get lead source counting data
    const response = await Axios.post(`/profile/get-all-profile-details`);
    // Return the response from the server
    return response;
  } catch (err) {
    // Return an error object in case of failure
    return err;
  }
};

export const GetProfileById = async (u_id) => {
  console.log("HELLOOOOOOOOO")
  // console.log(u_id,"uid in axois");
  try {
    // Send a POST request to the server to get lead source counting data
    const response = await Axios.post(`/profile/profile-by-id`, {
      u_id,
    });
    // Return the response from the server
    return response;
  } catch (err) {
    // Return an error object in case of failure
    return err;
  }
}

const UpdateProfileDetails = async (data) => {
  try {
    // Send a POST request to the server to get lead source counting data
    const response = await Axios.post(`/profile/update-profile-details`, {
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

export const useUpdateProfileDetails = () => {
  return useMutation(UpdateProfileDetails);
};

export const useProfileById = () => {
  return useMutation(GetProfileById);
};