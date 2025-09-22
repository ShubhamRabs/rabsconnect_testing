import React, { useEffect, useMemo, useState } from "react";
import Breadcrumb from "../../components/Breadcrumb/Breadcrumb";
import { Form, Formik } from "formik";
import { useBootstrap, useMui } from "../../hooks/Hooks";
import {
  CustomFormGroup,
  CustomInputField,
  CustomMobileFiled,
  CustomMultipleSelectField,
  CustomSelectField,
} from "../../components/FormUtility/FormUtility";
import { Ccode } from "../../data/LeadData";
import { CreateLabelValueArray } from "../../hooks/Function";
import { useMutation, useQuery } from "react-query";
import { GetAllCandidatesSource } from "../../hooks/DynamicFields/UseCandidatesSourceHook";
import { GetAllCandidatesPost } from "../../hooks/DynamicFields/UseCandidatesPostHook";
import { GetAllCandidatesStatus } from "../../hooks/DynamicFields/UseCandidatesStatusHook";
import { City, Country, State } from "../../data/CountryStateCity";
import dayjs from "dayjs";
import Axios from "../../setting/axios";
import parse from "autosuggest-highlight/parse";

import { CandidateFormSchema } from "../../schema/Candidate/CandidateFormSchema";
import { useQueryClient } from "react-query";
import {
  Typography,
  Autocomplete,
  Box,
  debounce,
  Grid,
  TextField,
} from "@mui/material";

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

const AddCandidate = ({ dispatch }) => {
  const [inputValue, setInputValue] = useState("");
  const [value, setValue] = useState(null);
  const [options, setOptions] = useState([]);
  const [loaded, setLoaded] = useState(false);

  const { Card, Row } = useBootstrap();
  const { Divider, LoadingButton, ArrowBackIosIcon, PlaceIcon } = useMui();
  const DateTime = dayjs().format("YYYY-MM-DD HH:mm:ss");
  const queryClient = useQueryClient();

  const CandidatesSourceDropDown = useQuery("CandidatesSourceDropDown", () => {
    return GetAllCandidatesSource(["candidate_source"]);
  });

  const CandidatesPostDropDown = useQuery("CandidatesPostDropDown", () => {
    return GetAllCandidatesPost(["candidate_post"]);
  });

  const CandidatesStatusDropDown = useQuery("CandidatesStatusDropDown", () => {
    return GetAllCandidatesStatus(["candidate_status"]);
  });

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
    c_name: "",
    c_email: "",
    c_ccode: "",
    c_mob: null,
    c_alt_ccode: "",
    c_alt_mob: null,
    c_source: "",
    c_position: "",
    c_status: "",
    c_dob: "",
    country: "",
    state: "",
    city: "",
    locality: "",
    c_cv: [],
  };

  const mutation = useMutation((values) => {
    const formData = new FormData();
    formData.append("DateTime", DateTime);
    formData.append("c_name", values.c_name);
    formData.append("c_email", values.c_email);
    formData.append("c_ccode", values.c_ccode);
    formData.append("c_mob", values.c_mob);
    formData.append("c_alt_ccode", values.c_alt_ccode);
    formData.append("c_alt_mob", values.c_alt_mob);
    formData.append("c_source", values.c_source);
    formData.append("c_position", values.c_position);
    formData.append("c_status", values.c_status);
    formData.append("c_dob", values.c_dob);
    formData.append("country", values.country);
    formData.append("state", values.state);
    formData.append("city", values.city);
    formData.append("locality", values.locality);
    formData.append("c_cv", values.c_cv);

    return Axios.post("/candidate/add-candidate", formData);
  });

  const HandleSubmit = async (values) => {
    try {
      await mutation.mutateAsync(values);
      queryClient.invalidateQueries("SubMenuCandidateCount");
      localStorage.setItem("successMessage", "CV uploaded successfully");
      dispatch({ event: "allcandidate" });
    } catch (error) {
      console.error("Error uploading CV", error);
    }
  };

  return (
    <>
      <Breadcrumb
        PageName="Add Candidate"
        BackButton={[
          true,
          "Back",
          <ArrowBackIosIcon />,
          () =>
            dispatch({
              event:
                localStorage.getItem("previousScreen") ===
                localStorage.getItem("currScreen")
                  ? "allcandidate"
                  : localStorage.getItem("previousScreen"),
            }),
        ]}
      />
      <Formik
        initialValues={initialValues}
        validationSchema={CandidateFormSchema}
        onSubmit={HandleSubmit}
      >
        {({ values, setFieldValue, isSubmitting }) => (
          <Form>
            <Card>
              <Card.Body>
                <Card.Title>Candidate Details :-</Card.Title>
                <Divider />
                <Row className="my-3 align-items-center">
                  <CustomFormGroup
                    formlabel="Candidate Name"
                    star="*"
                    FormField={
                      <CustomInputField
                        type="text"
                        name="c_name"
                        placeholder="Enter Candidate Name"
                      />
                    }
                  />
                  <CustomFormGroup
                    formlabel="Email Id."
                    star="*"
                    FormField={
                      <CustomInputField
                        type="text"
                        name="c_email"
                        placeholder="Enter Email Id."
                      />
                    }
                  />
                  <CustomMobileFiled
                    formlabel="Mobile No."
                    star="*"
                    type="text"
                    placeholder="Mobile No."
                    onChange={
                      (value, data) => {
                        setFieldValue("c_ccode", data.dialCode);
                        setFieldValue(
                          "c_mob",
                          value.slice(data.dialCode.length)
                        );
                      }
                      // setContactValidation({
                      //   ...ContactValidation,
                      //   c_ccode: data.dialCode,
                      //   c_mob: value.slice(data.dialCode.length),
                      // })
                    }
                    options={Ccode}
                    defaultvalue={Ccode[0]}
                  />
                  <CustomMobileFiled
                    formlabel="Alt Mobile No.."
                    star="*"
                    type="text"
                    placeholder="Alt Mobile No.."
                    onChange={
                      (value, data) => {
                        setFieldValue("c_alt_ccode", data.dialCode);
                        setFieldValue(
                          "c_alt_mob",
                          value.slice(data.dialCode.length)
                        );
                      }
                      // setContactValidation({
                      //   ...ContactValidation,
                      //   // setFieldValue("c_cv", event.currentTarget.files[0])
                      //   setFieldValue("c_alt_ccode", data.dialCode)
                      //   // c_alt_ccode: data.dialCode,
                      //   c_alt_mob: value.slice(data.dialCode.length),
                      // })
                    }
                    options={Ccode}
                    defaultvalue={Ccode[0]}
                  />
                  <CustomFormGroup
                    style={{ marginTop: "20px" }}
                    formlabel="Candidate Source"
                    star="*"
                    FormField={
                      <CustomSelectField
                        name="c_source"
                        FieldValue={setFieldValue}
                        placeholder="Select Candidate Source"
                        options={CreateLabelValueArray(
                          CandidatesSourceDropDown?.data,
                          "candidate_source"
                        )}
                        isLabelValue={true}
                        required
                      />
                    }
                  />
                  <CustomFormGroup
                    style={{ marginTop: "20px" }}
                    formlabel="Candidate Position"
                    star="*"
                    FormField={
                      <CustomSelectField
                        name="c_position"
                        FieldValue={setFieldValue}
                        placeholder="Select Candidate Position"
                        options={CreateLabelValueArray(
                          CandidatesPostDropDown?.data,
                          "candidate_post"
                        )}
                        isLabelValue={true}
                        required
                      />
                    }
                  />
                  <CustomFormGroup
                    formlabel="Candidate Status"
                    star="*"
                    FormField={
                      <CustomSelectField
                        name="c_status"
                        FieldValue={setFieldValue}
                        placeholder="Select Candidate Status"
                        options={CreateLabelValueArray(
                          CandidatesStatusDropDown?.data,
                          "candidate_status"
                        )}
                        isLabelValue={true}
                        required
                      />
                    }
                  />
                  <CustomFormGroup
                    formlabel="Date of Birth"
                    FormField={<CustomInputField type="date" name="c_dob" />}
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
                          setFieldValue("locality", newValue.description);
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
                            name="locality"
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
                </Row>
                <Row className="mt-3 align-items-center">
                  {/* <CustomFormGroup
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
                        values={values}
                      />
                    }
                  /> */}

                  {/* <CustomFormGroup
                    formlabel="Locality"
                    FormField={
                      <CustomInputField
                        type="text"
                        name="locality"
                        placeholder="Enter Locality"
                      />
                    }
                  /> */}
                  <Row className="mt-3 align-items-center">
                    <CustomFormGroup
                      formlabel="CV"
                      FormField={
                        <input
                          type="file"
                          name="c_cv"
                          onChange={(event) =>
                            setFieldValue("c_cv", event.currentTarget.files[0])
                          }
                        />
                      }
                    />
                  </Row>

                  <div className="text-left mt-3">
                    <LoadingButton
                      type="submit"
                      variant="contained"
                      loading={isSubmitting}
                    >
                      Add Candidate
                    </LoadingButton>
                  </div>
                </Row>
              </Card.Body>
            </Card>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default AddCandidate;