import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Box, Drawer, Button, Divider, Typography } from "@mui/material";
import { Formik, Form } from "formik";
import { useQuery } from "react-query";
import CryptoJS from "crypto-js";
import {
  CustomInputField,
  CustomMultipleSelectField,
} from "../FormUtility/FormUtility";
import { useBootstrap, useMui, useSetting } from "../../hooks/Hooks";
import { GetAllSource } from "../../hooks/DynamicFields/useSourceHook";
import { ProjectNameDropDownData } from "./../../hooks/DynamicFields/useProjectNameHook";
import { GetAllConfiguration } from "./../../hooks/DynamicFields/UseConfigurationHook";
import { GetAllLeadStatus } from "./../../hooks/DynamicFields/UseLeadStatusHook";
import { GetAllLeadPriority } from "../../hooks/DynamicFields/UseLeadPriorityHook";
import { GetAllFormName } from "../../hooks/Other/UseOtherHook";
import { GetAllLocality } from "../../hooks/Other/UseLocalityHook";
import { getAllUsers } from "../../hooks/Users/useAllUsersHook";
import { useSearchLeads } from "../../hooks/AdvancedSearch/LeadAdvancedSearchHook";
import {
  ServiceType,
  PropertyCategory,
  PropertyType,
} from "./../../data/LeadData";
import { Country, State, City } from "./../../data/CountryStateCity";
import { CreateLabelValueArray, groupBy } from "../../hooks/Function";
import validationSchema from "../../schema/Leads/LeadAdvanceSearchSchema";
import "./LeadAdvancedSearch.css";
import FilterListIcon from "@mui/icons-material/FilterList";

const CustomSearchButtons = ({
  isLoading = false,
  onSearch,
  onReset,
  searchLabel = "Search",
  resetLabel = "Reset",
  disabled = false,
}) => {
  const { Button, CircularProgress } = useMui();

  return (
    <div className="custom-search-buttons" style={styles.container}>
      <Button
        variant="contained"
        onClick={onSearch}
        disabled={isLoading || disabled}
        style={{
          ...styles.button,
          ...styles.searchButton,
          ...(isLoading || disabled ? styles.disabled : {}),
        }}
        aria-label={searchLabel}
      >
        {isLoading ? (
          <CircularProgress size={24} style={styles.loader} />
        ) : (
          searchLabel
        )}
      </Button>
      <Button
        variant="outlined"
        onClick={onReset}
        disabled={isLoading || disabled}
        style={{
          ...styles.button,
          ...styles.resetButton,
          ...(isLoading || disabled ? styles.disabled : {}),
        }}
        aria-label={resetLabel}
      >
        {resetLabel}
      </Button>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "12px",
    marginTop: "16px",
    flexWrap: "wrap",
  },
  button: {
    padding: "8px 16px",
    borderRadius: "6px",
    fontWeight: 500,
    textTransform: "none",
    transition: "all 0.2s ease",
    minWidth: "120px",
  },
  searchButton: {
    backgroundColor: "#3f51b5",
    color: "#fff",
    border: "1px solid #3f51b5",
  },
  resetButton: {
    backgroundColor: "transparent",
    color: "#3f51b5",
    border: "1px solid #3f51b5",
  },
  disabled: {
    backgroundColor: "#e0e0e0",
    color: "#999",
    border: "1px solid #e0e0e0",
    cursor: "not-allowed",
  },
  loader: {
    color: "#fff",
  },
};

// Updated getInitialValues to prioritize searchDetails
const getInitialValues = (previousSearchData, searchDetails, PassPageName) => {
  const data =
    searchDetails && Object.keys(searchDetails).length > 0
      ? searchDetails
      : previousSearchData;
  return {
    source: data?.source || [],
    form_name: data?.form_name || [],
    service_type: data?.service_type || [],
    pname: data?.pname || [],
    ptype: data?.ptype || [],
    country: data?.country || [],
    state: data?.state || [],
    city: data?.city || [],
    locality: data?.locality || [],
    pcategory: data?.pcategory || [],
    pconfiguration: data?.pconfiguration || [],
    leadstatus: data?.leadstatus || [],
    userstatus: data?.userstatus || [],
    branch_admin: data?.branch_admin || [],
    team_leader: data?.team_leader || [],
    sales_manager: data?.sales_manager || [],
    tele_caller: data?.tele_caller || [],
    lead_priority: data?.lead_priority || [],
    ldate_from: data?.ldate_from || "",
    ldate_to: data?.ldate_to || "",
    fdate_from: data?.fdate_from || "",
    fdate_to: data?.fdate_to || "",
    anytext: data?.anytext || "",
    pageName: PassPageName,
  };
};

const LeadAdvancedSearch = ({
  PassSearchData,
  PassPageName,
  page,
  pageSize,
  dispatch,
  hideSourceDropdown,
}) => {
  const { Row, Col } = useBootstrap();
  const { globalData } = useSetting();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [resetForm, setResetForm] = useState(false);
  const [searchDetails, setSearchDetails] = useState([]);
  const [appliedFilters, setAppliedFilters] = useState([]);
  const [allUserGroup, setAllUserGroup] = useState({});
  const [fetchStatus, setFetchStatus] = useState({
    projectNameList: false,
    localityList: false,
    configurationList: false,
    leadStatusList: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFetching, setIsFetching] = useState(false);

  const fieldLabels = useMemo(
    () => ({
      source: "Source",
      form_name: "Form Name",
      service_type: "Service Type",
      pname: "Project Name",
      ptype: "Project Type",
      country: "Country",
      state: "State",
      city: "City",
      locality: "Locality",
      pcategory: "Property Category",
      pconfiguration: "Configuration",
      leadstatus: "Lead Status",
      userstatus: "User Lead Status",
      branch_admin: "Branch Admin",
      team_leader: "Team Leader",
      sales_manager: "Sales Manager",
      tele_caller: "Tele Caller",
      lead_priority: "Lead Priority",
      ldate_from: "Lead Date From",
      ldate_to: "Lead Date To",
      fdate_from: "Followup Date From",
      fdate_to: "Followup Date To",
      anytext: "Custom Text",
    }),
    []
  );

  const previousSearchData = useMemo(() => {
    const storedData = localStorage.getItem("sotre_search_data");
    if (!storedData) return null;
    const CryptoJSKey = `${globalData.CompanyName}@${globalData.Version}`;
    const bytes = CryptoJS.AES.decrypt(storedData, CryptoJSKey);
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  }, [globalData]);

  const initialValues = useMemo(
    () => getInitialValues(previousSearchData, searchDetails, PassPageName),
    [previousSearchData, searchDetails, PassPageName]
  );

  const { mutate, isLoading, cancel } = useSearchLeads({
    mutationOptions: {
      retry: 1,
      timeout: 10000,
    },
  });

  const sourceList = useQuery("sourceList", () => GetAllSource(["source"]), {
    enabled: !hideSourceDropdown,
  });
  const leadPriorityList = useQuery("leadPriority", () =>
    GetAllLeadPriority(["lead_priority"])
  );
  const formNameList = useQuery("formNameList", GetAllFormName);
  const projectNameList = useQuery("project-name", ProjectNameDropDownData, {
    enabled: fetchStatus.projectNameList,
  });
  const localityList = useQuery(
    "locality",
    () => GetAllLocality(["locality"]),
    {
      enabled: fetchStatus.localityList,
    }
  );
  const configurationList = useQuery(
    "allConfiguration",
    () => GetAllConfiguration(["configuration", "configuration_type"]),
    {
      enabled: fetchStatus.configurationList,
    }
  );
  const leadStatusList = useQuery(
    "allLeadStatus",
    () => GetAllLeadStatus(["status"]),
    {
      enabled: fetchStatus.leadStatusList,
    }
  );
  const allUsers = useQuery("allUserslist", getAllUsers, {
    onSuccess: (data) => {
      setAllUserGroup(
        groupBy(
          data.data.map((user) => ({
            label: user.username,
            value: user.id,
            urole: user.urole,
          })),
          "urole"
        )
      );
    },
  });

  const getDisplayValues = useCallback(
    (field, values) => {
      let options = [];
      let displayKey = "label";
      let valueKey = "value";

      switch (field) {
        case "source":
          options = CreateLabelValueArray(sourceList.data, "source");
          displayKey = "label";
          break;
        case "form_name":
          options = CreateLabelValueArray(formNameList.data, "form_name");
          displayKey = "label";
          break;
        case "service_type":
          options = ServiceType;
          displayKey = "label";
          break;
        case "pname":
          options = CreateLabelValueArray(projectNameList.data?.data, "pname");
          displayKey = "label";
          break;
        case "ptype":
          options = PropertyType;
          displayKey = "label";
          break;
        case "country":
          options = CreateLabelValueArray(Country, "name", "isoCode");
          displayKey = "label";
          break;
        case "state":
          options = CreateLabelValueArray(
            State.filter((row) => values.country?.includes(row.countryCode)),
            "name",
            "isoCode"
          );
          displayKey = "label";
          break;
        case "city":
          options = CreateLabelValueArray(
            City.filter((row) => values.state?.includes(row.stateCode)),
            "name"
          );
          displayKey = "label";
          break;
        case "locality":
          options = CreateLabelValueArray(localityList.data, "locality");
          displayKey = "label";
          break;
        case "pcategory":
          options = CreateLabelValueArray(
            PropertyCategory.filter((row) => values.ptype?.includes(row.type)),
            "label",
            "value"
          );
          displayKey = "label";
          break;
        case "pconfiguration":
          options = CreateLabelValueArray(
            configurationList.data?.filter((row) =>
              values.ptype?.includes(row.configuration_type)
            ),
            "configuration"
          );
          displayKey = "label";
          break;
        case "leadstatus":
        case "userstatus":
          options = CreateLabelValueArray(leadStatusList.data, "status");
          displayKey = "label";
          break;
        case "branch_admin":
          options = allUserGroup["Branch Admin"] || [];
          displayKey = "label";
          break;
        case "team_leader":
          options = allUserGroup["Team Leader"] || [];
          displayKey = "label";
          break;
        case "sales_manager":
          options = allUserGroup["Sales Manager"] || [];
          displayKey = "label";
          break;
        case "tele_caller":
          options = allUserGroup["Tele Caller"] || [];
          displayKey = "label";
          break;
        case "lead_priority":
          options = CreateLabelValueArray(
            leadPriorityList.data,
            "lead_priority"
          );
          displayKey = "label";
          break;
        case "ldate_from":
        case "ldate_to":
        case "fdate_from":
        case "fdate_to":
        case "anytext":
          return values[field] || "";
        default:
          return values[field] || "";
      }

      if (Array.isArray(values[field])) {
        return values[field]
          .map((val) => {
            const option = options.find((opt) => opt[valueKey] === val);
            return option ? option[displayKey] : val;
          })
          .filter(Boolean)
          .join(", ");
      }
      return values[field] || "";
    },
    [
      sourceList.data,
      formNameList.data,
      projectNameList.data,
      localityList.data,
      configurationList.data,
      leadStatusList.data,
      leadPriorityList.data,
      allUserGroup,
    ]
  );

  const handleSearch = useCallback(
    (searchData) => {
      if (isFetching) return;
      console.log("Initiating search with data:", searchData);
      setIsFetching(true);
      setIsSubmitting(true);
      const data = [searchData, page, pageSize];
      mutate(data, {
        onSuccess: (data) => {
          console.log("Search Success:", data);
          PassSearchData(data);
          setIsSubmitting(false);
          setIsFetching(false);
          setDrawerOpen(false);
          console.log(
            "After setting states - isSubmitting:",
            isSubmitting,
            "isLoading:",
            isLoading
          );
        },
        onError: (error) => {
          console.error("Search Error:", error);
          setIsSubmitting(false);
          setIsFetching(false);
          setDrawerOpen(false);
          alert("Failed to search leads. Please try again.");
          console.log(
            "After error - isSubmitting:",
            isSubmitting,
            "isLoading:",
            isLoading
          );
        },
      });
    },
    [mutate, PassSearchData, page, pageSize]
  );

  const handleSubmit = useCallback(
    (values) => {
      dispatch({ event: "sotre_search_data", data: JSON.stringify(values) });
      setSearchDetails(values);

      const filters = [];
      Object.entries(values).forEach(([key, value]) => {
        if (
          value &&
          value.length > 0 &&
          key !== "pageName" &&
          fieldLabels[key]
        ) {
          const displayValues = getDisplayValues(key, values);
          if (displayValues) {
            filters.push(`${fieldLabels[key]} (${displayValues})`);
          }
        }
      });
      setAppliedFilters(filters);

      handleSearch(values);
    },
    [dispatch, handleSearch, fieldLabels, getDisplayValues]
  );

  const handleResetForm = useCallback(
    (resetForm) => {
      console.log("Resetting form");
      localStorage.removeItem("sotre_search_data");
      setResetForm(true);
      setSearchDetails([]);
      setAppliedFilters([]);
      PassSearchData([]);
      resetForm();
      setDrawerOpen(false);
      setTimeout(() => setResetForm(false), 100);
    },
    [PassSearchData]
  );

  useEffect(() => {
    const previousScreen = localStorage.getItem("previousScreen");
    if (
      ![
        "viewleaddetails",
        "quickeditlead",
        "editlead",
        "assignleadfrom",
      ].includes(previousScreen)
    ) {
      localStorage.removeItem("sotre_search_data");
    }
  }, []);

  useEffect(() => {
    console.log(
      "useEffect triggered: previousSearchData:",
      previousSearchData,
      "searchDetails:",
      searchDetails
    );
    if (previousSearchData && !searchDetails.length) {
      console.log("Triggering initial search with previousSearchData");
      handleSearch(previousSearchData);

      const filters = [];
      Object.entries(previousSearchData).forEach(([key, value]) => {
        if (
          value &&
          value.length > 0 &&
          key !== "pageName" &&
          fieldLabels[key]
        ) {
          const displayValues = getDisplayValues(key, previousSearchData);
          if (displayValues) {
            filters.push(`${fieldLabels[key]} (${displayValues})`);
          }
        }
      });
      setAppliedFilters(filters);
    }
  }, [previousSearchData, handleSearch, fieldLabels, getDisplayValues]);

  useEffect(() => {
    return () => {
      console.log("Component unmounting, cancelling requests");
      cancel();
    };
  }, [cancel]);

  const toggleDrawer = useCallback(
    (open) => {
      console.log(`Toggling drawer to ${open}`);
      setDrawerOpen(open);
      if (!open) {
        console.log("Drawer closing, cancelling requests");
        cancel();
      }
    },
    [cancel]
  );
  function convertArrayToObjectsWithLabelKey(array) {
    return array?.map((item) => ({ label: item }));
  }
  const hasFilters = appliedFilters.length > 0;
  console.log(
    CreateLabelValueArray(
      convertArrayToObjectsWithLabelKey(initialValues.pname),
      "label"
    )
  );

  return (
    <div>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: "#fff",
          padding: "12px 16px",
          margin: "16px 0",
          borderRadius: "8px",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
          transition: "box-shadow 0.3s ease-in-out",
          "&:hover": {
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
          },
          flexWrap: "wrap",
          gap: "12px",
        }}
      >
        {hasFilters ? (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              flex: 1,
              flexWrap: "wrap",
            }}
          >
            <Typography
              sx={{
                fontSize: "0.9rem",
                color: "#3f51b5",
                fontWeight: 500,
                marginRight: "8px",
              }}
            >
              Applied filters:
            </Typography>
            <Typography
              sx={{
                fontSize: "0.9rem",
                color: "#555",
                fontWeight: 400,
                lineHeight: 1.5,
                wordBreak: "break-word",
              }}
            >
              {appliedFilters.join(", ")}
            </Typography>
          </Box>
        ) : (
          <Typography
            sx={{
              fontSize: "0.9rem",
              color: "#888",
              fontStyle: "italic",
            }}
          >
            No filters applied
          </Typography>
        )}

        {hasFilters && (
          <Divider
            orientation="vertical"
            flexItem
            sx={{
              backgroundColor: "#e0e0e0",
              margin: "0 12px",
              display: { xs: "none", sm: "block" },
            }}
          />
        )}

        <Button
          variant="contained"
          color="primary"
          size="small"
          onClick={() => {
            console.log("Button clicked to open drawer");
            toggleDrawer(true);
          }}
          startIcon={<FilterListIcon />}
          sx={{
            textTransform: "none",
            fontWeight: 500,
            padding: "6px 16px",
            borderRadius: "6px",
            backgroundColor: "#3f51b5",
            "&:hover": {
              backgroundColor: "#303f9f",
              boxShadow: "0 2px 8px rgba(63, 81, 181, 0.3)",
            },
          }}
        >
          Advanced Search
        </Button>
      </Box>
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => toggleDrawer(false)}
        sx={{
          "& .MuiDrawer-paper": {
            width: { xs: "90%", sm: 600 },
            maxWidth: "100%",
            padding: "16px",
            backgroundColor: "#fff",
            zIndex: 1300,
          },
        }}
      >
        <Box>
          <Typography
            style={{
              fontSize: "1.5rem",
              fontWeight: 500,
              borderBottom: "1px solid #e0e0e0",
            }}
          >
            Lead Advanced Search
          </Typography>
          <Divider style={{ margin: "8px 0" }} />
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
            enableReinitialize
          >
            {({ values, setFieldValue, resetForm }) => (
              <Form style={{ marginTop: "16px" }}>
                <Row className="g-3">
                  {!hideSourceDropdown && (
                    <Col xs={12} sm={6}>
                      <CustomMultipleSelectField
                        name="source"
                        placeholder="Select Source"
                        options={CreateLabelValueArray(
                          sourceList.data,
                          "source"
                        )}
                        isLabelValue
                        FieldValue={setFieldValue}
                        values={values}
                        resetField={resetForm}
                        initialValue={
                          initialValues.source !== ""
                            ? CreateLabelValueArray(
                                convertArrayToObjectsWithLabelKey(
                                  initialValues.source
                                ),
                                "label"
                              )
                            : []
                        }
                      />
                    </Col>
                  )}
                  <Col xs={12} sm={6}>
                    <CustomMultipleSelectField
                      name="service_type"
                      placeholder="Select Service Type"
                      options={ServiceType}
                      isLabelValue
                      FieldValue={setFieldValue}
                      values={values}
                      resetField={resetForm}
                    />
                  </Col>
                  <Col xs={12} sm={6}>
                    <CustomMultipleSelectField
                      name="pname"
                      placeholder="Select Project Name"
                      onFocus={() =>
                        setFetchStatus((prev) => ({
                          ...prev,
                          projectNameList: true,
                        }))
                      }
                      options={CreateLabelValueArray(
                        projectNameList.data?.data,
                        "pname"
                      )}
                      isLabelValue
                      FieldValue={setFieldValue}
                      values={values}
                      resetField={resetForm}
                      initialValue={
                        initialValues.pname !== ""
                          ? CreateLabelValueArray(
                              convertArrayToObjectsWithLabelKey(
                                initialValues.pname
                              ),
                              "label"
                            )
                          : []
                      }
                    />
                  </Col>
                  <Col xs={12} sm={6}>
                    <CustomMultipleSelectField
                      name="ptype"
                      placeholder="Select Project Type"
                      options={PropertyType}
                      isLabelValue
                      FieldValue={setFieldValue}
                      values={values}
                      resetField={resetForm}
                    />
                  </Col>
                  <Col xs={12} sm={6}>
                    <CustomMultipleSelectField
                      name="country"
                      placeholder="Select Country"
                      options={CreateLabelValueArray(
                        Country,
                        "name",
                        "isoCode"
                      )}
                      isLabelValue
                      FieldValue={setFieldValue}
                      values={values}
                      resetField={resetForm}
                    />
                  </Col>
                  <Col xs={12} sm={6}>
                    <CustomMultipleSelectField
                      name="state"
                      placeholder="Select State"
                      options={
                        values.country
                          ? CreateLabelValueArray(
                              State.filter((row) =>
                                values.country.includes(row.countryCode)
                              ),
                              "name",
                              "isoCode"
                            )
                          : []
                      }
                      isLabelValue
                      FieldValue={setFieldValue}
                      values={values}
                      resetField={resetForm}
                    />
                  </Col>
                  <Col xs={12} sm={6}>
                    <CustomMultipleSelectField
                      name="city"
                      placeholder="Select City"
                      options={
                        values.state
                          ? CreateLabelValueArray(
                              City.filter((row) =>
                                values.state.includes(row.stateCode)
                              ),
                              "name"
                            )
                          : []
                      }
                      isLabelValue
                      FieldValue={setFieldValue}
                      values={values}
                      resetField={resetForm}
                    />
                  </Col>
                  <Col xs={12} sm={6}>
                    <CustomMultipleSelectField
                      name="locality"
                      placeholder="Select Locality"
                      onFocus={() =>
                        setFetchStatus((prev) => ({
                          ...prev,
                          localityList: true,
                        }))
                      }
                      options={
                        localityList.data
                          ? CreateLabelValueArray(localityList.data, "locality")
                          : []
                      }
                      isLabelValue
                      FieldValue={setFieldValue}
                      values={values}
                      resetField={resetForm}
                    />
                  </Col>
                  <Col xs={12} sm={6}>
                    <CustomMultipleSelectField
                      name="pcategory"
                      placeholder="Property Category"
                      options={
                        values.ptype
                          ? CreateLabelValueArray(
                              PropertyCategory.filter((row) =>
                                values.ptype.includes(row.type)
                              ),
                              "label",
                              "value"
                            )
                          : []
                      }
                      isLabelValue
                      FieldValue={setFieldValue}
                      values={values}
                      resetField={resetForm}
                    />
                  </Col>
                  <Col xs={12} sm={6}>
                    <CustomMultipleSelectField
                      name="pconfiguration"
                      placeholder="Configuration"
                      onFocus={() =>
                        setFetchStatus((prev) => ({
                          ...prev,
                          configurationList: true,
                        }))
                      }
                      options={
                        values.ptype
                          ? CreateLabelValueArray(
                              configurationList.data?.filter((row) =>
                                values.ptype.includes(row.configuration_type)
                              ),
                              "configuration"
                            )
                          : []
                      }
                      isLabelValue
                      FieldValue={setFieldValue}
                      values={values}
                      resetField={resetForm}
                    />
                  </Col>
                  <Col xs={12} sm={6}>
                    <CustomMultipleSelectField
                      name="leadstatus"
                      placeholder="Lead Status"
                      onFocus={() =>
                        setFetchStatus((prev) => ({
                          ...prev,
                          leadStatusList: true,
                        }))
                      }
                      options={
                        leadStatusList.data
                          ? CreateLabelValueArray(leadStatusList.data, "status")
                          : []
                      }
                      isLabelValue
                      FieldValue={setFieldValue}
                      values={values}
                      resetField={resetForm}
                    />
                  </Col>
                  <Col xs={12} sm={6}>
                    <CustomMultipleSelectField
                      name="userstatus"
                      placeholder="User Lead Status"
                      options={
                        leadStatusList.data
                          ? CreateLabelValueArray(leadStatusList.data, "status")
                          : []
                      }
                      isLabelValue
                      FieldValue={setFieldValue}
                      values={values}
                      resetField={resetForm}
                    />
                  </Col>
                  <Col xs={12} sm={6}>
                    <CustomMultipleSelectField
                      name="branch_admin"
                      placeholder="Branch Admin"
                      options={allUserGroup["Branch Admin"] || []}
                      isLabelValue
                      FieldValue={setFieldValue}
                      values={values}
                      resetField={resetForm}
                    />
                  </Col>
                  <Col xs={12} sm={6}>
                    <CustomMultipleSelectField
                      name="team_leader"
                      placeholder="Team Leader"
                      options={allUserGroup["Team Leader"] || []}
                      isLabelValue
                      FieldValue={setFieldValue}
                      values={values}
                      resetField={resetForm}
                    />
                  </Col>
                  <Col xs={12} sm={6}>
                    <CustomMultipleSelectField
                      name="sales_manager"
                      placeholder="Sales Manager"
                      options={allUserGroup["Sales Manager"] || []}
                      isLabelValue
                      FieldValue={setFieldValue}
                      values={values}
                      resetField={resetForm}
                    />
                  </Col>
                  <Col xs={12} sm={6}>
                    <CustomMultipleSelectField
                      name="tele_caller"
                      placeholder="Tele Caller"
                      options={allUserGroup["Tele Caller"] || []}
                      isLabelValue
                      FieldValue={setFieldValue}
                      values={values}
                      resetField={resetForm}
                    />
                  </Col>
                  <Col xs={12} sm={6}>
                    <CustomMultipleSelectField
                      name="lead_priority"
                      placeholder="Select Lead Priority"
                      options={CreateLabelValueArray(
                        leadPriorityList.data,
                        "lead_priority"
                      )}
                      isLabelValue
                      FieldValue={setFieldValue}
                      values={values}
                      resetField={resetForm}
                    />
                  </Col>
                  <Col xs={12} sm={6}>
                    <Typography
                      style={{
                        fontSize: "0.9rem",
                        fontWeight: 400,
                        marginBottom: "8px",
                        color: "#666",
                      }}
                    >
                      Lead Date From
                    </Typography>
                    <CustomInputField
                      type="date"
                      name="ldate_from"
                      placeholder=""
                      inputWidth="100%"
                    />
                  </Col>
                  <Col xs={12} sm={6}>
                    <Typography
                      style={{
                        fontSize: "0.9rem",
                        fontWeight: 400,
                        marginBottom: "8px",
                        color: "#666",
                      }}
                    >
                      Lead Date To
                    </Typography>
                    <CustomInputField
                      type="date"
                      name="ldate_to"
                      placeholder=""
                      inputWidth="100%"
                    />
                  </Col>
                  <Col xs={12} sm={6}>
                    <Typography
                      style={{
                        fontSize: "0.9rem",
                        fontWeight: 400,
                        marginBottom: "8px",
                        color: "#666",
                      }}
                    >
                      Followup Date From
                    </Typography>
                    <CustomInputField
                      type="date"
                      name="fdate_from"
                      placeholder=""
                      inputWidth="100%"
                    />
                  </Col>
                  <Col xs={12} sm={6}>
                    <Typography
                      style={{
                        fontSize: "0.9rem",
                        fontWeight: 400,
                        marginBottom: "8px",
                        color: "#666",
                      }}
                    >
                      Followup Date To
                    </Typography>
                    <CustomInputField
                      type="date"
                      name="fdate_to"
                      placeholder=""
                      inputWidth="100%"
                    />
                  </Col>
                  {values.source.includes("Facebook") && (
                    <Col xs={12} sm={6}>
                      <CustomMultipleSelectField
                        name="form_name"
                        placeholder="Select Form Name"
                        options={CreateLabelValueArray(
                          formNameList.data,
                          "form_name"
                        )}
                        isLabelValue
                        FieldValue={setFieldValue}
                        values={values}
                        resetField={resetForm}
                      />
                    </Col>
                  )}
                  <Col xs={12} sm={values.source.includes("Facebook") ? 6 : 12}>
                    <CustomInputField
                      type="text"
                      name="anytext"
                      placeholder="Enter custom text"
                      inputWidth="100%"
                    />
                  </Col>
                  <Col xs={12}>
                    <CustomSearchButtons
                      isLoading={isSubmitting || isLoading}
                      onSearch={() =>
                        document.querySelector("form").requestSubmit()
                      }
                      onReset={() => handleResetForm(resetForm)}
                      searchLabel="Search Lead"
                      resetLabel="Reset Search"
                    />
                  </Col>
                </Row>
              </Form>
            )}
          </Formik>
        </Box>
      </Drawer>
    </div>
  );
};

export default LeadAdvancedSearch;
