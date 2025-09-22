import React, { useEffect, useMemo, useState } from "react";
import { Form, Formik } from "formik";
import CryptoJS from "crypto-js";
import Breadcrumb from "../../components/Breadcrumb/Breadcrumb";
import { useBootstrap, useMui, useSetting } from "../../hooks/Hooks";
import Axios from "../../setting/axios";
import dayjs from "dayjs";
import { useQueryClient } from "react-query";
import {
  CustomFormGroup,
  CustomInputField,
  CustomMobileFiled,
  CustomSelectField,
} from "../../components/FormUtility/FormUtility";
import { CreateLabelValueArray } from "../../hooks/Function";
import { useMutation, useQuery } from "react-query";
import { GetAllCandidatesSource } from "../../hooks/DynamicFields/UseCandidatesSourceHook";
import { GetAllCandidatesPost } from "../../hooks/DynamicFields/UseCandidatesPostHook";
import { Ccode } from "../../data/LeadData";
import parse from "autosuggest-highlight/parse";
import { useEditCandidate } from "../../hooks/HumanResources/UseCandidateHook";
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

// Define the EditCandidate component
const EditCandidate = ({ dispatch }) => {
  const [inputValue, setInputValue] = useState("");
  const [value, setValue] = useState(null);
  const [options, setOptions] = useState([]);
  const DateTime = dayjs().format("YYYY-MM-DD HH:mm:ss");
  const queryClient = useQueryClient();
  const [loaded, setLoaded] = useState(false);
  // Hooks for styling and utility functions
  const { Card, Row } = useBootstrap();
  const { Divider, LoadingButton, ArrowBackIosIcon, PlaceIcon } = useMui();
  const { globalData } = useSetting();
  // Decrypt user data from localStorage
  let CryptoJSKey = globalData.CompanyName + "@" + globalData.Version;

  const bytes = CryptoJS.AES.decrypt(
    localStorage.getItem("updateglobal_userdata"),
    CryptoJSKey
  );

  var user_data = bytes.toString(CryptoJS.enc.Utf8);
  // Parse the decrypted user data as JSON
  let CandidateDetails = JSON.parse(user_data);
  // State to manage and validate contact information
  const [ContactValidation, setContactValidation] = React.useState({
    c_ccode: CandidateDetails.c_ccode,
    c_mob: CandidateDetails.c_mob,
    c_alt_ccode: CandidateDetails.c_alt_ccode,
    c_alt_mob: CandidateDetails.c_alt_mob,
  });
  // Initial form values based on candidate data
  const initialValues = {
    c_id: CandidateDetails.c_id,
    c_name: CandidateDetails.c_name,
    c_email: CandidateDetails.c_email,
    c_source: CandidateDetails.c_source,
    c_position: CandidateDetails.c_position,
    c_dob: CandidateDetails.c_dob,
    country: CandidateDetails.country,
    state: CandidateDetails.state,
    city: CandidateDetails.city,
    locality: CandidateDetails.locality,
    c_cv: [],
  };
  // Fetch dropdown options for candidate source and position using React Query
  const CandidatesSourceDropDown = useQuery("CandidatesSourceDropDown", () => {
    return GetAllCandidatesSource(["candidate_source"]);
  });

  const CandidatesPostDropDown = useQuery("CandidatesPostDropDown", () => {
    return GetAllCandidatesPost(["candidate_post"]);
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

  // Hook for handling the edit candidate mutation
  const mutation = useMutation((values) => {
    console.log(ContactValidation, "ContactValidation");

    const formData = new FormData();
    formData.append("DateTime", DateTime);
    formData.append("c_name", values.c_name);
    formData.append("c_email", values.c_email);
    formData.append("c_source", values.c_source);
    formData.append("c_position", values.c_position);
    formData.append("c_status", values.c_status);
    formData.append("country", values.country);
    formData.append("state", values.state);
    formData.append("c_dob", values.c_dob);
    formData.append("city", values.city);
    formData.append("locality", values.locality);
    formData.append("c_cv", values.c_cv);
    formData.append("c_ccode", ContactValidation.c_ccode);
    formData.append("c_mob", ContactValidation.c_mob);
    formData.append("c_alt_ccode", ContactValidation.c_alt_ccode);
    formData.append("c_alt_mob", ContactValidation.c_alt_mob);
    formData.append("c_id", CandidateDetails.c_id);

    return Axios.post("/candidate/edit-candidate", formData);
  });
  // Function to handle form submission
  const HandleSubmit = async (values) => {
    try {
      await mutation.mutateAsync(values);
      queryClient.invalidateQueries("SubMenuCandidateCount");
      localStorage.setItem(
        "successMessage",
        "Candidates details updated successfully"
      );
      dispatch({ event: "allcandidate" });
    } catch (error) {
      console.error("Error Updating", error);
    }
  };
  // JSX rendering of the form
  return (
    <>
      {/* Breadcrumb for navigation */}
      <Breadcrumb
        PageName="Edit Candidate"
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
      {/* Formik component to handle form state and submission */}
      <Formik
        initialValues={initialValues}
        // validationSchema={LeadFormSchema}
        onSubmit={HandleSubmit}
      >
        {({ values, setFieldValue }) => (
          <Form>
            {/* Card for styling */}
            <Card>
              <Card.Body>
                {/* Section for displaying candidate details */}
                <Card.Title>Candidate Details :-</Card.Title>
                <Divider />
                {/* Row for arranging form fields */}
                <Row className="my-3 align-items-center">
                  {/* Form groups for various fields */}
                  {/* CustomInputField, CustomMobileFiled, CustomSelectField are custom components */}
                  {/* Placeholder text is provided for brevity, adjust as needed */}
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
                    onChange={(value, data) =>
                      setContactValidation({
                        ...ContactValidation,
                        c_ccode: data.dialCode,
                        c_mob: value.slice(data.dialCode.length),
                      })
                    }
                    options={Ccode}
                    defaultVal={
                      ContactValidation.c_ccode + " " + ContactValidation.c_mob
                    }
                  />
                  <CustomMobileFiled
                    formlabel="Alt Mobile No.."
                    star="*"
                    type="text"
                    placeholder="Alt Mobile No.."
                    onChange={(value, data) =>
                      setContactValidation({
                        ...ContactValidation,
                        c_alt_ccode: data.dialCode,
                        c_alt_mob: value.slice(data.dialCode.length),
                      })
                    }
                    options={Ccode}
                    defaultVal={
                      ContactValidation.c_alt_ccode +
                      " " +
                      ContactValidation.c_alt_mob
                    }
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
                        required
                        isLabelValue={true}
                        initialValue={{
                          label: initialValues.c_source,
                          value: initialValues.c_source,
                        }}
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
                        initialValue={{
                          label: initialValues.c_position,
                          value: initialValues.c_position,
                        }}
                      />
                    }
                  />
                  <CustomFormGroup
                    formlabel="Date of Birth"
                    FormField={<CustomInputField type="date" name="c_dob" />}
                  />
                </Row>
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
                {/* Row for arranging additional form fields */}
                <Row className="mt-3 align-items-center">
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
                        value={CandidateDetails.locality}
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
                  {/* LoadingButton for form submission */}
                  <div className="text-left mt-3">
                    <LoadingButton
                      type="submit"
                      variant="contained"
                      // loading={isLoading}
                    >
                      Edit Candidate
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

export default EditCandidate;