import Axios from "../../setting/axios";
import dayjs from "dayjs";

/* Date :- 20-09-2023
Author name :- krishna gupta
Fetch All Non Assign Leads data from backend api and send page and pagesize data to backend api
*/

export const GetPresentLeadsTableData = async (page, pageSize) => {
  // console.log(page);
  // console.log(pageSize);
  try {
    // Send a POST request to the server to get lead source counting data
    const response = await Axios.get(
      `/present-lead/get-present-lead-table-data?page=${page}&pageSize=${pageSize}`
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
Fetch All Present Leads Count data from backend api and send page and pagesize data to backend api
*/

export const PresentLeadTableDataCount = async () => {
  try {
    // Send a POST request to the server to get lead source counting data
    const response = await Axios.post(
      `/present-lead/get-present-lead-table-data-count`
    );
    // Return the response from the server
    return response;
  } catch (err) {
    // Return an error object in case of failure
    return err;
  }
};

// export const GetPresentLeadsNotificationData = async () => {
//   try {
//     const response = await Axios.get(
//       `/present-lead/get-present-lead-notification-data`
//     );
// Return the response from the server//
// return response;
//   } catch (err) {
// Return an error object in case of failure//
// return err;
//   }
// };
