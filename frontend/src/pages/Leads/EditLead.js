import React from "react";
import Breadcrumb from "../../components/Breadcrumb/Breadcrumb";
import { Formik, Form, Field, ErrorMessage } from "formik";
import Cookies from "js-cookie";
import { useBootstrap, useMui, useSetting } from "../../hooks/Hooks";
import {
  CustomFormGroup,
  CustomSelectField,
  CustomInputField,
  CustomMultipleSelectField,
  CustomTextareaField,
  CustomMobileFiled,
  CustomSelectIdNameField,
  CustomMultipleSelectTextField,
} from "../../components/FormUtility/FormUtility";
import { CreateLabelValueArray, numberToWords } from "../../hooks/Function";
import { useQuery } from "react-query";
import { GetAllSource } from "../../hooks/DynamicFields/useSourceHook";
import { GetAllBroker } from "../../hooks/Other/UseBrokerHook";
import { GetAllProjectName } from "../../hooks/DynamicFields/useProjectNameHook";
import {
  ServiceType,
  PropertyType,
  PropertyCategory,
  PropertyArea,
  PropertyPrice,
  TypeOfBuyer,
  TypeOfInvestor,
  PostHandover,
  Ccode,
  dubaiLocalities,
  YearRange,
} from "../../data/LeadData";
import FileUpload from "../../components/FileUpload/FileUpload";
import { GetAllConfiguration } from "../../hooks/DynamicFields/UseConfigurationHook";
import { Country, State, City } from "../../data/CountryStateCity";
import { useEditLead } from "../../hooks/Leads/UseLeadsHook";
import CryptoJS from "crypto-js";
import { LeadFormSchema } from "../../schema/Leads/LeadFormSchema";
import dayjs from "dayjs";
import Axios from "../../setting/axios";
import { GetAllLocationField } from "../../hooks/DynamicFields/UseLocationHook";
import { GetAllHandoverYear } from "../../hooks/DynamicFields/UseHandoverYearHook";

let crm_countries = document.getElementById("crm_countries");

const EditLead = ({ dispatch }) => {
  const { Card, Row, Col } = useBootstrap();
  const {
    Divider,
    RadioGroup,
    Radio,
    FormControlLabel,
    LoadingButton,
    ArrowBackIosIcon,
  } = useMui();
  const { globalData } = useSetting();
  const [visibilityData, setVisibilityData] = React.useState({});
  // const [visibleFields, setVisibleFields] = React.useState({
  //   typeOfBuyer: false,
  //   investmentType: false,
  //   postHandover: false,
  // });
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

  var user_data = bytes.toString(CryptoJS.enc.Utf8);

  let LeadDetails = JSON.parse(user_data);

  console.log(LeadDetails, "LeadDetails");

  function convertArrayToObjectsWithLabelKey(array) {
    return array?.map((item) => ({ label: item }));
  }
  const [selectedFile, setSelectedFile] = React.useState(
    `${LeadDetails.document}`
  );
  const [brokerName, setBrokerName] = React.useState("");

  const [ContactValidation, setContactValidation] = React.useState({
    lccode: LeadDetails.p_ccode,
    lmobile: LeadDetails.p_mob,
    ref_ccode: LeadDetails.ref_ccode,
    ref_number: LeadDetails.ref_mob,
    s_ccode: LeadDetails.s_ccode,
    s_mob: LeadDetails.s_mob,
    ref_mob: LeadDetails.ref_mob,
  });

  // console.log("Hello", LeadDetails);

  const initialValues = {
    l_id: LeadDetails.l_id,
    source_type: LeadDetails.source_type,
    source: LeadDetails.source,
    brk_id: LeadDetails.brk_id,
    ref_name: LeadDetails.ref_name,
    ref_ccode: LeadDetails.ref_ccode,
    ref_mob_no: LeadDetails.ref_mob,
    ref_email: LeadDetails.ref_email || "",
    lname: LeadDetails.lname,
    lccode: LeadDetails.p_ccode,
    lmob_no: LeadDetails.p_mob,
    lemail: LeadDetails.p_email,
    alt_lccode: LeadDetails.s_ccode,
    alt_lmob_no: LeadDetails.s_mob,
    alt_lemail: LeadDetails.s_email,
    pname: LeadDetails.pname?.split(", "),
    service_type: LeadDetails.service_type?.split(", "),
    ptype: LeadDetails.ptype?.split(", "),
    pcategory: LeadDetails.pcategory?.split(", "),
    pconfiguration: LeadDetails.pconfiguration?.split(", "),
    min_area: LeadDetails.min_area,
    max_area: LeadDetails.max_area,
    area_unit: LeadDetails.area_unit,
    min_price: LeadDetails.min_price,
    max_price: LeadDetails.max_price,
    price_unit: decodeURIComponent(LeadDetails.price_unit),
    country: LeadDetails.country?.split(", "),
    state: LeadDetails.state?.split(", "),
    city: LeadDetails.city?.split(", "),
    locality: LeadDetails.locality,
    buyer_type: LeadDetails.buyer_type,
    investment_type: LeadDetails.investment_type,
    post_handover: LeadDetails.post_handover,
    handover_year: LeadDetails.handover_year,
    other_details: LeadDetails.other_details,
    document: LeadDetails.document || null,
  };
  console.log(initialValues, "initialValues");

  const { mutate, isLoading } = useEditLead();

  const sourceData = useQuery("AllSource", () => {
    return GetAllSource(["source"]);
  });

  const brokerData = useQuery("AllBroker", () => {
    return GetAllBroker(["name", "company", "brk_id"]);
  });

  const projectNameData = useQuery("AllProjectName", () => {
    return GetAllProjectName(["pname"]);
  });

  const GetAllLocationDropDown = useQuery("GetAllLocationDropDown", () => {
    return GetAllLocationField(["location_name"]);
  });

  const configurationData = useQuery("AllConfiguration", () => {
    return GetAllConfiguration(["configuration", "configuration_type"]);
  });

  const GetAllHandoverYearDropDown = useQuery(
    "GetAllHandoverYearDropDown",
    () => {
      return GetAllHandoverYear(["handover_year"]);
    }
  );
  

  // const HandleSubmit = (values) => {
  //   if (
  //     ContactValidation.lmobile !== null ||
  //     (initialValues.source_type === "Reference" &&
  //       ContactValidation.ref_number !== null) ||
  //     (initialValues.source_type === "Reference" &&
  //       ContactValidation.ref_number !== null)
  //   ) {
  //     let data = [values, ContactValidation];
  //     console.log("datas",data);
  //     mutate(data, {
  //       onSuccess: (data) => {
  //         localStorage.setItem("successMessage", data.data);
  //         dispatch({
  //           event:
  //             localStorage.getItem("previousScreen") ===
  //             localStorage.getItem("currScreen")
  //               ? "totalleads"
  //               : localStorage.getItem("previousScreen"),
  //         });
  //       },
  //     });
  //   } else {
  //     setContactValidation({
  //       ...ContactValidation,
  //       lmobile: "",
  //       ref_number: "",
  //       s_ccode: "",
  //     });
  //   }
  // };
  const HandleSubmit = (values) => {
    console.log(values, "values BEFORE");
    const DateTime = dayjs().format("YYYY-MM-DD HH:mm:ss");
    if (
      ContactValidation.lmobile !== null ||
      (initialValues.source_type === "Reference" &&
        ContactValidation.ref_number !== null)
    ) {
      let formData = new FormData();

      Object.entries(values).forEach(([key, value]) => {
        if (key !== "document" && value && key !== "lccode") {
          formData.append(key, value);
        }
      });

      // Append validation data, including lccode from ContactValidation
      Object.entries(ContactValidation).forEach(([key, value]) => {
        formData.append(key, value);
      });

      formData.append("DateTime", DateTime);
      formData.append("assignlead_id", LeadDetails.assignlead_id);
      // Append document if exists
      if (values.document) {
        console.log("Appending document:", values.document);
        formData.append("document", values.document); // Assuming values.document is a File object
      } else {
        console.warn("No document found to append.");
      }

      // Log FormData entries to check what's appended
      for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }

      // Call mutate to submit form
      mutate(formData, {
        onSuccess: (data) => {
          localStorage.setItem("successMessage", data.data);
          dispatch({
            event:
              localStorage.getItem("previousScreen") ===
              localStorage.getItem("currScreen")
                ? "totalleads"
                : localStorage.getItem("previousScreen"),
          });
        },
      });
    } else {
      setContactValidation({
        ...ContactValidation,
        lmobile: "",
        ref_number: "",
        s_ccode: "",
      });
    }
  };

  React.useEffect(() => {
    if (brokerData?.data && brokerName === "") {
      const brokerDetail = brokerData?.data?.filter(
        (brokerItem) => brokerItem.brk_id == initialValues.brk_id
      );
      if (brokerDetail.length > 0) {
        setBrokerName(brokerDetail[0].name);
      }
    }
  }, [brokerData?.data]);
  // React.useEffect(() => {
  //   const storedVisibility = {
  //     typeOfBuyer: Cookies.get('typeOfBuyer') === 'true', // Read from cookies
  //     investmentType: Cookies.get('investmentType') === 'true',
  //     postHandover: Cookies.get('postHandover') === 'true',
  //   };
  //   setVisibleFields(storedVisibility); // Update local state with cookie values
  // }, []);
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await Axios.get("/dmn");
        console.log("Settings:", response.data); // Replace with your actual endpoint
        setVisibilityData(response.data.lead); // Assuming response structure is as mentioned
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);
  return (
    <>
      <Breadcrumb
        PageName="Edit Lead"
        BackButton={[
          true,
          "Back",
          <ArrowBackIosIcon />,
          () =>
            dispatch({
              event:
                localStorage.getItem("previousScreen") ===
                localStorage.getItem("currScreen")
                  ? "totalleads"
                  : localStorage.getItem("previousScreen"),
            }),
        ]}
      />
      {/* {brokerName} */}
      <Formik
        initialValues={initialValues}
        validationSchema={LeadFormSchema}
        onSubmit={HandleSubmit}
      >
        {({ values, setFieldValue }) => (
          <Form>
            <Card>
              <Card.Body>
                <Card.Title>Client Personal Details :-</Card.Title>
                <Divider />
                <Row className="my-3 align-items-center">
                  <Col xs={6} md={2}>
                    <h3 className="custom-form-label">
                      Lead Type <span className="required-label">*</span>
                    </h3>
                  </Col>
                  <Col xs={6} md={10}>
                    <Field
                      name="source_type"
                      as={RadioGroup}
                      className="d-flex flex-row"
                    >
                      <FormControlLabel
                        value="Direct"
                        control={<Radio />}
                        label="Direct"
                        disabled={
                          Cookies.get("role") === "Master" ||
                          Cookies.get("role") === "Admin"
                            ? false
                            : true
                        }
                      />
                      <FormControlLabel
                        value="Broker"
                        control={<Radio />}
                        label="Broker"
                        disabled={
                          Cookies.get("role") === "Master" ||
                          Cookies.get("role") === "Admin"
                            ? false
                            : true
                        }
                      />
                      <FormControlLabel
                        value="Reference"
                        control={<Radio />}
                        label="Reference"
                        disabled={
                          Cookies.get("role") === "Master" ||
                          Cookies.get("role") === "Admin"
                            ? false
                            : true
                        }
                      />
                    </Field>
                    <ErrorMessage
                      name="source_type"
                      component="div"
                      className="error"
                    />
                  </Col>
                </Row>

                <Row>
                  {values.source_type === "Direct" && (
                    <CustomFormGroup
                      formlabel="Source"
                      star="*"
                      FormField={
                        <CustomSelectField
                          name="source"
                          FieldValue={setFieldValue}
                          placeholder="Select Source"
                          options={CreateLabelValueArray(
                            sourceData?.data,
                            "source"
                          )}
                          isLabelValue={true}
                          required
                          initialValue={{
                            label: initialValues.source,
                            value: initialValues.source,
                          }}
                          disabled={
                            Cookies.get("role") === "Master" ||
                            Cookies.get("role") === "Admin"
                              ? false
                              : true
                          }
                        />
                      }
                    />
                  )}
                  {values.source_type === "Broker" && (
                    <CustomFormGroup
                      formlabel="Broker Name"
                      star="*"
                      FormField={
                        <CustomSelectIdNameField
                          name="brk_id"
                          isLabelValue={true}
                          FieldValue={setFieldValue}
                          placeholder="Select Broker"
                          options={CreateLabelValueArray(
                            brokerData.data,
                            "name",
                            "brk_id",
                            "company"
                          )}
                          initialValue={{
                            label: brokerName,
                            value: initialValues.brk_id,
                          }}
                          disabled={
                            Cookies.get("role") === "Master" ||
                            Cookies.get("role") === "Admin"
                              ? false
                              : true
                          }
                        />
                      }
                    />
                  )}

                  {values.source_type === "Reference" && (
                    <>
                      <CustomFormGroup
                        formlabel="Reference Name"
                        star="*"
                        FormField={
                          <CustomInputField
                            type="text"
                            name="ref_name"
                            placeholder="Enter Reference Name"
                            disabled={
                              Cookies.get("role") === "Master" ||
                              Cookies.get("role") === "Admin"
                                ? false
                                : true
                            }
                          />
                        }
                      />
                      <CustomMobileFiled
                        formlabel="Reference No"
                        star="*"
                        type="text"
                        placeholder="Reference Mobile No"
                        onChange={(value, data) =>
                          setContactValidation({
                            ...ContactValidation,
                            ref_ccode: data.dialCode,
                            ref_number: value.slice(data.dialCode.length),
                          })
                        }
                        options={Ccode}
                        defaultVal={
                          ContactValidation.ref_ccode +
                          " " +
                          ContactValidation.ref_number
                        }
                        error={ContactValidation.ref_number}
                        disabled={
                          Cookies.get("role") === "Master" ||
                          Cookies.get("role") === "Admin"
                            ? false
                            : true
                        }
                      />
                      {/* <CustomFormGroup
                        formlabel="Reference Mobile No"
                        star="*"
                        FormField={
                          <CustomInputField
                            type="number"
                            name="ref_mob_no"
                            placeholder="Enter Reference Mobile No"
                            disabled={
                              Cookies.get("role") === "Master" ||
                              Cookies.get("role") === "Admin"
                                ? false
                                : true
                            }
                          />
                        }
                      /> */}
                      <CustomFormGroup
                        formlabel="Reference Email"
                        star="*"
                        FormField={
                          <CustomInputField
                            type="email"
                            name="ref_email"
                            placeholder="Enter Reference Email"
                            disabled={
                              Cookies.get("role") === "Master" ||
                              Cookies.get("role") === "Admin"
                                ? false
                                : true
                            }
                          />
                        }
                      />
                    </>
                  )}
                  <CustomFormGroup
                    formlabel="Lead Name"
                    star="*"
                    FormField={
                      <CustomInputField
                        type="text"
                        name="lname"
                        placeholder="Enter Lead Name"
                      />
                    }
                  />

                  <CustomMobileFiled
                    formlabel="Mobile No."
                    star="*"
                    type="text"
                    placeholder="Mobile No."
                    onChange={(value, data) =>
                      setContactValidation({
                        ...ContactValidation,
                        lccode: data.dialCode,
                        lmobile: value.slice(data.dialCode.length),
                      })
                    }
                    options={Ccode}
                    defaultVal={
                      ContactValidation.lccode + " " + ContactValidation.lmobile
                    }
                    error={ContactValidation.lmobile}
                    disabled={
                      Cookies.get("role") === "Master" ||
                      Cookies.get("role") === "Admin"
                        ? false
                        : true
                    }
                  />

                  <CustomMobileFiled
                    formlabel="Alternate Mobile No."
                    type="text"
                    placeholder="Mobile No."
                    onChange={(value, data) =>
                      setContactValidation({
                        ...ContactValidation,
                        s_ccode: data.dialCode,
                        s_mob: value.slice(data.dialCode.length),
                      })
                    }
                    options={Ccode}
                    defaultVal={
                      ContactValidation.s_ccode + " " + ContactValidation.s_mob
                    }
                    // error={ContactValidation.s_ccode}
                  />

                  <CustomFormGroup
                    style={{ marginTop: "20px" }}
                    formlabel="Email Id."
                    // star="*"
                    FormField={
                      <CustomInputField
                        type="email"
                        name="lemail"
                        placeholder="Enter Email Id."
                        disabled={
                          Cookies.get("role") === "Master" ||
                          Cookies.get("role") === "Admin"
                            ? false
                            : true
                        }
                      />
                    }
                  />

                  <CustomFormGroup
                    style={{ marginTop: "20px" }}
                    formlabel="Alternate Email Id."
                    // star="*"
                    FormField={
                      <CustomInputField
                        type="email"
                        name="alt_lemail"
                        placeholder="Enter Alternate Email Id."
                      />
                    }
                  />
                </Row>
              </Card.Body>
            </Card>

            <Card className="my-3">
              <Card.Body>
                <Card.Title>Client Requirement Details :-</Card.Title>
                <Divider />
                <Row className="mt-3 align-items-center">
                  <CustomFormGroup
                    formlabel="Project Name"
                    FormField={
                      <CustomMultipleSelectField
                        name="pname"
                        placeholder="Select Project Name"
                        options={CreateLabelValueArray(
                          projectNameData.data,
                          "pname"
                        )}
                        isLabelValue={true}
                        FieldValue={setFieldValue}
                        values={values}
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
                    }
                  />
                  <CustomFormGroup
                    formlabel="Service Type"
                    FormField={
                      <CustomMultipleSelectField
                        name="service_type"
                        placeholder="Select Service Type"
                        options={ServiceType}
                        isLabelValue={true}
                        FieldValue={setFieldValue}
                        values={values}
                        initialValue={
                          initialValues.service_type !== ""
                            ? CreateLabelValueArray(
                                convertArrayToObjectsWithLabelKey(
                                  initialValues.service_type
                                ),
                                "label"
                              )
                            : []
                        }
                      />
                    }
                  />
                  <CustomFormGroup
                    formlabel="Property Type"
                    FormField={
                      <CustomMultipleSelectField
                        name="ptype"
                        placeholder="Select Property Type"
                        options={PropertyType}
                        isLabelValue={true}
                        FieldValue={setFieldValue}
                        values={values}
                        initialValue={
                          initialValues.ptype !== ""
                            ? CreateLabelValueArray(
                                convertArrayToObjectsWithLabelKey(
                                  initialValues.ptype
                                ),
                                "label"
                              )
                            : []
                        }
                      />
                    }
                  />
                  <CustomFormGroup
                    formlabel="Property Category"
                    FormField={
                      <CustomMultipleSelectField
                        name="pcategory"
                        placeholder="Select Property Category"
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
                        FieldValue={setFieldValue}
                        values={values}
                        initialValue={
                          initialValues.pcategory !== ""
                            ? CreateLabelValueArray(
                                convertArrayToObjectsWithLabelKey(
                                  initialValues.pcategory
                                ),
                                "label"
                              )
                            : []
                        }
                      />
                    }
                  />
                  <CustomFormGroup
                    formlabel="Configuration"
                    FormField={
                      <CustomMultipleSelectField
                        name="pconfiguration"
                        placeholder="Select Configuration"
                        options={
                          values.ptype
                            ? CreateLabelValueArray(
                                configurationData.data?.filter(
                                  (row) =>
                                    values.ptype.indexOf(
                                      row.configuration_type
                                    ) !== -1
                                ),
                                "configuration"
                              )
                            : []
                        }
                        isLabelValue={true}
                        FieldValue={setFieldValue}
                        values={values}
                        initialValue={
                          initialValues.pconfiguration !== ""
                            ? CreateLabelValueArray(
                                convertArrayToObjectsWithLabelKey(
                                  initialValues.pconfiguration
                                ),
                                "label"
                              )
                            : []
                        }
                      />
                    }
                  />
                </Row>
                <Row className="align-items-center">
                  <Col xs={12} md={2}>
                    <h3 className="custom-form-label">Property Area</h3>
                  </Col>
                  <Col xs={12} md={4}>
                    <CustomSelectField
                      name="area_unit"
                      FieldValue={setFieldValue}
                      isLabelValue={true}
                      placeholder="Select Unit"
                      options={PropertyArea}
                      initialValue={{
                        label: initialValues.area_unit,
                        value: initialValues.area_unit,
                      }}
                    />
                  </Col>
                  <Col xs={6} md={3}>
                    <CustomInputField
                      type="number"
                      name="min_area"
                      placeholder="Enter Minimum Area"
                    />
                  </Col>
                  <Col xs={6} md={3}>
                    <CustomInputField
                      type="number"
                      name="max_area"
                      placeholder="Enter Maximum Area"
                    />
                  </Col>
                </Row>
                <Row className="mt-3">
                  <Col xs={12} md={2} className="d-flex align-items-center">
                    <h3 className="custom-form-label">Property Price</h3>
                  </Col>
                  <Col xs={12} md={4}>
                    <CustomSelectField
                      name="price_unit"
                      FieldValue={setFieldValue}
                      isLabelValue={true}
                      placeholder="Select Currency"
                      options={PropertyPrice}
                      initialValue={{
                        label: initialValues.price_unit,
                        value: initialValues.price_unit,
                      }}
                    />
                  </Col>
                  <Col xs={6} md={3}>
                    <CustomInputField
                      type="number"
                      name="min_price"
                      placeholder="Enter Minimum Price"
                    />
                    <p className="number-in-word m-0">
                      {numberToWords(
                        values.min_price,
                        values.price_unit
                          ? values.price_unit
                          : initialValues.price_unit
                      )}
                    </p>
                  </Col>
                  <Col xs={6} md={3}>
                    <CustomInputField
                      type="number"
                      name="max_price"
                      placeholder="Enter Maximum Price"
                    />
                    <p className="number-in-word m-0">
                      {numberToWords(
                        values.max_price,
                        values.price_unit
                          ? values.price_unit
                          : initialValues.price_unit
                      )}
                    </p>
                  </Col>
                </Row>
                <Row className="mt-3 align-items-center">
                  <CustomFormGroup
                    formlabel="Country"
                    FormField={
                      <CustomMultipleSelectField
                        name="country"
                        placeholder="Select Country"
                        options={CreateLabelValueArray(
                          Country,
                          "name",
                          "isoCode"
                        )}
                        isLabelValue={true}
                        FieldValue={setFieldValue}
                        values={values}
                        initialValue={
                          initialValues.country !== ""
                            ? CreateLabelValueArray(
                                convertArrayToObjectsWithLabelKey(
                                  initialValues.country
                                ),
                                "label"
                              )
                            : []
                        }
                      />
                    }
                  />
                  <CustomFormGroup
                    formlabel="State"
                    FormField={
                      <CustomMultipleSelectField
                        name="state"
                        placeholder="Select State"
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
                        FieldValue={setFieldValue}
                        values={values}
                        initialValue={
                          initialValues.state !== ""
                            ? CreateLabelValueArray(
                                convertArrayToObjectsWithLabelKey(
                                  initialValues.state
                                ),
                                "label"
                              )
                            : []
                        }
                      />
                    }
                  />
                  <CustomFormGroup
                    formlabel="City"
                    FormField={
                      <CustomMultipleSelectField
                        name="city"
                        placeholder="Select City"
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
                        FieldValue={setFieldValue}
                        values={values}
                        initialValue={
                          initialValues.city !== ""
                            ? CreateLabelValueArray(
                                convertArrayToObjectsWithLabelKey(
                                  initialValues.city
                                ),
                                "label"
                              )
                            : []
                        }
                      />
                    }
                  />
                  <CustomFormGroup
                    formlabel="Locality"
                    FormField={
                      crm_countries.value.includes("India") ? (
                        <CustomInputField
                          type="text"
                          name="locality"
                          placeholder="Enter Locality"
                        />
                      ) : crm_countries.value.includes("UAE") ? (
                        // <CustomMultipleSelectField
                        //   name="locality"
                        //   placeholder="Select Localities"
                        //   options={dubaiLocalities}
                        //   isLabelValue={true}
                        //   FieldValue={setFieldValue}
                        //   values={values}
                        // />
                        <CustomMultipleSelectField
                          name="locality"
                          placeholder="Locality"
                          options={CreateLabelValueArray(
                            GetAllLocationDropDown?.data || [],
                            "location_name"
                          )}
                          isLabelValue={true}
                          FieldValue={setFieldValue}
                          values={values} // Make sure `values.locality` is properly set in your form state
                          initialValue={
                            initialValues.locality &&
                            initialValues.locality.trim() !== ""
                              ? CreateLabelValueArray(
                                  convertArrayToObjectsWithLabelKey(
                                    initialValues.locality
                                      .split(",") // Split the string of comma-separated values into an array
                                      .map((item) => item.trim()) // Trim extra spaces
                                  ),
                                  "label" // Ensure it matches the key used in the options
                                )
                              : [] // Default to an empty array if `initialValues.locality` is empty
                          }
                        />
                      ) : null
                    }
                  />
                </Row>
                <Row className="my-3 align-items-center">
                  <Col xs={12} md={2}>
                    <h3 className="custom-form-label">Other Details</h3>
                  </Col>
                  <Col xs={12} md={4}>
                    <CustomTextareaField
                      name="other_details"
                      placeholder="Enter Other Details ...."
                    />
                  </Col>
                  <Col xs={12} md={2}>
                    <h3 className="custom-form-label">Upload Document </h3>
                  </Col>
                  <Col xs={12} md={4}>
                    <FileUpload
                      onFileSelect={(file) => {
                        setSelectedFile(file);
                        setFieldValue("document", file);
                      }}
                      selectedFile={selectedFile}
                      isRequired={false}
                    />
                  </Col>
                </Row>
                <Row className="my-3 align-items-center">
                  {visibilityData.showTypeOfBuyer && (
                    <>
                      <Col xs={12} md={2}>
                        <h3 className="custom-form-label">Type of Buyer</h3>
                      </Col>
                      <Col xs={12} md={4}>
                        <CustomSelectField
                          name="buyer_type"
                          FieldValue={setFieldValue}
                          isLabelValue={true}
                          placeholder="Select Type Of Buyer"
                          options={TypeOfBuyer}
                          initialValue={{
                            label: initialValues.buyer_type,
                            value: initialValues.buyer_type,
                          }}
                        />
                      </Col>
                    </>
                  )}
                  {visibilityData.showInvestmentType && (
                    <>
                      <CustomFormGroup
                        formlabel="Investment Type"
                        FormField={
                          <CustomMultipleSelectField
                            name="investment_type"
                            placeholder="Select Investment Type"
                            options={TypeOfInvestor}
                            isLabelValue={true}
                            FieldValue={setFieldValue}
                            values={values}
                            initialValue={
                              initialValues.investment_type &&
                              initialValues.investment_type.trim() !== ""
                                ? CreateLabelValueArray(
                                    convertArrayToObjectsWithLabelKey(
                                      initialValues.investment_type
                                        .split(",")
                                        .map((item) => item.trim())
                                    ),
                                    "label"
                                  )
                                : []
                            }
                          />
                        }
                      />

                      {/* <Col xs={12} md={2}>
                        <h3 className="custom-form-label">Investment Type</h3>
                      </Col>
                      <Col xs={12} md={4}>
                        <CustomSelectField
                          name="investment_type"
                          FieldValue={setFieldValue}
                          isLabelValue={true}
                          placeholder="Select Type Of Investor"
                          options={TypeOfInvestor}
                          initialValue={{
                            label: initialValues.investment_type,
                            value: initialValues.investment_type,
                          }}
                        />
                      </Col> */}
                    </>
                  )}
                </Row>
                <Row className="my-3 align-items-center">
                  {visibilityData.showPostHandover && (
                    <>
                      <CustomFormGroup
                        formlabel="Post Handover"
                        FormField={
                          <CustomMultipleSelectField
                            name="post_handover"
                            placeholder="Select Post Handover"
                            options={PostHandover}
                            isLabelValue={true}
                            FieldValue={setFieldValue}
                            values={values}
                            initialValue={
                              initialValues.post_handover &&
                              initialValues.post_handover.trim() !== ""
                                ? CreateLabelValueArray(
                                    convertArrayToObjectsWithLabelKey(
                                      initialValues.post_handover
                                        .split(",")
                                        .map((item) => item.trim())
                                    ),
                                    "label"
                                  )
                                : []
                            }
                          />
                        }
                      />
                      <CustomFormGroup
                        formlabel="Handover Year"
                        FormField={
                          <CustomMultipleSelectField
                            name="handover_year"
                            placeholder="Select Handover Year"
                            options={CreateLabelValueArray(
                              GetAllHandoverYearDropDown?.data || [],
                              "handover_year"
                            )}
                            isLabelValue={true}
                            FieldValue={setFieldValue}
                            values={values} // Make sure `values.locality` is properly set in your form state
                            initialValue={
                              initialValues.handover_year &&
                              initialValues.handover_year.trim() !== ""
                                ? CreateLabelValueArray(
                                    convertArrayToObjectsWithLabelKey(
                                      initialValues.handover_year
                                        .split(",") // Split the string of comma-separated values into an array
                                        .map((item) => item.trim()) // Trim extra spaces
                                    ),
                                    "label" // Ensure it matches the key used in the options
                                  )
                                : [] // Default to an empty array if `initialValues.locality` is empty
                            }
                          />
                          // <CustomMultipleSelectField
                          //   name="handover_year"
                          //   placeholder="Select Handover Year"
                          //   options={YearRange}
                          //   isLabelValue={true}
                          //   FieldValue={setFieldValue}
                          //   values={values}
                          //   initialValue={
                          //     initialValues.handover_year &&
                          //     initialValues.handover_year.trim() !== ""
                          //       ? CreateLabelValueArray(
                          //           convertArrayToObjectsWithLabelKey(
                          //             initialValues.handover_year
                          //               .split(",")
                          //               .map((item) => item.trim())
                          //           ),
                          //           "label"
                          //         )
                          //       : []
                          //   }
                          // />
                        }
                      />
                    </>
                  )}
                </Row>
                <div className="text-left">
                  <LoadingButton
                    type="submit"
                    variant="contained"
                    loading={isLoading}
                  >
                    Edit Lead
                  </LoadingButton>
                </div>
              </Card.Body>
            </Card>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default EditLead;
