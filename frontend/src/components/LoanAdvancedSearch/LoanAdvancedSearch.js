import React from "react";
import { useBootstrap, useMui, useSetting } from "../../hooks/Hooks";
import { Formik, Form } from "formik";
import "./LoanAdvancedSearch.css";
import {
  CustomInputField,
  CustomMultipleSelectField,
} from "../FormUtility/FormUtility";
import { useQuery } from "react-query";
import { CreateLabelValueArray } from "../../hooks/Function"
import { GetAllProjectName } from "./../../hooks/DynamicFields/useProjectNameHook";
import { GetAllLoanSalesManager } from "./../../hooks/DynamicFields/useLoanSalesManagerHook";
import { GetAllLoanStatus } from "../../hooks/DynamicFields/UseLoanStatusHook";
import { useSearchLoan } from "../../hooks/AdvancedSearch/LoanAdvancedSearchHook";
import CryptoJS from "crypto-js";

const LoanAdvancedSearch = ({
  PassSearchData,
  PassPageName,
  page,
  pageSize,
  dispatch,
}) => {
  const { Accordion, Row, Col } = useBootstrap();
  const { LoadingButton, Typography } = useMui();
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
    project_name: previousSearchData ? previousSearchData.project_name : "",
    bank_name: previousSearchData ? previousSearchData.bank_name : "",
    sales_manager: previousSearchData ? previousSearchData.sales_manager : "",
    status: previousSearchData ? previousSearchData.status : "",
    loan_date_from: "",
    loan_date_to: "",
    booking_date_from: "",
    booking_date_to: "",
    anytext: "",
    pageName: PassPageName,
  };
  const { mutate, isLoading } = useSearchLoan();

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
      previousScreen !== "viewloanetails" ||
      previousScreen !== "editlloan"
    ) {
      localStorage.removeItem("sotre_search_data");
    }
  }, []);

  const GetAllProjectNameData = useQuery("GetAllProjectNameData", () => {
    return GetAllProjectName(["pname"]);
  });

  const GetAllLoanSalesManagerData = useQuery("GetAllLoanSalesManagerData", () => {
    return GetAllLoanSalesManager(["bank_name"]);
  });
  
  const uniqueBankNamesSet = new Set(
    GetAllLoanSalesManagerData.data?.map((row) => row.bank_name) || []
  );
  
  const uniqueBankNames = Array.from(uniqueBankNamesSet).map((bankName) => ({
    value: bankName,
    label: bankName,
  }));
  
  const GetAllLoanStatusData = useQuery("GetAllLoanStatusData", () => {
    return GetAllLoanStatus(["loan_status"]);
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
            // validationSchema={validationSchema}
            onSubmit={HandleSubmit}
          >
            {({ values, setFieldValue, resetForm }) => (
              <Form className="mt-3">
                <Row>
                  <Col md={3}>
                    <CustomMultipleSelectField
                      name="project_name"
                      placeholder="Select Project Name"
                      options={
                        GetAllProjectNameData.data?.length !== 0
                          ? CreateLabelValueArray(
                            GetAllProjectNameData.data,
                              "pname"
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
                      name="bank_name"
                      placeholder="Select Bank Name"
                      options={
                        uniqueBankNames?.length !== 0
                          ? CreateLabelValueArray(
                            uniqueBankNames,
                              "label"
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
                      name="sales_manager"
                      placeholder="Select Sales Manager"
                      options={
                        GetAllLoanSalesManagerData.data?.length !== 0
                        ?
                        CreateLabelValueArray(
                        GetAllLoanSalesManagerData.data 
                        ?
                        GetAllLoanSalesManagerData.data.filter(
                          (manager) => values.bank_name.includes(manager.bank_name)
                        ) : [],
                        "sales_manager"
                        ): []
                      }
                      isLabelValue={true}
                      FieldValue={setFieldValue}
                      values={values}
                      resetField={ResetForm}
                    />
                  </Col>
                  <Col md={3}>
                    <CustomMultipleSelectField
                      name="status"
                      placeholder="Select Status"
                      options={
                        GetAllLoanStatusData.data?.length !== 0
                          ? CreateLabelValueArray(
                            GetAllLoanStatusData.data,
                              "loan_status"
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
                  <Col md={3} className="date-from-group">
                    <Typography variant="subtitle2" sx={{ fontWeight: "400" }}>
                      Loan Date From
                    </Typography>
                    <CustomInputField
                      InputWidth="100%"
                      type="date"
                      name="loan_date_from"
                      placeholder=""
                    />
                  </Col>
                  <Col md={3} className="date-from-group">
                    <Typography variant="subtitle2" sx={{ fontWeight: "400" }}>
                      Loan Date To
                    </Typography>
                    <CustomInputField
                      InputWidth="100%"
                      type="date"
                      name="loan_date_to"
                      placeholder=""
                    />
                  </Col>
                  <Col md={3} className="date-from-group">
                    <Typography variant="subtitle2" sx={{ fontWeight: "400" }}>
                      Booking Date From
                    </Typography>
                    <CustomInputField
                      InputWidth="100%"
                      type="date"
                      name="booking_date_from"
                      placeholder=""
                    />
                  </Col>
                  <Col md={3} className="date-from-group">
                    <Typography variant="subtitle2" sx={{ fontWeight: "400" }}>
                      Booking Date To
                    </Typography>
                    <CustomInputField
                      InputWidth="100%"
                      type="date"
                      name="booking_date_to"
                      placeholder=""
                    />
                  </Col>
                </Row>
                <Row className="mt-4">
                  <Col md={6} className="anytext-from-group">
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
                      Search Loan Details
                    </LoadingButton>
                    <LoadingButton
                        variant="contained"
                        type="button"
                        onClick={HandleResetForm}
                      >
                      Reset Search Default
                    </LoadingButton>
                  </Col>
                </Row>
              </Form>
            )}
          </Formik>
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  );
};

export default LoanAdvancedSearch;
