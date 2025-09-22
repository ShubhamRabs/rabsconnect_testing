import React, { useState } from 'react'
import { useMui, useSetting } from '../../hooks/Hooks'
import CryptoJS from "crypto-js";
import { GetPayslipById, useGetPlayslipById } from '../../hooks/PaySlip/UsePaySlip';
import { useQuery } from 'react-query';
import Logo from "../../assets/Image/logo.png";
import { daysInMonth } from '../../data/Columns/Payslip/PayslipColumns';
import "../PaySlip/Payslip.css"


const PayslipDetail = ({ dispatch }) => {
    const { Button, Card } = useMui()
    const { globalData } = useSetting();
    const [details, setDetails] = useState([])
    let CryptoJSKey = globalData.CompanyName + "@" + globalData.Version;
    const data = JSON.parse(CryptoJS.AES.decrypt(localStorage.getItem("updateglobal_userdata"), CryptoJSKey).toString(CryptoJS.enc.Utf8))
    
    // const payslip = useGetPlayslipById()
    React.useEffect(() => {
        // payslip.mutate(data.ps_id)
    }, [])

    const fetchDetails = useQuery("payslip", () => GetPayslipById(data.ps_id), {
        onSuccess: (data) => {
            setDetails(data.data.data[0]);
        }
    })

    console.log(details);
    const days = daysInMonth(Number(new Date(Date.parse(details.sal_month + " 1, 2012")).getMonth() + 1), Number(details.sal_year));

    return (
        <div className=''>
            {/* {JSON.stringify(details)} */}
            <Button variant="contained" className="m-2" onClick={() => dispatch({ event: "payslip" })}>
                Back
            </Button>
            {/* <Card className="mainCard"> */}
            <div>
                {
                    !fetchDetails.isLoading ?
                        <div className='w-100  border border-black payslip p-0' id='payslip'>
                            <div className='d-flex align-items-center justify-content-between'>
                                <div className='payslip-img w-50'>
                                    <div className='w-50'>
                                        <img src={Logo} className='' alt="" />
                                    </div>
                                </div>
                                <h2 className='m-3 w-50 payslip-heading'>RABS Net Solutions Pvt. Ltd.</h2>
                            </div>
                            <div className='row m-auto '>
                                <div className='col p-0'>
                                    <p><span style={{ fontWeight: 600 }}>Join Date : </span>{details.join_date}</p>
                                    <p><span style={{ fontWeight: 600 }}>Employee No : </span>{details.u_id}</p>
                                    <p><span style={{ fontWeight: 600 }}>Name : </span>{details.emp_name}</p>
                                    <p><span style={{ fontWeight: 600 }}>Location : </span>{details.location}</p>
                                </div>
                                <div className='col'>
                                    <p><span style={{ fontWeight: 600 }}>Department : </span>{details.department}</p>
                                    <p><span style={{ fontWeight: 600 }}>Designation : </span>{details.designation}</p>
                                    <p><span style={{ fontWeight: 600 }}>PF No : </span>{details.pf_no}</p>
                                </div>
                                <div className='col p-0 d-flex justify-content-end'>
                                    <div style={{ width: "max-content" }}>
                                        <p><span style={{ fontWeight: 600 }}>Pay Slip for : </span>{details.sal_month} - {details.sal_year}</p>
                                        <p><span style={{ fontWeight: 600 }}>Bank Name : </span>{details.bank_name}</p>
                                        <p><span style={{ fontWeight: 600 }}>Bank A/C no : </span>{details.ac_no}</p>
                                        <p><span style={{ fontWeight: 600 }}>PAN No : </span>{details.pan_no}</p>
                                    </div>
                                </div>
                            </div>
                            <div className='d-flex border-top border-black'>
                                <div className='w-50 border-black px-2' style={{ borderRight: "1px solid", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                    <div className='w-100 h-50' style={{ fontWeight: 600, display: "flex", justifyContent: "space-between" }}>
                                        <p className='  m-0' style={{ display: 'flex', justifyContent: "center", alignItems: "center" }}>Payments</p>
                                        <p className='  m-0' style={{ display: 'flex', justifyContent: "center", alignItems: "center" }}>Amount (Rs)</p>
                                    </div>
                                </div>
                                <div className='w-50 border-black px-2' style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                    <div className='w-100 h-50' style={{ fontWeight: 600, display: "flex", justifyContent: "space-between" }}>
                                        <p className='  m-0' style={{ display: 'flex', justifyContent: "center", alignItems: "center" }}>Deductions</p>
                                        <p className='  m-0' style={{ display: 'flex', justifyContent: "center", alignItems: "center" }}>Amount (Rs)</p>
                                    </div>
                                </div>
                            </div>
                            <div className='d-flex border-top border-black'>
                                <div className='w-50 border-black ' style={{ borderRight: "1px solid" }}>
                                    <div className=' d-flex justify-content-between'>
                                        <p className='m-0' style={{ fontWeight: 600 }}>Basic Salary</p>
                                        <p className='m-0'>{details.basic_pay}</p>
                                    </div>
                                    <div className=' d-flex justify-content-between'>
                                        <p className='m-0' style={{ fontWeight: 600 }}>H.R.A</p>
                                        <p className='m-0'>{details.hra}</p>
                                    </div> <div className=' d-flex justify-content-between'>
                                        <p className='m-0' style={{ fontWeight: 600 }}>Medical Allowance</p>
                                        <p className='m-0'>{details.medical_allowance}</p>
                                    </div>
                                    <div className=' d-flex justify-content-between'>
                                        <p className='m-0' style={{ fontWeight: 600 }}>Travel Allowance</p>
                                        <p className='m-0'>{details.travel_allowance}</p>
                                    </div>
                                    <div className=' d-flex justify-content-between'>
                                        <p className='m-0' style={{ fontWeight: 600 }}>Special Allowance</p>
                                        <p className='m-0'>{details.special_allowance}</p>
                                    </div>
                                    <div className=' d-flex justify-content-between'>
                                        <p className='m-0' style={{ fontWeight: 600 }}>Incentive</p>
                                        <p className='m-0'>{details.incentive}</p>
                                    </div>
                                </div>
                                <div className='w-50' style={{ borderLeft: 10, borderColor: "black" }}>
                                    <div className=' d-flex justify-content-between'>
                                        <p className='m-0' style={{ fontWeight: 600 }}>TDS</p>
                                        <p className='m-0'>{details.tds}</p>
                                    </div>
                                    <div className=' d-flex justify-content-between'>
                                        <p className='m-0' style={{ fontWeight: 600 }}>Professional Tax</p>
                                        <p className='m-0'>{details.profession_tax}</p>
                                    </div>
                                    <div className=' d-flex justify-content-between'>
                                        <p className='m-0' style={{ fontWeight: 600 }}>Provident Fund</p>
                                        <p className='m-0'>{details.pf_amount}</p>
                                    </div>

                                </div>
                            </div>
                            <div className='d-flex border-top border-black'>
                                <div className='w-50 border-black  ' style={{ borderRight: "1px solid" }}>
                                    <div className=' d-flex justify-content-between'>
                                        <p className='m-0' style={{ fontWeight: 600 }}>Gross Earnings</p>
                                        <p className='m-0'>{details.gross_earnings}</p>
                                    </div>
                                </div>
                                <div className='w-50 ' style={{ borderLeft: 10, borderColor: "black" }}>
                                    <div className=' d-flex justify-content-between'>
                                        <p className='m-0' style={{ fontWeight: 600 }}>Total Deduction</p>
                                        <p className='m-0'>{details.total_deductions}</p>
                                    </div>
                                </div>
                            </div>
                            <div className='d-flex border-top border-black'>
                                <div className='w-50 border-black' style={{ borderRight: "1px solid" }}>

                                </div>
                                <div className='w-50' style={{ borderLeft: 10, borderColor: "black" }}>
                                    <div className=' d-flex justify-content-between'>
                                        <p className='m-0' style={{ fontWeight: 600 }}>Net Payment</p>
                                        <p className='m-0'>{details.net_pay_amount}</p>
                                    </div>
                                </div>
                            </div>
                            <div className='d-flex border-top border-black'>
                                <div className='w-50 border-black' style={{ borderRight: "1px solid" }}>

                                </div>
                                <div className='w-50' style={{ borderLeft: 10, borderColor: "black" }}>
                                    <div className=' d-flex justify-content-between'>
                                        <p className='m-0' style={{ fontWeight: 600 }}>Net Payment(in words)</p>
                                        <p className='m-0'>{details.net_pay_words}</p>
                                    </div>
                                </div>
                            </div>


                            <div className='d-flex border-top border-black m-0 p-0'>
                                <div className='w-50 border-black m-0 p-0 row' style={{ borderRight: "1px solid" }}>

                                    <div className='border-black col px-0' style={{ borderRight: "1px solid", fontWeight: 600 }}>
                                        <p className='m-0'>Attend/Absent</p>
                                        <p className='border-top border-black px-2 m-0'>Attendence</p>
                                    </div>
                                    <div className='border-black col px-0' style={{ borderRight: "1px solid", fontWeight: 600 }}>
                                        <p className='m-0'>Days in Month</p>
                                        <p className='border-top border-black px-2 m-0'>{days}</p>
                                    </div>
                                    <div className='border-black col px-0' style={{ borderRight: "1px solid", fontWeight: 600 }}>
                                        <p className='m-0'>Days Paid</p>
                                        <p className='border-top border-black px-2'></p>
                                    </div>
                                    <div className='border-black col px-0'></div>
                                </div>
                                <div className='w-50' style={{ borderLeft: 10, borderColor: "black" }}>

                                </div>
                            </div>
                           
                        </div> : <p>Loading</p>
                }
            {/* </Card> */}
            </div>
            
        </div>
    )
}

export default PayslipDetail
