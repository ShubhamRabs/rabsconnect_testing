// import dayjs from "dayjs";
// import Cookies from "js-cookie";

// export let AllCandidateColumn = [];

// if (Cookies.get("role") === "HR Head") {
//   AllCandidateColumn = [
//     {
//       Header: "Date",
//       accessor: "create_dt",
//       Cell: ({ value }) =>
//         value !== "0000-00-00 00:00:00"
//           ? dayjs(value).format("D MMM YYYY - hh:mm A")
//           : "Imported Candidate",
//       // Cell: ({ value }) => dayjs(value).format("D MMM YYYY - hh:mm A"),
//     },
//     {
//       Header: "Candidate Name",
//       accessor: "c_name",
//     },
//     {
//       Header: "Mobile Number",
//       accessor: "c_mob",
//     },
//     {
//       Header: "Alt Mobile Number",
//       accessor: "c_alt_mob",
//     },
//     {
//       Header: "Email Id",
//       accessor: "c_email",
//     },
//     {
//       Header: "Source",
//       accessor: "c_source",
//     },
//     {
//       Header: "Position",
//       accessor: "c_position",
//     },
//     {
//       Header: "Candidate Status",
//       accessor: "c_status",
//     },
//     {
//       Header: "Follow Up Date",
//       accessor: "followup_dt",
//       Cell: ({ value }) =>
//         value !== "0000-00-00 00:00:00"
//           ? dayjs(value).format("D MMM YYYY - hh:mm A")
//           : "",
//     },
//     {
//       Header: "Comments",
//       accessor: "comments",
//     },
//     {
//       Header: "City",
//       accessor: "city",
//     },
//     {
//       Header: "Locality",
//       accessor: "locality",
//     },
//     {
//       Header: "Assigned User",
//       accessor: "assign_to",
//       Cell: ({ value }) => (value !== 0 ? value : ""),
//     },
//   ];

//   if (Cookies.get("role").includes("HR Head")) {
//     AllCandidateColumn.push(...[]);
//   }
// } else {
//   AllCandidateColumn = [
//     {
//       Header: "Date",
//       accessor: "create_dt",
//       Cell: ({ value }) =>
//         value !== "0000-00-00 00:00:00"
//           ? dayjs(value).format("D MMM YYYY - hh:mm A")
//           : "Imported Candidate",
//     },
//     {
//       Header: "Candidate Name",
//       accessor: "c_name",
//     },
//     {
//       Header: "Mobile Number",
//       accessor: "c_mob",
//     },
//     {
//       Header: "Alt Mobile Number",
//       accessor: "c_alt_mob",
//     },
//     {
//       Header: "Email Id",
//       accessor: "c_email",
//     },
//     {
//       Header: "Source",
//       accessor: "c_source",
//     },
//     {
//       Header: "Position",
//       accessor: "c_position",
//     },
//     {
//       Header: "Candidate Status",
//       accessor: "c_status",
//     },
//     {
//       Header: "Follow Up Date",
//       accessor: "followup_dt",
//       Cell: ({ value }) =>
//         value !== "0000-00-00 00:00:00"
//           ? dayjs(value).format("D MMM YYYY - hh:mm A")
//           : "",
//     },
//     {
//       Header: "Comments",
//       accessor: "comments",
//     },
//     {
//       Header: "City",
//       accessor: "city",
//     },
//     {
//       Header: "Locality",
//       accessor: "locality",
//     },
//   ];
// }
import React, { useEffect, useState, useMemo, useRef } from 'react';
import dayjs from 'dayjs';
import Axios from '../../../setting/axios'; // Import Axios for API requests
import Cookies from 'js-cookie';

const AllCandidateColumn = () => {
  const allcandidatestaticColumns = [
    { Header: 'Candidate Status', accessor: 'c_status', visible: true },
              { Header: 'Source', accessor: 'c_source', visible: true },
              { Header: 'Date', accessor: 'create_dt', visible: true },
              { Header: 'Position', accessor: 'c_position', visible: true },
              { Header: 'Candidate Name', accessor: 'c_name', visible: true },
              { Header: 'Locality', accessor: 'locality', visible: true },
              { Header: 'Mobile Number', accessor: 'c_mob', visible: true },
              { Header: 'Alt Mobile Number', accessor: 'c_alt_mob', visible: true },
              { Header: 'Email Id', accessor: 'c_email', visible: true },
              { Header: 'Follow Up Date', accessor: 'followup_dt', visible: true },
              { Header: 'Comments', accessor: 'comments', visible: true },
              { Header: 'City', accessor: 'city', visible: true }
  ]
  const [columns, setColumns] = useState(allcandidatestaticColumns); // State to store dynamic columns
  const hasFetchedData = useRef(false); // Track if data has been fetched already

  // Fetch data only once when the component mounts
  useEffect(() => {
    if (!hasFetchedData.current) {
      const fetchData = async () => {
        try {
          const userId = Cookies.get("u_id");
          const response = await Axios.get("/hr" + userId); // Adjust the endpoint as needed
          console.log("API Response:", response.data[userId]);

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
                          : "Imported Candidate";
                      case 'c_mob':
                      case 'c_alt_mob':
                        return value
                          ? (value.toString().includes("+") ? value : "+" + value)
                          : "";
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
            setColumns(allcandidatestaticColumns); // Set columns to an empty array if format is unexpected
          }
        } catch (error) {
          console.error('Error fetching data:', error);
          setColumns(allcandidatestaticColumns); // Set columns to an empty array in case of error
        }
      };

      fetchData();
      hasFetchedData.current = true; // Mark data as fetched
    }
  }, []);

  // Determine the role
  const role = Cookies.get("role");

  // Memoize columns to optimize re-renders
  const adjustedColumns = useMemo(() => {
    console.log("Columns before role adjustment:", columns);

    if (!Array.isArray(columns)) {
      console.warn("Columns is not an array. Resetting to an empty array.");
      return [];
    }

    let updatedColumns = [...columns];

    // Filter columns based on visibility
    updatedColumns = updatedColumns.filter(col => col.visible);

    if (role === "HR Head") {
      // Add specific columns for the "HR Head" role
      updatedColumns.push({
        Header: "Assigned User",
        accessor: "assign_to",
        Cell: ({ value }) => (value !== 0 ? value : ""),
      });
    }

    console.log("Columns after role adjustment:", updatedColumns);
    return updatedColumns;
  }, [role, columns]); // Recalculate only when role or columns change

  return adjustedColumns; // Return the memoized columns directly
};

export default AllCandidateColumn;
