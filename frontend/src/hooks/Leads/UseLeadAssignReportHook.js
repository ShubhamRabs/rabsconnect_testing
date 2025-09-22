// import { useMutation } from "react-query";
import Axios from "../../setting/axios";
// import dayjs from "dayjs";

export const GetLeadAssignReportTableData = async (page, pageSize) => {
  try {
    // Send a POST request to the server to get lead source counting data
    const response = await Axios.get(
      `/lead-assign-report/get-lead-assign-report-table-data?page=${page}&pageSize=${pageSize}`
    );
    // Return the response from the server
    return response;
  } catch (err) {
    // Return an error object in case of failure
    return err;
  }
};

export const LeadAssignReportTableDataCount = async (page, pageSize) => {
  try {
    // Send a POST request to the server to get lead source counting data
    const response = await Axios.post(
      `/lead-assign-report/get-lead-assign-report-table-data-count`
    );
    // Return the response from the server
    return response;
  } catch (err) {
    // Return an error object in case of failure
    return err;
  }
};

export const getLeadAssignReportSearchDetails = async () => {
  try {
    // Send a POST request to the server to get lead source counting data
    const response = await Axios.get(
      `/lead-assign-report-advanced-search/get-search-lead-assign-report-details`
    );
    // Return the response from the server
    return response;
  } catch (err) {
    // Return an error object in case of failure
    return err;
  }
};
