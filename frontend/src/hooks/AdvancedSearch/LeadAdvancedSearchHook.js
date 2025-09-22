import { useMutation } from "react-query";
import Axios from "../../setting/axios";

const SearchLeads = async (data, signal) => {
  try {
    const SearchData = await Axios.post(
      `/advanced-search/search-leads?page=${data[1]}&pageSize=${data[2]}`,
      {
        data: data[0],
      },
      { signal }
    );

    const SearchCount = await Axios.post(
      `/advanced-search/search-leads-count`,
      {
        data: data[0],
      },
      { signal }
    );

    return { SearchData, SearchCount };
  } catch (err) {
    throw err;
  }
};

export const useSearchLeads = (options = {}) => {
  const { mutationOptions = {} } = options;

  const mutation = useMutation({
    mutationFn: (data) => {
      const controller = new AbortController();
      const signal = controller.signal;

      mutation.controller = controller;

      return SearchLeads(data, signal);
    },
    ...mutationOptions,
    onError: (error) => {
      if (error.name === "AbortError") {
        console.log("Search request was cancelled");
      } else {
        console.error("Search error:", error.message);
      }
    },
  });

  const cancel = () => {
    if (mutation.controller) {
      mutation.controller.abort();
    }
  };

  return {
    ...mutation,
    cancel,
  };
};