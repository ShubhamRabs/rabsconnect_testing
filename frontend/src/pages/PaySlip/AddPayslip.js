import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import { useQuery } from "react-query";
import { Formik, Form } from "formik";
import Breadcrumb from "../../components/Breadcrumb/Breadcrumb";
import { useBootstrap, useMui } from "../../hooks/Hooks";
import {
  getAttendancePolicy,
  useFilterAttendanceReport,
  fetchAllUsers,
} from "../../hooks/Attendance/UseAttendanceHook";
import {
  CustomFormGroup,
  CustomInputField,
  CustomSelectField,
} from "../../components/FormUtility/FormUtility";
import { groupBy, numberToWords } from "../../hooks/Function";
import { useProfileById } from "../../hooks/Other/UseProfileHook";
import { Box, Button, Divider, Grid } from "@mui/material";
import PreviewPayslip from "./PreviewPayslip";

import Cookies from "js-cookie";
// React functional component named UserAttendance
const UserAttendance = ({ dispatch, myglobalData, userId }) => {
  // Destructuring utility functions and components from custom hooks and libraries
  const { Card, Row } = useBootstrap();
  const { LoadingButton, ArrowBackIosIcon } = useMui();

  // State variables for managing form values, filter data, status, pagination, and selected rows
  const [FilterData, setFilterData] = React.useState([]);
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(50);

  const [SelectedTabUser, setSelectedTabUser] = React.useState("");
  const [selectedDate, setSelectedDate] = React.useState({
    datefrom: "",
    dateto: "",
  });
  const [dateError, setDateError] = React.useState(null);

  const [SelectedUserAttend, setSelectedUserAttend] = React.useState("");
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

  // Custom hook for handling filter calling report data
  const { mutate, isLoading } = useFilterAttendanceReport();
  const [ResetForm, setResetForm] = React.useState(false);
  const [customIsLoading, setCustomIsLoading] = useState(false);
  const [amountInWords, setAmountInWords] = useState("");
  const [openPreview, setOpenPreview] = useState(false);

  const handleOpenPreview = () => {
    setOpenPreview(true);
  };

  const handleClosePreview = () => {
    setOpenPreview(false);
  };
  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate(); // Month is 0-indexed, so we add 1
  };

  // const AllUsersAttend = useQuery("AllUsersList", fetchAllUsers);
  const AttendancePolicy = useQuery("AttendancePolicy", getAttendancePolicy);

  const { data: allUsersData, error } = useQuery("AllUsersList", fetchAllUsers);

  const userDetail = useProfileById();
 
  
  const [userProfileData, setUserProfileData] = React.useState({});

  const empData = allUsersData?.data?.map((user) => ({
    label: user.username,
    value: user.id,
  }));

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

  const [isDataVisible, setIsDataVisible] = useState(false);

  console.log(attendanceData, "attendanceData");
  console.log(selectedDate, "selectedDate");
  const {
    mutate: fetchProfileById,
    data,
    isSuccess,
    isError,
  } = useProfileById();
  const [profileData, setProfileData] = useState("");

  useEffect(() => {
    if (userId) {
      fetchProfileById(userId);
    }
  }, [userId, fetchProfileById]);

  useEffect(() => {
    if (isSuccess && data) {
      // Format data for display
      const formattedData = JSON.stringify(data, null, 2);
      setProfileData(formattedData);
    }
  }, [isSuccess, data]);

  // Function to handle form submission
  // const HandleSubmitAttend = (values) => {
  //   // Continue with the form submission process
  //   const allUsernames = {};
  //   allUsersData?.data?.forEach((user) => {
  //     allUsernames[user.id] = user.username;
  //   });

  //   const formValues = { ...values, user: values.user };

  //   // Fetch user details and mutate as necessary
  //   userDetail.mutate(formValues.user, {
  //     onSuccess: (data) => {
  //       setUserProfileData(data.data);
  //       console.log(data.data, "data.data");
  //     },
  //   });

  //   // Mutate the form values
  //   mutate(formValues, {
  //     onSuccess: (data) => {
  //       setSelectedUserAttend(values.user);

  //       if (Object.keys(allUsernames).length !== 0) {
  //         setUserNames(allUsernames);
  //       }

  //       setPage(1);
  //       setSelectedTabUser(values.user);
  //       setSelectedDate({
  //         datefrom: values.start_date,
  //         dateto: values.end_date,
  //       });

  //       if (data?.data === "Need to Add Do Intime") {
  //         setFilterData([]);
  //       } else {
  //         const groupedData = groupBy(
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
  //             login_location: row.login_location,
  //             logout_location: row.logout_location,
  //             username: allUsernames[row.u_id] || row.u_id,
  //           })),
  //           "login_date"
  //         );

  //         setFilterData(groupedData);
  //       }
  //     },
  //   });
  //   setIsDataVisible(true);
  // };

  const HandleSubmitAttend = async (values) => {
    try {
      // Step 1: Build the user data map (allUsernames)
      const allUsernames = {};
      allUsersData?.data?.forEach((user) => {
        allUsernames[user.id] = user.username;
      });
  
      // Step 2: Prepare form values for mutation
      const formValues = { ...values, user: values.user };
  
      // Step 3: Mutate user details
      await new Promise((resolve, reject) => {
        userDetail.mutate(formValues.user, {
          onSuccess: (data) => {
            setUserProfileData(data.data); // Set the user profile data from the response
            console.log(data.data, "User profile data updated");
            resolve();
          },
          onError: (error) => {
            console.error("Error mutating user details:", error);
            reject(error);
          },
        });
      });
  
      // Step 4: Mutate attendance data
      mutate(formValues, {
        onSuccess: (data) => {
          // Update selected user attendance state
          setSelectedUserAttend(values.user);
  
          // Populate usernames if available
          if (Object.keys(allUsernames).length !== 0) {
            setUserNames(allUsernames);
          }
  
          // Update pagination and selected date range
          setPage(1);
          setSelectedTabUser(values.user);
          setSelectedDate({
            datefrom: values.start_date,
            dateto: values.end_date,
          });
  
          // Check response and set filtered data accordingly
          if (data?.data === "Need to Add Do Intime") {
            setFilterData([]); // No data to display if "Need to Add Do Intime" message received
          } else {
            // Map the attendance data and group by login date
            const groupedData = groupBy(
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
                username: allUsernames[row.u_id] || row.u_id, // Fallback to u_id if username is missing
              })),
              "login_date"
            );
  
            // Update the state with grouped attendance data
            setFilterData(groupedData);
          }
        },
        onError: (error) => {
          console.error("Error mutating form values:", error);
        },
      });
  
      // Step 5: Set the data visibility state
      setIsDataVisible(true);
    } catch (error) {
      console.error("Error during form submission:", error);
    }
  };
  

  console.log(userProfileData, "userProfileData");

  React.useEffect(() => {
    setCustomIsLoading(true);
    setAttendanceData({
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

  const [initialValueForm, setInitialValueForm] = useState({
    user: "",
    start_date: "",
    end_date: "",
    emp_name: "",
    // p_name: "",
    join_date: "",
    email: "",
    ccode: "",
    mob: "",
    designation: "",
    department: "",
    location: "",
    bank_name: "",
    pf_no: "",
    pan_no: "",
    account_no: "",
    hra: 0,
    medical_allowance: 0,
    travel_allowance: 0,
    special_allowance: 0,
    profession_tax: 0,
    pf_amount: 0,
    // other_deduction: 0,
    gross_earnings: 0,
    net_pay_amount: 0,
    total_deductions: 0,
    amountInWords: "",
    other_details: "",
    Incentive: 0,
    tds: 0,
    ESIC: 0,
    total_days: 0,
    working_days: 0,
    workedDays: 0,
    weekly_off: 0,
    holidays: 0,
    full_days: 0,
    half_day: 0,
    forget_to_logout: 0,
    absent_days: 0,
    med_leave: 0,
    paid_leave: 0,
    late_mark: "",
    amountInWords: "",
  });

  // Handle input changes for the form fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInitialValueForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  // Recalculate salary components whenever relevant values change
  useEffect(() => {
    if (userProfileData && userProfileData.length > 0) {
      const userData = userProfileData[0];
      const {
        hra = 0,
        medical_allowance = 0,
        travel_allowance = 0,
        special_allowance = 0,
        Incentive = 0,
        other_deduction = 0,
        profession_tax = 0,
        pf_amount = 0,
        tds = 0,
        ESIC = 0,
        med_leave = 0,
        paid_leave = 0,
      } = initialValueForm;

      const medLeave = parseFloat(med_leave) || 0;
      const paidLeave = parseFloat(paid_leave) || 0;

      const basic_salary =
        parseFloat(initialValueForm.basic_salary) ||
        parseFloat(userData.basic_salary) ||
        0;

      const working_days = parseFloat(attendanceData.workingDays) || 0;
      const absent_days = parseFloat(attendanceData.absent) || 0;

      // Subtract medical and paid leave from the absent days
      const adjusted_absent_days = absent_days - medLeave - paidLeave;
      const adjusted_worked_days =
        attendanceData.workedDays + medLeave + paidLeave;

      // Log basic values
      console.log("Basic Salary:", basic_salary);
      console.log("Working Days:", working_days);
      console.log("Absent Days:", absent_days);

      // Calculate Gross Salary
      const gross_salary = Math.round(
        basic_salary +
          parseFloat(hra) +
          parseFloat(medical_allowance) +
          parseFloat(travel_allowance) +
          parseFloat(special_allowance) +
          parseFloat(Incentive)
      );
      console.log("Gross Salary:", gross_salary);

      // Calculate Loss of Pay based on working days
      const loss_of_pay =
        working_days > 0
          ? Math.round((basic_salary / working_days) * adjusted_absent_days)
          : 0;
      console.log("Loss of Pay:", loss_of_pay);
      const total_deductions = Math.round(
        parseFloat(profession_tax) +
          parseFloat(pf_amount) +
          parseFloat(tds) +
          parseFloat(ESIC) +
          parseFloat(other_deduction) +
          parseFloat(loss_of_pay)
      );
      console.log("Total Deductions:", total_deductions);

      // Calculate Net Pay
      const net_pay = Math.round(gross_salary - total_deductions);
      console.log("Net Pay:", net_pay);

      // Set form values
      setInitialValueForm((prevForm) => ({
        ...prevForm,
        user: userData.u_id || "",
        start_date: selectedDate.datefrom,
        end_date: selectedDate.dateto,
        emp_name: userData.fname
          ? `${userData.fname} ${userData.mname || ""} ${userData.lname || ""}`
          : "",
        email: userData.p_email || "",
        r_email: userData.p_r_email || "",
        ccode: userData.p_ccode || "",
        mob: userData.p_mob || "",
        // health: userData.health || "-",
        health_issue: userData.health_issue || "-",
        religion: userData.religion || "-",
        gender: userData.gender || "-",
        mstatus: userData.mstatus || "-",
        dob: userData.dob || "-",
        aadhar_no: userData.aadhar_no || "-",
        pan_no: userData.pan_no || "-",
        join_date: userData.join_date || "-",
        designation: prevForm.designation,  // Capture the user input here
        department: prevForm.department,    // Capture the user input here
        // designation: userData.designation || "-",
        // department: userData.department || "-",
        location: userData.location || "-",
        pf_no: userData.pf_no || "-",
        bank_name: userData.bank_name || "-",
        bank_branch: userData.bank_branch || "-",
        ac_name: userData.ac_name || "-",
        account_no: userData.account_no || "-",
        ifsc_code: userData.ifsc_code || "-",
        basic_salary: Math.round(basic_salary),
        hra: Math.round(hra),
        medical_allowance: Math.round(medical_allowance),
        travel_allowance: Math.round(travel_allowance),
        special_allowance: Math.round(special_allowance),
        Incentive: Math.round(Incentive),
        gross_earnings: gross_salary,
        profession_tax,
        pf_amount,
        tds,
        ESIC,
        other_deduction: Math.round(other_deduction),
        loss_of_pay,
        total_deductions,
        net_pay_amount: net_pay,
        amountInWords,
        // Attendance Data
        total_days: attendanceData.totalDays,
        working_days: attendanceData.workingDays,
        workedDays: adjusted_worked_days,
        weekly_off: attendanceData.weeklyOff,
        holidays: attendanceData.no_of_holidays,
        full_days: attendanceData.fullDay,
        half_day: attendanceData.halfDay,
        forget_to_logout: attendanceData.failedToLogout,
        absent_days: adjusted_absent_days,
        late_mark: attendanceData.lateMark,
      }));
    }
  }, [
    initialValueForm.basic_salary,
    initialValueForm.hra,
    initialValueForm.medical_allowance,
    initialValueForm.travel_allowance,
    initialValueForm.special_allowance,
    initialValueForm.Incentive,
    initialValueForm.other_deduction,
    initialValueForm.profession_tax,
    initialValueForm.pf_amount,
    initialValueForm.tds,
    initialValueForm.ESIC,
    initialValueForm.med_leave,
    initialValueForm.paid_leave,
    initialValueForm.loss_of_pay,
    initialValueForm.other_deduction,
    initialValueForm.total_deductions,
    userProfileData,
    attendanceData,
  ]);

  // Handle the conversion whenever net_pay_amount changes
  useEffect(() => {
    const netPay = initialValueForm.net_pay_amount;
    if (netPay) {
      const words = numberToWords(netPay);
      setInitialValueForm((prevForm) => ({
        ...prevForm,
        amountInWords: words, // update amountInWords in the form state
      }));
    } else {
      setInitialValueForm((prevForm) => ({
        ...prevForm,
        amountInWords: "N/A", // ensure 'N/A' is set when netPay is falsy
      }));
    }
  }, [initialValueForm.net_pay_amount]);

  // console.log(attendanceData, "attendanceDataSMDdDDdDdD");
  console.log(initialValueForm, "initialValueFormSMDdDDdDdD");

  // Render component with form, breadcrumb, and calling report table
  return (
    <>
      {/* Breadcrumb component for page navigation */}
      <Breadcrumb
        PageName="Pay Slip Reports"
        BackButton={[
          true,
          "Back",
          <ArrowBackIosIcon />,
          () =>
            dispatch({
              event:
                localStorage.getItem("previousScreen") ===
                localStorage.getItem("currScreen")
                  ? "payslip"
                  : localStorage.getItem("previousScreen"),
            }),
        ]}
      />
      {/* Card component for organizing content */}
      <Formik
        enableReinitialize
        initialValues={initialValueForm}
        onSubmit={HandleSubmitAttend}
      >
        {({ values, setFieldValue, getFieldProps ,handleChange}) => {
          console.log(values, "values");
          return (
            <>
              <Form className="mt-3">
                <Card className="my-3">
                  <Card.Body>
                    {dateError && (
                      <div style={{ color: "red" }}>{dateError}</div>
                    )}

                    <Grid container spacing={3}>
                      <Grid item xs={12} sm={6} md={4}>
                        <CustomSelectField
                          name="user"
                          FieldValue={(name, value) => {
                            setSelectedUserAttend(value);
                            return setFieldValue(name, value);
                          }}
                          isLabelValue
                          placeholder="Select Your Name"
                          options={empData || []}
                          sx={{
                            width: "100%",
                            bgcolor: "#ffffff", // White background for input fields
                            borderRadius: 1,
                            p: 1,
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} md={4}>
                        <CustomInputField
                          type="date"
                          name="start_date"
                          {...getFieldProps("start_date")}
                          resetField={ResetForm}
                          sx={{
                            width: "100%",
                            bgcolor: "#ffffff", // White background for input fields
                            borderRadius: 1,
                            p: 1,
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} md={4}>
                        <CustomInputField
                          type="date"
                          name="end_date"
                          {...getFieldProps("end_date")}
                          resetField={ResetForm}
                          sx={{
                            width: "100%",
                            bgcolor: "#ffffff", // White background for input fields
                            borderRadius: 1,
                            p: 1,
                          }}
                        />
                      </Grid>
                    </Grid>
                    <Box
                      sx={{
                        mt: 3,
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <LoadingButton
                        variant="contained"
                        type="button"
                        size="small"
                        onClick={() => {
                          setResetForm(true);
                          setIsDataVisible(false);
                          values.start_date = "";
                          values.end_date = "";
                          setTimeout(() => {
                            setResetForm(false);
                          }, 10);
                          setSelectedUserAttend([]);
                          setDateRange([]);
                        }}
                        sx={{
                          bgcolor: "#6c757d",
                          ":hover": { bgcolor: "#5a6268" },
                        }}
                      >
                        Reset
                      </LoadingButton>
                      <LoadingButton
                        variant="contained"
                        type="submit"
                        size="small"
                        loading={isLoading}
                        disabled={
                          !values.user || !values.start_date || !values.end_date
                        }
                        sx={{
                          mr: 2,
                          bgcolor: "#007bff",
                          ":hover": { bgcolor: "#0056b3" },
                        }}
                      >
                        Proceed
                      </LoadingButton>
                    </Box>
                  </Card.Body>
                </Card>

                <div className="mt-2">
                  {isDataVisible && (
                    <>
                      <Card>
                        <Card.Body>
                          <Card.Title style={{ fontSize: "19px" }}>
                            Personal Details :-
                          </Card.Title>
                          <Row className="my-3 align-items-center p-3">
                            <CustomFormGroup
                              formlabel="Name"
                              star="*"
                              FormField={
                                <CustomInputField
                                  type="text"
                                  disabled={true}
                                  name="emp_name"
                                  {...getFieldProps("emp_name")}
                                  value={initialValueForm.emp_name}
                                />
                              }
                            />
                            <CustomFormGroup
                              formlabel="Email"
                              star="*"
                              FormField={
                                <CustomInputField
                                  type="text"
                                  disabled={true}
                                  name="email"
                                  {...getFieldProps("email")}
                                  value={initialValueForm.email}
                                />
                              }
                            />

                            <CustomFormGroup
                              formlabel="Mobile"
                              star="*"
                              FormField={
                                <CustomInputField
                                  type="text"
                                  disabled={true}
                                  name="mob"
                                  {...getFieldProps("mob")}
                                  value={initialValueForm.mob}
                                />
                              }
                            />
                            <CustomFormGroup
                              formlabel="Designation"
                              star="*"
                              FormField={
                                <CustomInputField
                                  type="text"
                                  name="designation"
                                  {...getFieldProps("designation")}
                                  value={initialValueForm.designation}
                                  onChange={handleInputChange}
                                  placeholder="Enter Designation"
                                />
                              }
                            />
                            <CustomFormGroup
                              formlabel="Department"
                              star="*"
                              FormField={
                                <CustomInputField
                                  type="text"
                                  name="department"
                                  {...getFieldProps("department")}
                                  value={initialValueForm.department}
                                  onChange={handleInputChange}
                                  placeholder="Enter Department"
                                />
                              }
                            />
                            <CustomFormGroup
                              formlabel="Health Issue"
                              star="*"
                              FormField={
                                <CustomInputField
                                  type="text"
                                  disabled={true}
                                  name="health_issue"
                                  {...getFieldProps("health_issue")}
                                  value={initialValueForm.health_issue}
                                />
                              }
                            />

                            <CustomFormGroup
                              formlabel="Religion"
                              star="*"
                              FormField={
                                <CustomInputField
                                  type="text"
                                  disabled={true}
                                  name="religion"
                                  {...getFieldProps("religion")}
                                  value={initialValueForm.religion}
                                />
                              }
                            />

                            <CustomFormGroup
                              formlabel="Gender"
                              star="*"
                              FormField={
                                <CustomInputField
                                  type="text"
                                  disabled={true}
                                  name="gender"
                                  {...getFieldProps("gender")}
                                  value={initialValueForm.gender}
                                />
                              }
                            />

                            <CustomFormGroup
                              formlabel="Date of Joining"
                              star="*"
                              FormField={
                                <CustomInputField
                                  type="text"
                                  disabled={true}
                                  name="join_date"
                                  {...getFieldProps("join_date")}
                                  value={initialValueForm.join_date}
                                />
                              }
                            />

                            <CustomFormGroup
                              formlabel="Aadhar No"
                              star="*"
                              FormField={
                                <CustomInputField
                                  type="text"
                                  disabled={true}
                                  name="aadhar_no"
                                  {...getFieldProps("aadhar_no")}
                                  value={initialValueForm.aadhar_no}
                                />
                              }
                            />

                            <CustomFormGroup
                              formlabel="PAN No"
                              star="*"
                              FormField={
                                <CustomInputField
                                  type="text"
                                  disabled={true}
                                  name="pan_no"
                                  {...getFieldProps("pan_no")}
                                  value={initialValueForm.pan_no}
                                />
                              }
                            />

                            <CustomFormGroup
                              formlabel="Total Days"
                              star="*"
                              FormField={
                                <CustomInputField
                                  type="text"
                                  disabled={true}
                                  name="totalDays"
                                  {...getFieldProps("totalDays")}
                                  value={attendanceData.totalDays}
                                />
                              }
                            />
                            <CustomFormGroup
                              formlabel="Total Working Days"
                              star="*"
                              FormField={
                                <CustomInputField
                                  type="text"
                                  disabled={true}
                                  name="workingDays"
                                  {...getFieldProps("workingDays")}
                                  value={attendanceData.workingDays}
                                />
                              }
                            />
                            <CustomFormGroup
                              formlabel="Weekly Off"
                              star="*"
                              FormField={
                                <CustomInputField
                                  type="text"
                                  disabled={true}
                                  name="weeklyOff"
                                  {...getFieldProps("weeklyOff")}
                                  value={attendanceData.weeklyOff}
                                />
                              }
                            />
                            <CustomFormGroup
                              formlabel="Holidays"
                              star="*"
                              FormField={
                                <CustomInputField
                                  type="text"
                                  disabled={true}
                                  name="no_of_holidays"
                                  {...getFieldProps("no_of_holidays")}
                                  value={attendanceData.no_of_holidays}
                                />
                              }
                            />
                            <CustomFormGroup
                              formlabel="Worked Days"
                              star="*"
                              FormField={
                                <CustomInputField
                                  type="text"
                                  disabled={true}
                                  name="workedDays"
                                  {...getFieldProps("workedDays")}
                                  value={attendanceData.workedDays}
                                />
                              }
                            />
                            <CustomFormGroup
                              formlabel="Half Days"
                              star="*"
                              FormField={
                                <CustomInputField
                                  type="text"
                                  disabled={true}
                                  name="halfDay"
                                  {...getFieldProps("halfDay")}
                                  value={attendanceData.halfDay}
                                />
                              }
                            />
                            <CustomFormGroup
                              formlabel="Late Mark"
                              star="*"
                              FormField={
                                <CustomInputField
                                  type="text"
                                  disabled={true}
                                  name="lateMark"
                                  {...getFieldProps("lateMark")}
                                  value={attendanceData.lateMark}
                                />
                              }
                            />
                            <CustomFormGroup
                              formlabel="Failed TO Logout"
                              star="*"
                              FormField={
                                <CustomInputField
                                  type="text"
                                  disabled={true}
                                  name="failedToLogout"
                                  {...getFieldProps("failedToLogout")}
                                  value={attendanceData.failedToLogout}
                                />
                              }
                            />
                            <CustomFormGroup
                              formlabel="Absent"
                              star="*"
                              FormField={
                                <CustomInputField
                                  type="text"
                                  disabled={true}
                                  name="absent"
                                  {...getFieldProps("absent")}
                                  value={attendanceData.absent}
                                />
                              }
                            />
                            <CustomFormGroup
                              formlabel="Medical Leave"
                              FormField={
                                <CustomInputField
                                  type="text"
                                  name="med_leave"
                                  {...getFieldProps("med_leave")}
                                  value={initialValueForm.med_leave}
                                  onChange={handleInputChange}
                                />
                              }
                            />
                            <CustomFormGroup
                              formlabel="Paid Leave"
                              FormField={
                                <CustomInputField
                                  type="text"
                                  name="paid_leave"
                                  {...getFieldProps("paid_leave")}
                                  value={initialValueForm.paid_leave}
                                  onChange={handleInputChange}
                                />
                              }
                            />
                          </Row>
                        </Card.Body>
                      </Card>
                      <Card className="my-3">
                        <Card.Body>
                          <Row className="my-3 align-items-center">
                            <Card.Title style={{ fontSize: "19px" }}>
                              Bank Details :-
                            </Card.Title>
                            <CustomFormGroup
                              formlabel="Bank Name"
                              star="*"
                              FormField={
                                <CustomInputField
                                  type="text"
                                  disabled={true}
                                  name="bank_name"
                                  {...getFieldProps("bank_name")}
                                  value={initialValueForm.bank_name}
                                />
                              }
                            />

                            <CustomFormGroup
                              formlabel="Bank Branch"
                              star="*"
                              FormField={
                                <CustomInputField
                                  type="text"
                                  disabled={true}
                                  name="bank_branch"
                                  {...getFieldProps("bank_branch")}
                                  value={initialValueForm.bank_branch}
                                />
                              }
                            />

                            <CustomFormGroup
                              formlabel="Accout Name"
                              star="*"
                              FormField={
                                <CustomInputField
                                  type="text"
                                  disabled={true}
                                  name="ac_name"
                                  {...getFieldProps("ac_name")}
                                  value={initialValueForm.ac_name}
                                />
                              }
                            />

                            <CustomFormGroup
                              formlabel="Account No"
                              star="*"
                              FormField={
                                <CustomInputField
                                  type="text"
                                  disabled={true}
                                  name="account_no"
                                  {...getFieldProps("account_no")}
                                  value={initialValueForm.account_no}
                                />
                              }
                            />

                            <CustomFormGroup
                              formlabel="IFSC Code"
                              star="*"
                              FormField={
                                <CustomInputField
                                  type="text"
                                  disabled={true}
                                  name="ifsc_code"
                                  {...getFieldProps("ifsc_code")}
                                  value={initialValueForm.ifsc_code}
                                />
                              }
                            />
                            <CustomFormGroup
                              formlabel="PF Number"
                              star="*"
                              FormField={
                                <CustomInputField
                                  type="text"
                                  disabled={true}
                                  name="pf_no"
                                  {...getFieldProps("pf_no")}
                                  value={initialValueForm.pf_no}
                                />
                              }
                            />
                          </Row>
                        </Card.Body>
                      </Card>
                      <Card className="my-3">
                        <Card.Body>
                          <Row className="mt-3 mb-3 align-items-center ">
                            <h5>Payment Details :-</h5>
                            <CustomFormGroup
                              formlabel="Basic Pay"
                              star="*"
                              FormField={
                                <CustomInputField
                                  type="text"
                                  name="basic_salary"
                                  {...getFieldProps("basic_salary")}
                                  value={initialValueForm.basic_salary}
                                  onChange={handleInputChange}
                                />
                              }
                            />
                            <CustomFormGroup
                              formlabel="HRA"
                              FormField={
                                <CustomInputField
                                  type="text"
                                  name="hra"
                                  {...getFieldProps("hra")}
                                  value={initialValueForm.hra}
                                  onChange={handleInputChange}
                                />
                              }
                            />
                            <CustomFormGroup
                              formlabel="Medical Allowance"
                              FormField={
                                <CustomInputField
                                  type="text"
                                  name="medical_allowance"
                                  value={initialValueForm.medical_allowance}
                                  onChange={handleInputChange}
                                />
                              }
                            />
                            <CustomFormGroup
                              formlabel="Travel Allowance"
                              FormField={
                                <CustomInputField
                                  type="text"
                                  name="travel_allowance"
                                  value={initialValueForm.travel_allowance}
                                  onChange={handleInputChange}
                                />
                              }
                            />
                            <CustomFormGroup
                              formlabel="Special Allowance"
                              FormField={
                                <CustomInputField
                                  type="text"
                                  name="special_allowance"
                                  value={initialValueForm.special_allowance}
                                  onChange={handleInputChange}
                                />
                              }
                            />
                            <CustomFormGroup
                              formlabel="Incentive"
                              FormField={
                                <CustomInputField
                                  type="text"
                                  name="Incentive"
                                  value={initialValueForm.Incentive}
                                  onChange={handleInputChange}
                                />
                              }
                            />

                            {/* <CustomFormGroup
                            formlabel="Gross Salary"
                            star="*"
                            FormField={
                              <CustomInputField
                                type="text"
                                name="gross_earnings"
                                {...getFieldProps("gross_earnings")}
                                value={initialValueForm.gross_earnings}
                              />
                            }
                          /> */}
                          </Row>
                        </Card.Body>
                      </Card>
                      <Divider />
                      <Card className="my-3">
                        <Card.Body>
                          <Row className="mt-3 mb-3 align-items-center ">
                            <h5>Tax Details :-</h5>
                            <CustomFormGroup
                              formlabel="Loss of Pay"
                              star="*"
                              FormField={
                                <CustomInputField
                                  type="text"
                                  name="loss_of_pay"
                                  disabled={true}
                                  {...getFieldProps("loss_of_pay")}
                                  value={initialValueForm.loss_of_pay}
                                  onChange={handleInputChange}
                                />
                              }
                            />

                            <CustomFormGroup
                              formlabel="Professional Tax"
                              FormField={
                                <CustomInputField
                                  type="text"
                                  name="profession_tax"
                                  value={initialValueForm.profession_tax}
                                  onChange={handleInputChange}
                                />
                              }
                            />
                            <CustomFormGroup
                              formlabel="PF Amount"
                              FormField={
                                <CustomInputField
                                  type="text"
                                  name="pf_amount"
                                  value={initialValueForm.pf_amount}
                                  onChange={handleInputChange}
                                />
                              }
                            />
                            <CustomFormGroup
                              formlabel="TDS"
                              FormField={
                                <CustomInputField
                                  type="text"
                                  name="tds"
                                  value={initialValueForm.tds}
                                  onChange={handleInputChange}
                                />
                              }
                            />
                            <CustomFormGroup
                              formlabel="ESIC"
                              FormField={
                                <CustomInputField
                                  type="text"
                                  name="ESIC"
                                  value={initialValueForm.ESIC}
                                  onChange={handleInputChange}
                                />
                              }
                            />
                            
                            <CustomFormGroup
                            formlabel="Other Deductions"
                            star="*"
                            FormField={
                              <CustomInputField
                                type="text"
                                name="other_deduction"
                                value={initialValueForm.other_deduction}
                                onChange={handleInputChange}
                              />
                            }
                          />
                          </Row>
                        </Card.Body>
                      </Card>
                      <Card className="my-3">
                        <Card.Body>
                          <Row className="mt-3 mb-3 align-items-center ">
                            <h5>Amounts :-</h5>
                            <CustomFormGroup
                              formlabel="Gross Salary"
                              FormField={
                                <CustomInputField
                                  type="text"
                                  name="gross_earnings"
                                  disabled={true}
                                  {...getFieldProps("gross_earnings")}
                                  value={initialValueForm.gross_earnings}
                                />
                              }
                            />
                            <CustomFormGroup
                              formlabel="Total Deductions"
                              FormField={
                                <CustomInputField
                                  type="text"
                                  name="total_deductions"
                                  disabled={true}
                                  {...getFieldProps("total_deductions")}
                                  value={initialValueForm.total_deductions}
                                />
                              }
                            />
                            <Divider />
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                                borderRadius: "8px",
                              }}
                            >
                              <CustomFormGroup
                                formlabel="Net Salary"
                                star="*"
                                FormField={
                                  <CustomInputField
                                    type="text"
                                    name="net_pay_amount"
                                    disabled={true}
                                    {...getFieldProps("net_pay_amount")}
                                    value={initialValueForm.net_pay_amount}
                                  />
                                }
                              />
                              <div
                                style={{
                                  width: "100%",
                                  padding: "15px",
                                  backgroundColor: "#ffffff",
                                  borderRadius: "6px",
                                  textAlign: "center",
                                  maxWidth: "600px",

                                  boxShadow: "0 2px 6px rgba(0, 0, 0, 0.08)",
                                }}
                              >
                                <strong
                                  style={{ fontSize: "16px", color: "#333" }}
                                >
                                  Amount in Words:
                                </strong>
                                <span
                                  style={{
                                    marginLeft: "8px",
                                    fontSize: "16px",
                                    color: "#555",
                                  }}
                                >
                                  {initialValueForm.amountInWords || "N/A"}
                                </span>
                              </div>
                            </div>
                          </Row>
                        </Card.Body>
                      </Card>
                      <Button
                        variant="outlined"
                        onClick={handleOpenPreview}
                        sx={{ ml: 2, mt: 3 }}
                      >
                        Preview Payslip
                      </Button>
                      <PreviewPayslip
                        open={openPreview}
                        handleClose={handleClosePreview}
                        initialValueForm={initialValueForm}
                        selectedDate={selectedDate}
                        dispatch={dispatch}
                      />
                    </>
                  )}
                </div>
              </Form>{" "}
            </>
          );
        }}
      </Formik>
    </>
  );
};

// Exporting the UserAttendance component as the default export
export default UserAttendance;
