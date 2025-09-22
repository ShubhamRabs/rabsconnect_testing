import Axios from "../../setting/axios";
import { useMutation } from "react-query";
import dayjs from "dayjs";


const SetUser = async (data) => {
  const DateTime = dayjs().format("YYYY-MM-DD HH:mm:ss");
  try {
    // Send a POST request to the server to get lead source counting data
    const response = await Axios.post(`/users/add-user`, { data, DateTime });
    // Return the response from the server
    return response.data;
  } catch (err) {
    // Return an error object in case of failure
    return err;
  }
};

export const useAddUser = () => {
  return useMutation(SetUser);
};
