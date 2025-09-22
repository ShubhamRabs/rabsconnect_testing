import Axios from "../../setting/axios";

export const GetNonAssignCandidatesTableData = async (page, pageSize) => {
  try {
    // Send a POST request to the server to get lead source counting data
    const response = await Axios.get(
      `/non-assign-candidate/get-non-assign-candidate-table-data?page=${page}&pageSize=${pageSize}`
    );
    // Return the response from the server
    return response;
  } catch (err) {
    // Return an error object in case of failure
    return err;
  }
};

export const NonAssignCandidatesTableDataCount = async () => {
  try {
    // Send a POST request to the server to get lead source counting data
    const response = await Axios.post(
      `/non-assign-candidate/get-non-assign-candidate-table-data-count`
    );
    // Return the response from the server
    return response;
  } catch (err) {
    // Return an error object in case of failure
    return err;
  }
};