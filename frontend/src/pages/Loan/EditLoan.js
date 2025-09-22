
import React from "react";
import Breadcrumb from "../../components/Breadcrumb/Breadcrumb";
import { Form, Formik } from "formik";
import CryptoJS from "crypto-js";
import { useBootstrap, useMui, useSetting } from "../../hooks/Hooks";
import {
  CustomFormGroup,
  CustomInputField,
  CustomMobileFiled,
  CustomSelectField,
} from "../../components/FormUtility/FormUtility";
import { Ccode } from "../../data/LeadData";
import { CreateLabelValueArray, numberToWords } from "../../hooks/Function";
import { useQuery } from "react-query";
import { GetAllProjectName } from "./../../hooks/DynamicFields/useProjectNameHook";
import { GetAllLoanSalesManager } from "./../../hooks/DynamicFields/useLoanSalesManagerHook";
import { GetAllLoanStatus } from "../../hooks/DynamicFields/UseLoanStatusHook";
// import { LoanFormSchema } from "../../schema/Loan/LoanFormSchema";
import { useEditLoan } from "../../hooks/Loan/UseLoanHook";

const EditLoan = ({ dispatch }) => {
  const { Card, Row } = useBootstrap();
  const { Divider, LoadingButton, ArrowBackIosIcon } = useMui();
  const { globalData } = useSetting();
  // Decrypt user data from localStorage
  let CryptoJSKey = globalData.CompanyName + "@" + globalData.Version;

  const bytes = CryptoJS.AES.decrypt(
    localStorage.getItem("updateglobal_userdata"),
    CryptoJSKey
  );

  var user_data = bytes.toString(CryptoJS.enc.Utf8);
  // Parse the decrypted user data as JSON
  let LoanDetails = JSON.parse(user_data);
  // State to manage and validate contact information
  const [ContactValidation, setContactValidation] = React.useState({
    l_ccode: LoanDetails.ccode,
    l_mob: LoanDetails.mob,
  });
  // Initial form values based on candidate data
  const initialValues = {
    l_loan_id: LoanDetails.loan_id,
    l_client_name: LoanDetails.client_name,
    l_project_name: LoanDetails.project_name,
    l_booking_date: LoanDetails.booking_date,
    l_unit_details: LoanDetails.unit_details,
    l_bank_name: LoanDetails.bank_name,
    l_sales_manager: LoanDetails.sales_manager,
    l_status: LoanDetails.status,
    l_sanction_amount: LoanDetails.sanction_amount,
  };

  const GetAllProjectNameDropDown = useQuery("GetAllProjectNameDropDown", () => {
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

  const GetAllLoanStatusDropDown = useQuery("GetAllLoanStatusDropDown", () => {
    return GetAllLoanStatus(["loan_status"]);
  });

  // Custom hook for adding a user
  const { mutate, isLoading } = useEditLoan();

  // Function to handle form submission
  const HandleSubmit = (values) => {
    // Combine form values and contact validation data for mutation
    let data = [values, ContactValidation];
    mutate(data, {
      onSuccess: (data) => {
        localStorage.setItem("successMessage", data.data);
        dispatch({
          event:
            localStorage.getItem("previousScreen") ===
            localStorage.getItem("currScreen")
              ? "loandetails"
              : localStorage.getItem("previousScreen"),
        });
      },
    });
  };

  return (
    <>
      <Breadcrumb PageName="Edit Loan" 
      BackButton={[
        true,
        "Back",
        <ArrowBackIosIcon />,
        () =>
          dispatch({
            event:
              localStorage.getItem("previousScreen") ===
              localStorage.getItem("currScreen")
                ? "loandetails"
                : localStorage.getItem("previousScreen"),
          }),
      ]}
      />
      <Formik
        initialValues={initialValues}
        // validationSchema={LoanFormSchema}
        onSubmit={HandleSubmit}
      >
        {({ values, setFieldValue }) => (
          <Form>
            <Card>
              <Card.Body>
                <Card.Title>Loan Details :-</Card.Title>
                <Divider />
                <Row className="my-3 align-items-center">
                  <CustomFormGroup
                    formlabel="Client Name"
                    star="*"
                    FormField={
                      <CustomInputField
                        type="text"
                        name="l_client_name"
                        placeholder="Enter Client Name"
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
                        setContactValidation({
                            ...ContactValidation,
                            l_ccode: data.dialCode,
                            l_mob: value.slice(data.dialCode.length),
                        })
                      }
                    }
                    options={Ccode}
                    defaultVal={
                        ContactValidation.l_ccode + " " + ContactValidation.l_mob
                    }
                  />
                  <CustomFormGroup
                    style={{ marginTop: "20px" }}
                    formlabel="Project Name"
                    star="*"
                    FormField={
                      <CustomSelectField
                        name="l_project_name"
                        FieldValue={setFieldValue}
                        placeholder="Select Project Name"
                        options={CreateLabelValueArray(
                          GetAllProjectNameDropDown?.data,
                          "pname"
                        )}
                        isLabelValue={true}
                        required
                        initialValue={{
                            label: initialValues.l_project_name,
                            value: initialValues.l_project_name,
                        }}
                      />
                    }
                  />
                  <CustomFormGroup
                    formlabel="Date of Booking"
                    star="*"
                    FormField={
                      <CustomInputField
                        type="date"
                        name="l_booking_date"
                        placeholder="Enter Booking Date"
                      />
                    }
                  />
                  <CustomFormGroup
                    formlabel="Unit Details"
                    star="*"
                    FormField={
                      <CustomInputField
                        type="text"
                        name="l_unit_details"
                        placeholder="Enter Unit Details"
                      />
                    }
                  />
                  <CustomFormGroup
                    style={{ marginTop: "20px" }}
                    formlabel="Bank Name"
                    star="*"
                    FormField={
                      <CustomSelectField
                        name="l_bank_name"
                        FieldValue={setFieldValue}
                        placeholder="Select Bank Name"
                        options={CreateLabelValueArray(
                          uniqueBankNames,
                          "label",
                        )}
                        isLabelValue={true}
                        required
                        initialValue={{
                            label: initialValues.l_bank_name,
                            value: initialValues.l_bank_name,
                        }}
                      />
                    }
                  />
                  <CustomFormGroup
                    style={{ marginTop: "20px" }}
                    formlabel="Sales Manager"
                    star="*"
                    FormField={
                      <CustomSelectField
                        name="l_sales_manager"
                        FieldValue={setFieldValue}
                        placeholder="Select Sales Manager"
                        options={CreateLabelValueArray(
                          GetAllLoanSalesManagerData.data 
                          ?
                          GetAllLoanSalesManagerData.data.filter(
                            (manager) => manager.bank_name === values.l_bank_name
                          ) : [],
                          "sales_manager"
                        )}
                        isLabelValue={true}
                        required
                        initialValue={{
                            label: initialValues.l_sales_manager,
                            value: initialValues.l_sales_manager,
                        }}
                      />
                    }
                  />
                  <CustomFormGroup
                    formlabel="Loan Status"
                    star="*"
                    FormField={
                      <CustomSelectField
                        name="l_status"
                        FieldValue={setFieldValue}
                        placeholder="Select Loan Status"
                        options={CreateLabelValueArray(
                          GetAllLoanStatusDropDown?.data,
                          "loan_status"
                        )}
                        isLabelValue={true}
                        required
                        initialValue={{
                            label: initialValues.l_status,
                            value: initialValues.l_status,
                        }}
                      />
                    }
                  />
                  <CustomFormGroup
                    formlabel="Sanction Amount"
                    star="*"
                    FormField={
                      <CustomInputField
                        type="number"
                        name="l_sanction_amount"
                        placeholder="Enter Sanction Amount"
                      />
                    }
                  />
                  <p className="number-in-word m-0" style={{ paddingLeft:"18%" }}>
                      {numberToWords(values.l_sanction_amount)}
                  </p>
                </Row>
                <Row className="mt-3 align-items-center">
                  <div className="text-left mt-3">
                    <LoadingButton
                      type="submit"
                      variant="contained"
                      loading={isLoading}
                    >
                      Edit Loan
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

export default EditLoan;
