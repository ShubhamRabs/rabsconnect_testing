import React from "react";
import Breadcrumb from "../../components/Breadcrumb/Breadcrumb";
import { Form, Formik } from "formik";
import { useBootstrap, useMui } from "../../hooks/Hooks";
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
import { LoanFormSchema } from "../../schema/Loan/LoanFormSchema";
import { useQueryClient } from "react-query";
import { useAddLoan } from "../../hooks/Loan/UseLoanHook";

const AddLoan = ({ dispatch }) => {
  const { Card, Row } = useBootstrap();
  const { Divider, LoadingButton,ArrowBackIosIcon } = useMui();
  const queryClient = useQueryClient();

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

  const initialValues = {
    l_client_name: "",
    l_ccode: "",
    l_mob: null,
    l_project_name: "",
    l_booking_date: "",
    l_unit_details: "",
    l_bank_name: "",
    l_sales_manager: "",
    l_status: "",
    l_sanction_amount: "",
  };

  // Custom hook for adding a user
  const { mutate, isLoading } = useAddLoan();

  const HandleSubmit = async (values) => {
    try {
      // If module access is selected, call the add user mutation
      let data = [values];
      mutate(data, {
        onSuccess: (data) => {
          queryClient.invalidateQueries("SubMenuLoanCount");
          localStorage.setItem("successMessage", "Loan Details added successfully");
          dispatch({ event: "loandetails" });
        }
      });
    } catch (error) {
      console.error("Error in adding Loan", error);
    }
  };

  return (
    <>
      <Breadcrumb PageName="Add Loan" BackButton={[
        true,
        "Back",
        <ArrowBackIosIcon />,
        () =>
          dispatch({
            event:
              localStorage.getItem("previousScreen") ===
              localStorage.getItem("currScreen")
                ? "viewloan"
                : localStorage.getItem("previousScreen"),
          }),
      ]}/>
      <Formik
        initialValues={initialValues}
        validationSchema={LoanFormSchema}
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
                        setFieldValue("l_ccode", data.dialCode);
                        setFieldValue(
                          "l_mob",
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
                      Add Loan
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

export default AddLoan;
