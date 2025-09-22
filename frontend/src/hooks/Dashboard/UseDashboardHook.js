import Axios from "../../setting/axios";

export const getLeadSourceCounting = async () => {
  try {
    // Send a POST request to the server to get lead source counting data
    const response = await Axios.post(`/dashboard/get-lead-source-counting`);
    // Return the response from the server
    return response;
  } catch (err) {
    // Return an error object in case of failure
    return err;
  }
};

export const getAllUserLocation = async () => {
  try {
    // Send a POST request to the server to get lead source counting data
    const response = await Axios.post(`/dashboard/get-user-loaction`);
    // Return the response from the server
    return response;
  } catch (err) {
    // Return an error object in case of failure
    return err;
  }
};

export const getLeadStatusCounting = async () => {
  try {
    // Send a POST request to the server to get lead source counting data
    const response = await Axios.post(`/dashboard/get-lead-status-counting`);
    // Return the response from the server
    return response;
  } catch (err) {
    // Return an error object in case of failure
    return err;
  }
};

export const getLeadAnalyticsCount = async () => {
  try {
    // Send a POST request to the server to get lead source counting data
    const response = await Axios.post(`/dashboard/get-lead-analytics-counting`);
    // Return the response from the server
    return response;
  } catch (err) {
    // Return an error object in case of failure
    return err;
  }
};

export const getLeadsStatusAnalyticsCount = async () => {
  try {
    // Send a POST request to the server to get lead source counting data
    const response = await Axios.post(
      `/dashboard/get-leads-status-analytics-counting`
    );
    // Return the response from the server
    return response;
  } catch (err) {
    // Return an error object in case of failure
    return err;
  }
};

export const getCandidateStatusAnalyticsCount = async () => {
  try {
    // Send a POST request to the server to get lead source counting data
    const response = await Axios.post(
      `/dashboard/get-candidate-status-analytics-counting`
    );
    // Return the response from the server
    return response;
  } catch (err) {
    // Return an error object in case of failure
    return err;
  }
};

export const getUserLeadStatusCounting = async () => {
  try {
    // Send a POST request to the server to get lead source counting data
    const response = await Axios.post(
      `/dashboard/get-user-lead-status-counting`
    );
    // Return the response from the server
    return response;
  } catch (err) {
    // Return an error object in case of failure
    return err;
  }
};

export const getCandidateSourceCounting = async () => {
  try {
    // Send a POST request to the server to get lead source counting data
    const response = await Axios.post(
      `/dashboard/get-candidate-source-counting`
    );
    // Return the response from the server
    return response;
  } catch (err) {
    // Return an error object in case of failure
    return err;
  }
};


export const getProjectLeadCount = async () => {
  try {
    // Send a POST request to the server to get lead source counting data
    const response = await Axios.post(`/dashboard/get-lead-project-counting`);
    // Return the response from the server
    return response;
  } catch (err) {
    // Return an error object in case of failure
    return err;
  }
};

export const getTeamMembersLeadReport = async () => {
  try {
    // Send a POST request to the server to get lead source counting data
    const response = await Axios.post(`/dashboard/get-get-team-members-lead-report`);
    // Return the response from the server
    return response;
  } catch (err) {
    // Return an error object in case of failure
    return err;
  }
};