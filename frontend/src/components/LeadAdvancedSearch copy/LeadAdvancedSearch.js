import React from "react";
import { useBootstrap, useMui, useSetting } from "../../hooks/Hooks";
import { Formik, Form } from "formik";
import "./LeadAdvancedSearch.css";
import {
  CustomInputField,
  CustomMultipleSelectField,
} from "../FormUtility/FormUtility";
import { GetAllSource } from "../../hooks/DynamicFields/useSourceHook";
import { ProjectNameDropDownData } from "./../../hooks/DynamicFields/useProjectNameHook";
import { useQuery } from "react-query";
import { CreateLabelValueArray, groupBy } from "../../hooks/Function";
import {
  ServiceType,
  PropertyCategory,
  PropertyType,
} from "./../../data/LeadData";
import { Country, State, City } from "./../../data/CountryStateCity";
import { useSearchLeads } from "../../hooks/AdvancedSearch/LeadAdvancedSearchHook";
import { GetAllLocality } from "../../hooks/Other/UseLocalityHook";
import { GetAllConfiguration } from "./../../hooks/DynamicFields/UseConfigurationHook";
import { GetAllLeadStatus } from "./../../hooks/DynamicFields/UseLeadStatusHook";
import { getAllUsers } from "../../hooks/Users/useAllUsersHook";
import CryptoJS from "crypto-js";
import { GetAllFormName } from "../../hooks/Other/UseOtherHook";
import validationSchema from "../../schema/Leads/LeadAdvanceSearchSchema";
import { GetAllLeadPriority } from "../../hooks/DynamicFields/UseLeadPriorityHook";

const LeadAdvancedSearch = ({
  PassSearchData,
  PassPageName,
  page,
  pageSize,
  dispatch,
  hideSourceDropdown,
}) => {
  const { Accordion, Row, Col } = useBootstrap();
  const { LoadingButton, Typography } = useMui();
  const { globalData } = useSetting();

  const [status, setStatus] = React.useState({
    sourceList: false,
    projectNameList: false,
  });

  const [ResetForm, setResetForm] = React.useState(false);
  const [SearchDeatils, setSearchDeatils] = React.useState([]);
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
  console.log("first time", previousScreen);

  const initialValues = {
    source: previousSearchData ? previousSearchData.source : "",
    form_name: previousSearchData ? previousSearchData.form_name : "",
    service_type: previousSearchData ? previousSearchData.service_type : "",
    pname: previousSearchData ? previousSearchData.pname : "",
    ptype: previousSearchData ? previousSearchData.ptype : "",
    country: previousSearchData ? previousSearchData.country : "",
    state: previousSearchData ? previousSearchData.state : "",
    city: previousSearchData ? previousSearchData.city : "",
    locality: previousSearchData ? previousSearchData.locality : "",
    pcategory: previousSearchData ? previousSearchData.pcategory : "",
    pconfiguration: previousSearchData ? previousSearchData.pconfiguration : "",
    leadstatus: previousSearchData ? previousSearchData.leadstatus : "",
    userstatus: previousSearchData ? previousSearchData.userstatus : "",
    branch_admin: previousSearchData ? previousSearchData.branch_admin : "",
    team_leader: previousSearchData ? previousSearchData.team_leader : "",
    sales_manager: previousSearchData ? previousSearchData.sales_manager : "",
    tele_caller: previousSearchData ? previousSearchData.tele_caller : "",
    lead_priority: previousSearchData ? previousSearchData.lead_priority : "",
    ldate_from: "",
    ldate_to: "",
    fdate_from: "",
    fdate_to: "",
    anytext: "",
    pageName: PassPageName,
  };
  const { mutate, isLoading } = useSearchLeads();

  const HandleSubmit = (values) => {
    dispatch({ event: "sotre_search_data", data: JSON.stringify(values) });
    setSearchDeatils(values);
    let data = [values, page, pageSize];
    mutate(data, {
      onSuccess: (data) => {
        console.log(data, "from line 96")
        PassSearchData(data);
        // console.log(data, "from line 95 LeadAdvancedSearch.js");
      },
    });
  };

  React.useEffect(() => {
    if (SearchDeatils.length !== 0) {
      let data = [SearchDeatils, page, pageSize];
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
      previousScreen !== "viewleaddetails" ||
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

  const SourceList = useQuery("sourceList", () => {
    return GetAllSource(["source"]);
  });
  const LeadPriorityList = useQuery("leadPriority", () => {
    return GetAllLeadPriority(["lead_priority"]);
  });

  const FormNameList = useQuery("FormNameList", () => {
    return GetAllFormName();
  });

  const ProjectNameList = useQuery(
    "project-name",
    () => {
      return ProjectNameDropDownData();
    },
    { enabled: status.projectNameList }
  );

  const LocalityList = useQuery(
    "locality",
    () => {
      return GetAllLocality(["locality"]);
    },
    { enabled: status.LocalityList }
  );

  const ConfigurationList = useQuery(
    "AllConfiguration",
    () => {
      return GetAllConfiguration(["configuration", "configuration_type"]);
    },
    { enabled: status.ConfigurationList }
  );

  const LeadStatusList = useQuery(
    "AllLeadStatus",
    () => {
      return GetAllLeadStatus(["status"]);
    },
    { enabled: status.LeadStatusList }
  );

  const AllUsers = useQuery(
    "allUserslist",
    () => {
      return getAllUsers();
    },
    {
      onSuccess: (data) => {
        setAllUserGroup(
          groupBy(
            data.data.map((users) => ({
              label: users.username,
              value: users.id,
              urole: users.urole,
            })),
            "urole"
          )
        );
      },
    }
  );

  const HandleResetForm = (resetForm) => {
    localStorage.removeItem("sotre_search_data");
    setResetForm(true);
    setSearchDeatils([]);
    PassSearchData([]);
    resetForm();
    setTimeout(() => {
      setResetForm(false);
    }, 100);
  };

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
            validationSchema={validationSchema}
            onSubmit={HandleSubmit}
          >
            {({ values, setFieldValue, resetForm }) => {
              return (
                <Form className="mt-3">
                  <Row>
                    {hideSourceDropdown ? (
                      <Col md={3}>
                        <h5>Search Broker's Lead</h5>
                      </Col>
                    ) : (
                      <Col md={3}>
                        <CustomMultipleSelectField
                          name="source"
                          placeholder="Select Source"
                          options={CreateLabelValueArray(
                            SourceList.data,
                            "source"
                          )}
                          isLabelValue={true}
                          FieldValue={setFieldValue}
                          values={values}
                          resetField={resetForm}
                        />
                      </Col>
                    )}
                    <Col md={3}>
                      <CustomMultipleSelectField
                        name="service_type"
                        placeholder="Select Service Type"
                        options={ServiceType}
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
                        options={CreateLabelValueArray(
                          ProjectNameList.data?.data,
                          "pname"
                        )}
                        isLabelValue={true}
                        FieldValue={setFieldValue}
                        values={values}
                        resetField={ResetForm}
                      />
                    </Col>
                    <Col md={3}>
                      <CustomMultipleSelectField
                        name="ptype"
                        placeholder="Select Project Type"
                        options={PropertyType}
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
                        options={CreateLabelValueArray(
                          Country,
                          "name",
                          "isoCode"
                        )}
                        isLabelValue={true}
                        placeholder="Select Country"
                        name="country"
                        FieldValue={setFieldValue} // Pass setFieldValue to the component
                        values={values} // Pass values to the component
                        resetField={ResetForm}
                      />
                    </Col>
                    <Col md={3}>
                      <CustomMultipleSelectField
                        options={
                          values.country
                            ? CreateLabelValueArray(
                              State.filter(
                                (row) =>
                                  values.country.indexOf(row.countryCode) !==
                                  -1
                              ),
                              "name",
                              "isoCode"
                            )
                            : []
                        }
                        isLabelValue={true}
                        placeholder="Select State"
                        name="state"
                        FieldValue={setFieldValue} // Pass setFieldValue to the component
                        values={values} // Pass values to the component
                        resetField={ResetForm}
                      />
                    </Col>
                    <Col md={3}>
                      <CustomMultipleSelectField
                        options={
                          values.state
                            ? CreateLabelValueArray(
                              City.filter(
                                (row) =>
                                  values.state.indexOf(row.stateCode) !== -1
                              ),
                              "name"
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
                          !LocalityList.isLoading
                            ? CreateLabelValueArray(
                              LocalityList.data,
                              "locality"
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
                  </Row>
                  <Row className="mt-4">
                    <Col md={3}>
                      <CustomMultipleSelectField
                        options={
                          values.ptype
                            ? CreateLabelValueArray(
                              PropertyCategory.filter(
                                (row) => values.ptype.indexOf(row.type) !== -1
                              ),
                              "label",
                              "value"
                            )
                            : []
                        }
                        isLabelValue={true}
                        name="pcategory"
                        placeholder="Property category"
                        FieldValue={setFieldValue} // Pass setFieldValue to the component
                        values={values} // Pass values to the component
                        resetField={ResetForm}
                      />
                    </Col>
                    <Col md={3}>
                      <CustomMultipleSelectField
                        options={
                          values.ptype
                            ? CreateLabelValueArray(
                              ConfigurationList.data?.filter(
                                (row) =>
                                  values.ptype.indexOf(
                                    row.configuration_type
                                  ) !== -1
                              ),
                              "configuration"
                            )
                            : []
                        }
                        onFocus={() =>
                          setStatus({ ...status, ConfigurationList: true })
                        }
                        isLabelValue={true}
                        name="pconfiguration"
                        placeholder="Configuration"
                        FieldValue={setFieldValue} // Pass setFieldValue to the component
                        values={values} // Pass values to the component
                        resetField={ResetForm}
                      />
                    </Col>
                    <Col md={3}>
                      <CustomMultipleSelectField
                        options={
                          !LeadStatusList.isLoading
                            ? CreateLabelValueArray(
                              LeadStatusList.data,
                              "status"
                            )
                            : []
                        }
                        onFocus={() =>
                          setStatus({ ...status, ConfigurationList: true })
                        }
                        isLabelValue={true}
                        name="leadstatus"
                        placeholder="Lead Status"
                        FieldValue={setFieldValue} // Pass setFieldValue to the component
                        values={values} // Pass values to the component
                        resetField={ResetForm}
                        initialValue={
                          initialValues.leadstatus !== ""
                            ? CreateLabelValueArray(
                              convertArrayToObjectsWithLabelKey(
                                initialValues.leadstatus
                              ),
                              "label"
                            )
                            : []
                        }
                      />
                    </Col>
                    <Col md={3}>
                      <CustomMultipleSelectField
                        options={
                          !LeadStatusList.isLoading
                            ? CreateLabelValueArray(
                              LeadStatusList.data,
                              "status"
                            )
                            : []
                        }
                        onFocus={() =>
                          setStatus({ ...status, ConfigurationList: true })
                        }
                        isLabelValue={true}
                        name="userstatus"
                        placeholder="User Lead Status"
                        FieldValue={setFieldValue} // Pass setFieldValue to the component
                        values={values} // Pass values to the component
                        resetField={ResetForm}
                      />
                    </Col>
                  </Row>
                  <Row className="mt-4">
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
                    <Col md={3}>
                      <CustomMultipleSelectField
                        name="lead_priority"
                        placeholder="Select Lead Priority"
                        options={CreateLabelValueArray(
                          LeadPriorityList.data,
                          "lead_priority"
                        )}
                        isLabelValue={true}
                        FieldValue={setFieldValue}
                        values={values}
                        resetField={resetForm}
                      />
                    </Col>
                  </Row>
                  <Row className="mt-4">
                    <Col md={3} className="date-from-group">
                      <Typography
                        variant="subtitle2"
                        sx={{ fontWeight: "400" }}
                      >
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
                      <Typography
                        variant="subtitle2"
                        sx={{ fontWeight: "400" }}
                      >
                        Lead Date To
                      </Typography>
                      <CustomInputField
                        InputWidth="100%"
                        type="date"
                        name="ldate_to"
                        placeholder=""
                      />
                    </Col>
                    <Col md={3} className="date-from-group">
                      <Typography
                        variant="subtitle2"
                        sx={{ fontWeight: "400" }}
                      >
                        Followup Date From
                      </Typography>
                      <CustomInputField
                        InputWidth="100%"
                        type="date"
                        name="fdate_from"
                        placeholder=""
                      />
                    </Col>
                    <Col md={3} className="date-from-group">
                      <Typography
                        variant="subtitle2"
                        sx={{ fontWeight: "400" }}
                      >
                        Followup Date To
                      </Typography>
                      <CustomInputField
                        InputWidth="100%"
                        type="date"
                        name="fdate_to"
                        placeholder=""
                      />
                    </Col>
                  </Row>
                  <Row className="mt-4">
                    <Col
                      md={values.source.includes("Facebook") ? 3 : 6}
                      className="anytext-from-group"
                    >
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
                        Search Lead
                      </LoadingButton>
                      <LoadingButton
                        variant="contained"
                        type="button"
                        onClick={() => HandleResetForm(resetForm)}
                      >
                        Reset Search Default
                      </LoadingButton>
                    </Col>
                  </Row>
                </Form>
              );
            }}
          </Formik>
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  );
};

export default LeadAdvancedSearch;
