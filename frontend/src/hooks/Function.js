import { useQuery } from "react-query";
import React, { useEffect, useState } from "react";
import { useBootstrap } from "./Hooks";
import dayjs from "dayjs";
// import { getAttendanceStatus } from "./Attendance/UseAttendanceHook";
import {
  fetchAllUsers,
  getAttendancePolicy,
  getAttendanceStatus,
  getFilterUsersAttendance,
  useFilterAttendanceReport,
} from "./Attendance/UseAttendanceHook";
import { getAllUsers } from "./Users/useAllUsersHook";
import {
  GetProfileById,
  GetUserDetails,
  useProfileById,
} from "./Other/UseProfileHook";
let crm_countries = document.getElementById("crm_countries");

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

export const CreateLabelValueArray = (inputArray, Keyone, keytwo, keythree) => {
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
          label: row[keythree]
            ? row[Keyone] + " - " + row[keythree]
            : row[Keyone],
          value: keytwo ? row[keytwo] : row[Keyone],
        };

        // Push the transformed object to the transformedArray
        transformedArray.push(transformedObject);
      }
    });
  }
  // Return the transformed array
  return transformedArray;
}

// export const CreateLabelValueArray = (inputArray, Keyone, keytwo) => {
//   // Initialize an empty array to store the transformed data
//   const transformedArray = [];

//   // Check if inputArray is defined and is an array
//   if (Array.isArray(inputArray)) {
//     // Loop through the inputArray and transform each object
//     inputArray.forEach((row) => {
//       // Check if the row is an object and has the specified Keyone
//       if (row && row[Keyone] !== undefined) {
//         // Create a new object with label and value properties
//         const transformedObject = {
//           label: row[Keyone],
//           value: keytwo ? row[keytwo] : row[Keyone],
//         };

//         // Push the transformed object to the transformedArray
//         transformedArray.push(transformedObject);
//       }
//     });
//   }
//   // Return the transformed array
//   return transformedArray;
// };

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
  let startSeconds = Number(startSecond) + 1; // Assuming the startSeconds will be incremented by 1
  const startTimeInSeconds =
    Number(startHour) * 3600 + Number(startMinute) * 60 + Number(startSeconds);

  // const currentTime = new Date();
  // const currentTimeInSeconds =
  //   currentTime.getHours() * 3600 +
  //   currentTime.getMinutes() * 60 +
  //   currentTime.getSeconds();

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
        <Spinner
          animation="border"
          role="status"
          variant="secondary"
          size="sm"
          style={{ borderWidth: "0.15em" }}
        >
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

export const numberToWords = (num, currency) => {
  // console.log("click",currency);
  // console.log("crm_countries",crm_countries.value);
  if (currency === "" && crm_countries.value === "UAE") {
    currency = "AED";
  }
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

  if (currency === "AED") {
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
  } else {
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
  }
};

let dispatchDashboard;

export const setDispatchDashboard = (dispatch) => {
  dispatchDashboard = dispatch;
};

export const getDispatchDashboard = () => {
  return dispatchDashboard;
};

export const generateDateRange = (
  startDate,
  endDate,
  userId,
  usernames,
  AttendancePolicy,
  FilterData
) => {
  console.log("Data as per this one", startDate, endDate, userId);
  const start = new Date(startDate);
  const end = new Date(endDate);
  const range = [];
  let attendanceData = {
    totalDays: 0,
    fullDay: 0,
    halfDay: 0,
    failedToLogout: 0,
    absent: 0,
    lateMark: 0,
    weeklyOff: 0,
    workingDays: 0,
    workedDays: 0,
    no_of_holidays: 0,
  };
  let emptyItem = {
    auid: 0,
    desk_image_login: "",
    desk_image_logout: "",
    login_date: "",
    login_time: "",
    logout_date: "",
    logout_time: "",
    system_ip: "",
    u_id: userId,
    username: usernames[userId],
  };

  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let count = 1;
  let inTime = AttendancePolicy?.data?.data["Intime"]?.policy;
  let outTime = AttendancePolicy?.data?.data["Outtime"]?.policy;
  let lateMark = AttendancePolicy?.data?.data["Late Mark"]?.policy;
  let weeklyOffDays =
    AttendancePolicy?.data?.data["Weekly OFF"]?.policy?.split(",");
  let holidayArray =
    AttendancePolicy?.data?.data["Public Holidays"].policy?.split(",");
  if (lateMark && lateMark.includes(",")) {
    lateMark = lateMark.split(",");
  }
  let formatOutTimeString = "HH:mm:ss";
  let formatInTimeString = "HH:mm:ss";

  let parsedInTime = dayjs(`1970-01-01 ${inTime}`);
  let parsedOutTime = dayjs(`1970-01-01 ${outTime}`);

  let newInTime = parsedInTime.add(
    lateMark && lateMark.length > 0 ? lateMark[0] : 0,
    "minute"
  );
  let newOutTime = parsedOutTime.subtract(
    lateMark && lateMark.length > 0 ? lateMark[1] : 0,
    "minute"
  );

  let lateMarkInTime = newInTime.format(formatInTimeString);
  let lateMarkOutTime = newOutTime.format(formatOutTimeString);

  for (
    let date = new Date(start);
    date <= end;
    date.setDate(date.getDate() + 1)
  ) {
    const formattedDate = date.toISOString().slice(0, 10); // Get YYYY-MM-DD
    const formatdate = new Date(formattedDate);
    let day = daysOfWeek[formatdate.getDay()];
    let status = "";
    let TotalMinutes = 0;
    let totalDifference = 0;
    let totalDifferenceHours = 0;
    let TotalHours = 0;
    let statusColor = "#ed5565";
    let items =
      FilterData[formattedDate] && FilterData[formattedDate].length > 0
        ? FilterData[formattedDate]
        : [emptyItem];

    if (
      FilterData[formattedDate] &&
      FilterData[formattedDate].length > 0 &&
      FilterData[formattedDate]
    ) {
      items.forEach((element) => {
        const loginDate = new Date(
          `${element.login_date} ${element.login_time}`
        );
        const logoutDate = new Date(
          `${element.logout_date} ${element.logout_time}`
        );

        const toTime = loginDate.getTime();
        const fromTime = logoutDate.getTime();

        if (
          element.login_time !== "00:00:00" &&
          element.logout_time !== "00:00:00" &&
          element.login_time !== "" &&
          element.logout_time !== ""
        ) {
          const difference = Math.abs(fromTime - toTime) / (1000 * 60); // in minutes
          const differenceInMinutes = Math.abs(fromTime - toTime) / (1000 * 60);
          const differenceInHours = differenceInMinutes / 60; // converting minutes to hours

          totalDifferenceHours += differenceInHours;
          totalDifference += difference;
        }
      });
      TotalMinutes = totalDifference.toFixed(2);
      TotalHours = totalDifferenceHours.toFixed(2);
    }

    if (
      holidayArray.length > 0 &&
      holidayArray.includes(dayjs(formattedDate).format("MM/DD/YYYY")) &&
      AttendancePolicy?.data?.data["Public Holidays"]?.status === "ON"
    ) {
      status = "Holiday";
      statusColor = AttendancePolicy?.data?.data["Public Holidays"]?.color;
      attendanceData.no_of_holidays += 1;
    } else if (
      TotalMinutes === 0 &&
      items[items.length - 1].logout_time !== "00:00:00" &&
      AttendancePolicy?.data?.data["Absent"]?.status === "ON"
    ) {
      statusColor = AttendancePolicy?.data?.data["Absent"]?.color;
      if (!weeklyOffDays.includes(day)) {
        attendanceData.absent += 1;
      }
    } else if (
      items[0].login_time !== "00:00:00" &&
      items[items.length - 1].logout_time === "00:00:00" &&
      AttendancePolicy?.data?.data["Failed to Logout"]?.status === "ON"
    ) {
      if (
        weeklyOffDays.includes(day) &&
        AttendancePolicy?.data?.data["Weekly OFF"]?.status === "ON"
      ) {
        status = "Weekly OFF";
        statusColor = AttendancePolicy?.data?.data["Weekly OFF"]?.color;
      } else {
        status = "Failed to Logout";
        statusColor = AttendancePolicy?.data?.data["Failed to Logout"]?.color;
        attendanceData.failedToLogout += 1;
      }
    } else if (
      ((items[0].login_time > lateMarkInTime &&
        AttendancePolicy?.data?.data["Intime"]?.status === "ON") ||
        (items[items.length - 1].logout_time < lateMarkOutTime &&
          AttendancePolicy?.data?.data["Outtime"]?.status === "ON")) &&
      Number(TotalHours) >=
        Number(AttendancePolicy?.data?.data["Full Day"]?.policy) &&
      AttendancePolicy?.data?.data["Late Mark"]?.status === "ON"
    ) {
      if (
        weeklyOffDays.includes(day) &&
        AttendancePolicy?.data?.data["Weekly OFF"]?.status === "ON"
      ) {
        status = "Weekly OFF";
        statusColor = AttendancePolicy?.data?.data["Weekly OFF"]?.color;
      } else {
        status = "Late Mark";
        statusColor = AttendancePolicy?.data?.data["Late Mark"]?.color;
        attendanceData.lateMark += 1;
      }
    } else if (
      Number(TotalHours) >=
        Number(AttendancePolicy?.data?.data["Full Day"]?.policy) &&
      AttendancePolicy?.data?.data["Full Day"]?.status === "ON"
    ) {
      if (
        weeklyOffDays.includes(day) &&
        AttendancePolicy?.data?.data["Weekly OFF"]?.status === "ON"
      ) {
        status = "Weekly OFF";
        statusColor = AttendancePolicy?.data?.data["Weekly OFF"]?.color;
      } else {
        status = "Full Day";
        statusColor = AttendancePolicy?.data?.data["Full Day"]?.color;
        attendanceData.fullDay += 1;
      }
    } else if (
      TotalHours >= AttendancePolicy?.data?.data["Half Day"]?.policy &&
      AttendancePolicy?.data?.data["Half Day"]?.status === "ON"
    ) {
      if (
        weeklyOffDays.includes(day) &&
        AttendancePolicy?.data?.data["Weekly OFF"]?.status === "ON"
      ) {
        status = "Weekly OFF";
        statusColor = AttendancePolicy?.data?.data["Weekly OFF"]?.color;
      } else {
        status = "Half Day";
        statusColor = AttendancePolicy?.data?.data["Half Day"]?.color;
        attendanceData.halfDay += 1;
      }
    } else {
      status = "Absent";
      statusColor = AttendancePolicy?.data?.data["Absent"]?.color;
      if (!weeklyOffDays.includes(day)) {
        attendanceData.absent += 1;
      }
    }
    if (
      weeklyOffDays.includes(day) &&
      AttendancePolicy?.data?.data["Weekly OFF"]?.status === "ON"
    ) {
      attendanceData.weeklyOff += 1;
      if (TotalMinutes === 0) {
        TotalMinutes = "";
        TotalHours = "";
        status = "";
        statusColor = "#ed5565";
      }
    }
    range.push({
      date: formattedDate,
      Day: `${day}`,
      items,
      TotalMinutes,
      TotalHours,
      status,
      statusColor,
    });
    count++;
  }

  attendanceData.totalDays = count - 1;
  attendanceData.workingDays =
    count - attendanceData.weeklyOff - attendanceData.no_of_holidays - 1;
  attendanceData.workedDays =
    attendanceData.fullDay +
    attendanceData.halfDay +
    attendanceData.failedToLogout +
    attendanceData.lateMark;

  return attendanceData;
};

export const usePayslipAutoFillData = (month, year, user) => {
  const [usernames, setUserNames] = React.useState({});
  const [users, setUsers] = useState([]);
  const [filterData, setFilterData] = React.useState([]);
  const AllUsersAttendance = useQuery("AllUsersList", fetchAllUsers);
  const AttendancePolicy = useQuery("AttendancePolicy", getAttendancePolicy);
  const FilterAttendence = useFilterAttendanceReport();
  const AllUsers = useQuery(
    "allUserslist",
    () => {
      return getAllUsers();
    },
    {
      onSuccess: (data) => {
        setUsers(data.data);
      },
    }
  );
  const [overAllAttendenceData, setOverAllAttendenceData] = useState({});
  const [userDetails, setUserDetails] = useState({});
  const userDetail = useProfileById();

  useEffect(() => {
    console.log(user);
    userDetail.mutate(user, {
      onSuccess: (data) => {
        // console.log(data.data,"suer detui");
        setUserDetails(data.data);
        console.log(data.data, "data.data");
      },
      onError: (error) => {
        console.log("Error in fetching attendance report", error);
      },
    });
    console.log(userDetail, "userdetail");
    const handleFilterDataSubmit = (values) => {
      let allusernames = {};
      if (
        AllUsersAttendance.data?.data &&
        Object.keys(usernames).length === 0
      ) {
        AllUsersAttendance.data?.data?.forEach((user) => {
          allusernames[user.id] = user.username;
        });
      }

      FilterAttendence.mutate(values, {
        onSuccess: (data) => {
          // console.log("working");
          setUsers(data.data);
          console.log(data.data, "FilterData");
          const filteredData = data?.data?.map((row) => ({
            auid: row.auid,
            desk_image_login: row.desk_image_login,
            desk_image_logout: row.desk_image_logout,
            login_date: row.login_date,
            login_time: row.login_time,
            logout_date: row.logout_date,
            logout_time: row.logout_time,
            system_ip: row.system_ip,
            u_id: row.u_id,
            login_location: row.login_location,
            logout_location: row.logout_location,
            username: AllUsers.data?.data
              ? AllUsers.data?.data?.filter((user) => user.id === row.u_id)[0]
                  ?.username
              : row.u_id,
          }));
          setFilterData(groupBy(filteredData, "login_date"));
          // console.log(filterData, "FilterData in file");
          // console.log(user,"line 931");
          if (!year == "" && !month == "" && !user == "") {
            console.log("this condition is working");
            setOverAllAttendenceData(
              generateDateRange(
                `${year}-${month}-01`,
                `${year}-${month}-30`,
                user,
                allusernames,
                AttendancePolicy,
                filterData
              )
            );
          }
        },
        onError: (error) => {
          console.log("Error in fetching attendance report", error);
        },
      });
    };

    const dataFilter = {
      user,
      start_date: `${year}-${month}-01`,
      end_date: `${year}-${month}-30`,
    };
    console.log(dataFilter, "dataFilter in function");
    // console.log(dataFilter,"dataFilter in function");
    handleFilterDataSubmit(dataFilter);
  }, [
    AllUsersAttendance.data,
    AllUsers.data,
    AttendancePolicy.data,
    FilterAttendence.mutate,
    usernames,
    month,
    year,
    user,
  ]);

  // console.log(filterData,"filterdata in function");
  // console.log(overAllAttendenceData,"overAllAttendenceData in function");
  // console.log(users,"users in function");
  console.log("data as per ", month, " ", year, " ", user);
  return { overAllAttendenceData, userDetails };
};
