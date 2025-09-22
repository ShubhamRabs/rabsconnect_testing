import Axios from "../../setting/axios";

export const GetAssignLeadsTableData = async (page, pageSize) => {
  try {
    // Send a POST request to the server to get lead source counting data
    const response = await Axios.get(
      `/assign-lead/get-assign-lead-table-data?page=${page}&pageSize=${pageSize}`
    );
    console.log(response.data, "response Assign");
    // Return the response from the server
    return response;
  } catch (err) {
    // Return an error object in case of failure
    return err;
  }
};

// const getNewLeadCount = async (teamMember, teamMemberId) => {
//   try {
//     const response = await Axios.post('/get-NewLead-Count', {
//       team_member: teamMember,
//       team_member_id: teamMemberId
//     });

//     if (response.status === 200) {
//       return response.data;
//     } else {
//       console.error('Error fetching new lead count:', response.statusText);
//       return null;
//     }
//   } catch (error) {
//     console.error('Error fetching new lead count:', error);
//     return null;
//   }
// };

// export default getNewLeadCount;

export const AssignLeadTableDataCount = async (page, pageSize) => {
  try {
    // Send a POST request to the server to get lead source counting data
    const response = await Axios.post(
      `/assign-lead/get-assign-lead-table-data-count`,
    );
    // Return the response from the server
    return response;
  } catch (err) {
    // Return an error object in case of failure
    return err;
  }
};


export const FreshLeadCount = async () => {
  try {
    // Send a POST request to the server to get fresh lead count data
    const response = await Axios.post("/assign-lead/get-fresh-lead-count");
    console.log(response, "fresh lead count");
    // Return the response from the server
    return response;
  } catch (err) {
    // Return an error object in case of failure
    console.error("Error fetching fresh lead count", err);
    return err;
  }
};

export const GetFreshLeadsTableData = async (page, pageSize) => {
  try {
    // Send a GET request to the server to get fresh leads data
    const response = await Axios.get(
      `/assign-lead/get-fresh-lead-table-data?page=${page}&pageSize=${pageSize}`
    );
    // Return the response from the server
    return response;
  } catch (err) {
    // Return an error object in case of failure
    console.error("Error fetching fresh leads data", err);
    return err;
  }
};



export const getNewUndefinedCount = async () => {
  console.log("new undefined count");
  
  try {
    const responseCount = await Axios.post("/lead-by-status/get-NewLead-Count");
    const undefinedCount = await Axios.post(
      "/lead-by-status/get-Undefinedleads-Count"
    );
    console.log(
      responseCount.data[0].newlead_count,
      undefinedCount.data[0].statuslead_count,
      "new undefined count"
    );
    return {
      newleadcount: responseCount.data[0].newlead_count,
      undefinedcount: undefinedCount.data[0].statuslead_count,
    };
  } catch (err) {
    return err;
  }
};

// export const getStatusFreshNewLeads = async (LIMIT, page, status) => {
//   try {
//     const response = await Axios.post('/lead-by-status/get-New-Leads', {
//       limit: LIMIT,
//       page: page,
//       status: status,
//     });
//     console.log(response.data, "fresh new leads");
//     const responseCount = await Axios.post('/lead-by-status/get-NewLead-Count');
//     const page_no = Math.round((page + 10) / 10);
//     const total_pages =
//       responseCount.data[0].newlead_count < 10
//         ? 1
//         : Math.ceil(responseCount.data[0].newlead_count / 10);
//     return {
//       response,
//       nextPage: page_no,
//       totalPages: total_pages,
//     };
//   } catch (err) {
//     return err;
//   }
// };

export const GetUnknownLeadCount = async () => {
  try {
    const response = await Axios.post("/assign-lead/get-unknown-lead-count");
    console.log(response, "unknown count");
    return response;
  } catch (err) {
    console.error(err);
    throw err;
  }
};