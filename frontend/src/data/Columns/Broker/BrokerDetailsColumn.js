
import React, { useEffect, useState, useRef } from 'react';
import Axios from '../../../setting/axios'; 
import dayjs from 'dayjs';
import Cookies from "js-cookie";

const BrokerDetailsColumn = () => {
  const brokerStaticColumn = [
    { Header: "Brk_Id", accessor: "brk_id", visible: true },
    { Header: "No. of leads", accessor: "totalCount", visible: true },
    { Header: "Status", accessor: "status", visible: true },
    { Header: "Broker Name", accessor: "name", visible: true },
    { Header: "Mobile Number", accessor: "mobile", visible: true },
    { Header: "Date", accessor: "create_dt", visible: true },
    { Header: "Posted By", accessor: "createdby", visible: true },
    { Header: "Company Name", accessor: "company", visible: true },
    { Header: "RERA No.", accessor: "rera_no", visible: true },
    { Header: "Location", accessor: "brk_location", visible: true },
    { Header: "Remark", accessor: "remark", visible: true },
    { Header: "Address", accessor: "address", visible: true },
  ]
  const [columns, setColumns] = useState(brokerStaticColumn); // State to store dynamic columns
  const hasFetchedData = useRef(false); // Track if data has been fetched already

  useEffect(() => {
    if (!hasFetchedData.current) {
      const fetchData = async () => {
        try {
          const userId = Cookies.get("u_id");
          const response = await Axios.get("/br" + userId);
          
          console.log("API Response:", response);

          // Check if response data and the required userId exist
          if (response.data && response.data[userId] && response.data.master) {
            const visibleHeaders = response.data[userId].visible; // Get visible headers for the userId
            const masterHeaders = response.data.master; // Get all headers from the master section

            // Sort master headers based on the order in visibleHeaders
            const sortedVisibleColumns = visibleHeaders.map(accessor => {
              const header = masterHeaders.find(header => header.accessor === accessor);
              if (header) {
                return {
                  Header: header.header,
                  accessor: header.accessor,
                  visible: true, // All columns here are visible
                  Cell: ({ value, row }) => {
                    switch (header.accessor) {
                      case 'create_dt':
                        return value && value !== "0000-00-00 00:00:00"
                          ? dayjs(value).format("D MMM YYYY - hh:mm A")
                          : "Imported Data";
                      case 'mobile':
                      case 's_mob':
                        return value
                          ? (value.toString().includes("+") ? value : "+" + value)
                          : "";
                      case 'latest_status':
                        return value && row.original ? (
                          <>
                            <span
                              style={{
                                backgroundColor: row.original.latest_status_color,
                                color: "white",
                                fontSize: "0.8rem",
                                padding: "0.2rem 0.5rem",
                              }}
                            >
                              {value}
                            </span>
                            {" by " + (row.original.latest_username || '')}
                          </>
                        ) : '';
                      case 'followup_dt':
                        return value && value !== "0000-00-00 00:00:00"
                          ? dayjs(value).format("D MMM YYYY - hh:mm A")
                          : "";
                      default:
                        return value;
                    }
                  },
                };
              }
              return null;
            }).filter(header => header !== null); // Filter out any null headers

            setColumns(sortedVisibleColumns); // Set state to sorted visible columns
          } else {
            console.error('Unexpected response format or headers missing:', response.data);
            setColumns(brokerStaticColumn); // Set columns to an empty array if format is unexpected
          }
        } catch (error) {
          console.error('Error fetching data:', error);
          setColumns(brokerStaticColumn); // Set columns to an empty array in case of error
        }
      };

      fetchData();
      hasFetchedData.current = true; // Mark data as fetched
    }
  }, []);

  // Return the columns directly
  return columns;
};

export default BrokerDetailsColumn;
