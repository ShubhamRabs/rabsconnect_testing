import { useMutation } from "react-query";
import axios from "../../setting/axios";

export const getLeadCallData = async (data) => {
  try {
    const response = await axios.post("/call-history/get-call-lead-history", {
      data: {
        lid: data,
      },
    });
    return response;
  } catch (err) {
    return err;
  }
};

export const getLeadData = async (lead_id) => {
  try {
    const response = await axios.post("/lead/leadDetail", {
      lead_id: lead_id,
    });
    return response;
  } catch (err) {
    return err;
  }
};

const AddLeadCallHistory = async (data) => {
  try {
    const response = await axios.post("/call-history/add-call-lead-history", {
      data,
    });
    return response;
  } catch (err) {
    return err;
  }
};

export const useAddLeadCallHistory = () => {
  const { mutate, isLoading } = useMutation(AddLeadCallHistory);
  return {
    mutate,
    isLoading,
  };
};
