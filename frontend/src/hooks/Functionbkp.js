import { useQuery } from "react-query";
import React from "react";
import { useBootstrap } from "./Hooks";
import dayjs from "dayjs";
import { getAttendanceStatus } from "./Attendance/UseAttendanceHook";
let crm_countries = document.getElementById('crm_countries');

export const groupBy = (objectArray, property) => {
  return objectArray.reduce((acc, obj) => {
    const key = obj[property];
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(obj);
    return acc;
  }, {});
};

export const CreateLabelValueArray = (inputArray, Keyone, keytwo) => {
  // Initialize an empty array to store the transformed data
  const transformedArray = [];

  // Check if inputArray is defined and is an array
  if (Array.isArray(inputArray)) {
    // Loop through the inputArray and transform each object
    inputArray.forEach((row) => {
      // Check if the row is an object and has the specified Keyone
      if (row && row[Keyone] !== undefined) {
        // Create a new object with label and value properties
        const transformedObject = {
          label: row[Keyone],
          value: keytwo ? row[keytwo] : row[Keyone],
        };

        // Push the transformed object to the transformedArray
        transformedArray.push(transformedObject);
      }
    });
  }
  // Return the transformed array
  return transformedArray;
};

export const useLeadData = (
  queryKey,
  fetchDataFunction,
  fetchDataCountFunction
) => {
  const { Card } = useBootstrap();
  const [page, setPage] = React.useState(1); // Initialize 'page' here
  const [pageSize, setPageSize] = React.useState(10);
  const [selectedRows, setSelectedRows] = React.useState([]);

  const data = useQuery(queryKey, () => fetchDataFunction(page, pageSize));
  const count = useQuery(`${queryKey}Count`, fetchDataCountFunction);

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handlePageSizeChange = (newSize) => {
    setPageSize(newSize);
  };

  const handleSelectedRows = (rowId) => {
    if (rowId !== null) {
      setSelectedRows((prevSelectedRows) => {
        const isSelected = prevSelectedRows.includes(rowId);
        if (isSelected) {
          return prevSelectedRows.filter((id) => id !== rowId);
        } else {
          return [...prevSelectedRows, rowId];
        }
      });
    }
  };

  return {
    Card,
    page,
    pageSize,
    selectedRows,
    data,
    count,
    handlePageChange,
    handlePageSizeChange,
    handleSelectedRows,
  };
};
export const extractRecordsValue = (inputString) => {
  // Ensure inputString is a valid string
  if (typeof inputString !== "string") {
    console.error("Invalid input: inputString should be a string");
    return 0;
  }

  // Use a regular expression to match the pattern
  const recordsMatch = inputString.match(/\(Records: (\d+) /);

  // Check if a match is found and has the expected structure
  if (recordsMatch && recordsMatch.length === 2) {
    return parseInt(recordsMatch[1], 10);
  } else {
    console.error("Invalid match structure or no match found");
    // Return a default value or handle the case where "Records" is not found.
    return 0;
  }
};

export const CombineTwoArrays = (databaseArray, staticArray) => {
  const combinedData = {};

  // Start by populating combinedData with data from staticArray
  for (const item of staticArray) {
    combinedData[item.source] = {
      source: item.source,
      lead_count: item.lead_count,
      ...(combinedData[item.source] || {}),
      ...item,
    };
  }

  // Update combinedData with data from databaseArray
  for (const item of databaseArray) {
    combinedData[item.source] = {
      source: item.source,
      lead_count: item.lead_count,
      ...(combinedData[item.source] || {}),
      ...item,
    };
  }

  const combinedArray = Object.values(combinedData);

  return combinedArray;
};

// export const ConvertTimeIntoMin = (startTime, endTime) => {
//   // Convert time strings to time values
//   const [startHour, startMinute, startSecond] = startTime
//     .split(":")
//     .map(Number);
//   const [endHour, endMinute, endSecond] = endTime.split(":").map(Number);

//   // Calculate the time difference in minutes
//   const startTimeInMinutes = startHour * 60 + startMinute;
//   const endTimeInMinutes = endHour * 60 + endMinute;
//   const timeDifferenceInMinutes = endTimeInMinutes - startTimeInMinutes;
//   const timeDifferenceInSeconds = endTimeInMinutes - startTimeInMinutes;

//   return timeDifferenceInMinutes;
// };

// export const AttendanceTiming = ({ InTime }) => {
//   const [OutTime, setOutTime] = React.useState(dayjs().format("HH:mm:ss"));

//   var Time;

//   if (InTime === undefined) {
//     Time = "00:00:00";
//   } else {
//     Time = InTime;
//   }

//   // var InTime = AttendanceStatus[0]?.login_time;
//   var TotalTimeInTime = ConvertTimeIntoMin(Time, OutTime);

//   React.useEffect(() => {
//     const interval = setInterval(() => {
//       setOutTime(dayjs().format("HH:mm:ss"));
//     }, 1000); // Set the interval to 1000ms (1 second)
//     // Clean up the interval when the component is unmounted
//     return () => clearInterval(interval);
//   }, []);

//   return "Today's Min : " + TotalTimeInTime;
// };

export const CalculateTimeIntoMinAndSec = (startTime, endTime) => {
  const [startHour, startMinute, startSecond] = startTime
    .split(":")
    .map(Number);
  const [endHour, endMinute, endSecond] = endTime.split(":").map(Number);

  const startTimeInSeconds = startHour * 3600 + startMinute * 60 + startSecond;
  const endTimeInSeconds = endHour * 3600 + endMinute * 60 + endSecond;
  const timeDifferenceInSeconds = startTimeInSeconds;

  let hour = Math.floor(timeDifferenceInSeconds / 3600);
  const remainingSeconds = timeDifferenceInSeconds % 3600;
  let minutes = Math.floor(remainingSeconds / 60);
  let seconds = remainingSeconds % 60;

  if (hour / 10 < 1) {
    hour = "0" + hour;
  }

  if (minutes / 10 < 1) {
    minutes = "0" + minutes;
  }

  if (seconds / 10 < 1) {
    seconds = "0" + seconds;
  }

  return { hour, minutes, seconds };
};

export const CalculateOnGoingTimeIntoMinAndSec = (startTime, endTime) => {
  const {
    hour: startHour,
    minutes: startMinute,
    seconds: startSecond,
  } = startTime;
  let startSeconds = startSecond + 1; // Assuming the startSeconds will be incremented by 1
  const startTimeInSeconds =
    Number(startHour) * 3600 + Number(startMinute) * 60 + Number(startSeconds);

  const currentTime = new Date();
  const currentTimeInSeconds =
    currentTime.getHours() * 3600 +
    currentTime.getMinutes() * 60 +
    currentTime.getSeconds();

  const timeDifferenceInSeconds = startTimeInSeconds;

  let hour = Math.floor(timeDifferenceInSeconds / 3600);
  const remainingSeconds = timeDifferenceInSeconds % 3600;
  let minutes = Math.floor(remainingSeconds / 60);
  let seconds = remainingSeconds % 60;

  if (hour / 10 < 1) {
    hour = "0" + hour;
  }

  if (minutes / 10 < 1) {
    minutes = "0" + minutes;
  }

  if (seconds / 10 < 1) {
    seconds = "0" + seconds;
  }

  return { hour, minutes, seconds };
};

export const AttendanceTiming = React.memo(({ InTime }) => {
  const [OutTime, setOutTime] = React.useState(dayjs().format("HH:mm:ss"));
  // const initialTime = CalculateTimeIntoMinAndSec(InTime, OutTime);
  const [TotalTime, setTotalTime] = React.useState({
    hour: 0,
    minutes: 0,
    seconds: 0,
  });

  const { Spinner } = useBootstrap();

  React.useEffect(() => {
    const interval = setInterval(() => {
      if (TotalTime.minutes > 0 || TotalTime.seconds > 0) {
        const { hour, minutes, seconds } = CalculateOnGoingTimeIntoMinAndSec(
          TotalTime,
          OutTime
        );
        setTotalTime({ hour, minutes, seconds });
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [InTime, OutTime, TotalTime]);

  // React.useEffect(() => {
  //   if (
  //     InTime !== undefined &&
  //     TotalTime.minutes === 0 &&
  //     TotalTime.seconds === 0
  //   ) {
  //     const { minutes, seconds } = CalculateTimeIntoMinAndSec(InTime, OutTime);
  //     setTotalTime({ minutes, seconds });
  //   }
  // }, [InTime, OutTime]); // Only recompute TotalTime if InTime or OutTime changes

  React.useEffect(() => {
    getAttendanceStatus()
      .then((response) => {
        if (response.status === 200) {
          // setAttendanceStatus(response.data);
          if (Array.isArray(response.data)) {
            const { hour, minutes, seconds } = CalculateTimeIntoMinAndSec(
              response.data[0].totalTime,
              OutTime
            );
            setTotalTime({ hour, minutes, seconds });
          }
          // setShowTiming(Array.isArray(response.data));
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  // if (InTime === undefined) {
  //   console.log("loading");
  //   return null;
  // }

  if (
    TotalTime.hour === 0 &&
    TotalTime.minutes === 0 &&
    TotalTime.seconds === 0
  ) {
    return (
      <>
        Today's Time: &nbsp;
        <Spinner animation="border" role="status" variant="secondary" size="sm" style={{borderWidth: "0.15em"}}>
          {/* <span>Loading ...</span> */}
        </Spinner>
      </>
    );
  }

  return (
    <>
      Today's Time: {TotalTime.hour} : {TotalTime.minutes} : {TotalTime.seconds}
    </>
  );
});

export const CustomDownload = (data, FileName) => {
  fetch(data).then((response) => {
    response.blob().then((blob) => {
      const fileURL = window.URL.createObjectURL(blob);
      let alink = document.createElement("a");
      alink.href = fileURL;
      alink.download = FileName;
      alink.click();
    });
  });
};

function stringToColor(string) {
  let hash = 0;
  let i;

  if (string) {
    /* eslint-disable no-bitwise */
    for (i = 0; i < string.length; i += 1) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }
  } else {
    hash = "000000";
  }

  let color = "#";

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2) + "";
  }
  /* eslint-enable no-bitwise */

  return color;
}

export const stringAvatar = (name) => {
  const initials = name
    .split(" ")
    .filter((part) => part) // Remove empty parts (in case of multiple spaces)
    .map((part) => part[0])
    .join("")
    .toUpperCase(); // Convert to uppercase for consistency

  let letter = initials[1] ? initials[0] + initials[1] : initials[0];

  return {
    sx: {
      bgcolor: stringToColor(name),
    },
    children: letter,
  };
};


export const numberToWords = (num) => {
  const units = [
    "",
    "One",
    "Two",
    "Three",
    "Four",
    "Five",
    "Six",
    "Seven",
    "Eight",
    "Nine",
  ];
  const teens = [
    "Ten",
    "Eleven",
    "Twelve",
    "Thirteen",
    "Fourteen",
    "Fifteen",
    "Sixteen",
    "Seventeen",
    "Eighteen",
    "Nineteen",
  ];
  const tens = [
    "",
    "Ten",
    "Twenty",
    "Thirty",
    "Forty",
    "Fifty",
    "Sixty",
    "Seventy",
    "Eighty",
    "Ninety",
  ];

  const convertBelowThousand = (num) => {
    let result = "";
    if (num >= 100) {
      result += units[Math.floor(num / 100)] + " Hundred ";
      num %= 100;
    }

    if (num !== 0) {
      if (result !== "") result += "and ";
      if (num < 10) result += units[num];
      else if (num < 20) result += teens[num - 10];
      else
        result +=
          tens[Math.floor(num / 10)] +
          (num % 10 !== 0 ? " " + units[num % 10] : "");
    }

    return result;
  };

  if (num === 0) return "Zero";

  if(crm_countries.value.includes('India')){

    const crore = Math.floor(num / 10000000);
    const lakh = Math.floor((num % 10000000) / 100000);
    const thousand = Math.floor((num % 100000) / 1000);
    const belowThousand = num % 1000;
  
    let result = "";
  
    if (crore) result += convertBelowThousand(crore) + " Crore ";
    if (lakh) result += convertBelowThousand(lakh) + " Lakh ";
    if (thousand) result += convertBelowThousand(thousand) + " Thousand ";
  
    // Handle the case where the last part is in the tens or units
    if (belowThousand) {
      if (thousand) result += "and ";
      result += convertBelowThousand(belowThousand);
    }
  
    return result.trim();

  }else{  

    const billion = Math.floor(num / 1000000000);
    const million = Math.floor((num % 1000000000) / 1000000);
    const thousand = Math.floor((num % 1000000) / 1000);
    const belowThousand = num % 1000;

    let result = "";

    if (billion) {
      result += convertBelowThousand(billion) + " Billion ";
    }
    if (million) {
      result += convertBelowThousand(million) + " Million ";
    }
    if (thousand) {
      result += convertBelowThousand(thousand) + " Thousand ";
    }
    if (belowThousand) {
      result += convertBelowThousand(belowThousand);
    }

    return result.trim();

  }  

};


let dispatchDashboard;

export const setDispatchDashboard = (dispatch) => {
  dispatchDashboard = dispatch;
};

export const getDispatchDashboard = () => {
  return dispatchDashboard;
};