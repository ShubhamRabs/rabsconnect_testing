// Importing necessary dependencies and components from React and other files
import React from "react";
import dayjs from "dayjs";
import Cookies from "js-cookie";
import { useQuery } from "react-query";
import { Formik, Form } from "formik";

import Breadcrumb from "../../components/Breadcrumb/Breadcrumb";
import UserAttendanceLocation from "../../components/Attendance/UserAttendanceLocation";
import { useBootstrap, useMui } from "../../hooks/Hooks";
import {
  getAttendancePolicy,
  useFilterAttendanceReport,
  fetchAllUsers,
  useAddEditAttendance,
  useDeleteAttendance,
} from "../../hooks/Attendance/UseAttendanceHook";
import {
  CustomFormGroup,
  CustomInputField,
  CustomMultipleSelectField,
} from "../../components/FormUtility/FormUtility";
import CustomDataTable from "../../components/CustomDataTable/CustomDataTable";
import { CreateLabelValueArray, groupBy } from "../../hooks/Function";
import {
  CustomModal,
  DeleteModal,
} from "../../components/CustomModal/CustomModal";
import {
  AddEditAttendanceSchema,
  UserAttendanceSchema,
} from "../../schema/Attendance/UserAttendanceSchema";
import MapComponent from "../../Handler/MapComponent";

function convertToAMPMFormat(timeString) {
  const dummyDate = new Date(`2000-01-01 ${timeString}`);
  return dummyDate.toLocaleTimeString([], { hour12: true });
}

// React functional component named UserAttendance
const UserAttendance = ({ dispatch, myglobalData }) => {
  // Destructuring utility functions and components from custom hooks and libraries
  const { Card, Row, Col, Tabs, Tab, Spinner } = useBootstrap();
  const {
    LoadingButton,
    Alert,
    Typography,
    ImageIcon,
    DomainVerificationIcon,
    IconButton,
    EditIcon,
    AddIcon,
    NotListedLocationOutlinedIcon,
    DeleteOutlineRoundedIcon,
  } = useMui();

  // State variables for managing form values, filter data, status, pagination, and selected rows
  const [FilterData, setFilterData] = React.useState([]);
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(50);

  const [selectedImage, setSelectedImage] = React.useState(null);
  const [showModal, setShowModal] = React.useState({
    type: "image",
    show: false,
    login_time: "",
    logout_time: "",
    auid: "",
    login_date: "",
    latitude: "",
    longitude: "",
  });
  const [showDeleteModal, setShowDeleteModal] = React.useState({
    show: false,
    auid: "",
  });
  const [showSuccessMessage, setShowSuccessMessage] = React.useState(null);

  const [SelectedTabUser, setSelectedTabUser] = React.useState("");
  const [selectedDate, setSelectedDate] = React.useState({
    datefrom: "",
    dateto: "",
  });
  const [SelectedUser, setSelectedUser] = React.useState([]);
  const [usernames, setUserNames] = React.useState({});
  const [dateRange, setDateRange] = React.useState([]);
  const [slicedPaginationData, setSlicedPaginatonData] = React.useState([]);
  // const [holidays, setHolidays] = React.useState([]);
  const [attendanceData, setAttendanceData] = React.useState({
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
  });

  // Initial form values for formik
  const initialValues = {
    user: [],
    start_date: "",
    end_date: "",
  };

  // Custom hook for handling filter calling report data
  const { mutate, isLoading } = useFilterAttendanceReport();
  const { mutate: addEditMutate, isLoading: addEditIsLoading } =
    useAddEditAttendance();
  const { mutate: DeleteMutate, isLoading: DeleteisLoading } =
    useDeleteAttendance();

  // State variable for resetting the form
  const [ResetForm, setResetForm] = React.useState(false);
  const [customIsLoading, setCustomIsLoading] = React.useState(false);

  // Query for fetching all users list
  const AllUsers = useQuery("AllUsersList", fetchAllUsers);
  const AttendancePolicy = useQuery("AttendancePolicy", getAttendancePolicy);

  const generateDateRange = (startDate, endDate, userId) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const range = [];
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
      login_location: "",
      logout_location: "",
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

    const simplifiedHolidayArray = holidayArray?.map(
      (holiday) => holiday.split(":")[0]
    );

    for (let date = start; date <= end; date.setDate(date.getDate() + 1)) {
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
            const differenceInMinutes =
              Math.abs(fromTime - toTime) / (1000 * 60);
            const differenceInHours = differenceInMinutes / 60; // converting minutes to hours

            totalDifferenceHours += differenceInHours;
            totalDifference += difference;
          }
        });
        TotalMinutes = totalDifference.toFixed(2);
        TotalHours = totalDifferenceHours.toFixed(2);
      }
      // if (holidays instanceof Set && holidays.has(dayjs(formattedDate).format("MM/DD/YYYY")) && AttendancePolicy?.data?.data["Public Holidays"]?.status === "ON") {
      //   status = "Holiday";
      //   statusColor = AttendancePolicy?.data?.data["Public Holidays"]?.color;
      //   setAttendanceData((prevState) => ({
      //     ...prevState,
      //     no_of_holidays: prevState.no_of_holidays + 1,
      //   }));
      // }
      if (
        holidayArray.length > 0 &&
        simplifiedHolidayArray.includes(
          dayjs(formattedDate).format("MM/DD/YYYY")
        ) &&
        AttendancePolicy?.data?.data["Public Holidays"]?.status === "ON"
      ) {
        // status = "Holiday";
        status =
          holidayArray[
            simplifiedHolidayArray.indexOf(
              dayjs(formattedDate).format("MM/DD/YYYY")
            )
          ].split(":")[1];
        statusColor = AttendancePolicy?.data?.data["Public Holidays"]?.color;
        setAttendanceData((prevState) => ({
          ...prevState,
          no_of_holidays: prevState.no_of_holidays + 1,
        }));
      } else if (
        TotalMinutes === 0 &&
        items[items.length - 1].logout_time !== "00:00:00" &&
        AttendancePolicy?.data?.data["Absent"]?.status === "ON"
      ) {
        status = "Absent";
        statusColor = AttendancePolicy?.data?.data["Absent"]?.color;
        if (!weeklyOffDays.includes(day)) {
          setAttendanceData((prevState) => ({
            ...prevState,
            absent: prevState.absent + 1,
          }));
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
          setAttendanceData((prevState) => ({
            ...prevState,
            failedToLogout: prevState.failedToLogout + 1,
          }));
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
          setAttendanceData((prevState) => ({
            ...prevState,
            lateMark: prevState.lateMark + 1,
          }));
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
          setAttendanceData((prevState) => ({
            ...prevState,
            fullDay: prevState.fullDay + 1,
          }));
        }
      } else if (
        Number(TotalHours) >=
          Number(AttendancePolicy?.data?.data["Half Day"]?.policy) &&
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
          setAttendanceData((prevState) => ({
            ...prevState,
            halfDay: prevState.halfDay + 1,
          }));
        }
      } else {
        status = "Absent";
        statusColor = AttendancePolicy?.data?.data["Absent"]?.color;
        if (!weeklyOffDays.includes(day)) {
          setAttendanceData((prevState) => ({
            ...prevState,
            absent: prevState.absent + 1,
          }));
        }
      }
      if (
        weeklyOffDays.includes(day) &&
        AttendancePolicy?.data?.data["Weekly OFF"]?.status === "ON"
      ) {
        status = "Weekly OFF";
        statusColor = AttendancePolicy?.data?.data["Weekly OFF"]?.color;
        setAttendanceData((prevState) => ({
          ...prevState,
          weeklyOff: prevState.weeklyOff + 1,
        }));
        if (TotalMinutes === 0) {
          TotalMinutes = "";
          TotalHours = "";
          // status = "";
          // statusColor = "#ed5565";
        }
      }
      range.push({
        date: dayjs(formattedDate).format("DD-MM-YYYY"),
        Day: `${day}`,
        items,
        TotalMinutes,
        TotalHours,
        status,
        statusColor,
      });
      count++;
    }
    setAttendanceData((prevState) => ({
      ...prevState,
      totalDays: count - 1,
      workingDays: count - prevState.weeklyOff - prevState.no_of_holidays - 1,
      workedDays:
        prevState.fullDay +
        prevState.halfDay +
        prevState.failedToLogout +
        prevState.lateMark,
    }));
    return range;
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handlePageSizeChange = (newSize) => {
    setPageSize(newSize);
  };

  const handleMutate = (Values) => {
    mutate(Values, {
      onSuccess: (data) => {
        if (data.data && data.data === "Need to Add Do Intime") {
          setFilterData([]);
        } else {
          setFilterData(
            groupBy(
              data?.data?.map((row) => ({
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
                  ? AllUsers.data?.data?.filter(
                      (user) => user.id === row.u_id
                    )[0]?.username
                  : row.u_id,
              })),
              "login_date"
            )
          );
        }
      },
    });
  };

  // Function to handle form submission
  const HandleSubmit = (values) => {
    let allusernames = {};
    if (AllUsers.data?.data && Object.keys(usernames).length === 0) {
      AllUsers.data?.data?.forEach((user) => {
        allusernames[user.id] = user.username;
      });
    }
    let formValues = { ...values, user: values.user[0] };
    mutate(formValues, {
      onSuccess: (data) => {
        setSelectedUser(values.user);
        if (Object.keys(allusernames).length !== 0) {
          setUserNames(allusernames);
        }
        // if (AttendancePolicy && AttendancePolicy.isSuccess && AttendancePolicy.data) {
        //   let holidaySet = new Set();
        //   let holidayData = AttendancePolicy.data.data["Public Holidays"].policy.split(",");
        //   holidayData.forEach((holiday) => {
        //     holidaySet.add(holiday);
        //   })
        //   setHolidays(holidaySet);
        // }
        setPage(1);
        setSelectedTabUser(values.user[0]);
        setSelectedDate({
          datefrom: values.start_date,
          dateto: values.end_date,
        });
        if (data.data && data.data === "Need to Add Do Intime") {
          setFilterData([]);
        } else {
          setFilterData(
            groupBy(
              data?.data?.map((row) => ({
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
                  ? AllUsers.data?.data?.filter(
                      (user) => user.id === row.u_id
                    )[0]?.username
                  : row.u_id,
              })),
              "login_date"
            )
          );
        }
      },
    });
  };

  const HandleEditAddSubmit = (values) => {
    console.log(values, "VALUESDKJLJDKDJLJLJDLK");
    let Values = {
      ...values,
      type: showModal.type,
      u_id: SelectedTabUser,
      login_date: showModal.login_date,
    };
    let mutateValues = {
      user: SelectedTabUser,
      start_date: selectedDate.datefrom,
      end_date: selectedDate.dateto,
    };
    addEditMutate(Values, {
      onSuccess: (data) => {
        handleMutate(mutateValues);
        setShowModal({
          type: "image",
          show: false,
          login_time: "",
          logout_time: "",
          auid: "",
          login_date: "",
        });
        setShowSuccessMessage(data.data);
        setTimeout(() => {
          setShowSuccessMessage(null);
        }, 3000);
      },
    });
  };

  React.useEffect(() => {
    setCustomIsLoading(true);
    setAttendanceData({
      fullDay: 0,
      halfDay: 0,
      failedToLogout: 0,
      absent: 0,
      lateMark: 0,
      weeklyOff: 0,
      workingDays: 0,
      workedDays: 0,
      no_of_holidays: 0,
    });
    setDateRange(
      generateDateRange(
        selectedDate.datefrom,
        selectedDate.dateto,
        SelectedTabUser
      )
    );
    const interval = setInterval(() => {
      setCustomIsLoading(false);
    }, 1000);
    return () => clearInterval(interval);
  }, [FilterData, SelectedTabUser]);

  React.useEffect(() => {
    if (dateRange.length > 0) {
      setCustomIsLoading(true);
      let slicedPaginationData = dateRange.slice(0, pageSize);
      if (dateRange.length > pageSize) {
        slicedPaginationData = dateRange.slice(
          (page - 1) * pageSize,
          page * pageSize
        );
      }
      setSlicedPaginatonData(slicedPaginationData);
    }
    const interval = setInterval(() => {
      setCustomIsLoading(false);
    }, 1000);
    return () => clearInterval(interval);
  }, [dateRange, page, pageSize, FilterData]);

  const columns = [
    {
      Header: "Date",
      accessor: "date", // Assuming login_date is a string in 'YYYY-MM-DD' format
      Cell: ({ value }) => {
        return `${value}`;
      },
    },
    {
      Header: "Day",
      accessor: "Day",
    },
    {
      Header: "System IP",
      // accessor: "items", // Assuming login_date is a string in 'YYYY-MM-DD' format
      Cell: ({ value, row }) => {
        let items = row.original.items[0].system_ip;
        return items;
      },
    },
    {
      Header: "Login Time",
      // accessor: "login_time",
      Cell: ({ value, row }) => {
        if (
          row.original.items.length === 1 &&
          row.original.items[0].login_time === ""
        ) {
          if (Cookies.get("role") === "Master") {
            return (
              <IconButton
                sx={{ padding: "0px 8px" }}
                onClick={() =>
                  setShowModal({
                    type: "Add",
                    show: true,
                    login_time: "00:00:00",
                    logout_time: "00:00:00",
                    auid: 0,
                    login_date: row.original.date,
                  })
                }
              >
                <AddIcon sx={{ fontSize: "16px" }} />
              </IconButton>
            );
          } else {
            return "";
          }
        }
        return row.original.items.map((item, index) => {
          return (
            <p
              key={index}
              className="d-flex justify-content-evenly align-items-center"
              style={{ borderBottom: "ridge 1px #dddddd" }}
            >
              <span
                style={{
                  fontSize: "12px",
                  textAlign: "center",
                  padding: "2px",
                }}
              >
                {convertToAMPMFormat(item.login_time)}
              </span>
              {item.desk_image_login && (
                <IconButton
                  // style={{
                  //   background: "transparent",
                  //   border: "none",
                  //   paddingLeft: "0px",
                  //   paddingRight: "0px",
                  //   marginBottom: "2px",
                  // }}
                  sx={{ padding: "0px 0.5px" }}
                  onClick={() =>
                    handleImageLoginIn(item.desk_image_login, item.u_id)
                  }
                >
                  <ImageIcon sx={{ fontSize: "17px", color: "#097969" }} />
                </IconButton>
              )}
              {item.login_location && item.login_location.includes(",") && (
                <IconButton
                  sx={{ padding: "0px 0.5px" }}
                  onClick={() => {
                    let loginLocation = item.login_location.split(",");
                    setShowModal((prevState) => ({
                      ...prevState,
                      type: "location",
                      show: true,
                      latitude: loginLocation[0],
                      longitude: loginLocation[1],
                    }));
                  }}
                >
                  <NotListedLocationOutlinedIcon sx={{ fontSize: "19px" }} />
                </IconButton>
              )}
              {Cookies.get("role") === "Master" && (
                <IconButton
                  sx={{ padding: "0px 0.5px" }}
                  onClick={() =>
                    setShowModal({
                      type: "edit",
                      show: true,
                      login_time: item.login_time,
                      logout_time: item.logout_time,
                      auid: item.auid,
                      login_date: row.original.date,
                    })
                  }
                >
                  <EditIcon sx={{ fontSize: "16px" }} />
                </IconButton>
              )}
              {Cookies.get("role") === "Master" && (
                <IconButton
                  sx={{ padding: "0px 0.5px" }}
                  onClick={() =>
                    setShowDeleteModal({ show: true, auid: item.auid })
                  }
                >
                  <DeleteOutlineRoundedIcon sx={{ fontSize: "16px" }} />
                </IconButton>
              )}
            </p>
          );
        });
      },
    },
    {
      Header: "Logout Time",
      // accessor: "logout_time",
      Cell: ({ value, row }) => {
        if (value !== "00:00:00") {
          if (
            row.original.items.length === 1 &&
            row.original.items[0].logout_time === ""
          ) {
            if (Cookies.get("role") === "Master") {
              return (
                <IconButton
                  sx={{ padding: "0px 8px" }}
                  onClick={() =>
                    setShowModal({
                      type: "Add",
                      show: true,
                      login_time: "00:00:00",
                      logout_time: "00:00:00",
                      auid: 0,
                      login_date: row.original.date,
                    })
                  }
                >
                  <AddIcon sx={{ fontSize: "16px" }} />
                </IconButton>
              );
            } else {
              return "";
            }
          }
          return row.original.items.map((item, index) => {
            return (
              <p
                key={index}
                className="d-flex justify-content-evenly align-items-center"
                style={{ borderBottom: "ridge 1px #dddddd" }}
              >
                {item.logout_time === "00:00:00" ? (
                  ""
                ) : (
                  <>
                    <span
                      style={{
                        fontSize: "12px",
                        textAlign: "center",
                        padding: "2px",
                      }}
                    >
                      {convertToAMPMFormat(item.logout_time)}
                    </span>
                    {item.desk_image_logout && (
                      <IconButton
                        sx={{ padding: "0px 0.5px" }}
                        // style={{
                        //   background: "transparent",
                        //   border: "none",
                        //   paddingLeft: "0px",
                        //   paddingRight: "0px",
                        //   marginBottom: "2px",
                        // }}
                        onClick={() =>
                          handleImageLoginIn(item.desk_image_logout, item.u_id)
                        }
                      >
                        <ImageIcon
                          sx={{ fontSize: "18px", color: "#097969" }}
                        />
                      </IconButton>
                    )}
                    {item.logout_location &&
                      item.logout_location.includes(",") && (
                        <IconButton
                          sx={{ padding: "0px 0.5px" }}
                          onClick={() => {
                            let logoutLocation =
                              item.logout_location.split(",");
                            setShowModal((prevState) => ({
                              ...prevState,
                              type: "location",
                              show: true,
                              latitude: logoutLocation[0],
                              longitude: logoutLocation[1],
                            }));
                          }}
                        >
                          <NotListedLocationOutlinedIcon
                            sx={{ fontSize: "19px" }}
                          />
                        </IconButton>
                      )}
                    {Cookies.get("role") === "Master" && (
                      <IconButton
                        sx={{ padding: "0px 0.5px" }}
                        onClick={() =>
                          setShowModal({
                            type: "edit",
                            show: true,
                            login_time: item.login_time,
                            logout_time: item.logout_time,
                            auid: item.auid,
                            login_date: row.original.date,
                          })
                        }
                      >
                        <EditIcon sx={{ fontSize: "16px" }} />
                      </IconButton>
                    )}
                    {Cookies.get("role") === "Master" && (
                      <IconButton
                        sx={{ padding: "0px 0.5px" }}
                        onClick={() =>
                          setShowModal({
                            type: "delete",
                            show: true,
                            login_time: item.login_time,
                            logout_time: item.logout_time,
                            auid: item.auid,
                            login_date: row.original.date,
                          })
                        }
                      >
                        <DeleteOutlineRoundedIcon sx={{ fontSize: "16px" }} />
                      </IconButton>
                    )}
                  </>
                )}
              </p>
            );
          });
        } else {
          return null;
        }
      },
    },
    {
      Header: "Total Minutes/Day",
      accessor: "TotalMinutes",
      Cell: ({ value }) => {
        if (value === "") {
          return "";
        }
        return `${value} minutes`;
      },
    },
    {
      Header: "Total Hours/Day",
      accessor: "TotalHours",
      Cell: ({ value }) => {
        if (value === "") {
          return "";
        }
        return `${value} hours`;
      },
    },
    {
      Header: "Status",
      accessor: "status",
      Cell: ({ row, value }) => {
        if (value === "") {
          return "";
        }
        return (
          <span
            style={{
              backgroundColor: row.original.statusColor,
              padding: "5px 8px",
              color: "#ffffff",
            }}
          >
            {value}
          </span>
        );
      },
    },
  ];

  const handleImageLoginIn = (UserIMage, loginUser) => {
    setShowModal({
      type: "image",
      show: true,
    });
    const image = `${myglobalData.API_URL}/uploads/Attendance/${loginUser}/${UserIMage}`;
    setSelectedImage(image);
  };

  const HandleUserButton = (userID) => {
    setSelectedTabUser(userID);
    let Values = {
      user: userID,
      start_date: selectedDate.datefrom,
      end_date: selectedDate.dateto,
    };
    // mutate(Values, {
    //   onSuccess: (data) => {
    //     if (data.data && data.data === "Need to Add Do Intime") {
    //       setFilterData([]);
    //     } else {
    //       setFilterData(
    //         groupBy(
    //           data?.data?.map((row) => ({
    //             auid: row.auid,
    //             desk_image_login: row.desk_image_login,
    //             desk_image_logout: row.desk_image_logout,
    //             login_date: row.login_date,
    //             login_time: row.login_time,
    //             logout_date: row.logout_date,
    //             logout_time: row.logout_time,
    //             system_ip: row.system_ip,
    //             u_id: row.u_id,
    //             username: AllUsers.data?.data
    //               ? AllUsers.data?.data?.filter(
    //                 (user) => user.id === row.u_id
    //               )[0]?.username
    //               : row.u_id,
    //           })),
    //           "login_date"
    //         )
    //       );
    //     }
    //   },
    // });
    handleMutate(Values);
  };

  // Render component with form, breadcrumb, and calling report table
  return (
    <>
      {/* Breadcrumb component for page navigation */}
      <Breadcrumb PageName="Attendance Reports" />
      {/* Card component for organizing content */}
      <Card className="mt-3">
        <Card.Body className="align-items-center justify-content-between">
          <Card.Title className="mb-4" style={{ fontSize: "16px" }}>
            Generate User Attendance Reports
          </Card.Title>
          <Formik
            initialValues={initialValues}
            onSubmit={HandleSubmit}
            validationSchema={UserAttendanceSchema}
          >
            {({ values, setFieldValue }) => (
              <>
                {/* Form containing filter fields */}
                <Form className="mt-3">
                  <Row className="mb-5">
                    {/* CustomMultipleSelectField for selecting users */}
                    <Col md={3}>
                      <CustomMultipleSelectField
                        name="user"
                        placeholder="Select User"
                        options={CreateLabelValueArray(
                          AllUsers.data?.data,
                          "username",
                          "id"
                        )}
                        isLabelValue={true}
                        FieldValue={setFieldValue}
                        values={values}
                        resetField={ResetForm}
                      />
                    </Col>
                    {/* CustomInputField for selecting start date */}
                    <Col md={3}>
                      <Typography
                        variant="subtitle2"
                        sx={{ fontWeight: "400" }}
                      >
                        Select Date From
                      </Typography>
                      <CustomInputField
                        type="date"
                        name="start_date"
                        resetField={ResetForm}
                      />
                    </Col>
                    {/* CustomInputField for selecting end date */}
                    <Col md={3}>
                      <Typography
                        variant="subtitle2"
                        sx={{ fontWeight: "400" }}
                      >
                        Select Date To
                      </Typography>
                      <CustomInputField
                        type="date"
                        name="end_date"
                        resetField={ResetForm}
                      />
                    </Col>
                  </Row>
                  {/* Button group for searching and resetting filters */}
                  <div className="text-end">
                    <LoadingButton
                      variant="contained"
                      type="submit"
                      loading={isLoading}
                      sx={{ mr: 2 }}
                    >
                      Search Reports
                    </LoadingButton>
                    <LoadingButton
                      variant="contained"
                      type="button"
                      onClick={() => {
                        setResetForm(true);
                        values.start_date = "";
                        values.end_date = "";
                        setTimeout(() => {
                          setResetForm(false);
                        }, 10);
                        setSelectedUser([]);
                        setDateRange([]);
                      }}
                    >
                      Reset Search Default
                    </LoadingButton>
                  </div>
                </Form>
              </>
            )}
          </Formik>
        </Card.Body>
      </Card>
      {/* Card component for the calling report table */}
      <Card className="mt-3 calling-report-table-card">
        {SelectedUser.length > 0 ? (
          <Tabs
            defaultActiveKey={SelectedTabUser}
            id="uncontrolled-tab-example"
            className="lead-details-tab"
            onSelect={(key) => HandleUserButton(key)}
            activeKey={SelectedTabUser}
          >
            {SelectedUser?.map((user, index) => (
              <Tab eventKey={user} title={usernames[user]} key={index}>
                {isLoading || customIsLoading ? (
                  <div className="d-flex justify-content-center my-2">
                    <Spinner variant="secondary" />
                  </div>
                ) : (
                  <>
                    {showSuccessMessage && (
                      <Alert severity="info">{showSuccessMessage}</Alert>
                    )}
                    <Row className="my-3">
                      <Typography className="my-1 mx-2">
                        Username: <b>{usernames[user]}</b> | UserId:{" "}
                        <b>{user}</b>
                      </Typography>
                      {[
                        `Total Days: ${attendanceData.totalDays}`,
                        `Working Days: ${attendanceData.workingDays}`,
                        AttendancePolicy?.data?.data["Weekly OFF"]?.status ===
                        "ON"
                          ? `Weekly Off: ${attendanceData.weeklyOff}`
                          : "",
                        AttendancePolicy?.data?.data["Public Holidays"]
                          ?.status === "ON"
                          ? `Holidays: ${attendanceData.no_of_holidays}`
                          : "",
                        `Worked Days: ${attendanceData.workedDays}`,
                        AttendancePolicy?.data?.data["Full Day"]?.status ===
                        "ON"
                          ? `Full Day: ${attendanceData.fullDay}`
                          : "",
                        AttendancePolicy?.data?.data["Half Day"]?.status ===
                        "ON"
                          ? `Half Day: ${attendanceData.halfDay}`
                          : "",
                        AttendancePolicy?.data?.data["Late Mark"]?.status ===
                        "ON"
                          ? `Late Mark: ${attendanceData.lateMark}`
                          : "",
                        AttendancePolicy?.data?.data["Failed to Logout"]
                          ?.status === "ON"
                          ? `Failed to Logout: ${attendanceData.failedToLogout}`
                          : "",
                        `Absent: ${attendanceData.absent}`,
                      ].map(
                        (action, index) =>
                          action && (
                            <Col xs={3} key={action} className="d-flex my-1">
                              <DomainVerificationIcon className="mx-2" />
                              <Typography>{action}</Typography>
                            </Col>
                          )
                      )}
                    </Row>
                    <CustomDataTable
                      columns={columns}
                      data={slicedPaginationData}
                      page={page}
                      pageSize={pageSize}
                      totalCount={attendanceData.totalDays}
                      onPageChange={handlePageChange}
                      onPageSizeChange={handlePageSizeChange}
                      SetSelectedRows={() => {}}
                      selectedRows={[]}
                      showAction={false}
                      showCheckBox={false}
                      hideToolTip={true}
                      weeklyOffColor={
                        AttendancePolicy?.data?.data["Weekly OFF"]?.color
                      }
                      publicHolidaysColor={
                        AttendancePolicy?.data?.data["Public Holidays"]?.color
                      }
                    />
                  </>
                )}
              </Tab>
            ))}
          </Tabs>
        ) : (
          <CustomDataTable
            // actionModulePrevilege={LeadsActionPrevilege}
            columns={columns}
            data={dateRange}
            page={1}
            pageSize={50}
            totalCount={dateRange.length > 0 ? dateRange.length : 0}
            onPageChange={() => {}}
            onPageSizeChange={() => {}}
            SetSelectedRows={() => {}}
            selectedRows={[]}
            showAction={false}
            showCheckBox={false}
            hideToolTip={true}
            weeklyOffColor={AttendancePolicy?.data?.data["Weekly OFF"]?.color}
            publicHolidaysColor={
              AttendancePolicy?.data?.data["Public Holidays"]?.color
            }
          />
        )}
      </Card>
      <CustomModal
        show={showModal.show}
        onHide={() => setShowModal({ show: false })}
        showHeader={true}
        ModalTitle={
          showModal.type === "Add" || showModal.type === "edit"
            ? `${showModal.type} Attendance`
            : showModal.type === "location"
            ? "User Location"
            : "Employee Picture"
        }
        hideCloseIcon={true}
        ModalBody={
          <>
            {showModal.type === "image" && (
              <div className="image-popup mw-100">
                <img
                  style={{
                    marginBottom: "0",
                    // objectFit: "contain",
                    // width: "100%",
                    // height: "350px"
                  }}
                  src={selectedImage}
                  alt="Login Time"
                  className="mw-100"
                />
              </div>
            )}
            {(showModal.type === "edit" || showModal.type === "Add") && (
              <Formik
                initialValues={{
                  login_time: showModal.login_time,
                  logout_time:
                    showModal.logout_time === "00:00:00" &&
                    showModal.type === "edit"
                      ? "00:00:01"
                      : showModal.logout_time,
                  auid: showModal.auid,
                }}
                onSubmit={HandleEditAddSubmit}
                validationSchema={AddEditAttendanceSchema}
              >
                {({ errors, touched, values }) => {
                  // console.log("values", values);
                  return (
                    <Form>
                      <CustomInputField type="hidden" name="auid" />
                      <CustomFormGroup
                        formlabel="Login Time"
                        star="*"
                        xs={12}
                        md={12}
                        FormField={
                          <CustomInputField type="time" name="login_time" />
                        }
                      />
                      <CustomFormGroup
                        formlabel="Logout Time"
                        star="*"
                        xs={12}
                        md={12}
                        FormField={
                          <CustomInputField type="time" name="logout_time" />
                        }
                      />
                      <div className="d-flex justify-content-center">
                        <LoadingButton
                          variant="contained"
                          type="submit"
                          // loading={isLoading}
                          loading={addEditIsLoading}
                          sx={{ mr: 2 }}
                        >
                          {showModal.type === "edit" ? "Edit" : "Add"}
                        </LoadingButton>
                      </div>
                    </Form>
                  );
                }}
              </Formik>
            )}
            {
              showModal.type === "location" && (
                <UserAttendanceLocation
                  latitude={showModal.latitude}
                  longitude={showModal.longitude}
                  username={usernames[SelectedTabUser]}
                />
              )
              // <MapComponent selectedLocation={{ lat: parseFloat(showModal.latitude), lng: parseFloat(showModal.longitude) }} />
            }
          </>
        }
      />
      <DeleteModal
        show={showDeleteModal.show}
        onHide={() =>
          setShowDeleteModal((prevState) => ({ ...prevState, show: false }))
        }
        loading={DeleteisLoading}
        onclick={() =>
          DeleteMutate(showDeleteModal.auid, {
            onSuccess: (data) => {
              // allData.refetch();
              let mutateValues = {
                user: SelectedTabUser,
                start_date: selectedDate.datefrom,
                end_date: selectedDate.dateto,
              };
              setShowDeleteModal({ show: false, auid: "" });
              setShowSuccessMessage(data.data);
              handleMutate(mutateValues);
              setTimeout(() => {
                setShowSuccessMessage(null);
              }, 3000);
            },
          })
        }
      />
    </>
  );
};

// Exporting the UserAttendance component as the default export
export default UserAttendance;
