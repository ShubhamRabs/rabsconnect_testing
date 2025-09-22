import React from "react";
import Breadcrumb from "../../components/Breadcrumb/Breadcrumb";
import { useBootstrap, useMui, useSetting } from "../../hooks/Hooks";
import {
  CustomDescription,
  CustomHeading,
  CustomSubTitle,
} from "../../components/Common/Common";
import CryptoJS from "crypto-js";
import { GetAllCRMDetails } from "../../hooks/Other/UseCRMDetailsHook";
import {
  GetAllBookingDone,
  GetAllBankName,
} from "../../hooks/Invoice/UseInvoiceHook";
import { numberToWords } from "./../../hooks/Function";
import { useQuery } from "react-query";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import "../../assets/css/AddInvoice.css";
import { textFieldClasses } from "@mui/material";

const ViewInvoice = ({ dispatch }) => {
  const { Button, ArrowBackIosIcon } = useMui();
  const { Card, Row, Col } = useBootstrap();

  const [loading, setLoading] = React.useState(false);
  const [totalBeforeTax, setTotalBeforeTax] = React.useState("");
  const [totalAmountWithTax, setTotalAmountWithTax] = React.useState("");

  const { globalData } = useSetting();

  // Retrieve encryption key from global data
  let CryptoJSKey = globalData.CompanyName + "@" + globalData.Version;

  // Decrypt user data stored in localStorage
  const bytes = CryptoJS.AES.decrypt(
    localStorage.getItem("updateglobal_userdata"),
    CryptoJSKey
  );

  // Convert decrypted data to a string
  var user_data = bytes.toString(CryptoJS.enc.Utf8);

  // Parse the user data as JSON
  const InvoiceDetails = JSON.parse(user_data);

  const CompanyAdress = useQuery("CompanyAdress", GetAllCRMDetails, {
    onSuccess: (data) => {
      console.log(data.data[0].admin);
    },
  });

  const allBookingDone = useQuery("AllBookingDone", () => {
    return GetAllBookingDone(["lname, l_id"]);
  });

  const allBankName = useQuery("AllBankName", () => {
    return GetAllBankName(["bank_name, bank_id"]);
  });

  // const handleAction = (action) => {
  //   setLoading(true);

  //   const content = document.getElementById("divToPrint");

  //   html2canvas(content)
  //     .then((canvas) => {
  //       const imgData = canvas.toDataURL("image/png");
  //       const pdf = new jsPDF("p", "mm", "a4");
  //       const imgWidth = pdf.internal.pageSize.getWidth();
  //       const imgHeight = (canvas.height * imgWidth) / canvas.width;

  //       pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);

  //       if (action === "print") {
  //         const pdfBlob = pdf.output("blob");
  //         const pdfUrl = URL.createObjectURL(pdfBlob);
  //         window.open(pdfUrl);
  //       } else if (action === "download") {
  //         pdf.save("invoice.pdf");
  //       }

  //       setLoading(false);
  //     })
  //     .catch((error) => {
  //       console.error("Error generating PDF:", error);
  //       setLoading(false);
  //     });
  // };
  const handleAction = async (action) => {
    // setLoading(true);
    try {

      const content_table1 = document.getElementById("divToPrint");
      const table1 = await html2canvas(content_table1)
      const imgData = table1.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = pdf.internal.pageSize.getWidth();
      const imgHeight = (table1.height * imgWidth) / table1.width;
      let heightLeft = imgHeight;
      const pageHeight = 295;
      let position = 10; // give some top padding to first page
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
      while (heightLeft >= 0) {
        position += heightLeft - imgHeight; // top padding for other pages
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      if (action === "print") {
        const pdfBlob = pdf.output("blob");
        const pdfUrl = URL.createObjectURL(pdfBlob);
        window.open(pdfUrl);
      } else if (action === "download") {
        pdf.save("Invoice.pdf");
      }
    } catch (error) {
      console.log(error);
    }

  };

  // dispatching
  const handlePriviewInvoice = () => {
    dispatch({ event: "addinvoice" });
  };

  const calculateTotal = () => {
    const baseValue = parseFloat(InvoiceDetails.base_value);
    const brokeragePercentage = parseFloat(InvoiceDetails.brok) / 100;
    const brokerageAmount = baseValue * brokeragePercentage;
    const totalBeforeTax = baseValue + brokerageAmount;

    const sgst = totalBeforeTax * 0.09; // Calculating SGST (9%)
    const cgst = totalBeforeTax * 0.09; // Calculating CGST (9%)
    const totalAmount = totalBeforeTax + sgst + cgst; // Adding SGST and CGST to the total before tax

    return {
      totalBeforeTax: totalBeforeTax.toFixed(2),
      totalAmountWithTax: totalAmount.toFixed(2),
    };
  };

  React.useEffect(() => {
    const { totalBeforeTax, totalAmountWithTax } = calculateTotal();
    setTotalBeforeTax(totalBeforeTax);
    setTotalAmountWithTax(totalAmountWithTax);
  }, [InvoiceDetails.base_value, InvoiceDetails.brok]);

  const item = [
    { title: "Booking Details", md: 3 },
    { title: "Base Value", md: 3 },
    { title: "Brok.(%)", md: 2 },
    { title: "Total ", md: 4 },
  ];

  return (
    <>
      <Breadcrumb
        PageName="View Invoice"
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
      <Row>
        <Col md={9} lg={9} sm={12}>
          <Card className="add-invoice-card">
            <div id="divToPrint">
              <Card.Body>
                <Row className="m-sm-2 m-0">
                  <Col md={6} lg={6} sm={6}>
                    <img
                      src="./logo.png"
                      // className="w-50 mb-3"
                      alt="Logo"
                      style={{ width: "40%" }}
                    />
                    {/* <CustomHeading
                      style={{ fontSize: "18px", paddingLeft: "10px" }}
                      Heading={CompanyAdress.data?.data[0].company_name}
                    /> */}
                  </Col>
                  {/* <Col
                    md={3}
                    lg={3}
                    sm={3}
                    className="view-invoice-company-name"
                  >
                    <span
                      style={{
                        fontSize: "25px",
                      }}
                    >
                      {CompanyAdress.data?.data[0].company_name}
                    </span>
                  </Col> */}
                  <Col md={6} lg={6} sm={6} className="add-invoice-billto">
                    {/* <p>{CompanyAdress.data?.data[0].company_name}</p> */}
                    <div className="d-flex">
                      <CustomHeading Heading="RERA Number :" />
                      <CustomDescription
                        style={{
                          // fontSize: "16px",
                          // alignItems: "inherit",
                          marginLeft: "10px",
                        }}
                        Description={InvoiceDetails.supplier_companyreranum}
                      />
                    </div>
                  </Col>
                </Row>
                <Row
                  className="border-top"
                  style={{ textAlign: "center", padding: "10px" }}
                >
                  {/* <CustomHeading Heading="INVOICE" /> */}
                  <h4 className="view-invoice-heading">INVOICE</h4>
                  <Col md={6} lg={6} sm={6}></Col>
                  <Col md={6} lg={6} sm={6} className="add-invoice-billto">
                    <div className="d-flex">
                      <CustomHeading Heading="Invoice :" />
                      <CustomDescription
                        style={{
                          fontSize: "16px",
                          alignItems: "inherit",
                          marginLeft: "52px",
                        }}
                        Description={"# " + InvoiceDetails.inv_id}
                      />
                    </div>
                    <div className="d-flex">
                      <CustomHeading Heading="Date Issued :" />
                      <CustomDescription
                        style={{
                          fontSize: "16px",
                          alignItems: "inherit",
                          marginLeft: "15px",
                        }}
                        Description={InvoiceDetails.create_dt}
                      />
                    </div>
                    <div className="d-flex">
                      <CustomHeading Heading="Due Date :" />
                      <CustomDescription
                        style={{
                          fontSize: "16px",
                          alignItems: "inherit",
                          marginLeft: "37px",
                        }}
                        Description={InvoiceDetails.due_date}
                      />
                    </div>
                  </Col>
                </Row>
                <Row style={{ padding: "0.5rem" }}>
                  <Col md={6} lg={6} sm={6}>
                    <CustomHeading
                      Heading="Bill To :"
                      style={{ margin: "1.5rem 0rem" }}
                    />
                    <Row style={{ marginTop: "5px" }}>
                      <Col md={6} lg={6} sm={6}>
                        <CustomHeading Heading="Company Name :" />
                      </Col>
                      <Col md={6} lg={6} sm={6}>
                        {InvoiceDetails.billto_companyname}
                      </Col>
                    </Row>
                    <Row style={{ marginTop: "5px" }}>
                      <Col md={6} lg={6} sm={6}>
                        <CustomHeading Heading="Address :" />
                      </Col>
                      <Col md={6} lg={6} sm={6}>
                        {InvoiceDetails.billto_companyaddress}
                      </Col>
                    </Row>
                    <Row style={{ marginTop: "5px" }}>
                      <Col md={6} lg={6} sm={6}>
                        <CustomHeading Heading="PAN Number :" />
                      </Col>
                      <Col md={6} lg={6} sm={6}>
                        {InvoiceDetails.billto_companypan}
                      </Col>
                    </Row>
                    <Row style={{ marginTop: "5px" }}>
                      <Col md={6} lg={6} sm={6}>
                        <CustomHeading Heading="GST Number :" />
                      </Col>
                      <Col md={6} lg={6} sm={6}>
                        {InvoiceDetails.billto_companygstnum}
                      </Col>
                    </Row>
                  </Col>
                  <Col md={6} lg={6} sm={6}>
                    <CustomHeading
                      Heading="Bill Form  :"
                      style={{ margin: "1.5rem 0rem" }}
                    />
                    <Row style={{ marginTop: "5px" }}>
                      <Col md={6} lg={6} sm={6}>
                        <CustomHeading Heading="CP Name :" />
                      </Col>
                      <Col md={6} lg={6} sm={6}>
                        {CompanyAdress.data?.data[0].company_name}
                      </Col>
                    </Row>
                    <Row style={{ marginTop: "5px" }}>
                      <Col md={6} lg={6} sm={6}>
                        <CustomHeading Heading="Address :" />
                      </Col>
                      <Col md={6} lg={6} sm={6}>
                        {CompanyAdress.data?.data[0].company_address}
                      </Col>
                    </Row>
                    <Row style={{ marginTop: "5px" }}>
                      <Col md={6} lg={6} sm={6}>
                        <CustomHeading Heading="PAN Number :" />
                      </Col>
                      <Col md={6} lg={6} sm={6}>
                        {InvoiceDetails.supplier_companypannum}
                      </Col>
                    </Row>
                    <Row style={{ marginTop: "5px" }}>
                      <Col md={6} lg={6} sm={6}>
                        <CustomHeading Heading="GST Number :" />
                      </Col>
                      <Col md={6} lg={6} sm={6}>
                        {InvoiceDetails.supplier_companygstnum}
                      </Col>
                    </Row>
                    <Row style={{ marginTop: "5px" }}>
                      <Col md={6} lg={6} sm={6}>
                        <CustomHeading Heading="RERA Number :" />
                      </Col>
                      <Col md={6} lg={6} sm={6}>
                        {InvoiceDetails.supplier_companyreranum}
                      </Col>
                    </Row>
                  </Col>
                </Row>
                <Row className="border-top" style={{ padding: "15px" }}>
                  {/* <div className="m-sm-3 m-0"> */}
                  <div className="addnvoice-heading">
                    <Row>
                      {item.map(({ title, md }, index) => (
                        <Col key={index} md={md} xs={12}>
                          <CustomSubTitle SubTitle={title} />
                        </Col>
                      ))}
                    </Row>
                  </div>
                  <div className="addnvoice-box">
                    <Row>
                      <Col md={3} xs={12}>
                        {/* <div className="" style={{ width: "75%" }}> */}
                        {allBookingDone?.data?.data.map((resident) => {
                          if (resident.lname === InvoiceDetails.inv_to) {
                            return (
                              <React.Fragment key={resident.l_id}>
                                <CustomDescription
                                  style={{
                                    // paddingTop: "10px",
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
                        })}
                        <p
                          style={{
                            marginBottom: "0rem",
                          }}
                        >
                          Building No. - {InvoiceDetails.buildingnum}
                        </p>
                        <p
                          style={{
                            marginBottom: "0rem",
                          }}
                        >
                          Flat No/Unit - {InvoiceDetails.flatnum}
                        </p>
                        {/* </div> */}
                      </Col>
                      <Col md={3} xs={12}>
                        {InvoiceDetails.base_value}
                      </Col>
                      <Col md={2} xs={12}>
                        {InvoiceDetails.brok}
                      </Col>
                      <Col md={3} xs={12}>
                        {totalBeforeTax}
                      </Col>
                    </Row>
                  </div>
                  {/* </div> */}
                </Row>
                <Row className="border-top" style={{ padding: "20px" }}>
                  <Col md={6} xs={6} style={{ margin: "0.5rem 0rem" }}>
                    <CustomSubTitle SubTitle="BANK ACCOUNT DETAIL :" />
                    {allBankName?.data?.data.map((resident) => {
                      if (resident.bank_name === InvoiceDetails.bank_name) {
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
                                  Description="GST Code:"
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
                  </Col>
                  <Col md={6} xs={6} style={{ margin: "0.5rem 0rem" }}>
                    <div className="mb-3">
                      <table className="w-100">
                        <tbody>
                          <tr>
                            <td className="addnvoice-salesperson-Total">
                              Total Before tax:
                            </td>
                            <td className="text-end">
                              <h6>{totalBeforeTax}</h6>
                            </td>
                          </tr>
                          <tr>
                            <td className="addnvoice-salesperson-Total">
                              Add SGST:
                            </td>
                            <td className="text-end">
                              <h6>9%</h6>
                            </td>
                          </tr>
                          <tr>
                            <td className="addnvoice-salesperson-Total">
                              Add CGST:
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
                              <h6>{totalAmountWithTax}</h6>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </Col>
                </Row>
                <Row style={{ textAlign: "center", padding: "10px" }}>
                  <p className="number-in-word m-0">
                    <b>Number in Words : {numberToWords(parseInt(totalAmountWithTax))}</b>
                  </p>
                </Row>
                {/* <Row className="border-top">
                  <Col>
                    <span className="addnvoice-note pb-3">Note: </span>
                    <div className="addnvoice-description">
                      {InvoiceDetails.description}
                    </div>
                  </Col>
                </Row> */}
                {/* <Row className="border-top" style={{ padding: "20px" }}>
                  <Col style={{ margin: "0.5rem 0rem", textAlign: "center" }}>
                    <CustomSubTitle SubTitle="Acknowledgement" />
                    <CustomDescription
                      style={{ fontSize: "14px", margin: "1rem 0rem" }}
                      Description="We have verified the above details with our records and herby confirm that above booking is done by Saturn Asset World LLP.  We also acknowledge receipt of this Invoice."
                    />
                  </Col>
                </Row>
                <Row style={{ marginBottom: "3rem", padding: "20px" }}>
                  <Col md={8} xs={8}>
                    <CustomHeading Heading="Name :" />
                    <br />
                    <CustomHeading Heading="Sign :" />
                  </Col>
                  <Col md={4} xs={4}>
                    <CustomHeading Heading="Date :" />
                    <br />
                    <CustomHeading Heading="Co Stamp :" />
                  </Col>
                </Row>
                */}
                <Row
                  className="border-top"
                  style={{ paddingTop: "20px", textAlign: "center" }}
                >
                  <Col>
                    {/* <CustomDescription Description="Note : This is a computer-generated document. No signature is required." />
                    <CustomDescription Description="Agreed to Terms and Conditions" /> */}
                    <span>
                      Note : This is a computer-generated document. No signature
                      is required.
                      <br />
                      Agreed to Terms and Conditions
                    </span>
                  </Col>
                  {/* <Col md={5} xs={5}>
                    <CustomSubTitle SubTitle="Authorized Signature : " />
                  </Col> */}
                </Row>
                <Row className="border-top">
                  <Col
                    style={{
                      fontSize: "14px",
                      margin: "0px 60px",
                      textAlign: "center",
                    }}
                  >
                    <span className="addnvoice-note pb-3">
                      {CompanyAdress.data?.data[0].company_address}
                      {/* console.log(CompanyAdress.data?.data[0].company_name); */}
                    </span>
                  </Col>
                </Row>
              </Card.Body>
            </div>
          </Card>
        </Col>
        <Col md={3} lg={3} sm={12}>
          <div className="addinvoice-btn-group">
            <Button
              variant="primary"
              // onClick={handlePrint}
              onClick={() => handleAction("print")}
              className="bg-primary"
              style={{ color: "#fff" }}
            >
              Print
            </Button>
            <Button
              variant="success"
              className="bg-success"
              style={{ color: "#fff" }}
              onClick={() => handleAction("download")}
            >
              {loading ? "Downloading..." : "Download"}
            </Button>
          </div>
        </Col>
      </Row>
    </>
  );
};

export default ViewInvoice;