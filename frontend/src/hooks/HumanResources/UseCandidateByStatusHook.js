import axios from "../../setting/axios";
import { useMutation } from "react-query";

export const getCandidateByStatusCount = async () => {
  try {
    const response = await axios.get(
      "/candidate-by-status/get-all-candidate-by-status"
    );
    return response;
  } catch (err) {
    return err;
  }
};

export const getCandidateByUserStatusCount = async () => {
  try {
    const response = await axios.get(
      "/candidate-by-status/get-all-user-candidate-by-status"
    );
    return response;
  } catch (err) {
    return err;
  }
};
export const GetTotalCandidatesByStatusTableData = async (
  page,
  pageSize,
  userData
) => {
  // let data = {teamPage: teamPage}
  let CandidateStatus = userData.status;
  let teamPage = userData.teamPage;

  try {
    // Send a POST request to the server to get lead source counting data
    const response = await axios.get(
      `/candidate-by-status/get-all-candidate-by-status-table-data?page=${page}&pageSize=${pageSize}&candidateStatus=${CandidateStatus}&teamPage=${teamPage}`
    );
    // Return the response from the server
    return response;
  } catch (err) {
    // Return an error object in case of failure
    return err;
  }
};

const SearchCandidateByStatus = async (data) => {
  try {
    // Use Axios to make a POST request to the candidate-advanced-search endpoint
    const SearchData = await axios.post(
      `/candidate-advanced-search/search-candidates?page=${data[1]}&pageSize=${data[2]}`,
      {
        data: data[0],
      }
    );

    // Use Axios to make a POST request to retrieve the count of search results
    // const SearchCount = {data:SearchData?.data?.length || 0};
    const SearchCount = await axios.post(
      `/candidate-advanced-search/search-candidates-count`,
      {
        data: data[0],
      }
    );

    // Return an object containing the search data and search count
    return { SearchData, SearchCount };
  } catch (err) {
    // If an error occurs during the request, return the error
    return err;
  }
};

export const TotalCandidatesByStatusTableDataCount = async (data) => {
  try {
    // Send a POST request to the server to get lead source counting data
    const response = await axios.post(
      `/candidate-by-status/get-all-candidate-by-status-table-data-count`,
      data[0]
    );
    // Return the response from the server
    return response;
  } catch (err) {
    // Return an error object in case of failure
    return err;
  }
};

export const useSearchCandidatesByStatus = () => {
  return useMutation(SearchCandidateByStatus);
};