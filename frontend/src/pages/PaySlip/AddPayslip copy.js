// import React, { useEffect, useState } from "react";
// import dayjs from "dayjs";
// import Cookies from "js-cookie";
// import { useQuery } from "react-query";
// import { Formik, Form } from "formik";

// import Breadcrumb from "../../components/Breadcrumb/Breadcrumb";
// import UserAttendanceLocation from "../../components/Attendance/UserAttendanceLocation";
// import { useBootstrap, useMui } from "../../hooks/Hooks";
// import {
//   getAttendancePolicy,
//   useFilterAttendanceReport,
//   fetchAllUsers,
//   useAddEditAttendance,
//   useDeleteAttendance,
// } from "../../hooks/Attendance/UseAttendanceHook";
// import {
//   CustomFormGroup,
//   CustomInputField,
//   CustomMultipleSelectField,
//   CustomSelectField,
// } from "../../components/FormUtility/FormUtility";
// import {
//   CreateLabelValueArray,
//   groupBy,
//   usePayslipAutoFillData,
// } from "../../hooks/Function";

// import { UserAttendanceSchema } from "../../schema/Attendance/UserAttendanceSchema";
// import { useProfileById } from "../../hooks/Other/UseProfileHook";

// function convertToAMPMFormat(timeString) {
//   const dummyDate = new Date(`2000-01-01 ${timeString}`);
//   return dummyDate.toLocaleTimeString([], { hour12: true });
// }

// // React functional component named UserAttendance
// const UserAttendance = ({ dispatch, myglobalData, userId }) => {
//   // Destructuring utility functions and components from custom hooks and libraries
//   const { Card, Row, Col, Tabs, Tab, Spinner } = useBootstrap();
//   const {
//     LoadingButton,
//     Alert,
//     Typography,
//     ImageIcon,
//     DomainVerificationIcon,
//     IconButton,
//     EditIcon,
//     AddIcon,
//     NotListedLocationOutlinedIcon,
//     DeleteOutlineRoundedIcon,
//   } = useMui();

//   // State variables for managing form values, filter data, status, pagination, and selected rows
//   const [FilterData, setFilterData] = React.useState([]);
//   const [page, setPage] = React.useState(1);
//   const [pageSize, setPageSize] = React.useState(50);

//   const [selectedImage, setSelectedImage] = React.useState(null);
//   const [showModal, setShowModal] = React.useState({
//     type: "image",
//     show: false,
//     login_time: "",
//     logout_time: "",
//     auid: "",
//     login_date: "",
//     latitude: "",
//     longitude: "",
//   });
//   const [showDeleteModal, setShowDeleteModal] = React.useState({
//     show: false,
//     auid: "",
//   });
//   const [showSuccessMessage, setShowSuccessMessage] = React.useState(null);

//   const [SelectedTabUser, setSelectedTabUser] = React.useState("");
//   const [selectedDate, setSelectedDate] = React.useState({
//     datefrom: "",
//     dateto: "",
//   });
//   const [SelectedUserAttend, setSelectedUserAttend] = React.useState("");
//   const [usernames, setUserNames] = React.useState({});
//   const [dateRange, setDateRange] = React.useState([]);
//   const [slicedPaginationData, setSlicedPaginatonData] = React.useState([]);
//   // const [holidays, setHolidays] = React.useState([]);
//   const [attendanceData, setAttendanceData] = React.useState({
//     totalDays: 0,
//     fullDay: 0,
//     halfDay: 0,
//     failedToLogout: 0,
//     absent: 0,
//     lateMark: 0,
//     weeklyOff: 0,
//     workingDays: 0,
//     workedDays: 0,
//     no_of_holidays: 0,
//   });

//   // Custom hook for handling filter calling report data
//   const { mutate, isLoading } = useFilterAttendanceReport();
//   const { mutate: addEditMutate, isLoading: addEditIsLoading } =
//     useAddEditAttendance();
//   const { mutate: DeleteMutate, isLoading: DeleteisLoading } =
//     useDeleteAttendance();
//   const [userDetails, setUserDetails] = useState({});
//   // State variable for resetting the form
//   const [ResetForm, setResetForm] = React.useState(false);
//   const [customIsLoading, setCustomIsLoading] = useState(false);
//   const [userProfile, setUserProfile] = useState({});

//   // Query for fetching all users list
//   // const AllUsersAttend = useQuery("AllUsersList", fetchAllUsers);
//   const AttendancePolicy = useQuery("AttendancePolicy", getAttendancePolicy);

//   const { data: allUsersData, error } = useQuery("AllUsersList", fetchAllUsers);

//   const empData = allUsersData?.data?.map((user) => ({
//     label: user.username,
//     value: user.id,
//   }));

//   const generateDateRange = (startDate, endDate, userId) => {
//     const start = new Date(startDate);
//     const end = new Date(endDate);
//     const range = [];
//     let emptyItem = {
//       auid: 0,
//       desk_image_login: "",
//       desk_image_logout: "",
//       login_date: "",
//       login_time: "",
//       logout_date: "",
//       logout_time: "",
//       system_ip: "",
//       u_id: userId,
//       login_location: "",
//       logout_location: "",
//       username: usernames[userId],
//     };

//     const daysOfWeek = [
//       "Sunday",
//       "Monday",
//       "Tuesday",
//       "Wednesday",
//       "Thursday",
//       "Friday",
//       "Saturday",
//     ];
//     let count = 1;
//     let inTime = AttendancePolicy?.data?.data["Intime"]?.policy;
//     let outTime = AttendancePolicy?.data?.data["Outtime"]?.policy;
//     let lateMark = AttendancePolicy?.data?.data["Late Mark"]?.policy;
//     let weeklyOffDays =
//       AttendancePolicy?.data?.data["Weekly OFF"]?.policy?.split(",");
//     let holidayArray =
//       AttendancePolicy?.data?.data["Public Holidays"].policy?.split(",");
//     if (lateMark && lateMark.includes(",")) {
//       lateMark = lateMark.split(",");
//     }
//     let formatOutTimeString = "HH:mm:ss";
//     let formatInTimeString = "HH:mm:ss";

//     let parsedInTime = dayjs(`1970-01-01 ${inTime}`);
//     let parsedOutTime = dayjs(`1970-01-01 ${outTime}`);

//     let newInTime = parsedInTime.add(
//       lateMark && lateMark.length > 0 ? lateMark[0] : 0,
//       "minute"
//     );
//     let newOutTime = parsedOutTime.subtract(
//       lateMark && lateMark.length > 0 ? lateMark[1] : 0,
//       "minute"
//     );

//     let lateMarkInTime = newInTime.format(formatInTimeString);
//     let lateMarkOutTime = newOutTime.format(formatOutTimeString);

//     const simplifiedHolidayArray = holidayArray?.map(
//       (holiday) => holiday.split(":")[0]
//     );

//     for (let date = start; date <= end; date.setDate(date.getDate() + 1)) {
//       const formattedDate = date.toISOString().slice(0, 10); // Get YYYY-MM-DD
//       const formatdate = new Date(formattedDate);
//       let day = daysOfWeek[formatdate.getDay()];
//       let status = "";
//       let TotalMinutes = 0;
//       let totalDifference = 0;
//       let totalDifferenceHours = 0;
//       let TotalHours = 0;
//       let statusColor = "#ed5565";
//       let items =
//         FilterData[formattedDate] && FilterData[formattedDate].length > 0
//           ? FilterData[formattedDate]
//           : [emptyItem];
//       if (
//         FilterData[formattedDate] &&
//         FilterData[formattedDate].length > 0 &&
//         FilterData[formattedDate]
//       ) {
//         items.forEach((element) => {
//           const loginDate = new Date(
//             `${element.login_date} ${element.login_time}`
//           );
//           const logoutDate = new Date(
//             `${element.logout_date} ${element.logout_time}`
//           );

//           const toTime = loginDate.getTime();
//           const fromTime = logoutDate.getTime();

//           if (
//             element.login_time !== "00:00:00" &&
//             element.logout_time !== "00:00:00" &&
//             element.login_time !== "" &&
//             element.logout_time !== ""
//           ) {
//             const difference = Math.abs(fromTime - toTime) / (1000 * 60); // in minutes
//             const differenceInMinutes =
//               Math.abs(fromTime - toTime) / (1000 * 60);
//             const differenceInHours = differenceInMinutes / 60; // converting minutes to hours

//             totalDifferenceHours += differenceInHours;
//             totalDifference += difference;
//           }
//         });
//         TotalMinutes = totalDifference.toFixed(2);
//         TotalHours = totalDifferenceHours.toFixed(2);
//       }

//       if (
//         holidayArray.length > 0 &&
//         simplifiedHolidayArray.includes(
//           dayjs(formattedDate).format("MM/DD/YYYY")
//         ) &&
//         AttendancePolicy?.data?.data["Public Holidays"]?.status === "ON"
//       ) {
//         // status = "Holiday";
//         status =
//           holidayArray[
//             simplifiedHolidayArray.indexOf(
//               dayjs(formattedDate).format("MM/DD/YYYY")
//             )
//           ].split(":")[1];
//         statusColor = AttendancePolicy?.data?.data["Public Holidays"]?.color;
//         setAttendanceData((prevState) => ({
//           ...prevState,
//           no_of_holidays: prevState.no_of_holidays + 1,
//         }));
//       } else if (
//         TotalMinutes === 0 &&
//         items[items.length - 1].logout_time !== "00:00:00" &&
//         AttendancePolicy?.data?.data["Absent"]?.status === "ON"
//       ) {
//         status = "Absent";
//         statusColor = AttendancePolicy?.data?.data["Absent"]?.color;
//         if (!weeklyOffDays.includes(day)) {
//           setAttendanceData((prevState) => ({
//             ...prevState,
//             absent: prevState.absent + 1,
//           }));
//         }
//       } else if (
//         items[0].login_time !== "00:00:00" &&
//         items[items.length - 1].logout_time === "00:00:00" &&
//         AttendancePolicy?.data?.data["Failed to Logout"]?.status === "ON"
//       ) {
//         if (
//           weeklyOffDays.includes(day) &&
//           AttendancePolicy?.data?.data["Weekly OFF"]?.status === "ON"
//         ) {
//           status = "Weekly OFF";
//           statusColor = AttendancePolicy?.data?.data["Weekly OFF"]?.color;
//         } else {
//           status = "Failed to Logout";
//           statusColor = AttendancePolicy?.data?.data["Failed to Logout"]?.color;
//           setAttendanceData((prevState) => ({
//             ...prevState,
//             failedToLogout: prevState.failedToLogout + 1,
//           }));
//         }
//       } else if (
//         ((items[0].login_time > lateMarkInTime &&
//           AttendancePolicy?.data?.data["Intime"]?.status === "ON") ||
//           (items[items.length - 1].logout_time < lateMarkOutTime &&
//             AttendancePolicy?.data?.data["Outtime"]?.status === "ON")) &&
//         Number(TotalHours) >=
//           Number(AttendancePolicy?.data?.data["Full Day"]?.policy) &&
//         AttendancePolicy?.data?.data["Late Mark"]?.status === "ON"
//       ) {
//         if (
//           weeklyOffDays.includes(day) &&
//           AttendancePolicy?.data?.data["Weekly OFF"]?.status === "ON"
//         ) {
//           status = "Weekly OFF";
//           statusColor = AttendancePolicy?.data?.data["Weekly OFF"]?.color;
//         } else {
//           status = "Late Mark";
//           statusColor = AttendancePolicy?.data?.data["Late Mark"]?.color;
//           setAttendanceData((prevState) => ({
//             ...prevState,
//             lateMark: prevState.lateMark + 1,
//           }));
//         }
//       } else if (
//         Number(TotalHours) >=
//           Number(AttendancePolicy?.data?.data["Full Day"]?.policy) &&
//         AttendancePolicy?.data?.data["Full Day"]?.status === "ON"
//       ) {
//         if (
//           weeklyOffDays.includes(day) &&
//           AttendancePolicy?.data?.data["Weekly OFF"]?.status === "ON"
//         ) {
//           status = "Weekly OFF";
//           statusColor = AttendancePolicy?.data?.data["Weekly OFF"]?.color;
//         } else {
//           status = "Full Day";
//           statusColor = AttendancePolicy?.data?.data["Full Day"]?.color;
//           setAttendanceData((prevState) => ({
//             ...prevState,
//             fullDay: prevState.fullDay + 1,
//           }));
//         }
//       } else if (
//         Number(TotalHours) >=
//           Number(AttendancePolicy?.data?.data["Half Day"]?.policy) &&
//         AttendancePolicy?.data?.data["Half Day"]?.status === "ON"
//       ) {
//         if (
//           weeklyOffDays.includes(day) &&
//           AttendancePolicy?.data?.data["Weekly OFF"]?.status === "ON"
//         ) {
//           status = "Weekly OFF";
//           statusColor = AttendancePolicy?.data?.data["Weekly OFF"]?.color;
//         } else {
//           status = "Half Day";
//           statusColor = AttendancePolicy?.data?.data["Half Day"]?.color;
//           setAttendanceData((prevState) => ({
//             ...prevState,
//             halfDay: prevState.halfDay + 1,
//           }));
//         }
//       } else {
//         status = "Absent";
//         statusColor = AttendancePolicy?.data?.data["Absent"]?.color;
//         if (!weeklyOffDays.includes(day)) {
//           setAttendanceData((prevState) => ({
//             ...prevState,
//             absent: prevState.absent + 1,
//           }));
//         }
//       }
//       if (
//         weeklyOffDays.includes(day) &&
//         AttendancePolicy?.data?.data["Weekly OFF"]?.status === "ON"
//       ) {
//         status = "Weekly OFF";
//         statusColor = AttendancePolicy?.data?.data["Weekly OFF"]?.color;
//         setAttendanceData((prevState) => ({
//           ...prevState,
//           weeklyOff: prevState.weeklyOff + 1,
//         }));
//         if (TotalMinutes === 0) {
//           TotalMinutes = "";
//           TotalHours = "";
//           // status = "";
//           // statusColor = "#ed5565";
//         }
//       }
//       range.push({
//         date: dayjs(formattedDate).format("DD-MM-YYYY"),
//         Day: `${day}`,
//         items,
//         TotalMinutes,
//         TotalHours,
//         status,
//         statusColor,
//       });
//       count++;
//     }
//     setAttendanceData((prevState) => ({
//       ...prevState,
//       totalDays: count - 1,
//       workingDays: count - prevState.weeklyOff - prevState.no_of_holidays - 1,
//       workedDays:
//         prevState.fullDay +
//         prevState.halfDay +
//         prevState.failedToLogout +
//         prevState.lateMark,
//     }));
//     return range;
//   };

//   const handlePageChange = (newPage) => {
//     setPage(newPage);
//   };

//   const [isDataVisible, setIsDataVisible] = useState(false);

//   const handlePageSizeChange = (newSize) => {
//     setPageSize(newSize);
//   };
//   // console.log(attendanceData, "attendanceData");

//   // Function to handle form submission
//   const HandleSubmitAttend = (values) => {
//     const allUsernames = {};

//     // Map user ids to usernames once
//     allUsersData?.data?.forEach((user) => {
//       allUsernames[user.id] = user.username;
//     });

//     const formValues = { ...values, user: values.user };

//     mutate(formValues, {
//       onSuccess: (data) => {
//         setSelectedUserAttend(values.user);

//         if (Object.keys(allUsernames).length !== 0) {
//           setUserNames(allUsernames);
//         }

//         setPage(1);
//         setSelectedTabUser(values.user);
//         setSelectedDate({
//           datefrom: values.start_date,
//           dateto: values.end_date,
//         });

//         if (data?.data === "Need to Add Do Intime") {
//           setFilterData([]);
//         } else {
//           const groupedData = groupBy(
//             data?.data?.map((row) => ({
//               auid: row.auid,
//               desk_image_login: row.desk_image_login,
//               desk_image_logout: row.desk_image_logout,
//               login_date: row.login_date,
//               login_time: row.login_time,
//               logout_date: row.logout_date,
//               logout_time: row.logout_time,
//               system_ip: row.system_ip,
//               u_id: row.u_id,
//               login_location: row.login_location,
//               logout_location: row.logout_location,
//               username: allUsernames[row.u_id] || row.u_id,
//             })),
//             "login_date"
//           );

//           setFilterData(groupedData);
//         }
//       },
//     });
//     setIsDataVisible(true);
//   };

//   React.useEffect(() => {
//     setCustomIsLoading(true);
//     setAttendanceData({
//       totalDays: 0,
//       fullDay: 0,
//       halfDay: 0,
//       failedToLogout: 0,
//       absent: 0,
//       lateMark: 0,
//       weeklyOff: 0,
//       workingDays: 0,
//       workedDays: 0,
//       no_of_holidays: 0,
//     });
//     setDateRange(
//       generateDateRange(
//         selectedDate.datefrom,
//         selectedDate.dateto,
//         SelectedTabUser
//       )
//     );
//     const interval = setInterval(() => {
//       setCustomIsLoading(false);
//     }, 1000);
//     return () => clearInterval(interval);
//   }, [FilterData, SelectedTabUser]);

//   React.useEffect(() => {
//     if (dateRange.length > 0) {
//       setCustomIsLoading(true);
//       let slicedPaginationData = dateRange.slice(0, pageSize);
//       if (dateRange.length > pageSize) {
//         slicedPaginationData = dateRange.slice(
//           (page - 1) * pageSize,
//           page * pageSize
//         );
//       }
//       setSlicedPaginatonData(slicedPaginationData);
//     }
//     const interval = setInterval(() => {
//       setCustomIsLoading(false);
//     }, 1000);
//     return () => clearInterval(interval);
//   }, [dateRange, page, pageSize, FilterData]);

//   const [initialValueForm, setInitialValueForm] = useState({
//     user: "",
//     start_date: "",
//     end_date: "",
//     emp_name: "",
//     p_name: "",
//     join_date: "",
//     email: "",
//     ccode: "",
//     mob: "",
//     designation: "",
//     department: "",
//     location: "",
//     bank_name: "",
//     pf_no: "",
//     pan_no: "",
//     ac_no: "",
//     basic_pay: 0,
//     hra: 0,
//     medical_allowance: 0,
//     travel_allowance: 0,
//     special_allowance: 0,
//     profession_tax: 0,
//     pf_amount: 0,
//     other_deduction: 0,
//     gross_earnings: 0,
//     net_pay_amount: 0,
//     total_deductions: 0,
//     net_pay_words: "",
//     other_details: "",
//     incentive: 0,
//     tds: 0,
//     total_days: 0,
//     working_days: 0,
//     weekly_off: 0,
//     holidays: 0,
//     full_days: 0,
//     half_day: 0,
//     forget_to_logout: 0,
//     absent_days: 0,
//     late_mark: "",
//   });

//   const {
//     mutate: fetchProfileById,
//     data,
//     isSuccess,
//     isError,
//   } = useProfileById();
//   const [profileData, setProfileData] = useState("");

//   useEffect(() => {
//     if (userId) {
//       fetchProfileById(userId);
//     }
//   }, [userId, fetchProfileById]);

//   useEffect(() => {
//     if (isSuccess && data) {
//       // Format data for display
//       const formattedData = JSON.stringify(data, null, 2);
//       setProfileData(formattedData);
//     }
//   }, [isSuccess, data]);

//   useEffect(() => {
//     if (userDetails && userDetails.u_id) {
//       setInitialValueForm((prevForm) => ({
//         ...prevForm,
//         user: userDetails.u_id,
//         emp_name: SelectedUserAttend,
//         p_name: userDetails.fname
//           ? `${userDetails.fname} ${userDetails.mname || ""} ${
//               userDetails.lname || ""
//             }`
//           : "",
//         email: userDetails.p_email,
//         ccode: userDetails.p_ccode,
//         mob: userDetails.p_mob,
//         designation: userDetails.designation,
//         department: userDetails.department,
//         location: userDetails.location,
//         bank_name: userDetails.bank_name,
//         // Update other fields as needed
//       }));
//     }
//   }, [userDetails, setSelectedUserAttend]);

//   useEffect(() => {
//     setInitialValueForm((prevForm) => ({
//       ...prevForm,
//       total_days: attendanceData.totalDays,
//       working_days: attendanceData.workingDays,
//       weekly_off: attendanceData.weeklyOff,
//       holidays: attendanceData.no_of_holidays,
//       full_days: attendanceData.fullDay,
//       half_day: attendanceData.halfDay,
//       forget_to_logout: attendanceData.failedToLogout,
//       absent_days: attendanceData.absent,
//       late_mark: attendanceData.lateMark,
//     }));
//   }, [attendanceData]);

//   // console.log(attendanceData, "attendanceDataSMDdDDdDdD");
//   console.log(initialValueForm, "initialValueFormSMDdDDdDdD");

//   // Render component with form, breadcrumb, and calling report table
//   return (
//     <>
//       {/* Breadcrumb component for page navigation */}
//       <Breadcrumb PageName="Pay Slip Reports" />
//       {/* Card component for organizing content */}
//       <Formik
//         initialValues={initialValueForm}
//         onSubmit={HandleSubmitAttend}
//         // validationSchema={UserAttendanceSchema}
//       >
//         {({ values, setFieldValue, getFieldProps }) => {
//           console.log(values);
//           return (
//             <>
//               <div>{isSuccess && <p>{profileData}</p>}</div>
//               <Form className="mt-3">
//                 <div className="text-end">
//                   <LoadingButton
//                     variant="contained"
//                     type="submit"
//                     loading={isLoading}
//                     sx={{ mr: 2 }}
//                   >
//                     Search Reports
//                   </LoadingButton>
//                   <LoadingButton
//                     variant="contained"
//                     type="button"
//                     onClick={() => {
//                       setResetForm(true);
//                       values.start_date = "";
//                       values.end_date = "";
//                       setTimeout(() => {
//                         setResetForm(false);
//                       }, 10);
//                       setSelectedUserAttend([]);
//                       setDateRange([]);
//                     }}
//                   >
//                     Reset Search Default
//                   </LoadingButton>
//                 </div>
//                 <Row className="mb-5">
//                   <Col md={3}>
//                     <CustomSelectField
//                       name="user"
//                       FieldValue={(name, value) => {
//                         console.log(value, "value");
//                         setSelectedUserAttend(value);
//                         return setFieldValue(name, value);
//                       }}
//                       isLabelValue={true}
//                       placeholder="Enter Your Name"
//                       options={empData || []}
//                     />
//                   </Col>
//                   <Col md={3}>
//                     <CustomInputField
//                       type="date"
//                       name="start_date"
//                       {...getFieldProps("start_date")}
//                       resetField={ResetForm}
//                     />
//                   </Col>
//                   <Col md={3}>
//                     <CustomInputField
//                       type="date"
//                       name="end_date"
//                       {...getFieldProps("end_date")}
//                       resetField={ResetForm}
//                     />
//                   </Col>
//                 </Row>
//                 <div>
//                 {isDataVisible && (
//                     <div>
//                       <p>HEY</p>
//                       <p>Total Days: {attendanceData.totalDays}</p>
//                       <p>Working Days: {attendanceData.workingDays}</p>
//                       <p>Weekly Off: {attendanceData.weeklyOff}</p>
//                       <p>Holidays: {attendanceData.no_of_holidays}</p>
//                       <p>Full Days: {attendanceData.fullDay}</p>
//                       <p>Half Day: {attendanceData.halfDay}</p>
//                       <p>Forget to Logout: {attendanceData.failedToLogout}</p>
//                       <p>Absent Days: {attendanceData.absent}</p>
//                       <p>Late Mark: {attendanceData.lateMark}</p>
//                       <CustomFormGroup
//                         formlabel="Total Days"
//                         star="*"
//                         FormField={
//                           <CustomInputField
//                             type="text"
//                             disabled={true}
//                             name="totalDays"
//                             {...getFieldProps("totalDays")}
//                             value={attendanceData.totalDays}
//                           />
//                         }
//                       />
//                       <CustomFormGroup
//                         formlabel="Total Working Days"
//                         star="*"
//                         FormField={
//                           <CustomInputField
//                             type="text"
//                             disabled={true}
//                             name="workingDays"
//                             {...getFieldProps("workingDays")}
//                             value={attendanceData.workingDays}
//                           />
//                         }
//                       />
//                       <CustomFormGroup
//                         formlabel="Weekly Off"
//                         star="*"
//                         FormField={
//                           <CustomInputField
//                             type="text"
//                             disabled={true}
//                             name="weeklyOff"
//                             {...getFieldProps("weeklyOff")}
//                             value={attendanceData.weeklyOff}
//                           />
//                         }
//                       />
//                       <CustomFormGroup
//                         formlabel="Holidays"
//                         star="*"
//                         FormField={
//                           <CustomInputField
//                             type="text"
//                             disabled={true}
//                             name="no_of_holidays"
//                             {...getFieldProps("no_of_holidays")}
//                             value={attendanceData.no_of_holidays}
//                           />
//                         }
//                       />
//                       <CustomFormGroup
//                         formlabel="Worked Days"
//                         star="*"
//                         FormField={
//                           <CustomInputField
//                             type="text"
//                             disabled={true}
//                             name="workedDays"
//                             {...getFieldProps("workedDays")}
//                             value={attendanceData.workedDays}
//                           />
//                         }
//                       />
//                       <CustomFormGroup
//                         formlabel="Half Days"
//                         star="*"
//                         FormField={
//                           <CustomInputField
//                             type="text"
//                             disabled={true}
//                             name="halfDay"
//                             {...getFieldProps("halfDay")}
//                             value={attendanceData.halfDay}
//                           />
//                         }
//                       />
//                       <CustomFormGroup
//                         formlabel="Late Mark"
//                         star="*"
//                         FormField={
//                           <CustomInputField
//                             type="text"
//                             disabled={true}
//                             name="lateMark"
//                             {...getFieldProps("lateMark")}
//                             value={attendanceData.lateMark}
//                           />
//                         }
//                       />
//                       <CustomFormGroup
//                         formlabel="Failed TO Logout"
//                         star="*"
//                         FormField={
//                           <CustomInputField
//                             type="text"
//                             disabled={true}
//                             name="failedToLogout"
//                             {...getFieldProps("failedToLogout")}
//                             value={attendanceData.failedToLogout}
//                           />
//                         }
//                       />
//                       <CustomFormGroup
//                         formlabel="Absent"
//                         star="*"
//                         FormField={
//                           <CustomInputField
//                             type="text"
//                             disabled={true}
//                             name="absent"
//                             {...getFieldProps("absent")}
//                             value={attendanceData.absent}
//                           />
//                         }
//                       />
//                     </div>
//                   )}
//                 </div>
//               </Form>

//               {/* <Card className="mt-3 calling-report-table-card">
//               {SelectedUserAttend.length > 0 && (
//                 <>
//                   <CustomFormGroup
//                     formlabel="Total Days"
//                     star="*"
//                     FormField={
//                       <CustomInputField
//                         type="text"
//                         disabled={true}
//                         name="totalDays"
//                         {...getFieldProps("totalDays")}
//                         value={attendanceData.totalDays}
//                       />
//                     }
//                   />
//                   <CustomFormGroup
//                     formlabel="Total Working Days"
//                     star="*"
//                     FormField={
//                       <CustomInputField
//                         type="text"
//                         disabled={true}
//                         name="workingDays"
//                         {...getFieldProps("workingDays")}
//                         value={attendanceData.workingDays}
//                       />
//                     }
//                   />
//                   <CustomFormGroup
//                     formlabel="Weekly Off"
//                     star="*"
//                     FormField={
//                       <CustomInputField
//                         type="text"
//                         disabled={true}
//                         name="weeklyOff"
//                         {...getFieldProps("weeklyOff")}
//                         value={attendanceData.weeklyOff}
//                       />
//                     }
//                   />
//                   <CustomFormGroup
//                     formlabel="Holidays"
//                     star="*"
//                     FormField={
//                       <CustomInputField
//                         type="text"
//                         disabled={true}
//                         name="no_of_holidays"
//                         {...getFieldProps("no_of_holidays")}
//                         value={attendanceData.no_of_holidays}
//                       />
//                     }
//                   />
//                   <CustomFormGroup
//                     formlabel="Worked Days"
//                     star="*"
//                     FormField={
//                       <CustomInputField
//                         type="text"
//                         disabled={true}
//                         name="workedDays"
//                         {...getFieldProps("workedDays")}
//                         value={attendanceData.workedDays}
//                       />
//                     }
//                   />
//                   <CustomFormGroup
//                     formlabel="Half Days"
//                     star="*"
//                     FormField={
//                       <CustomInputField
//                         type="text"
//                         disabled={true}
//                         name="halfDay"
//                         {...getFieldProps("halfDay")}
//                         value={attendanceData.halfDay}
//                       />
//                     }
//                   />
//                   <CustomFormGroup
//                     formlabel="Late Mark"
//                     star="*"
//                     FormField={
//                       <CustomInputField
//                         type="text"
//                         disabled={true}
//                         name="lateMark"
//                         {...getFieldProps("lateMark")}
//                         value={attendanceData.lateMark}
//                       />
//                     }
//                   />
//                   <CustomFormGroup
//                     formlabel="Failed TO Logout"
//                     star="*"
//                     FormField={
//                       <CustomInputField
//                         type="text"
//                         disabled={true}
//                         name="failedToLogout"
//                         {...getFieldProps("failedToLogout")}
//                         value={attendanceData.failedToLogout}
//                       />
//                     }
//                   />
//                   <CustomFormGroup
//                     formlabel="Absent"
//                     star="*"
//                     FormField={
//                       <CustomInputField
//                         type="text"
//                         disabled={true}
//                         name="absent"
//                         {...getFieldProps("absent")}
//                         value={attendanceData.absent}
//                       />
//                     }
//                   />
//                 </>
//               )}
//             </Card> */}
//             </>
//           );
//         }}
//       </Formik>
//     </>
//   );
// };

// // Exporting the UserAttendance component as the default export
// export default UserAttendance;

import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import Breadcrumb from "../../components/Breadcrumb/Breadcrumb";
import {
  CustomFormGroup,
  CustomInputField,
  CustomMobileFiled,
  CustomSelectField,
  CustomTextareaField,
} from "../../components/FormUtility/FormUtility";
import { daysInMonth } from "../../data/Columns/Payslip/PayslipColumns";
import { useBootstrap, useMui } from "../../hooks/Hooks";
import "./../../assets/css/PaySlip.css";
import {
  CreateLabelValueArray,
  generateDateRange,
  groupBy,
  numberToWords,
  usePayslipAutoFillData,
} from "./../../hooks/Function";

import { Button } from "@mui/material";
import { useAddPayslip } from "../../hooks/PaySlip/UsePaySlip";
import { getAllUsers } from "../../hooks/Users/useAllUsersHook";
import { PaySlipFormSchema } from "../../schema/PaySlip/PaySlipFormSchema";
import { getYearsData, paysliptomonth } from "./../../data/Addpayslipdata";
import { Ccode } from "../../data/LeadData";
import {

  fetchAllUsers,
  getAttendancePolicy,
  useFilterAttendanceReport,
} from "../../hooks/Attendance/UseAttendanceHook";
import { GetUserDetails } from "../../hooks/Other/UseProfileHook";

const AddPaySlip = ({ dispatch }) => {
  const { Card, Row, Col } = useBootstrap();
  const { Divider, LoadingButton, ArrowBackIosIcon } = useMui();
  const [users, setUsers] = useState([]);
  const [usernames, setUserNames] = React.useState({});
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [basicPay, setBasicPay] = useState(0);

  const queryClient = useQueryClient();
  // useEffect(() => {

  // }, [selectedMonth, selectedUser, selectedYear])
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

  const { data: usersSelected, isLoading } = useQuery(
    "AllUsersList",
    fetchAllUsers
  );

  console.log(usersSelected, "usersSelected");

  // Map users to the required format for CustomSelectField
  const empData = usersSelected?.data?.map((user) => ({
    label: user.username,
    value: user.id,
  }));
  console.log(empData, "empDATTTATATAT");
  const autoFillData = usePayslipAutoFillData(
    selectedMonth,
    selectedYear,
    selectedUser
  );
  // console.log(autoFillData,"autoFillData");
  const initialValues = {
    u_id: autoFillData?.userDetails[0]?.u_id,
    sal_year: selectedYear,
    sal_month: selectedMonth,
    emp_name: selectedUser,
    p_name: autoFillData?.userDetails[0]?.fname
      ? autoFillData?.userDetails[0]?.fname +
        " " +
        autoFillData?.userDetails[0]?.mname +
        " " +
        autoFillData?.userDetails[0]?.lname
      : "",
    join_date: autoFillData?.userDetails[0]?.join_date,
    worked_days: autoFillData.overAllAttendenceData.workedDays,
    working_days: autoFillData.overAllAttendenceData.workingDays,
    weekly_off: autoFillData.overAllAttendenceData.weeklyOff,
    holidays: autoFillData.overAllAttendenceData.no_of_holidays,
    full_days: autoFillData.overAllAttendenceData.fullDay,
    half_day: autoFillData.overAllAttendenceData.halfDay,
    forget_to_logout: autoFillData.overAllAttendenceData.failedToLogout,
    absent_days: autoFillData.overAllAttendenceData.absent,
    // p_name: "",
    email: autoFillData?.userDetails[0]?.p_email,
    ccode: autoFillData?.userDetails[0]?.p_ccode,
    mob: autoFillData?.userDetails[0]?.p_mob,
    designation: autoFillData?.userDetails[0]?.designation,
    department: autoFillData?.userDetails[0]?.department,
    location: autoFillData?.userDetails[0]?.location,
    bank_name: autoFillData?.userDetails[0]?.bank_name,
    pf_no: autoFillData?.userDetails[0]?.pf_no,
    pan_no: autoFillData?.userDetails[0]?.pan_no,
    ac_no: autoFillData?.userDetails[0]?.account_no,
    basic_pay: Number(autoFillData?.userDetails[0]?.basic_salary),
    hra: 0,
    medical_allowance: 0,
    travel_allowance: 0,
    special_allowance: 0,
    profession_tax: 0,
    pf_amount: 0,
    other_deduction:
      (Number(autoFillData?.userDetails[0]?.basic_salary) /
        autoFillData.overAllAttendenceData.workingDays) *
      autoFillData.overAllAttendenceData.absent,
    gross_earnings: Number(autoFillData?.userDetails[0]?.basic_salary),
    net_pay_amount:
      Number(autoFillData?.userDetails[0]?.basic_salary) +
      (Number(autoFillData?.userDetails[0]?.basic_salary) /
        autoFillData.overAllAttendenceData.workingDays) *
        autoFillData.overAllAttendenceData.absent,
    total_deductions:
      (Number(autoFillData?.userDetails[0]?.basic_salary) /
        autoFillData.overAllAttendenceData.workingDays) *
      autoFillData.overAllAttendenceData.absent,
    net_pay_words: numberToWords(
      Number(autoFillData?.userDetails[0]?.basic_salary) +
        (Number(autoFillData?.userDetails[0]?.basic_salary) /
          autoFillData.overAllAttendenceData.workingDays) *
          autoFillData.overAllAttendenceData.absent
    ),
    other_details: "",
    incentive: 0,
    tds: 0,
  };
  console.log(autoFillData, "autoFillData");
  // const empData = CreateLabelValueArray(users, "username", "id");
  const AddPayslip = useAddPayslip();

  const HandleSubmit = async (values) => {
    // const u_id = users.filter((val) => values.emp_name == val.username)[0].id
    console.log(values, "final values");
    values.u_id = selectedUser;
    try {
      AddPayslip.mutate(values, {
        onSuccess: (data) => {
          dispatch({ event: "payslip" });
        },
      });
    } catch (error) {
      console.error("Error in adding Broker", error);
    }
  };

  const yearData = getYearsData();

  const calculateTotalDeduction = (values) => {
    const { profession_tax, pf_amount, tds, other_deduction } = values;
    const total = profession_tax + pf_amount + tds + other_deduction;
    return total;
  };

  const calculateOtherDeduction = (values) => {
    if (values.working_days != 0)
      return (values.basic_pay / values.working_days) * values.absent_days;
  };

  const calculateNetPayAmount = (values) => {
    const { profession_tax, pf_amount, tds, other_deduction } = values;
    const totalDeduction = profession_tax + pf_amount + tds + other_deduction;
    const totalEarning =
      values.basic_pay +
      values.incentive +
      values.hra +
      values.medical_allowance +
      values.travel_allowance +
      values.special_allowance;
    const total = totalEarning - totalDeduction;
    return total;
  };

  return (
    <>
      <Breadcrumb
        PageName="Add Payment Slip"
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
      <Formik
        initialValues={initialValues}
        validationSchema={PaySlipFormSchema}
        onSubmit={HandleSubmit}
        enableReinitialize={true}
      >
        {({ values, setFieldValue, errors }) => {
          return (
            <Form>
              <Card>
                <Card.Body>
                  <Card.Title style={{ fontSize: "19px" }}>
                    {" "}
                    Fill Following Details :-{" "}
                  </Card.Title>

                  <Divider />
                  <Row className="my-3 align-items-center">
                    <CustomFormGroup
                      formlabel="Salary for the Month - Year"
                      star="*"
                      FormField={
                        <>
                          <Row>
                            <Col xs={6} md={6}>
                              <CustomSelectField
                                name="sal_month"
                                // FieldValue={setFieldValue}
                                FieldValue={(name, value) => {
                                  setSelectedMonth(value);
                                  return setFieldValue(name, value);
                                }}
                                isLabelValue={true}
                                placeholder="Month"
                                options={paysliptomonth}
                              />
                            </Col>

                            <Col xs={6} md={6}>
                              <CustomSelectField
                                name="sal_year"
                                // FieldValue={setFieldValue}
                                FieldValue={(name, value) => {
                                  setSelectedYear(value);
                                  return setFieldValue(name, value);
                                }}
                                // isLabelValue={true}
                                placeholder="Year"
                                options={yearData}
                              />
                            </Col>
                          </Row>
                        </>
                      }
                    />
                    <CustomFormGroup
                      formlabel="Employee"
                      star="*"
                      FormField={
                        <Col>
                          <CustomSelectField
                            name="emp_name"
                            // FieldValue={setFieldValue}
                            FieldValue={(name, value) => {
                              setSelectedUser(value);
                              return setFieldValue(name, value);
                            }}
                            isLabelValue={true}
                            placeholder="Enter Your Name"
                            options={!AllUsers.isLoading ? empData : null}
                          />
                        </Col>
                      }
                    />

                    <CustomFormGroup
                      formlabel="Name"
                      star="*"
                      FormField={
                        <CustomInputField
                          type="text"
                          disabled={true}
                          name="p_name"
                          placeholder="Enter Name"
                        />
                      }
                    />
                    <CustomMobileFiled
                      name="mob"
                      formlabel="Mobile No."
                      star="*"
                      type="text"
                      placeholder="Mobile No."
                      InputRequired={true}
                      disabled={true}
                      defaultVal={values.mob}
                      // disabled={true}`
                      // onChange={
                      //     (value, data) => {
                      //         setFieldValue("ccode", data.dialCode);
                      //         setFieldValue(
                      //             "mob",
                      //             value.slice(data.dialCode.length)
                      //         );
                      //     }

                      // }
                      options={Ccode}
                      defaultvalue={Ccode[0]}
                    />

                    <CustomFormGroup
                      formlabel="Email"
                      star="*"
                      FormField={
                        <CustomInputField
                          disabled={true}
                          type="text"
                          name="email"
                          placeholder="Enter Email Id."
                          // name="b_country"
                          // placeholder="Select Country"
                          // options={CreateLabelValueArray(
                          //   Country,
                          //   "name",
                          //   "isoCode"
                          // )}
                          // isLabelValue={true}
                          // FieldValue={setFieldValue}
                        />
                      }
                    />

                    <CustomFormGroup
                      formlabel="Designation"
                      star="*"
                      FormField={
                        <CustomInputField
                          disabled={true}
                          type="text"
                          name="designation"
                          placeholder="Enter Designation"
                        />
                      }
                    />
                    <CustomFormGroup
                      formlabel="Department"
                      star="*"
                      FormField={
                        <CustomInputField
                          disabled={true}
                          type="text"
                          name="department"
                          placeholder="Enter Your Department"
                        />
                      }
                    />

                    <CustomFormGroup
                      formlabel="Location "
                      star="*"
                      FormField={
                        <CustomInputField
                          disabled={true}
                          type="text"
                          name="location"
                          placeholder="Enter Locality"
                        />
                      }
                    />

                    <CustomFormGroup
                      formlabel="Join Date "
                      star="*"
                      FormField={
                        <CustomInputField
                          disabled={true}
                          type="date"
                          name="join_date"
                        />
                      }
                    />

                    <CustomFormGroup
                      formlabel="Days Worked "
                      star="*"
                      FormField={
                        <Col xs={12} md={12}>
                          <CustomInputField
                            disabled={true}
                            type="number"
                            name="worked_days"
                            placeholder="Enter Days Worked"
                          />
                        </Col>
                      }
                    />
                    <CustomFormGroup
                      formlabel="Working Days"
                      star="*"
                      FormField={
                        <CustomInputField
                          disabled={true}
                          type="text"
                          name="working_days"
                          placeholder="Enter Working Days"
                        />
                      }
                    />
                    <CustomFormGroup
                      formlabel="Weekly Off"
                      star="*"
                      FormField={
                        <CustomInputField
                          disabled={true}
                          type="text"
                          name="weekly_off"
                          placeholder="Enter Weekly Off"
                        />
                      }
                    />
                    <CustomFormGroup
                      formlabel="Holidays"
                      star="*"
                      FormField={
                        <CustomInputField
                          disabled={true}
                          type="text"
                          name="holidays"
                          placeholder="Enter Holidays"
                        />
                      }
                    />
                    <CustomFormGroup
                      formlabel="Full Days"
                      star="*"
                      FormField={
                        <CustomInputField
                          disabled={true}
                          type="text"
                          name="full_days"
                          placeholder="Enter Full Days"
                        />
                      }
                    />
                    <CustomFormGroup
                      formlabel="Half Days"
                      star="*"
                      FormField={
                        <CustomInputField
                          disabled={true}
                          type="text"
                          name="half_day"
                          placeholder="Enter Half Days"
                        />
                      }
                    />
                    <CustomFormGroup
                      formlabel="Forget To Logout"
                      star="*"
                      FormField={
                        <CustomInputField
                          disabled={true}
                          type="text"
                          name="forget_to_logout"
                          placeholder="Enter forget to logout"
                        />
                      }
                    />
                    <CustomFormGroup
                      formlabel="Absent Days"
                      star="*"
                      FormField={
                        <CustomInputField
                          disabled={true}
                          type="text"
                          name="absent_days"
                          placeholder="Enter Your Absent Days"
                        />
                      }
                    />
                  </Row>
                </Card.Body>
              </Card>

              <Card className="my-3">
                <Card.Body>
                  <Row className="my-3 align-items-center">
                    <Card.Title
                      style={{
                        fontSize: "19px",
                        position: "relative",
                        bottom: "15px",
                      }}
                    >
                      From The Account :-
                    </Card.Title>
                    <hr className="MuiDivider-root MuiDivider-fullWidth css-10mgopn-MuiDivider-root" />

                    <CustomFormGroup
                      formlabel="Bank Name"
                      star="*"
                      FormField={
                        <CustomInputField
                          disabled={true}
                          type="text"
                          name="bank_name"
                          placeholder=" Enter Your Bank Name"
                        />
                      }
                    />

                    <CustomFormGroup
                      formlabel="Pf No."
                      star="*"
                      FormField={
                        <CustomInputField
                          disabled={true}
                          type="text"
                          name="pf_no"
                          placeholder="Enter Your PF Number"
                        />
                      }
                    />

                    <CustomFormGroup
                      formlabel="Pan No "
                      star="*"
                      FormField={
                        <CustomInputField
                          disabled={true}
                          type="text"
                          name="pan_no"
                          placeholder="Enter Your PF Pan Number"
                        />
                      }
                    />

                    <CustomFormGroup
                      formlabel="Account No"
                      star="*"
                      FormField={
                        <CustomInputField
                          disabled={true}
                          type="text"
                          name="ac_no"
                          placeholder="Enter Your Account No"
                        />
                      }
                    />
                  </Row>
                </Card.Body>
              </Card>

              <Card className="my-3">
                <Card.Body>
                  <Row className="my-3 align-items-center">
                    <Card.Title
                      style={{
                        fontSize: "19px",
                        position: "relative",
                        bottom: "15px",
                      }}
                    >
                      Earnings :-
                    </Card.Title>

                    <hr className="MuiDivider-root MuiDivider-fullWidth css-10mgopn-MuiDivider-root" />

                    <CustomFormGroup
                      formlabel="Basic Pay "
                      star="*"
                      FormField={
                        <Col xs={12} md={12}>
                          <CustomInputField
                            type="number"
                            name="basic_pay"
                            placeholder="Enter Basic Pay"
                            // FieldValue={(name, value) => {
                            //     return setFieldValue(name, values.basic_pay);
                            // }}
                            // onChange={
                            //     (e)=>{
                            //         setBasicPay(e.target.value);
                            //         setFieldValue(e.target.value);
                            //     }
                            // }
                          />
                        </Col>
                      }
                    />
                    {
                      // React.useState(()=>{
                      // values.gross_earnings = Number(values.basic_pay)
                      // },[])
                    }
                    <CustomFormGroup
                      formlabel="Incentive"
                      star="*"
                      FormField={
                        <Col xs={12} md={12}>
                          <CustomInputField
                            type="number"
                            name="incentive"
                            placeholder="Enter Incentive"
                          />
                        </Col>
                      }
                    />

                    <CustomFormGroup
                      formlabel="H.R.A"
                      star="*"
                      FormField={
                        <Col xs={12} md={12}>
                          <CustomInputField
                            type="number"
                            name="hra"
                            placeholder="Enter H.R.A "
                          />
                        </Col>
                      }
                    />

                    <CustomFormGroup
                      formlabel="Medical Allw"
                      star="*"
                      FormField={
                        <Col xs={12} md={12}>
                          <CustomInputField
                            type="number"
                            name="medical_allowance"
                            placeholder="Enter Medical Allw "
                          />
                        </Col>
                      }
                    />

                    <CustomFormGroup
                      formlabel="Travel Allw"
                      star="*"
                      FormField={
                        <Col xs={12} md={12}>
                          <CustomInputField
                            type="number"
                            name="travel_allowance"
                            placeholder="Enter Travel Allw "
                          />
                        </Col>
                      }
                    />

                    <CustomFormGroup
                      formlabel="Special Allw"
                      star="*"
                      FormField={
                        <Col xs={12} md={12}>
                          <CustomInputField
                            type="number"
                            name="special_allowance"
                            placeholder="Enter Special Allw "
                          />
                        </Col>
                      }
                    />
                  </Row>
                </Card.Body>
              </Card>

              <Card className="my-3">
                <Card.Body>
                  <Row className="my-3 align-items-center">
                    <Card.Title
                      style={{
                        fontSize: "19px",
                        position: "relative",
                        bottom: "15px",
                      }}
                    >
                      Deductions :-
                    </Card.Title>
                    <hr className="MuiDivider-root MuiDivider-fullWidth css-10mgopn-MuiDivider-root" />

                    <CustomFormGroup
                      formlabel="Professional Tax"
                      star="*"
                      FormField={
                        <Col xs={12} md={12}>
                          <CustomInputField
                            type="number"
                            name="profession_tax"
                            placeholder="Enter Professional tax"
                          />
                        </Col>
                      }
                    />

                    <CustomFormGroup
                      formlabel="Provident Fund"
                      star="*"
                      FormField={
                        <Col xs={12} md={12}>
                          <CustomInputField
                            type="number"
                            name="pf_amount"
                            placeholder="Enter Provident fund"
                          />
                        </Col>
                      }
                    />

                    <CustomFormGroup
                      formlabel="TDS"
                      star="*"
                      FormField={
                        <Col xs={12} md={12}>
                          <CustomInputField
                            type="number"
                            name="tds"
                            placeholder="Enter TDS "
                          />
                        </Col>
                      }
                    />
                    <CustomFormGroup
                      formlabel="Other Deduction"
                      star="*"
                      FormField={
                        <Col xs={12} md={12}>
                          <CustomInputField
                            type="number"
                            name="other_deduction"
                            placeholder="Enter other deduction "
                            value={Math.round(calculateOtherDeduction(values))}
                            // value={100}
                          />
                        </Col>
                      }
                    />
                  </Row>
                </Card.Body>
              </Card>

              <Card className="my-3">
                <Card.Body>
                  <Row className="my-3 align-items-center">
                    <Card.Title
                      style={{
                        fontSize: "19px",
                        position: "relative",
                        bottom: "15px",
                      }}
                    >
                      Total :-
                    </Card.Title>
                    <hr className="MuiDivider-root MuiDivider-fullWidth css-10mgopn-MuiDivider-root" />

                    <CustomFormGroup
                      formlabel="Gross Earnings"
                      star="*"
                      FormField={
                        <CustomInputField
                          type="number"
                          name="gross_earnings"
                          placeholder="Enter Gross Earnings"
                          FieldValue={setFieldValue}
                          value={Math.round(
                            Number(
                              values.basic_pay +
                                values.incentive +
                                values.hra +
                                values.medical_allowance +
                                values.travel_allowance +
                                values.special_allowance
                            )
                          )}
                          // value={100}
                          // FieldValue={(name, value) => {
                          //     // values.gross_earnings = initialValues.basic_pay
                          //     return setFieldValue(name, value);
                          // }}
                        />
                      }
                    />
                    <CustomFormGroup
                      formlabel="Total Deductions"
                      star="*"
                      FormField={
                        <CustomInputField
                          type="text"
                          name="total_deductions"
                          placeholder="Enter Total Deductions"
                          value={Math.round(calculateTotalDeduction(values))}
                          // FieldValue={setFieldValue}
                          // onChange={(e) => setFieldValue("total_deductions", e.target.value)}
                        />
                      }
                    />

                    <CustomFormGroup
                      formlabel="Net Pay"
                      star="*"
                      FormField={
                        <CustomInputField
                          type="number"
                          name="net_pay_amount"
                          placeholder="Enter Net Pay "
                          value={Math.round(calculateNetPayAmount(values))}
                          // value={200-8}
                        />
                      }
                    />

                    <CustomFormGroup
                      formlabel="Net Pay(In words)"
                      star="*"
                      FormField={
                        <CustomInputField
                          type="text"
                          name="net_pay_words"
                          placeholder="Net Pay In Words"
                          value={numberToWords(
                            Math.round(calculateNetPayAmount(values))
                          )}
                        />
                      }
                    />
                  </Row>
                  <Row className="my-3 align-items-center">
                    <Col xs={12} md={2}>
                      <h3 className="custom-form-label">Other Details</h3>
                    </Col>
                    <Col xs={12} md={10}>
                      <CustomTextareaField
                        name="other_details"
                        placeholder="Enter Other Details....."
                      />
                    </Col>
                  </Row>

                  <div className="text-left">
                    <LoadingButton
                      type="submit"
                      variant="contained"
                      // loading={isLoading}
                    >
                      Submit
                    </LoadingButton>
                  </div>
                </Card.Body>
              </Card>
            </Form>
          );
        }}
      </Formik>
    </>
  );
};

export default AddPaySlip;
