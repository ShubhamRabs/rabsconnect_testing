import { useMutation } from "react-query";
import Axios from "../../setting/axios";
import dayjs from "dayjs";

export const GetLeadSchedulingTableData = async (page, pageSize) => {
  try {
    // Send a POST request to the server to get lead source counting data
    const response = await Axios.get(
      `/lead-scheduling/get-lead-scheduling-table-data?page=${page}&pageSize=${pageSize}`
    );
    // Return the response from the server
    return response;
  } catch (err) {
    // Return an error object in case of failure
    return err;
  }
};

export const LeadSchedulingTableDataCount = async (page, pageSize) => {
  try {
    // Send a POST request to the server to get lead source counting data
    const response = await Axios.post(
      `/lead-scheduling/get-lead-scheduling-table-data-count`
    );
    // Return the response from the server
    return response;
  } catch (err) {
    // Return an error object in case of failure
    return err;
  }
};

export const getLeadScheduleDetailsData = async () => {
  try {
    // Send a POST request to the server to get lead source counting data
    const response = await Axios.get(
      `/lead-scheduling/get-lead-scheduler-details`
    );
    // Return the response from the server
    return response;
  } catch (err) {
    // Return an error object in case of failure
    return err;
  }
};

export const getLeadScheduleDetailsByDateData = async (data) => {
  try {
    // Send a POST request to the server to get lead source counting data
    const response = await Axios.post(
      `/lead-scheduling/get-lead-scheduler-details-by-date`, { data: data }
    );
    // Return the response from the server
    return response;
  } catch (err) {
    // Return an error object in case of failure
    return err;
  }
};

export const getLeadScheduleProjectDetailsData = async (source, service_type, ldate_from, ldate_to) => {
  let data = {
    source,
    service_type,
    ldate_from,
    ldate_to
  };
  try {
    // Send a POST request to the server to get lead source counting data
    const response = await Axios.post(
      `/lead-scheduling/get-lead-scheduler-details-by-project-name`, { data: data }
    );
    // Return the response from the server
    return response;
  } catch (err) {
    // Return an error object in case of failure
    return err;
  }
};

export const getLeadScheduleFormDetailsData = async (source, service_type, pname, ldate_from, ldate_to) => {
  let data = {
    source,
    service_type,
    pname,
    ldate_from,
    ldate_to,
  };
  try {
    // Send a POST request to the server to get lead source counting data
    const response = await Axios.post(
      `/lead-scheduling/get-lead-scheduler-details-by-form-name`, { data: data }
    );
    // Return the response from the server
    return response;
  } catch (err) {
    // Return an error object in case of failure
    return err;
  }
};

export const getLeadScheduleCityDetailsData = async (source, service_type, pname, ldate_from, ldate_to) => {
  let data = {
    source,
    service_type,
    pname,
    ldate_from,
    ldate_to
  };
  try {
    // Send a POST request to the server to get lead source counting data
    const response = await Axios.post(
      `/lead-scheduling/get-lead-scheduler-details-by-city-name`, { data: data }
    );
    // Return the response from the server
    return response;
  } catch (err) {
    // Return an error object in case of failure
    return err;
  }
};

export const getLeadScheduleLocalityDetailsData = async (source, service_type, pname, city, ldate_from, ldate_to) => {
  let data = {
    source,
    service_type,
    pname,
    city,
    ldate_from,
    ldate_to
  };
  try {
    // Send a POST request to the server to get lead source counting data
    const response = await Axios.post(
      `/lead-scheduling/get-lead-scheduler-details-by-locality-name`, { data: data }
    );
    // Return the response from the server
    return response;
  } catch (err) {
    // Return an error object in case of failure
    return err;
  }
};

export const getSchedularSearchDetails = async () => {
  try {
    // Send a POST request to the server to get lead source counting data
    const response = await Axios.get(
      `/lead-scheduling-advanced-search/get-search-lead-scheduler-details`
    );
    // Return the response from the server
    return response;
  } catch (err) {
    // Return an error object in case of failure
    return err;
  }
};

export const getLeadScheduleLocalityByCityData = async (cityName) => {
  try {
    // Send a POST request to the server to get lead source counting data
    const response = await Axios.get(
      `/lead-scheduling/get-lead-scheduler-locality-details?city=${cityName}`
    );
    // Return the response from the server
    return response;
  } catch (err) {
    // Return an error object in case of failure
    return err;
  }
};

const AddSchedulingLead = async (data) => {
  try {
    const DateTime = dayjs().format("YYYY-MM-DD HH:mm:ss");

    // Send a POST request to the server to get lead source counting data
    const response = await Axios.post(`/lead-scheduling/add-lead-scheduling`, {
      DateTime,
      data,
    });
    // Return the response from the server
    return response;
  } catch (err) {
    // Return an error object in case of failure
    return err;
  }
};

export const useAddSchedulingLead = () => {
  return useMutation(AddSchedulingLead);
};


const DeleteSelectedLeadSchedule = async (data) => {
  let lead_schedule_id = [];
  if (Array.isArray(data[0])) {
    lead_schedule_id = data[0].map((entry) => entry.lsche_id);
  } else {
    lead_schedule_id = data.map((entry) => entry.lsche_id);
  }
  try {
    // Send a POST request to the server to get lead source counting data
    const response = await Axios.post(`/lead-scheduling/delete-selected-lead-scheduling`, {
      lsche_id: lead_schedule_id,
    });
    // Return the response from the server
    return response;
  } catch (err) {
    // Return an error object in case of failure
    return err;
  }
};

export const useDeleteSelectedLeadSchedule = () => {
  return useMutation(DeleteSelectedLeadSchedule);
};
