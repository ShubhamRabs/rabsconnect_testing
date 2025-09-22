// import { useMutation } from "react-query";
// import Axios from "../../setting/axios";
// import dayjs from "dayjs";

// const DateTime = dayjs().format("YYYY-MM-DD HH:mm:ss");
// const AddNewInvoice = async (data) => {
//   try {
//     // Send a POST request to the server to get lead source counting data
//     const response = await Axios.post(`/lead/add-lead`, {
//       DateTime,
//       data,
//     });
//     // Return the response from the server
//     return response;
//   } catch (err) {
//     // Return an error object in case of failure
//     return err;
//   }
// };

// export const UseaddInvoiceHook = () => {
//   return useMutation(AddNewInvoice);
// };
import { useMutation } from "react-query";
import Axios from "../../setting/axios";
import dayjs from "dayjs";


const AddNewInvoice = async (data) => {
  console.log(data);
  const DateTime = dayjs().format("YYYY-MM-DD HH:mm:ss");
  try {
    // Send a POST request to the server to add a new invoice
    // const response = await Axios.post(`/Invoice/add-invoice`, {
    const response = await Axios.post(`/invoice/add-invoice`, {
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

export const UseaddInvoiceHook = () => {
  return useMutation(AddNewInvoice);
};
