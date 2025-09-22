import Axios from "../../setting/axios";
import { useMutation } from "react-query";

const AddPaySlip = async (data) => {
  try {
    // Send a POST request to the server to get lead source counting data
    const response = await Axios.post(
      `/pay-slip/add-payslip`,
      data
    );
    // Return the response from the server
    return response;
  } catch (err) {
    // Return an error object in case of failure
    return err;
  }
};

const GetPaySlip = async () => {
  try {
    // Send a POST request to the server to get lead source counting data
    const response = await Axios.post(
      `/pay-slip/get-all-slips`
    );
    // Return the response from the server
    return response;
  } catch (err) {
    // Return an error object in case of failure
    return err;
  }
}

export const GetPayslipById = async (id) => {
  try {
    const response = await Axios.post(
      `/pay-slip/get-payslip-by-id/${id}`
    );
    return response;
  } catch (err) {
    return err;
  }
}

export const updatePayslipById = async (val) => {
  console.log(val,"something");
  const { ps_id, values } = val
  try {
    const response = await Axios.post(
      `/pay-slip/update-pay-slip-by-id/${ps_id}`,{
        values
      }
    );
    console.log(response, "response");
    return response;
  } catch (err) {
    return err;
  }
}

const deletePaySlip = async (data) => {
  console.log(data);
  try {
    let ps_id = [];
    if (Array.isArray(data[0])) {
      ps_id = data[0].map((entry) => entry.ps_id);
    } else {
      ps_id = data.map((entry) => entry.ps_id);
    }
    console.log(ps_id, "ps_id");
    // Send a POST request to the server to get lead source counting data
    const response = await Axios.post(
      `/pay-slip/delete-pay-slip-by-id/`,{
        ps_id
      }
    );
    // Return the response from the server
    return response;
  } catch (err) {
    // Return an error object in case of failure
    return err;
  }
}

export const useAddPayslip = () => {
  return useMutation(AddPaySlip);
}

export const useAllPayslip = () => {
  return GetPaySlip();
}

export const useDeletePayslip = () => {
  return useMutation(deletePaySlip)
}

export const useUpdatePayslip = () => {
  return useMutation(updatePayslipById)
}