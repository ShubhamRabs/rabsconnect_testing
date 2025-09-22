import Axios from "../../setting/axios";

export const GetCallingReportTableData = async (
  data,
  LeadReportSearch,
  page,
  pageSize
) => {
  try {
    // Send a POST request to the server to get lead source counting data
    const response = await Axios.get(
      `/report/get-calling-report-table-data?u_id=${data[0].u_id}&start_date=${LeadReportSearch.start_date}&end_date=${LeadReportSearch.end_date}&status=${data[0].status}&page=${page}&pageSize=${pageSize}`
    );
    // Return the response from the server
    return response;
  } catch (err) {
    // Return an error object in case of failure
    return err;
  }
};
