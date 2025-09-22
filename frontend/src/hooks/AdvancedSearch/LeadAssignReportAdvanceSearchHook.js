// Import the useMutation hook from React Query
import { useMutation } from "react-query";

// Import Axios for making HTTP requests
import Axios from "../../setting/axios";

// Define an asynchronous function SearchLeadScheduer that takes search data as input
const SearchLeadAssignReport = async (data) => {
  try {
    // Use Axios to make a POST request to the advanced-search endpoint for lead assign report
    const SearchData = await Axios.post(
      `/lead-assign-report-advanced-search/search-lead-assign-report?page=${data[1]}&pageSize=${data[2]}`,
      {
        data: data[0],
      }
    );

    // Use Axios to make a POST request to retrieve the count of search results for lead assign report
    const SearchCount = await Axios.post(
      `/lead-assign-report-advanced-search/search-lead-assign-report-count`,
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

// Define the useSearchLeadAssignReport hook, which returns the result of useMutation
export const useSearchLeadAssignReport = () => {
  return useMutation(SearchLeadAssignReport);
};
