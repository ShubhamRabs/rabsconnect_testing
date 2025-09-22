import { useMutation } from "react-query";
import Axios from "../../setting/axios";
import dayjs from "dayjs";

const DateTime = dayjs().format("YYYY-MM-DD HH:mm:ss");

const AddNewInvoice = async (data) => {
  console.log("All Data : ", data);
  try {
    const response = await Axios.post(`/invoice/add-invoice`, {
      data,
    });
    // Return the response from the server
    return response;
  } catch (err) {
    // Return an error object in case of failure
    return err;
  }
};

export const GetAllBookingDone = async () => {
  try {
    // Send a POST request to the server to get lead source counting data
    const response = await Axios.post(`/invoice/get-all-booking-done`);
    // Return the response from the server
    return response;
  } catch (err) {
    // Return an error object in case of failure
    return err;
  }
};
export const GetAllBankName = async () => {
  try {
    // Send a POST request to the server to get lead source counting data
    const response = await Axios.post(`/invoice/get-all-bankname`);
    // Return the response from the server
    return response;
  } catch (err) {
    // Return an error object in case of failure
    return err;
  }
};

export const GetAllInvoiceDetails = async (page, pageSize) => {

  try {
    // Send a POST request to the server to get lead source counting data
    // const response = await Axios.post(`/invoice/get-all-invoice-details`);
    const response = await Axios.get(
      `/invoice/get-all-invoice-details-table-data?page=${page}&pageSize=${pageSize}`
    );
    // Return the response from the server
    return response;
  } catch (err) {
    // Return an error object in case of failure
    return err;
  }
};

export const TotalInvoiceTableDataCount = async () => {
  try {
    // Send a POST request to the server to get broker counting data
    const response = await Axios.post(
      `/invoice/get-invoice-details-table-data-count`
    );
    // Return the response from the server
    return response;
  } catch (err) {
    // Return an error object in case of failure
    return err;
  }
};

const EditInvoice = async (data) => {
  // console.log(data);
  try {
    const response = await Axios.post(`/invoice/edit-invoice`, {
      data,
    });
    return response;
  } catch (err) {
    console.log(err);
    return err;
  }
};

const DeleteSelectedInvoice = async (id) => {
  console.log(id);
  try {
    // Send a POST request to the server to get lead source counting data
    const response = await Axios.post(`/invoice/delete-selected-invoice`, {
      inv_id: id,
    });
    // const response = await Axios.post(/invoice/delete - selected - invoice, {
    //   inv_id: id,
    // });
    // Return the response from the server
    return response;
  } catch (err) {
    console.log("error : ", err);
    return err;
  }
};
export const useDeleteSelectedInvoice = () => {
  return useMutation(DeleteSelectedInvoice);
};

export const useEditInvoice = () => {
  return useMutation(EditInvoice);
};

export const UseInvoiceHook = () => {
  return useMutation(AddNewInvoice);
};