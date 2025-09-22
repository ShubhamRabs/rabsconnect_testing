// Import the useMutation hook from React Query
import { useMutation } from "react-query";

// Import Axios for making HTTP requests
import Axios from "../../setting/axios";

// Define an asynchronous function SearchLeadScheduer that takes search data as input
const SearchLeadScheduer = async (data) => {
  try {
    // Use Axios to make a POST request to the advanced-search endpoint for lead schedulers
    const SearchData = await Axios.post(
      `/lead-scheduling-advanced-search/search-lead-scheduler?page=${data[1]}&pageSize=${data[2]}`,
      {
        data: data[0],
      }
    );

    // Use Axios to make a POST request to retrieve the count of search results for lead schedulers
    const SearchCount = await Axios.post(
      `/lead-scheduling-advanced-search/search-lead-scheduler-count`,
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

// Define the useSearchLeadScheduler hook, which returns the result of useMutation
export const useSearchLeadScheduler = () => {
  return useMutation(SearchLeadScheduer);
};
