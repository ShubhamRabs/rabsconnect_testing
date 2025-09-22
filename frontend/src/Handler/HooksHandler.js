import Axios from "../setting/axios";
import { useMutation } from "react-query";
// Define an API function
export const makeApiRequest = async (url, data) => {
  try {
    const response = await Axios.post(url, data);
    return response.data;
  } catch (err) {
    return err;
  }
};
// Create a mutation hook using the API function
export const createMutationHook = (apiFunction) => () =>
  useMutation(apiFunction);
