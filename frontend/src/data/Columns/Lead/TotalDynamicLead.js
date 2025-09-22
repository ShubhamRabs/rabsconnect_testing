import React, { useEffect, useState } from 'react';
import axios from '../../../setting/axios'; // Adjust the import path as needed
import dayjs from 'dayjs';
import { useTable } from 'react-table'; // Adjust based on your table library
import { Spinner } from 'react-bootstrap'; // Optional, for loading indicator

const TotalDynamicLeads = () => {
  const API_URL = 'http://localhost:3003/items'; // Correct API URL
  const [data, setData] = useState([]); // State to store fetched data
  const [columns, setColumns] = useState([]); // State to store dynamic columns
  const [loading, setLoading] = useState(true); // Loading state

  // Function to fetch data from the server using Axios
  const getData = async () => {
    try {
      const response = await axios.get(API_URL);

      console.log("Response Dynamic:", response.data.headers);

      // Dynamically generate columns based on the response headers
      const generatedColumns = response.data.headers.map((header) => ({
        Header: header.header,
        accessor: header.accessor,
        Cell: (cellProps) => {
          // Custom Cell rendering based on accessor
          switch (header.accessor) {
            case 'create_dt':
              return cellProps.value !== "0000-00-00 00:00:00"
                ? dayjs(cellProps.value).format("D MMM YYYY - hh:mm A")
                : "Imported Data";
            case 'mobile':
            case 's_mob':
              return cellProps.value
                ? (cellProps.value.toString().includes("+") ? cellProps.value : "+" + cellProps.value)
                : "";
            case 'latest_status':
              return cellProps.value && (
                <>
                  <span
                    style={{
                      backgroundColor: cellProps.row.original.latest_status_color,
                      color: "white",
                      fontSize: "0.8rem",
                      padding: "0.2rem 0.5rem",
                    }}
                  >
                    {cellProps.value}
                  </span>
                  {" by " + cellProps.row.original.latest_username}
                </>
              );
            case 'followup_dt':
              return cellProps.value !== "0000-00-00 00:00:00"
                ? dayjs(cellProps.value).format("D MMM YYYY - hh:mm A")
                : "";
            default:
              return cellProps.value;
          }
        },
      }));

      setColumns(generatedColumns); // Set dynamic columns
      setData(response.data.data); // Set fetched data
      setLoading(false); // Stop loading spinner
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false); // Stop loading on error
    }
  };

  // useEffect to run the fetch function on component mount
  useEffect(() => {
    getData();
  }, []);

  // Using react-table to create a table instance
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({
    columns,
    data,
  });

  // Render the component
  return (
    <div>
      {loading ? (
        <Spinner animation="border" />
      ) : (
        <table {...getTableProps()} className="table table-bordered">
          <thead>
            {headerGroups.map(headerGroup => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map(column => (
                  <th {...column.getHeaderProps()}>{column.render('Header')}</th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {rows.map(row => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map(cell => (
                    <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default TotalDynamicLeads;
