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
  LeadAssignType,
} from "./../../data/LeadData";
import { useSearchLeadAssignReport } from "../../hooks/AdvancedSearch/LeadAssignReportAdvanceSearchHook";
import { getAllUsers } from "../../hooks/Users/useAllUsersHook";
import CryptoJS from "crypto-js";
import { getLeadAssignReportSearchDetails } from "../../hooks/Leads/UseLeadAssignReportHook";

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
    assign_type: previousSearchData ? previousSearchData.assign_type : "",
    user_master: previousSearchData ? previousSearchData.user_master : "",
    user_admin: previousSearchData ? previousSearchData.user_admin : "",
    branch_admin: previousSearchData ? previousSearchData.branch_admin : "",
    team_leader: previousSearchData ? previousSearchData.team_leader : "",
    sales_manager: previousSearchData ? previousSearchData.sales_manager : "",
    tele_caller: previousSearchData ? previousSearchData.tele_caller : "",
    ladate_from: "",
    ladate_to: "",
    anytext: "",
    pageName: PassPageName,
  };
  const { mutate, isLoading } = useSearchLeadAssignReport();

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


  const LeadAssignReportSearchDetails = useQuery("LeadAssignReportSearchDetails", () => {
    return getLeadAssignReportSearchDetails();
  });

  const AllUsers = useQuery(
    "allUserslist",
    () => {
      return getAllUsers();
    },
    // {
    //   onSuccess: (data) => {
    //     if (LeadAssignReportSearchDetails.isSuccess) {
    //       let users = [];
    //       data.data.forEach((user) => {
    //         if (LeadAssignReportSearchDetails.data.data.assign_to.includes(user.id.toString())) {
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
    if (AllUsers.isSuccess && LeadAssignReportSearchDetails.isSuccess) {
      const users = AllUsers.data.data.filter((user) =>
        LeadAssignReportSearchDetails.data.data.assign_by_to.includes(user.id.toString())
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
  }, [AllUsers.isSuccess, LeadAssignReportSearchDetails.isSuccess, AllUsers.data]);

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

  // function convertArrayToObjectsWithLabelKey(array) {
  //   return array.map((item) => ({ label: item }));
  // }

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
                      name="assign_type"
                      placeholder="Select Assign Type"
                      options={LeadAssignType}
                      isLabelValue={true}
                      FieldValue={setFieldValue}
                      values={values}
                      resetField={ResetForm}
                    />
                  </Col>
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
                      placeholder="Select Branch Admin"
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
                      placeholder="Select Team Leader"
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
                      placeholder="Select Sales Manager"
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
                      placeholder="Select Tele Caller"
                      FieldValue={setFieldValue} // Pass setFieldValue to the component
                      values={values} // Pass values to the component
                      resetField={ResetForm}
                    />
                  </Col>
                </Row>
                <Row className="mt-4">  
                  <Col md={3} className="date-from-group">
                    <Typography variant="subtitle2" sx={{ fontWeight: "400" }}>
                      Lead Assign Date From
                    </Typography>
                    <CustomInputField
                      InputWidth="100%"
                      type="date"
                      name="ladate_from"
                      placeholder=""
                    />
                  </Col>
                  <Col md={3} className="date-from-group">
                    <Typography variant="subtitle2" sx={{ fontWeight: "400" }}>
                      Lead Assign Date To
                    </Typography>
                    <CustomInputField
                      InputWidth="100%"
                      type="date"
                      name="ladate_to"
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
                      Search Assign Report
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
