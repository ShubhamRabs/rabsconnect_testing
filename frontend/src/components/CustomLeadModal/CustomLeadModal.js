// import React, { useState } from 'react';
// import { Modal, Box, Typography, IconButton } from '@mui/material';
// import { Formik, Form } from 'formik';
// import { useBootstrap, useMui, useSetting } from "../../hooks/Hooks";
// import { CreateLabelValueArray, stringAvatar } from "../../hooks/Function";
// import { useQuery, useQueryClient } from "react-query";
// import Cookies from "js-cookie";
// import CryptoJS from "crypto-js";
// import { useQuickEditLead } from "../../hooks/Leads/UseLeadsHook";
// import { GetAllLeadStatus } from "../../hooks/DynamicFields/UseLeadStatusHook";
// import { QuickLeadSchema } from "../../schema/Leads/QuickLeadSchema";
// import {
//   CustomFormGroup,
//   CustomInputField,
//   CustomSelectField,
//   CustomTextareaField,
// } from "../../components/FormUtility/FormUtility";
// import LeadTimelineHandler from "../../Handler/LeadTimelineHandler";
// import CloseIcon from '@mui/icons-material/Close'; // Import the close icon
// import { CustomHeading } from '../Common/Common';

// const CustomLeadModel = ({ open, handleClose, dispatch,handleMessage }) => {
//   const { Card, Row, Col } = useBootstrap();
//   const { ArrowBackIosIcon, Avatar, CallOutlinedIcon, BusinessOutlinedIcon, LoadingButton } = useMui();
//   const { globalData } = useSetting();
//   const [updateMessage, setUpdateMessage] = useState("");

//   // Extract encrypted user data from localStorage
//   let CryptoJSKey = globalData.CompanyName + "@" + globalData.Version;
//   let bytes;

//   if (localStorage.getItem("previousScreen") === "leadbystatus") {
//     bytes = CryptoJS.AES.decrypt(localStorage.getItem("store_new_data"), CryptoJSKey);
//   } else {
//     bytes = CryptoJS.AES.decrypt(localStorage.getItem("updateglobal_userdata"), CryptoJSKey);
//   }

//   var user_data = bytes.toString(CryptoJS.enc.Utf8);
//   let LeadsData = JSON.parse(user_data);
//   console.log(LeadsData,"LeadsData");

//   // Query to fetch all lead statuses
//   const AllStatus = useQuery("AllStatus", () => {
//     return GetAllLeadStatus(["status"]);
//   });

//   let initialValues = {
//     status_type:
//       Cookies.get("type") === "Admin"
//         ? LeadsData.admin_status
//         : LeadsData.status,
//     follow_up: LeadsData.followup,
//     followup_dt: LeadsData.followup_dt,
//     newComment: "",
//     oldComment: LeadsData.comments,
//     leadId:
//       Cookies.get("type") === "Admin"
//         ? LeadsData.l_id
//         : LeadsData.assignlead_id,
//     lname: LeadsData.lname,
//     p_mob: LeadsData.p_mob,
//     pname: LeadsData.pname,
//     identity: LeadsData.identity,
//   };

//   const { mutate, isLoading } = useQuickEditLead();
//   const queryClient = useQueryClient();

//   const onSubmit = (values) => {
//     mutate(values, {
//       onSuccess: (data) => {
//         if (data.data === "Lead Updated Successfully") {
//           setUpdateMessage("");
//           queryClient.invalidateQueries("TotalLeadTableData");
//           handleMessage("Lead Updated Successfully");
//           handleClose();
//         }
//       },
//     });
//   };

//   const FollowUp = [
//     { value: "Yes", label: "Yes" },
//     { value: "No", label: "No" },
//   ];

//   const comments = LeadsData.comments?.split("~");

//   return (
//     <Modal open={open} onClose={handleClose} fullWidth>
//       <Box
//         sx={{
//           padding: 3,
//           position: 'relative',
//           backgroundColor: 'white', // Set background color to white
//           maxWidth: 800, // Set max width to make the form smaller
//           margin: 'auto', // Center the form
//           marginTop: '20vh',
//         }}
//       >
//         <IconButton
//           onClick={handleClose}
//           sx={{
//             position: 'absolute',
//             top: 10,
//             right: 10,
//             zIndex: 1,
//           }}
//         >
//           <CloseIcon />
//         </IconButton>

//         <CustomHeading Heading={`Quick Edit For Lead - ${LeadsData.lname}`}/>
//         <Row className="mt-3">
//           <Col>
//             <Card className="card-advance border-0">
//               <Card.Body>
//                 <Formik
//                   initialValues={initialValues}
//                   validationSchema={QuickLeadSchema}
//                   onSubmit={onSubmit}
//                 >
//                   {({ values, setFieldValue }) => (
//                     <Form>
//                       <CustomFormGroup
//                         xs={12}
//                         md={12}
//                         formlabel="Lead Status"
//                         star="*"
//                         FormField={
//                           <CustomSelectField
//                             name="status_type"
//                             placeholder="Select a Lead Status"
//                             options={CreateLabelValueArray(
//                               AllStatus?.data,
//                               "status"
//                             )}
//                             isLabelValue={true}
//                             FieldValue={setFieldValue}
//                             initialValue={{
//                               label: initialValues.status_type,
//                               value: initialValues.status_type,
//                             }}
//                           />
//                         }
//                       />
//                       <CustomFormGroup
//                         xs={12}
//                         md={12}
//                         formlabel="Follow Up"
//                         star="*"
//                         FormField={
//                           <CustomSelectField
//                             name="follow_up"
//                             placeholder="Select a Follow Up"
//                             options={FollowUp}
//                             isLabelValue={true}
//                             FieldValue={setFieldValue}
//                             initialValue={{
//                               label: initialValues.follow_up,
//                               value: initialValues.follow_up,
//                             }}
//                           />
//                         }
//                       />
//                       {values.follow_up === "Yes" ? (
//                         <Col>
//                           <CustomFormGroup
//                             xs={12}
//                             md={12}
//                             formlabel="Follow Up Date"
//                             star="*"
//                             FormField={
//                               <CustomInputField
//                                 type="datetime-local"
//                                 name="followup_dt"
//                                 required={true}
//                                 initialValue={{
//                                   label: initialValues.followup_dt,
//                                   value: initialValues.followup_dt,
//                                 }}
//                                 min={new Date().toISOString().slice(0, 16)}
//                               />
//                             }
//                           />
//                         </Col>
//                       ) : null}
//                       <Row>
//                         <Col md={4}>
//                           <Typography variant="h6" className="custom-form-label">
//                             Add Comment <span className="required-label"></span>
//                           </Typography>
//                         </Col>
//                         <Col md={8}>
//                           <CustomTextareaField
//                             name="newComment"
//                             placeholder="Enter Other Details ...."
//                           />
//                         </Col>
//                       </Row>
//                       <div className="text-center">
//                         <LoadingButton
//                           variant="contained"
//                           type="submit"
//                           loading={isLoading}
//                         >
//                           Update Lead
//                         </LoadingButton>
//                       </div>
//                     </Form>
//                   )}
//                 </Formik>
//               </Card.Body>
//             </Card>
//           </Col>
//           <Col>
//             <Card
//               className="card-advance border-0"
//               style={{ height: "310px", overflowY: "scroll" }}
//             >
//               <Card.Body>
//                 <LeadTimelineHandler LeadDetails={LeadsData} />
//               </Card.Body>
//             </Card>
//           </Col>
//         </Row>
//       </Box>
//     </Modal>
//   );
// };

// export default CustomLeadModel;

// import React, { useState } from "react";
// import { Modal, Box, Typography, IconButton } from "@mui/material";
// import { Formik, Form } from "formik";
// import { useBootstrap, useMui, useSetting } from "../../hooks/Hooks";
// import { CreateLabelValueArray, stringAvatar } from "../../hooks/Function";
// import { useQuery, useQueryClient } from "react-query";
// import Cookies from "js-cookie";
// import CryptoJS from "crypto-js";
// import { useQuickEditLead } from "../../hooks/Leads/UseLeadsHook";
// import { GetAllLeadStatus } from "../../hooks/DynamicFields/UseLeadStatusHook";
// import { QuickLeadSchema } from "../../schema/Leads/QuickLeadSchema";
// import {
//   CustomFormGroup,
//   CustomInputField,
//   CustomSelectField,
//   CustomTextareaField,
// } from "../../components/FormUtility/FormUtility";
// import LeadTimelineHandler from "../../Handler/LeadTimelineHandler";
// import CloseIcon from "@mui/icons-material/Close"; // Import the close icon
// import { CustomHeading } from "../Common/Common";
// import { GetAllLeadPriority } from "../../hooks/DynamicFields/UseLeadPriorityHook";

// const CustomLeadModel = ({ open, handleClose, dispatch, handleMessage }) => {
//   const { Card, Row, Col } = useBootstrap();
//   const {
//     ArrowBackIosIcon,
//     Avatar,
//     CallOutlinedIcon,
//     BusinessOutlinedIcon,
//     LoadingButton,
//   } = useMui();
//   const { globalData } = useSetting();
//   const [updateMessage, setUpdateMessage] = useState("");

//   // Extract encrypted user data from localStorage
//   let CryptoJSKey = globalData.CompanyName + "@" + globalData.Version;
//   let bytes;

//   if (localStorage.getItem("previousScreen") === "leadbystatus") {
//     bytes = CryptoJS.AES.decrypt(
//       localStorage.getItem("store_new_data"),
//       CryptoJSKey
//     );
//   } else {
//     bytes = CryptoJS.AES.decrypt(
//       localStorage.getItem("updateglobal_userdata"),
//       CryptoJSKey
//     );
//   }

//   var user_data = bytes.toString(CryptoJS.enc.Utf8);
//   let LeadsData = JSON.parse(user_data);

//   console.log(LeadsData, "qqqqq");

//   // Query to fetch all lead statuses
//   const AllStatus = useQuery("AllStatus", () => {
//     return GetAllLeadStatus(["status"]);
//   });

//   const GetAllLeadPriorityDropDown = useQuery(
//     "GetAllLeadPriorityDropDown",
//     () => {
//       return GetAllLeadPriority(["lead_priority"]);
//     }
//   );

//   let initialValues = {
//     status_type:
//       Cookies.get("type") === "Admin"
//         ? LeadsData.admin_status
//         : LeadsData.status,
//     follow_up: LeadsData.followup,
//     followup_dt: LeadsData.followup_dt,
//     newComment: "",
//     oldComment: LeadsData.comments,
//     leadId:
//       Cookies.get("type") === "Admin"
//         ? LeadsData.l_id
//         : LeadsData.assignlead_id,
//     lname: LeadsData.lname,
//     p_mob: LeadsData.p_mob,
//     pname: LeadsData.pname,
//     identity: LeadsData.identity,
//     lead_priority: LeadsData.lead_priority,
//   };

//   const { mutate, isLoading } = useQuickEditLead();
//   const queryClient = useQueryClient();

//   const onSubmit = (values) => {
//     mutate(values, {
//       onSuccess: (data) => {
//         if (data.data === "Lead Updated Successfully") {
//           setUpdateMessage("");
//           queryClient.invalidateQueries("TotalLeadTableData");
//           handleMessage("Lead Updated Successfully");
//           handleClose();
//         }
//       },
//     });
//   };

//   const FollowUp = [
//     { value: "Yes", label: "Yes" },
//     { value: "No", label: "No" },
//   ];

//   const comments = LeadsData.comments?.split("~");

//   return (
//     <Modal open={open} onClose={handleClose} fullWidth>
//       <Box
//         sx={{
//           padding: 3,
//           position: "relative",
//           backgroundColor: "white", // Set background color to white
//           maxWidth: 800, // Set max width to make the form smaller
//           margin: "auto", // Center the form
//           // marginTop: "10vh",
//         }}
//       >
//         <IconButton
//           onClick={handleClose}
//           sx={{
//             position: "absolute",
//             top: 10,
//             right: 10,
//             zIndex: 1,
//           }}
//         >
//           <CloseIcon />
//         </IconButton>

//         <CustomHeading Heading={`Quick Edit For Lead ${LeadsData.lname}`} />
//         <Row className="mt-3">
//           <Col>
//             <Card className="card-advance border-0">
//               <Card.Body>
//                 <Formik
//                   initialValues={initialValues}
//                   validationSchema={QuickLeadSchema}
//                   onSubmit={onSubmit}
//                 >
//                   {({ values, setFieldValue }) => (
//                     <Form>
//                       <CustomFormGroup
//                         xs={12}
//                         md={12}
//                         formlabel="Lead Status"
//                         star="*"
//                         FormField={
//                           <CustomSelectField
//                             name="status_type"
//                             placeholder="Select a Lead Status"
//                             options={CreateLabelValueArray(
//                               AllStatus?.data,
//                               "status"
//                             )}
//                             isLabelValue={true}
//                             FieldValue={setFieldValue}
//                             initialValue={{
//                               label: initialValues.status_type,
//                               value: initialValues.status_type,
//                             }}
//                           />
//                         }
//                       />
//                       <CustomFormGroup
//                         xs={12}
//                         md={12}
//                         formlabel="Lead Priority"
//                         star="*"
//                         FormField={
//                           <CustomSelectField
//                             name="lead_priority"
//                             placeholder="Select Lead Priority"
//                             options={CreateLabelValueArray(
//                               GetAllLeadPriorityDropDown?.data,
//                               "lead_priority"
//                             )}
//                             isLabelValue={true}
//                             FieldValue={setFieldValue}
//                             initialValue={
//                               // initialValues.lead_priority
//                               //   ?
//                               {
//                                 label: initialValues.lead_priority,
//                                 value: initialValues.lead_priority,
//                               }
//                               // : null
//                             }
//                           />
//                         }
//                       />
//                       <CustomFormGroup
//                         xs={12}
//                         md={12}
//                         formlabel="Follow Up"
//                         star="*"
//                         FormField={
//                           <CustomSelectField
//                             name="follow_up"
//                             placeholder="Select a Follow Up"
//                             options={FollowUp}
//                             isLabelValue={true}
//                             FieldValue={setFieldValue}
//                             initialValue={{
//                               label: initialValues.follow_up,
//                               value: initialValues.follow_up,
//                             }}
//                           />
//                         }
//                       />
//                       {values.follow_up === "Yes" ? (
//                         <Col>
//                           <CustomFormGroup
//                             xs={12}
//                             md={12}
//                             formlabel="Follow Up Date"
//                             star="*"
//                             FormField={
//                               <CustomInputField
//                                 type="datetime-local"
//                                 name="followup_dt"
//                                 required={true}
//                                 initialValue={{
//                                   label: initialValues.followup_dt,
//                                   value: initialValues.followup_dt,
//                                 }}
//                                 min={new Date().toISOString().slice(0, 16)}
//                               />
//                             }
//                           />
//                         </Col>
//                       ) : null}
//                       <Row>
//                         <Col md={4}>
//                           <Typography
//                             variant="h6"
//                             className="custom-form-label"
//                           >
//                             Add Comment <span className="required-label"></span>
//                           </Typography>
//                         </Col>
//                         <Col md={8}>
//                           <CustomTextareaField
//                             name="newComment"
//                             placeholder="Enter Other Details ...."
//                           />
//                         </Col>
//                       </Row>
//                       <div className="text-center">
//                         <LoadingButton
//                           variant="contained"
//                           type="submit"
//                           loading={isLoading}
//                         >
//                           Update Lead
//                         </LoadingButton>
//                       </div>
//                     </Form>
//                   )}
//                 </Formik>
//               </Card.Body>
//             </Card>
//           </Col>
//           <Col>
//             <Card
//               className="card-advance border-0"
//               style={{ height: "310px", overflowY: "scroll" }}
//             >
//               <Card.Body>
//                 <LeadTimelineHandler LeadDetails={LeadsData} />
//               </Card.Body>
//             </Card>
//           </Col>
//         </Row>
//       </Box>
//     </Modal>
//   );
// };

// export default CustomLeadModel;

import React, { useEffect, useState } from "react";
import { Modal, Box, Typography, IconButton, Divider } from "@mui/material";
import { Formik, Form } from "formik";
import { useBootstrap, useMui, useSetting } from "../../hooks/Hooks";
import { CreateLabelValueArray, stringAvatar } from "../../hooks/Function";
import { useQuery, useQueryClient } from "react-query";
import Cookies from "js-cookie";
import CryptoJS from "crypto-js";
import Axios from "../../setting/axios";
import { useQuickEditLead } from "../../hooks/Leads/UseLeadsHook";
import { GetAllLeadStatus } from "../../hooks/DynamicFields/UseLeadStatusHook";
import { QuickLeadSchema } from "../../schema/Leads/QuickLeadSchema";
import {
  CustomFormGroup,
  CustomInputField,
  CustomSelectField,
  CustomTextareaField,
} from "../../components/FormUtility/FormUtility";
import LeadTimelineHandler from "../../Handler/LeadTimelineHandler";
import CloseIcon from "@mui/icons-material/Close"; // Import the close icon
import { CustomHeading } from "../Common/Common";
import { GetAllLeadPriority } from "../../hooks/DynamicFields/UseLeadPriorityHook";

const CustomLeadModel = ({ open, handleClose, dispatch, handleMessage }) => {
  const { Card, Row, Col } = useBootstrap();
  const { Avatar, LoadingButton } = useMui();
  const { globalData } = useSetting();
  const [updateMessage, setUpdateMessage] = useState("");
    const [visibilityData, setVisibilityData] = React.useState({});

  let CryptoJSKey = globalData.CompanyName + "@" + globalData.Version;
  let bytes;

  if (localStorage.getItem("previousScreen") === "leadbystatus") {
    bytes = CryptoJS.AES.decrypt(
      localStorage.getItem("store_new_data"),
      CryptoJSKey
    );
  } else {
    bytes = CryptoJS.AES.decrypt(
      localStorage.getItem("updateglobal_userdata"),
      CryptoJSKey
    );
  }

  const user_data = bytes.toString(CryptoJS.enc.Utf8);
  const LeadsData = JSON.parse(user_data);

  const AllStatus = useQuery("AllStatus", () => {
    return GetAllLeadStatus(["status"]);
  });

  const GetAllLeadPriorityDropDown = useQuery(
    "GetAllLeadPriorityDropDown",
    () => {
      return GetAllLeadPriority(["lead_priority"]);
    }
  );

  const initialValues = {
    status_type:
      Cookies.get("type") === "Admin"
        ? LeadsData?.admin_status
        : LeadsData?.latest_status || LeadsData.status,
    follow_up: LeadsData?.followup,
    followup_dt: LeadsData?.followup_dt,
    newComment: "",
    oldComment: LeadsData?.comments,
    leadId:
      Cookies.get("type") === "Admin"
        ? LeadsData?.l_id
        : LeadsData?.assignlead_id,
    lname: LeadsData?.lname,
    p_mob: LeadsData?.p_mob,
    pname: LeadsData?.pname,
    identity: LeadsData?.identity,
    lead_priority: LeadsData?.lead_priority,
  };

  const { mutate, isLoading } = useQuickEditLead();
  const queryClient = useQueryClient();

  const onSubmit = (values) => {
    mutate(values, {
      onSuccess: (data) => {
        if (data.data === "Lead Updated Successfully") {
          setUpdateMessage("");
          queryClient.invalidateQueries("TotalLeadTableData");
          handleMessage("Lead Updated Successfully");
          handleClose();
        }
      },
    });
  };

  const FollowUp = [
    { value: "Yes", label: "Yes" },
    { value: "No", label: "No" },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await Axios.get("/dmn");
        console.log("Settings:", response.data);
        setVisibilityData(response.data.lead);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          backgroundColor: "white",
          maxWidth: "900px",
          maxHeight: "90vh",
          overflowY: "auto",
          margin: "5vh auto",
          padding: 4,
          borderRadius: 3,
          position: "relative",
          boxShadow: 24,
        }}
      >
        <IconButton
          onClick={handleClose}
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
          }}
        >
          <CloseIcon />
        </IconButton>

        <Typography variant="h6" fontWeight="bold" textAlign="center" mb={3}>
          Quick Edit for Lead - {LeadsData.lname}
        </Typography>

        <Divider />

        <Row className="mt-3">
          <Col>
            <Formik
              initialValues={initialValues}
              validationSchema={QuickLeadSchema}
              onSubmit={onSubmit}
            >
              {({ values, setFieldValue }) => (
                <Form>
                  <CustomFormGroup
                    xs={12}
                    md={12}
                    formlabel="Lead Status"
                    star="*"
                    FormField={
                      <CustomSelectField
                        name="status_type"
                        placeholder="Select a Lead Status"
                        options={CreateLabelValueArray(
                          AllStatus?.data,
                          "status"
                        )}
                        isLabelValue={true}
                        FieldValue={setFieldValue}
                        initialValue={{
                          label: initialValues.status_type,
                          value: initialValues.status_type,
                        }}
                      />
                    }
                  />

                  {visibilityData.showLeadPriority && (
                    <CustomFormGroup
                      xs={12}
                      md={12}
                      formlabel="Lead Priority"
                      star="*"
                      FormField={
                        <CustomSelectField
                          name="lead_priority"
                          placeholder="Select Lead Priority"
                          options={CreateLabelValueArray(
                            GetAllLeadPriorityDropDown?.data,
                            "lead_priority"
                          )}
                          isLabelValue={true}
                          FieldValue={setFieldValue}
                          initialValue={{
                            label: initialValues.lead_priority,
                            value: initialValues.lead_priority,
                          }}
                        />
                      }
                    />
                  )}
                  <CustomFormGroup
                    xs={12}
                    md={12}
                    formlabel="Follow Up"
                    star="*"
                    FormField={
                      <CustomSelectField
                        name="follow_up"
                        placeholder="Select a Follow Up"
                        options={FollowUp}
                        isLabelValue={true}
                        FieldValue={setFieldValue}
                        initialValue={{
                          label: initialValues.follow_up,
                          value: initialValues.follow_up,
                        }}
                      />
                    }
                  />
                  {values.follow_up === "Yes" && (
                    <CustomFormGroup
                      xs={12}
                      md={12}
                      formlabel="Follow Up Date"
                      star="*"
                      FormField={
                        <CustomInputField
                          type="datetime-local"
                          name="followup_dt"
                          required
                          min={new Date().toISOString().slice(0, 16)}
                        />
                      }
                    />
                  )}
                  <CustomFormGroup
                    xs={12}
                    md={12}
                    formlabel="Add Comment"
                    star="*"
                    FormField={
                      <CustomTextareaField
                        name="newComment"
                        placeholder="Enter other details..."
                      />
                    }
                  />
                  <Box textAlign="center" mt={2}>
                    <LoadingButton
                      variant="contained"
                      type="submit"
                      loading={isLoading}
                    >
                      Update Lead
                    </LoadingButton>
                  </Box>
                </Form>
              )}
            </Formik>
          </Col>
          <Col>
            <Typography variant="h6" fontWeight="bold" mt={3}>
              Timeline
            </Typography>
            <Box
              sx={{
                height: "300px",
                overflowY: "auto",
                backgroundColor: "#f9f9f9",
                borderRadius: 2,
                p: 2,
                mt: 1,
              }}
            >
              <LeadTimelineHandler LeadDetails={LeadsData} />
            </Box>
          </Col>
        </Row>
      </Box>
    </Modal>
  );
};

export default CustomLeadModel;
