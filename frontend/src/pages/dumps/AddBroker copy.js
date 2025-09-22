import React, { useEffect, useMemo, useState } from "react";
import Breadcrumb from "../../components/Breadcrumb/Breadcrumb";
import { Form, Formik } from "formik";
import { useBootstrap, useMui } from "../../hooks/Hooks";
import {
  CustomFormGroup,
  CustomInputField,
  CustomMobileFiled,
} from "../../components/FormUtility/FormUtility";
import { Ccode } from "../../data/LeadData";
import { BrokerFormSchema } from "../../schema/Broker/BrokerFormSchema";
import { useQueryClient } from "react-query";
import { useAddBroker } from "../../hooks/Broker/UseBrokerHook";
import {
  Autocomplete,
  Box,
  debounce,
  Grid,
  TextField,
  Typography,
  IconButton,
  FormControl,
  FormHelperText,
} from "@mui/material";
import parse from "autosuggest-highlight/parse";
import FileUpload from "../../components/FileUpload/FileUpload"; // Import the new FileUpload component
import axios from "../../setting/axios";

const GOOGLE_MAPS_API_KEY = "AIzaSyAFB7lnFaGvbIL0m3jLYL6oK2p6lDajNbk";

function loadScript(src, position, id) {
  if (!position) {
    return;
  }

  const script = document.createElement("script");
  script.setAttribute("async", "");
  script.setAttribute("id", id);
  script.src = src;
  position.appendChild(script);
}

const autocompleteService = { current: null };

const AddBroker = ({ dispatch }) => {
  const { Card, Row } = useBootstrap();
  const { Divider, LoadingButton, PlaceIcon } = useMui();
  const queryClient = useQueryClient();
  const [inputValue, setInputValue] = useState("");
  const [value, setValue] = useState(null);
  const [options, setOptions] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null); // State to handle the selected file

  useEffect(() => {
    if (typeof window !== "undefined" && !loaded) {
      if (!document.querySelector("#google-maps")) {
        loadScript(
          `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`,
          document.querySelector("head"),
          "google-maps"
        );
        setLoaded(true);
      }
    }
  }, [loaded]);

  const fetch = useMemo(
    () =>
      debounce((request, callback) => {
        autocompleteService.current.getPlacePredictions(request, callback);
      }, 400),
    []
  );

  useEffect(() => {
    let active = true;

    if (!autocompleteService.current && window.google) {
      autocompleteService.current =
        new window.google.maps.places.AutocompleteService();
    }
    if (!autocompleteService.current) {
      return undefined;
    }

    if (inputValue === "") {
      setOptions(value ? [value] : []);
      return undefined;
    }

    fetch({ input: inputValue }, (results) => {
      if (active) {
        let newOptions = [];

        if (value) {
          newOptions = [value];
        }

        if (results) {
          newOptions = [...newOptions, ...results];
        }

        setOptions(newOptions);
      }
    });

    return () => {
      active = false;
    };
  }, [value, inputValue, fetch]);

  const initialValues = {
    b_name: "",
    b_email: "",
    b_ccode: "",
    b_mob: "",
    b_company: "",
    b_rera_no: "",
    brk_location: "",
    address: "",
    b_remark: "",
    document: null, // Add a new field for the document
  };

  // Custom hook for adding a user
  const { mutate, isLoading } = useAddBroker();

  const HandleSubmit = async (values) => {
    const formData = new FormData();
    formData.append("DateTime", new Date().toISOString());
    formData.append(
      "data",
      JSON.stringify({
        b_name: values.b_name,
        b_email: values.b_email,
        b_ccode: values.b_ccode,
        b_mob: values.b_mob,
        b_company: values.b_company,
        b_rera_no: values.b_rera_no,
        brk_location: values.brk_location,
        address: values.address,
        b_remark: values.b_remark,
      })
    );
    formData.append("document", selectedFile);

    try {
      const response = await axios.post("/broker/add-broker", formData, {
        // headers: {
        //   "Content-Type": "multipart/form-data",
        // },
      });
      if (response.data === "Broker Details Added Successfully") {
        queryClient.invalidateQueries("SubMenuBrokerCount");
        localStorage.setItem(
          "successMessage",
          "Broker Details added successfully"
        );
        dispatch({ event: "brokerdetails" });
      }
    } catch (error) {
      console.error("Error in adding Broker", error);
    }
  };

  // const HandleSubmit = async (values) => {
  //   const formData = new FormData();
  //   formData.append("DateTime", new Date().toISOString());
  //   formData.append(
  //     "data",
  //     JSON.stringify({
  //       b_name: values.b_name,
  //       b_email: values.b_email,
  //       b_ccode: values.b_ccode,
  //       b_mob: values.b_mob,
  //       b_company: values.b_company,
  //       b_rera_no: values.b_rera_no,
  //       brk_location: values.brk_location,
  //       address: values.address,
  //       b_remark: values.b_remark,
  //     })
  //   );
  //   formData.append("document", selectedFile);

  //   try {
  //     const response = await axios.post("/broker/add-broker", formData, {
  //       headers: {
  //         "Content-Type": "multipart/form-data",
  //       },
  //     });
  //     if (response.data === "Broker Details Added Successfully") {
  //       queryClient.invalidateQueries("SubMenuBrokerCount");
  //       localStorage.setItem(
  //         "successMessage",
  //         "Broker Details added successfully"
  //       );
  //       dispatch({ event: "brokerdetails" });
  //     }
  //   } catch (error) {
  //     console.error("Error in adding Broker", error);
  //   }
  // };

  // const HandleSubmit = async (values) => {
  //   alert("working");
  //   const formData = new FormData();
  //   formData.append("DateTime", new Date().toISOString());
  //   formData.append(
  //     "data",
  //     JSON.stringify({
  //       b_name: values.b_name,
  //       b_email: values.b_email,
  //       b_ccode: values.b_ccode,
  //       b_mob: values.b_mob,
  //       b_company: values.b_company,
  //       b_rera_no: values.b_rera_no,
  //       brk_location: values.brk_location,
  //       address: values.address,
  //       b_remark: values.b_remark,
  //     })
  //   );
  //   formData.append("document", selectedFile);

  //   try {
  //     const response = await axios.post("/broker/add-broker", formData, {
  //       headers: {
  //         "Content-Type": "multipart/form-data",
  //       },
  //     });
  //     if (response.data === "Broker Details Added Successfully") {
  //       queryClient.invalidateQueries("SubMenuBrokerCount");
  //       localStorage.setItem(
  //         "successMessage",
  //         "Broker Details added successfully"
  //       );
  //       dispatch({ event: "brokerdetails" });
  //     }
  //   } catch (error) {
  //     console.error("Error in adding Broker", error);
  //   }
  // };

  return (
    <>
      <Breadcrumb PageName="Add Broker" />
      <Formik
        initialValues={initialValues}
        validationSchema={BrokerFormSchema}
        onSubmit={HandleSubmit}
      >
        {({ values, setFieldValue, errors }) => (
          <Form>
            <Card>
              <Card.Body>
                <Card.Title>Broker Details :</Card.Title>
                <Divider />
                <Row className="my-3 align-items-center">
                  <CustomFormGroup
                    formlabel="Broker Name"
                    star="*"
                    FormField={
                      <CustomInputField
                        type="text"
                        name="b_name"
                        placeholder="Enter Broker Name"
                      />
                    }
                  />
                  <CustomFormGroup
                    formlabel="Email"
                    star="*"
                    FormField={
                      <CustomInputField
                        type="email"
                        name="b_email"
                        placeholder="Enter Broker Email"
                      />
                    }
                  />
                  <CustomMobileFiled
                    formlabel="Mobile No."
                    star="*"
                    type="text"
                    placeholder="Mobile No."
                    onChange={(value, data) => {
                      setFieldValue("b_ccode", data.dialCode);
                      setFieldValue("b_mob", value.slice(data.dialCode.length));
                    }}
                    error={values.b_mob}
                    options={Ccode}
                    defaultvalue={Ccode[0]}
                  />
                  <CustomFormGroup
                    formlabel="Company"
                    star="*"
                    FormField={
                      <CustomInputField
                        type="text"
                        name="b_company"
                        placeholder="Enter Company Name"
                      />
                    }
                  />
                  <CustomFormGroup
                    formlabel="RERA No."
                    star="*"
                    FormField={
                      <CustomInputField
                        type="text"
                        name="b_rera_no"
                        placeholder="Enter RERA No."
                      />
                    }
                  />
                  <CustomFormGroup
                    formlabel="Enter Location"
                    star="*"
                    FormField={
                      <Autocomplete
                        freeSolo
                        sx={{ width: "100%" }}
                        id="google-map-demo"
                        disableClearable
                        getOptionLabel={(option) =>
                          typeof option === "string"
                            ? option
                            : option.description
                        }
                        filterOptions={(x) => x}
                        options={options}
                        autoComplete
                        filterSelectedOptions
                        value={value}
                        noOptionsText="No locations"
                        onChange={(event, newValue) => {
                          setOptions(
                            newValue ? [newValue, ...options] : options
                          );
                          setValue(newValue);
                          setFieldValue("brk_location", newValue.description);
                        }}
                        onInputChange={(event, newInputValue) => {
                          setInputValue(newInputValue);
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            placeholder="Search location..."
                            fullWidth
                            variant="outlined"
                            size="small"
                            name="brk_location"
                            required
                          />
                        )}
                        renderOption={(props, option) => {
                          const matches =
                            option.structured_formatting
                              .main_text_matched_substrings || [];

                          const parts = parse(
                            option.structured_formatting.main_text,
                            matches.map((match) => [
                              match.offset,
                              match.offset + match.length,
                            ])
                          );

                          return (
                            <li {...props}>
                              <Grid container alignItems="center">
                                <Grid item sx={{ display: "flex", width: 44 }}>
                                  <PlaceIcon color="#000" />
                                </Grid>
                                <Grid
                                  item
                                  sx={{
                                    width: "calc(100% - 44px)",
                                    wordWrap: "break-word",
                                  }}
                                >
                                  {parts.map((part, index) => (
                                    <Box
                                      key={index}
                                      component="span"
                                      sx={{
                                        fontWeight: part.highlight
                                          ? "bold"
                                          : "regular",
                                      }}
                                    >
                                      {part.text}
                                    </Box>
                                  ))}
                                  <Typography
                                    variant="body2"
                                    color="text.secondary"
                                  >
                                    {
                                      option.structured_formatting
                                        .secondary_text
                                    }
                                  </Typography>
                                </Grid>
                              </Grid>
                            </li>
                          );
                        }}
                      />
                    }
                  />
                  <CustomFormGroup
                    formlabel="Address"
                    star="*"
                    FormField={
                      <CustomInputField
                        type="text"
                        name="address"
                        placeholder="Enter Broker Address"
                      />
                    }
                  />
                  <CustomFormGroup
                    formlabel="Remark"
                    star=""
                    FormField={
                      <CustomInputField
                        as="textarea"
                        name="b_remark"
                        placeholder="Enter Remark"
                      />
                    }
                  />
                  <CustomFormGroup
                    formlabel="Upload Document"
                    star=""
                    FormField={
                      <FileUpload
                        onFileSelect={(file) => {
                          setSelectedFile(file);
                          setFieldValue("document", file);
                        }}
                        selectedFile={selectedFile}
                      />
                    }
                  />
                </Row>
              </Card.Body>
              <Card.Footer>
                <LoadingButton
                  type="submit"
                  variant="contained"
                  loading={isLoading}
                  color="primary"
                >
                  Add Broker
                </LoadingButton>
              </Card.Footer>
            </Card>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default AddBroker;
