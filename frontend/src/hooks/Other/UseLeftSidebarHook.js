import Axios from "../../setting/axios";

export const getSubMenuLeadCount = async () => {
  try {
    // Send a POST request to the server to get lead source counting data
    const response = await Axios.post(
      `/left-sidebar/get-sub-menu-lead-counting`
    );
    // Return the response from the server
    return response;
  } catch (err) {
    // Return an error object in case of failure
    return err;
  }
};

export const getSubMenuCandidateCount = async () => {
  try {
    // Send a POST request to the server to get lead source counting data
    const response = await Axios.post(
      `/left-sidebar/get-sub-menu-candidate-counting`
    );
    // Return the response from the server
    return response;
  } catch (err) {
    // Return an error object in case of failure
    return err;
  }
};

export const getSubMenuLoanCount = async () => {
  try {
    // Send a POST request to the server to get lead source counting data
    const response = await Axios.post(
      `/left-sidebar/get-sub-menu-loan-counting`
    );
    // Return the response from the server
    return response;
  } catch (err) {
    // Return an error object in case of failure
    return err;
  }
};

export const getSubMenuBrokerCount = async () => {
  try {
    // Send a POST request to the server to get lead source counting data
    const response = await Axios.post(
      `/left-sidebar/get-sub-menu-broker-counting`
    );
    // Return the response from the server
    return response;
  } catch (err) {
    // Return an error object in case of failure
    return err;
  }
};




export const GetLeadCountByBrokerId = async (brokerId) => {
  try {
    const response = await Axios.post('/broker/get-lead-count-by-broker-id', {
      id: brokerId,
    });

    console.log(response, "response Broker details");

    return response; // Return the count directly
  } catch (err) {
    console.error(err);
    throw err; // Throw the error to handle it in the component
  }
};