import React from "react";
import Breadcrumb from "../../components/Breadcrumb/Breadcrumb";
import { useBootstrap, useMui, useSetting } from "../../hooks/Hooks";
import { Form, Formik } from "formik";
import { GetAllCRMDetails } from "../../hooks/Other/UseCRMDetailsHook";
import { useQuery } from "react-query";
import "../../assets/css/AddInvoice.css";
import {
  CustomDescription,
  CustomHeading,
  CustomSubTitle,
} from "../../components/Common/Common";
import {
  CustomFormGroup,
  CustomInputField,
  CustomTextareaField,
  CustomSelectField,
} from "../../components/FormUtility/FormUtility";
import {
  configuration,
  bankaccount,
  invoicetodata,
} from "./../../data/AddInvoicedata";
import CryptoJS from "crypto-js";
import {
  useEditInvoice,
  GetAllBookingDone,
  GetAllBankName,
} from "../../hooks/Invoice/UseInvoiceHook";
import { CreateLabelValueArray, numberToWords } from "./../../hooks/Function";

const EditInvoice = ({ dispatch }) => {
  const { Card, Row, Col } = useBootstrap();
  const { ArrowBackIosIcon, Button, LoadingButton } = useMui();
  const { globalData } = useSetting();

  // Decrypt user data from localStorage
  let CryptoJSKey = globalData.CompanyName + "@" + globalData.Version;

  const bytes = CryptoJS.AES.decrypt(
    localStorage.getItem("updateglobal_userdata"),
    CryptoJSKey
  );

  var user_data = bytes.toString(CryptoJS.enc.Utf8);

  let invoiceDetails = JSON.parse(user_data);

  // console.log(invoiceDetails);

  const CompanyAdress = useQuery("CompanyAdress", GetAllCRMDetails, {
    onSuccess: (data) => {
      // console.log(data.data[0].admin);
    },
  });

  const allBankName = useQuery("AllBankName", () => {
    return GetAllBankName(["bank_name, bank_id"]);
  });

  const item = [
    { title: "Broker Details", md: 3 },
    { title: "Base Value", md: 3 },
    { title: "Brok.(%)", md: 2 },
    { title: "Total ", md: 4 },
  ];

  // console.log(invoiceDetails);

  //
  const [listitems, setListitems] = React.useState([
    {
      configuration: invoiceDetails.configuration,
      // description: "",
      cost: invoiceDetails.base_value,
      quantity: invoiceDetails.brok,
    },
  ]);

  const [totalBeforeTax, setTotalBeforeTax] = React.useState("");
  const [totalAmountWithTax, settotalAmountWithTax] = React.useState("");

  const handleAddItem = () => {
    const newItem = [
      {
        // configuration: "",
        // description: "",
        // cost: "",
        // quantity: "",
      },
    ];
    setListitems([...listitems, newItem]);
  };

  // Inside the handleNum1Change function
  const handleNum1Change = (index, e) => {
    const value = parseInt(e.target.value);
    const updatedFields = [...listitems];
    updatedFields[index].quantity = value;
    updatedFields[index].total = calculateTotal(updatedFields[index]); // Calculate total cost
    setListitems(updatedFields);
  };

  // Inside the handleNum2Change function
  const handleNum2Change = (index, e) => {
    const value = parseInt(e.target.value);
    const updatedFields = [...listitems];
    updatedFields[index].cost = value;
    updatedFields[index].total = calculateTotal(updatedFields[index]); // Calculate total cost
    setListitems(updatedFields);
  };

  // Calculate total cost for an item
  const calculateTotal = (listitems) => {
    const baseValue = parseFloat(listitems.cost);
    const brokeragePercentage = parseFloat(listitems.quantity) / 100;
    const brokerageAmount = baseValue * brokeragePercentage;
    const totalBeforeTax = baseValue + brokerageAmount;

    setTotalBeforeTax(totalBeforeTax.toFixed(2));

    const sgst = totalBeforeTax * 0.09; // Calculating SGST (9%)
    const cgst = totalBeforeTax * 0.09; // Calculating CGST (9%)
    const totalAmount = totalBeforeTax + sgst + cgst; // Adding SGST and CGST to the total before tax

    settotalAmountWithTax(totalAmount.toFixed(2));

    return totalBeforeTax.toFixed(2);
  };

  //handledelete
  const handleDeleteItem = (index) => {
    const updatedListItems = [...listitems];
    updatedListItems.splice(index, 1);
    setListitems(updatedListItems);
  };

  // editinvoice

  const [ContactValidation, setContactValidation] = React.useState({
    // b_mob: invoiceDetails.mob,
  });
  const initialValues = {
    inv_id: invoiceDetails.inv_id,
    inv_date: invoiceDetails.inv_date,
    due_date: invoiceDetails.due_date,
    inv_to: invoiceDetails.inv_to,
    bank_name: invoiceDetails.bank_name,
    // items: invoiceDetails.listitems,
    items: listitems,
    buildingnum: invoiceDetails.buildingnum,
    flatnum: invoiceDetails.flatnum,
    note: invoiceDetails.description,
    payment_status: invoiceDetails.payment_status,
    partially_amount: invoiceDetails.partially_amount,
    billto_companyname: invoiceDetails.billto_companyname,
    billto_companyaddress: invoiceDetails.billto_companyaddress,
    billto_companypan: invoiceDetails.billto_companypan,
    billto_companygstnum: invoiceDetails.billto_companygstnum,
    supplier_companypannum: invoiceDetails.supplier_companypannum,
    supplier_companygstnum: invoiceDetails.supplier_companygstnum,
    supplier_companyreranum: invoiceDetails.supplier_companyreranum,
  };

  // console.log(initialValues.items[0].configuration);
  console.log(initialValues.inv_id);
  console.log(initialValues.due_date);
  console.log(invoiceDetails.billto_companyname);
  // Custom hook for adding a user
  const { mutate, isLoading } = useEditInvoice();
  // Function to handle form submission
  const HandleSubmit = (values) => {
    // Combine form values and contact validation data for mutation
    let data = [values, listitems, totalAmountWithTax];

    console.log(data);
    mutate(data, {
      onSuccess: (data) => {
        dispatch({ event: "invoicedetails" });
      },
    });
  };

  const allBookingDone = useQuery("AllBookingDone", () => {
    return GetAllBookingDone(["lname, l_id"]);
  });
  return (
    <>
      <Breadcrumb
        PageName="Edit Invoice"
        BackButton={[
          true,
          "Back",
          <ArrowBackIosIcon />,
          () =>
            dispatch({
              event: "invoicedetails",
            }),
        ]}
      />
      <Formik
        initialValues={initialValues}
        // validationSchema={Schema}
        onSubmit={HandleSubmit}
      >
        {({ values, setFieldValue }) => (
          <Form>
            <Row>
              <Col md={9} lg={9} sm={12}>
                <Card>
                  <Card.Body>
                    <Row className="m-sm-2 m-0">
                      <Col md={6}>
                        <img
                          src="./logo.png"
                          className="w-50 mb-3"
                          alt="Logo"
                          style={{ width: "40%" }}
                        />
                        <CustomDescription
                          style={{ fontSize: "16px" }}
                          Description={
                            CompanyAdress.data?.data[0].company_address
                          }
                        />
                      </Col>
                      <Col className="add-invoice-billto">
                        <div
                          className="d-flex"
                          style={{ alignItems: "baseline" }}
                        >
                          <CustomHeading Heading="Invoice :" />
                          <CustomInputField
                            type="text"
                            // value="#98698"
                            name="inv_id"
                            InputWidth="160px"
                            placeholder={initialValues.inv_id}
                            style={{ marginLeft: "52px" }}
                            // initialValue={{
                            //   label: initialValues.inv_id,
                            //   value: initialValues.inv_id,
                            // }}
                            disable
                          />
                        </div>
                        <div
                          className="d-flex"
                          style={{ alignItems: "baseline" }}
                        >
                          <CustomHeading Heading="Date Issued :" />
                          <CustomInputField
                            type="date"
                            // value={currentDateFormatted}
                            name="inv_date"
                            InputWidth="160px"
                            value={initialValues.inv_date}
                            style={{ marginLeft: "15px" }}
                          />
                        </div>
                        <div
                          className="d-flex"
                          style={{ alignItems: "baseline" }}
                        >
                          <CustomHeading Heading="Due Date :" />
                          <CustomInputField
                            type="date"
                            name="due_date"
                            InputWidth="160px"
                            value={initialValues.due_date}
                            style={{ marginLeft: "37px" }}
                          />
                        </div>
                      </Col>
                    </Row>
                    <Row className="border-top">
                      <Col md={6} lg={6} sm={6}>
                        <CustomHeading
                          Heading="Bill To :"
                          style={{ margin: "1.5rem 0rem" }}
                        />
                        <CustomFormGroup
                          md={12}
                          formlabel="Company Name"
                          FormField={
                            <CustomInputField
                              type="text"
                              name="billto_companyname"
                              // value={initialValues.billto_companyname}
                              // placeholder={initialValues.billto_companyname}
                            />
                          }
                        />
                        <CustomFormGroup
                          md={12}
                          formlabel="Address"
                          FormField={
                            <CustomInputField
                              type="text"
                              name="billto_companyaddress"
                              // value={initialValues.billto_companyaddress}
                              // placeholder="Enter Company Address"
                            />
                          }
                        />
                        <CustomFormGroup
                          md={12}
                          formlabel="PAN Number "
                          FormField={
                            <CustomInputField
                              type="text"
                              name="billto_companypan"
                              // value={initialValues.billto_companypan}
                              // placeholder="Enter PAN Number"
                            />
                          }
                        />
                        <CustomFormGroup
                          md={12}
                          formlabel="GST Number"
                          FormField={
                            <CustomInputField
                              type="text"
                              name="billto_companygstnum"
                              // value={initialValues.billto_companygstnum}
                              // placeholder="Enter GST Number"
                            />
                          }
                        />
                      </Col>
                      <Col md={6} lg={6} sm={6}>
                        <CustomHeading
                          Heading="Bill Form :"
                          style={{ margin: "1.5rem 0rem" }}
                        />
                        <CustomFormGroup
                          md={12}
                          formlabel="CP Name"
                          FormField={
                            <CustomInputField
                              type="text"
                              name="supplier_companyname"
                              // placeholder="Enter Company Name"
                              value={CompanyAdress.data?.data[0].company_name}
                              // disabled
                            />
                          }
                        />
                        <CustomFormGroup
                          md={12}
                          formlabel="Address"
                          FormField={
                            <CustomInputField
                              type="text"
                              name="supplier_companyaddress"
                              // placeholder="Enter Company Address"
                              value={
                                CompanyAdress.data?.data[0].company_address
                              }
                              // disabled
                            />
                          }
                        />
                        <CustomFormGroup
                          md={12}
                          formlabel="PAN Number "
                          FormField={
                            <CustomInputField
                              type="text"
                              name="supplier_companypannum"
                              // value={initialValues.supplier_companypannum}
                              // placeholder="Enter PAN Number"
                            />
                          }
                        />
                        <CustomFormGroup
                          md={12}
                          formlabel="GST Number"
                          FormField={
                            <CustomInputField
                              type="text"
                              name="supplier_companygstnum"
                              // value={initialValues.supplier_companygstnum}
                              // placeholder="Enter GST Number"
                            />
                          }
                        />
                        <CustomFormGroup
                          md={12}
                          formlabel="RERA Number"
                          FormField={
                            <CustomInputField
                              type="text"
                              name="supplier_companyreranum"
                              // value={initialValues.supplier_companyreranum}
                              // placeholder="Enter RERA Number"
                            />
                          }
                        />
                      </Col>
                    </Row>
                    <br />
                    <Row className="border-top" style={{ padding: "1.5rem" }}>
                      {/* <div className="border-top"> */}
                      {listitems.map((listItems, index) => (
                        <div className="m-sm-3 m-0" key={listitems.id}>
                          <div className="addnvoice-heading">
                            <Row>
                              {item.map(({ title, md }, index) => (
                                <Col key={index} md={md} xs={12}>
                                  <CustomSubTitle SubTitle={title} />
                                </Col>
                              ))}
                            </Row>
                          </div>
                          <div className="addnvoice-box" key={listitems.id}>
                            <Row>
                              <Col md={3} xs={12}>
                                {/* <CustomHeading
                                  Heading="Invoice To :"
                                  style={{ marginBottom: "1.5rem" }}
                                /> */}
                                {/* <div className="" style={{ width: "75%" }}> */}
                                <CustomSelectField
                                  name="inv_to"
                                  FieldValue={setFieldValue}
                                  placeholder="Lead Name"
                                  options={CreateLabelValueArray(
                                    allBookingDone?.data?.data,
                                    "lname"
                                  )}
                                  isLabelValue={true}
                                  required
                                  // value={invoiceDetails.inv_to}
                                />

                                {values.inv_to && (
                                  <div>
                                    {allBookingDone?.data?.data.map(
                                      (resident) => {
                                        if (resident.lname === values.inv_to) {
                                          return (
                                            <React.Fragment key={resident.l_id}>
                                              <CustomDescription
                                                style={{
                                                  paddingTop: "10px",
                                                  marginBottom: "4px",
                                                  fontSize: "1rem",
                                                }}
                                                Description={resident.lname}
                                              />
                                              <CustomDescription
                                                style={{
                                                  marginBottom: "4px",
                                                  fontSize: "1rem",
                                                }}
                                                Description={resident.pname}
                                              />
                                              <CustomDescription
                                                style={{
                                                  marginBottom: "4px",
                                                  fontSize: "1rem",
                                                }}
                                                Description={`${resident.p_ccode} ${resident.p_mob}`}
                                              />
                                              <CustomDescription
                                                style={{
                                                  marginBottom: "4px",
                                                  fontSize: "1rem",
                                                }}
                                                Description={resident.p_email}
                                              />
                                            </React.Fragment>
                                          );
                                        }
                                        return null;
                                      }
                                    )}
                                  </div>
                                )}
                                <CustomInputField
                                  type="text"
                                  name="buildingnum"
                                  placeholder="Building No."
                                  style={{
                                    marginTop: "10px",
                                  }}
                                  // value={initialValues.buildingnum}
                                />
                                <CustomInputField
                                  type="text"
                                  name="flatnum"
                                  placeholder="Flat No/Unit"
                                  style={{
                                    marginTop: "10px",
                                  }}
                                  // value={initialValues.flatnum}
                                />
                              </Col>
                              <Col md={3} xs={12}>
                                <CustomInputField
                                  type="number"
                                  FieldValue={setFieldValue}
                                  name={`items[${index}].cost`}
                                  InputWidth="100%"
                                  onChange={(e) => handleNum2Change(index, e)}
                                  // value={invoiceDetails.base_value}
                                />
                              </Col>

                              <Col md={2} xs={12}>
                                <CustomInputField
                                  type="number"
                                  FieldValue={setFieldValue}
                                  name={`items[${index}].quantity`}
                                  InputWidth="100%"
                                  onChange={(e) => handleNum1Change(index, e)}
                                  // value={invoiceDetails.brok}
                                />
                              </Col>

                              <Col md={3} xs={12}>
                                <CustomInputField
                                  type="number"
                                  name={`items[${index}].total`}
                                  value={calculateTotal(listItems)}
                                  InputWidth="100%"
                                  disabled
                                />
                              </Col>
                              {/* <Col
                                  md={1}
                                  xs={12}
                                  className="addvoice-close-buttton"
                                >
                                  <Button
                                    onClick={() => handleDeleteItem(index)}
                                    variant="danger"
                                  >
                                    X
                                  </Button>
                                </Col> */}
                            </Row>
                          </div>
                        </div>
                      ))}
                    </Row>

                    {/* </div> */}
                    {/* <Col md={6} xs={12}></Col> */}
                    <Row className="border-top" style={{ padding: "1.5rem" }}>
                      <Col md={6} xs={6} style={{ margin: "1.5rem 0rem" }}>
                        <CustomSubTitle SubTitle="BANK ACCOUNT DETAIL :" />
                        <br />
                        <CustomSelectField
                          name="bank_name"
                          FieldValue={setFieldValue}
                          placeholder="Bank Name"
                          options={CreateLabelValueArray(
                            allBankName?.data?.data,
                            "bank_name"
                          )}
                          isLabelValue={true}
                          required
                          value={values}
                        />
                        {values.bank_name && (
                          <div>
                            {allBankName?.data?.data.map((resident) => {
                              if (resident.bank_name === values.bank_name) {
                                return (
                                  <React.Fragment key={resident.bank_id}>
                                    <div className="m-auto">
                                      <div
                                        style={{
                                          display: "flex",
                                          paddingTop: "10px",
                                        }}
                                      >
                                        <CustomDescription
                                          style={{
                                            marginBottom: "4px",
                                            fontSize: "1rem",
                                            width: "38%",
                                          }}
                                          Description="Bank Name:"
                                        />
                                        <CustomDescription
                                          style={{
                                            marginBottom: "4px",
                                            fontSize: "1rem",
                                          }}
                                          Description={resident.bank_name}
                                        />
                                      </div>
                                      <div style={{ display: "flex" }}>
                                        <CustomDescription
                                          style={{
                                            marginBottom: "4px",
                                            fontSize: "1rem",
                                            width: "38%",
                                          }}
                                          Description="Account No:"
                                        />
                                        <CustomDescription
                                          style={{
                                            marginBottom: "4px",
                                            fontSize: "1rem",
                                          }}
                                          Description={resident.acc_num}
                                        />
                                      </div>
                                      <div style={{ display: "flex" }}>
                                        <CustomDescription
                                          style={{
                                            marginBottom: "4px",
                                            fontSize: "1rem",
                                            width: "38%",
                                          }}
                                          Description="Branch:"
                                        />
                                        <CustomDescription
                                          style={{
                                            marginBottom: "4px",
                                            fontSize: "1rem",
                                          }}
                                          Description={resident.branch_name}
                                        />
                                      </div>
                                      <div style={{ display: "flex" }}>
                                        <CustomDescription
                                          style={{
                                            marginBottom: "4px",
                                            fontSize: "1rem",
                                            width: "38%",
                                          }}
                                          Description="IFSC Code:"
                                        />
                                        <CustomDescription
                                          style={{
                                            marginBottom: "4px",
                                            fontSize: "1rem",
                                          }}
                                          Description={resident.ifsc_code}
                                        />
                                      </div>
                                      <div style={{ display: "flex" }}>
                                        <CustomDescription
                                          style={{
                                            marginBottom: "4px",
                                            fontSize: "1rem",
                                            width: "38%",
                                          }}
                                          Description="PAN Number:"
                                        />
                                        <CustomDescription
                                          style={{
                                            marginBottom: "4px",
                                            fontSize: "1rem",
                                          }}
                                          Description={resident.pan_num}
                                        />
                                      </div>
                                      <div style={{ display: "flex" }}>
                                        <CustomDescription
                                          style={{
                                            marginBottom: "4px",
                                            fontSize: "1rem",
                                            width: "38%",
                                          }}
                                          Description="GST Number:"
                                        />
                                        <CustomDescription
                                          style={{
                                            marginBottom: "4px",
                                            fontSize: "1rem",
                                          }}
                                          Description={resident.gst_code}
                                        />
                                      </div>
                                    </div>
                                  </React.Fragment>
                                );
                              }
                              return null;
                            })}
                          </div>
                        )}
                      </Col>
                      <Col md={6} xs={12}>
                        <div className="mb-3">
                          <table className="w-100">
                            <tbody>
                              <tr>
                                <td className="addnvoice-salesperson-Total">
                                  Total Before tax:
                                </td>
                                <td className="text-end">
                                  <h6>
                                    {totalBeforeTax != "NaN"
                                      ? totalBeforeTax
                                      : "000.00"}
                                  </h6>
                                </td>
                              </tr>
                              <tr>
                                <td className="addnvoice-salesperson-Total">
                                  SGST :
                                </td>
                                <td className="text-end">
                                  <h6>9%</h6>
                                </td>
                              </tr>
                              <tr>
                                <td className="addnvoice-salesperson-Total">
                                  CGST :
                                </td>
                                <td className="text-end">
                                  <h6>9%</h6>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                          <hr />
                          <table className="w-100">
                            <tbody>
                              <tr>
                                <td className="addnvoice-salesperson-Total">
                                  TOTAL WITH TAX :
                                </td>
                                <td className="text-end">
                                  <h6>
                                    {totalBeforeTax != "NaN"
                                      ? totalAmountWithTax
                                      : "000.00"}
                                  </h6>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </Col>
                    </Row>
                    <Row style={{ textAlign: "center" }}>
                      <p className="number-in-word m-0">
                        <b>
                          Number in Words : {numberToWords(totalAmountWithTax)}
                        </b>
                      </p>
                    </Row>
                    <Col style={{ padding: "15px 0px" }}>
                      <div className="border-top pt-3">
                        <span className="addnvoice-note pb-3">Note: </span>
                        <div className="addnvoice-description">
                          <CustomTextareaField
                            name="note"
                            placeholder="Enter A Note"
                            value={initialValues.note}
                          />
                        </div>
                      </div>
                    </Col>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={3} lg={3} sm={12}>
                <div className="addinvoice-btn-group">
                  {/* <Button variant="contained">Send Invoice</Button> */}
                  {/* <Button variant="outlined">Preview</Button> */}
                  <Button variant="contained" type="submit" loading={isLoading}>
                    Save
                  </Button>
                </div>
                <div className="addnvoice-bankaccount">
                  <CustomSelectField
                    name="payment_status"
                    FieldValue={setFieldValue}
                    isLabelValue={true}
                    placeholder="Mark As"
                    options={bankaccount}
                    value={values}
                    initialValue={{
                      label: initialValues.payment_status,
                      value: initialValues.payment_status,
                    }}
                  />
                  {values.payment_status === "Partially Paid" ? (
                    <>
                      <CustomInputField
                        type="number"
                        FieldValue={setFieldValue}
                        name="partially_amount"
                        InputWidth="100%"
                      />
                      <CustomDescription
                        style={{ fontSize: "10px", paddingTop: "10px" }}
                        Description="Must less than the invoice total amount and not be 0"
                      />
                    </>
                  ) : null}
                </div>
              </Col>
            </Row>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default EditInvoice;