// Import the useMutation hook from React Query
import { useMutation } from "react-query";

// Import Axios for making HTTP requests
import Axios from "../../setting/axios";

// Define an asynchronous function SearchCandidates that takes search data as input
const SearchCandidates = async (data) => {
  try {
    // Use Axios to make a POST request to the candidate-advanced-search endpoint
    const SearchData = await Axios.post(
      `/candidate-advanced-search/search-candidates?page=${data[1]}&pageSize=${data[2]}`,
      {
        data: data[0],
      }
    );

    // Use Axios to make a POST request to retrieve the count of search results
    const SearchCount = await Axios.post(
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

// Define the useSearchCandidates hook, which returns the result of useMutation
export const useSearchCandidates = () => {
  return useMutation(SearchCandidates);
};
