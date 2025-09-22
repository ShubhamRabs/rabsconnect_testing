import Axios from "../../setting/axios";
import dayjs from "dayjs";
import { useMutation } from "react-query";


export const GetAllCandidatesSource = async (fileds) => {
  try {
    const response = await Axios.post(
      `/candidates-source/get-all-candidates-source`,
      {
        columns: fileds,
      }
    );
    return response.data;
  } catch (err) {
    return err;
  }
};

const SetCandidatesSource = async (data) => {
const DateTime = dayjs().format("YYYY-MM-DD HH:mm:ss");
  try {
    const response = await Axios.post(
      `/candidates-source/add-candidates-source`,
      { data, DateTime }
    );
    return response.data;
  } catch (err) {
    return err;
  }
};

const DeleteCandidatesSource = async (CandidatessourceID) => {
  try {
    const response = await Axios.post(
      `/candidates-source/delete-candidates-source`,
      {
        c_source_id: CandidatessourceID,
      }
    );
    return response.data;
  } catch (err) {
    return err;
  }
};

const SetEditCandidatesSource = async (data) => {
const DateTime = dayjs().format("YYYY-MM-DD HH:mm:ss");
  try {
    const response = await Axios.post(
      `/candidates-source/edit-candidates-source`,
      {
        data,
        DateTime,
      }
    );
    return response.data;
  } catch (err) {
    return err;
  }
};

export const useEditCandidatesSource = () => {
  return useMutation(SetEditCandidatesSource);
};

export const useAddCandidatesSource = () => {
  return useMutation(SetCandidatesSource);
};

export const useDeleteCandidatesSource = () => {
  return useMutation(DeleteCandidatesSource);
};
