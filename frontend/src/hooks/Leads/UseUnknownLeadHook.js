import Axios from "../../setting/axios";


export const GetUnknownLeadsTableData = async (page, pageSize) => {
  try {
    const response = await Axios.post(
      `/unknown-lead/get-unknown-leads?page=${page}&pageSize=${pageSize}`,
      {
        page,
        pageSize,
      }
    );
    return response; // Return the data directly
  } catch (err) {
    console.error(err);
    throw err; // Throw the error to handle it in the component
  }
};

export const GetUnknownLeadCount = async () => {
  try {
    const response = await Axios.post("/unknown-lead/get-unknown-lead-count");
    console.log(response, "unknown count");
    return response;
  } catch (err) {
    console.error(err);
    throw err;
  }
};