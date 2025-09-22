import React from "react";
import { useBootstrap, useMui, useSetting } from "../../hooks/Hooks";
import { Formik, Form } from "formik";
import "./BrokerAdvancedSearch.css";
import { CustomInputField } from "../FormUtility/FormUtility";
import { useSearchBroker } from "../../hooks/AdvancedSearch/BrokerAdvancedSearchHook";
import CryptoJS from "crypto-js";

const BrokerAdvancedSearch = ({
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
    location: previousSearchData ? previousSearchData.location : "",
    broker_date_from: "",
    broker_date_to: "",
    anytext: "",
    pageName: PassPageName,
  };
  const { mutate, isLoading } = useSearchBroker();

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
      previousScreen !== "viewbrokeretails" ||
      previousScreen !== "editbroker"
    ) {
      localStorage.removeItem("sotre_search_data");
    }
  }, []);

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
          <Formik initialValues={initialValues} onSubmit={HandleSubmit}>
            {({ values, setFieldValue, resetForm }) => (
              <Form className="mt-3">
                <Row className="mt-4">
                  <Col md={6} className="anytext-from-group">
                    <CustomInputField
                      InputWidth="100%"
                      type="text"
                      name="location"
                      placeholder="Enter Location"
                    />
                  </Col>
                  <Col md={6} className="anytext-from-group">
                    <CustomInputField
                      InputWidth="100%"
                      type="text"
                      name="anytext"
                      placeholder="Enter custom text."
                    />
                  </Col>
                </Row>
                {/* <Row className="mt-4">
                  <Col md={3} className="date-from-group">
                    <Typography variant="subtitle2" sx={{ fontWeight: "400" }}>
                      Broker Date From
                    </Typography>
                    <CustomInputField
                      InputWidth="100%"
                      type="date"
                      name="broker_date_from"
                      placeholder=""
                    />
                  </Col>
                  <Col md={3} className="date-from-group">
                    <Typography variant="subtitle2" sx={{ fontWeight: "400" }}>
                      Broker Date To
                    </Typography>
                    <CustomInputField
                      InputWidth="100%"
                      type="date"
                      name="broker_date_to"
                      placeholder=""
                    />
                  </Col>
                </Row> */}
                <Row className="mt-4">
                 
                  <Col md={6} className="advanced-search-footer-btn-grp">
                    <LoadingButton
                      variant="contained"
                      type="submit"
                      loading={isLoading}
                      sx={{ mr: 2 }}
                    >
                      Search Broker Details
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

export default BrokerAdvancedSearch;
