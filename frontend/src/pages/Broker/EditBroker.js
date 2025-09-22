import React, { useEffect, useMemo, useState } from "react";
import Breadcrumb from "../../components/Breadcrumb/Breadcrumb";
import { Form, Formik } from "formik";
import CryptoJS from "crypto-js";
import { useBootstrap, useMui, useSetting } from "../../hooks/Hooks";
import {
  CustomFormGroup,
  CustomInputField,
  CustomMobileFiled,
} from "../../components/FormUtility/FormUtility";
import { Ccode } from "../../data/LeadData";
import { useEditBroker } from "../../hooks/Broker/UseBrokerHook";
import parse from "autosuggest-highlight/parse";
import {
  Autocomplete,
  Box,
  debounce,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import PlaceIcon from "@mui/icons-material/Place";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import LoadingButton from "@mui/lab/LoadingButton";
import axios from "../../setting/axios";
import FileUpload from "../../components/FileUpload/FileUpload";
import * as Yup from "yup";

// Define the validation schema
const validationSchema = Yup.object().shape({
  b_name: Yup.string().required("Name is required"),
  b_email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
  b_ccode: Yup.string().required("Country code is required"),
  b_mob: Yup.string().required("Mobile number is required"),
  b_company: Yup.string().required("Company name is required"),
  b_rera_no: Yup.string().required("RERA number is required"),
  brk_location: Yup.string().required("Location is required"),
  b_address: Yup.string(), // Not required
  b_remark: Yup.string(), // Not required
});

// const GOOGLE_MAPS_API_KEY = "AIzaSyAFB7lnFaGvbIL0m3jLYL6oK2p6lDajNbk";

// function loadScript(src, position, id) {
//   if (!position) {
//     return;
//   }

//   const script = document.createElement("script");
//   script.setAttribute("async", "");
//   script.setAttribute("id", id);
//   script.src = src;
//   position.appendChild(script);
// }

// const autocompleteService = { current: null };

const EditBroker = ({ dispatch, myglobalData }) => {
  const { Card, Row } = useBootstrap();
  const { Divider } = useMui();
  const { globalData } = useSetting();

  let CryptoJSKey = globalData.CompanyName + "@" + globalData.Version;
  const bytes = CryptoJS.AES.decrypt(
    localStorage.getItem("updateglobal_userdata"),
    CryptoJSKey
  );
  var user_data = bytes.toString(CryptoJS.enc.Utf8);
  let brokerDetails = JSON.parse(user_data);

  const [inputValue, setInputValue] = useState("");
  const [value, setValue] = useState(null);
  const [options, setOptions] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [selectedFile, setSelectedFile] = useState(`${brokerDetails.document}`);

  // useEffect(() => {
  //   if (typeof window !== "undefined" && !loaded) {
  //     if (!document.querySelector("#google-maps")) {
  //       loadScript(
  //         `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`,
  //         document.querySelector("head"),
  //         "google-maps"
  //       );
  //       setLoaded(true);
  //     }
  //   }
  // }, [loaded]);

  // const fetch = useMemo(
  //   () =>
  //     debounce((request, callback) => {
  //       autocompleteService.current.getPlacePredictions(request, callback);
  //     }, 400),
  //   []
  // );

  // useEffect(() => {
  //   let active = true;

  //   if (!autocompleteService.current && window.google) {
  //     autocompleteService.current =
  //       new window.google.maps.places.AutocompleteService();
  //   }
  //   if (!autocompleteService.current) {
  //     return undefined;
  //   }

  //   if (inputValue === "") {
  //     setOptions(value ? [value] : []);
  //     return undefined;
  //   }

  //   fetch({ input: inputValue }, (results) => {
  //     if (active) {
  //       let newOptions = [];

  //       if (value) {
  //         newOptions = [value];
  //       }

  //       if (results) {
  //         newOptions = [...newOptions, ...results];
  //       }

  //       setOptions(newOptions);
  //     }
  //   });

  //   return () => {
  //     active = false;
  //   };
  // }, [value, inputValue, fetch]);

  const [ContactValidation, setContactValidation] = React.useState({
    b_ccode: brokerDetails.ccode,
    mob: brokerDetails.mob,
  });

  const initialValues = {
    b_brk_id: brokerDetails.brk_id,
    b_name: brokerDetails.name,
    b_email: brokerDetails.email,
    b_company: brokerDetails.company,
    b_rera_no: brokerDetails.rera_no,
    b_address: brokerDetails.address,
    brk_location: brokerDetails.brk_location,
    b_remark: brokerDetails.remark,
    document: brokerDetails.document || null,
  };

  const { mutate, isLoading } = useEditBroker();

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const HandleSubmit = async (values) => {
console.log(values, "values BEFORE");
    const formData = new FormData();
    formData.append("DateTime", new Date().toISOString());
    formData.append(
      "data",
      JSON.stringify({
        b_name: values.b_name,
        b_email: values.b_email,
        b_ccode: ContactValidation.b_ccode,
        b_mob: ContactValidation.mob,
        b_company: values.b_company,
        b_rera_no: values.b_rera_no,
        brk_location: values.brk_location,
        b_address: values.b_address,
        b_remark: values.b_remark,
        b_brk_id: brokerDetails.brk_id,
      })
    );
    if (
      selectedFile &&
      selectedFile !==
        `${myglobalData.API_URL}/uploads/broker/${brokerDetails.document}`
    ) {
      formData.append("document", selectedFile);
    }
    console.log(formData);
    try {
      const response = await axios.post("/broker/edit-broker", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (response.data === "Broker Details Updated Successfully") {
        localStorage.setItem(
          "successMessage",
          "Broker Details updated successfully"
        );
        dispatch({ event: "brokerdetails" });
      }
    } catch (error) {
      console.error("Error in adding Broker", error);
    }
  };
  return (
    <>
      <Breadcrumb
        PageName="Edit Broker"
        BackButton={[
          true,
          "Back",
          <ArrowBackIosIcon />,
          () =>
            dispatch({
              event:
                localStorage.getItem("previousScreen") ===
                localStorage.getItem("currScreen")
                  ? "brokerdetails"
                  : localStorage.getItem("previousScreen"),
            }),
        ]}
      />
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={HandleSubmit}
      >
        {({ values, setFieldValue }) => (
          <Form>
            <Card>
              <Card.Body>
                <Card.Title>Broker Details :-</Card.Title>
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
                      setContactValidation({
                        ...ContactValidation,
                        b_ccode: data.dialCode,
                        mob: value.slice(data.dialCode.length),
                      });
                    }}
                    options={Ccode}
                    defaultVal={
                      ContactValidation.b_ccode + " " + ContactValidation.mob
                    }
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
                    formlabel="Location"
                    star="*"
                    FormField={
                      <CustomInputField
                        type="text"
                        name="brk_location"
                        placeholder="Enter Location"
                      />
                    }
                  />
                  
                  <CustomFormGroup
                    formlabel="Address"
                    star="*"
                    FormField={
                      <CustomInputField
                        type="text"
                        name="b_address"
                        placeholder="Enter Address"
                      />
                    }
                  />
                  <CustomFormGroup
                    formlabel="Remark"
                    star=""
                    FormField={
                      <CustomInputField
                        type="text"
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
                        myglobalData={myglobalData}
                        onFileSelect={(file) => {
                          setSelectedFile(file);
                          setFieldValue("document", file);
                        }}
                        selectedFile={selectedFile}
                      />
                    }
                  />
                </Row>
                <Row className="mt-3 align-items-center">
                  <div className="text-left mt-3">
                    <LoadingButton
                      type="submit"
                      variant="contained"
                      loading={isLoading}
                    >
                      Update Broker
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

export default EditBroker;
