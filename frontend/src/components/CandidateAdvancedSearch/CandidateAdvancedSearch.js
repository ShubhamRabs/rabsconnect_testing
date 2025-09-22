import React from "react";
import { useBootstrap, useMui, useSetting } from "../../hooks/Hooks";
import { Formik, Form } from "formik";
import "./CandidateAdvancedSearch.css";
import {
  CustomInputField,
  CustomMultipleSelectField,
} from "../FormUtility/FormUtility";
import { useQuery } from "react-query";
import { CreateLabelValueArray } from "../../hooks/Function";
import { Country, State, City } from "./../../data/CountryStateCity";
import { useSearchCandidates } from "../../hooks/AdvancedSearch/CandidateAdvancedSearchHook";
import { GetAllCandidatesSource } from "../../hooks/DynamicFields/UseCandidatesSourceHook";
import { GetAllCandidatesPost } from "../../hooks/DynamicFields/UseCandidatesPostHook";
import { GetAllCandidatesStatus } from "../../hooks/DynamicFields/UseCandidatesStatusHook";
import { GetAllLocality } from "../../hooks/Other/UseLocalityHook";
import CryptoJS from "crypto-js";

const CandidateAdvancedSearch = ({
  PassSearchData,
  PassPageName,
  page,
  pageSize,
  dispatch,
  useSearchCandidate = useSearchCandidates,
  isCandidateByStatus = false,
  CandidateByStatus,
  isTeamPage = false,
}) => {
  const { Accordion, Row, Col } = useBootstrap();
  const { LoadingButton } = useMui();
  const { globalData } = useSetting();

  const [SearchDeatils, setSearchDeatils] = React.useState([]);
  const [ResetForm, setResetForm] = React.useState(false);

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
    c_source: previousSearchData ? previousSearchData.c_source : "",
    c_position: previousSearchData ? previousSearchData.c_position : "",
    c_status: previousSearchData ? previousSearchData.c_status : "",
    country: previousSearchData ? previousSearchData.country : "",
    state: previousSearchData ? previousSearchData.state : "",
    city: previousSearchData ? previousSearchData.city : "",
    locality: previousSearchData ? previousSearchData.locality : "",
    anytext: previousSearchData ? previousSearchData.anytext : "",
    pageName: PassPageName,
    teamPage: isTeamPage,
    isCandidateByStatus: isCandidateByStatus,
    candidateStatus: CandidateByStatus,
  };

  const { mutate, isLoading } = useSearchCandidate();

  const HandleSubmit = (values) => {
    dispatch({ event: "sotre_search_data", data: JSON.stringify(values) });
    setSearchDeatils(values);
    let data = [values, page, pageSize];
    mutate(data, {
      onSuccess: (data) => {
        PassSearchData(data);
      },
    });
  };

  React.useEffect(() => {
    if (SearchDeatils.length !== 0) {
      let data = [SearchDeatils, page, pageSize];
      if (isCandidateByStatus) {
        setSearchDeatils(initialValues);
        data = [initialValues, page, pageSize];
      }
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
      previousScreen !== "viewcandidate" ||
      previousScreen !== "quickeditcandidate" ||
      previousScreen !== "editcandidate" ||
      previousScreen !== "assigncandidatefrom"
    ) {
      localStorage.removeItem("sotre_search_data");
    }
  }, []);

  const AllCandidatesSource = useQuery("AllCandidatesSource", () => {
    return GetAllCandidatesSource();
  });

  const CandidatesPostList = useQuery("AdvanceSearchCandidatesPostList", () => {
    return GetAllCandidatesPost();
  });

  const CandidatesStatusList = useQuery(
    "AdvanceSearchCandidatesStatusList",
    () => {
      return GetAllCandidatesStatus();
    }
  );

  const LocalityList = useQuery("locality", () => {
    return GetAllLocality(["locality"]);
  });

  const HandleResetForm = () => {
    localStorage.removeItem("sotre_search_data");
    setResetForm(true);
    setSearchDeatils([]);
    PassSearchData([]);
    setTimeout(() => {
      setResetForm(false);
    }, 100);
  };
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
            {({ values, setFieldValue }) => (
              <Form className="mt-3">
                <Row>
                  <CustomInputField
                    InputWidth="5%"
                    type="hidden"
                    name="teamPage"
                  />
                  <Col md={3}>
                    <CustomMultipleSelectField
                      name="c_source"
                      placeholder="Select Source"
                      options={CreateLabelValueArray(
                        AllCandidatesSource.data,
                        "candidate_source"
                      )}
                      isLabelValue={true}
                      FieldValue={setFieldValue}
                      values={values}
                      resetField={ResetForm}
                    />
                  </Col>
                  <Col md={3}>
                    <CustomMultipleSelectField
                      name="c_position"
                      placeholder="Select Position"
                      options={
                        CandidatesPostList.data?.length !== 0
                          ? CreateLabelValueArray(
                              CandidatesPostList.data,
                              "candidate_post"
                            )
                          : []
                      }
                      isLabelValue={true}
                      FieldValue={setFieldValue}
                      values={values}
                      resetField={ResetForm}
                    />
                  </Col>
                  <Col md={3}>
                    <CustomMultipleSelectField
                      name="c_status"
                      placeholder="Select Status"
                      options={
                        CandidatesStatusList.data?.length !== 0
                          ? CreateLabelValueArray(
                              CandidatesStatusList.data,
                              "candidate_status"
                            )
                          : []
                      }
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
                                  values.country.indexOf(row.countryCode) !== -1
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
                          ? CreateLabelValueArray(LocalityList.data, "locality")
                          : []
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
                  <div className="d-flex justify-content-between align-items-center">
                    <CustomInputField
                      InputWidth="35%"
                      type="text"
                      name="anytext"
                      placeholder="Enter custom text.,"
                    />
                    <div>
                      <LoadingButton
                        variant="contained"
                        type="submit"
                        loading={isLoading}
                        sx={{ mr: 2 }}
                      >
                        Search Candidate
                      </LoadingButton>
                      <LoadingButton
                        variant="contained"
                        type="button"
                        onClick={HandleResetForm}
                      >
                        Reset Search Default
                      </LoadingButton>
                    </div>
                  </div>
                </Row>
              </Form>
            )}
          </Formik>
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  );
};

export default CandidateAdvancedSearch;
