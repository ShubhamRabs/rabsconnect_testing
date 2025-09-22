import React from "react";
import Breadcrumb from "../../components/Breadcrumb/Breadcrumb";
import { Formik, Form } from "formik";
import { useBootstrap, useMui } from "../../hooks/Hooks";
import {
  CustomFormGroup,
  CustomInputField,
  CustomSelectField,
  CustomMultipleSelectField,
} from "./../../components/FormUtility/FormUtility";
import { ActivityStatus, SchedulerType } from "./../../data/LeadData";
import { groupBy } from "./../../hooks/Function";
import { useQuery } from "react-query";
import { getAllUsers } from "../../hooks/Users/useAllUsersHook";
// import { useAddNewLead } from "../../hooks/Leads/UseLeadsHook";
import { LeadSchedulerFormSchema } from "../../schema/Leads/LeadSchedulerFormSchema";
// import { useQueryClient } from "react-query";
import {
  getLeadScheduleCityDetailsData,
  getLeadScheduleDetailsByDateData,
  getLeadScheduleDetailsData,
  getLeadScheduleLocalityDetailsData,
  getLeadScheduleProjectDetailsData,
  getLeadScheduleFormDetailsData,
  useAddSchedulingLead,
} from "../../hooks/Leads/UseLeadSchedulingHook";

const AddLeadScheduling = ({ dispatch }) => {
  const { Card, Row } = useBootstrap();
  const { Divider, LoadingButton, ArrowBackIosIcon } = useMui();

  // State variable for grouping users based on their roles
  const [groupByUsersCreated, setGroupByUsersCreated] = React.useState([]);

  // const [cityName, setCityName] = React.useState([]);
  const [selectedDate, setSelectedDate] = React.useState({
    ldate_from: "",
    ldate_to: "",
  });

  const [selectedValues, setSelectedValues] = React.useState({
    source: "",
    service_type: "",
    pname: "",
    form_name: "",
    city: "",
  });

  const [errormessage, setErrormessage] = React.useState("");

  // const [isSelectServiceTypeView, setIsSelectServiceTypeView] = React.useState(true);

  const [fetchedOptions, setFetchedOptions] = React.useState({
    source: [
      {
        label: "",
        value: "",
      }, 
    ],
    serviceType: [
      {
        label: "",
        value: "",
      },
    ],
    pname: [
      {
        label: "",
        value: "",
      },
    ],
  });

  const [isReset, setIsReset] = React.useState(false);

  // const [isSelectProjectNameView, setIsSelectProjectView] = React.useState(true);

  // Queries to fetch data using custom hooks
  const AllUser = useQuery("AllUser", getAllUsers, {
    onSuccess: (data) => {
      // Grouping users based on their roles
      setGroupByUsersCreated(
        groupBy(
          data?.data.map((users) => ({
            label: users.username,
            value: users.id,
            urole: users.urole,
            branch_id: users.branch_id,
            tl_id: users.tl_id,
            sm_id: users.sm_id,
          })),
          "urole"
        )
      );
    },
  });

  const initialValues = {
    user_role: "",
    branch_admin_id: "",
    team_leader_id: "",
    sales_manager_id: "",
    tele_caller_id: "",
    schedule_type: "",
    ldate_from: "",
    ldate_to: "",
    source: "",
    service_type: "",
    pname: "",
    form_name: "",
    city: "",
    locality: "",
    no_of_leads: "",
    status: "",
  };

  const { mutate, isLoading } = useAddSchedulingLead();

  const getLeadScheduleDetails = useQuery("getLeadScheduleDetails", () => {
    return getLeadScheduleDetailsData();
  });

  const getLeadScheduleDetailsByDate = useQuery(
    ["getLeadScheduleDetailsByDate", selectedDate],
    () => {
      return getLeadScheduleDetailsByDateData(selectedDate);
    }
  );

  const getLeadScheduleProjectDetails = useQuery(
    [
      "getLeadScheduleProjectDetails",
      selectedValues.source,
      selectedValues.service_type,
      selectedDate.ldate_from,
      selectedDate.ldate_to,
    ],
    () => {
      return getLeadScheduleProjectDetailsData(
        selectedValues.source,
        selectedValues.service_type,
        selectedDate.ldate_from,
        selectedDate.ldate_to
      );
    }
  );

  const getLeadScheduleFormDetails = useQuery(
    [
      "getLeadScheduleFormDetails",
      selectedValues.source,
      selectedValues.service_type,
      selectedValues.pname,
      selectedDate.ldate_from,
      selectedDate.ldate_to,
    ],
    () => {
      return getLeadScheduleFormDetailsData(
        selectedValues.source,
        selectedValues.service_type,
        selectedValues.pname,
        selectedDate.ldate_from,
        selectedDate.ldate_to
      );
    }
  );

  const getLeadScheduleCityDetails = useQuery(
    [
      "getLeadScheduleCityDetails",
      selectedValues.source,
      selectedValues.service_type,
      selectedValues.pname,
      selectedDate.ldate_from,
      selectedDate.ldate_to,
    ],
    () => {
      return getLeadScheduleCityDetailsData(
        selectedValues.source,
        selectedValues.service_type,
        selectedValues.pname,
        selectedDate.ldate_from,
        selectedDate.ldate_to
      );
    }
  );

  const getLeadScheduleLocalityDetails = useQuery(
    [
      "getLeadScheduleLocalityDetails",
      selectedValues.source,
      selectedValues.service_type,
      selectedValues.pname,
      selectedValues.city,
      selectedDate.ldate_from,
      selectedDate.ldate_to,
    ],
    () => {
      return getLeadScheduleLocalityDetailsData(
        selectedValues.source,
        selectedValues.service_type,
        selectedValues.pname,
        selectedValues.city,
        selectedDate.ldate_from,
        selectedDate.ldate_to
      );
    }
  );

  // Arrays defining user roles
  const UserRole = [
    { label: "Branch Admin", value: "Branch Admin" },
    { label: "Team Leader", value: "Team Leader" },
    { label: "Sales Manager", value: "Sales Manager" },
    { label: "Tele Caller", value: "Tele Caller" },
  ];

  // Calculating disabled user roles based on the number of users
  const dBranchAdmin =
    (groupByUsersCreated["Branch Admin"]
      ? groupByUsersCreated["Branch Admin"].length
      : 0) <= 0
      ? "Branch Admin"
      : null;
  const dTeamLeader =
    (groupByUsersCreated["Team Leader"]
      ? groupByUsersCreated["Team Leader"].length
      : 0) <= 0
      ? "Team Leader"
      : null;
  const dSalesManger =
    (groupByUsersCreated["Sales Manager"]
      ? groupByUsersCreated["Sales Manager"].length
      : 0) <= 0
      ? "Sales Manager"
      : null;
  const dTeleCaller =
    (groupByUsersCreated["Tele Caller"]
      ? groupByUsersCreated["Tele Caller"].length
      : 0) <= 0
      ? "Tele Caller"
      : null;
  // Array of disabled user roles
  const DisabledUserRole = [
    dBranchAdmin,
    dTeamLeader,
    dSalesManger,
    dTeleCaller,
  ];

  // const queryClient = useQueryClient();

  const HandleSubmit = (values) => {
    let data = [values];
    mutate(data, {
      onSuccess: (data) => {
        if (data?.response?.status.toString() === "404") {
          setErrormessage("Error. This scheduler already exist.");
        } else {
          // queryClient.invalidateQueries("SubMenuLeadCount");
          // localStorage.setItem("successMessage", data.data);
          dispatch({ event: "leadscheduling" });
        }
      },
    });
  };

  const getAllServiceOptions = (byService, source, serviceTypes = {}) => {
    const serviceTypesOptionsSet = new Set();
    if (byService) {
      if (source.length > 0) {
        source.forEach((selectedSource) => {
          const serviceTypesBySource = serviceTypes?.[selectedSource] || [];
          serviceTypesBySource.forEach((serviceType) => {
            if (serviceType.includes(",")) {
              let serviceNameArray = serviceType.split(",");
              serviceNameArray.forEach((serviceNames) => {
                serviceTypesOptionsSet.add(serviceNames.trim());
              });
              return;
            }
            serviceTypesOptionsSet.add(serviceType.trim());
          });
        });
      } else {
        Object.keys(serviceTypes).forEach((selectedSource) => {
          const serviceTypesBySource = serviceTypes?.[selectedSource] || [];
          serviceTypesBySource.forEach((serviceType) => {
            if (serviceType.includes(",")) {
              let serviceNameArray = serviceType.split(",");
              serviceNameArray.forEach((serviceNames) => {
                serviceTypesOptionsSet.add(serviceNames.trim());
              });
              return;
            }
            serviceTypesOptionsSet.add(serviceType.trim());
          });
        });
      }
    } else {
      serviceTypes.forEach((serviceType) => {
        if (serviceType.includes(",")) {
          let serviceNameArray = serviceType.split(",");
          serviceNameArray.forEach((serviceNames) => {
            serviceTypesOptionsSet.add(serviceNames.trim());
          });
          return;
        }
        serviceTypesOptionsSet.add(serviceType.trim());
      });
    }
    const serviceTypesOptionsArray = Array.from(serviceTypesOptionsSet);
    const serviceTypesOptions = serviceTypesOptionsArray.map((serviceType) => ({
      label: serviceType,
      value: serviceType,
    }));

    return serviceTypesOptions;
  };

  const getProjectOptions = (byProject) => {
    let projectSet = new Set();
    if (byProject) {
      getLeadScheduleProjectDetails?.data?.data?.forEach((projectName) => {
        if (projectName.pname.includes(",")) {
          let projectNameArray = projectName.pname.split(",");
          projectNameArray.forEach((projectNames) => {
            // Use map instead of forEach
            projectSet.add(projectNames.trim());
          });
          return;
        }
        projectSet.add(projectName.pname.trim());
      });
    } else {
      getLeadScheduleDetails?.data?.data?.pname.forEach((projectName) => {
        if (projectName.includes(",")) {
          let projectNameArray = projectName.split(",");
          projectNameArray.forEach((projectNames) => {
            // Use map instead of forEach
            projectSet.add(projectNames.trim());
          });
          return;
        }
        projectSet.add(projectName.trim());
      });
    }

    const projectOptions = Array.from(projectSet).map((projectName) => ({
      label: projectName,
      value: projectName,
    }));
    return projectOptions;
  };

  const getFormOptions = (byProject) => {
    let formSet = new Set();
    if (byProject) {
      getLeadScheduleFormDetails?.data?.data?.forEach((formName) => {
        if (formName.form_name.includes(",")) {
          let formNameArray = formName.form_name.split(",");
          formNameArray.forEach((formNames) => {
            // Use map instead of forEach
            formSet.add(formNames.trim());
          });
          return;
        }
        formSet.add(formName.form_name.trim());
      });
    } else {
      getLeadScheduleDetails?.data?.data?.form_name.forEach((formName) => {
        if (formName.includes(",")) {
          let formNameArray = formName.split(",");
          formNameArray.forEach((formNames) => {
            // Use map instead of forEach
            formSet.add(formNames.trim());
          });
          return;
        }
        formSet.add(formName.trim());
      });
    }

    const formOptions = Array.from(formSet).map((formName) => ({
      label: formName,
      value: formName,
    }));
    return formOptions;
  };

  const getCityOptions = (byCity) => {
    let citySet = new Set();
    // getLeadScheduleCityDetails?.data?.data?.map(
    //   (projectName) => ({
    //     label: projectName.city,
    //     value: projectName.city,
    //   })
    // )
    if (byCity) {
      getLeadScheduleCityDetails?.data?.data?.forEach((cityName) => {
        if (cityName.city.includes(",")) {
          let cityNameArray = cityName.city.split(",");
          cityNameArray.forEach((cityNames) => {
            // Use map instead of forEach
            citySet.add(cityNames.trim());
          });
          return;
        }
        citySet.add(cityName.city.trim());
      });
    } else {
      getLeadScheduleDetails?.data?.data?.city.forEach((cityName) => {
        if (cityName.includes(",")) {
          let cityNameArray = cityName.split(",");
          cityNameArray.forEach((cityNames) => {
            // Use map instead of forEach
            citySet.add(cityNames.trim());
          });
          return;
        }
        citySet.add(cityName.trim());
      });
    }

    const cityOptions = Array.from(citySet).map((cityName) => ({
      label: cityName,
      value: cityName,
    }));
    return cityOptions;
  };

  const getLocalityOptions = (byLocality) => {
    let localitySet = new Set();
    if (byLocality) {
      getLeadScheduleLocalityDetails?.data?.data?.forEach((localityName) => {
        if (localityName.locality.includes(",")) {
          let localityNameArray = localityName.locality.split(",");
          localityNameArray.forEach((localityNames) => {
            localitySet.add(localityNames.trim());
          });
          return;
        }
        localitySet.add(localityName.locality.trim());
      });
    } else {
      getLeadScheduleDetails?.data?.data?.locality.forEach((localityName) => {
        if (localityName.includes(",")) {
          let localityNameArray = localityName.split(",");
          localityNameArray.forEach((localityNames) => {
            localitySet.add(localityNames.trim());
          });
          return;
        }
        localitySet.add(localityName.trim());
      });
    }

    const cityOptions = Array.from(localitySet).map((cityName) => ({
      label: cityName,
      value: cityName,
    }));
    return cityOptions;
  };

  return (
    <>
      <Breadcrumb PageName="Add Lead Scheduling"
        BackButton={[
          true,
          "Back",
          <ArrowBackIosIcon />,
          () =>
            dispatch({
              event:
                localStorage.getItem("previousScreen") ===
                  localStorage.getItem("currScreen")
                  ? "leadscheduling"
                  : localStorage.getItem("previousScreen"),
            }),
        ]}
      />
      <Formik
        initialValues={initialValues}
        validationSchema={LeadSchedulerFormSchema}
        onSubmit={HandleSubmit}
      >
        {({ values, setFieldValue, errors }) => {
          console.log("Heello", values);
          return (
            <Form>
              <Card>
                <Card.Body>
                  <Card.Title>Lead Scheduler Details :-</Card.Title>
                  <Divider />

                  <Row className="mt-1">
                    <CustomFormGroup
                      formlabel="Schedule Type"
                      star="*"
                      FormField={
                        <CustomSelectField
                          name="schedule_type"
                          placeholder="Select a Schedule Type"
                          options={SchedulerType}
                          isLabelValue={true}
                          FieldValue={setFieldValue}
                          values={values}
                        />
                      }
                    />
                  </Row>
                  <Row className="mt-1">
                    <CustomFormGroup
                      formlabel="User Role"
                      star="*"
                      FormField={
                        <CustomSelectField
                          name="user_role"
                          isLabelValue={true}
                          FieldValue={setFieldValue}
                          placeholder="Select a User Role"
                          options={UserRole}
                          disabledOptions={DisabledUserRole}
                          required
                        />
                      }
                    />

                    {values.user_role === "Branch Admin" && (
                      <CustomFormGroup
                        formlabel="Branch Admin"
                        star="*"
                        FormField={
                          <CustomSelectField
                            name="branch_admin_id"
                            isLabelValue={true}
                            FieldValue={(name, value) =>
                              setFieldValue(name, value)
                            }
                            placeholder={
                              values.user_role === "Branch Admin"
                                ? "Select a Branch Admin"
                                : "First Select Branch Admin then select Team Leader"
                            }
                            options={groupByUsersCreated["Branch Admin"]}
                          />
                        }
                      />
                    )}


                    {values.user_role === "Team Leader" &&
                      (groupByUsersCreated["Team Leader"] &&
                        groupByUsersCreated["Team Leader"].length > 0 ? (
                        <CustomFormGroup
                          formlabel="Team Leader"
                          star="*"
                          FormField={
                            values.schedule_type === "Round Robin Scheduler" ? (
                              <CustomMultipleSelectField
                                name="team_leader_id"
                                isLabelValue={true}
                                FieldValue={(name, value) =>
                                  setFieldValue(name, value)
                                }
                                placeholder="Select a Team Leader"
                                options={groupByUsersCreated["Team Leader"]}
                                required
                              />
                            ) : (
                              <CustomSelectField
                                name="team_leader_id"
                                isLabelValue={true}
                                FieldValue={(name, value) =>
                                  setFieldValue(name, value)
                                }
                                placeholder="Select a Team Leader"
                                options={groupByUsersCreated["Team Leader"]}
                                required
                              />
                            )
                          }
                        />
                      ) : null)}

                    {values.user_role === "Sales Manager" ? (
                      <>
                        {groupByUsersCreated["Sales Manager"] &&
                          groupByUsersCreated["Sales Manager"].length > 0 ? (
                          <CustomFormGroup
                            formlabel="Sales Manager"
                            star="*"
                            FormField={
                              values.schedule_type === "Round Robin Scheduler" ? (
                                <CustomMultipleSelectField
                                  name="sales_manager_id"
                                  isLabelValue={true}
                                  FieldValue={(name, value) =>
                                    setFieldValue(name, value)
                                  }
                                  placeholder="Select a Sales Manager"
                                  options={groupByUsersCreated["Sales Manager"]}
                                />
                              ) : (
                                <CustomSelectField
                                  name="sales_manager_id"
                                  isLabelValue={true}
                                  FieldValue={(name, value) =>
                                    setFieldValue(name, value)
                                  }
                                  placeholder="Select a Sales Manager"
                                  options={groupByUsersCreated["Sales Manager"]}
                                />
                              )
                            }
                          />
                        ) : (
                          ""
                        )}
                      </>
                    ) : null}

                    {values.user_role === "Tele Caller" ? (
                      <>
                        {groupByUsersCreated["Tele Caller"] &&
                          groupByUsersCreated["Tele Caller"].length > 0 ? (
                          <CustomFormGroup
                            formlabel="Tele Caller"
                            star="*"
                            FormField={
                              values.schedule_type === "Round Robin Scheduler" ? (
                                <CustomMultipleSelectField
                                  name="tele_caller_id"
                                  isLabelValue={true}
                                  FieldValue={(name, value) =>
                                    setFieldValue(name, value)
                                  }
                                  placeholder="Select a Tele Caller"
                                  options={groupByUsersCreated["Tele Caller"]}
                                />
                              ) : (
                                <CustomSelectField
                                  name="tele_caller_id"
                                  isLabelValue={true}
                                  FieldValue={(name, value) =>
                                    setFieldValue(name, value)
                                  }
                                  placeholder="Select a Tele Caller"
                                  options={groupByUsersCreated["Tele Caller"]}
                                />
                              )
                            }
                          />
                        ) : (
                          ""
                        )}
                      </>
                    ) : null}
                  </Row>

                  <Row className="mt-1">
                    <CustomFormGroup
                      formlabel="Lead Date From"
                      star=""
                      FormField={
                        <CustomInputField
                          InputWidth="100%"
                          type="date"
                          name="ldate_from"
                          placeholder=""
                          onChange={(e) => {
                            if (e.target.value === "") {
                              setSelectedDate({ ldate_from: "", ldate_to: "" });
                              setFieldValue("ldate_to", "");
                            }
                            setFieldValue("ldate_from", e.target.value);
                            setIsReset(true);
                          }}
                        />
                      }
                    />
                    {values.ldate_from && (
                      <CustomFormGroup
                        formlabel="Lead Date To"
                        star=""
                        FormField={
                          <CustomInputField
                            InputWidth="100%"
                            type="date"
                            name="ldate_to"
                            placeholder=""
                            onChange={(e) => {
                              if (values.ldate_from === "") {
                                setFieldValue("ldate_to", "");
                                setSelectedDate({
                                  ldate_from: "",
                                  ldate_to: "",
                                });
                                return;
                              }
                              // if (e.target.value < values.ldate_from) {
                              //   setFieldValue("ldate_to", '');
                              // }
                              // console.log("Hello Date",e.target.value,values.ldate_from)
                              setFieldValue("ldate_to", e.target.value);
                              setSelectedDate({
                                ldate_from: values.ldate_from,
                                ldate_to: e.target.value,
                              });
                              setIsReset(true);
                              setFetchedOptions((prevState) => {
                                const sourceOptions =
                                  getLeadScheduleDetailsByDate?.data?.data
                                    ?.source
                                    ? getLeadScheduleDetailsByDate?.data?.data?.source.map(
                                      ({ source }) => ({
                                        label: source,
                                        value: source,
                                      })
                                    )
                                    : [];
                                return {
                                  ...prevState,
                                  source: sourceOptions,
                                };
                              });
                            }}
                          />
                        }
                      />
                    )}

                    {selectedDate.ldate_from &&
                      selectedDate.ldate_to &&
                      getLeadScheduleDetailsByDate?.data?.data?.source?.length ===
                      0 ? null : (
                      <CustomFormGroup
                        formlabel="Source"
                        star=""
                        FormField={
                          <CustomMultipleSelectField
                            name="source"
                            // FieldValue={setFieldValue}
                            FieldValue={(fieldName, selectedOptions) => {
                              setFieldValue(fieldName, selectedOptions);
                              // setIsSelectServiceTypeView(true);
                              setIsReset(false);
                              setSelectedValues((prev) => ({
                                ...prev,
                                source: selectedOptions,
                              }));
                            }}
                            placeholder="Select Source"
                            options={
                              selectedDate.ldate_from && selectedDate.ldate_to
                                ? getLeadScheduleDetailsByDate?.data?.data
                                  ?.source
                                  ? getLeadScheduleDetailsByDate?.data?.data?.source.map(
                                    ({ source }) => ({
                                      label: source,
                                      value: source,
                                    })
                                  )
                                  : // fetchedOptions.source
                                  []
                                : getLeadScheduleDetails?.data?.data?.source
                                  ? getLeadScheduleDetails?.data?.data?.source.map(
                                    (source) => ({
                                      label: source,
                                      value: source,
                                    })
                                  )
                                  : []
                            }
                            isLabelValue={true}
                            required
                            resetField={isReset}
                          />
                        }
                      />
                    )}

                    {((!values.ldate_from &&
                      !values.ldate_to &&
                      values.source?.length > 0 &&
                      getAllServiceOptions(
                        true,
                        values.source,
                        getLeadScheduleDetails?.data?.data?.serviceTypeBySource
                      ).length === 0) ||
                      (values.ldate_from && values.ldate_to)) &&
                      getAllServiceOptions(
                        true,
                        values.source,
                        getLeadScheduleDetailsByDate?.data?.data?.serviceTypes
                      ).length === 0 ? null : (
                      <CustomFormGroup
                        formlabel="Service Type"
                        star=""
                        FormField={
                          <CustomMultipleSelectField
                            name="service_type"
                            placeholder="Select Service Type"
                            options={
                              selectedDate.ldate_from && selectedDate.ldate_to
                                ? getLeadScheduleDetailsByDate?.data?.data
                                  ?.serviceTypes
                                  ? getAllServiceOptions(
                                    true,
                                    values.source,
                                    getLeadScheduleDetailsByDate?.data?.data
                                      ?.serviceTypes
                                  )
                                  : []
                                : values.source && values.source.length > 0
                                  ? getLeadScheduleDetails?.data?.data
                                    ?.serviceTypeBySource
                                    ? getAllServiceOptions(
                                      true,
                                      values.source,
                                      getLeadScheduleDetails?.data?.data
                                        ?.serviceTypeBySource
                                    )
                                    : []
                                  : getLeadScheduleDetails?.data?.data
                                    ?.service_type
                                    ? // getLeadScheduleDetails?.data?.data?.service_type.map(
                                    //     (serviceType) => ({
                                    //       label: serviceType,
                                    //       value: serviceType,
                                    //     })
                                    //   )
                                    getAllServiceOptions(
                                      false,
                                      values.source,
                                      getLeadScheduleDetails?.data?.data
                                        ?.service_type
                                    )
                                    : []
                            }
                            isLabelValue={true}
                            // FieldValue={setFieldValue}
                            FieldValue={(fieldName, selectedOptions) => {
                              setFieldValue(fieldName, selectedOptions);
                              setIsReset(false);
                              setSelectedValues((prev) => ({
                                ...prev,
                                service_type: selectedOptions,
                              }));
                            }}
                            resetField={isReset}
                            values={values}
                          />
                        }
                      />
                    )}

                    {((values.source && values.source.length > 0) ||
                      (values.service_type && values.service_type.length > 0) ||
                      (values.ldate_from && values.ldate_to)) &&
                      getLeadScheduleProjectDetails?.data?.data.length ===
                      0 ? null : (
                      <CustomFormGroup
                        formlabel="Project Name"
                        star=""
                        FormField={
                          <CustomMultipleSelectField
                            name="pname"
                            placeholder="Select Project Name"
                            options={
                              (values.source && values.source.length > 0) ||
                                (values.service_type &&
                                  values.service_type.length > 0) || (values.ldate_from && values.ldate_to)
                                ? getLeadScheduleProjectDetails?.data?.data
                                  .length > 0
                                  ? getProjectOptions(true)
                                  : []
                                : getLeadScheduleDetails?.data?.data?.pname
                                  ? getProjectOptions(false)
                                  : []
                            }
                            isLabelValue={true}
                            FieldValue={(fieldName, selectedOptions) => {
                              setFieldValue(fieldName, selectedOptions);
                              setIsReset(false);
                              setSelectedValues((prev) => ({
                                ...prev,
                                pname: selectedOptions,
                              }));
                            }}
                            values={values}
                            resetField={isReset}
                          />
                        }
                      />
                    )}

                    {(!values.source.length > 0 && !values.source.includes("Facebook")) 
                    ||
                    //   (values.service_type && values.service_type.length > 0) ||
                    //   (values.ldate_from && values.ldate_to)) &&
                    getLeadScheduleFormDetails?.data?.data.length ===
                      0
                       ? null : (
                      <CustomFormGroup
                        formlabel="Form Name"
                        star=""
                        FormField={
                          <CustomMultipleSelectField
                            name="form_name"
                            placeholder="Select Form Name"
                            options={
                              (values.source && values.source.length > 0 && values.source.includes("Facebook")) 
                              // ||
                              //   (values.service_type &&
                              //     values.service_type.length > 0) || (values.ldate_from && values.ldate_to)
                                ? getLeadScheduleFormDetails?.data?.data
                                  .length > 0
                                  ? getFormOptions(true)
                                  : []
                                : getLeadScheduleFormDetails?.data?.data?.pname
                                  ? getFormOptions(false)
                                  : []
                            }
                            isLabelValue={true}
                            FieldValue={(fieldName, selectedOptions) => {
                              setFieldValue(fieldName, selectedOptions);
                              setIsReset(false);
                              setSelectedValues((prev) => ({
                                ...prev,
                                form_name: selectedOptions,
                              }));
                            }}
                            values={values}
                            resetField={isReset}
                          />
                        }
                      />
                    )}

                    {((values.source && values.source.length > 0) ||
                      (values.service_type && values.service_type.length > 0) ||
                      (values.pname && values.pname.length > 0) ||
                      (values.ldate_from && values.ldate_to)) &&
                      getLeadScheduleCityDetails?.data?.data.length ===
                      0 ? null : (
                      <CustomFormGroup
                        formlabel="City"
                        star=""
                        FormField={
                          <CustomMultipleSelectField
                            name="city"
                            placeholder="Select City"
                            options={
                              (values.source && values.source.length > 0) ||
                                (values.service_type &&
                                  values.service_type.length > 0) ||
                                (values.pname && values.pname.length > 0) || (values.ldate_from && values.ldate_to)
                                ? getLeadScheduleCityDetails?.data?.data
                                  .length > 0
                                  ? getCityOptions(true)
                                  : []
                                : getLeadScheduleDetails?.data?.data?.city
                                  ? // getLeadScheduleDetails?.data?.data?.city.map(
                                  //     (cityOption) => ({
                                  //       label: cityOption,
                                  //       value: cityOption,
                                  //     })
                                  //   )
                                  getCityOptions(false)
                                  : []
                            }
                            isLabelValue={true}
                            FieldValue={(fieldName, selectedOptions) => {
                              // Update cityName state whenever city dropdown selection changes
                              setIsReset(false);
                              setFieldValue(fieldName, selectedOptions);
                              // Get the selected city value and set it to cityName state
                              // const selectedCity =
                              //   selectedOptions.length > 0
                              //     ? selectedOptions
                              //     : [];
                              // setCityName(selectedCity);
                              setSelectedValues((prev) => ({
                                ...prev,
                                city: selectedOptions,
                              }));
                            }}
                            values={values}
                            resetField={isReset}
                          />
                        }
                      />
                    )}

                    {((values.source && values.source.length > 0) ||
                      (values.service_type && values.service_type.length > 0) ||
                      (values.pname && values.pname.length > 0) ||
                      (values.city && values.city.length > 0) ||
                      (values.ldate_from && values.ldate_to)) &&
                      getLeadScheduleLocalityDetails?.data?.data.length ===
                      0 ? null : (
                      <CustomFormGroup
                        formlabel="Locality"
                        star=""
                        FormField={
                          <CustomMultipleSelectField
                            name="locality"
                            placeholder="Select Locality"
                            options={
                              (values.source && values.source.length > 0) ||
                                (values.service_type &&
                                  values.service_type.length > 0) ||
                                (values.pname && values.pname.length > 0) ||
                                (values.city && values.city.length > 0) || (values.ldate_from && values.ldate_to)
                                ? getLeadScheduleLocalityDetails?.data?.data
                                  .length > 0
                                  ? // getLeadScheduleLocalityDetails?.data?.data?.map(
                                  //     (projectName) => ({
                                  //       label: projectName.locality,
                                  //       value: projectName.locality,
                                  //     })
                                  //   )
                                  getLocalityOptions(true)
                                  : []
                                : getLeadScheduleDetails?.data?.data?.locality
                                  ? getLocalityOptions(false)
                                  : []
                            }
                            isLabelValue={true}
                            FieldValue={(fieldName, selectedOptions) => {
                              setFieldValue(fieldName, selectedOptions);
                              setIsReset(false);
                            }}
                            values={values}
                            resetField={isReset}
                          />
                        }
                      />
                    )}

                    {/* {values.schedule_type === "Round Robin Scheduler" && (
                      <CustomFormGroup
                        formlabel="No. Of Leads To Assign"
                        star="*"
                        FormField={
                          <CustomInputField
                            InputWidth="100%"
                            type="number"
                            name="no_of_leads"
                            placeholder="Enter No. Of Leads To Assign"
                          />
                        }
                      />
                    )} */}

                    <CustomFormGroup
                      formlabel="Status"
                      star="*"
                      FormField={
                        <CustomSelectField
                          name="status"
                          placeholder="Select a Status"
                          options={ActivityStatus}
                          isLabelValue={true}
                          FieldValue={setFieldValue}
                          values={values}
                        />
                      }
                    />
                  </Row>
                  {errors.input1Validation && (
                    <div className="error mb-2">{errors.input1Validation}</div>
                  )}

                  {errormessage && (
                    <div className="error mb-2">{errormessage}</div>
                  )}

                  <div className="text-left">
                    <LoadingButton
                      type="submit"
                      variant="contained"
                      loading={isLoading}
                    >
                      Add Scheduler
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

export default AddLeadScheduling;
