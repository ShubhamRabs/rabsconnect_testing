import React from "react";
import { useBootstrap, useMui, useSetting } from "../../hooks/Hooks";
import { Formik, Form } from "formik";
import "../LeadAdvancedSearch/LeadAdvancedSearch.css";
import {
  CustomInputField,
  CustomMultipleSelectField,
} from "../FormUtility/FormUtility";
import { useQuery } from "react-query";
import { CreateLabelValueArray, groupBy } from "../../hooks/Function";
import {
  SchedulerType,
  SchedulerStatus,
} from "./../../data/LeadData";
import { useSearchLeadScheduler } from "../../hooks/AdvancedSearch/LeadSchedulerAdvanceSearchHook";
import { getAllUsers } from "../../hooks/Users/useAllUsersHook";
import CryptoJS from "crypto-js";
import { getSchedularSearchDetails } from "../../hooks/Leads/UseLeadSchedulingHook";

const LeadScheduleAdvancedSearch = ({
  PassSearchData,
  PassPageName,
  page,
  pageSize,
  dispatch,
}) => {
  const { Accordion, Row, Col } = useBootstrap();
  const { LoadingButton, Typography } = useMui();
  const { globalData } = useSetting();

  const [status, setStatus] = React.useState({
    sourceList: false,
    projectNameList: false,
    formNameList: false,
  });

  const [ResetForm, setResetForm] = React.useState(false);
  const [SearchDetails, setSearchDetails] = React.useState([]);
  const [AllUserGroup, setAllUserGroup] = React.useState([]);

  if (localStorage.getItem("sotre_search_data") !== null) {
    let CryptoJSKey = globalData.CompanyName + "@" + globalData.Version;

    const bytes = CryptoJS.AES.decrypt(
      localStorage.getItem("sotre_search_data"),
      CryptoJSKey
    );

    var previousSearchData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  }

  const previousScreen = localStorage.getItem("previousScreen");

  const initialValues = {
    schedule_type: previousSearchData ? previousSearchData.schedule_type : "",
    source: previousSearchData ? previousSearchData.source : "",
    service_type: previousSearchData ? previousSearchData.service_type : "",
    pname: previousSearchData ? previousSearchData.pname : "",
    form_name: previousSearchData ? previousSearchData.form_name : "",
    city: previousSearchData ? previousSearchData.city : "",
    locality: previousSearchData ? previousSearchData.locality : "",
    schedule_status: previousSearchData ? previousSearchData.schedule_status : "",
    user_master: previousSearchData ? previousSearchData.user_master : "",
    user_admin: previousSearchData ? previousSearchData.user_admin : "",
    branch_admin: previousSearchData ? previousSearchData.branch_admin : "",
    team_leader: previousSearchData ? previousSearchData.team_leader : "",
    sales_manager: previousSearchData ? previousSearchData.sales_manager : "",
    tele_caller: previousSearchData ? previousSearchData.tele_caller : "",
    createDate_from: "",
    createDate_to: "",
    ldate_from: "",
    ldate_to: "",
    anytext: "", 
    pageName: PassPageName,
  };
  const { mutate, isLoading } = useSearchLeadScheduler();

  const HandleSubmit = (values) => {
    dispatch({ event: "sotre_search_data", data: JSON.stringify(values) });
    setSearchDetails(values);
    let data = [values, page, pageSize];
    mutate(data, {
      onSuccess: (data) => {
        PassSearchData(data);
      },
    });
  };

  React.useEffect(() => {
    if (SearchDetails.length !== 0) {
      let data = [SearchDetails, page, pageSize];
      mutate(data, {
        onSuccess: (data) => {
          PassSearchData(data);
        },
      });
    }
  }, [page, pageSize]);

  React.useEffect(() => {
    if (previousSearchData) {
      let data = [previousSearchData, page, pageSize];
      mutate(data, {
        onSuccess: (data) => {
          PassSearchData(data);
        },
      });
    }
  }, []);

  React.useEffect(() => {
    if (
      previousScreen !== "viewleadscheduling" ||
      previousScreen !== "quickeditlead" ||
      previousScreen !== "editlead" ||
      previousScreen !== "assignleadfrom"
    ) {
      localStorage.removeItem("sotre_search_data");
    } else if (
      previousScreen === "callingreport" ||
      previousScreen === "leadreport"
    ) {
      localStorage.removeItem("sotre_search_data");
    }
  }, []);


  const SchedularSearchDetails = useQuery("SchedularSearchDetails", () => {
    return getSchedularSearchDetails();
  });

  const AllUsers = useQuery(
    "allUserslist",
    () => {
      return getAllUsers();
    },
    // {
    //   onSuccess: (data) => {
    //     if (SchedularSearchDetails.isSuccess) {
    //       let users = [];
    //       data.data.forEach((user) => {
    //         if (SchedularSearchDetails.data.data.assign_to.includes(user.id.toString())) {
    //           users.push(user);
    //         }
    //       })
    //       setAllUserGroup(
    //         groupBy(
    //           users.map((user) => ({
    //             label: user.username,
    //             value: user.id,
    //             urole: user.urole,
    //           })),
    //           "urole"
    //         )
    //       );
    //     }
    //   },
    // }
  );

  React.useEffect(() => {
    if (AllUsers.isSuccess && SchedularSearchDetails.isSuccess) {
      const users = AllUsers.data.data.filter((user) =>
        SchedularSearchDetails.data.data.created_by_assign_to.includes(user.id.toString())
      );
  
      setAllUserGroup(
        groupBy(
          users.map((user) => ({
            label: user.username,
            value: user.id,
            urole: user.urole,
          })),
          "urole"
        )
      );
    }
  }, [AllUsers.isSuccess, SchedularSearchDetails.isSuccess, AllUsers.data]);

  const HandleResetForm = () => {
    localStorage.removeItem("sotre_search_data");
    setResetForm(true);
    setSearchDetails([]);
    PassSearchData([]);
    setTimeout(() => {
      setResetForm(false);
    }, 100);
  };

  // console.log(SearchDetails, "SearchDetails");

  function convertArrayToObjectsWithLabelKey(array) {
    return array.map((item) => ({ label: item }));
  }

  return (
    <Accordion className="mt-3 lead-advance-search">
      <Accordion.Item eventKey="0">
        <Accordion.Header>Advance Search</Accordion.Header>
        <Accordion.Body>
          <Formik
            initialValues={initialValues}
            // validationSchema={validationSchema}
            onSubmit={HandleSubmit}
          >
            {({ values, setFieldValue}) => {
              if(ResetForm){
                console.log("formik values", values);
                 for (const key in values) {
                  if (values.hasOwnProperty.call(values, key)) {
                    values[key] = "";
                  }
                 }
              }
              return (
              <Form className="mt-3">
                <Row>
                  <Col md={3}>
                    <CustomMultipleSelectField
                      name="schedule_type"
                      placeholder="Select Schedule Type"
                      options={SchedulerType}
                      isLabelValue={true}
                      FieldValue={setFieldValue}
                      values={values}
                      resetField={ResetForm}
                    />
                  </Col>
                  <Col md={3}>
                    <CustomMultipleSelectField
                      name="source"
                      placeholder="Select Source"
                      options={
                        SchedularSearchDetails?.data?.data?.source
                          ? SchedularSearchDetails?.data?.data?.source.map(
                              (source) => ({
                                label: source,
                                value: source,
                              })
                            )
                          : []
                      }
                      isLabelValue={true}
                      FieldValue={setFieldValue}
                      values={values}
                      resetField={ResetForm}
                    />
                  </Col>
                  <Col md={3}>
                    <CustomMultipleSelectField
                      name="service_type"
                      placeholder="Select Service Type"
                      options={
                        SchedularSearchDetails?.data?.data?.service_type
                          ? SchedularSearchDetails?.data?.data?.service_type.map(
                              (service_type) => ({
                                label: service_type,
                                value: service_type,
                              })
                            )
                          : []
                      }
                      isLabelValue={true}
                      FieldValue={setFieldValue}
                      values={values}
                      resetField={ResetForm}
                    />
                  </Col>
                  <Col md={3}>
                    <CustomMultipleSelectField
                      name="pname"
                      placeholder="Select Project Name"
                      onFocus={() =>
                        setStatus({ ...status, projectNameList: true })
                      }
                      options={
                        SchedularSearchDetails?.data?.data?.pname
                          ? SchedularSearchDetails?.data?.data?.pname.map(
                              (pname) => ({
                                label: pname,
                                value: pname,
                              })
                            )
                          : []
                      }
                      isLabelValue={true}
                      FieldValue={setFieldValue}
                      values={values}
                      resetField={ResetForm}
                    />
                  </Col>
                </Row>
                <Row className="mt-4">
                <Col md={3}>
                    <CustomMultipleSelectField
                      name="form_name"
                      placeholder="Select Form Name"
                      onFocus={() =>
                        setStatus({ ...status, formNameList: true })
                      }
                      options={
                        SchedularSearchDetails?.data?.data?.form_name
                          ? SchedularSearchDetails?.data?.data?.form_name.map(
                              (form_name) => ({
                                label: form_name,
                                value: form_name,
                              })
                            )
                          : []
                      }
                      isLabelValue={true}
                      FieldValue={setFieldValue}
                      values={values}
                      resetField={ResetForm}
                    />
                  </Col>
                  <Col md={3}>
                    <CustomMultipleSelectField
                      options={
                        SchedularSearchDetails?.data?.data?.city
                          ? SchedularSearchDetails?.data?.data?.city.map(
                              (city) => ({
                                label: city,
                                value: city,
                              })
                            )
                          : []
                      }
                      isLabelValue={true}
                      placeholder="Select City"
                      name="city"
                      FieldValue={setFieldValue} // Pass setFieldValue to the component
                      values={values} // Pass values to the component
                      resetField={ResetForm}
                    />
                  </Col>
                  <Col md={3}>
                    <CustomMultipleSelectField
                      options={
                        SchedularSearchDetails?.data?.data?.locality
                          ? SchedularSearchDetails?.data?.data?.locality.map(
                              (locality) => ({
                                label: locality,
                                value: locality,
                              })
                            )
                          : []
                      }
                      onFocus={() =>
                        setStatus({ ...status, LocalityList: true })
                      }
                      isLabelValue={true}
                      placeholder="Select Locality"
                      name="locality"
                      FieldValue={setFieldValue} // Pass setFieldValue to the component
                      values={values} // Pass values to the component
                      resetField={ResetForm}
                    />
                  </Col>
                  <Col md={3}>
                    <CustomMultipleSelectField
                      options={SchedulerStatus}
                      onFocus={() =>
                        setStatus({ ...status, ConfigurationList: true })
                      }
                      isLabelValue={true}
                      name="schedule_status"
                      placeholder="Schedule Status"
                      FieldValue={setFieldValue} // Pass setFieldValue to the component
                      values={values} // Pass values to the component
                      resetField={ResetForm}
                      initialValue={
                        initialValues.schedule_status !== ""
                          ? CreateLabelValueArray(
                              convertArrayToObjectsWithLabelKey(
                                initialValues.schedule_status
                              ),
                              "label"
                            )
                          : []
                      }
                    />
                  </Col>
                </Row>
                <Row className="mt-4">
                <Col md={3}>
                    <CustomMultipleSelectField
                      name="user_master"
                      placeholder="Select Master"
                      options={AllUserGroup["Master"] || []}
                      isLabelValue={true}
                      FieldValue={setFieldValue}
                      values={values}
                      resetField={ResetForm}
                    />
                  </Col>
                  <Col md={3}>
                    <CustomMultipleSelectField
                      name="user_admin"
                      placeholder="Select Admin"
                      options={AllUserGroup["Admin"] || []}
                      isLabelValue={true}
                      FieldValue={setFieldValue}
                      values={values}
                      resetField={ResetForm}
                    />
                  </Col>
                  <Col md={3}>
                    <CustomMultipleSelectField
                      options={AllUserGroup["Branch Admin"] || []}
                      isLabelValue={true}
                      name="branch_admin"
                      placeholder="Branch Admin"
                      FieldValue={setFieldValue} // Pass setFieldValue to the component
                      values={values} // Pass values to the component
                      resetField={ResetForm}
                    />
                  </Col>
                </Row>
                <Row className="mt-4">
                  <Col md={3}>
                    <CustomMultipleSelectField
                      options={AllUserGroup["Team Leader"] || []}
                      isLabelValue={true}
                      name="team_leader"
                      placeholder="Team Leader"
                      FieldValue={setFieldValue} // Pass setFieldValue to the component
                      values={values} // Pass values to the component
                      resetField={ResetForm}
                    />
                  </Col>
                  <Col md={3}>
                    <CustomMultipleSelectField
                      options={AllUserGroup["Sales Manager"] || []}
                      isLabelValue={true}
                      name="sales_manager"
                      placeholder="Sales Manager"
                      FieldValue={setFieldValue} // Pass setFieldValue to the component
                      values={values} // Pass values to the component
                      resetField={ResetForm}
                    />
                  </Col>
                  <Col md={3}>
                    <CustomMultipleSelectField
                      options={AllUserGroup["Tele Caller"] || []}
                      isLabelValue={true}
                      name="tele_caller"
                      placeholder="Tele Caller"
                      FieldValue={setFieldValue} // Pass setFieldValue to the component
                      values={values} // Pass values to the component
                      resetField={ResetForm}
                    />
                  </Col>
                </Row>
                <Row className="mt-4">
                  <Col md={3} className="date-from-group">
                    <Typography variant="subtitle2" sx={{ fontWeight: "400" }}>
                      Create Date From
                    </Typography>
                    <CustomInputField
                      InputWidth="100%"
                      type="date"
                      name="createDate_from"
                      placeholder=""
                    />
                  </Col>
                  <Col md={3} className="date-from-group">
                    <Typography variant="subtitle2" sx={{ fontWeight: "400" }}>
                      Create Date To
                    </Typography>
                    <CustomInputField
                      InputWidth="100%"
                      type="date"
                      name="createDate_to"
                      placeholder=""
                    />
                  </Col>
                  <Col md={3} className="date-from-group">
                    <Typography variant="subtitle2" sx={{ fontWeight: "400" }}>
                      Lead Date From
                    </Typography>
                    <CustomInputField
                      InputWidth="100%"
                      type="date"
                      name="ldate_from"
                      placeholder=""
                    />
                  </Col>
                  <Col md={3} className="date-from-group">
                    <Typography variant="subtitle2" sx={{ fontWeight: "400" }}>
                      Lead Date To
                    </Typography>
                    <CustomInputField
                      InputWidth="100%"
                      type="date"
                      name="ldate_to"
                      placeholder=""
                    />
                  </Col>
                </Row>
                <Row className="mt-4">
                  <Col md={6} className="anytext-from-group">
                   {/* <Typography variant="subtitle2" sx={{ fontWeight: "400" }}>
                      Any Text
                    </Typography> */}
                    <CustomInputField
                      InputWidth="100%"
                      type="text"
                      name="anytext"
                      placeholder="Enter custom text.,"
                    />
                  </Col>
                  <Col md={6} className="advanced-search-footer-btn-grp">
                    <LoadingButton
                      variant="contained"
                      type="submit"
                      loading={isLoading}
                      sx={{ mr: 2 }}
                    >
                      Search Scheduler
                    </LoadingButton>
                    <LoadingButton
                      variant="contained"
                      type="button"
                      onClick={HandleResetForm}
                    >
                      Reset Search Default
                    </LoadingButton>
                  </Col>
                </Row>
              </Form>
            )}}
          </Formik>
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  );
};

export default LeadScheduleAdvancedSearch;
