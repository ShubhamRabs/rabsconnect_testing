import React, { useState, useMemo } from "react";
import { useMui, useSetting } from "../../hooks/Hooks";
import { Card, CardContent, Typography, Grid } from "@mui/material";
import CryptoJS from "crypto-js";
import {
  GetPayslipById,
  useGetPlayslipById,
} from "../../hooks/PaySlip/UsePaySlip";
import { useQuery } from "react-query";
import Logo from "../../assets/Image/logo.png";
import "../PaySlip/Payslip.css";
import { format } from "date-fns";

const PayslipDetail = ({ dispatch }) => {
  const { Button } = useMui();
  const { globalData } = useSetting();
  const [details, setDetails] = useState([]);
  let CryptoJSKey = globalData.CompanyName + "@" + globalData.Version;

  // Decrypt user data and extract payslip ID
  const data = useMemo(() => {
    const decryptedData = CryptoJS.AES.decrypt(
      localStorage.getItem("updateglobal_userdata"),
      CryptoJSKey
    ).toString(CryptoJS.enc.Utf8);
    return JSON.parse(decryptedData);
  }, [CryptoJSKey]);

  // Fetch Payslip Details
  const fetchDetails = useQuery("payslip", () => GetPayslipById(data.ps_id), {
    onSuccess: (fetchedData) => {
      setDetails(fetchedData.data.data[0]);
    },
  });

  console.log(fetchDetails, "fetchDetails");

  // Memoize the details so the component re-renders when data changes
  const memoizedDetails = useMemo(() => details, [details]);

  console.log(memoizedDetails, "memoizedDetails");

  // Print the payslip
  const handlePrint = () => {
    const content = document.getElementById("payslip").innerHTML;
    const printWindow = window.open("", "_blank", "height=600,width=800");

    printWindow.document.open();
    printWindow.document.write("<html><head><title>Payslip</title>");

    // Add inline CSS from the current document
    const styleSheets = Array.from(document.styleSheets)
      .map((styleSheet) => {
        try {
          return styleSheet.cssRules
            ? Array.from(styleSheet.cssRules)
                .map((rule) => rule.cssText)
                .join("")
            : "";
        } catch (e) {
          return ""; // Some cross-origin stylesheets might cause issues
        }
      })
      .join("");

    // Inject the extracted styles and add custom print styles
    printWindow.document.write(`
      <style>
        ${styleSheets}
        body {
          font-size: 12px; /* Adjust this value for the desired print font size */
        }
        h5 {
          font-size: 14px; /* Adjust header sizes if necessary */
        }
        p, span, div {
          font-size: 12px; /* Ensure all text is smaller */
        }
      </style>
    `);
    printWindow.document.write("</head><body>");
    printWindow.document.write(`<div>${content}</div>`);
    printWindow.document.write("</body></html>");
    printWindow.document.close();

    // Trigger the print after a short delay
    setTimeout(() => {
      printWindow.print();
      printWindow.onafterprint = () => {
        printWindow.close(); // Close the window after printing
      };
    }, 500);
  };

  const getPayslipMonth = () => {
    if (!memoizedDetails.sal_frm_date || !memoizedDetails.sal_to_date) {
      return "";
    }

    const fromDate = new Date(memoizedDetails.sal_frm_date);
    const toDate = new Date(memoizedDetails.sal_to_date);

    const fromMonth = format(fromDate, "MMMM");
    const toMonth = format(toDate, "MMMM");

    if (fromMonth === toMonth) {
      return fromMonth;
    } else {
      return `${fromMonth} - ${toMonth}`;
    }
  };

  return (
    <div>
      {/* Back and Print Buttons */}
      <div className="d-flex justify-content-between">
        <Button
          variant="contained"
          className="m-2"
          onClick={() => dispatch({ event: "payslip" })}
        >
          Back
        </Button>
        <Button variant="contained" className="m-2" onClick={handlePrint}>
          Print
        </Button>
      </div>

      <div className="bg-white p-1 rounded">
        {/* Conditional Loading */}
        {!fetchDetails.isLoading ? (
          <>
            {/* Payslip Container */}
            <div
              className="payslip-container w-100 border border-dark rounded p-3 "
              id="payslip"
            >
              {/* Company Logo and Name */}
              <div className="d-flex align-items-center justify-content-between">
                <div className="payslip-img">
                  <img
                    src={Logo}
                    alt="Company Logo"
                    className="img-fluid"
                    style={{ width: "30%" }}
                  />
                  <h5 className="">RABS Net Solutions Pvt. Ltd.</h5>
                </div>
                <div style={{}}>
                  <p style={{ fontSize: "17px", marginRight: "10px" }}>
                    Pay Slip for: <strong>{getPayslipMonth()}</strong>
                  </p>
                </div>
              </div>

              {/* Employee Details */}

              {/* Payments and Deductions */}
              <div className="d-flex border-top border-dark mb-5">
                <div className="w-50  px-3  mt-5">
                  <p
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <strong style={{ color: "gray", fontSize: "15px" }}>
                      EMPLOYEE SUMMARY{" "}
                    </strong>{" "}
                  </p>
                  <div class="details">
                    <div class="details-row">
                      <div class="details-label">Employee Name :</div>
                      <div class="details-value">
                        {memoizedDetails.emp_name}
                      </div>
                    </div>
                    <div class="details-row">
                      <div class="details-label">Employee ID :</div>
                      <div class="details-value">{memoizedDetails.u_id}</div>
                    </div>
                    <div class="details-row">
                      <div class="details-label">Pay Period :</div>
                      <div class="details-value">{getPayslipMonth()}</div>
                    </div>
                    <div class="details-row">
                      <div class="details-label">Pay Date :</div>
                      <div class="details-value">
                        {memoizedDetails.join_date}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="w-50 px-3 mt-5">
                  <Card
                    style={{
                      backgroundColor: "#e6f4e9",
                      borderRadius: "10px",
                      padding: "7px",
                      maxWidth: "600px",
                      //margin: "20px auto",
                    }}
                    elevation={3}
                  >
                    <CardContent>
                      <Typography
                        variant="h5"
                        style={{
                          fontWeight: "bold",
                          fontSize: "24px",
                          color: "#333",
                        }}
                      >
                        ₹{memoizedDetails.net_pay_amount}
                      </Typography>
                      <Typography
                        variant="subtitle1"
                        style={{ color: "#666", marginTop: "10px" }}
                      >
                        Employee Net Pay
                      </Typography>
                      <div
                        style={{
                          borderBottom: "1px dotted #333",
                          margin: "10px 0",
                        }}
                      />
                      <Grid container spacing={1} style={{ marginTop: "20px" }}>
                        <Grid item xs={6}>
                          <Typography variant="body2" style={{ color: "#333" }}>
                            Paid Days:
                          </Typography>
                        </Grid>
                        <Grid item xs={6} style={{ textAlign: "right" }}>
                          <Typography variant="body2" style={{ color: "#333" }}>
                            {memoizedDetails.worked_days}
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="body2" style={{ color: "#333" }}>
                            LOP Days:
                          </Typography>
                        </Grid>
                        <Grid item xs={6} style={{ textAlign: "right" }}>
                          <Typography variant="body2" style={{ color: "#333" }}>
                            {memoizedDetails.absent_days}
                          </Typography>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Earnings Summary */}
              <div
                style={{
                  borderRadius: "10px",
                  border: "1px solid gray",
                  padding: "10px",
                }}
              >
                <div className="d-flex ">
                  <div className="w-50  p-2">
                    <p
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <strong>EARNINGS</strong> <strong>AMOUNT</strong>
                    </p>
                    <div
                      style={{
                        borderBottom: "1px dotted gray",
                        margin: "10px 0",
                      }}
                    />
                    <p
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <span>Basic Salary</span>{" "}
                      <strong> ₹{memoizedDetails.basic_salary || 0}</strong>
                    </p>
                    <p
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <span>House Rent Allowance</span>{" "}
                      <strong> ₹{memoizedDetails.hra || 0}</strong>
                    </p>
                    <p
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <span>Travel Allowance</span>{" "}
                      <strong> ₹{memoizedDetails.travel_allowance || 0}</strong>
                    </p>
                    <p
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <span>Special Allowance</span>{" "}
                      <strong>
                        {" "}
                        ₹{memoizedDetails.special_allowance || 0}
                      </strong>
                    </p>
                    <p
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <span> Medical Allowance</span>{" "}
                      <strong>
                        {" "}
                        ₹{memoizedDetails.medical_allowance || 0}
                      </strong>
                    </p>
                    <p
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <span>Incentive</span>{" "}
                      <strong> ₹{memoizedDetails.incentive || 0}</strong>
                    </p>
                  </div>

                  <div className="w-50  p-2">
                    <p
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <strong>DEDUCTIONS</strong> <strong>AMOUNT</strong>
                    </p>
                    <div
                      style={{
                        borderBottom: "1px dotted gray",
                        margin: "10px 0",
                      }}
                    />
                    <p
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <span>LOP Amount</span>{" "}
                      <strong> ₹{memoizedDetails.loss_of_pay || 0}</strong>
                    </p>
                    <p
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <span>Professional Tax</span>{" "}
                      <strong> ₹{memoizedDetails.profession_tax || 0}</strong>
                    </p>
                    <p
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <span>Provident Fund</span>{" "}
                      <strong> ₹{memoizedDetails.pf_amount || 0}</strong>
                    </p>

                    <p
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <span>TDS</span>{" "}
                      <strong> ₹{memoizedDetails.tds || 0}</strong>
                    </p>
                    <p
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <span>Other Deductions</span>{" "}
                      <strong> ₹{memoizedDetails.other_deduction || 0}</strong>
                    </p>
                  </div>
                </div>
                <div className="d-flex ">
                  <div className="w-50  p-2">
                    <p
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <strong>Gross Earnings</strong>{" "}
                      <strong> ₹{memoizedDetails.gross_earnings}</strong>
                    </p>
                  </div>
                  <div className="w-50  p-2">
                    <p
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <strong>Total Deductions</strong>{" "}
                      <strong> ₹{memoizedDetails.total_deductions}</strong>
                    </p>
                  </div>
                </div>
              </div>
              <div
                className="mt-3"
                style={{
                  borderRadius: "10px",
                  border: "1px solid gray",
                  padding: "10px",
                }}
              >
                <div className="d-flex flex-column mt-3">
                  <div className="d-flex justify-content-between p-2">
                    <span>
                      <strong style={{ marginRight: "1rem" }}>
                        Worked Days:
                      </strong>{" "}
                      {memoizedDetails.worked_days}
                    </span>
                    <span>
                      <strong style={{ marginRight: "1rem" }}>
                        Paid Leave:
                      </strong>{" "}
                      {memoizedDetails.paid_leave}
                    </span>
                  </div>
                  <div className="d-flex justify-content-between p-2">
                    <span>
                      <strong style={{ marginRight: "1rem" }}>
                        Absent Days:
                      </strong>{" "}
                      {memoizedDetails.absent_days}
                    </span>
                    <span>
                      <strong style={{ marginRight: "1rem" }}>
                        Medical Leave:
                      </strong>{" "}
                      {memoizedDetails.med_leave}
                    </span>
                  </div>
                </div>
              </div>

              <div
                className="mt-3 "
                style={{
                  borderRadius: "10px",
                  border: "1px solid gray",
                  padding: "10px",
                }}
              >
                <div className="d-flex align-items-center ">
                  <div className="w-50  p-2">
                    <strong>TOTAL NET PAYABLE</strong>
                    <p>Gross Earnings - Total Deductions</p>
                  </div>
                  <div className="w-50  p-2 justify-content-end text-end">
                    <strong>₹{memoizedDetails.net_pay_amount}</strong>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  );
};

export default PayslipDetail;
