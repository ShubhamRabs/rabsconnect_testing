import axios from "../../setting/axios";


export const GetLeadsByBrokerId = async (page, pageSize, brk_id) => {
    try {
      // Ensure brk_id is passed correctly
      const response = await axios.post(
        `/broker/get-leads-by-broker-id?page=${page}&pageSize=${pageSize}&brk_id=${brk_id}`
      );
      return response; // Return the response data
    } catch (err) { 
      console.error(err);
      throw err; // Throw the error to handle it in the component
    }
};

  export const GetBrokerLeadCountById = async (brk_id) => {
    try {
      const response = await axios.post(
        `/broker/get-broker-lead-count-by-id?brk_id=${brk_id}`
      );
      console.log(response.data, "response Broker details ID");
      return response; // Return the response data
    } catch (err) {
      console.error("Error fetching broker lead count by ID:", err);
      throw err; // Throw the error to handle it in the component
    }
  };
  

  
export const GetBrokerLeadCount = async () => {
    try {
      const response = await axios.post(`/broker/get-broker-lead-count`);
      return response;
    } catch (err) {
      console.error("Error fetching broker lead count:", err);
      throw err;
    }
  };


export const GetAllBrokerLeads = async (page, pageSize) => {
    try {
      const response = await axios.post(
        `/broker/get-all-broker-leads?page=${page}&pageSize=${pageSize}`
      );
      console.log(response, "response All Broker Leads");
      return response;
    } catch (err) {
      console.error(err);
      throw err;
    }
  };