import Axios from "../../setting/axios";
import dayjs from "dayjs";
import { useMutation } from "react-query";

export const GetAllLeadStatus = async (fileds) => {
  try {
    const response = await Axios.post(`/lead-status/get-all-lead-status`, {
      columns: fileds,
    });
    return response.data;
  } catch (err) {
    return err;
  }
};

// export const UpdateBrokerStatus = async (brokerData) => {
//   try {
//     const response = await Axios.post(`/lead-status/updateBrokerStatus`, brokerData);
//     return response.data;
//   } catch (err) {
//     console.error("Error updating broker status:", err);
//     throw err; // Re-throw the error for further handling
//   }
// };

export const getUndefinedLeadStatusCount = async () => {
  try {
    const undefinedCount = await Axios.post(
      `/lead-status/get-undefined-lead-status-count`
    );
    return { undefinedcount: undefinedCount.data[0].statuslead_count };
  } catch (err) {
    return err;
  }
};

export const getUserUndefinedLeadStatusCount = async () => {
  try {
    const undefinedCount = await Axios.post(
      `/lead-status/get-user-undefined-lead-status-count`
    );
    return { undefinedcount: undefinedCount.data[0].statuslead_count };
  } catch (err) {
    return err;
  }
};

const SetLeadStatus = async (data) => {
  const DateTime = dayjs().format("YYYY-MM-DD HH:mm:ss");
  try {
    const response = await Axios.post(`/lead-status/add-lead-status`, {
      DateTime,
      lead_status: data[0].lead_status,
      color_code: data[1],
    });
    return response;
  } catch (err) {
    return err;
  }
};

const UpdateLeadStatus = async (data) => {
  const DateTime = dayjs().format("YYYY-MM-DD HH:mm:ss");
  try {
    const response = await Axios.post(`/lead-status/update-lead-status`, {
      DateTime,
      updated_lead_status: data[0].lead_status,
      old_lead_status: data[0].old_lead_status,
      color_code: data[1],
    });
    return response;
  } catch (err) {
    return err;
  }
};

const DeleteLeadStatus = async (data) => {
  try {
    const response = await Axios.post(`/lead-status/delete-lead-status`, {
      data,
    });
    return response.data;
  } catch (err) {
    return err;
  }
};

export const useAddLeadStatus = () => {
  return useMutation(SetLeadStatus);
};

export const useEditLeadStatus = () => {
  return useMutation(UpdateLeadStatus);
};

export const useDeleteLeadStatus = () => {
  return useMutation(DeleteLeadStatus);
};
