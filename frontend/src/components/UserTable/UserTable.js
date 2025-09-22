import React from 'react';

const UserTable = ({ data }) => {
    console.log('Data:', data);

    return (
      <table>
        <thead>
          <tr>
            <th>Auid</th>
            <th>Desk Image Login</th>
            <th>Desk Image Logout</th>
            <th>Login Date</th>
            <th>Login Time</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(data).map(([date, items]) => {
            console.log(`Date: ${date}, Items:`, items);
  
            if (Array.isArray(items)) {
              return items.map((item, index) => (
                <tr key={index}>
                  <td>{item.auid}</td>
                  <td>{item.desk_image_login}</td>
                  <td>{item.desk_image_logout}</td>
                  <td>{item.login_date}</td>
                  <td>{item.login_time}</td>
                </tr>
              ));
            } else {
              console.error(`Items for date ${date} is not an array. Wrapping in an array.`);
              return (
                <tr key={date}>
                  <td>{items.auid}</td>
                  <td>{items.desk_image_login}</td>
                  <td>{items.desk_image_logout}</td>
                  <td>{items.login_date}</td>
                  <td>{items.login_time}</td>
                </tr>
              );
            }
          })}
        </tbody>
      </table>
    );
  };

export default UserTable;
