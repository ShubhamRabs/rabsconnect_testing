import { useState, useEffect } from "react";
import React from "react";
import Breadcrumb from "../../components/Breadcrumb/Breadcrumb";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useBootstrap, useMui } from "../../hooks/Hooks";
import {
  CustomFormGroup,
  CustomSelectField,
  CustomInputField,
  CustomMultipleSelectField,
  CustomTextareaField,
  CustomMobileFiled,
  CustomSelectIdNameField,
} from "./../../components/FormUtility/FormUtility";
import { CreateLabelValueArray, numberToWords } from "./../../hooks/Function";
import { useQuery } from "react-query";
import { GetAllSource } from "./../../hooks/DynamicFields/useSourceHook";
import { GetAllBroker } from "./../../hooks/Broker/UseBrokerHook";
import { GetAllProjectName } from "./../../hooks/DynamicFields/useProjectNameHook";
import {
  ServiceType,
  PropertyType,
  PropertyCategory,
  PropertyArea,
  PropertyPrice,
  TypeOfBuyer,
  TypeOfInvestor,
  Ccode,
  PostHandover,
  initialCurrencyValue,
} from "./../../data/LeadData";
import { GetAllConfiguration } from "./../../hooks/DynamicFields/UseConfigurationHook";
import {
  Country,
  State,
  City,
  initialCityValue,
  initialStateValue,
  initialCountryValue,
} from "./../../data/CountryStateCity";
import { useAddNewLead } from "../../hooks/Leads/UseLeadsHook";
import { LeadFormSchema } from "../../schema/Leads/LeadFormSchema";
import FileUpload from "../../components/FileUpload/FileUpload";
import { useQueryClient } from "react-query";
import dayjs from "dayjs";
import Axios from "../../setting/axios";
const AddLead = ({ dispatch }) => {
  const { Card, Row, Col } = useBootstrap();
  const {
    Divider,
    RadioGroup,
    Radio,
    FormControlLabel,
    LoadingButton,
    ArrowBackIosIcon,
  } = useMui();
  const [selectedFile, setSelectedFile] = useState(null);
  const [ContactValidation, setContactValidation] = React.useState({
    lccode: "",
    lmobile: null,
    ref_ccode: "",
    ref_number: null,
    s_ccode: "",
    s_mob: "",
  });
  const [visibilityData, setVisibilityData] = React.useState({});
  // const DateTime = dayjs().tz("Asia/Kolkata").format("YYYY-MM-DD HH:mm:ss");
  const initialValues = {
    source_type: "Direct",
    source: "",
    brk_id: "",
    ref_name: "",
    ref_ccode: "",
    ref_mob_no: "",
    ref_email: "",
    lname: "",
    lemail: "",
    pname: "",
    service_type: "",
    ptype: "",
    pcategory: "",
    pconfiguration: "",
    min_area: "",
    max_area: "",
    area_unit: "Sq Feet",
    min_price: "",
    max_price: "",
    price_unit: initialCurrencyValue.value,
    country: initialCountryValue.map((c) => c.value),
    state: initialStateValue.map((c) => c.value),
    city: initialCityValue.map((c) => c.value),
    locality: "",
    other_details: "",
    buyer_type: "",
    investment_type: "",
    post_handover: "",
    document: "",
  };

  const { mutate, isLoading } = useAddNewLead();

  const sourceData = useQuery("AllSource", () => {
    return GetAllSource(["source"]);
  });

  const brokerData = useQuery("AllBroker", () => {
    return GetAllBroker(["name", "company", "brk_id"]);
  });

  console.log(brokerData?.data, "broker Data");

  const projectNameData = useQuery("AllProjectName", () => {
    return GetAllProjectName(["pname"]);
  });

  const configurationData = useQuery("AllConfiguration", () => {
    return GetAllConfiguration(["configuration", "configuration_type"]);
  });

  const queryClient = useQueryClient();

  const HandleSubmit = async (values) => {
    console.log(values, "values BEFORE");

    // Get current date and time
    const DateTime = dayjs().format("YYYY-MM-DD HH:mm:ss");
    console.log(DateTime, "DateTime");

    // Check validation conditions
    if (
      (ContactValidation.lmobile !== null &&
        ContactValidation.lmobile !== "") ||
      (initialValues.source_type === "Reference" &&
        ContactValidation.ref_number !== null &&
        ContactValidation.ref_number !== "")
    ) {
      // Create a new FormData instance
      const formData = new FormData();

      // Append all fields from `values` to FormData, excluding the file
      Object.entries(values).forEach(([key, value]) => {
        if (key !== "document") {
          formData.append(key, value);
        }
      });

      // Append additional validation data
      Object.entries(ContactValidation).forEach(([key, value]) => {
        formData.append(key, value);
      });

      // Append the DateTime
      formData.append("DateTime", DateTime);

      // Append the document file if it exists
      if (values.document) {
        console.log("Appending document:", values.document);
        formData.append("document", values.document); // Assuming values.document is a File object
      } else {
        console.warn("No document found to append.");
      }

      // Log FormData entries to check what is appended
      for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }

      // Call the mutation function with FormData
      mutate(formData, {
        onSuccess: (data) => {
          queryClient.invalidateQueries("SubMenuLeadCount");
          localStorage.setItem("successMessage", data.data);
          dispatch({ event: "totalleads" });
        },
      });
    } else {
      // Handle validation failure
      console.log("Validation failed: missing required fields.");
    }
  };

  // const HandleSubmit = (values) => {
  //   console.log(values, "values BEFORE");

  //   const dateTime = dayjs().format("YYYY-MM-DD HH:mm:ss");
  //   console.log(dateTime, "dateTime");

  //   // Ensure ContactValidation and initialValues are defined
  //   if (
  //     (ContactValidation?.lmobile !== null &&
  //       ContactValidation?.lmobile !== "") ||
  //     (initialValues?.source_type === "Reference" &&
  //       ContactValidation?.ref_number !== null &&
  //       ContactValidation?.ref_number !== "")
  //   ) {
  //    // const file = values.document || null; // Safely handle the file

  //     // Prepare data for submission
  //     const data = {
  //       ...values,
  //       ...ContactValidation,
  //       dateTime,

  //     };
  //   console.log(data, "data BEFORE mutation");
  //     // Call the mutation function
  //     mutate(data, {
  //       onSuccess: (data) => {
  //         queryClient.invalidateQueries("SubMenuLeadCount");
  //         localStorage.setItem("successMessage", data?.message || "Operation successful"); // Safe access
  //         dispatch({ event: "totalleads" });
  //       },
  //       onError: (error) => {
  //         console.error("Error:", error);
  //       },
  //     });

  //     console.log(data, "data AFTER mutation");
  //   } else {
  //     // Handle validation errors
  //     console.error("Validation failed");

  //     // Optionally, update the validation state
  //     // setContactValidation({
  //     //   ...ContactValidation,
  //     //   lmobile: "",
  //     //   ref_number: "",
  //     // });
  //   }
  // };

  // const HandleSubmit = (values) => {
  //   console.log(values, "values BEFORE");
  //   const DateTime = dayjs().format("YYYY-MM-DD HH:mm:ss");
  //   console.log(DateTime, "DateTime");

  //   if (
  //     (ContactValidation.lmobile !== null &&
  //       ContactValidation.lmobile !== "") ||
  //     (initialValues.source_type === "Reference" &&
  //       ContactValidation.ref_number !== null &&
  //       ContactValidation.ref_number !== "")
  //   ) {
  //     // Prepare data for submission
  //     const data = {
  //       ...values,
  //       ...ContactValidation,
  //       DateTime,
  //     };

  //     // Get the file from the form (assuming you have a way to get it)
  //     const file = values.document; // Adjust if your file handling is different

  //     // Call the mutation function
  //     mutate({ values: data, file }, {
  //       onSuccess: (data) => {
  //         queryClient.invalidateQueries("SubMenuLeadCount");
  //         localStorage.setItem("successMessage", data.message); // Adjust based on response structure
  //         dispatch({ event: "totalleads" });
  //       },
  //       onError: (error) => {
  //         console.error('Error:', error);
  //       },
  //     });
  //     console.log(data);
  //   } else {
  //     // Handle validation errors
  //     console.error('Validation failed');
  //     // setContactValidation({
  //     //   ...ContactValidation,
  //     //   lmobile: "",
  //     //   ref_number: "",
  //     // });
  //   }
  // };

  useEffect(() => {
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
        PageName="Add Lead"
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
      <Formik
        initialValues={initialValues}
        validationSchema={LeadFormSchema}
        onSubmit={HandleSubmit}
      >
        {({ values, setFieldValue, errors }) => (
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
                      />
                      <FormControlLabel
                        value="Broker"
                        control={<Radio />}
                        label="Broker"
                      />
                      <FormControlLabel
                        value="Reference"
                        control={<Radio />}
                        label="Reference"
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
                          />
                        }
                      />
                      {console.log("first,", values)}
                      <CustomMobileFiled
                        formlabel="Reference Mobile No."
                        star="*"
                        type="text"
                        name="ref_mob_no"
                        placeholder="Reference Mobile No."
                        onChange={(value, data) =>
                          setContactValidation({
                            ...ContactValidation,
                            ref_ccode: data.dialCode,
                            ref_number: value.slice(data.dialCode.length),
                          })
                        }
                        defaultCountry={"ae"}
                        options={Ccode}
                        defaultvalue={Ccode[0]}
                        error={ContactValidation.ref_number}
                      />
                      <ErrorMessage
                        name={"ref_mob_no"}
                        component="div"
                        className="error"
                      />
                      <CustomFormGroup
                        formlabel="Reference Email"
                        star="*"
                        FormField={
                          <CustomInputField
                            type="email"
                            name="ref_email"
                            placeholder="Enter Reference Email"
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
                    onChange={(value, data) => {
                      ContactValidation.lmobile = "";
                      setContactValidation({
                        ...ContactValidation,
                        lccode: data.dialCode,
                        lmobile: value.slice(data.dialCode.length),
                      });
                    }}
                    options={Ccode}
                    defaultvalue={Ccode[0]}
                    error={ContactValidation.lmobile}
                  />

                  <CustomMobileFiled
                    formlabel="Alt. Mobile No."
                    type="text"
                    placeholder="Alt. Mobile No."
                    onChange={(value, data) =>
                      setContactValidation({
                        ...ContactValidation,
                        s_ccode: data.dialCode,
                        s_mob: value.slice(data.dialCode.length),
                      })
                    }
                    options={Ccode}
                    defaultvalue={Ccode[0]}
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
                      />
                    }
                  />
                  <CustomFormGroup
                    formlabel="Property Category"
                    FormField={
                      <CustomMultipleSelectField
                        name="pcategory"
                        placeholder="Select Property Category"
                        options={CreateLabelValueArray(
                          PropertyCategory.filter(
                            (row) => values.ptype.indexOf(row.type) !== -1
                          ),
                          "label",
                          "value"
                        )}
                        isLabelValue={true}
                        FieldValue={setFieldValue}
                        values={values}
                      />
                    }
                  />
                  <CustomFormGroup
                    formlabel="Configuration"
                    FormField={
                      <CustomMultipleSelectField
                        name="pconfiguration"
                        placeholder="Select Configuration"
                        options={CreateLabelValueArray(
                          configurationData.data?.filter(
                            (row) =>
                              values.ptype.indexOf(row.configuration_type) !==
                              -1
                          ),
                          "configuration"
                        )}
                        isLabelValue={true}
                        FieldValue={setFieldValue}
                        values={values}
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
                      initialValue={{ value: "Sq Feet", label: "Sq Feet" }}
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
                  <Col xs={12} md={2} className="align-items-center d-flex">
                    <h3 className="custom-form-label">Property Price</h3>
                  </Col>
                  <Col xs={12} md={4}>
                    <CustomSelectField
                      name="price_unit"
                      FieldValue={setFieldValue}
                      isLabelValue={true}
                      placeholder="Select Currency"
                      options={PropertyPrice}
                      initialValue={initialCurrencyValue}
                    />
                  </Col>
                  <Col xs={6} md={3}>
                    <CustomInputField
                      type="number"
                      name="min_price"
                      placeholder="Enter Minimum Price"
                    />
                    <p className="number-in-word m-0">
                      {numberToWords(values.min_price, values.price_unit)}
                    </p>
                  </Col>
                  <Col xs={6} md={3}>
                    <CustomInputField
                      type="number"
                      name="max_price"
                      placeholder="Enter Maximum Price"
                    />
                    <p className="number-in-word m-0">
                      {numberToWords(values.max_price, values.price_unit)}
                    </p>
                  </Col>
                </Row>
                <Row className="mt-3 align-items-center">
                  <CustomFormGroup
                    formlabel="Locality"
                    FormField={
                      <CustomInputField
                        type="text"
                        name="locality"
                        placeholder="Enter Locality"
                      />
                    }
                  />
                  <CustomFormGroup
                    formlabel="City"
                    FormField={
                      <CustomMultipleSelectField
                        name="city"
                        placeholder="Select City"
                        options={CreateLabelValueArray(
                          City.filter(
                            (row) => values.state.indexOf(row.stateCode) !== -1
                          ),
                          "name"
                        )}
                        isLabelValue={true}
                        FieldValue={setFieldValue}
                        // values={values}
                        initialValue={initialCityValue}
                      />
                    }
                  />
                  <CustomFormGroup
                    formlabel="State"
                    FormField={
                      <CustomMultipleSelectField
                        name="state"
                        placeholder="Select State"
                        options={CreateLabelValueArray(
                          State.filter(
                            (row) =>
                              values.country.indexOf(row.countryCode) !== -1
                          ),
                          "name",
                          "isoCode"
                        )}
                        isLabelValue={true}
                        FieldValue={setFieldValue}
                        values={values}
                        initialValue={initialStateValue}
                      />
                    }
                  />

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
                        initialValue={initialCountryValue}
                      />
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
                    <h3 className="custom-form-label">Document</h3>
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
                            placeholder="Investment Type"
                            options={TypeOfInvestor}
                            isLabelValue={true}
                            FieldValue={setFieldValue}
                            values={values}
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
                        />
                      </Col> */}
                    </>
                  )}
                </Row>
                <Row className="my-3 align-items-center">
                  {visibilityData.showPostHandover && (
                    <>
                      {/* <Col xs={12} md={2}>
                        <h3 className="custom-form-label">Post Handover</h3>
                      </Col>
                      <Col xs={12} md={4}> */}
                      {/* <CustomSelectField
                          name="post_handover"
                          FieldValue={setFieldValue}
                          isLabelValue={true}
                          placeholder="Select Post Handover"
                          options={PostHandover}
                        /> */}

                      <CustomFormGroup
                        formlabel="post handover"
                        FormField={
                          <CustomMultipleSelectField
                            name="post_handover"
                            placeholder="post_handover"
                            options={PostHandover}
                            isLabelValue={true}
                            FieldValue={setFieldValue}
                            values={values}
                          />
                        }
                      />
                      {/* </Col> */}
                    </>
                  )}
                </Row>
                <div className="text-left">
                  <LoadingButton
                    type="submit"
                    variant="contained"
                    loading={isLoading}
                  >
                    Add Lead
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

export default AddLead;
