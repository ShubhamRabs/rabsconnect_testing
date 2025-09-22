import { useMutation } from "react-query";
import Axios from "../../setting/axios";
import dayjs from "dayjs";
import Cookies from "js-cookie";

const DeleteSelectedLead = async (data) => {
  let lead_id = [];
  let lead_req_id = [];
  console.log(data, "data");
  if(Cookies.get("role") === "admin" || Cookies.get("role") === "master"){
    if (Array.isArray(data[0])) {
      lead_id = data[0].map((entry) => entry.l_id);
    } else {
      lead_id = data.map((entry) => entry.l_id);
    }
  }else{
    if (Array.isArray(data[0])) {
      lead_id = data[0].map((entry) => entry.l_id);
      lead_req_id = data[0].map((entry) => entry.assignlead_id);
    } else {
      lead_id = data.map((entry) => entry.l_id);
      lead_req_id = data.map((entry) => entry.assignlead_id);
    }
  }
  console.log(lead_id, "lead_id");
  try {
    // Send a POST request to the server to get lead source counting data
    const response = await Axios.post(`/lead/delete-selected-lead`, {
      lid: lead_id,lead_req_id
    });
    // Return the response from the server
    return response;
  } catch (err) {
    // Return an error object in case of failure
    return err;
  }
};

export const useDeleteSelectedLead = () => {
  return useMutation(DeleteSelectedLead);
};



const UnassignSelectedLead = async (data) => {

  // console.log(data);

  let leadIds = [];
  if (Array.isArray(data)) {
      leadIds = data.map((entry) => { 
      return {lreq_id: entry.assignlead_id, l_id: entry.l_id} 
     }
    );
  }
  // console.log(leadIds);

  try {
    // Send a POST request to the server to get lead source counting data
    const response = await Axios.post(`/lead/unassign-selected-lead`, {
      leadIds
    });
    // Return the response from the server
    return response;
  } catch (err) {
    // Return an error object in case of failure
    return err;
  }
};

export const useUnassignSelectedLead = () => {
  return useMutation(UnassignSelectedLead);
};

/* Date :- 02-10-2023
  Author name :- krishna gupta
  Fetch All lead assign user list from backend api and lead id data to backend api
  */

export const getLeadAssignUserList = async (data) => {
  try {
    // Send a POST request to the server to get lead source counting data
    const response = await Axios.post(`/lead/get-lead-assign-user-list`, {
      lid: data,
    });
    // Return the response from the server
    return response;
  } catch (err) {
    // Return an error object in case of failure
    return err;
  }
};

/* Date :- 02-10-2023
    Author name :- krishna gupta
    Fetch All lead assign user data from backend api and lead id & User id data to backend api
    */

export const getLeadAssignUserData = async (lead_id) => {
  try {
    // Send a POST request to the server to get lead source counting data
    const response = await Axios.post(`/lead/get-lead-assign-user-data`, {
      lid: lead_id,
    });
    // Return the response from the server
    return response;
  } catch (err) {
    // Return an error object in case of failure
    return err;
  }
};

const setQuickEditLead = async (data) => {
  const DateTime = dayjs().format("YYYY-MM-DD HH:mm:ss");
  try {
    // Send a POST request to the server to get lead source counting data
    const response = await Axios.post(`/lead/update-quick-lead`, {
      data,
      DateTime,
    });
    // Return the response from the server
    return response;
  } catch (err) {
    // Return an error object in case of failure
    return err;
  }
};

export const useQuickEditLead = () => {
  return useMutation(setQuickEditLead);
};

const SetKeepAndAssignLead = async (data) => {
  let condition;
  if (localStorage.getItem("previousScreen") !== "userlead") {
    condition = "direct";
  } else {
    condition = "userleads";
  }
  console.log(condition);
  try {
    // Send a POST request to the server to get lead source counting data
    const response = await Axios.post(`/lead/keep-and-assign-lead`, {
      data,
      condition,
    });
    // Return the response from the server
    return response;
  } catch (err) {
    // Return an error object in case of failure
    return err;
  }
};

export const useSetKeepAndAssignLead = () => {
  return useMutation(SetKeepAndAssignLead);
};

const SetDeleteAndAssignLead = async (data) => {
  let condition;

  if (localStorage.getItem("previousScreen") !== "userlead") {
    condition = "direct";
  } else {
    condition = "userleads";
  }
  console.log(condition);
  try {
    // Send a POST request to the server to get lead source counting data
    const response = await Axios.post(`/lead/delete-and-assign-lead`, {
      data,
      condition,
    });
    // Return the response from the server
    return response;
  } catch (err) {
    // Return an error object in case of failure
    return err;
  }
};

export const useSetDeleteAndAssignLead = () => {
  return useMutation(SetDeleteAndAssignLead);
};

const AddNewLead = async (formData) => {
  const DateTime = dayjs().format("YYYY-MM-DD HH:mm:ss");
  console.log(DateTime, "DateTime");
  formData.append('platform', 'desktop');
  try {
    // Send a POST request with FormData
    const response = await Axios.post('/lead/add-lead', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    // Return the response from the server
    return response;  
  } catch (err) {
    // Handle error
    console.error('Error adding new lead:', err);
    throw err;
  }
};

export const useAddNewLead = () => {
  return useMutation(AddNewLead);
};







// const AddNewLead = async (data) => {
//   const DateTime = dayjs().format("YYYY-MM-DD HH:mm:ss");
//   console.log(DateTime, "DateTime");

//   try {
//     // Create a FormData instance
//     const formData = new FormData();

//     // Append all fields to FormData
//     formData.append('data', JSON.stringify({ ...data, DateTime }));

//     // Append the file if it exists
//     if (data.document) {
//       formData.append('document', data.document);
//     }
//     console.log(data, "data");
//     // Send a POST request with the FormData
//     console.log(formData, "formData");
//     const response = await Axios.post('/lead/add-lead', formData, {
//       // headers: {
//       //   'Content-Type': 'multipart/form-data'
//       // }
//     });
//      console.log(formData, "formData");
//     console.log(response, "response");

//     // Return the response from the server
//     return response;
//   } catch (err) {
//     // Handle error
//     console.error('Error adding new lead:', err);
//     throw err;
//   }
// };

// export const useAddNewLead = () => {
//   return useMutation(AddNewLead);
// };




// const AddNewLead = async (values, file) => {
//   const DateTime = dayjs().format("YYYY-MM-DD HH:mm:ss");
//   console.log(DateTime, "DateTime");

//   try {
//     // Create a FormData instance
//     const formData = new FormData();
//     console.log(file, "file");
//     // Append the form data
//     console.log(values, "values");
//     formData.append('data', JSON.stringify({
//       ...values,
//       DateTime,
//     }));

//     // Append the file if it exists
//     if (file) {
//       formData.append('document', file);
//     }
//     console.log(values, "formData");
//     // Send a POST request with the FormData
//     const response = await Axios.post(`/lead/add-lead`, formData, {
//       headers: {
//         'Content-Type': 'multipart/form-data',
//       },
//     });

//     // Return the response from the server
//     return response.data;
//   } catch (err) {
//     // Handle error
//     console.error('Error adding new lead:', err);
//     throw err;
//   }
// };

// export const useAddNewLead = () => {
//   return useMutation((data) => AddNewLead(data.values, data.file));
// };


const EditLead = async (formData) => {
  //const DateTime = dayjs().format("YYYY-MM-DD HH:mm:ss");

  // Log the FormData entries to verify the data being sent
  console.log("FormData before sending:");
  for (let [key, value] of formData.entries()) {
    console.log(`${key}:`, value);
  }
  formData.append('platform', 'desktop');
  try {
    // Send a POST request to the server to edit the lead
    const response = await Axios.post(`/lead/edit-lead`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data', // Ensure correct content type
      },
    });

    // Log the response from the server to check if it's successful
    console.log("Server response:", response);

    // Return the server's response
    return response;
  } catch (err) {
    // Log the error to debug any issues with the request
    console.error("Error during EditLead:", err);
    return err;
  }
};

// Custom hook using EditLead function
export const useEditLead = () => {
  return useMutation(EditLead);
};



// const EditLead = async (data) => {
//   const DateTime = dayjs().format("YYYY-MM-DD HH:mm:ss");
//   try {
//     // Send a POST request to the server to get lead source counting data
//     const response = await Axios.post(`/lead/edit-lead`, {
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

// export const useEditLead = () => {
//   return useMutation(EditLead);
// };


const ConvertFreshLead = async (data) => {
  console.log(data);
  try {
    // Send a POST request to the server to get lead source counting data
    const response = await Axios.post(`/lead/setclick`, {
      lid: data,
    });
    // Return the response from the server
    return response;
  } catch (err) {
    // Return an error object in case of failure
    return err;
  }
};

export const useConvertFreshLead = () => {
  return useMutation(ConvertFreshLead);
};

