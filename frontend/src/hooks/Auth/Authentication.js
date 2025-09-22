import Axios from "../../setting/axios";
import dayjs from "dayjs";
import { useMutation } from "react-query";

const date = dayjs().format("YYYY-MM-DD HH:mm:ss");

export const setLogin = async (data, token) => {
  try {
    const response = await Axios.post(`/checkUser`, {
      username: data.get("username"),
      password: data.get("password"),
      token: token,
    });
    return response;
  } catch (err) {
    return err;
  }
};

export const logout = async (token) => {
  try {
    const response = await Axios.post(`/logout`, { token: token });
    return response;
  } catch (err) {
    return err;
  }
};

export const CheckUserLogin = async () => {
  try {
    const response = await Axios.get(`/check-user-login`);
    return response;
  } catch (err) {
    return err;
  }
};

/* Date :- 9-09-2023 
  Author name :- shubham sonkar
  creating the api calls of function change password
  */
const setChangePassword = async (data) => {
  try {
    const response = await Axios.post(`/change-user-password`, {
      update_dt: date,
      current_password: data.current_password,
      new_password: data.new_password,
    });

    return response.data;
  } catch (err) {
    return err;
  }
};

/* Date :- 13-03-2024 
    Author name :- Nikhil Vabhale
    using useMutation and passing the api calls of function reset password
*/
export const useChangePassword = () => {
  return useMutation(setChangePassword);
};

export const forgotPass = async (data) => {
  try {
    const response = await Axios.post(`/forgotpass`, {
      email: data.get("email"),
    });
    return response;
  } catch (err) {
    return err;
  }
};

export const updateForgotPass = async (data) => {
  try {
    const response = await Axios.post(`/updateforgotpass`, {
      update_dt: date,
      u_id: data.get("u_id"),
      new_password: data.get("form_new_password"),
    });
    return response;
  } catch (err) {
    return err;
  }
};
