import Axios from "../../setting/axios";
import dayjs from "dayjs";
import { useMutation } from "react-query";
const ip = "123";

export const getAttendanceStatus = async () => {
  try {
    const date = dayjs().format("YYYY-MM-DD");

    // Send a POST request to the server to get attendance status
    const response = await Axios.post(`/attendance/attendance-status`, {
      date,
    });
    // Return the response from the server
    return response;
  } catch (err) {
    // Return an error object in case of failure
    return err;
  }
};

export const UserAttendance = async (url, AttendanceStatus, location) => {
  try {
    // Send a POST request to the server to update user attendance
    const time = dayjs().format("HH:mm:ss");
    const date = dayjs().format("YYYY-MM-DD");

    const response = await Axios.post(`/attendance/upadte-user-attendance`, {
      time: time,
      date: date,
      UserImage: url,
      system_ip: ip,
      status: AttendanceStatus,
      location: location,
    });
    // Return the response from the server
    return response;
  } catch (err) {
    // Return an error object in case of failure
    return err;
  }
};

export const fetchAllUsers = async () => {
  try {
    // Send a POST request to the server to get lead source counting data
    const response = await Axios.post(`/attendance/fetch-all-users`);
    // Return the response from the server
    console.log(response, "response");
    return response;
    
  } catch (err) {
    // Return an error object in case of failure
    return err;
  }
};

export const getTodayAllUsersAttendance = async () => {
  try {
    const response = await Axios.post(
      `/attendance/get-today-all-users-attendance`
    );
    return response;
  } catch (err) {
    return err;
  }
};

export const getFilterUsersAttendance = async (data) => {
  try {
    const response = await Axios.post(
      `/attendance/get-filter-user-attendance-data`,
      {
        data,
      }
    );

    console.log(response, "response");
    return response;
  } catch (err) {
    return err;
  }
};
export const getAttendanceDataPayslip = async (data) => {
  try {
    const response = await Axios.post(
      `/attendance/get-attendance-data-for-payslip`,
      {
        data,
      }
    );
    return response;
  } catch (err) {
    return err;
  }
};

export const getAttendancePolicy = async () => {
  try {
    const response = await Axios.get(`/attendance/get-attendance-policy`);
    return response;
  } catch (err) {
    return err;
  }
};

export const addEditAttendance = async (data) => {
  try {
    const response = await Axios.post(`/attendance/add-edit-user-attendance`, {
      data,
    });
    return response;
  } catch (err) {
    return err;
  }
};

export const deleteAttendance = async (data) => {
  try {
    const response = await Axios.post(`/attendance/delete-user-attendance`, {
      data,
    });
    return response;
  } catch (err) {
    return err;
  }
};

export const useFilterAttendanceReport = () => {
  return useMutation(getFilterUsersAttendance);
};

export const useAttendanceReportPayslip = () => {
  return useMutation(getAttendanceDataPayslip);
};

export const useAddEditAttendance = () => {
  return useMutation(addEditAttendance);
};

export const useDeleteAttendance = () => {
  return useMutation(deleteAttendance);
};
