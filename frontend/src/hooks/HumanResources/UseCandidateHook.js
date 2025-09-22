import { useMutation } from "react-query";
import Axios from "../../setting/axios";
import dayjs from "dayjs";


const EditCandidate = async (data) => {
  const DateTime = dayjs().format("YYYY-MM-DD HH:mm:ss");
  try {
    // Send a POST request to the server to get lead source counting data
    const response = await Axios.post(`/candidate/edit-candidate`, {
      DateTime,
      data,
    });
    // Return the response from the server
    return response;
  } catch (err) {
    // Return an error object in case of failure
    return err;
  }
};

const QuickEditCandidate = async (data) => {
  const DateTime = dayjs().format("YYYY-MM-DD HH:mm:ss");
  try {
    // Send a POST request to the server to get lead source counting data
    const response = await Axios.post(`/candidate/quick-edit-candidate`, {
      DateTime,
      data,
    });
    // Return the response from the server
    return response;
  } catch (err) {
    // Return an error object in case of failure
    return err;
  }
};

const DeleteSelectedCandidate = async (id) => {
  try {
    // Send a POST request to the server to get lead source counting data
    const response = await Axios.post(`/candidate/delete-selected-candidate`, {
      c_id: id,
    });
    // Return the response from the server
    return response;
  } catch (err) {
    // Return an error object in case of failure
    return err;
  }
};

const SetAssignCandidate = async (id) => {
  try {
    // Send a POST request to the server to get lead source counting data
    const response = await Axios.post(`/candidate/assign-selected-candidate`, id);
    // Return the response from the server
    return response;
  } catch (err) {
    // Return an error object in case of failure
    return err;
  }
};

export const useEditCandidate = () => {
  return useMutation(EditCandidate);
};

export const useQuickEditCandidate = () => {
  return useMutation(QuickEditCandidate);
};

export const useDeleteSelectedCandidate = () => {
  return useMutation(DeleteSelectedCandidate);
};

export const useAssignCandidate = () => {
  return useMutation(SetAssignCandidate);
};