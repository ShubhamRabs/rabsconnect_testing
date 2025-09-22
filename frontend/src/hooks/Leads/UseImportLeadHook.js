import Axios from "../../setting/axios";

export const TotalImportLeadTableDataCount = async (page, pageSize) => {
  try {
    // Send a POST request to the server to get lead source counting data
    const response = await Axios.post(
      `/import-lead/get-total-import-lead-count`
    );
    console.log(response, "TotalExportLeadTableDataCount");
    // Return the response from the server
    return response;
  } catch (err) {
    // Return an error object in case of failure
    return err;
  }
};

export const GetTotalLeadsImportTableData = async (page, pageSize) => {
  try {
    // Send a POST request to the server to get lead source counting data
    const response = await Axios.get(
      `/import-lead/get-total-import-lead-table-data?page=${page}&pageSize=${pageSize}`
    );
    // Return the response from the server
    console.log(response, "GetTotalLeadsIMportttTableData");

    return response;
  } catch (err) {
    // Return an error object in case of failure
    return err;
  }
};
