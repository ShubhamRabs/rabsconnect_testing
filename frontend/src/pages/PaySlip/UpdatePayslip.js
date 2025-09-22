import React, { useEffect } from "react";
import CryptoJS from "crypto-js";
import { Form, Formik } from "formik";
import {
  CustomFormGroup,
  CustomInputField,
} from "../../components/FormUtility/FormUtility";
import { useBootstrap, useMui, useSetting } from "../../hooks/Hooks";
import "./../../assets/css/PaySlip.css";
import { getYearsData } from "./../../data/Addpayslipdata";
import { useQuery } from "react-query";
import { getAllUsers } from "../../hooks/Users/useAllUsersHook";
import { useState } from "react";
import { CreateLabelValueArray, numberToWords } from "../../hooks/Function";
import {
  GetPayslipById,
  useUpdatePayslip,
} from "../../hooks/PaySlip/UsePaySlip";
import Breadcrumb from "../../components/Breadcrumb/Breadcrumb";

const UpdatePayslip = ({ dispatch }) => {
  const { globalData } = useSetting();
  const { Card, Row, Col } = useBootstrap();
  const { Divider, LoadingButton, Button, ArrowBackIosIcon } = useMui();
  const [users, setUsers] = useState([]);

  const [ResetForm, setResetForm] = useState(false);
  const [fetchValues, setFetchValues] = useState({
    absent_days: "",
    med_leave: "",
    paid_leave: "",
    ac_no: "",
    bank_name: "",
    basic_pay: "",
    ccode: "",
    create_dt: "",
    department: "",
    designation: "",
    email: "",
    emp_name: "",
    forget_to_logout: "",
    full_days: "",
    gross_earnings: "",
    half_day: "",
    holidays: "",
    hra: "",
    incentive: "",
    join_date: "",
    location: "",
    medical_allowance: "",
    mob: "",
    net_pay_amount: "",
    net_pay_words: "",
    other_deduction: "",
    other_details: "",
    pan_no: "",
    pf_amount: "",
    pf_no: "",
    profession_tax: "",
    ps_id: "",
    sal_frm_date: "",
    sal_month: "",
    sal_to_date: "",
    sal_year: "",
    special_allowance: "",
    tds: "",
    ESIC: "",
    health_issues: "",
    religion: "",
    gender: "",
    mstatus: "",
    dob: "",
    aadhar_no: "",
    total_days: "",
    total_deductions: "",
    travel_allowance: "",
    u_id: "",
    update_dt: "",
    weekly_off: "",
    worked_days: "",
    working_days: "",
  });

  let CryptoJSKey = globalData.CompanyName + "@" + globalData.Version;
  const data = JSON.parse(
    CryptoJS.AES.decrypt(
      localStorage.getItem("updateglobal_userdata"),
      CryptoJSKey
    ).toString(CryptoJS.enc.Utf8)
  );

  const update = useUpdatePayslip();
  const yearData = getYearsData();
  const fetchDetails = useQuery("payslip", () => GetPayslipById(data.ps_id), {
    onSuccess: (data) => {
      console.log(data.data.data[0], "vlaue EDIDIIDIITTTT");
      if (data.data.length !== 0) {
        console.log(data.data.data, "HELOOLOOOOOOOO");
        setFetchValues({
          ps_id: data.data.data[0]?.ps_id,
          create_dt: data.data.data[0]?.create_dt,
          update_dt: data.data.data[0]?.update_dt,
          u_id: data.data.data[0]?.u_id,
          sal_frm_date: data.data.data[0]?.sal_frm_date,
          sal_to_date: data.data.data[0]?.sal_to_date,
          emp_name: data.data.data[0]?.emp_name,
          email: data.data.data[0]?.email,
          ccode: data.data.data[0]?.ccode,
          mob: data.data.data[0]?.mob,
          location: data.data.data[0]?.location,
          designation: data.data.data[0]?.designation,
          department: data.data.data[0]?.department || "General",
          join_date: data.data.data[0]?.join_date,
          total_days: data.data.data[0]?.total_days,
          working_days: data.data.data[0]?.working_days || 0,
          worked_days: data.data.data[0]?.worked_days,
          weekly_off: data.data.data[0]?.weekly_off,
          holidays: data.data.data[0]?.holidays,
          full_days: data.data.data[0]?.full_days,
          half_day: data.data.data[0]?.half_day,
          forget_to_logout: data.data.data[0]?.forget_to_logout,
          absent_days: data.data.data[0]?.absent_days,
          med_leave: data.data.data[0]?.med_leave,
          paid_leave: data.data.data[0]?.paid_leave,
          bank_name: data.data.data[0]?.bank_name,
          ac_no: data.data.data[0]?.ac_no,
          pf_no: data.data.data[0]?.pf_no,
          pan_no: data.data.data[0]?.pan_no,
          hra: data.data.data[0]?.hra,
          medical_allowance: data.data.data[0]?.medical_allowance,
          travel_allowance: data.data.data[0]?.travel_allowance,
          special_allowance: data.data.data[0]?.special_allowance,
          incentive: data.data.data[0]?.incentive,
          profession_tax: data.data.data[0]?.profession_tax,
          pf_amount: data.data.data[0]?.pf_amount,
          other_deduction: data.data.data[0]?.other_deduction,
          gross_earnings: data.data.data[0]?.gross_earnings,
          total_deductions: data.data.data[0]?.total_deductions,
          net_pay_amount: data.data.data[0]?.net_pay_amount,
          net_pay_words:
            data.data.data[0]?.net_pay_words ||
            numberToWords(data.data.data[0]?.net_pay_amount),
          other_details: data.data.data[0]?.other_details,
          tds: data.data.data[0]?.tds,
          ESIC: data.data.data[0]?.ESIC,
          late_mark: data.data.data[0]?.late_mark,
          r_email: data.data.data[0]?.r_email,
          health_issue: data.data.data[0]?.health_issue,
          religion: data.data.data[0]?.religion,
          gender: data.data.data[0]?.gender,
          mstatus: data.data.data[0]?.mstatus,
          dob: data.data.data[0]?.dob,
          aadhar_no: data.data.data[0]?.aadhar_no,
          bank_branch: data.data.data[0]?.bank_branch,
          ac_name: data.data.data[0]?.ac_name,
          ifsc_code: data.data.data[0]?.ifsc_code,
          basic_salary: data.data.data[0]?.basic_salary,
          loss_of_pay: data.data.data[0]?.loss_of_pay,
        });
      }
    },
  });
  console.log(fetchValues, "Initial Values Update");
  const empData = CreateLabelValueArray(users, "username", "username");
  const HandleSubmit = (values) => {
    const ps_id = data.ps_id;
    values.ps_id = ps_id;
    update.mutate(
      { ps_id, values },
      {
        onSuccess: (data) => {
          console.log(data, "success");
          dispatch({ event: "payslip" });
        },
      }
    );
    console.log(update, "update");
  };

  return (
    <div>
      <Breadcrumb
        PageName="Edit Payment Slip"
        BackButton={[
          true,
          "Back",
          <ArrowBackIosIcon />,
          () =>
            dispatch({
              event:
                localStorage.getItem("previousScreen") ===
                localStorage.getItem("currScreen")
                  ? "payslip"
                  : localStorage.getItem("previousScreen"),
            }),
        ]}
      />
      {!fetchDetails.isLoading ? (
        <Formik
          initialValues={fetchValues}
          enableReinitialize={true}
          onSubmit={HandleSubmit}
        >
          {({ values, setFieldValue, errors, getFieldProps }) => {
            return (
              <Form>
                <Card>
                  <Card.Body>
                    <Card.Title style={{ fontSize: "19px" }}>
                      {" "}
                      Fill Following Details :-{" "}
                    </Card.Title>

                    <Divider />
                    <Row className="my-3 align-items-center">
                      <CustomFormGroup
                        formlabel="Salary for the Month - Year"
                        star="*"
                        FormField={
                          <>
                            <Row>
                              <Col xs={6} md={6}>
                                <CustomInputField
                                  type="date"
                                  disabled={true}
                                  name="sal_frm_date"
                                  {...getFieldProps("sal_frm_date")}
                                  resetField={ResetForm}
                                />
                              </Col>

                              <Col xs={6} md={6}>
                                <CustomInputField
                                  type="date"
                                  disabled={true}
                                  name="sal_to_date"
                                  {...getFieldProps("sal_to_date")}
                                  resetField={ResetForm}
                                />
                              </Col>
                            </Row>
                          </>
                        }
                      />
                      <CustomFormGroup
                        formlabel="Employee"
                        star="*"
                        FormField={
                          <Col>
                            <CustomInputField
                              name="emp_name"
                              FieldValue={setFieldValue}
                              isLabelValue={true}
                              placeholder="Enter Your Name"
                            />
                          </Col>
                        }
                      />

                      <CustomFormGroup
                        formlabel="Mobile Number"
                        star="*"
                        FormField={
                          <CustomInputField
                            type="number"
                            name="mob"
                            FieldValue={setFieldValue}
                            isLabelValue={true}
                          />
                        }
                      />

                      <CustomFormGroup
                        formlabel="Email"
                        star="*"
                        FormField={
                          <CustomInputField
                            type="text"
                            name="email"
                            placeholder="Enter Email Id."
                          />
                        }
                      />

                      <CustomFormGroup
                        formlabel="Designation"
                        star="*"
                        FormField={
                          <CustomInputField
                            type="text"
                            name="designation"
                            placeholder="Enter Designation"
                          />
                        }
                      />
                      <CustomFormGroup
                        formlabel="Department"
                        star="*"
                        FormField={
                          <CustomInputField
                            type="text"
                            name="department"
                            placeholder="Enter Department"
                          />
                        }
                      />
                      <CustomFormGroup
                        formlabel="Location "
                        star="*"
                        FormField={
                          <CustomInputField
                            type="text"
                            name="location"
                            placeholder="Enter Locality"
                          />
                        }
                      />
                      <CustomFormGroup
                        formlabel="Join Date "
                        star="*"
                        FormField={
                          <CustomInputField type="date" name="join_date" />
                        }
                      />

                      <CustomFormGroup
                        formlabel="Aadhaar Number"
                        star="*"
                        FormField={
                          <CustomInputField
                            type="text"
                            name="aadhar_no"
                            placeholder="Enter Aadhaar Number"
                          />
                        }
                      />
                      <CustomFormGroup
                        formlabel="Pan No "
                        star="*"
                        FormField={
                          <CustomInputField
                            type="text"
                            name="pan_no"
                            placeholder="Enter Your PF Pan Number"
                          />
                        }
                      />

                      <CustomFormGroup
                        formlabel="Days Worked "
                        star="*"
                        FormField={
                          <Col xs={12} md={12}>
                            <CustomInputField
                              disabled={true}
                              type="number"
                              name="worked_days"
                              placeholder="Enter Days Worked"
                            />
                          </Col>
                        }
                      />
                      <CustomFormGroup
                        formlabel="Department"
                        star="*"
                        FormField={
                          <CustomInputField
                            disabled={true}
                            type="text"
                            name="department"
                            placeholder="Enter Your Department"
                            // value={values.emp_name == "" ? values.emp_name : empData.filter((val) => val.value == values.emp_name)[0].value}
                          />
                        }
                      />

                      <CustomFormGroup
                        formlabel="Working Days"
                        star="*"
                        FormField={
                          <CustomInputField
                            disabled={true}
                            type="text"
                            name="working_days"
                            placeholder="Enter Working Days"
                            // value={values.emp_name == "" ? values.emp_name : empData.filter((val) => val.value == values.emp_name)[0].value}
                          />
                        }
                      />
                      <CustomFormGroup
                        formlabel="Weekly Off"
                        star="*"
                        FormField={
                          <CustomInputField
                            disabled={true}
                            type="text"
                            name="weekly_off"
                            placeholder="Enter Weekly Off"
                            // value={values.emp_name == "" ? values.emp_name : empData.filter((val) => val.value == values.emp_name)[0].value}
                          />
                        }
                      />
                      <CustomFormGroup
                        formlabel="Holidays"
                        star="*"
                        FormField={
                          <CustomInputField
                            disabled={true}
                            type="text"
                            name="holidays"
                            placeholder="Enter Holidays"
                            // value={values.emp_name == "" ? values.emp_name : empData.filter((val) => val.value == values.emp_name)[0].value}
                          />
                        }
                      />
                      <CustomFormGroup
                        formlabel="Full Days"
                        star="*"
                        FormField={
                          <CustomInputField
                            disabled={true}
                            type="text"
                            name="full_days"
                            placeholder="Enter Full Days"
                            // value={values.emp_name == "" ? values.emp_name : empData.filter((val) => val.value == values.emp_name)[0].value}
                          />
                        }
                      />
                      <CustomFormGroup
                        formlabel="Half Days"
                        star="*"
                        FormField={
                          <CustomInputField
                            disabled={true}
                            type="text"
                            name="half_day"
                            placeholder="Enter Half Days"
                            // value={values.emp_name == "" ? values.emp_name : empData.filter((val) => val.value == values.emp_name)[0].value}
                          />
                        }
                      />
                      <CustomFormGroup
                        formlabel="Forget To Logout"
                        star="*"
                        FormField={
                          <CustomInputField
                            disabled={true}
                            type="text"
                            name="forget_to_logout"
                            placeholder="Enter forget to logout"
                            // value={values.emp_name == "" ? values.emp_name : empData.filter((val) => val.value == values.emp_name)[0].value}
                          />
                        }
                      />
                      <CustomFormGroup
                        formlabel="Absent Days"
                        star="*"
                        FormField={
                          <CustomInputField
                            disabled={true}
                            type="text"
                            name="absent_days"
                            placeholder="Enter Your Absent Days"
                          />
                        }
                      />
                      <CustomFormGroup
                        formlabel="Medical Leave"
                        star="*"
                        FormField={
                          <CustomInputField
                            disabled={true}
                            type="text"
                            name="med_leave"
                          />
                        }
                      />
                      <CustomFormGroup
                        formlabel="Paid Leave"
                        star="*"
                        FormField={
                          <CustomInputField
                            disabled={true}
                            type="text"
                            name="paid_leave"
                            placeholder="Enter Your Absent Days"
                          />
                        }
                      />
                    </Row>
                  </Card.Body>
                </Card>
                <Card className="my-3">
                  <Card.Body>
                    <Row className="my-3 align-items-center">
                      <Card.Title
                        style={{
                          fontSize: "19px",
                          position: "relative",
                          bottom: "15px",
                        }}
                      >
                        From The Account :-
                      </Card.Title>
                      <hr className="MuiDivider-root MuiDivider-fullWidth css-10mgopn-MuiDivider-root" />
                      <CustomFormGroup
                        formlabel="Bank Name"
                        star="*"
                        FormField={
                          <CustomInputField
                            type="text"
                            name="bank_name"
                            placeholder=" Enter Your Bank Name"
                          />
                        }
                      />
                      <CustomFormGroup
                        formlabel="Branch Name"
                        star="*"
                        FormField={
                          <CustomInputField
                            type="text"
                            name="bank_branch"
                            placeholder=" Enter Your Branch Name"
                          />
                        }
                      />
                    </Row>
                  </Card.Body>
                </Card>
                <Card className="my-3">
                  <Card.Body>
                    <Row className="my-3 align-items-center">
                      <Card.Title
                        style={{
                          fontSize: "19px",
                          position: "relative",
                          bottom: "15px",
                        }}
                      >
                        Earnings :-
                      </Card.Title>
                      <hr className="MuiDivider-root MuiDivider-fullWidth css-10mgopn-MuiDivider-root" />

                      <CustomFormGroup
                        formlabel="Basic Pay "
                        star="*"
                        FormField={
                          <Col xs={12} md={12}>
                            <CustomInputField
                              type="number"
                              name="basic_salary"
                              placeholder="Enter Basic Pay"
                            />
                          </Col>
                        }
                      />
                      <CustomFormGroup
                        formlabel="H.R.A"
                        star="*"
                        FormField={
                          <Col xs={12} md={12}>
                            <CustomInputField
                              type="number"
                              name="hra"
                              placeholder="Enter H.R.A "
                            />
                          </Col>
                        }
                      />

                      <CustomFormGroup
                        formlabel="Medical Allowance"
                        star="*"
                        FormField={
                          <Col xs={12} md={12}>
                            <CustomInputField
                              type="number"
                              name="medical_allowance"
                              placeholder="Enter Medical Allw "
                            />
                          </Col>
                        }
                      />

                      <CustomFormGroup
                        formlabel="Travel Allowance"
                        star="*"
                        FormField={
                          <Col xs={12} md={12}>
                            <CustomInputField
                              type="number"
                              name="travel_allowance"
                              placeholder="Enter Travel Allw "
                            />
                          </Col>
                        }
                      />

                      <CustomFormGroup
                        formlabel="Special Allowance"
                        star="*"
                        FormField={
                          <Col xs={12} md={12}>
                            <CustomInputField
                              type="number"
                              name="special_allowance"
                              placeholder="Enter Special Allw "
                            />
                          </Col>
                        }
                      />
                      <CustomFormGroup
                        formlabel="Incentive"
                        star="*"
                        FormField={
                          <Col xs={12} md={12}>
                            <CustomInputField
                              type="number"
                              name="incentive"
                              placeholder="Enter Incentive"
                            />
                          </Col>
                        }
                      />
                    </Row>
                  </Card.Body>
                </Card>

                <Card className="my-3">
                  <Card.Body>
                    <Row className="my-3 align-items-center">
                      <Card.Title
                        style={{
                          fontSize: "19px",
                          position: "relative",
                          bottom: "15px",
                        }}
                      >
                        Deductions :-
                      </Card.Title>
                      <hr className="MuiDivider-root MuiDivider-fullWidth css-10mgopn-MuiDivider-root" />
                      <CustomFormGroup
                        formlabel="Loss Of Pay"
                        star="*"
                        FormField={
                          <Col xs={12} md={12}>
                            <CustomInputField
                              type="number"
                              disabled={true}
                              name="loss_of_pay"
                              placeholder="Enter other deduction "
                            />
                          </Col>
                        }
                      />
                      <CustomFormGroup
                        formlabel="Professional Tax"
                        star="*"
                        FormField={
                          <Col xs={12} md={12}>
                            <CustomInputField
                              type="number"
                              name="profession_tax"
                              placeholder="Enter Professional tax"
                            />
                          </Col>
                        }
                      />
                      <CustomFormGroup
                        formlabel="PF Amount"
                        star="*"
                        FormField={
                          <Col xs={12} md={12}>
                            <CustomInputField
                              type="number"
                              name="pf_amount"
                              placeholder="Enter Provident fund"
                            />
                          </Col>
                        }
                      />

                      <CustomFormGroup
                        formlabel="TDS"
                        star="*"
                        FormField={
                          <Col xs={12} md={12}>
                            <CustomInputField
                              type="number"
                              name="tds"
                              placeholder="Enter TDS "
                            />
                          </Col>
                        }
                      />

                      <CustomFormGroup
                        formlabel="ESIC"
                        star="*"
                        FormField={
                          <Col xs={12} md={12}>
                            <CustomInputField
                              type="number"
                              name="ESIC"
                              placeholder="Enter ESIC "
                            />
                          </Col>
                        }
                      />
                      <CustomFormGroup
                        formlabel="other_deduction"
                        star="*"
                        FormField={
                          <Col xs={12} md={12}>
                            <CustomInputField
                              type="number"
                              name="other_deduction"
                              placeholder="Enter Other Deduction "
                            />
                          </Col>
                        }
                      />
                    </Row>
                  </Card.Body>
                </Card>

                <Card className="my-3">
                  <Card.Body>
                    <Row className="my-3 align-items-center">
                      <Card.Title
                        style={{
                          fontSize: "19px",
                          position: "relative",
                          bottom: "15px",
                        }}
                      >
                        Total :-
                      </Card.Title>
                      <hr className="MuiDivider-root MuiDivider-fullWidth css-10mgopn-MuiDivider-root" />

                      <CustomFormGroup
                        formlabel="Gross Earnings"
                        star="*"
                        FormField={
                          <CustomInputField
                            type="text"
                            disabled={true}
                            name="gross_earnings"
                            placeholder="Enter Gross Earnings"
                          />
                        }
                      />

                      <CustomFormGroup
                        formlabel="Total Deductions"
                        star="*"
                        FormField={
                          <CustomInputField
                            type="text"
                            disabled={true}
                            name="total_deductions"
                            placeholder="Enter Total Deductions"
                          />
                        }
                      />

                      <CustomFormGroup
                        formlabel="Net Pay"
                        star="*"
                        FormField={
                          <CustomInputField
                            type="text"
                            disabled={true}
                            name="net_pay_amount"
                            placeholder="Enter Net Pay "
                          />
                        }
                      />

                      <div
                        style={{
                          width: "100%",
                          padding: "15px",
                          backgroundColor: "#ffffff",
                          borderRadius: "6px",
                          textAlign: "center",
                          maxWidth: "600px",

                          boxShadow: "0 2px 6px rgba(0, 0, 0, 0.08)",
                        }}
                      >
                        <strong style={{ fontSize: "16px", color: "#333" }}>
                          Amount in Words:
                        </strong>
                        <span
                          style={{
                            marginLeft: "8px",
                            fontSize: "16px",
                            color: "#555",
                          }}
                        >
                          {values.net_pay_words || "N/A"}
                        </span>
                      </div>

                      {/* <CustomFormGroup
                        formlabel="Net Pay(In words)"
                        star="*"
                        FormField={
                          <CustomInputField
                            type="text"
                            name="net_pay_words"
                            placeholder="Net Pay In Words"
                          />
                        }
                      /> */}
                    </Row>
                    {/* <Row className="my-3 align-items-center">
                      <Col xs={12} md={2}>
                        <h3 className="custom-form-label">Other Details</h3>
                      </Col>
                      <Col xs={12} md={10}>
                        <CustomTextareaField
                          name="other_details"
                          placeholder="Enter Other Details....."
                        />
                      </Col>
                    </Row> */}

                    <div className="text-left">
                      <LoadingButton
                        type="submit"
                        variant="contained"
                        // loading={isLoading}
                      >
                        Update
                      </LoadingButton>
                    </div>
                  </Card.Body>
                </Card>
                <CalculateFields
                  values={values}
                  setFieldValue={setFieldValue}
                />
              </Form>
            );
          }}
        </Formik>
      ) : (
        <>loading</>
      )}
    </div>
  );
};

const CalculateFields = ({ values, setFieldValue }) => {
  useEffect(() => {
    const calculateGrossEarnings = () => {
      return Math.round(
        Number(values.basic_salary || 0) +
          Number(values.hra || 0) +
          Number(values.medical_allowance || 0) +
          Number(values.travel_allowance || 0) +
          Number(values.special_allowance || 0) +
          Number(values.incentive || 0)
      );
    };

    const calculateLossOfPay = () => {
      const basicSalary = Number(values.basic_salary || 0);
      const workingDays = Number(values.working_days || 0);

      // Calculate total absent days
      const absentDays = Number(values.absent_days || 0);

      return workingDays > 0
        ? Math.round((basicSalary / workingDays) * Math.max(0, absentDays))
        : 0;
    };

    const calculateTotalDeductions = () => {
      return Math.round(
        Number(values.profession_tax || 0) +
          Number(values.pf_amount || 0) +
          Number(values.tds || 0) +
          Number(values.ESIC || 0) +
          Number(values.other_deduction || 0) +
          calculateLossOfPay()
      );
    };

    const calculateNetPayAmount = () => {
      const grossEarnings = calculateGrossEarnings();
      const totalDeductions = calculateTotalDeductions();
      return Math.round(grossEarnings - totalDeductions);
    };

    const updateCalculatedFields = () => {
      const grossEarnings = calculateGrossEarnings();
      const totalDeductions = calculateTotalDeductions();
      const netPayAmount = calculateNetPayAmount();
      const lossOfPay = calculateLossOfPay();

      // Only adjust worked days without med_leave and paid_leave
      const adjustedWorkedDays = Number(values.worked_days || 0);

      const netPayWords = numberToWords(netPayAmount);

      setFieldValue("gross_earnings", grossEarnings);
      setFieldValue("total_deductions", totalDeductions);
      setFieldValue("net_pay_amount", netPayAmount);
      setFieldValue("loss_of_pay", lossOfPay);
      setFieldValue("worked_days", adjustedWorkedDays); // Update worked days
      setFieldValue("net_pay_words", netPayWords);
    };

    // Trigger recalculation on value change
    updateCalculatedFields();
  }, [
    values.basic_salary,
    values.hra,
    values.medical_allowance,
    values.travel_allowance,
    values.special_allowance,
    values.incentive,
    values.profession_tax,
    values.pf_amount,
    values.tds,
    values.ESIC,
    values.other_deduction,
    values.absent_days,
    values.working_days,
    setFieldValue,
  ]);

  return null;
};

export default UpdatePayslip;
