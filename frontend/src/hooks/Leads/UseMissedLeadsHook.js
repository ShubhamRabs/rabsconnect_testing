import Axios from "../../setting/axios";
import dayjs from "dayjs";
/* Date :- 20-09-2023
Author name :- krishna gupta
Fetch All Non Assign Leads data from backend api and send page and pagesize data to backend api
*/
export const GetMissedLeadsTableData = async (page, pageSize) => {
  try {
    // Send a POST request to the server to get lead source counting data
    const response = await Axios.get(
      `/missed-lead/get-missed-lead-table-data?page=${page}&pageSize=${pageSize}`
    );
    // Return the response from the server
    return response;
  } catch (err) {
    // Return an error object in case of failure
    return err;
  }
};

/* Date :- 20-09-2023
Author name :- krishna gupta
Fetch All Missed Leads Count data from backend api and send page and pagesize data to backend api
*/
export const MissedLeadTableDataCount = async () => {
  try {
    // Send a POST request to the server to get lead source counting data
    const response = await Axios.post(
      `/missed-lead/get-missed-lead-table-data-count`
    );
    // Return the response from the server
    return response;
  } catch (err) {
    // Return an error object in case of failure
    return err;
  }
};
