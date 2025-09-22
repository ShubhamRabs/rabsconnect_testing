// Import the useMutation hook from React Query
import { useMutation } from "react-query";

// Import Axios for making HTTP requests
import Axios from "../../setting/axios";

// Define an asynchronous function SearchBroker that takes search data as input
const SearchBroker = async (data) => {
  try {
    // Use Axios to make a POST request to the broker-advanced-search endpoint
    const SearchData = await Axios.post(
      `/broker-advanced-search/search-broker?page=${data[1]}&pageSize=${data[2]}`,
      {
        data: data[0],
      }
    ); 

    // Use Axios to make a POST request to retrieve the count of search results
    const SearchCount = await Axios.post(
      `/broker-advanced-search/search-broker-count`,
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

// Define the useSearchBroker hook, which returns the result of useMutation
export const useSearchBroker = () => {
  return useMutation(SearchBroker);
};
